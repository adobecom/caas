import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateScenario } from './schema-validate.mjs';

test('accepts a correct config patch + cards', () => {
  const r = validateScenario({ configPatch: { collection: { cardStyle: 'blade-card', bladeCard: { reverse: true } } }, cards: [{ id: 'c1', styles: { typeOverride: 'blade-card' } }] });
  assert.equal(r.valid, true, r.errors);
});
test('rejects an invalid enum value with a precise error', () => {
  const r = validateScenario({ configPatch: { collection: { cardStyle: 'blade-cardz' } } });
  assert.equal(r.valid, false);
  assert.match(r.errors, /cardStyle/);
});
test('rejects an invented top-level config section', () => {
  const r = validateScenario({ configPatch: { collectionn: {} } });
  assert.equal(r.valid, false);
  assert.match(r.errors, /additional/i);
});
test('accepts unlisted collection flags (evolving), rejects bad sort', () => {
  assert.equal(validateScenario({ configPatch: { collection: { someFutureFlag: true } } }).valid, true);
  assert.equal(validateScenario({ configPatch: { sort: { defaultSort: 'newest' } } }).valid, false);
});
