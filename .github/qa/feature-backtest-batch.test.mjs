import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyPair, parsePrNumbers, shouldReplayPre, summarizeBacktestResult } from './feature-backtest-batch.mjs';

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

test('keeps a no-catalog capability gap in the batch summary', () => {
  const summary = summarizeBacktestResult({
    pr: 304,
    title: 'Static card modifier',
    promptProfile: 'lean-contracts-v1',
    post: {
      status: 'SKIPPED',
      promptProfile: 'lean-contracts-v1',
      coverage: 'NEEDS_CONTRACT',
      coverageScope: 'collection_initial_render',
      reason: 'NEEDS_CONTRACT: needs a static card modifier adapter',
      neededCapabilities: ['compile and assert the static modifier'],
    },
    pre: null,
  });
  assert.equal(summary.outcome, 'SKIPPED');
  assert.equal(summary.coverage, 'NEEDS_CONTRACT');
  assert.equal(summary.coverageScope, 'collection_initial_render');
  assert.deepEqual(summary.neededCapabilities, ['compile and assert the static modifier']);
  assert.equal(summary.pre, null);
  assert.equal(shouldReplayPre({ status: 'SKIPPED' }, true), false);
  assert.equal(shouldReplayPre({ status: 'PASS' }, false), false);
  assert.equal(shouldReplayPre({ status: 'PASS' }, true), true);
});
