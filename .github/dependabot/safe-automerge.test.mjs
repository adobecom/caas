import test from 'node:test';
import assert from 'node:assert/strict';
import {
  commentChange,
  disableAutoMerge,
  evaluateCandidate,
  hasQaPass,
  nextConflictAction,
  qaHeadSha,
  selectQueueCandidate,
  shouldRequeueAfterQa,
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
    comments: [{ createdAt: '2026-08-18T11:00:00Z', body: `${CONFLICT('rebase')} ${SHA}` }],
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

// QA PASS override (local QA by the reviewer account on the exact head SHA).
const QA = (result, { login = 'sanrai', head = SHA, at = '2026-11-09T19:00:00Z' } = {}) => ({
  author: { login }, createdAt: at,
  body: `**QA result: ${result}**\n\n- Head [\`${head.slice(0, 7)}\`](https://github.com/adobecom/caas/commit/${head})`,
});

test('QA PASS counts only from the reviewer, on the exact head, as the latest result', () => {
  assert.equal(hasQaPass([QA('PASS')], SHA), true);
  assert.equal(hasQaPass([QA('PASS', { login: 'SanRai' })], SHA), true);
  assert.equal(hasQaPass([QA('PASS', { login: 'raissanjay' })], SHA), false);
  assert.equal(hasQaPass([QA('PASS', { head: 'f'.repeat(40) })], SHA), false);
  assert.equal(hasQaPass([QA('PASS'), QA('issues', { at: '2026-11-09T20:00:00Z' })], SHA), false);
  assert.equal(hasQaPass([QA('inconclusive'), QA('PASS', { at: '2026-11-09T20:00:00Z' })], SHA), true);
  assert.equal(hasQaPass([{ author: { login: 'sanrai' }, body: `QA result: PASS ${SHA}` }], SHA), false);
});

test('QA PASS lets a changed bundle merge; without it the bundle still needs review', () => {
  const changedBundle = { statuses: [{ context: 'build-output-diff', state: 'success', description: 'CHANGED' }] };
  assert.equal(evaluateCandidate(candidate(changedBundle)).state, 'review');
  assert.deepEqual(evaluateCandidate(candidate({ ...changedBundle, qaPass: true })), {
    state: 'eligible',
    reason: 'QA PASS on this head; shipped build changed and was tested',
  });
});

test('QA PASS clears non-required failures but never required ones or other gates', () => {
  const deployFailed = {
    mergeStateStatus: 'UNSTABLE',
    checkRuns: [{ name: 'deployment', status: 'completed', conclusion: 'failure' }],
  };
  assert.equal(evaluateCandidate(candidate({ ...deployFailed, qaPass: true })).state, 'eligible');
  assert.equal(evaluateCandidate(candidate({
    qaPass: true, mergeStateStatus: 'BLOCKED',
    checkRuns: [{ name: 'run-unit-tests', status: 'completed', conclusion: 'failure' }],
  })).state, 'review');
  assert.equal(evaluateCandidate(candidate({
    qaPass: true, files: [{ path: 'package.json' }, { path: 'src/index.js' }],
  })).state, 'review');
  assert.equal(evaluateCandidate(candidate({
    qaPass: true, commits: [{ authors: [{ login: 'person' }] }],
  })).state, 'review');
  assert.equal(evaluateCandidate(candidate({ qaPass: true, behindBy: 1 })).state, 'behind');
  assert.equal(evaluateCandidate(candidate({
    qaPass: true, statuses: [], checkRuns: [{ name: 'build-output-diff', status: 'completed', conclusion: 'failure' }],
  })).state, 'review');
  // Optional CI AI reviews still running must not hold or disarm a QA-passed merge.
  assert.equal(evaluateCandidate(candidate({
    ...deployFailed, qaPass: true,
    checkRuns: [...deployFailed.checkRuns, { name: 'agent-review', status: 'in_progress' }],
  })).state, 'eligible');
  // A required check still running shows as BLOCKED, which keeps waiting.
  assert.equal(evaluateCandidate(candidate({
    qaPass: true, mergeStateStatus: 'BLOCKED',
    checkRuns: [{ name: 'check-build', status: 'in_progress' }],
  })).state, 'waiting');
});

test('QA PASS requeues only reviews it can clear', () => {
  const decision = (reason) => ({
    body: `<!-- dependabot-safe-automerge -->\n<!-- state:review;head:${SHA} -->\n- Reason: ${reason}`,
  });
  const requeue = (reason) => shouldRequeueAfterQa([decision(reason), QA('PASS')], SHA);
  assert.equal(requeue('shipped build output is not byte-identical (CHANGED)'), true);
  assert.equal(requeue('deployment concluded failure'), true);
  assert.equal(requeue('GitHub reports merge state UNSTABLE'), true);
  assert.equal(requeue('build-output-diff concluded failure'), false);
  assert.equal(requeue('contains commits not authored by Dependabot'), false);
  assert.equal(requeue('changes files outside package.json and package-lock.json'), false);
  assert.equal(requeue('still conflicted two hours after recreate'), false);
  assert.equal(shouldRequeueAfterQa([QA('PASS')], SHA), true);
  assert.equal(shouldRequeueAfterQa([decision('deployment concluded failure')], SHA), false);
});

test('reads the head SHA from the Head line, not the base SHA beside it', () => {
  const base = 'b'.repeat(40);
  const body = `**QA result: PASS**\n- Head [\`1234567\`](https://github.com/adobecom/caas/commit/${SHA}), base (main) [\`bbbbbbb\`](https://github.com/adobecom/caas/commit/${base})`;
  assert.equal(qaHeadSha(body), SHA);
  assert.equal(hasQaPass([{ author: { login: 'sanrai' }, body }], base), false);
});

// Regression: the reviewer's real comments (#685, #686, #687) name the head as
// plain text, not a link. Excerpts copied from those comments.
const REAL_QA = {
  685: ['1efe320d650e2f340fc3cdd88281d42d1fadd6f8', '- Head 1efe320d650e2f340fc3cdd88281d42d1fadd6f8, base (main) 59b0b92bcb892fcdb304c12316f60f0f3a94d616, Node 24.22.1.'],
  686: ['400f0377a41ec7e57bcbb299b687724b8f2cf495', '- Head 400f0377a41ec7e57bcbb299b687724b8f2cf495, base (main) 59b0b92bcb892fcdb304c12316f60f0f3a94d616'],
  687: ['544189377c06b1c9b135cbf11ef338003cf06240', '- Head 544189377c06b1c9b135cbf11ef338003cf06240, base (main) 59b0b92bcb892fcdb304c12316f60f0f3a94d616'],
};

test('recognises the QA reviewer\'s real plain-SHA comments and never the base SHA', () => {
  for (const [head, line] of Object.values(REAL_QA)) {
    const body = `**QA result: PASS**\n\nShould this merge? Yes.\n\n**Details**\n\n${line}`;
    assert.equal(qaHeadSha(body), head);
    assert.equal(hasQaPass([{ author: { login: 'sanrai' }, createdAt: '2026-11-09T19:00:00Z', body }], head), true);
    assert.equal(hasQaPass([{ author: { login: 'sanrai' }, body }], '59b0b92bcb892fcdb304c12316f60f0f3a94d616'), false);
  }
});
