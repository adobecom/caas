#!/usr/bin/env node
/** Multi-page interactive agent QA review (advisory, non-blocking).
 *  For each PR-relevant page: capture a PR-build-vs-stable visual diff
 *  drive the interactive
 *  qa-runner with a page-specific instruction, post ONE combined comment. */
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const env = (k, d) => process.env[k] ?? d;
const PR = env('PR_NUMBER');
const REPO = env('GH_REPO', 'adobecom/caas');
const DIST = env('DIST_DIR');
const CDP = env('CDP_URL', 'http://127.0.0.1:9222');
const RUN_URL = env('RUN_URL', '');
const OUT = resolve(env('OUT_DIR', 'agent-review-out'));
if (!/^\d+$/.test(PR || '')) { console.error('PR_NUMBER must be a positive integer'); process.exit(1); }
if (!DIST) { console.error('DIST_DIR required'); process.exit(1); }
mkdirSync(OUT, { recursive: true });

const gh = (a) => execFileSync('gh', a, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const redact = (s) => (s || '').replace(/\b(gh[pousr]_[A-Za-z0-9]{20,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|AKIA[0-9A-Z]{16})\b/g, '[REDACTED]');
const ALLOW = new Set(['main.min.js', 'app.css', 'react.umd.js', 'react.dom.umd.js']);
const ct = (f) => (f.endsWith('.css') ? 'text/css' : 'application/javascript');

const meta = JSON.parse(gh(['pr', 'view', PR, '-R', REPO, '--json', 'title,body,files']));
let diff = ''; try { diff = gh(['pr', 'diff', PR, '-R', REPO]); } catch {}
const changed = (meta.files || []).map((f) => f.path).join('\n');

const OR = 'This collection uses OR filtering: selecting one filter narrows the full set, but selecting a SECOND filter in the same group WIDENS the results (union) -- treat that increase as CORRECT, not a bug.';
const VISUAL = `Loose VISUAL review. Budget: 4 turns, then call done(). Automated e2e tests already cover exact counts, filtering and sort order -- your ONLY job is to catch things that LOOK broken on the rendered page. Do NOT navigate or interact; the captured diff is all you need.
STEP 1: load_screenshots on the diff path given above. Magenta marks where the PR changed rendering. BOTH screenshots are the SAME page captured seconds apart, so the underlying content is IDENTICAL -- every magenta region is caused by the PR's code, NOT by content rotation or feed churn. Do NOT explain a diff away as 'different articles' or 'content churn'; that is not possible here. Use the "files the PR touched" hint to know which components to scrutinise, then judge whether the change is a REGRESSION -- truncated/clipped text, a broken/missing/distorted image, overlapping or misaligned cards, wrong spacing, low contrast, or a changed/empty result set.
STEP 2: get_console_errors -- note any crash.
STEP 3: done(report, verdict). PASS only if the touched components render correctly. FAIL if you see any visible change in them -- say exactly what and where. Judge ONLY by what you SEE.`;

const PAGES = [
  { id: 'A-left-hub', url: 'https://business.adobe.com/customer-success-stories.html',
    triggers: /Filters\/Left|CardFilterer|getFilteredCards|Helpers|Search|Sort|Pagination|Bookmark|Container|Card\.jsx/i,
    kind: 'visual', instr: VISUAL },
  { id: 'B-top-panel', url: 'https://news.adobe.com/news?ch_News+articles=Experience%2520Cloud',
    triggers: /Filters\/Top|Container|CardFilterer|getFilteredCards|Helpers|Card\.jsx/i,
    kind: 'visual', instr: VISUAL },
  { id: 'C-events', url: 'https://www.adobe.com/events.html',
    triggers: /eventSort|Sort|timing|event|Container|Helpers|Card\.jsx/i,
    instr: `Event collection (cards have dates). Verify the ordering looks right for events (upcoming first / dates ascending, not past-first). Check a register / save-your-spot banner card -> its CTA renders and is clickable. Apply a filter if present -> results update.` },
  { id: 'D-carousel', url: 'https://www.adobe.com/max/2025/community.html',
    triggers: /Carousel|Grid|Card\.jsx/i,
    instr: `Carousel collection. Cards render in a horizontal carousel. Click next/prev (or scroll) -> the carousel advances and shows new cards. Verify the arrows/affordances render and nothing is clipped or overlapping.` },
  { id: 'E-gallery', url: 'https://milo.adobe.com/drafts/caas/card-styles',
    triggers: /Cards\/|Card\.jsx|CardContent|CardHeader|CardFooter/i, fullPage: true, wait: 16000,
    instr: `Card-style gallery: a TALL page rendering every card style. VISUAL review only -- you do NOT need to interact. Load the diff image once (load_screenshots), then report each card style that looks broken: truncated/clipped text, broken/missing image, misaligned or overlapping elements, wrong spacing, or a style that fails to render. If nothing changed, say all styles render cleanly. End with done(report, verdict) promptly.` },
];

const SEL = {
  'A-left-hub':  { cards: '.consonant-Card', count: '.consonant-FiltersInfo-results', filterGroup: '.consonant-LeftFilters-header', filterScope: '.consonant-Filters', filterCheckbox: '.consonant-Filters input[type=checkbox]', clearAll: '.consonant-LeftFilters-clearLink', search: '.consonant-Search-input', sort: '.consonant-Select-btn', pagination: '.consonant-Pagination' },
  'B-top-panel': { cards: '.consonant-Card', filterOpen: '.consonant-TopFilter-link', filterScope: '.consonant-TopFilter', filterCheckbox: '.consonant-TopFilter input[type=checkbox]', sort: '.consonant-Select-btn', pagination: '.consonant-Pagination' },
  'C-events':    { cards: '.consonant-Card', filterOpen: '.consonant-TopFilter-link', filterScope: '.consonant-TopFilter', filterCheckbox: '.consonant-TopFilter input[type=checkbox]', pagination: '.consonant-Pagination.lightText' },
  'D-carousel':  { cards: '.consonant-Card', cardLink: '.consonant-LinkBlocker' },
  'E-gallery':   { cards: '.consonant-Card' },
};

const SHARED = /Card\.jsx|Container\.jsx|Helpers\/|app\.jsx|\.less/i;
const isShared = SHARED.test(changed);
let selected = isShared ? PAGES : PAGES.filter((p) => p.triggers.test(changed));
selected = PAGES.filter((p) => p.id === 'A-left-hub' || p.id === 'B-top-panel'); // TEMP: validate A+B loose-visual
console.log(`Selected ${selected.length} page(s): ${selected.map((p) => p.id).join(', ')}`);

async function captureDiff(url, tag, opts = {}) {
  let pct = 'n/a';
  try {
    const browser = await chromium.connectOverCDP(CDP);
    const c = browser.contexts()[0] || (await browser.newContext());
    const shot = async (inject, out) => {
      const p = await c.newPage(); await p.setViewportSize({ width: 1280, height: 1800 });
      if (inject) {
        await p.route('**/caas-libs/**', async (r) => {
          const f = r.request().url().split('?')[0].split('/').pop();
          if (!ALLOW.has(f)) return r.continue();
          try { await r.fulfill({ path: `${DIST}/${f}`, contentType: ct(f) }); } catch { await r.continue(); }
        });
      }
      await p.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
      await p.waitForTimeout(opts.wait || 15000);
      if (opts.fullPage) {
        await p.evaluate(async () => { const H = document.body.scrollHeight; for (let y = 0; y < H; y += 1000) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } window.scrollTo(0, 0); });
        await p.waitForTimeout(1500);
      } else {
        const card = await p.$('.consonant-Card'); if (card) await card.scrollIntoViewIfNeeded().catch(() => {});
        await p.waitForTimeout(1500);
      }
      await p.screenshot({ path: out, fullPage: !!opts.fullPage }); await p.close();
    };
    await shot(true, `${OUT}/${tag}-pr.png`);
    await shot(false, `${OUT}/${tag}-stable.png`);
    await browser.close();
    const a = PNG.sync.read(readFileSync(`${OUT}/${tag}-pr.png`)), b = PNG.sync.read(readFileSync(`${OUT}/${tag}-stable.png`));
    const w = Math.min(a.width, b.width), Ht = Math.min(a.height, b.height);
    const ca = new PNG({ width: w, height: Ht }); PNG.bitblt(a, ca, 0, 0, w, Ht, 0, 0);
    const cb = new PNG({ width: w, height: Ht }); PNG.bitblt(b, cb, 0, 0, w, Ht, 0, 0);
    const d = new PNG({ width: w, height: Ht });
    const n = pixelmatch(ca.data, cb.data, d.data, w, Ht, { threshold: 0.12, includeAA: false });
    writeFileSync(`${OUT}/${tag}-diff.png`, PNG.sync.write(d)); pct = (100 * n / (w * Ht)).toFixed(2);
  } catch (e) { console.log(`[${tag}] diff capture failed: ${String(e).slice(0, 120)}`); }
  return { pct };
}

const sections = [];
for (const page of selected) {
  console.log(`\n===== ${page.id} :: ${page.url} =====`);
  const { pct } = await captureDiff(page.url, page.id, { fullPage: page.fullPage, wait: page.wait });
  const diffHint = `A pixel diff of the PR build vs current stable was captured; ${pct}% of pixels changed. Magenta regions mark where the PR changed rendering. Call load_screenshots(["${OUT}/${page.id}-diff.png"]) once to see them, then interact.`;
  const sel = SEL[page.id] || {};
  const selHint = Object.keys(sel).length
    ? ['Selectors for THIS page. To interact efficiently: call get_interactives(scope) SCOPED to the container below (returns a SMALL numbered list), then click the ref -- do NOT call get_interactives unscoped, which dumps the whole page and wastes turns. Use find_and_show(selector) to bring a region into view first.',
       ...Object.entries(sel).map(([k, v]) => '  - ' + k + ': ' + v),
       sel.count ? 'Read the live result count from "' + sel.count + '" via evaluate after each interaction.'
                 : 'No count element here; measure result size by counting "' + (sel.cards || '.consonant-Card') + '" via evaluate(document.querySelectorAll(...).length).',
      ].join('\n')
    : '';
  const instruction = (page.kind === 'visual'
    ? [
        `Target URL: ${page.url}`, '',
        `You are QA-reviewing pull request #${PR}. The PR's CaaS build is injected into this live page.`,
        `PR code diff (CONTEXT ONLY -- use it to know which components to scrutinise and to EXPLAIN the cause of anything you SEE broken. Do NOT fail a page merely because code changed; only FAIL if you actually SEE a defect in the render):\n${redact(diff).slice(0, 6000)}`,
        diffHint,
        '', page.instr, '',
      ]
    : page.kind === 'interactive'
    ? [
        `Target URL: ${page.url}`, '',
        `You are QA-reviewing pull request #${PR}. The PR's CaaS build is injected into this live page, so you are testing the PR's real code.`,
        '', page.instr, '',
        'Base your verdict ONLY on what you observe by following the steps -- do NOT infer it from any code change. End with done(report, verdict).',
      ]
    : [
        `Target URL: ${page.url}`, '',
        `You are QA-reviewing pull request #${PR}. The PR's CaaS build is injected into this live page, so you are testing the PR's code on the real page.`,
        diffHint,
        `PR title: ${meta.title}`,
        `Code diff (truncated, secrets redacted): ${redact(diff).slice(0, 5000)}`,
        '', selHint, '', page.instr, '',
        'Report anything broken/truncated/misaligned/wrong; if clean, say so. End with done(report, verdict).',
      ]).join('\n');
  const REPORT_OUT = `/tmp/pr-review-${page.id}.json`; try { unlinkSync(REPORT_OUT); } catch {}
  const run = spawnSync('node', ['qa-runner-v2.mjs', instruction], {
    stdio: 'inherit', timeout: Number(env('AGENT_TIMEOUT_MS', '150000')), killSignal: 'SIGKILL',
    env: { ...process.env, DIST_DIR: DIST, REPORT_OUT, MAX_TURNS: env('MAX_TURNS', '10') },
  });
  const timedOut = run.signal === 'SIGKILL' || run.error?.code === 'ETIMEDOUT';
  let verdict = 'UNKNOWN', report = timedOut ? `Agent run exceeded the per-page time cap; partial only. (${pct}% pixels changed.)` : '(no report produced)';
  if (existsSync(REPORT_OUT)) { try { const j = JSON.parse(readFileSync(REPORT_OUT, 'utf8')); verdict = j.verdict || verdict; report = j.report || report; } catch {} }
  sections.push({ id: page.id, url: page.url, pct, verdict, report });
}

const overall = sections.some((s) => s.verdict === 'FAIL') ? 'FAIL' : (sections.every((s) => s.verdict === 'PASS') ? 'PASS' : 'MIXED');
const MARKER = '<!-- agent-qa-review -->';
const body = [MARKER,
  '## 🤖 Agent QA review — multi-page, interactive + visual diff (advisory, non-blocking)',
  '',
  `Reviewed **${sections.length}** page(s) on the live site with the PR build injected. Overall: **${overall}**.`,
  '',
  ...sections.map((s) => `<details><summary><b>${s.verdict}</b> — ${s.id} · ${s.pct}% pixels changed · ${s.url}</summary>\n\n${s.report}\n\n</details>`),
  '',
  RUN_URL ? `_Per-page screenshots + diffs in the [workflow run](${RUN_URL})._` : '',
].join('\n');

let cid = '';
try { const list = JSON.parse(gh(['pr', 'view', PR, '-R', REPO, '--json', 'comments'])); const m = (list.comments || []).filter((c) => (c.body || '').includes(MARKER)).pop(); if (m && m.url) cid = m.url.split('issuecomment-').pop(); } catch {}
if (cid) { gh(['api', '-X', 'PATCH', `repos/${REPO}/issues/comments/${cid}`, '-f', `body=${body}`]); }
else { writeFileSync(`${OUT}/comment.md`, body); gh(['pr', 'comment', PR, '-R', REPO, '--body-file', `${OUT}/comment.md`]); }
console.log(`agent-review: posted combined review on #${PR} — overall ${overall} across ${sections.length} page(s)`);
process.exit(0);
