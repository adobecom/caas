import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { contractCatalogHealth } from '../contract-maker.mjs';
import { evaluateContractAssertions } from './assertions.mjs';
import { EXPLORATORY_CONTRACT_ID, contractCatalogGuidance, listScenarioContracts, validateContractManifest } from './catalog.mjs';
import { compileContractPlan } from './compiler.mjs';

const evidence = [{ file: 'react/src/js/components/Consonant/Cards/ButtonCard.jsx', line: 24, fact: 'reads overlayLink' }];
const liveConfig = { collection: { endpoint: 'https://business.adobe.com/chimera-api/collection?originSelection=bacom' } };

test('catalog exposes only versioned, inert managed contracts plus an exploratory escape hatch', () => {
  assert.deepEqual(listScenarioContracts().map((contract) => contract.id), [
    'card.button-card-cta.v1',
    'card.metadata-attributes.v1',
    'collection.empty-events-removal.v1',
    'filter.nested-filter-prune.v1',
  ]);
  assert.match(contractCatalogGuidance(), /card\.button-card-cta\.v1/);
  assert.match(contractCatalogGuidance(), new RegExp(EXPLORATORY_CONTRACT_ID.replaceAll('.', '\\.')));
  assert.throws(() => validateContractManifest({ id: 'bad.v1', version: 1, kind: 'javascript', title: 'x', summary: 'x', useWhen: ['x'] }),
    /unsupported contract kind/);
});

test('catalog health is read-only and verifies the current source hints', () => {
  const report = contractCatalogHealth(path.resolve(process.cwd(), '../..'));
  assert.equal(report.status, 'HEALTHY');
  assert.equal(report.contractCount, 4);
  assert.deepEqual(report.issues, []);
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
  assert.equal(plan.probes.some((probe) => probe.selector.includes('a.consonant-ButtonCard-link')), true);
  assert.throws(() => compileContractPlan({
    sourceTest: 'x', mappingEvidence: evidence,
    contract: { id: 'card.button-card-cta.v1', params: { id: 'bad selector!' } },
  }, { liveConfig }), /must be an identifier/);
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
    bridge: { gateEnabled: true, override: { present: true, valid: true, replace: true } },
    probes: [
      { selector: 'li#qa-cta.button-card[data-testid="consonant-Card"]', matches: [{ cls: 'button-card consonant-Card', attributes: {} }] },
      { selector: 'li#qa-cta a.consonant-ButtonCard-link', matches: [{ text: 'Learn more', attributes: { href: 'https://example.test/cta' } }] },
      { selector: 'li#qa-cta a.consonant-LinkBlocker', matches: [] },
    ],
  };
  const pass = evaluateContractAssertions(plan, observed);
  assert.equal(pass.verdict, 'PASS');
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
      trackedNodes: [{ selector, connected: false }, { selector, connected: false }],
    },
    beforeFixture: { probes: [{ selector, matches: [{ id: 'caas' }, { id: 'caas' }] }] },
    probes: [{ selector, matches: [] }],
    diagnostics: { collectionRequests: ['https://example.test/collection?originSelection=events'] },
  };
  assert.equal(evaluateContractAssertions(plan, observed).verdict, 'PASS');
  observed.bridge.trackedNodes[1].connected = true;
  assert.equal(evaluateContractAssertions(plan, observed).verdict, 'FAIL');
});
