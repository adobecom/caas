import test from 'node:test';
import assert from 'node:assert/strict';
import {
  commentChange,
  disableAutoMerge,
  evaluateCandidate,
  extractAgentVerdict,
  extractDependencyMetadata,
  nextConflictAction,
} from './safe-automerge.mjs';

const SHA = '1234567890abcdef1234567890abcdef12345678';
const agentComment = (verdict = 'PASS', headSha = SHA.slice(0, 7)) => ({
  body: `<!-- agent-qa-review -->\n<!-- qa-verdict-b64: ${Buffer.from(JSON.stringify({ verdict, headSha })).toString('base64')} -->`,
});
const success = (name) => ({ name, conclusion: 'success' });
const requiredChecks = [
  'Adobe CLA Signed?', 'agent-review', 'check-build', 'check-coverage-thresholds',
  'check-linting', 'check-test-requirements', 'run-unit-tests',
].map(success);

function candidate(overrides = {}) {
  return {
    files: [{ path: 'package.json' }, { path: 'package-lock.json' }],
    commits: [{
      authors: [{ login: 'dependabot[bot]' }],
      messageBody: 'dependency-type: direct:development\nupdate-type: version-update:semver-patch',
    }],
    comments: [agentComment()],
    headSha: SHA,
    behindBy: 0,
    mergeStateStatus: 'CLEAN',
    checkRuns: requiredChecks,
    statuses: [
      { context: 'build-output-diff', state: 'success', description: 'NO_CHANGE' },
      { context: 'review-score-gate', state: 'success' },
    ],
    ...overrides,
  };
}

test('extracts current Agent QA verdict', () => {
  assert.deepEqual(extractAgentVerdict([agentComment()], SHA), { verdict: 'PASS', current: true });
  assert.deepEqual(extractAgentVerdict([agentComment('PASS', 'fffffff')], SHA), { verdict: 'PASS', current: false });
});

test('accepts the legacy Agent QA header only for its reviewed head', () => {
  const encoded = Buffer.from(JSON.stringify({ verdict: 'PASS', sinceSha: '' })).toString('base64');
  const comment = { body: `<!-- agent-qa-review -->\n_Last updated now · commit \`1234567\`._\n<!-- qa-verdict-b64: ${encoded} -->` };
  assert.deepEqual(extractAgentVerdict([comment], SHA), { verdict: 'PASS', current: true });
});

test('extracts Dependabot metadata', () => {
  assert.deepEqual(extractDependencyMetadata(candidate().commits), {
    dependencyTypes: ['direct:development'],
    updateTypes: ['version-update:semver-patch'],
  });
});

test('allows only a fully safe candidate', () => {
  assert.equal(evaluateCandidate(candidate()).state, 'eligible');
  assert.equal(evaluateCandidate(candidate({
    statuses: [{ context: 'build-output-diff', state: 'success', description: 'CHANGED' }],
  })).state, 'review');
  assert.equal(evaluateCandidate(candidate({ comments: [agentComment('FAIL')] })).state, 'review');
  assert.equal(evaluateCandidate(candidate({ behindBy: 2 })).state, 'behind');
});

test('routes skipped and neutral required checks to review', () => {
  for (const conclusion of ['skipped', 'neutral']) {
    const checkRuns = requiredChecks.map((check) => check.name === 'check-build'
      ? { ...check, conclusion }
      : check);
    assert.deepEqual(evaluateCandidate(candidate({ checkRuns })), {
      state: 'review',
      reason: `check-build concluded ${conclusion.toUpperCase()}`,
    });
  }
});

test('updates the existing decision comment when its state or reason changes', () => {
  const marker = '<!-- dependabot-safe-automerge -->';
  const previous = `${marker}\n<!-- state:human;head:abc123 -->\nReason: check-linting concluded FAILURE`;
  const nextBody = '<!-- state:review;head:abc123 -->\nReason: Agent QA verdict is FAIL';
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

test('allows production patches but keeps production minor and development major updates for review', () => {
  assert.equal(evaluateCandidate(candidate({
    commits: [{
      authors: [{ login: 'dependabot[bot]' }],
      messageBody: 'dependency-type: direct:production\nupdate-type: version-update:semver-patch',
    }],
  })).state, 'eligible');
  assert.equal(evaluateCandidate(candidate({
    commits: [{
      authors: [{ login: 'dependabot[bot]' }],
      messageBody: 'dependency-type: direct:production\nupdate-type: version-update:semver-minor',
    }],
  })).state, 'review');
  assert.equal(evaluateCandidate(candidate({
    commits: [{
      authors: [{ login: 'dependabot[bot]' }],
      messageBody: 'dependency-type: direct:development\nupdate-type: version-update:semver-major',
    }],
  })).state, 'review');
});

test('keeps grouped indirect updates in review even without update-type metadata', () => {
  const result = evaluateCandidate(candidate({
    commits: [{
      authors: [{ login: 'dependabot[bot]' }],
      messageBody: 'dependency-type: direct:development\ndependency-type: indirect\ndependency-group: npm_and_yarn',
    }],
  }));
  assert.deepEqual(result, {
    state: 'review',
    reason: 'Dependabot update-type metadata is missing',
  });
});

test('does not let an optional preview failure override the deterministic gates', () => {
  assert.equal(evaluateCandidate(candidate({
    mergeStateStatus: 'UNSTABLE',
    checkRuns: [
      ...requiredChecks,
      { name: 'deployment', conclusion: 'failure' },
      { name: 'run-e2e-tests', conclusion: 'skipped' },
      { name: 'run-accessibility-checks', conclusion: 'skipped' },
      { name: 'run-core-web-vitals-checks', conclusion: 'skipped' },
    ],
  })).state, 'eligible');
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
