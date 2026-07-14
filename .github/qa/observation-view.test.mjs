import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildValidationView } from './observation-view.mjs';

const bigList = (n, tag) => Array.from({ length: n }, (_, i) => ({
  tag, text: 'x'.repeat(300), html: 'y'.repeat(700), n: i,
}));

test('probes and diagnostics survive even when generic DOM lists overflow the budget', () => {
  const observed = {
    cards: bigList(15, 'div'),
    headings: bigList(30, 'h3'),
    controls: bigList(40, 'button'),
    filters: bigList(40, 'div'),
    liveRegions: bigList(10, 'div'),
    collectionRoots: bigList(10, 'div'),
    probes: [{
      selector: "label[for='consonant-Select-btn']",
      attributes: ['for', 'aria-label'],
      matches: [{ tag: 'label', text: 'Sort by:', attributes: { 'data-testid': 'consonant-Select-label', for: 'consonant-Select-btn' } }],
    }],
    diagnostics: { collectionRequests: ['https://example.test/chimera-api/collection'], pageErrors: [] },
  };
  assert.ok(JSON.stringify(observed).length > 18000, 'fixture must exceed the validation budget');
  const parsed = JSON.parse(buildValidationView(observed, 18000));
  assert.equal(parsed.probes[0].matches[0].text, 'Sort by:');
  assert.equal(parsed.probes[0].matches[0].attributes['data-testid'], 'consonant-Select-label');
  assert.equal(parsed.diagnostics.collectionRequests.count, 1);
  assert.ok(Array.isArray(parsed.cards) && parsed.cards.length > 0);
});

test('bounds oversized probe matches while preserving the first match evidence and total count', () => {
  const matches = Array.from({ length: 40 }, (_, i) => ({
    tag: 'div', text: i === 0 ? 'Sort by:' : `m${i}`, html: 'h'.repeat(700),
    attributes: { 'data-testid': 'consonant-Select-label' },
  }));
  const observed = {
    probes: Array.from({ length: 6 }, (_, p) => ({ selector: `sel-${p}`, attributes: ['data-testid'], matches })),
    diagnostics: {},
  };
  // Raw probe payload is enormous (~6 * 40 * ~800 chars).
  assert.ok(JSON.stringify(observed.probes).length > 100000);
  const view = buildValidationView(observed, 18000);
  assert.ok(view.length <= 18000, `view length ${view.length} must stay within budget`);
  const parsed = JSON.parse(view);
  assert.equal(parsed.probes[0].matches[0].text, 'Sort by:');       // first-match evidence kept
  assert.equal(parsed.probes[0].matchCount, 40);                     // true count reported
  assert.ok(parsed.probes[0].matches.length < 40);                   // matches trimmed
});

test('bounds oversized diagnostics while preserving counts', () => {
  const observed = {
    probes: [{ selector: 'x', matches: [] }],
    diagnostics: {
      consoleErrors: Array.from({ length: 500 }, (_, i) => `error ${i} ${'z'.repeat(1000)}`),
      collectionRequests: ['https://example.test/chimera-api/collection'],
    },
  };
  assert.ok(JSON.stringify(observed.diagnostics).length > 100000);
  const view = buildValidationView(observed, 18000);
  assert.ok(view.length <= 18000, `view length ${view.length} must stay within budget`);
  const parsed = JSON.parse(view);
  assert.equal(parsed.diagnostics.consoleErrors.count, 500);
  assert.equal(parsed.diagnostics.collectionRequests.count, 1);
});

test('handles missing/empty observed safely', () => {
  const parsed = JSON.parse(buildValidationView(undefined, 100));
  assert.deepEqual(parsed.probes, []);
  assert.ok(parsed.diagnostics && typeof parsed.diagnostics === 'object');
});
