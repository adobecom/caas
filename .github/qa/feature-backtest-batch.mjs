#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyQaOverlay } from './apply-qa-overlay.mjs';
import { diffSignatures, summarizeDiff } from './dom-diff.mjs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

// Visual diff of the pre-code vs post-code render (same forced scenario). Localised noise
// (antialiasing) is ignored via a threshold; a taller/shorter page (content changed) counts
// as a visual change directly.
function pixelDiff(prePng, postPng) {
  try {
    if (!existsSync(prePng) || !existsSync(postPng)) return null;
    const a = PNG.sync.read(readFileSync(prePng));
    const b = PNG.sync.read(readFileSync(postPng));
    if (a.width !== b.width || a.height !== b.height) return { changed: true, pct: 100, reason: 'render size changed' };
    const diff = new PNG({ width: a.width, height: a.height });
    const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
    const pct = Number(((n / (a.width * a.height)) * 100).toFixed(3));
    return { changed: pct > 0.1, pct };
  } catch (error) { return { changed: null, error: error.message }; }
}

const env = (name, fallback = '') => process.env[name] ?? fallback;
const REPO = env('GH_REPO', 'adobecom/caas');
const SOURCE_REPO = path.resolve(env('GITHUB_WORKSPACE', process.cwd()));
const TEMP_ROOT = path.resolve(env('RUNNER_TEMP', path.join(SOURCE_REPO, '.backtest-tmp')), 'caas-feature-backtest');
const OUTPUT_ROOT = path.resolve(env('BACKTEST_OUTPUT_DIR', path.join(SOURCE_REPO, 'backtest-out')));
const WORKER = path.join(path.dirname(fileURLToPath(import.meta.url)), 'feature-backtest-worker.mjs');
const CACHE_ROOT = path.resolve(env('CAAS_QA_CACHE', path.join(process.env.HOME || TEMP_ROOT, '.caas-qa-cache')));

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

