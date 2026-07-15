#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyQaOverlay } from './apply-qa-overlay.mjs';

const env = (name, fallback = '') => process.env[name] ?? fallback;
const REPO = env('GH_REPO', 'adobecom/caas');
const SOURCE_REPO = path.resolve(env('GITHUB_WORKSPACE', process.cwd()));
const TEMP_ROOT = path.resolve(env('RUNNER_TEMP', path.join(SOURCE_REPO, '.backtest-tmp')), 'caas-feature-backtest');
const OUTPUT_ROOT = path.resolve(env('BACKTEST_OUTPUT_DIR', path.join(SOURCE_REPO, 'backtest-out')));
const WORKER = path.join(path.dirname(fileURLToPath(import.meta.url)), 'feature-backtest-worker.mjs');

export function parsePrNumbers(value) {
  const numbers = String(value || '').split(/[\s,]+/).filter(Boolean).map(Number);
  if (!numbers.length || numbers.some((number) => !Number.isInteger(number) || number <= 0)) {
    throw new Error('BACKTEST_PRS must contain comma/space-separated positive PR numbers');
  }
  const unique = [...new Set(numbers)];
  if (unique.length > 12) throw new Error('BACKTEST_PRS is limited to 12 PRs per batch');
  return unique;
}

export function classifyPair(post, pre) {
  if (!post) return { outcome: 'ERROR', detail: 'post-PR result missing' };
  if (post.status === 'SKIPPED') return { outcome: 'SKIPPED', detail: post.reason || 'not testable' };
  if (post.status === 'ERROR') return { outcome: 'ERROR', detail: post.reason || 'post-PR error' };
  if (post.status !== 'PASS') return { outcome: 'POST_FAIL', detail: post.reason || 'post-PR assertion failed' };
  if (!pre) return { outcome: 'ERROR', detail: 'pre-PR result missing' };
  if (pre.status === 'ERROR') return { outcome: 'ERROR', detail: pre.reason || 'pre-PR error' };
  const exploratory = post.contract?.mode === 'exploratory';
  if (exploratory && pre.status === 'FAIL') {
    return { outcome: 'EXPLORATORY_DISCRIMINATING_PASS', detail: 'post passes and pre fails, but no managed QA contract exists yet' };
  }
  if (exploratory && pre.status === 'PASS') {
    return { outcome: 'EXPLORATORY_NON_DISCRIMINATING', detail: 'both builds pass; exploratory scenario needs contract review' };
  }
  if (pre.status === 'FAIL') return { outcome: 'DISCRIMINATING_PASS', detail: 'post passes and pre fails' };
  if (pre.status === 'PASS') return { outcome: 'NON_DISCRIMINATING', detail: 'both pre and post pass' };
  return { outcome: 'INCONCLUSIVE', detail: `unexpected pre status ${pre.status}` };
}

function output(command, args, options = {}) {
  return execFileSync(command, args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, ...options }).trim();
}

function run(command, args, options = {}) {
  console.log(`[run] ${command} ${args.join(' ')}`);
  execFileSync(command, args, { stdio: 'inherit', ...options });
}

