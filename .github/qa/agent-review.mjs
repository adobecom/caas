#!/usr/bin/env node
/** Interactive agent QA review (advisory, non-blocking).
 *  1) Capture a PR-build-vs-stable visual diff on the live page (the guide).
 *  2) Drive the interactive qa-runner on the PR build, handing it the diff
 *     image + the PR code diff as context.
 *  3) Post a single deduped PR comment. Never gates. */
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { ensureBrowserTab } from './cdp-keepalive.mjs';

const env = (k, d) => process.env[k] ?? d;
const PR = env('PR_NUMBER');
const REPO = env('GH_REPO', 'adobecom/caas');
const DIST = env('DIST_DIR');
const CDP = env('CDP_URL', 'http://127.0.0.1:9222');


const BASE = env('BASE_URL', 'https://business.adobe.com/resources/main.html');
const CAASVER = env('CAASVER', ''); // optional version pin; default = bare URL, no query param
const RUN_URL = env('RUN_URL', '');
const OUT = resolve(env('OUT_DIR', 'agent-review-out'));
if (!/^\d+$/.test(PR || '')) { console.error('PR_NUMBER must be a positive integer'); process.exit(1); }
if (!DIST) { console.error('DIST_DIR required'); process.exit(1); }
mkdirSync(OUT, { recursive: true });

