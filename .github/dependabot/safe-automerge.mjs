#!/usr/bin/env node
/**
 * Conservative Dependabot controller.
 *
 * Only pure dev-dependency minor/patch PRs are eligible. They must touch only
 * the root npm manifest/lockfile, include latest main, produce a byte-identical
 * shipped bundle, receive a current Agent QA PASS, and pass the full PR suite.
 *
 * Runtime I/O intentionally goes through `gh`; pure policy helpers are exported
 * for unit tests. This file is always executed from trusted default-branch code
 * by workflow_run/schedule, never from the Dependabot branch.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const DEPENDABOT = 'dependabot[bot]';
const ALLOWED_FILES = new Set(['package.json', 'package-lock.json']);
const REQUIRED_CHECKS = [
  'Adobe CLA Signed?',
  'agent-review',
  'check-build',
  'check-coverage-thresholds',
  'check-linting',
  'check-test-requirements',
  'deployment',
  'run-accessibility-checks',
  'run-core-web-vitals-checks',
  'run-e2e-tests',
  'run-unit-tests',
];
const REQUIRED_STATUSES = ['review-score-gate'];
const DECISION_MARKER = '<!-- dependabot-safe-automerge -->';
const CONFLICT_MARKER = '<!-- dependabot-conflict-recovery:';
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

export function extractAgentVerdict(comments, headSha) {
  const shortSha = headSha.slice(0, 7);
  const comment = comments.find(({ body = '' }) => body.includes('<!-- agent-qa-review -->'));
  if (!comment) return { verdict: 'MISSING', current: false };
  const match = comment.body.match(/<!-- qa-verdict-b64:\s*([A-Za-z0-9+/=]+)\s*-->/);
  if (!match) return { verdict: 'MISSING', current: false };
  try {
    const state = JSON.parse(Buffer.from(match[1], 'base64').toString('utf8'));
    // New comments carry headSha explicitly. The header fallback keeps the
    // first rollout compatible with comments created before this change.
    const reviewedSha = state.headSha || ((comment.body.match(/commit\s+`([0-9a-f]{7,40})`/i) || [])[1] || '');
    return { verdict: state.verdict || 'UNKNOWN', current: reviewedSha.startsWith(shortSha) };
  } catch {
    return { verdict: 'UNKNOWN', current: false };
  }
}

export function extractDependencyMetadata(commits) {
  const dependencyTypes = [];
  const updateTypes = [];
  for (const commit of commits) {
    const body = commit.messageBody || '';
    for (const match of body.matchAll(/dependency-type:\s*"?([^\s"\n]+)"?/g)) dependencyTypes.push(match[1]);
    for (const match of body.matchAll(/update-type:\s*"?([^\s"\n]+)"?/g)) updateTypes.push(match[1]);
  }
  return { dependencyTypes, updateTypes };
}

export function hasOnlyDependabotCommits(commits) {
  return commits.length > 0 && commits.every((commit) =>
    (commit.authors || []).length > 0 && commit.authors.every((author) => author.login === DEPENDABOT));
}

function resultState(collection, name) {
  const item = collection.find((entry) => (entry.name || entry.context) === name);
  return item ? String(item.conclusion || item.state || item.status || '').toUpperCase() : 'MISSING';
}

export function evaluateCandidate(candidate) {
  const {
    files, commits, comments, headSha, behindBy, mergeStateStatus,
    checkRuns, statuses,
  } = candidate;

  if (!files.length || files.some((file) => !ALLOWED_FILES.has(file.path))) {
    return { state: 'human', reason: 'changes files outside package.json and package-lock.json' };
  }
  if (!hasOnlyDependabotCommits(commits)) {
    return { state: 'human', reason: 'contains commits not authored by Dependabot' };
  }

  const metadata = extractDependencyMetadata(commits);
  if (!metadata.dependencyTypes.length) {
    return { state: 'human', reason: 'Dependabot dependency-type metadata is missing' };
  }
  if (metadata.dependencyTypes.some((type) => type !== 'direct:development')) {
    return { state: 'human', reason: 'first rollout only allows direct development dependencies' };
  }
  if (!metadata.updateTypes.length) {
    return { state: 'human', reason: 'Dependabot update-type metadata is missing' };
  }
  if (metadata.updateTypes.some((type) => !/version-update:semver-(patch|minor)$/.test(type))) {
    return { state: 'human', reason: 'first rollout only allows patch and minor version updates' };
  }

  if (mergeStateStatus === 'DIRTY') return { state: 'conflict', reason: 'branch has merge conflicts' };
  if (behindBy > 0 || mergeStateStatus === 'BEHIND') return { state: 'behind', reason: `branch is ${behindBy || 1} commit(s) behind main` };

  const buildDiff = statuses.find(({ context }) => context === 'build-output-diff');
  if (!buildDiff) return { state: 'waiting', reason: 'waiting for build-output-diff' };
  if (String(buildDiff.state || '').toUpperCase() !== 'SUCCESS') {
    return { state: 'waiting', reason: `waiting for successful build-output-diff (${buildDiff.state || 'unknown'})` };
  }
  if (!/NO_CHANGE/i.test(buildDiff.description || '')) {
    return { state: 'human', reason: `shipped build output is not byte-identical (${buildDiff.description || 'unknown'})` };
  }

  const agent = extractAgentVerdict(comments, headSha);
  if (!agent.current) return { state: 'waiting', reason: 'waiting for Agent QA on the current commit' };
  if (agent.verdict !== 'PASS') return { state: 'human', reason: `Agent QA verdict is ${agent.verdict}` };

  for (const name of REQUIRED_CHECKS) {
    const state = resultState(checkRuns, name);
    if (['FAILURE', 'CANCELLED', 'TIMED_OUT', 'ACTION_REQUIRED', 'STALE'].includes(state)) {
      return { state: 'human', reason: `${name} concluded ${state}` };
    }
    if (state !== 'SUCCESS') return { state: 'waiting', reason: `waiting for ${name} (${state})` };
  }
  for (const name of REQUIRED_STATUSES) {
    const state = resultState(statuses, name);
    if (['FAILURE', 'ERROR'].includes(state)) return { state: 'human', reason: `${name} concluded ${state}` };
    if (state !== 'SUCCESS') return { state: 'waiting', reason: `waiting for ${name} (${state})` };
  }

  return { state: 'eligible', reason: 'byte-identical build, current Agent QA PASS, and all deterministic checks passed' };
}

export function nextConflictAction({ headUpdatedAt, comments, headSha, pureDependabotCommits, now = Date.now() }) {
  if (!pureDependabotCommits) return { action: 'human', reason: 'extra commits prevent Dependabot automatic rebasing' };
  if (now - Date.parse(headUpdatedAt) < THIRTY_MINUTES_MS) return { action: 'wait', reason: 'giving Dependabot time to rebase automatically' };

  const actions = comments
    .filter(({ body = '' }) => body.includes(CONFLICT_MARKER) && body.includes(headSha))
    .map((comment) => ({
      action: (comment.body.match(/dependabot-conflict-recovery:(rebase|recreate):/) || [])[1],
      at: Date.parse(comment.createdAt),
    }))
    .filter(({ action, at }) => action && Number.isFinite(at))
    .sort((a, b) => b.at - a.at);

  const recreate = actions.find(({ action }) => action === 'recreate');
  if (recreate) {
    return now - recreate.at >= TWO_HOURS_MS
      ? { action: 'human', reason: 'still conflicted two hours after recreate' }
      : { action: 'wait', reason: 'waiting for requested recreate' };
  }
  const rebase = actions.find(({ action }) => action === 'rebase');
  if (rebase) {
    return now - rebase.at >= TWO_HOURS_MS
      ? { action: 'recreate', reason: 'still conflicted two hours after rebase' }
      : { action: 'wait', reason: 'waiting for requested rebase' };
  }
  return { action: 'rebase', reason: 'automatic rebase did not clear the conflict within 30 minutes' };
}

function gh(args, { allowFailure = false } = {}) {
  const result = spawnSync('gh', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0 && !allowFailure) throw new Error(`gh ${args.join(' ')} failed: ${(result.stderr || '').trim()}`);
  return result.status === 0 ? result.stdout.trim() : '';
}

function ghJson(args, options) {
  const output = gh(args, options);
  return output ? JSON.parse(output) : null;
}

function elapsed(from, to = Date.now()) {
  const minutes = Math.max(0, Math.round((to - Date.parse(from)) / 60000));
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function ensureLabel(repo, name, color, description) {
  gh(['label', 'create', name, '--repo', repo, '--color', color, '--description', description, '--force']);
}

function setLabel(repo, pr, currentLabels, add, remove = []) {
  const current = new Set((currentLabels || []).map((label) => label.name || label));
  for (const label of remove) {
    if (current.has(label)) gh(['pr', 'edit', String(pr), '--repo', repo, '--remove-label', label], { allowFailure: true });
  }
  if (add && !current.has(add)) gh(['pr', 'edit', String(pr), '--repo', repo, '--add-label', add]);
}

function disableAutoMerge(repo, pr) {
  gh(['pr', 'merge', String(pr), '--repo', repo, '--disable-auto'], { allowFailure: true });
}

function postOnce(repo, pr, marker, body) {
  const comments = ghJson(['api', `repos/${repo}/issues/${pr}/comments?per_page=100`]) || [];
  if (comments.some((comment) => (comment.body || '').includes(marker))) return;
  gh(['api', '-X', 'POST', `repos/${repo}/issues/${pr}/comments`, '-f', `body=${marker}\n${body}`]);
}

function recordDecision(repo, pr, data, state, reason) {
  const marker = `${DECISION_MARKER}\n<!-- state:${state};head:${data.headSha} -->`;
  const heading = state === 'ready' ? '✅ Safe Dependabot auto-merge is ready' : '🧑‍💻 Dependabot update needs human review';
  postOnce(repo, pr, marker, [
    `### ${heading}`,
    '',
    `- PR raised: ${data.createdAt}`,
    `- Decision recorded: ${new Date().toISOString()}`,
    `- Time to decision: ${elapsed(data.createdAt)}`,
    `- Evaluated head: \`${data.headSha.slice(0, 12)}\``,
    `- Reason: ${reason}`,
  ].join('\n'));
}

function conflictCommand(repo, pr, data, action, reason) {
  const marker = `${CONFLICT_MARKER}${action}:${data.headSha} -->`;
  const comments = ghJson(['api', `repos/${repo}/issues/${pr}/comments?per_page=100`]) || [];
  if (comments.some((comment) => (comment.body || '').includes(marker))) return;
  const body = [
    `@dependabot ${action}`,
    '',
    `Conflict watchdog: ${reason}. The updated head must pass every gate again before merge.`,
    marker,
  ].join('\n');
  gh(['api', '-X', 'POST', `repos/${repo}/issues/${pr}/comments`, '-f', `body=${body}`]);
}

function strictUpToDateEnabled(repo, defaultBranch) {
  const rulesets = ghJson(['api', `repos/${repo}/rulesets?includes_parents=true`], { allowFailure: true }) || [];
  for (const summary of rulesets.filter(({ enforcement }) => enforcement === 'active')) {
    const ruleset = ghJson(['api', `repos/${repo}/rulesets/${summary.id}`], { allowFailure: true });
    const includesDefault = (ruleset?.conditions?.ref_name?.include || []).some((ref) => ref === '~DEFAULT_BRANCH' || ref.endsWith(`/${defaultBranch}`));
    const required = (ruleset?.rules || []).find(({ type }) => type === 'required_status_checks');
    if (includesDefault && required?.parameters?.strict_required_status_checks_policy === true) return true;
  }
  const protection = ghJson(['api', `repos/${repo}/branches/${defaultBranch}/protection`], { allowFailure: true });
  return protection?.required_status_checks?.strict === true;
}

async function main() {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) throw new Error('GITHUB_REPOSITORY is required');
  const mode = process.env.AUTOMERGE_MODE === 'merge' ? 'merge' : 'observe';
  const repository = ghJson(['api', `repos/${repo}`]);
  const defaultBranch = repository.default_branch;
  const strict = strictUpToDateEnabled(repo, defaultBranch);

  ensureLabel(repo, 'dependencies-automerge-ready', '0e8a16', 'Dependabot update passed every safe-automerge gate');
  ensureLabel(repo, 'dependencies-needs-human', 'd73a4a', 'Dependabot update requires human intervention');
  ensureLabel(repo, 'dependencies-conflict', 'fbca04', 'Dependabot branch is behind or conflicted');

  const prs = ghJson(['pr', 'list', '--repo', repo, '--state', 'open', '--author', 'app/dependabot', '--limit', '100',
    '--json', 'number,title,baseRefName,headRefOid,mergeStateStatus,createdAt,updatedAt,autoMergeRequest,url,labels']) || [];
  if (!prs.length) {
    console.log('No open Dependabot PRs.');
    return;
  }

  const baseSha = gh(['api', `repos/${repo}/git/ref/heads/${defaultBranch}`, '--jq', '.object.sha']);
  const candidates = [];
  for (const pr of prs.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))) {
    if (pr.baseRefName !== defaultBranch) continue;
    const view = ghJson(['pr', 'view', String(pr.number), '--repo', repo, '--json', 'files,commits,comments']);
    const checkData = ghJson(['api', `repos/${repo}/commits/${pr.headRefOid}/check-runs?per_page=100`]);
    const statusData = ghJson(['api', `repos/${repo}/commits/${pr.headRefOid}/status`]);
    const comparison = ghJson(['api', `repos/${repo}/compare/${baseSha}...${pr.headRefOid}`]);
    const data = {
      ...pr,
      headSha: pr.headRefOid,
      files: view.files || [],
      commits: view.commits || [],
      comments: view.comments || [],
      checkRuns: checkData.check_runs || [],
      statuses: statusData.statuses || [],
      behindBy: comparison.behind_by || 0,
      headUpdatedAt: (view.commits || []).at(-1)?.committedDate || pr.updatedAt,
    };

    const decision = evaluateCandidate(data);
    console.log(`#${pr.number} ${decision.state}: ${decision.reason}`);

    // A rebase or recreate can invalidate advisory gates that GitHub itself
    // does not require. Never leave a previous native auto-merge request armed
    // while the current head is waiting, conflicted, or requires a person.
    if (pr.autoMergeRequest && decision.state !== 'eligible') {
      disableAutoMerge(repo, pr.number);
      // Keep the loop snapshot consistent so this run may arm a different,
      // fully eligible PR instead of waiting for the next schedule tick.
      pr.autoMergeRequest = null;
      console.log(`#${pr.number} disabled stale auto-merge for ${data.headSha.slice(0, 12)}.`);
    }

    if (decision.state === 'conflict' || decision.state === 'behind') {
      setLabel(repo, pr.number, pr.labels, 'dependencies-conflict', [
        'dependencies-automerge-ready',
        'dependencies-needs-human',
      ]);
      const recovery = nextConflictAction({
        headUpdatedAt: data.headUpdatedAt,
        comments: data.comments,
        headSha: data.headSha,
        pureDependabotCommits: hasOnlyDependabotCommits(data.commits),
      });
      if (recovery.action === 'rebase' || recovery.action === 'recreate') {
        conflictCommand(repo, pr.number, data, recovery.action, recovery.reason);
      } else if (recovery.action === 'human') {
        setLabel(repo, pr.number, [{ name: 'dependencies-conflict' }, ...pr.labels], 'dependencies-needs-human', ['dependencies-conflict']);
        recordDecision(repo, pr.number, data, 'human', recovery.reason);
      }
      continue;
    }

    setLabel(repo, pr.number, pr.labels, null, ['dependencies-conflict']);
    if (decision.state === 'human') {
      setLabel(repo, pr.number, pr.labels, 'dependencies-needs-human', ['dependencies-automerge-ready']);
      recordDecision(repo, pr.number, data, 'human', decision.reason);
    } else if (decision.state === 'eligible') {
      setLabel(repo, pr.number, pr.labels, 'dependencies-automerge-ready', ['dependencies-needs-human']);
      recordDecision(repo, pr.number, data, 'ready', decision.reason);
      candidates.push(data);
    } else {
      // A new head starts unclassified. Remove conclusions recorded for an old
      // head until every gate has completed again.
      setLabel(repo, pr.number, pr.labels, null, [
        'dependencies-automerge-ready',
        'dependencies-needs-human',
      ]);
    }
  }

  if (mode !== 'merge') {
    console.log(`Observation mode: ${candidates.length} PR(s) ready; set DEPENDABOT_AUTOMERGE_MODE=merge to arm native auto-merge.`);
    return;
  }
  if (!repository.allow_auto_merge) throw new Error('Merge mode requires repository setting “Allow auto-merge”.');
  if (!strict) throw new Error('Merge mode requires strict up-to-date status checks on the default-branch ruleset.');
  if (prs.some(({ autoMergeRequest }) => autoMergeRequest)) {
    console.log('A Dependabot PR already has auto-merge armed; waiting before arming another.');
    return;
  }
  if (!candidates.length) return;

  const candidate = candidates[0];
  execFileSync('gh', ['pr', 'merge', String(candidate.number), '--repo', repo, '--auto', '--squash', '--match-head-commit', candidate.headSha], {
    stdio: 'inherit',
  });
  console.log(`Armed auto-merge for #${candidate.number}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}
