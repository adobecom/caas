import test from 'node:test';
import assert from 'node:assert/strict';
import {
  commentChange,
  disableAutoMerge,
  evaluateCandidate,
  nextConflictAction,
} from './safe-automerge.mjs';

const SHA = '1234567890abcdef1234567890abcdef12345678';
const successfulCheck = (name) => ({ name, status: 'completed', conclusion: 'success' });

function candidate(overrides = {}) {
  return {
    files: [{ path: 'package.json' }, { path: 'package-lock.json' }],
    commits: [{ authors: [{ login: 'dependabot[bot]' }], messageBody: '' }],
    headSha: SHA,
    behindBy: 0,
    mergeStateStatus: 'CLEAN',
    checkRuns: [successfulCheck('check-build')],
    statuses: [
      { context: 'build-output-diff', state: 'success', description: 'NO_CHANGE' },
      { context: 'review-score-gate', state: 'success' },
    ],
    ...overrides,
  };
}

test('allows a package-only Dependabot update with no shipped output change', () => {
  assert.deepEqual(evaluateCandidate(candidate()), {
    state: 'eligible',
    reason: 'package-only update, byte-identical build, and clean GitHub result',
  });
});

test('uses actual results instead of dependency type or version size', () => {
  assert.equal(evaluateCandidate(candidate({
    commits: [{
      authors: [{ login: 'dependabot[bot]' }],
      messageBody: 'dependency-type: direct:production\nupdate-type: version-update:semver-major',
    }],
  })).state, 'eligible');
});

test('routes changed output, non-package files, and non-Dependabot commits to review', () => {
  assert.equal(evaluateCandidate(candidate({
    statuses: [{ context: 'build-output-diff', state: 'success', description: 'CHANGED' }],
  })).state, 'review');
  assert.equal(evaluateCandidate(candidate({
    files: [{ path: 'package.json' }, { path: 'src/index.js' }],
  })).state, 'review');
  assert.equal(evaluateCandidate(candidate({
    commits: [{ authors: [{ login: 'person' }], messageBody: '' }],
  })).state, 'review');
});

test('routes old and conflicted branches through recovery', () => {
  assert.equal(evaluateCandidate(candidate({ behindBy: 2 })).state, 'behind');
  assert.equal(evaluateCandidate(candidate({ mergeStateStatus: 'DIRTY' })).state, 'conflict');
});

test('waits for running checks until GitHub has a final result', () => {
  assert.deepEqual(evaluateCandidate(candidate({
    mergeStateStatus: 'BLOCKED',
    checkRuns: [{ name: 'check-build', status: 'in_progress', conclusion: null }],
  })), { state: 'waiting', reason: 'waiting for check-build' });
});

test('trusts the current clean result over an older duplicate failure', () => {
  assert.equal(evaluateCandidate(candidate({
    checkRuns: [
      successfulCheck('deployment'),
      { name: 'deployment', status: 'completed', conclusion: 'failure' },
    ],
  })).state, 'eligible');
});

test('routes a final non-clean GitHub result to review', () => {
  assert.deepEqual(evaluateCandidate(candidate({
    mergeStateStatus: 'UNSTABLE',
    checkRuns: [{ name: 'deployment', status: 'completed', conclusion: 'failure' }],
  })), {
    state: 'review',
    reason: 'GitHub reports merge state UNSTABLE',
  });
});

test('updates the existing decision comment when its state or reason changes', () => {
  const marker = '<!-- dependabot-safe-automerge -->';
  const previous = `${marker}\n<!-- state:human;head:abc123 -->\nReason: check-linting concluded FAILURE`;
  const nextBody = '<!-- state:review;head:abc123 -->\nReason: GitHub reports merge state UNSTABLE';
  const next = `${marker}\n${nextBody}`;
  assert.deepEqual(commentChange([{ id: 42, body: previous }], marker, nextBody), {
    action: 'update',
    id: 42,
    body: next,
  });
  assert.deepEqual(commentChange([{ id: 42, body: next }], marker, nextBody), {
    action: 'none',
  });
});

test('keeps stale auto-merge armed in memory when GitHub fails to disable it', () => {
  const autoMergeRequest = { enabledAt: '2026-09-18T12:00:00Z' };
  const pr = { number: 42, autoMergeRequest };
  assert.throws(
    () => disableAutoMerge('adobecom/caas', pr, () => {
      throw new Error('GitHub rejected --disable-auto');
    }),
    /GitHub rejected --disable-auto/,
  );
  assert.equal(pr.autoMergeRequest, autoMergeRequest);
});

test('clears stale auto-merge in memory only after GitHub disables it', () => {
  const calls = [];
  const pr = { number: 42, autoMergeRequest: { enabledAt: '2026-09-18T12:00:00Z' } };
  disableAutoMerge('adobecom/caas', pr, (args) => calls.push(args));
  assert.deepEqual(calls, [[
    'pr', 'merge', '42', '--repo', 'adobecom/caas', '--disable-auto',
  ]]);
  assert.equal(pr.autoMergeRequest, null);
});

test('conflict recovery waits, rebases, recreates, then escalates', () => {
  const now = Date.parse('2026-08-18T12:00:00Z');
  const base = { headSha: SHA, pureDependabotCommits: true, now, comments: [] };
  assert.equal(nextConflictAction({ ...base, headUpdatedAt: '2026-08-18T11:45:00Z' }).action, 'wait');
  assert.equal(nextConflictAction({ ...base, headUpdatedAt: '2026-08-18T10:00:00Z' }).action, 'rebase');
  assert.equal(nextConflictAction({
    ...base,
    headUpdatedAt: '2026-08-18T08:00:00Z',
    comments: [{ createdAt: '2026-08-18T09:00:00Z', body: `${CONFLICT('rebase')} ${SHA}` }],
  }).action, 'recreate');
  assert.equal(nextConflictAction({
    ...base,
    headUpdatedAt: '2026-08-18T06:00:00Z',
    comments: [{ createdAt: '2026-08-18T09:00:00Z', body: `${CONFLICT('recreate')} ${SHA}` }],
  }).action, 'review');
});

function CONFLICT(action) {
  return `<!-- dependabot-conflict-recovery:${action}:${SHA} -->`;
}
