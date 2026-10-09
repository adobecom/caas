import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, run, serverReviewSafety } from './ordinary.mjs';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = 'adobecom/caas';
const fixture = () => ({
  pr: { number: 1, state: 'open', draft: false, base: { ref: 'main' }, head: { sha: 'head', ref: 'feature', repo: { full_name: repo } }, user: { login: 'author', type: 'User' }, labels: [{ name: 'ordinary-automerge' }], mergeable: true, mergeable_state: 'clean', auto_merge: null },
  base: 'base', view: { headRefOid: 'head', mergeStateStatus: 'CLEAN', reviewDecision: 'APPROVED' },
  rules: [{ type: 'required_status_checks', parameters: { strict_required_status_checks_policy: true, required_status_checks: [{ context: 'build', integration_id: 7 }, { context: 'review-score-gate' }] } }, { type: 'pull_request', parameters: { required_approving_review_count: 1, dismiss_stale_reviews_on_push: true } }],
  comparison: { behind_by: 0, status: 'ahead' },
  checks: [{ id: 1, name: 'build', app: { id: 7 }, head_sha: 'head', status: 'completed', conclusion: 'success' }],
  statuses: [{ id: 1, sha: 'head', context: 'review-score-gate', state: 'success', created_at: '2026-10-09T12:01:00Z' }],
  reviews: [{ id: 1, user: { login: 'sanrai' }, state: 'APPROVED', commit_id: 'head', submitted_at: '2026-10-09T12:00:00Z' }], protection: null,
});

test('eligible current reviewed head; newer successful rerun supersedes failure', () => {
  const s = fixture();
  assert.equal(evaluate(s, repo).eligible, true);
  s.checks.push({ ...s.checks[0], id: 0, conclusion: 'failure' });
  assert.equal(evaluate(s, repo).eligible, true);
});

const blocked = {
  draft: (s) => { s.pr.draft = true; },
  fork: (s) => { s.pr.head.repo.full_name = 'outside/repo'; },
  dependabot: (s) => { s.pr.user.type = 'Bot'; s.pr.user.login = 'dependabot[bot]'; },
  queue: (s) => { s.pr.labels.push({ name: 'dependencies-active' }); },
  optout: (s) => { s.pr.labels = []; },
  armed: (s) => { s.pr.auto_merge = {}; },
  conflict: (s) => { s.pr.mergeable = false; },
  unknown: (s) => { s.view.mergeStateStatus = 'UNKNOWN'; },
  staleHead: (s) => { s.view.headRefOid = 'old'; },
  behind: (s) => { s.comparison.behind_by = 1; },
  nonStrict: (s) => { s.rules[0].parameters.strict_required_status_checks_policy = false; },
  unknownRule: (s) => { s.rules.push({ type: 'merge_queue' }); },
  missingRequired: (s) => { s.checks = []; },
  wrongApp: (s) => { s.checks[0].app.id = 8; },
  staleCheck: (s) => { s.checks[0].head_sha = 'old'; },
  failed: (s) => { s.checks[0].conclusion = 'failure'; },
  pending: (s) => { s.checks.push({ ...s.checks[0], id: 2, status: 'queued', conclusion: null }); },
  skippedRequired: (s) => { s.checks[0].conclusion = 'skipped'; },
  greenWorkflowFailingStatus: (s) => { s.statuses[0].state = 'failure'; },
  missingGate: (s) => { s.statuses = []; },
  staleGate: (s) => { s.statuses[0].created_at = '2026-10-09T11:00:00Z'; },
  staleApproval: (s) => { s.reviews[0].commit_id = 'old'; },
  dismissed: (s) => { s.reviews.push({ ...s.reviews[0], id: 2, state: 'DISMISSED' }); },
  selfApproval: (s) => { s.pr.user.login = 'sanrai'; },
  unauthorizedVoter: (s) => { s.reviews[0].user.login = 'unknown'; },
  requestedChanges: (s) => { s.reviews.push({ ...s.reviews[0], id: 2, user: { login: 'other' }, state: 'CHANGES_REQUESTED' }); },
  githubReview: (s) => { s.view.reviewDecision = 'REVIEW_REQUIRED'; },
  squashForbidden: (s) => { s.rules[1].parameters.allowed_merge_methods = ['merge']; },
};
for (const [name, mutate] of Object.entries(blocked)) test(`blocks ${name}`, () => {
  const s = fixture(); mutate(s); assert.equal(evaluate(s, repo).eligible, false);
});

