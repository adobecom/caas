import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { contractCatalogHealth, validateContractProposal } from '../contract-maker.mjs';
import { evaluateContractAssertions } from './assertions.mjs';
import { EXPLORATORY_CONTRACT_ID, contractCatalogGuidance, listScenarioContracts, validateContractManifest } from './catalog.mjs';
import { compileContractPlan } from './compiler.mjs';
import { getCoverageScopePolicy, resolveCoverageScope, validateCoverageScopePolicy, validateCoverageScopePolicyCatalog } from './scope-policy.mjs';
import { buildScenarioConfig } from '../scenario-config.mjs';

const evidence = [{ file: 'react/src/js/components/Consonant/Cards/ButtonCard.jsx', line: 24, fact: 'reads overlayLink' }];
const liveConfig = { collection: { endpoint: 'https://business.adobe.com/chimera-api/collection?originSelection=bacom' } };

function applicability(file, line) {
  return {
    changedPaths: [file],
    researchSearches: [{ result: { matches: [{ file, line, startLine: line - 2, endLine: line + 2 }] } }],
  };
}

test('catalog exposes only versioned, inert managed contracts plus an exploratory escape hatch', () => {
  assert.deepEqual(listScenarioContracts().map((contract) => contract.id), [
    'card.button-card-cta.v1',
    'card.metadata-attributes.v1',
    'collection.empty-events-removal.v1',
    'filter.nested-filter-prune.v1',
  ]);
  assert.ok(listScenarioContracts().every((contract) => contract.scope === 'collection_initial_render'));
  assert.match(contractCatalogGuidance(), /card\.button-card-cta\.v1/);
  assert.match(contractCatalogGuidance(), new RegExp(EXPLORATORY_CONTRACT_ID.replaceAll('.', '\\.')));
  assert.throws(() => validateContractManifest({ id: 'bad.v1', version: 1, kind: 'javascript', title: 'x', summary: 'x', useWhen: ['x'] }),
    /unsupported contract kind/);
  assert.throws(() => validateContractManifest({
    id: 'card.example.v2', version: 1, kind: 'card-button-cta', title: 'x', summary: 'x', useWhen: ['x'], params: {},
    sourceHints: [{ file: 'react/src/x.js', symbol: 'x', needles: ['x'] }],
  }), /id\/version mismatch/);
  assert.throws(() => validateContractManifest({
    id: 'card.example.v1', version: 1, kind: 'card-button-cta', title: 'x', summary: 'x', useWhen: ['x'], params: {},
    sourceHints: [{ file: 'react/src/x.js', symbol: 'x' }],
  }), /source hint needs symbol and needles/);
});

test('catalog health is read-only and verifies the current source hints', () => {
  const report = contractCatalogHealth(path.resolve(process.cwd(), '../..'));
  assert.equal(report.status, 'HEALTHY');
  assert.equal(report.contractCount, 4);
  assert.deepEqual(report.issues, []);
});

