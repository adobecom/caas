import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  BASELINE_PROMPT_PROFILE,
  LEAN_CONTRACTS_PROMPT_PROFILE,
  allLeanChangedPathsAreNonProduct,
  buildLeanCoverageEvidence,
  buildLeanCoveragePrompt,
  buildLeanContractPlanPrompt,
  compactLeanCandidates,
  discoverManagedContractCandidates,
  parseBacktestPromptProfile,
  resolveMechanicalLeanCoverage,
  resolveLeanCoverageSelection,
  validateLeanCoverageSelection,
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
  assert.match(prompt, /NO_MATCH/);
  assert.doesNotMatch(prompt, /NEEDS_CONTRACT:/);
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
    skipReason: 'NEEDS_CONTRACT: Button Card behavior is not in the catalog',
  }, routed.candidates), /LEAN_SKIP_REASON_INVALID/);
  assert.throws(() => validateLeanContractSelection({
    skipReason: 'OUT_OF_SCOPE: refactor only', neededCapabilities: ['a fixture'],
  }, routed.candidates), /LEAN_DECLINE_FIELD_FORBIDDEN/);
  assert.throws(() => validateLeanContractSelection({
    skipReason: 'OUT_OF_SCOPE: refactor only', cards: [],
  }, routed.candidates), /LEAN_FIXTURE_FIELD_FORBIDDEN/);
  assert.throws(() => validateLeanContractSelection({
    contract: { id: 'card.button-card-cta.v1', params: { ctaText: 'invented' } },
    mappingEvidence: [{ file: source.file, line: source.line, fact: 'Button Card CTA source' }],
  }, routed.candidates), /LEAN_CONTRACT_PARAMS_FORBIDDEN/);
  assert.throws(() => validateLeanContractSelection({
    contract: { id: 'card.button-card-cta.v1' }, cards: [],
    mappingEvidence: [{ file: source.file, line: source.line, fact: 'Button Card CTA source' }],
  }, routed.candidates), /LEAN_FIXTURE_FIELD_FORBIDDEN/);
  assert.throws(() => validateLeanContractSelection({
    contract: { id: 'card.button-card-cta.v1' }, neededCapabilities: ['invented adapter'],
    mappingEvidence: [{ file: source.file, line: source.line, fact: 'Button Card CTA source' }],
  }, routed.candidates), /LEAN_SELECTION_FIELD_FORBIDDEN/);
  assert.deepEqual(validateLeanContractSelection({
    sourceTest: '',
    skipReason: 'NO_MATCH: Button Card behavior does not match the reviewed CTA contract',
  }, routed.candidates), {
    sourceTest: '',
    skipReason: 'NO_MATCH: Button Card behavior does not match the reviewed CTA contract',
  });
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

test('no-candidate coverage routing selects a closed policy scope with an exposed changed hunk', () => {
  const coverageEvidence = buildLeanCoverageEvidence({
    allChangedPaths: ['react/src/x.jsx'],
    coverageDiff: 'diff --git a/react/src/x.jsx b/react/src/x.jsx\n@@ -2,1 +2,2 @@\n export const oldValue = true;\n+export const countrySort = true;\n',
  });
  assert.deepEqual(coverageEvidence.hunks.map(({ id, file }) => ({ id, file })), [{ id: 'h1', file: 'react/src/x.jsx' }]);
  const selected = validateLeanCoverageSelection({
    scope: 'collection_initial_render',
    summary: 'Country sorting changes the visible order of rendered collection cards.',
    evidence: [{ hunk: 'h1', file: 'react/src/x.jsx', fact: 'Adds country-driven sort behavior.' }],
  }, coverageEvidence);
  const decision = resolveLeanCoverageSelection(selected, coverageEvidence);
  assert.equal(decision.scope, 'collection_initial_render');
  assert.equal(decision.coverage, 'NEEDS_CONTRACT');
  assert.deepEqual(decision.neededCapabilities, ['deterministic initial-render fixture adapter']);
  assert.equal(decision.policyId, 'caas-feature-qa-scope.v1');
  assert.equal(decision.policyVersion, 1);
  assert.match(decision.policyHash, /^[a-f0-9]{64}$/);
  assert.equal(decision.reason, 'Country sorting changes the visible order of rendered collection cards.');
  assert.deepEqual(decision.evidence, [{ hunk: 'h1', file: 'react/src/x.jsx', fact: 'Adds country-driven sort behavior.' }]);
  assert.equal(decision.evidenceTruncated, false);
  assert.throws(() => validateLeanCoverageSelection({
    scope: 'PASS', summary: 'bad scope', evidence: [{ hunk: 'h1', file: 'react/src/x.jsx', fact: 'x' }],
  }, coverageEvidence), /not exposed/);
  assert.throws(() => validateLeanCoverageSelection({
    scope: 'a11y_only', summary: 'Adds an aria label.', evidence: [{ hunk: 'h9', file: 'react/src/x.jsx', fact: 'x' }],
  }, coverageEvidence), /exposed changed hunk/);
  assert.throws(() => validateLeanCoverageSelection({
    scope: 'a11y_only', summary: 'Adds an aria label.', evidence: [{ hunk: 'h1', file: 'wrong.jsx', fact: 'x' }],
  }, coverageEvidence), /exposed changed hunk/);
  const prompt = buildLeanCoveragePrompt({ evidence: { meta: { title: 'A static modifier', body: 'Feature details' } }, coverageEvidence });
  assert.match(prompt, /collection_initial_render/);
  assert.match(prompt, /a11y_only/);
  assert.match(prompt, /"h1"/);
  assert.doesNotMatch(prompt, /CARD_SHAPE/);
  assert.match(prompt, /do not plan a browser scenario/);
});

