import { listScenarioContracts } from './contracts/catalog.mjs';
import { searchCode } from './code-search.mjs';

export const BASELINE_PROMPT_PROFILE = 'baseline-v1';
export const LEAN_CONTRACTS_PROMPT_PROFILE = 'lean-contracts-v1';
export const BACKTEST_PROMPT_PROFILES = new Set([
  BASELINE_PROMPT_PROFILE,
  LEAN_CONTRACTS_PROMPT_PROFILE,
]);

const text = (value) => (value === undefined || value === null ? '' : String(value));

/**
 * Keep the historical prompt as an explicit baseline. The lean profile is an
 * experiment for the historical runner only; it must be selected deliberately.
 */
export function parseBacktestPromptProfile(value = BASELINE_PROMPT_PROFILE) {
  const profile = text(value).trim() || BASELINE_PROMPT_PROFILE;
  if (!BACKTEST_PROMPT_PROFILES.has(profile)) {
    throw new Error(`QA_PROMPT_PROFILE must be one of: ${[...BACKTEST_PROMPT_PROFILES].join(', ')}`);
  }
  return profile;
}

function changedPathSet(paths) {
  return new Set((Array.isArray(paths) ? paths : [])
    .map((file) => text(file).trim())
    .filter(Boolean));
}

function changedDiffByFile(productDiff) {
  const byFile = new Map();
  for (const section of text(productDiff).split(/(?=^diff --git )/m)) {
    const file = section.match(/^diff --git a\/(.+?) b\/(.+)$/m)?.[2];
    if (file) byFile.set(file, section);
  }
  return byFile;
}

function hunkChangesNeedle(section, needle) {
  return text(section).split('\n').some((line) =>
    /^[+-][^+-]/.test(line) && line.slice(1).includes(needle));
}

function rawEvidence(matches, hint, needle) {
  return (Array.isArray(matches) ? matches : []).flatMap((match) => {
    if (match?.file !== hint.file || !Number.isInteger(Number(match?.line))) return [];
    return [{
      file: match.file,
      line: Number(match.line),
      startLine: Number(match.startLine || match.line),
      endLine: Number(match.endLine || match.line),
      needle,
      snippet: text(match.snippet).slice(0, 1800),
    }];
  });
}

/**
 * This is the tool-first replacement for a broad prompt asking the model to
 * rediscover every fixture shape. A contract becomes selectable only when its
 * reviewed source hint is actually among the PR's changed files and a bounded
 * local search returns the supporting source block.
 */
export function discoverManagedContractCandidates({ repoRoot, changedPaths, productDiff, search = searchCode }) {
  if (!repoRoot) throw new Error('repoRoot is required');
  if (typeof search !== 'function') throw new Error('search is required');
  const changed = changedPathSet(changedPaths);
  const diffByFile = changedDiffByFile(productDiff);
  const searches = [];
  const candidates = [];

  for (const contract of listScenarioContracts()) {
    const evidence = [];
    const relevantDiffs = [];
    for (const hint of contract.sourceHints) {
      if (!changed.has(hint.file)) continue;
      const changedNeedles = hint.needles.filter((needle) => hunkChangesNeedle(diffByFile.get(hint.file), needle));
      // A source file can be touched by an unrelated refactor. Require a
      // reviewed hint token in an actual +/- hunk before exposing this
      // contract to the model.
      if (!changedNeedles.length) continue;
      relevantDiffs.push({ file: hint.file, diff: text(diffByFile.get(hint.file)).slice(0, 5000) });
      for (const needle of changedNeedles) {
        let result;
        try {
          result = search({
            repoRoot,
            query: needle,
            searchPath: hint.file,
            maxMatches: 2,
            contextLines: 5,
          });
        } catch (error) {
          result = { query: needle, searchPath: hint.file, matches: [], error: String(error.message || error) };
        }
        searches.push({
          query: needle,
          searchPath: hint.file,
          why: `contract candidate ${contract.id}: changed source hint ${hint.symbol}`,
          result,
        });
        evidence.push(...rawEvidence(result?.matches, hint, needle));
      }
    }
    if (!evidence.length) continue;
    const dedupedEvidence = evidence.filter((item, index, entries) =>
      entries.findIndex((other) => other.file === item.file && other.line === item.line) === index);
    candidates.push({
      id: contract.id,
      version: contract.version,
      title: contract.title,
      summary: contract.summary,
      useWhen: contract.useWhen,
      params: Object.fromEntries(Object.entries(contract.params)
        .map(([name, definition]) => [name, { type: definition.type, default: definition.default }])),
      evidence: dedupedEvidence.slice(0, 6),
      changedDiff: relevantDiffs,
    });
  }
  return { candidates, searches };
}

/**
 * Candidate discovery is not permission to choose the closest contract. The
 * router must select an exposed contract and cite one of that contract's own
 * bounded source ranges before the normal compiler is allowed to run.
 */
