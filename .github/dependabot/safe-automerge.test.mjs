import test from 'node:test';
import assert from 'node:assert/strict';
import {
  commentChange,
  disableAutoMerge,
  evaluateCandidate,
  failedCheckReview,
  nextConflictAction,
  reviewRecovery,
  selectQueueCandidate,
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
    reason: 'deployment concluded failure',
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

test('keeps an existing queue owner instead of starting another PR', () => {
  const prs = [
    { number: 10, createdAt: '2026-08-18T08:00:00Z', labels: [{ name: 'dependencies-queued' }] },
    { number: 11, createdAt: '2026-08-18T09:00:00Z', labels: [{ name: 'dependencies-active' }] },
    { number: 12, createdAt: '2026-08-18T10:00:00Z', labels: [] },
  ];
  assert.equal(selectQueueCandidate(prs).number, 11);

  prs[1].labels = [{ name: 'dependencies-queued' }];
  prs[2].autoMergeRequest = { enabledAt: '2026-08-18T11:00:00Z' };
  assert.equal(selectQueueCandidate(prs).number, 12);
});

test('selects the oldest waiting PR and leaves a newer PR at the back', () => {
  const prs = [
    { number: 12, createdAt: '2026-08-18T10:00:00Z', labels: [] },
    { number: 10, createdAt: '2026-08-18T08:00:00Z', labels: [{ name: 'dependencies-review' }] },
    { number: 11, createdAt: '2026-08-18T09:00:00Z', labels: [{ name: 'dependencies-queued' }] },
  ];
  assert.equal(selectQueueCandidate(prs).number, 11);
  assert.equal(selectQueueCandidate(prs.filter(({ number }) => number !== 11)).number, 12);
  assert.equal(selectQueueCandidate(prs.filter(({ number }) => number === 10)), null);
});

test('selected conflict recovery rebases, waits, recreates, then escalates', () => {
  const now = Date.parse('2026-08-18T12:00:00Z');
  const base = { headSha: SHA, pureDependabotCommits: true, now, comments: [] };
  assert.equal(nextConflictAction(base).action, 'rebase');
  assert.equal(nextConflictAction({
    ...base,
    comments: [{ createdAt: '2026-08-18T11:00:00Z', body: `${CONFLICT('rebase')} ${SHA}`, reactionGroups: ACK }],
  }).action, 'wait');
  assert.equal(nextConflictAction({
    ...base,
    comments: [{ createdAt: '2026-08-18T09:00:00Z', body: `${CONFLICT('rebase')} ${SHA}` }],
  }).action, 'recreate');
  assert.equal(nextConflictAction({
    ...base,
    comments: [{ createdAt: '2026-08-18T09:00:00Z', body: `${CONFLICT('recreate')} ${SHA}` }],
  }).action, 'review');
});

const ACK = [{ content: 'THUMBS_UP', users: { totalCount: 1 } }];

test('asks Dependabot again when it ignores a request, then waits for the normal timer', () => {
  const now = Date.parse('2026-08-18T12:00:00Z');
  const base = { headSha: SHA, pureDependabotCommits: true, now };
  const request = (minutesAgo, action = 'rebase', reactionGroups = []) => ({
    createdAt: new Date(now - minutesAgo * 60000).toISOString(), body: `${CONFLICT(action)} ${SHA}`, reactionGroups,
  });
  assert.equal(nextConflictAction({ ...base, comments: [request(10)] }).action, 'wait');
  const retry = nextConflictAction({ ...base, comments: [request(20)] });
  assert.deepEqual([retry.action, retry.attempt], ['rebase', 2]);
  assert.equal(nextConflictAction({ ...base, comments: [request(20, 'rebase', ACK)] }).action, 'wait');
  const third = nextConflictAction({ ...base, comments: [request(50), request(20)] });
  assert.deepEqual([third.action, third.attempt], ['rebase', 3]);
  assert.equal(nextConflictAction({ ...base, comments: [request(80), request(50), request(20)] }).action, 'wait');
  // Escalation still counts from the first request, not the latest retry.
  assert.equal(nextConflictAction({ ...base, comments: [request(130), request(20)] }).action, 'recreate');
  const recreate = nextConflictAction({ ...base, comments: [request(200), request(20, 'recreate')] });
  assert.deepEqual([recreate.action, recreate.attempt], ['recreate', 2]);
});

function CONFLICT(action) {
  return `<!-- dependabot-conflict-recovery:${action}:${SHA} -->`;
}

// Regression: #653 held the only queue slot after the comparison build failed
// before publishing a build-output-diff status.
for (const conclusion of ['failure', 'cancelled', 'timed_out', 'action_required', 'startup_failure', 'stale', 'skipped']) {
  test(`releases a comparison that concluded ${conclusion} without a status`, () => {
    const result = evaluateCandidate(candidate({
      mergeStateStatus: 'BLOCKED', statuses: [],
      checkRuns: [{ id: 10, name: 'build-output-diff', status: 'completed', conclusion }],
    }));
    assert.equal(result.state, 'review');
    assert.match(result.reason, /build-output-diff concluded/);
  });
}

test('does not let a failed build wait forever for a missing comparison status', () => {
  assert.equal(evaluateCandidate(candidate({
    mergeStateStatus: 'BLOCKED', statuses: [],
    checkRuns: [{ name: 'check-build', status: 'completed', conclusion: 'failure' }],
  })).state, 'review');
});

test('waits for a newer comparison attempt and accepts a successful rerun', () => {
  const failed = { id: 10, name: 'build-output-diff', status: 'completed', conclusion: 'failure' };
  for (const status of ['queued', 'in_progress']) {
    assert.equal(evaluateCandidate(candidate({
      checkRuns: [failed, { id: 11, name: 'build-output-diff', status, conclusion: null }],
    })).state, 'waiting');
  }
  assert.equal(evaluateCandidate(candidate({
    checkRuns: [failed, { id: 11, ...successfulCheck('build-output-diff') }],
  })).state, 'eligible');
});

test('missing or pending comparison evidence never allows a merge', () => {
  for (const statuses of [[], [{ context: 'build-output-diff', state: 'pending' }]]) {
    assert.equal(evaluateCandidate(candidate({ statuses })).state, 'waiting');
  }
  for (const state of ['failure', 'error']) {
    assert.equal(evaluateCandidate(candidate({
      statuses: [{ context: 'build-output-diff', state }],
    })).state, 'review');
  }
});

test('a failed comparison moves out of the queue so the next PR is selected', () => {
  const failed = { number: 653, createdAt: '2026-10-08', labels: [{ name: 'dependencies-active' }] };
  const next = { number: 658, createdAt: '2026-10-09', labels: [{ name: 'dependencies-queued' }] };
  assert.equal(selectQueueCandidate([failed, next]).number, 653);
  const decision = evaluateCandidate(candidate({
    statuses: [], checkRuns: [{ name: 'build-output-diff', status: 'completed', conclusion: 'failure' }],
  }));
  assert.equal(decision.state, 'review');
  failed.labels = [{ name: `dependencies-${decision.state}` }];
  assert.equal(selectQueueCandidate([failed, next]).number, 658);
});

const OTHER_SHA = 'abcdefabcdefabcdefabcdefabcdefabcdefabcd';
const decisionComment = (reason, head = SHA, state = 'review') => ({
  body: `<!-- dependabot-safe-automerge -->\n<!-- state:${state};head:${head} -->\n### title\n\n- Reason: ${reason}`,
});
const deploy = (id, status, conclusion) => ({ id, name: 'deployment', status, conclusion });

test('reads only failed-check reviews from the controller decision', () => {
  assert.deepEqual(failedCheckReview([decisionComment('deployment concluded failure')]),
    { headSha: SHA, checkName: 'deployment' });
  for (const reason of [
    'changes files outside package.json and package-lock.json',
    'contains commits not authored by Dependabot',
    'shipped build output is not byte-identical (CHANGED)',
    'still conflicted two hours after recreate',
  ]) {
    assert.equal(failedCheckReview([decisionComment(reason)]), null);
  }
  assert.equal(failedCheckReview([]), null);
  assert.equal(failedCheckReview([decisionComment('deployment concluded failure', SHA, 'ready')]), null);
});

test('returns a failed-check review to the queue once that check passes', () => {
  const review = failedCheckReview([decisionComment('deployment concluded failure')]);
  const recover = (checkRuns, headSha = SHA) => reviewRecovery({ review, headSha, checkRuns }).action;
  assert.equal(recover([deploy(1, 'completed', 'failure')]), 'keep');
  assert.equal(recover([deploy(1, 'completed', 'failure'), deploy(2, 'in_progress')]), 'keep');
  assert.equal(recover([deploy(1, 'completed', 'failure'), deploy(3, 'completed', 'success')]), 'requeue');
  assert.equal(recover([]), 'keep');
});

test('a new head is requeued unless the same check already failed or is running there', () => {
  const review = failedCheckReview([decisionComment('build-output-diff concluded failure', OTHER_SHA)]);
  const recover = (checkRuns) => reviewRecovery({ review, headSha: SHA, checkRuns }).action;
  assert.equal(recover([]), 'requeue');
  assert.equal(recover([{ id: 1, name: 'build-output-diff', status: 'completed', conclusion: 'failure' }]), 'keep');
  assert.equal(recover([{ id: 1, name: 'build-output-diff', status: 'queued' }]), 'keep');
  assert.equal(reviewRecovery({ review: null, headSha: SHA }).action, 'keep');
});
