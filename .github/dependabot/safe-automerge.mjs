#!/usr/bin/env node
/**
 * Conservative Dependabot controller.
 *
 * A Dependabot update is eligible only when it touches the root npm
 * manifest/lockfile, includes latest main, produces a byte-identical shipped
 * bundle, and GitHub reports a clean result. Dependency type and version size
 * are deliberately not used as policy signals.
 *
 * Runtime I/O intentionally goes through `gh`; pure policy helpers are exported
 * for unit tests. This file is always executed from trusted default-branch code
 * by workflow_run/schedule, never from the Dependabot branch.
 */
import { execFile, execFileSync, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const DEPENDABOT = 'dependabot[bot]';
const ALLOWED_FILES = new Set(['package.json', 'package-lock.json']);
const DECISION_MARKER = '<!-- dependabot-safe-automerge -->';
const CONFLICT_MARKER = '<!-- dependabot-conflict-recovery:';
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const QUEUED_LABEL = 'dependencies-queued';
const PREPARING_LABEL = 'dependencies-preparing';
const ACTIVE_LABEL = 'dependencies-active';
const READY_LABEL = 'dependencies-automerge-ready';
const REVIEW_LABEL = 'dependencies-review';
const CONFLICT_LABEL = 'dependencies-conflict';

function hasLabel(pr, name) {
  return (pr.labels || []).some((label) => (label.name || label) === name);
}

export function selectQueueCandidate(prs) {
  const ordered = [...prs].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  const reserved = ordered.find((pr) =>
    pr.autoMergeRequest || hasLabel(pr, PREPARING_LABEL) || hasLabel(pr, ACTIVE_LABEL));
  if (reserved) return reserved;
  return ordered.find((pr) => !hasLabel(pr, REVIEW_LABEL)) || null;
}

export function hasOnlyDependabotCommits(commits) {
  return commits.length > 0 && commits.every((commit) =>
    (commit.authors || []).length > 0 && commit.authors.every((author) => author.login === DEPENDABOT));
}

export function evaluateCandidate(candidate) {
  const {
    files, commits, behindBy, mergeStateStatus,
    checkRuns, statuses,
  } = candidate;

  if (!files.length || files.some((file) => !ALLOWED_FILES.has(file.path))) {
    return { state: 'review', reason: 'changes files outside package.json and package-lock.json' };
  }
  if (!hasOnlyDependabotCommits(commits)) {
    return { state: 'review', reason: 'contains commits not authored by Dependabot' };
  }

  if (mergeStateStatus === 'DIRTY') return { state: 'conflict', reason: 'branch has merge conflicts' };
  if (behindBy > 0 || mergeStateStatus === 'BEHIND') return { state: 'behind', reason: `branch is ${behindBy || 1} commit(s) behind main` };

  const buildDiff = statuses.find(({ context }) => context === 'build-output-diff');
  if (!buildDiff) return { state: 'waiting', reason: 'waiting for build-output-diff' };
  if (String(buildDiff.state || '').toUpperCase() !== 'SUCCESS') {
    return { state: 'waiting', reason: `waiting for successful build-output-diff (${buildDiff.state || 'unknown'})` };
  }
  if (!/NO_CHANGE/i.test(buildDiff.description || '')) {
    return { state: 'review', reason: `shipped build output is not byte-identical (${buildDiff.description || 'unknown'})` };
  }

  if (mergeStateStatus === 'CLEAN') {
    return { state: 'eligible', reason: 'package-only update, byte-identical build, and clean GitHub result' };
  }

  const runningCheck = checkRuns.find(({ status }) => String(status || '').toUpperCase() !== 'COMPLETED');
  const pendingStatus = statuses.find(({ context, state }) =>
    context !== 'build-output-diff' && ['PENDING', 'EXPECTED'].includes(String(state || '').toUpperCase()));
  if (runningCheck) return { state: 'waiting', reason: `waiting for ${runningCheck.name}` };
  if (pendingStatus) return { state: 'waiting', reason: `waiting for ${pendingStatus.context}` };

  return { state: 'review', reason: `GitHub reports merge state ${mergeStateStatus || 'UNKNOWN'}` };
}

export function nextConflictAction({ comments, headSha, pureDependabotCommits, now = Date.now() }) {
  if (!pureDependabotCommits) return { action: 'review', reason: 'extra commits prevent Dependabot automatic rebasing' };

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
      ? { action: 'review', reason: 'still conflicted two hours after recreate' }
      : { action: 'wait', reason: 'waiting for requested recreate' };
  }
  const rebase = actions.find(({ action }) => action === 'rebase');
  if (rebase) {
    return now - rebase.at >= TWO_HOURS_MS
      ? { action: 'recreate', reason: 'still conflicted two hours after rebase' }
      : { action: 'wait', reason: 'waiting for requested rebase' };
  }
  return { action: 'rebase', reason: 'selected queue item must include the latest main branch' };
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

async function ghJsonAsync(args) {
  try {
    const { stdout } = await execFileAsync('gh', args, {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
    const output = stdout.trim();
    return output ? JSON.parse(output) : null;
  } catch (error) {
    const detail = String(error.stderr || error.message || '').trim();
    throw new Error(`gh ${args.join(' ')} failed: ${detail}`);
  }
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
    if (current.has(label)) {
      gh(['pr', 'edit', String(pr), '--repo', repo, '--remove-label', label]);
      current.delete(label);
    }
  }
  if (add && !current.has(add)) {
    gh(['pr', 'edit', String(pr), '--repo', repo, '--add-label', add]);
    current.add(add);
  }
  if (Array.isArray(currentLabels)) {
    currentLabels.splice(0, currentLabels.length, ...[...current].map((name) => ({ name })));
  }
}

function setQueueState(repo, pr, state) {
  const states = [QUEUED_LABEL, PREPARING_LABEL, ACTIVE_LABEL, REVIEW_LABEL];
  const remove = states.filter((label) => label !== state);
  remove.push(READY_LABEL, CONFLICT_LABEL, 'dependencies-needs-human');
  setLabel(repo, pr.number, pr.labels, state, remove);
}

function queueNext(repo, prs, completedNumber) {
  const next = selectQueueCandidate(prs.filter((pr) => pr.number !== completedNumber));
  if (!next) {
    console.log('No queued Dependabot PR remains.');
    return null;
  }
  setQueueState(repo, next, PREPARING_LABEL);
  console.log(`#${next.number} reserved as the next queue item.`);
  return next;
}

export function disableAutoMerge(repo, pr, runGh = gh) {
  runGh(['pr', 'merge', String(pr.number), '--repo', repo, '--disable-auto']);
  pr.autoMergeRequest = null;
}

export function commentChange(comments, marker, body) {
  const desiredBody = `${marker}\n${body}`;
  const existing = comments.find((comment) => (comment.body || '').includes(marker));
  if (!existing) return { action: 'create', body: desiredBody };
  if (existing.body === desiredBody) return { action: 'none' };
  return { action: 'update', id: existing.id, body: desiredBody };
}

function upsertComment(repo, pr, marker, body) {
  const comments = ghJson(['api', `repos/${repo}/issues/${pr}/comments?per_page=100`]) || [];
  const change = commentChange(comments, marker, body);
  if (change.action === 'none') return;
  if (change.action === 'update') {
    gh(['api', '-X', 'PATCH', `repos/${repo}/issues/comments/${change.id}`, '-f', `body=${change.body}`]);
    return;
  }
  gh(['api', '-X', 'POST', `repos/${repo}/issues/${pr}/comments`, '-f', `body=${change.body}`]);
}

function recordDecision(repo, pr, data, state, reason) {
  const heading = state === 'ready' ? '✅ Safe Dependabot auto-merge is ready' : '🔎 Dependabot update needs review';
  upsertComment(repo, pr, DECISION_MARKER, [
    `<!-- state:${state};head:${data.headSha} -->`,
    `### ${heading}`,
    '',
    `- PR raised: ${data.createdAt}`,
    `- Decision recorded: ${new Date().toISOString()}`,
    `- Time to decision: ${elapsed(data.createdAt)}`,
    `- Evaluated head: \`${data.headSha.slice(0, 12)}\``,
    `- Reason: ${reason}`,
  ].join('\n'));
}

async function loadCandidateData(repo, pr, baseSha) {
  const [view, checkData, statusData, comparison] = await Promise.all([
    ghJsonAsync(['pr', 'view', String(pr.number), '--repo', repo, '--json', 'files,commits,comments']),
    ghJsonAsync(['api', `repos/${repo}/commits/${pr.headRefOid}/check-runs?per_page=100`]),
    ghJsonAsync(['api', `repos/${repo}/commits/${pr.headRefOid}/status`]),
    ghJsonAsync(['api', `repos/${repo}/compare/${baseSha}...${pr.headRefOid}`]),
  ]);
  return {
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
  ensureLabel(repo, 'dependencies-review', '5319e7', 'Dependabot update requires review by a person or Codex');
  ensureLabel(repo, 'dependencies-conflict', 'fbca04', 'Dependabot branch is behind or conflicted');
  ensureLabel(repo, QUEUED_LABEL, 'd4c5f9', 'Dependabot update is waiting for the serial validation queue');
  ensureLabel(repo, PREPARING_LABEL, 'f9d0c4', 'Dependabot update owns the queue slot and is being updated');
  ensureLabel(repo, ACTIVE_LABEL, '1d76db', 'Dependabot update owns the queue slot and may run expensive checks');

  const prs = ghJson(['pr', 'list', '--repo', repo, '--state', 'open', '--author', 'app/dependabot', '--limit', '100',
    '--json', 'number,title,baseRefName,headRefOid,mergeStateStatus,createdAt,updatedAt,autoMergeRequest,url,labels']) || [];
  if (!prs.length) {
    console.log('No open Dependabot PRs.');
    return;
  }

  const eligiblePrs = prs.filter((pr) => pr.baseRefName === defaultBranch);
  const armed = eligiblePrs.filter((pr) => pr.autoMergeRequest);
  if (armed.length > 1) {
    throw new Error(`More than one Dependabot PR has auto-merge armed: ${armed.map(({ number }) => `#${number}`).join(', ')}`);
  }
  const selected = selectQueueCandidate(eligiblePrs);
  if (!selected) {
    console.log('Every open Dependabot PR requires review; the automatic queue is empty.');
    return;
  }

  for (const pr of eligiblePrs) {
    if (pr.number === selected.number || hasLabel(pr, REVIEW_LABEL)) continue;
    setQueueState(repo, pr, QUEUED_LABEL);
  }

  const alreadyReserved = selected.autoMergeRequest || hasLabel(selected, PREPARING_LABEL) || hasLabel(selected, ACTIVE_LABEL);
  if (!alreadyReserved) {
    setQueueState(repo, selected, PREPARING_LABEL);
    console.log(`#${selected.number} reserved as the next queue item.`);
  }

  const baseSha = gh(['api', `repos/${repo}/git/ref/heads/${defaultBranch}`, '--jq', '.object.sha']);
  let data;
  try {
    data = await loadCandidateData(repo, selected, baseSha);
  } catch (error) {
    throw new Error(`#${selected.number} could not be evaluated: ${error.message}`);
  }
  const decision = evaluateCandidate(data);
  console.log(`#${selected.number} ${decision.state}: ${decision.reason}`);

  // A rebase or recreate can invalidate advisory gates that GitHub itself
  // does not require. Never leave a previous native auto-merge request armed
  // while the current head is waiting, conflicted, or requires a person.
  if (selected.autoMergeRequest && decision.state !== 'eligible') {
    disableAutoMerge(repo, selected);
    console.log(`#${selected.number} disabled stale auto-merge for ${data.headSha.slice(0, 12)}.`);
  }

  if (decision.state === 'conflict' || decision.state === 'behind') {
    setQueueState(repo, selected, PREPARING_LABEL);
    setLabel(repo, selected.number, selected.labels, CONFLICT_LABEL, [READY_LABEL, REVIEW_LABEL]);
    const recovery = nextConflictAction({
      comments: data.comments,
      headSha: data.headSha,
      pureDependabotCommits: hasOnlyDependabotCommits(data.commits),
    });
    if (recovery.action === 'rebase' || recovery.action === 'recreate') {
      conflictCommand(repo, selected.number, data, recovery.action, recovery.reason);
    } else if (recovery.action === 'review') {
      setQueueState(repo, selected, REVIEW_LABEL);
      recordDecision(repo, selected.number, data, 'review', recovery.reason);
      queueNext(repo, eligiblePrs, selected.number);
    }
    return;
  }

  if (decision.state === 'review') {
    setQueueState(repo, selected, REVIEW_LABEL);
    recordDecision(repo, selected.number, data, 'review', decision.reason);
    queueNext(repo, eligiblePrs, selected.number);
    return;
  }

  if (!hasLabel(selected, ACTIVE_LABEL)) {
    setQueueState(repo, selected, ACTIVE_LABEL);
    setLabel(repo, selected.number, selected.labels, null, [CONFLICT_LABEL, READY_LABEL]);
    console.log(`#${selected.number} is current with main and may run expensive checks.`);
    return;
  }

  if (decision.state === 'waiting') {
    setLabel(repo, selected.number, selected.labels, null, [READY_LABEL, REVIEW_LABEL, CONFLICT_LABEL]);
    return;
  }

  setLabel(repo, selected.number, selected.labels, READY_LABEL, [
    REVIEW_LABEL,
    CONFLICT_LABEL,
    'dependencies-needs-human',
  ]);
  recordDecision(repo, selected.number, data, 'ready', decision.reason);

  if (mode !== 'merge') {
    console.log(`Observation mode: #${selected.number} is ready; set DEPENDABOT_AUTOMERGE_MODE=merge to arm native auto-merge.`);
    return;
  }
  if (!repository.allow_auto_merge) throw new Error('Merge mode requires repository setting “Allow auto-merge”.');
  if (!strict) throw new Error('Merge mode requires strict up-to-date status checks on the default-branch ruleset.');
  if (selected.autoMergeRequest) {
    console.log(`#${selected.number} already has auto-merge armed.`);
    return;
  }
  execFileSync('gh', ['pr', 'merge', String(selected.number), '--repo', repo, '--auto', '--squash', '--match-head-commit', data.headSha], {
    stdio: 'inherit',
  });
  console.log(`Armed auto-merge for #${selected.number}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}