test('read-only observation; merge refreshes evidence and submits exact head once', () => {
  let reads = 0; const writes = [];
  const io = { api: () => ({ allow_squash_merge: true }), pages: () => [fixture().pr, { ...fixture().pr, number: 2 }], snapshot: () => { reads++; return fixture(); }, apiMerge: (...args) => { writes.push(args); return { merged: true }; } };
  run(repo, 'observe', io); assert.equal(writes.length, 0);
  reads = 0; run(repo, 'merge', io); assert.equal(reads, 2); assert.deepEqual(writes, [[repo, 1, 'head']]);
});
test('changed head/base or withdrawn eligibility cannot merge', () => {
  for (const change of [(s) => { s.base = 'new'; }, (s) => { s.pr.head.sha = 'new'; }, blocked.optout]) {
    let reads = 0;
    const io = { api: () => ({ allow_squash_merge: true }), pages: () => [fixture().pr], snapshot: () => { const s = fixture(); if (++reads === 2) change(s); return s; }, apiMerge: () => assert.fail('must not merge') };
    assert.throws(() => run(repo, 'merge', io), /Evidence changed/);
  }
});
test('API failure aborts; server refusal is reported', () => {
  assert.throws(() => run(repo, 'merge', { api: () => { throw new Error('403'); } }), /403/);
  assert.throws(() => run(repo, 'merge', { api: () => ({ allow_squash_merge: true }), pages: () => [fixture().pr], snapshot: fixture, apiMerge: () => ({ merged: false }) }), /refused/);
});

test('live mode refuses advisory-only review policy even if observation eligibility passes', () => {
  const s = fixture(); s.rules[0].parameters.required_status_checks.pop();
  assert.equal(evaluate(s, repo).eligible, true);
  assert.equal(serverReviewSafety(s), false);
  assert.throws(() => run(repo, 'merge', { api: () => ({ allow_squash_merge: true }), pages: () => [s.pr], snapshot: () => s, apiMerge: () => assert.fail('must not merge') }), /GitHub-required/);
  const t = fixture(); t.rules[1].parameters.dismiss_stale_reviews_on_push = false;
  assert.equal(serverReviewSafety(t), false);
});

test('classic branch protection uses dismiss_stale_reviews and can satisfy live safeguards', () => {
  const s = fixture(); s.rules = [];
  s.protection = {
    required_status_checks: { strict: true, contexts: ['build', 'review-score-gate'], checks: [] },
    required_pull_request_reviews: { required_approving_review_count: 1, dismiss_stale_reviews: true },
  };
  assert.equal(evaluate(s, repo).eligible, true);
  assert.equal(serverReviewSafety(s), true);
  s.protection.required_pull_request_reviews.dismiss_stale_reviews = false;
  assert.equal(serverReviewSafety(s), false);
  s.protection.required_pull_request_reviews.dismiss_stale_reviews_on_push = true;
  assert.equal(serverReviewSafety(s), false, 'ruleset-only field cannot substitute for classic evidence');
});

test('actual CLI paginates API evidence, accepts protection 404, and makes only exact-head merge writes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ordinary-cli-'));
  try {
    writeFileSync(join(dir, 'fixture.json'), JSON.stringify(fixture()));
    writeFileSync(join(dir, 'gh'), `#!${process.execPath}
import { readFileSync, appendFileSync } from 'node:fs';
const args = process.argv.slice(2);
appendFileSync(process.env.CALLS, JSON.stringify(args) + '\\n');
const s = JSON.parse(readFileSync(process.env.FIXTURE));
let value;
if (args[0] === 'pr') value = s.view;
else {
  const p = args.find(x => x.startsWith('repos/'));
  if (p.endsWith('/protection')) {
    console.log('HTTP/2.0 ' + (process.env.DENIED ? '403 Forbidden' : '404 Not Found'));
    process.exit(1);
  }
  if (args.includes('PUT')) {
    if (!args.includes('sha=head') || !args.includes('merge_method=squash')) process.exit(3);
    value = { merged: true };
  } else if (p.endsWith('/caas')) value = { allow_squash_merge: true };
  else if (p.includes('/pulls?')) value = [[s.pr]];
  else if (p.endsWith('/pulls/1')) value = s.pr;
  else if (p.includes('/git/ref/')) value = { object: { sha: s.base } };
  else if (p.includes('/rules/')) value = [s.rules];
  else if (p.includes('/check-runs?')) value = [{check_runs: []}, {check_runs: s.checks}];
  else if (p.includes('/statuses?')) value = [[], s.statuses.map(({sha, ...status}) => status)];
  else if (p.includes('/reviews?')) value = [[], s.reviews];
  else if (p.includes('/compare/')) value = s.comparison;
  else process.exit(4);
}
console.log(JSON.stringify(value));
`, { mode: 0o755 });
    for (const [mode, denied] of [['observe', false], ['merge', false], ['merge', true]]) {
      const calls = join(dir, 'calls'); writeFileSync(calls, '');
      const result = spawnSync(process.execPath, [resolve('.github/automerge/ordinary.mjs')], {
        encoding: 'utf8', env: { PATH: dir, FIXTURE: join(dir, 'fixture.json'), CALLS: calls,
          GITHUB_REPOSITORY: repo, ORDINARY_AUTOMERGE_MODE: mode, ...(denied ? { DENIED: '1' } : {}) },
      });
      assert.equal(result.status, denied ? 1 : 0, result.stderr);
      const commands = readFileSync(calls, 'utf8').trim().split('\n').map(JSON.parse);
      assert.equal(commands.filter((a) => a.includes('PUT')).length, mode === 'merge' && !denied ? 1 : 0);
      if (denied) assert.match(result.stderr, /classic branch protection/);
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