const gh = (args) => execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const redact = (s) => (s || '').replace(/\b(gh[pousr]_[A-Za-z0-9]{20,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|AKIA[0-9A-Z]{16})\b/g, '[REDACTED]');
const ALLOW = new Set(['main.min.js', 'app.css', 'react.umd.js', 'react.dom.umd.js']);
const ct = (f) => (f.endsWith('.css') ? 'text/css' : 'application/javascript');

// PR context
const meta = JSON.parse(gh(['pr', 'view', PR, '-R', REPO, '--json', 'title,body,files,createdAt,headRefOid,commits']));
// Sticky/history behavior applies to NEW PRs only. Legacy PRs (opened before the
// cutoff) already carry unstructured bot comments that cannot be cleanly reconciled,
// so leave them untouched: do nothing and exit.
const STICKY_CUTOFF = Date.parse('2026-07-16T00:00:00Z');
if (Number.isFinite(Date.parse(meta.createdAt)) && Date.parse(meta.createdAt) < STICKY_CUTOFF) {
  console.log(`agent-review: PR #${PR} predates sticky-comment cutoff; skipping (legacy PR untouched).`);
  process.exit(0);
}
let diff = '';
try { diff = gh(['pr', 'diff', PR, '-R', REPO]); } catch {}

// 1) capture PR-vs-stable visual diff (the guide)
const url = CAASVER ? `${BASE}?caasver=${CAASVER}` : BASE;
let pct = 'n/a';
try {
  await ensureBrowserTab(CDP);
  const browser = await chromium.connectOverCDP(CDP);
  const c = browser.contexts()[0] || (await browser.newContext());
  const shot = async (inject, out) => {
    const p = await c.newPage();
    await p.setViewportSize({ width: 1280, height: 1800 });
    if (inject) {
      await p.route('**/caas-libs/**', async (r) => {
        const f = r.request().url().split('?')[0].split('/').pop();
        if (!ALLOW.has(f)) return r.continue();
        try { await r.fulfill({ path: `${DIST}/${f}`, contentType: ct(f) }); } catch { await r.continue(); }
      });
    }
    await p.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
    await p.waitForTimeout(15000);
    const card = await p.$('.consonant-Card');
    if (card) await card.scrollIntoViewIfNeeded().catch(() => {});
    await p.waitForTimeout(1500);
    await p.screenshot({ path: out });
    await p.close();
  };
  await shot(true, `${OUT}/pr.png`);
  await shot(false, `${OUT}/stable.png`);
  // Disconnect THIS CDP client (does not kill the persistent Chrome) so the
  // qa-runner subprocess is the sole Playwright client — two concurrent clients
  // on one browser cause navigation timeouts and hangs.
  await browser.close();
  const a = PNG.sync.read(readFileSync(`${OUT}/pr.png`)), b = PNG.sync.read(readFileSync(`${OUT}/stable.png`));
  const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
  const ca = new PNG({ width: w, height: h }); PNG.bitblt(a, ca, 0, 0, w, h, 0, 0);
  const cb = new PNG({ width: w, height: h }); PNG.bitblt(b, cb, 0, 0, w, h, 0, 0);
  const d = new PNG({ width: w, height: h });
  const n = pixelmatch(ca.data, cb.data, d.data, w, h, { threshold: 0.12, includeAA: false });
  writeFileSync(`${OUT}/diff.png`, PNG.sync.write(d));
  pct = (100 * n / (w * h)).toFixed(2);
} catch (e) { console.log('visual-diff capture failed: ' + String(e).slice(0, 160)); }

// 2) interactive agent, guided by the diff + the PR code diff
const instruction = [
  `Target URL: ${url}`,
  '',
  `You are QA-reviewing pull request #${PR}. The PR's CaaS build is already injected into this live page, so you are testing the PR's code on the real business.adobe.com collection.`,
  `A pixel diff of the PR build vs the current stable build was captured; ${pct}% of pixels changed. Magenta/colored regions in the diff mark where the PR changed the rendering. Call load_screenshots(["${OUT}/diff.png"]) ONCE to see those regions, then go interact with the areas that changed. (Do NOT load pr.png/stable.png — the diff alone is your guide.)`,
  `PR title: ${meta.title}`,
  `PR description: ${redact(meta.body || '(none)').slice(0, 1500)}`,
  `Changed files: ${(meta.files || []).map((f) => f.path).join(', ').slice(0, 800)}`,
  `Code diff (truncated, secrets redacted): ${redact(diff).slice(0, 6000)}`,
  '',
  'Then interact like a real user: apply a filter, run a search, paginate, open/inspect cards. Use the visual diff + code diff to focus where this PR changed things, and judge whether each change is intended or a regression. Run run_axe and get_console_errors at least once. Report anything broken/truncated/misaligned/low-contrast/wrong; if clean, say so. End with done(report, verdict).',
].join('\n');

const REPORT_OUT = '/tmp/pr-review-report.json';
try { unlinkSync(REPORT_OUT); } catch {}
const AGENT_TIMEOUT_MS = Number(env('AGENT_TIMEOUT_MS', '600000')); // hard cap: a hung browser can never block the runner
const run = spawnSync('node', ['qa-runner-v2.mjs', instruction], {
  stdio: 'inherit',
  timeout: AGENT_TIMEOUT_MS,
  killSignal: 'SIGKILL',
  env: { ...process.env, DIST_DIR: DIST, REPORT_OUT, MAX_TURNS: env('MAX_TURNS', '14') },
});
const timedOut = run.signal === 'SIGKILL' || run.error?.code === 'ETIMEDOUT';

let verdict = 'UNKNOWN', report = timedOut
  ? `Agent run exceeded the ${Math.round(AGENT_TIMEOUT_MS / 60000)}-minute cap and was stopped; partial exploration only. (${pct}% of pixels changed vs stable.)`
  : '(agent produced no report)';
if (existsSync(REPORT_OUT)) {
  try { const j = JSON.parse(readFileSync(REPORT_OUT, 'utf8')); verdict = j.verdict || verdict; report = j.report || report; } catch {}
}

const MARKER = '<!-- agent-qa-review -->';

// A tool failure (UNKNOWN verdict or timeout) -> do not post a review comment;
// flag it so the workflow email step can notify the maintainer privately.
const toolFailed = verdict === 'UNKNOWN' || timedOut;
if (toolFailed) {
  const flag = `${process.env.GITHUB_WORKSPACE || '.'}/AGENT_REVIEW_FAILED`;
  try { writeFileSync(flag, `PR #${PR}: verdict ${verdict}${timedOut ? ' (timed out)' : ''}, diff ${pct}%\n`, { flag: 'a' }); } catch {}
  console.error(`agent-review: tool failure on PR #${PR} (verdict ${verdict}, timedOut=${timedOut}); no comment posted (email step will fire).`);
  process.exit(0);
}

// ---- run metadata for the self-documenting history log ----
const nowUtc = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
const shortSha = (meta.headRefOid || '').slice(0, 7);
const commitsArr = meta.commits || [];
const lastMsg = commitsArr.length ? (commitsArr[commitsArr.length - 1].messageHeadline || '') : '';
const nFiles = (meta.files || []).length;
let action = '';
try { action = (JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')) || {}).action || ''; } catch {}
const ev = process.env.GITHUB_EVENT_NAME || '';
const trigger =
  (ev === 'pull_request' && action === 'synchronize') ? 'new commit pushed' :
  (ev === 'pull_request' && action === 'opened') ? 'PR opened' :
  (ev === 'pull_request' && action === 'reopened') ? 'PR reopened' :
  (ev === 'workflow_dispatch') ? 'manual re-run' :
  (ev === 'issue_comment') ? '@ai-bot re-run' : (ev || 'run');

// ---- fetch our existing comment (id + body) to carry the history log forward ----
let existingId = '', priorBody = '';
try {
  const line = gh(['api', `repos/${REPO}/issues/${PR}/comments`, '--paginate',
    '--jq', `.[] | select(.body | contains("${MARKER}")) | [(.id|tostring), (.body|@base64)] | @tsv`])
    .split('\n').map((s) => s.trim()).filter(Boolean)[0] || '';
  if (line) {
    const parts = line.split('\t');
    existingId = parts[0];
    if (parts[1]) priorBody = Buffer.from(parts[1], 'base64').toString('utf8');
  }
} catch { existingId = ''; }

const prevHist = (priorBody.match(/<!-- history:start -->([\s\S]*?)<!-- history:end -->/) || [null, ''])[1]
  .split('\n').map((s) => s.trim()).filter((s) => s.startsWith('- '));
const entry = `- \`${shortSha || '???????'}\` · ${nowUtc} · ${trigger}${lastMsg ? ` · ${lastMsg.slice(0, 80).replace(/\|/g, '/')}` : ''}`;
const history = [entry, ...prevHist].slice(0, 12);

const headerMeta = `_Last updated ${nowUtc} · ${trigger}${shortSha ? ` · commit \`${shortSha}\`` : ''}${nFiles ? ` · ${nFiles} file${nFiles === 1 ? '' : 's'} changed in PR` : ''}._`;
const comment = [
  MARKER,
  '## Agent QA review — interactive + visual diff (advisory, non-blocking)',
  '',
  headerMeta,
  '',
  `Drove the PR build on the live business.adobe.com collection (filtered, searched, paginated, inspected cards), guided by a PR-vs-stable visual diff (**${pct}%** of pixels changed) and the PR code diff. Verdict: **${verdict}**.`,
  '',
  report,
  '',
  RUN_URL ? `_PR / stable / diff screenshots + console + axe artifacts in the [workflow run](${RUN_URL})._` : '',
  '',
  `<details><summary>Review history (${history.length} run${history.length === 1 ? '' : 's'})</summary>`,
  '',
  '<!-- history:start -->',
  ...history,
  '<!-- history:end -->',
  '</details>',
].join('\n');

// Keep exactly ONE comment per agent: edit our marked comment in place, or create it once.
writeFileSync(`${OUT}/comment.json`, JSON.stringify({ body: comment }));
if (existingId) {
  gh(['api', '-X', 'PATCH', `repos/${REPO}/issues/comments/${existingId}`, '--input', `${OUT}/comment.json`]);
} else {
  gh(['api', '-X', 'POST', `repos/${REPO}/issues/${PR}/comments`, '--input', `${OUT}/comment.json`]);
}
console.log(`agent-review: review ${existingId ? 'updated' : 'posted'} on PR #${PR} (verdict ${verdict}, ${trigger}, ${history.length} runs logged)`);
process.exit(0);
