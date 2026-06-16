#!/usr/bin/env node
/**
 * Agent QA review (advisory).
 *
 * Builds-aware, perceptual review of a PR's CaaS build on the REAL
 * business.adobe.com collection page. Pipeline:
 *   inject the PR's local dist into the live page via CDP request interception
 *   -> screenshot PR build vs current stable -> pixel diff
 *   -> hand (PR screenshot, stable screenshot, diff image, PR code diff, PR
 *      title+description) to a Claude judge via the Adobe LLM proxy
 *   -> post the findings as a PR comment.
 *
 * Non-gating: this only ever comments. The deterministic gates (unit / WDIO
 * e2e / pa11y) live elsewhere. The agent's job here is judgment + exploration
 * on the real page, which can't be a deterministic on/off check.
 *
 * Required env:
 *   PR_NUMBER         PR to review
 *   IMS_ACCESS_TOKEN  bearer for the LLM proxy (repo secret)
 *   PROXY_URL         LLM proxy /v1/messages endpoint (LLM_PROXY_ENDPOINT secret)
 *   GH_TOKEN          token for `gh pr comment`
 * Optional env:
 *   GH_REPO (default adobecom/caas), DIST_DIR (default ../../dist),
 *   CDP_URL (default http://127.0.0.1:9222), BASE_URL, CAASVER (default 0.53.0),
 *   MODEL (default claude-sonnet-4-6), OUT_DIR (default ./agent-review-out),
 *   RUN_URL (link back to the workflow run, for the comment).
 */
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const env = (k, d) => process.env[k] ?? d;
const PR = env('PR_NUMBER');
const REPO = env('GH_REPO', 'adobecom/caas');
const DIST = env('DIST_DIR', '../../dist');
const CDP = env('CDP_URL', 'http://127.0.0.1:9222');
const BASE = env('BASE_URL', 'https://business.adobe.com/resources/main.html');
const CAASVER = env('CAASVER', '0.53.0');
const TOKEN = env('IMS_ACCESS_TOKEN');
const PROXY = env('PROXY_URL');
const MODEL = env('MODEL', 'claude-sonnet-4-6');
const OUT = env('OUT_DIR', 'agent-review-out');
const RUN_URL = env('RUN_URL', '');

if (!PR || !TOKEN || !PROXY) {
  console.error('Missing required env: PR_NUMBER, IMS_ACCESS_TOKEN, PROXY_URL');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });
const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const ct = (f) => (f.endsWith('.css') ? 'text/css' : 'application/javascript');
const b64 = (p) => readFileSync(p).toString('base64');

// 1) PR context: intent (title/body) + what changed (files/diff)
const meta = JSON.parse(sh(`gh pr view ${PR} -R ${REPO} --json title,body,files`));
let codeDiff = '';
try { codeDiff = sh(`gh pr diff ${PR} -R ${REPO}`); } catch { /* diff optional */ }
codeDiff = codeDiff.slice(0, 12000);
const changedFiles = (meta.files || []).map((f) => f.path).join('\n').slice(0, 1500);

// 2) screenshots: PR build injected vs current stable, on the same real page
const url = `${BASE}?caasver=${CAASVER}`;
const browser = await chromium.connectOverCDP(CDP);
const ctx = browser.contexts()[0] || (await browser.newContext());
async function shot(injectPrBuild, outFile) {
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1280, height: 1800 });
  if (injectPrBuild) {
    await page.route('**/caas-libs/**', async (route) => {
      const file = route.request().url().split('?')[0].split('/').pop();
      try { await route.fulfill({ path: `${DIST}/${file}`, contentType: ct(file) }); }
      catch { await route.continue(); }
    });
  }
  await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(15000); // CaaS grid loads async from the collection API
  const card = await page.$('.consonant-Card');
  if (card) await card.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: outFile });
  await page.close();
}
await shot(true, `${OUT}/pr.png`);
await shot(false, `${OUT}/stable.png`);
await browser.close();

// 3) pixel diff (the deterministic clue we hand the agent)
const a = PNG.sync.read(readFileSync(`${OUT}/pr.png`));
const b = PNG.sync.read(readFileSync(`${OUT}/stable.png`));
const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
const diff = new PNG({ width: w, height: h });
const changed = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.12, includeAA: false });
writeFileSync(`${OUT}/diff.png`, PNG.sync.write(diff));
const pct = (100 * changed / (w * h)).toFixed(2);

// 4) Claude judge (multimodal) via the Adobe LLM proxy
const prompt = [
  'You are doing visual + perceptual QA on a pull request to the Adobe CaaS card collection,',
  'rendered on the REAL business.adobe.com page.',
  '',
  `PR title: ${meta.title}`,
  `PR description:\n${(meta.body || '(none)').slice(0, 2000)}`,
  `Changed files:\n${changedFiles}`,
  '',
  'Code diff (truncated):',
  codeDiff || '(unavailable)',
  '',
  `You are given three images: (1) the page with THIS PR's build injected, (2) the current stable build, (3) a pixel-diff highlighting changes. ${pct}% of pixels differ.`,
  'Use the diff and code diff as clues — note that some diff is just different cards loading (content noise), which you should ignore; focus on layout/styling/readability/a11y.',
  'Report ONLY things that look off, broken, or regressed (truncated text, broken layout, bad contrast, missing/overlapping cards, unintended styling), and tie each to the change when you can.',
  'If nothing looks wrong, say so in one line. Be concise and specific.',
].join('\n');

const payload = {
  model: MODEL,
  max_tokens: 1200,
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: prompt },
      { type: 'text', text: 'Image 1 — PR build:' },
      { type: 'image', source: { type: 'base64', media_type: 'image/png', data: b64(`${OUT}/pr.png`) } },
      { type: 'text', text: 'Image 2 — stable build:' },
      { type: 'image', source: { type: 'base64', media_type: 'image/png', data: b64(`${OUT}/stable.png`) } },
      { type: 'text', text: 'Image 3 — pixel diff (changes highlighted):' },
      { type: 'image', source: { type: 'base64', media_type: 'image/png', data: b64(`${OUT}/diff.png`) } },
    ],
  }],
};
let findings = '(agent judge unavailable)';
try {
  const res = await fetch(PROXY, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(payload),
  });
  if (res.ok) { const data = await res.json(); findings = data?.content?.[0]?.text || findings; }
  else { findings = `(agent judge unavailable: HTTP ${res.status})`; }
} catch (e) { findings = `(agent judge error: ${String(e).slice(0, 200)})`; }

// 5) post advisory PR comment
const comment = [
  '## 🤖 Agent QA review — visual + perceptual (advisory, non-blocking)',
  '',
  `Reviewed this PR's build on the live business.adobe.com collection page. **${pct}%** of pixels changed vs the stable build.`,
  '',
  findings,
  '',
  RUN_URL ? `_Screenshots and the pixel diff are in the [workflow artifacts](${RUN_URL})._` : '',
].join('\n');
writeFileSync(`${OUT}/comment.md`, comment);
sh(`gh pr comment ${PR} -R ${REPO} --body-file ${OUT}/comment.md`);
console.log(`agent-review: posted comment on PR #${PR} (pct changed ${pct})`);
process.exit(0);