function fileHash(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeSummary(entries) {
  mkdirSync(OUTPUT_ROOT, { recursive: true });
  writeFileSync(path.join(OUTPUT_ROOT, 'summary.json'), `${JSON.stringify(entries, null, 2)}\n`);
  const rows = entries.map((entry) =>
    `| [#${entry.pr}](https://github.com/${REPO}/pull/${entry.pr}) | ${entry.title.replaceAll('|', '\\|')} | ${entry.outcome} | ${entry.detail.replaceAll('|', '\\|')} |`);
  const markdown = `# Historical Feature-QA Back-test\n\n` +
    `Generated: ${new Date().toISOString()}\n\n` +
    `| PR | Change | Outcome | Detail |\n|---|---|---|---|\n${rows.join('\n')}\n`;
  writeFileSync(path.join(OUTPUT_ROOT, 'summary.md'), markdown);
}

function prepareWorktree(commit, destination) {
  run('git', ['fetch', '--no-tags', 'origin', commit], { cwd: SOURCE_REPO });
  run('git', ['worktree', 'add', '--detach', destination, commit], { cwd: SOURCE_REPO });
  applyQaOverlay(destination);
}

function installAndBuild(postRoot, preRoot) {
  run('npm', ['ci', '--no-audit', '--no-fund'], { cwd: postRoot });
  const postLock = path.join(postRoot, 'package-lock.json');
  const preLock = path.join(preRoot, 'package-lock.json');
  if (fileHash(postLock) === fileHash(preLock)) {
    symlinkSync(path.join(postRoot, 'node_modules'), path.join(preRoot, 'node_modules'), 'dir');
    console.log('[deps] pre/post lockfiles match; sharing installed dependencies');
  } else run('npm', ['ci', '--no-audit', '--no-fund'], { cwd: preRoot });
  const buildEnv = { ...process.env, NODE_OPTIONS: '--openssl-legacy-provider' };
  run('npm', ['run', 'build'], { cwd: postRoot, env: buildEnv });
  run('npm', ['run', 'build'], { cwd: preRoot, env: buildEnv });
}

function runWorker({ pr, variant, targetRoot, resultDir, planPath }) {
  const resultPath = path.join(resultDir, `${variant}.json`);
  const workerEnv = {
    ...process.env,
    PR_NUMBER: String(pr),
    TARGET_REPO_ROOT: targetRoot,
    DIST_DIR: path.join(targetRoot, 'dist'),
    BACKTEST_VARIANT: variant,
    BACKTEST_PLAN_PATH: planPath,
    BACKTEST_RESULT_PATH: resultPath,
    BACKTEST_SCREENSHOT_PATH: path.join(resultDir, `${variant}.png`),
  };
  run(process.execPath, [WORKER], { cwd: path.dirname(WORKER), env: workerEnv });
  return existsSync(resultPath) ? readJson(resultPath) : null;
}

async function main() {
  const prs = parsePrNumbers(env('BACKTEST_PRS'));
  rmSync(TEMP_ROOT, { recursive: true, force: true });
  rmSync(OUTPUT_ROOT, { recursive: true, force: true });
  mkdirSync(TEMP_ROOT, { recursive: true });
  mkdirSync(OUTPUT_ROOT, { recursive: true });
  run('git', ['worktree', 'prune'], { cwd: SOURCE_REPO });
  const summary = [];

  for (const pr of prs) {
    const resultDir = path.join(OUTPUT_ROOT, `pr-${pr}`);
    const workDir = path.join(TEMP_ROOT, `pr-${pr}`);
    const postRoot = path.join(workDir, 'post');
    const preRoot = path.join(workDir, 'pre');
    mkdirSync(resultDir, { recursive: true });
    let title = `PR ${pr}`;
    try {
      const metadata = JSON.parse(output('gh', ['pr', 'view', String(pr), '-R', REPO,
        '--json', 'number,title,headRefOid,baseRefOid,state']));
      title = metadata.title;
      writeFileSync(path.join(resultDir, 'metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`);
      console.log(`\n[batch] PR #${pr}: ${title}`);
      prepareWorktree(metadata.headRefOid, postRoot);
      prepareWorktree(metadata.baseRefOid, preRoot);
      installAndBuild(postRoot, preRoot);
      const planPath = path.join(resultDir, 'plan.json');
      const post = runWorker({ pr, variant: 'post', targetRoot: postRoot, resultDir, planPath });
      const pre = post?.status === 'PASS' && existsSync(planPath)
        ? runWorker({ pr, variant: 'pre', targetRoot: preRoot, resultDir, planPath }) : null;
      const classification = classifyPair(post, pre);
      summary.push({ pr, title, ...classification, post: post?.status || null, pre: pre?.status || null });
    } catch (error) {
      console.error(`[batch] PR #${pr} failed: ${error.stack || error.message}`);
      summary.push({ pr, title, outcome: 'ERROR', detail: error.message, post: null, pre: null });
    } finally {
      for (const worktree of [preRoot, postRoot]) {
        try { run('git', ['worktree', 'remove', '--force', worktree], { cwd: SOURCE_REPO }); } catch { /* cleanup below */ }
      }
      rmSync(workDir, { recursive: true, force: true });
      try { run('git', ['worktree', 'prune'], { cwd: SOURCE_REPO }); } catch { /* best effort */ }
      writeSummary(summary);
    }
  }
  console.log(`\n[batch] complete: ${path.join(OUTPUT_ROOT, 'summary.md')}`);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
}
