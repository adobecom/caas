import { listScenarioContracts } from './contracts/catalog.mjs';
import { searchCode } from './code-search.mjs';

export const BASELINE_PROMPT_PROFILE = 'baseline-v1';
export const LEAN_CONTRACTS_PROMPT_PROFILE = 'lean-contracts-v1';
export const BACKTEST_PROMPT_PROFILES = new Set([
  BASELINE_PROMPT_PROFILE,
  LEAN_CONTRACTS_PROMPT_PROFILE,
]);
export const LEAN_COVERAGE_TEST_DIFF_MAX_CHARS = 7000;
export const LEAN_COVERAGE_PRODUCT_DIFF_MAX_CHARS = 11000;

const text = (value) => (value === undefined || value === null ? '' : String(value));

function cleanNeededCapabilities(value, max = 6) {
  return (Array.isArray(value) ? value : [])
    .map((item) => text(item).trim().replace(/\s+/g, ' ').slice(0, 300)).filter(Boolean).slice(0, max);
}

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
  const forbiddenFixtureFields = ['config', 'cards', 'filters', 'isHashed', 'probes', 'expected', 'observe', 'renderability', 'assertions', 'ownedConfigPaths'];
  const suppliedFixtureField = forbiddenFixtureFields.find((field) => Object.hasOwn(plan, field));
  if (suppliedFixtureField) throw new Error(`LEAN_FIXTURE_FIELD_FORBIDDEN: ${suppliedFixtureField}`);
  const skipReason = text(plan.skipReason).trim();
  if (skipReason) {
    if (!/^(?:NEEDS_CONTRACT|OUT_OF_SCOPE):\s*\S/.test(skipReason)) {
      throw new Error('LEAN_SKIP_REASON_INVALID: use NEEDS_CONTRACT: or OUT_OF_SCOPE: with a concrete reason');
    }
    const route = skipReason.split(':', 1)[0];
    const neededCapabilities = cleanNeededCapabilities(plan.neededCapabilities);
    if (route === 'NEEDS_CONTRACT' && !neededCapabilities.length) {
      throw new Error('LEAN_SKIP_CAPABILITY_REQUIRED: NEEDS_CONTRACT must name a missing adapter capability');
    }
    if (route === 'OUT_OF_SCOPE' && neededCapabilities.length) {
      throw new Error('LEAN_SKIP_CAPABILITY_FORBIDDEN: OUT_OF_SCOPE must not propose an adapter capability');
    }
    return { ...plan, skipReason, neededCapabilities };
  }
  const id = text(plan.contract?.id || plan.contractId).trim();
  const selected = (Array.isArray(candidates) ? candidates : []).find((candidate) => candidate.id === id);
  if (!selected) throw new Error(`LEAN_CONTRACT_NOT_EXPOSED: ${id || '(missing)'}`);
  const params = plan.contract?.params || plan.contractParams || {};
  if (!params || typeof params !== 'object' || Array.isArray(params) || Object.keys(params).length) {
    throw new Error(`LEAN_CONTRACT_PARAMS_FORBIDDEN: ${selected.id}`);
  }
  const mappingEvidence = Array.isArray(plan.mappingEvidence) ? plan.mappingEvidence : [];
  const selectedEvidence = Array.isArray(selected.evidence) ? selected.evidence : selected.sourceEvidence || [];
  const grounded = mappingEvidence.some((item) => selectedEvidence.some((source) =>
    source.file === text(item?.file).trim() && Number(item?.line) >= source.startLine && Number(item?.line) <= source.endLine));
  if (!grounded) throw new Error(`LEAN_CONTRACT_EVIDENCE_UNPROVEN: ${selected.id}`);
  return plan;
}