function buildOrRestore(root, buildEnv) {
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const overlayHash = fileHash(path.join(root, 'react/src/js/app.jsx')).slice(0, 8)
    + fileHash(path.join(root, 'react/src/js/components/Consonant/Helpers/general.js')).slice(0, 8);
  const key = `${sha}-${overlayHash}`;
  const cached = path.join(CACHE_ROOT, 'dist', key);
  const dist = path.join(root, 'dist');
  if (existsSync(cached)) { cpSync(cached, dist, { recursive: true }); console.log(`[build] cache hit ${key.slice(0, 14)}`); return; }
  run('npm', ['run', 'build'], { cwd: root, env: buildEnv });
  try { mkdirSync(path.dirname(cached), { recursive: true }); cpSync(dist, cached, { recursive: true }); console.log(`[build] cached ${key.slice(0, 14)}`); }
  catch (error) { console.warn(`[build] cache store failed: ${error.message}`); }
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
  buildOrRestore(postRoot, buildEnv);
  buildOrRestore(preRoot, buildEnv);
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

function prIntentDiff(pr) {
  try {
    const raw = output('gh', ['pr', 'diff', String(pr), '-R', REPO]);
    const sections = raw.split(/(?=^diff --git )/m).filter(Boolean);
    const isInfra = (section) => {
      const filePath = (section.match(/^diff --git a\/(.+?) b\/(.+)$/m)?.[2]) || '';
      return filePath.startsWith('.github/') || filePath === 'package-lock.json';
    };
    return sections.filter((section) => !isInfra(section)).join('').slice(0, 6000);
  } catch { return ''; }
}

async function judgeExpected(intent, domDiff, visualDiff) {
  const PROXY = process.env.PROXY_URL; const MODEL = process.env.MODEL; const TOKEN = process.env.IMS_ACCESS_TOKEN;
  if (!PROXY || !MODEL || !TOKEN) return null;
  const { title = '', body = '', diff = '' } = intent || {};
  const prompt = `A historical PR was tested by forcing its feature to render on the OLD (pre-PR) code and the NEW (post-PR) code, then diffing the two renders. Decide whether the PR actually does what it claims.\n\n`
    + `=== WHAT THE PR INTENDED (from its own title, description, and code change) ===\n`
    + `Title: ${title}\n`
    + `Description: ${(body || '(none)').slice(0, 1200)}\n`
    + `Code change (context for INTENT only, NOT proof it works):\n${(diff || '(none)').slice(0, 6000)}\n\n`
    + `=== WHAT ACTUALLY CHANGED ON THE PAGE (the only evidence of real behavior) ===\n`
    + `Structural change (new vs old render): ${domDiff ? domDiff.summary : 'none captured'}\n`
    + `Visual change: ${visualDiff ? (visualDiff.changed ? `yes (${visualDiff.pct}% of pixels)` : 'no') : 'n/a'}\n\n`
    + `The rendered page diff is the source of truth for what the code ACTUALLY did. The code change only shows what was INTENDED, so never assume it worked because it looks correct.\n`
    + `Reply ONLY JSON: {"verdict":"WORKS"|"FLAG"|"NO_CHANGE","reason":"one sentence"}.\n`
    + `- WORKS: the PR intended a visible change AND the page changed in a way that matches that intent.\n`
    + `- FLAG: the PR intended a visible change but the page shows nothing (feature missing or broken), OR the page changed in a way that does not match the intent (wrong result, or an unrelated element changed or broke).\n`
    + `- NO_CHANGE: the PR did not intend any visible change (pure refactor, comment/log/formatting tweak) and the page correctly shows no change.`;
  try {
    const res = await fetch(PROXY, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 600, stream: true, messages: [{ role: 'user', content: prompt }] }) });
    const raw = await res.text(); let text = '';
    for (const line of raw.split('\n')) { const t = line.trim(); if (!t.startsWith('data:')) continue; const d = t.slice(5).trim(); if (!d || d === '[DONE]') continue; let e; try { e = JSON.parse(d); } catch { continue; } if (e.type === 'content_block_delta' && e.delta?.type === 'text_delta') text += e.delta.text || ''; }
    const j = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
    return { verdict: j.verdict, reason: j.reason };
  } catch (error) { return { error: error.message }; }
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
        '--json', 'number,title,body,headRefOid,baseRefOid,state']));
      title = metadata.title;
      const body = metadata.body || '';
      const intentDiff = prIntentDiff(pr);
      writeFileSync(path.join(resultDir, 'metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`);
      console.log(`\n[batch] PR #${pr}: ${title}`);
      prepareWorktree(metadata.headRefOid, postRoot);
      prepareWorktree(metadata.baseRefOid, preRoot);
      installAndBuild(postRoot, preRoot);
      const planPath = path.join(resultDir, 'plan.json');
      const post = runWorker({ pr, variant: 'post', targetRoot: postRoot, resultDir, planPath });
      const pre = existsSync(planPath)
        ? runWorker({ pr, variant: 'pre', targetRoot: preRoot, resultDir, planPath }) : null;
      const classification = classifyPair(post, pre);
      let domDiff = null;
      const postSig = post?.observed?.domSignature; const preSig = pre?.observed?.domSignature;
      if (postSig && preSig) {
        const d = diffSignatures(preSig, postSig);
        domDiff = { changed: d.changed, summary: summarizeDiff(d) };
        writeFileSync(path.join(resultDir, 'dom-diff.json'), `${JSON.stringify(d, null, 2)}\n`);
        console.log(`[dom-diff] PR #${pr}: ${domDiff.summary}`);
      }
      const visualDiff = pixelDiff(path.join(resultDir, 'pre.png'), path.join(resultDir, 'post.png'));
      // Diff-based verdict: the render changed old->new (structurally or visually) => the PR
      // produced an observable effect; both empty => no visible change (refactor/no-op).
      let diffVerdict = null;
      if (domDiff || visualDiff) {
        const changed = Boolean(domDiff?.changed) || Boolean(visualDiff?.changed);
        diffVerdict = changed ? 'CHANGED' : 'NO_CHANGE';
        console.log(`[diff-verdict] PR #${pr}: ${diffVerdict} (dom=${domDiff?.changed ?? 'n/a'} visual=${visualDiff?.changed ?? 'n/a'}${visualDiff?.pct !== undefined ? ` ${visualDiff.pct}%` : ''})`);
      }
      let expected = null;
      if (diffVerdict) {
        expected = await judgeExpected({ title, body, diff: intentDiff }, domDiff, visualDiff);
        if (expected) console.log(`[judge] PR #${pr}: ${expected.verdict || 'ERR'} - ${expected.reason || expected.error}`);
      }
      summary.push({ pr, title, ...classification, post: post?.status || null, pre: pre?.status || null, domDiff, visualDiff, diffVerdict, expected });
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