test('coverage scope policy keeps deferred QA areas distinct from out-of-scope work', () => {
  const policy = getCoverageScopePolicy();
  assert.equal(policy.id, 'caas-feature-qa-scope.v1');
  assert.match(policy.policyHash, /^[a-f0-9]{64}$/);
  assert.equal(policy.policyFile, 'scope-policy.v1.json');
  assert.equal(resolveCoverageScope('collection_initial_render').coverage, 'NEEDS_CONTRACT');
  assert.equal(resolveCoverageScope('interaction_or_state').neededCapabilities[0], 'bounded interaction/state browser bridge');
  assert.equal(resolveCoverageScope('a11y_only').coverage, 'DEFERRED_A11Y');
  assert.equal(resolveCoverageScope('visual_only').coverage, 'DEFERRED_VISUAL');
  assert.equal(resolveCoverageScope('non_product_runtime').coverage, 'OUT_OF_SCOPE');
  assert.equal(resolveCoverageScope('refactor_only').coverage, 'NEEDS_REVIEW');
  assert.equal(resolveCoverageScope('refactor_only').policyVersion, 1);
  assert.equal(resolveCoverageScope('unknown').scope, 'needs_review');
  assert.throws(() => validateCoverageScopePolicy({
    id: 'caas-feature-qa-scope.v1', version: 1, defaultScope: 'x', scopes: {},
  }), /defaultScope/);
  assert.throws(() => validateCoverageScopePolicy({
    id: 'caas-feature-qa-scope.v1', version: 1, defaultScope: 'x', scopes: {
      x: { coverage: 'NEEDS_CONTRACT', neededCapabilities: ['fixture adapter'] },
    },
  }), /defaultScope/);
  assert.throws(() => validateCoverageScopePolicy({
    id: 'caas-feature-qa-scope.v1', version: 1, defaultScope: 'non_product_runtime', scopes: {
      non_product_runtime: { coverage: 'OUT_OF_SCOPE', neededCapabilities: [] },
    },
  }), /defaultScope must be needs_review/);
  assert.throws(() => validateCoverageScopePolicy({
    id: 'caas-feature-qa-scope.v1', version: 1, defaultScope: 'needs_review', scopes: {
      needs_review: { coverage: 'OUT_OF_SCOPE', neededCapabilities: [] },
    },
  }), /needs a NEEDS_REVIEW/);
  assert.throws(() => validateCoverageScopePolicyCatalog({
    activePolicyId: 'caas-feature-qa-scope.v1',
    policies: { 'caas-feature-qa-scope.v1': { file: 'scope-policy.v1.json', version: 1, sha256: 'bad' } },
  }), /needs sha256/);
  assert.throws(() => validateCoverageScopePolicyCatalog({
    activePolicyId: 'caas-feature-qa-scope.v1',
    policies: { 'caas-feature-qa-scope.v1': { file: 'scope-policy.v2.json', version: 1, sha256: 'a'.repeat(64) } },
  }), /file must be versioned/);
});

test('contract maker refuses to mislabel an unsupported behavior as an existing adapter', () => {
  const proposed = validateContractProposal({
    status: 'PROPOSAL',
    manifest: {
      id: 'card.proposal-example.v1', version: 1, kind: 'card-button-cta',
      scope: 'collection_initial_render', title: 'Proposal example', summary: 'A reusable existing adapter shape.', useWhen: ['A button CTA is rendered.'],
      params: {}, sourceHints: [{ file: 'react/src/js/components/Consonant/Cards/ButtonCard.jsx', symbol: 'ButtonCard', needles: ['overlay'] }],
    },
  }, 'card.proposal-example.v1');
  assert.equal(proposed.status, 'PROPOSED');
  assert.equal(proposed.manifest.id, 'card.proposal-example.v1');

  const needsAdapter = validateContractProposal({
    status: 'NEEDS_ADAPTER', reason: 'This needs a user interaction state machine.', neededCapabilities: ['controlled click transition'],
  }, 'card.proposal-example.v1');
  assert.equal(needsAdapter.status, 'NEEDS_ADAPTER');
  assert.equal(needsAdapter.neededCapabilities[0], 'controlled click transition');
  assert.throws(() => validateContractProposal({ status: 'NEEDS_ADAPTER', reason: 'Needs new behavior.' }), /at least one required capability/);
  assert.throws(() => validateContractProposal({ status: 'PROPOSAL', manifest: { id: 'wrong.v1' } }, 'card.proposal-example.v1'), /proposal id/);
});

