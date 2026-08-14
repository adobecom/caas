import assert from 'node:assert/strict';
import { test } from 'node:test';
import { diffSignatures, summarizeDiff } from './dom-diff.mjs';

test('identical renders = no change', () => {
  const sig = { classes: { 'blade-card': 3 }, testids: ['a'], attrs: {}, tags: { li: 3 }, texts: ['x'] };
  assert.equal(diffSignatures(sig, sig).changed, false);
});
test('injected echo class cancels; new derived class shows', () => {
  const d = diffSignatures({ classes: { 'blade-card': 3 } }, { classes: { 'blade-card': 3, reverse: 3, 'light-text': 3 } });
  assert.deepEqual(d.addedClasses, ['light-text', 'reverse']);
  assert.equal(d.addedClasses.includes('blade-card'), false);
  assert.equal(d.changed, true);
});
test('new attribute + new testid caught', () => {
  const d = diffSignatures({ attrs: {}, testids: ['card'] }, { attrs: { 'data-country=us': 2 }, testids: ['card', 'consonant-Card-label-product-info'] });
  assert.deepEqual(d.addedAttrs, ['data-country=us']);
  assert.deepEqual(d.addedTestids, ['consonant-Card-label-product-info']);
});
test('reorder / new text caught', () => {
  assert.equal(diffSignatures({ texts: ['US', 'DE', 'FR'] }, { texts: ['DE', 'FR', 'US'] }).textChanged, true);
  assert.equal(diffSignatures({ texts: ['some details'] }, { texts: ['Acrobat'] }).textChanged, true);
});
