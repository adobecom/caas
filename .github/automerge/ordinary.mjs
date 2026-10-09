import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// Keep aligned with review-score.yml; ordinary PRs never use its Dependabot fast path.
export const VOTERS = new Set('auniverseaway chrischrischris cmiqueo honstar jedjedjedm jenssingler raissanjay sanrai sheridansunier shkhan91 sukamat'.split(' '));
const latest = (items, key) => [...items].sort((a, b) => b.id - a.id)
  .filter((item, i, all) => all.findIndex((other) => key(other) === key(item)) === i);

export function evaluate(s, repo) {
  const { pr, view, rules, checks, statuses, reviews, comparison, protection } = s;
  const no = (reason) => ({ eligible: false, reason });
  if (pr.state !== 'open' || pr.draft || pr.base.ref !== 'main' || pr.head.repo?.full_name !== repo
    || pr.user.type !== 'User' || pr.user.login === 'dependabot[bot]'
    || pr.head.ref.startsWith('dependabot/') || pr.labels.some((l) => l.name.startsWith('dependencies-'))
    || !pr.labels.some((l) => l.name === 'ordinary-automerge') || pr.auto_merge) return no('outside opt-in ordinary PR scope');
  if (view.headRefOid !== pr.head.sha || view.mergeStateStatus !== 'CLEAN'
    || pr.mergeable !== true || pr.mergeable_state !== 'clean'
    || comparison.behind_by !== 0 || !['ahead', 'identical'].includes(comparison.status)) return no('head/base is stale, conflicted, or unknown');
  if (!Array.isArray(rules) || rules.some((r) => !['pull_request', 'required_status_checks', 'non_fast_forward'].includes(r.type))) return no('unsupported or missing rules');
  const checkRules = rules.filter((r) => r.type === 'required_status_checks');
  if (!checkRules.some((r) => r.parameters.strict_required_status_checks_policy)
    && protection?.required_status_checks?.strict !== true) return no('strict up-to-date checks required');
  const required = checkRules.flatMap((r) => r.parameters.required_status_checks);
  for (const c of protection?.required_status_checks?.checks || []) required.push({ context: c.context, integration_id: c.app_id });
  for (const context of protection?.required_status_checks?.contexts || []) required.push({ context });
  if (!required.length) return no('no required checks');
  const cs = latest(checks, (c) => `${c.name}:${c.app?.id}`);
  const ss = latest(statuses, (s) => s.context);
  if (cs.some((c) => c.head_sha !== pr.head.sha || c.status !== 'completed'
    || !['success', 'neutral', 'skipped'].includes(c.conclusion))
    || ss.some((s) => s.sha !== pr.head.sha || s.state !== 'success')) return no('pending, failed, or stale check/status');
  for (const r of required) {
    const match = cs.filter((c) => c.name === r.context && (!r.integration_id || r.integration_id === -1 || c.app?.id === r.integration_id));
    const status = ss.find((s) => s.context === r.context);
    if (match.length ? match.some((c) => c.conclusion !== 'success') : (!status || (r.integration_id && r.integration_id !== -1))) return no(`missing successful required evidence: ${r.context}`);
  }
  const votes = new Map();
  for (const r of [...reviews].sort((a, b) => a.id - b.id)) {
    const login = r.user?.login?.toLowerCase();
    if (!login || login === pr.user.login.toLowerCase()) continue;
    if (['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(r.state)) votes.set(login, r);
  }
  if ([...votes.values()].some((r) => r.state === 'CHANGES_REQUESTED')) return no('outstanding changes requested');
  const approvals = [...votes].filter(([login, r]) => VOTERS.has(login) && r.state === 'APPROVED' && r.commit_id === pr.head.sha);
  if (!approvals.length) return no('current-head review-score approval required');
  const gate = ss.find((s) => s.context === 'review-score-gate');
  const newestReview = Math.max(...reviews.map((r) => Date.parse(r.submitted_at)).filter(Number.isFinite));
  if (!gate || gate.state !== 'success' || !Number.isFinite(Date.parse(gate.created_at))
    || !Number.isFinite(newestReview) || Date.parse(gate.created_at) < newestReview) return no('review-score status missing or predates review evidence');
  const reviewRules = rules.filter((r) => r.type === 'pull_request').map((r) => r.parameters);
  if (protection?.required_pull_request_reviews) reviewRules.push(protection.required_pull_request_reviews);
  if ((reviewRules.some((r) => r.required_approving_review_count > 0 || r.require_code_owner_review || r.require_last_push_approval)
    && view.reviewDecision !== 'APPROVED') || view.reviewDecision === 'CHANGES_REQUESTED' || view.reviewDecision === 'REVIEW_REQUIRED') return no('GitHub review requirements unsatisfied');
  if (reviewRules.some((r) => r.allowed_merge_methods && !r.allowed_merge_methods.includes('squash'))) return no('squash forbidden by rules');
  return { eligible: true, reason: 'current head, required evidence, human review, review-score status, and GitHub merge state pass' };
}

export function gh(args) {
  const r = spawnSync('gh', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(r.stderr || 'GitHub request failed');
  return JSON.parse(r.stdout);
}
const api = (path) => gh(['api', path]);
const pages = (path, field) => gh(['api', '--paginate', '--slurp', path]).flatMap((p) => field ? p[field] : p);

export function snapshot(repo, number) {
  const pr = api(`repos/${repo}/pulls/${number}`);
  const base = api(`repos/${repo}/git/ref/heads/main`).object.sha;
  // A documented 404 means no classic protection; every other error is fatal.
  const result = spawnSync('gh', ['api', '--include', `repos/${repo}/branches/main/protection`], { encoding: 'utf8' });
  let protection = null;
  if (result.status === 0) protection = JSON.parse(result.stdout.slice(result.stdout.indexOf('{')));
  else if (!/^HTTP\/\S+ 404\b/m.test(result.stdout)) throw new Error('Cannot establish classic branch protection');
  return {
    pr, base, protection,
    view: gh(['pr', 'view', String(number), '--repo', repo, '--json', 'headRefOid,mergeStateStatus,reviewDecision']),
    rules: pages(`repos/${repo}/rules/branches/main?per_page=100`),
    checks: pages(`repos/${repo}/commits/${pr.head.sha}/check-runs?per_page=100&filter=all`, 'check_runs'),
    statuses: pages(`repos/${repo}/commits/${pr.head.sha}/statuses?per_page=100`),
    reviews: pages(`repos/${repo}/pulls/${number}/reviews?per_page=100`),
    comparison: api(`repos/${repo}/compare/${base}...${pr.head.sha}`),
  };
}

export function run(repo, mode, io = { api, pages, snapshot }) {
  if (repo !== 'adobecom/caas') throw new Error('Controller is restricted to adobecom/caas');
  if (io.api(`repos/${repo}`).allow_squash_merge !== true) throw new Error('Squash merging unavailable');
  const prs = io.pages(`repos/${repo}/pulls?state=open&base=main&per_page=100`);
  for (const pr of prs) {
    if (!pr.labels.some((l) => l.name === 'ordinary-automerge') || pr.user.type !== 'User') continue;
    const first = io.snapshot(repo, pr.number);
    const decision = evaluate(first, repo);
    console.log(`#${pr.number} ${decision.eligible ? 'eligible' : 'blocked'}: ${decision.reason}`);
    if (!decision.eligible || mode !== 'merge') continue;
    const fresh = io.snapshot(repo, pr.number);
    if (!evaluate(fresh, repo).eligible || fresh.pr.head.sha !== first.pr.head.sha || fresh.base !== first.base) throw new Error('Evidence changed before merge');
    if (!serverReviewSafety(fresh)) throw new Error('Live merging requires GitHub-required review-score-gate and stale-dismissed human approval');
    // Immediate exact-head merge: never leave advisory policy armed for a later head.
    const merged = io.apiMerge
      ? io.apiMerge(repo, pr.number, fresh.pr.head.sha)
      : gh(['api', '-X', 'PUT', `repos/${repo}/pulls/${pr.number}/merge`, '-f', `sha=${fresh.pr.head.sha}`, '-f', 'merge_method=squash']);
    if (merged.merged !== true) throw new Error('GitHub refused merge');
    return; // One merge per invocation; next run re-evaluates the new base.
  }
}

export function serverReviewSafety(s) {
  const gateRequired = s.rules.some((r) => r.type === 'required_status_checks'
    && r.parameters.required_status_checks.some((c) => c.context === 'review-score-gate'))
    || (s.protection?.required_status_checks?.contexts || []).includes('review-score-gate')
    || (s.protection?.required_status_checks?.checks || []).some((c) => c.context === 'review-score-gate');
  const nativeReview = s.rules.filter((r) => r.type === 'pull_request').map((r) => r.parameters);
  if (s.protection?.required_pull_request_reviews) nativeReview.push(s.protection.required_pull_request_reviews);
  return gateRequired && nativeReview.some((r) => r.required_approving_review_count >= 1 && r.dismiss_stale_reviews_on_push === true);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { run(process.env.GITHUB_REPOSITORY, process.env.ORDINARY_AUTOMERGE_MODE); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
