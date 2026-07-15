import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyPair, parsePrNumbers } from './feature-backtest-batch.mjs';

test('parses and deduplicates a bounded PR list', () => {
  assert.deepEqual(parsePrNumbers('532, 490 532'), [532, 490]);
  assert.throws(() => parsePrNumbers(''), /BACKTEST_PRS/);
  assert.throws(() => parsePrNumbers('532,nope'), /BACKTEST_PRS/);
  assert.throws(() => parsePrNumbers(Array.from({ length: 13 }, (_, index) => index + 1).join(',')), /12 PRs/);
});

test('requires post pass and pre fail for a discriminating behavior test', () => {
  assert.equal(classifyPair({ status: 'PASS' }, { status: 'FAIL' }).outcome, 'DISCRIMINATING_PASS');
  assert.equal(classifyPair({ status: 'PASS' }, { status: 'PASS' }).outcome, 'NON_DISCRIMINATING');
  assert.equal(classifyPair({ status: 'FAIL' }, null).outcome, 'POST_FAIL');
  assert.equal(classifyPair({ status: 'SKIPPED', reason: 'refactor' }, null).outcome, 'SKIPPED');
  assert.equal(classifyPair({ status: 'PASS', contract: { mode: 'exploratory' } }, { status: 'FAIL' }).outcome,
    'EXPLORATORY_DISCRIMINATING_PASS');
});
