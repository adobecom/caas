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
    // probes are serialized LAST in the raw observed object -> the regression we are guarding.
    probes: [{
      selector: "label[for='consonant-Select-btn']",
      attributes: ['for', 'aria-label'],
      matches: [{
        tag: 'label',
        text: 'Sort by:',
        attributes: { 'data-testid': 'consonant-Select-label', for: 'consonant-Select-btn' },
      }],
    }],
    diagnostics: { collectionRequests: ['https://example.test/chimera-api/collection'], pageErrors: [] },
  };
  assert.ok(JSON.stringify(observed).length > 18000, 'fixture must exceed the validation budget');

  const parsed = JSON.parse(buildValidationView(observed, 18000));
  // The targeted probe evidence must be present in full.
  assert.equal(parsed.probes[0].matches[0].text, 'Sort by:');
  assert.equal(parsed.probes[0].matches[0].attributes['data-testid'], 'consonant-Select-label');
  // Diagnostics preserved.
  assert.equal(parsed.diagnostics.collectionRequests.length, 1);
  // Some generic context is still included as a fallback.
  assert.ok(Array.isArray(parsed.cards) && parsed.cards.length > 0);
});

test('stays within budget (plus small overhead) while including probes', () => {
  const observed = { controls: bigList(80, 'button'), probes: [{ selector: 'x', matches: [] }], diagnostics: {} };
  const view = buildValidationView(observed, 18000);
  assert.ok(view.length <= 18000 + 1200, `view length ${view.length} should stay near budget`);
  assert.ok(JSON.parse(view).probes.length === 1);
});

test('handles missing/empty observed safely', () => {
  const parsed = JSON.parse(buildValidationView(undefined, 100));
  assert.deepEqual(parsed.probes, []);
  assert.deepEqual(parsed.diagnostics, {});
});