test('coverage evidence prioritizes product hunks over fixture noise without hiding changed paths', () => {
  const coverageEvidence = buildLeanCoverageEvidence({
    allChangedPaths: ['react/src/Sort.jsx', 'react/src/__tests__/Sort.spec.jsx', 'package-lock.json'],
    coverageDiff: `diff --git a/react/src/__tests__/Sort.spec.jsx b/react/src/__tests__/Sort.spec.jsx
@@ -1 +1 @@
+${'test fixture '.repeat(1000)}
diff --git a/react/src/Sort.jsx b/react/src/Sort.jsx
@@ -1 +1,2 @@
 export const sort = true;
+export const countrySort = true;
diff --git a/package-lock.json b/package-lock.json
@@ -1 +1 @@
+${'lock '.repeat(1000)}
`,
  });
  assert.equal(coverageEvidence.truncated, false);
  assert.deepEqual(coverageEvidence.hunks.map(({ file }) => file), ['react/src/Sort.jsx']);
  assert.deepEqual(coverageEvidence.ignoredPaths.sort(), ['package-lock.json', 'react/src/__tests__/Sort.spec.jsx']);
  assert.deepEqual(coverageEvidence.changedPaths, ['react/src/Sort.jsx', 'react/src/__tests__/Sort.spec.jsx', 'package-lock.json']);
});

test('mechanical coverage decisions avoid model classification for incomplete and non-product evidence', () => {
  const incomplete = buildLeanCoverageEvidence({
    allChangedPaths: ['react/src/x.jsx'],
    coverageDiff: `diff --git a/react/src/x.jsx b/react/src/x.jsx
@@ -1,1 +1,2 @@
+x${'x'.repeat(2000)}
`,
  });
  const incompleteDecision = resolveMechanicalLeanCoverage(incomplete);
  assert.equal(incompleteDecision.scope, 'needs_review');
  assert.equal(incompleteDecision.coverage, 'NEEDS_REVIEW');
  assert.equal(incompleteDecision.automatic, 'incomplete-evidence');
  assert.equal(incompleteDecision.evidence.length, 0);

  const nonProduct = buildLeanCoverageEvidence({
    allChangedPaths: ['.github/workflows/qa.yml', 'package.json'],
    coverageDiff: `diff --git a/.github/workflows/qa.yml b/.github/workflows/qa.yml
@@ -1 +1 @@
-old
+new
diff --git a/package.json b/package.json
@@ -1 +1 @@
-old
+new
`,
  });
  assert.equal(allLeanChangedPathsAreNonProduct(nonProduct.changedPaths), true);
  const nonProductDecision = resolveMechanicalLeanCoverage(nonProduct);
  assert.equal(nonProductDecision.scope, 'non_product_runtime');
  assert.equal(nonProductDecision.coverage, 'OUT_OF_SCOPE');
  assert.equal(nonProductDecision.automatic, 'non-product-paths');

  const runtime = buildLeanCoverageEvidence({
    allChangedPaths: ['react/src/js/app.jsx'],
    coverageDiff: 'diff --git a/react/src/js/app.jsx b/react/src/js/app.jsx\n@@ -1 +1 @@\n-console.log("old")\n+console.log("new")\n',
  });
  const unsafeSelection = validateLeanCoverageSelection({
    scope: 'non_product_runtime', summary: 'Only a debug statement changed.',
    evidence: [{ hunk: 'h1', file: 'react/src/js/app.jsx', fact: 'Changes a console statement.' }],
  }, runtime);
  const unsafeDecision = resolveLeanCoverageSelection(unsafeSelection, runtime);
  assert.equal(unsafeDecision.scope, 'needs_review');
  assert.equal(unsafeDecision.coverage, 'NEEDS_REVIEW');
  assert.match(unsafeDecision.reason, /production-runtime path/);
});