test('managed Button Card compilation overwrites a model-crafted fixture with canonical raw fields', () => {
  const { plan, mode } = compileContractPlan({
    sourceTest: 'Button.spec.js > renders CTA',
    mappingEvidence: evidence,
    contract: { id: 'card.button-card-cta.v1', params: { id: 'qa-cta', ctaText: 'Learn more', overlayLink: 'https://example.test/cta' } },
    config: { unsafe: 'ignored' }, cards: [{ contentArea: { url: 'wrong place' } }], probes: [],
  }, { liveConfig });
  assert.equal(mode, 'managed');
  assert.equal(plan.contract.mode, 'managed');
  assert.equal(plan.cards[0].overlayLink, 'https://example.test/cta');
  assert.equal(plan.cards[0].footer[0].center[0].type, 'link');
  assert.equal(plan.cards[0].footer[0].center[0].style, 'button');
  assert.equal(plan.cards[0].footer[0].center[0].text, 'Learn more');
  assert.equal(plan.config.collection.cardStyle, 'button-card');
  assert.deepEqual(plan.config.collection.additionalRequestParams, {});
  assert.deepEqual(plan.ownedConfigPaths, ['collection.additionalRequestParams']);
  assert.equal(plan.probes.some((probe) => probe.selector.includes('a.consonant-ButtonCard-link')), true);
  const merged = buildScenarioConfig({ collection: { additionalRequestParams: { cmpid: 'live' } } }, plan.config, plan.cards,
    { ownedConfigPaths: plan.ownedConfigPaths });
  assert.deepEqual(merged.collection.additionalRequestParams, {}, 'contract clears inherited URL parameters');
  assert.throws(() => compileContractPlan({
    sourceTest: 'x', mappingEvidence: evidence,
    contract: { id: 'card.button-card-cta.v1', params: { id: 'bad selector!' } },
  }, { liveConfig }), /must be an identifier/);
});

test('metadata styles may use registered literals such as 1:2, while fixed contract invariants reject mutation', () => {
  const metadata = compileContractPlan({
    sourceTest: 'Card.spec.js > renders metadata', mappingEvidence: evidence,
    contract: { id: 'card.metadata-attributes.v1', params: { cardStyle: '1:2' } },
  }, { liveConfig }).plan;
  assert.equal(metadata.cards[0].styles.typeOverride, '1:2');
  assert.throws(() => compileContractPlan({
    sourceTest: 'Container.spec.js > removes events', mappingEvidence: evidence,
    contract: { id: 'collection.empty-events-removal.v1', params: { hostSelector: 'body' } },
  }, { liveConfig }), /unknown contract parameter/);
});

test('managed contract selection must be grounded in changed raw source research', () => {
  const selections = [
    ['card.metadata-attributes.v1', 'react/src/js/components/Consonant/Cards/Card.jsx', 124],
    ['collection.empty-events-removal.v1', 'react/src/js/components/Consonant/Container/Container.jsx', 407],
    ['filter.nested-filter-prune.v1', 'react/src/js/components/Consonant/Container/Container.jsx', 955],
    ['card.button-card-cta.v1', 'react/src/js/components/Consonant/Cards/ButtonCard.jsx', 24],
  ];
  for (const [id, file, line] of selections) {
    const result = compileContractPlan({
      sourceTest: `changed ${id} test`, mappingEvidence: [{ file, line, fact: 'changed source establishes this contract' }],
      contract: { id },
    }, { liveConfig, applicability: applicability(file, line) });
    assert.equal(result.mode, 'managed');
  }
  const base = {
    sourceTest: 'unrelated test', contract: { id: 'card.metadata-attributes.v1' },
    mappingEvidence: [{ file: 'react/src/js/components/Consonant/Cards/Card.jsx', line: 124, fact: 'metadata path' }],
  };
  assert.throws(() => compileContractPlan({ ...base, mappingEvidence: [{}] }, { liveConfig,
    applicability: applicability('react/src/js/components/Consonant/Cards/Card.jsx', 124) }), /mappingEvidence\[0\]\.file/);
  assert.throws(() => compileContractPlan(base, { liveConfig,
    applicability: applicability('react/src/js/components/Consonant/Cards/ButtonCard.jsx', 24) }), /CONTRACT_APPLICABILITY_UNPROVEN/);
  assert.throws(() => compileContractPlan(base, { liveConfig, applicability: {
    changedPaths: ['react/src/js/components/Consonant/Cards/Card.jsx'],
    researchSearches: [{ result: { matches: [{ file: 'react/src/js/components/Consonant/Cards/Card.jsx', line: 200, startLine: 199, endLine: 201 }] } }],
  } }), /CONTRACT_APPLICABILITY_UNPROVEN/);
});