export function validateLeanContractSelection(rawPlan, candidates) {
  const plan = rawPlan && typeof rawPlan === 'object' && !Array.isArray(rawPlan) ? rawPlan : null;
  if (!plan) throw new Error('lean contract router must return an object');
  const skipReason = text(plan.skipReason).trim();
  if (skipReason) {
    if (!/^(?:NEEDS_CONTRACT|OUT_OF_SCOPE):\s*\S/.test(skipReason)) {
      throw new Error('LEAN_SKIP_REASON_INVALID: use NEEDS_CONTRACT: or OUT_OF_SCOPE: with a concrete reason');
    }
    return { ...plan, skipReason };
  }
  const forbiddenFixtureFields = ['config', 'cards', 'filters', 'isHashed', 'probes', 'expected', 'observe', 'renderability', 'assertions', 'ownedConfigPaths'];
  const suppliedFixtureField = forbiddenFixtureFields.find((field) => Object.hasOwn(plan, field));
  if (suppliedFixtureField) throw new Error(`LEAN_FIXTURE_FIELD_FORBIDDEN: ${suppliedFixtureField}`);
  const id = text(plan.contract?.id || plan.contractId).trim();
  const selected = (Array.isArray(candidates) ? candidates : []).find((candidate) => candidate.id === id);
  if (!selected) throw new Error(`LEAN_CONTRACT_NOT_EXPOSED: ${id || '(missing)'}`);
  const params = plan.contract?.params || plan.contractParams || {};
  if (!params || typeof params !== 'object' || Array.isArray(params) || Object.keys(params).length) {
    throw new Error(`LEAN_CONTRACT_PARAMS_FORBIDDEN: ${selected.id}`);
  }
  const mappingEvidence = Array.isArray(plan.mappingEvidence) ? plan.mappingEvidence : [];
  const grounded = mappingEvidence.some((item) => selected.evidence.some((source) =>
    source.file === text(item?.file).trim() && Number(item?.line) >= source.startLine && Number(item?.line) <= source.endLine));
  if (!grounded) throw new Error(`LEAN_CONTRACT_EVIDENCE_UNPROVEN: ${selected.id}`);
  return plan;
}

export function compactLeanCandidates(candidates, maxChars = 12000) {
  const compact = [];
  for (const candidate of (Array.isArray(candidates) ? candidates : [])) {
    const next = {
      id: candidate.id,
      version: candidate.version,
      title: candidate.title,
      summary: candidate.summary,
      useWhen: candidate.useWhen,
      params: candidate.params,
      changedDiff: (candidate.changedDiff || []).slice(0, 1).map(({ file, diff }) => ({
        file, diff: text(diff).slice(0, 1500),
      })),
      sourceEvidence: (candidate.evidence || []).slice(0, 2).map(({ file, line, startLine, endLine, snippet }) => ({
        file, line, startLine, endLine, snippet: text(snippet).slice(0, 700),
      })),
    };
    if (JSON.stringify([...compact, next]).length > maxChars) break;
    compact.push(next);
  }
  return compact;
}

/**
 * Minimal model context for a known contract. The model routes and cites code;
 * the compiler owns JSON/config construction and the deterministic assertion.
 */
export function buildLeanContractPlanPrompt({ evidence, candidates }) {
  const catalog = JSON.stringify(compactLeanCandidates(candidates));
  return `You are routing one historical CaaS PR to a reviewed browser-fixture contract.

The runner already did bounded local source search. Use only a candidate below. Do not invent fixture JSON, config patches, selectors, assertions, browser steps, or a new contract. The runner will generate and validate those mechanically after your answer.

Choose a candidate only when its changed source evidence and the changed test describe the same visitor-visible behavior. Cite one exact sourceEvidence file/line from that candidate. Do not supply contract parameters: lean-v1 always uses the reviewed defaults. If no candidate fits, return a concrete skipReason beginning with "NEEDS_CONTRACT:"; use "OUT_OF_SCOPE:" only for a refactor/no new injectable runtime behavior. Do not use an exploratory fixture in this profile.

PR title: ${text(evidence?.meta?.title).slice(0, 800)}
PR body: ${text(evidence?.meta?.body).slice(0, 1000)}
Changed test diff (the only test-selection authority):
${text(evidence?.specDiff).slice(0, 9000)}

Reviewed candidates and raw current-source evidence:
${catalog}

Reply ONLY one JSON object:
{"sourceTest":"changed test name/requirement","contract":{"id":"one listed id","params":{},"reason":"brief match"},"mappingEvidence":[{"file":"candidate evidence file","line":123,"fact":"what the changed source establishes"}],"skipReason":""}
or {"sourceTest":"","skipReason":"NEEDS_CONTRACT: no listed reviewed contract matches this changed behavior"}.`;
}