test('coverage scope must be grounded in a cited product hunk when a product path changed', () => {
  const mixed = buildLeanCoverageEvidence({
    allChangedPaths: ['.github/workflows/qa.yml', 'react/src/Card.jsx'],
    coverageDiff: `diff --git a/.github/workflows/qa.yml b/.github/workflows/qa.yml
@@ -1 +1 @@
-old
+new
diff --git a/react/src/Card.jsx b/react/src/Card.jsx
@@ -1 +1 @@
-old
+new
`,
  });
  const workflowHunk = mixed.hunks.find((hunk) => hunk.file === '.github/workflows/qa.yml');
  assert.ok(workflowHunk, 'the mixed evidence retains the workflow hunk for auditability');
  const selection = validateLeanCoverageSelection({
    scope: 'a11y_only', summary: 'A label-only accessibility change was made.',
    evidence: [{ hunk: workflowHunk.id, file: workflowHunk.file, fact: 'Workflow condition changed.' }],
  }, mixed);
  const decision = resolveLeanCoverageSelection(selection, mixed);
  assert.equal(decision.scope, 'needs_review');
  assert.equal(decision.coverage, 'NEEDS_REVIEW');
  assert.match(decision.reason, /cited product hunk/);
});

test('incomplete changed-path enumeration cannot trigger a mechanical out-of-scope result', () => {
  const partialPaths = Array.from({ length: 200 }, (_, index) => `.github/workflows/${index}.yml`);
  const evidence = buildLeanCoverageEvidence({
    allChangedPaths: partialPaths,
    pathsTruncated: true,
    coverageDiff: 'diff --git a/.github/workflows/0.yml b/.github/workflows/0.yml\n@@ -1 +1 @@\n-old\n+new\n',
  });
  assert.equal(evidence.pathsTruncated, true);
  const decision = resolveMechanicalLeanCoverage(evidence);
  assert.equal(decision.scope, 'needs_review');
  assert.equal(decision.coverage, 'NEEDS_REVIEW');
  assert.equal(decision.automatic, 'incomplete-evidence');
});

test('a product path missing from the raw changed-hunk evidence fails closed', () => {
  const evidence = buildLeanCoverageEvidence({
    allChangedPaths: ['.github/workflows/qa.yml', 'react/src/Important.jsx'],
    coverageDiff: 'diff --git a/.github/workflows/qa.yml b/.github/workflows/qa.yml\n@@ -1 +1 @@\n-old\n+new\n',
  });
  assert.deepEqual(evidence.unrepresentedProductPaths, ['react/src/Important.jsx']);
  const decision = resolveMechanicalLeanCoverage(evidence);
  assert.equal(decision.scope, 'needs_review');
  assert.equal(decision.coverage, 'NEEDS_REVIEW');
});

test('truncated no-candidate evidence is conservatively retained for review', () => {
  const coverageEvidence = buildLeanCoverageEvidence({
    allChangedPaths: ['react/src/x.jsx'],
    coverageDiff: `diff --git a/react/src/x.jsx b/react/src/x.jsx\n@@ -1,1 +1,2 @@\n+x${'x'.repeat(2000)}\n`,
  });
  assert.equal(coverageEvidence.truncated, true);
  const selected = validateLeanCoverageSelection({
    scope: 'non_product_runtime', summary: 'Only build configuration changed.',
    evidence: [{ hunk: 'h1', file: 'react/src/x.jsx', fact: 'A bounded hunk was changed.' }],
  }, coverageEvidence);
  const decision = resolveLeanCoverageSelection(selected, coverageEvidence);
  assert.equal(decision.scope, 'needs_review');
  assert.equal(decision.coverage, 'NEEDS_REVIEW');
  assert.equal(decision.evidenceTruncated, true);
});