/** A no-candidate result is a coverage decision, never a browser verdict. */
export function validateLeanCoverageDecision(rawDecision) {
  const decision = rawDecision && typeof rawDecision === 'object' && !Array.isArray(rawDecision) ? rawDecision : null;
  if (!decision) throw new Error('lean coverage router must return an object');
  const allowedFields = new Set(['route', 'reason', 'neededCapabilities']);
  const unexpectedField = Object.keys(decision).find((field) => !allowedFields.has(field));
  if (unexpectedField) throw new Error(`lean coverage field is not allowed: ${unexpectedField}`);
  const route = text(decision.route).trim();
  if (route !== 'NEEDS_CONTRACT' && route !== 'OUT_OF_SCOPE') {
    throw new Error('lean coverage route must be NEEDS_CONTRACT or OUT_OF_SCOPE');
  }
  const reason = text(decision.reason).trim().replace(/\s+/g, ' ').slice(0, 1200);
  if (reason.length < 6) throw new Error('lean coverage route needs a concrete reason');
  const neededCapabilities = cleanNeededCapabilities(decision.neededCapabilities);
  if (route === 'NEEDS_CONTRACT' && !neededCapabilities.length) {
    throw new Error('NEEDS_CONTRACT needs at least one adapter capability');
  }
  if (route === 'OUT_OF_SCOPE' && neededCapabilities.length) {
    throw new Error('OUT_OF_SCOPE must not propose an adapter capability');
  }
  return { route, reason, neededCapabilities };
}

/**
 * An incomplete prompt must not let the model discard a possible feature. The
 * safe outcome is a contract backlog entry, which a maintainer can review with
 * the full PR evidence later.
 */
export function makeLeanCoverageDecisionConservative(decision, evidence) {
  if (decision?.route !== 'OUT_OF_SCOPE') return decision;
  const diffWasTruncated = text(evidence?.diff).length > LEAN_COVERAGE_PRODUCT_DIFF_MAX_CHARS;
  const testDiffWasTruncated = text(evidence?.specDiff).length > LEAN_COVERAGE_TEST_DIFF_MAX_CHARS;
  if (!diffWasTruncated && !testDiffWasTruncated) return decision;
  return {
    route: 'NEEDS_CONTRACT',
    reason: 'Coverage evidence exceeded the bounded review window, so this PR cannot safely be declared out of scope.',
    neededCapabilities: ['review the uncovered behavior with complete PR evidence before deciding contract coverage'],
  };
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
      sourceEvidence: (candidate.evidence || candidate.sourceEvidence || []).slice(0, 2).map(({ file, line, startLine, endLine, snippet }) => ({
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
or {"sourceTest":"","skipReason":"NEEDS_CONTRACT: no listed reviewed contract matches this changed behavior","neededCapabilities":["one missing reviewed adapter capability"]}
or {"sourceTest":"","skipReason":"OUT_OF_SCOPE: refactor or tooling only","neededCapabilities":[]}.`;
}

/**
 * Use this only after deterministic catalog routing finds no candidate. It is
 * deliberately unable to create a scenario, so it can turn historical PRs
 * into an honest contract backlog without fabricating a browser result.
 */
export function buildLeanCoveragePrompt({ evidence }) {
  const testDiff = text(evidence?.specDiff);
  const productDiff = text(evidence?.diff);
  const evidenceWasTruncated = testDiff.length > LEAN_COVERAGE_TEST_DIFF_MAX_CHARS || productDiff.length > LEAN_COVERAGE_PRODUCT_DIFF_MAX_CHARS;
  return `No reviewed CaaS fixture contract matched this PR. Classify coverage only; do not plan a browser scenario and do not return PASS or FAIL.

Use NEEDS_CONTRACT when the changed code introduces a visitor-visible browser behavior that could be worth a reviewed fixture adapter. Name the missing adapter capability. Use OUT_OF_SCOPE only for refactors, tests/build/tooling, performance-only work, or behavior outside this initial-render collection harness.
${evidenceWasTruncated ? 'Important: the shown evidence is truncated. Do not use OUT_OF_SCOPE; return NEEDS_CONTRACT for manual full-evidence review.' : ''}

PR title: ${text(evidence?.meta?.title).slice(0, 800)}
PR body: ${text(evidence?.meta?.body).slice(0, 1000)}
Changed files: ${(Array.isArray(evidence?.changedPaths) ? evidence.changedPaths : []).join('\n').slice(0, 5000)}
Changed test diff:\n${testDiff.slice(0, LEAN_COVERAGE_TEST_DIFF_MAX_CHARS)}
Changed product diff:\n${productDiff.slice(0, LEAN_COVERAGE_PRODUCT_DIFF_MAX_CHARS)}

Reply ONLY JSON:
{"route":"NEEDS_CONTRACT","reason":"specific visible behavior not represented by the catalog","neededCapabilities":["one reviewed adapter capability"]}
or {"route":"OUT_OF_SCOPE","reason":"specific reason this is not a new injectable browser behavior","neededCapabilities":[]}.`;
}