test('empty-event and nested-filter contracts encode lifecycle and owned path rules', () => {
  const empty = compileContractPlan({
    sourceTest: 'Container.spec.js > remove empty events', mappingEvidence: evidence,
    contract: { id: 'collection.empty-events-removal.v1' },
  }, { liveConfig }).plan;
  assert.equal(new URL(empty.config.collection.endpoint).searchParams.get('originSelection'), 'events');
  assert.deepEqual(empty.cards, []);
  assert.equal(empty.assertions.some((assertion) => assertion.type === 'tracked'), true);

  const nested = compileContractPlan({
    sourceTest: 'LeftFilter.spec.js > prune nested leaf', mappingEvidence: evidence,
    contract: { id: 'filter.nested-filter-prune.v1' },
  }, { liveConfig }).plan;
  assert.deepEqual(nested.ownedConfigPaths, ['filterPanel.categoryMappings']);
  assert.equal(nested.config.filterPanel.filters[0].items[0].opened, true);
  assert.equal(nested.cards[0].tags.some((tag) => tag.id === 'caas:products/photoshop'), true);
});

test('exploratory plans remain possible but are explicitly labelled and keep their raw scenario', () => {
  const raw = {
    sourceTest: 'NewFeature.spec.js > works', mappingEvidence: evidence,
    contract: { id: EXPLORATORY_CONTRACT_ID, reason: 'no managed shape yet' },
    config: { collection: { cardStyle: 'new-style' } }, cards: [], filters: [], probes: [],
  };
  const compiled = compileContractPlan(raw, { liveConfig });
  assert.equal(compiled.mode, 'exploratory');
  assert.equal(compiled.plan.contract.id, EXPLORATORY_CONTRACT_ID);
  assert.deepEqual(compiled.plan.config, raw.config);
});

test('deterministic assertions pass only when bridge and DOM contract evidence agree', () => {
  const plan = compileContractPlan({
    sourceTest: 'Button.spec.js > renders CTA', mappingEvidence: evidence,
    contract: { id: 'card.button-card-cta.v1', params: { id: 'qa-cta', ctaText: 'Learn more', overlayLink: 'https://example.test/cta' } },
  }, { liveConfig }).plan;
  const observed = {
    bridge: { gateEnabled: true, override: { present: true, valid: true, replace: true }, target: { found: true } },
    probes: [
      { selector: 'li#qa-cta.button-card[data-testid="consonant-Card"]', matches: [{ cls: 'button-card consonant-Card', attributes: {} }] },
      { selector: 'li#qa-cta a.consonant-ButtonCard-link', matches: [{ text: 'Learn more', attributes: { href: 'https://example.test/cta' } }] },
      { selector: 'li#qa-cta a.consonant-LinkBlocker', matches: [] },
    ],
  };
  const pass = evaluateContractAssertions(plan, observed);
  assert.equal(pass.verdict, 'PASS');
  observed.bridge.target.found = false;
  assert.equal(evaluateContractAssertions(plan, observed).verdict, 'FAIL', 'a missing collection marker cannot certify a scoped fixture');
  observed.bridge.target.found = true;
  observed.probes[1].matches[0].attributes.href = 'https://wrong.test/';
  const fail = evaluateContractAssertions(plan, observed);
  assert.equal(fail.verdict, 'FAIL');
  assert.match(fail.reason, /probe/);
});

test('empty-events lifecycle requires every tracked published host to disconnect', () => {
  const plan = compileContractPlan({
    sourceTest: 'Container.spec.js > remove empty events', mappingEvidence: evidence,
    contract: { id: 'collection.empty-events-removal.v1' },
  }, { liveConfig }).plan;
  const selector = plan.probes[0].selector;
  const observed = {
    bridge: {
      gateEnabled: true, override: { present: true, valid: true, replace: true },
      target: { found: false },
      trackedNodes: [{ selector, connected: false }, { selector, connected: false }],
    },
    beforeFixture: {
      bridge: { gateEnabled: true, override: { present: true, valid: true, replace: true }, target: { found: true } },
      probes: [{ selector, matches: [{ id: 'caas' }, { id: 'caas' }] }],
    },
    probes: [{ selector, matches: [] }],
    diagnostics: { collectionRequests: ['https://example.test/collection?originSelection=events'] },
  };
  assert.equal(evaluateContractAssertions(plan, observed).verdict, 'PASS');
  observed.bridge.trackedNodes[1].connected = true;
  assert.equal(evaluateContractAssertions(plan, observed).verdict, 'FAIL');
});
