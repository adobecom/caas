import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  BASELINE_PROMPT_PROFILE,
  LEAN_CONTRACTS_PROMPT_PROFILE,
  buildLeanContractPlanPrompt,
  compactLeanCandidates,
  discoverManagedContractCandidates,
  parseBacktestPromptProfile,
  validateLeanContractSelection,
} from './contract-routing.mjs';

const qaDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(qaDir, '../..');

test('keeps baseline explicit and rejects an accidental prompt profile', () => {
  assert.equal(parseBacktestPromptProfile(''), BASELINE_PROMPT_PROFILE);
  assert.equal(parseBacktestPromptProfile(LEAN_CONTRACTS_PROMPT_PROFILE), LEAN_CONTRACTS_PROMPT_PROFILE);
  assert.throws(() => parseBacktestPromptProfile('shorter-prompt-maybe'), /QA_PROMPT_PROFILE/);
});

test('discovers only changed, source-backed reviewed contract candidates', () => {
  const routed = discoverManagedContractCandidates({
    repoRoot,
    changedPaths: ['react/src/js/components/Consonant/Cards/ButtonCard.jsx'],
    productDiff: 'diff --git a/react/src/js/components/Consonant/Cards/ButtonCard.jsx b/react/src/js/components/Consonant/Cards/ButtonCard.jsx\n+const overlay = data.overlay;',
  });
  assert.deepEqual(routed.candidates.map(({ id }) => id), ['card.button-card-cta.v1']);
  assert.ok(routed.searches.length >= 1);
  assert.ok(routed.candidates[0].evidence.every((item) => item.file.endsWith('ButtonCard.jsx')));

  const none = discoverManagedContractCandidates({ repoRoot, changedPaths: ['README.md'], productDiff: 'diff --git a/README.md b/README.md\n+docs' });
  assert.deepEqual(none.candidates, []);

  const unrelatedHunk = discoverManagedContractCandidates({
    repoRoot,
    changedPaths: ['react/src/js/components/Consonant/Cards/ButtonCard.jsx'],
    productDiff: 'diff --git a/react/src/js/components/Consonant/Cards/ButtonCard.jsx b/react/src/js/components/Consonant/Cards/ButtonCard.jsx\n+format only',
  });
  assert.deepEqual(unrelatedHunk.candidates, [], 'a touched contract file alone is not a contract candidate');
});

test('lean contract prompt contains evidence and routing instructions, not a fixture recipe', () => {
  const routed = discoverManagedContractCandidates({
    repoRoot,
    changedPaths: ['react/src/js/components/Consonant/Cards/ButtonCard.jsx'],
    productDiff: 'diff --git a/react/src/js/components/Consonant/Cards/ButtonCard.jsx b/react/src/js/components/Consonant/Cards/ButtonCard.jsx\n+const overlay = data.overlay;',
  });
  const prompt = buildLeanContractPlanPrompt({
    evidence: { meta: { title: 'Button card CTA' }, specDiff: '+ expect(cta).toBeVisible()' },
    candidates: routed.candidates,
  });
  assert.match(prompt, /card\.button-card-cta\.v1/);
  assert.match(prompt, /sourceEvidence/);
  assert.match(prompt, /Do not invent fixture JSON/);
  assert.doesNotMatch(prompt, /RAW CARD CONTRACT/);
  assert.doesNotMatch(prompt, /NESTED FILTER INITIAL STATE/);
  const catalog = prompt.match(/Reviewed candidates and raw current-source evidence:\n([\s\S]*?)\n\nReply ONLY/)[1];
  assert.ok(JSON.parse(catalog)[0].sourceEvidence.length > 0, 'the router receives citable raw source evidence');

  const compactPrompt = buildLeanContractPlanPrompt({
    evidence: { meta: { title: 'Button card CTA' }, specDiff: '+ expect(cta).toBeVisible()' },
    candidates: compactLeanCandidates(routed.candidates),
  });
  const compactCatalog = compactPrompt.match(/Reviewed candidates and raw current-source evidence:\n([\s\S]*?)\n\nReply ONLY/)[1];
  assert.ok(JSON.parse(compactCatalog)[0].sourceEvidence.length > 0, 'defensive re-compaction retains evidence');
});

test('lean router cannot select an unexposed contract or cite another contract evidence block', () => {
  const routed = discoverManagedContractCandidates({
    repoRoot,
    changedPaths: ['react/src/js/components/Consonant/Cards/ButtonCard.jsx'],
    productDiff: 'diff --git a/react/src/js/components/Consonant/Cards/ButtonCard.jsx b/react/src/js/components/Consonant/Cards/ButtonCard.jsx\n+const overlay = data.overlay;',
  });
  const source = routed.candidates[0].evidence[0];
  const selected = validateLeanContractSelection({
    sourceTest: 'Button Card changed requirement',
    contract: { id: 'card.button-card-cta.v1' },
    mappingEvidence: [{ file: source.file, line: source.line, fact: 'changed Button Card source renders its CTA' }],
  }, routed.candidates);
  assert.equal(selected.contract.id, 'card.button-card-cta.v1');
  assert.throws(() => validateLeanContractSelection({
    contract: { id: 'card.metadata-attributes.v1' }, mappingEvidence: [{ file: source.file, line: source.line }],
  }, routed.candidates), /LEAN_CONTRACT_NOT_EXPOSED/);
  assert.throws(() => validateLeanContractSelection({
    contract: { id: 'card.button-card-cta.v1' }, mappingEvidence: [{ file: source.file, line: 999999 }],
  }, routed.candidates), /LEAN_CONTRACT_EVIDENCE_UNPROVEN/);
  assert.throws(() => validateLeanContractSelection({ skipReason: 'cannot tell' }, routed.candidates), /LEAN_SKIP_REASON_INVALID/);
  assert.throws(() => validateLeanContractSelection({
    contract: { id: 'card.button-card-cta.v1', params: { ctaText: 'invented' } },
    mappingEvidence: [{ file: source.file, line: source.line, fact: 'Button Card CTA source' }],
  }, routed.candidates), /LEAN_CONTRACT_PARAMS_FORBIDDEN/);
  assert.throws(() => validateLeanContractSelection({
    contract: { id: 'card.button-card-cta.v1' }, cards: [],
    mappingEvidence: [{ file: source.file, line: source.line, fact: 'Button Card CTA source' }],
  }, routed.candidates), /LEAN_FIXTURE_FIELD_FORBIDDEN/);
  assert.equal(validateLeanContractSelection({ skipReason: 'OUT_OF_SCOPE: refactor only' }, routed.candidates).skipReason,
    'OUT_OF_SCOPE: refactor only');
});

test('lean candidate context remains valid JSON when evidence is large', () => {
  const candidates = Array.from({ length: 10 }, (_, index) => ({
    id: `card.example-${index}.v1`, version: 1, title: 'Example', summary: 'Example summary', useWhen: ['Example'], params: {},
    changedDiff: [{ file: `react/src/${index}.js`, diff: 'x'.repeat(10000) }],
    evidence: Array.from({ length: 8 }, () => ({ file: `react/src/${index}.js`, line: 10, startLine: 8, endLine: 12, snippet: 'y'.repeat(10000) })),
  }));
  const compact = compactLeanCandidates(candidates);
  assert.ok(JSON.stringify(compact).length <= 12000);
  assert.doesNotThrow(() => JSON.parse(JSON.stringify(compact)));
});
