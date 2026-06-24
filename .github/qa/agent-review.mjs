#!/usr/bin/env node
/** Multi-page interactive agent QA review (advisory, non-blocking).
 *  For each PR-relevant page: capture a PR-build-vs-stable visual diff
 *  (segmented into bands for very tall pages), drive the interactive
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
const PAGES = [
  { id: 'A-left-hub', url: 'https://business.adobe.com/customer-success-stories.html',
    triggers: /Filters\/Left|CardFilterer|getFilteredCards|Helpers|Search|Sort|Pagination|Bookmark|Container|Card\.jsx/i,
    instr: `Left-filter collection. ${OR} Open the left filter panel, select a filter -> results narrow, the count updates, a selected-filter chip appears. Add a second filter in the same group -> results WIDEN (OR). Clear All -> back to full. Pick a filter combination yielding nothing -> a no-results empty state shows (not a blank/broken grid). Search a query -> results filter and the matched term is highlighted. Change the Sort dropdown -> the visible order changes. Go to page 2 -> the URL gains page=2 and different cards show; navigate to that page-2 URL fresh -> it should restore page 2. Bookmark a card -> the icon toggles; open the saved view -> only saved cards show. Click a card -> opens the expected link/modal.` },
  { id: 'B-top-panel', url: 'https://news.adobe.com/news?ch_News+articles=Experience%2520Cloud',
    triggers: /Filters\/Top|Container|CardFilterer|getFilteredCards|Helpers|Card\.jsx/i,
    instr: `Top-filter collection (a filter is pre-applied via the URL). Confirm the page loads already filtered to that selection. Open the top filter bar, change/add a filter -> results and count update. ${OR} Run a search -> results update.` },
  { id: 'C-events', url: 'https://www.adobe.com/events.html',
    triggers: /eventSort|Sort|timing|event|Container|Helpers|Card\.jsx/i,
    instr: `Event collection (cards have dates). Verify the ordering looks right for events (upcoming first / dates ascending, not past-first). Check a register / save-your-spot banner card -> its CTA renders and is clickable. Apply a filter if present -> results update.` },
  { id: 'D-carousel', url: 'https://www.adobe.com/max/2025/community.html',
    triggers: /Carousel|Grid|Card\.jsx/i,
    instr: `Carousel collection. Cards render in a horizontal carousel. Click next/prev (or scroll) -> the carousel advances and shows new cards. Verify the arrows/affordances render and nothing is clipped or overlapping.` },
  { id: 'E-gallery', url: 'https://milo.adobe.com/drafts/caas/card-styles',
    triggers: /Cards\/|Card\.jsx|CardContent|CardHeader|CardFooter/i, fullPage: true, segment: true, bandHeight: 1500, wait: 22000,
    instr: `Card-style gallery: a TALL page rendering every card style. VISUAL review only -- you do NOT need to interact. The full-page diff is split into vertical bands; load the changed bands and report each card style that looks broken: truncated/clipped text, broken/missing image, misaligned or overlapping elements, wrong spacing, or a style that fails to render. If no bands changed, say all styles render cleanly. End with done(report, verdict) promptly.` },
];

const SHARED = /Card\.jsx|Container\.jsx|Helpers\/|app\.jsx|\.less/i;
const isShared = SHARED.test(changed);
let selected = isShared ? PAGES : PAGES.filter((p) => p.triggers.test(changed));
if (selected.length === 0) selected = [PAGES[0]];
console.log(`Selected ${selected.length} page(s): ${selected.map((p) => p.id).join(', ')}`);

async function captureDiff(url, tag, opts = {}) {
  let pct = 'n/a'; const bands = [];
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
    if (opts.segment) {
      const BH = opts.bandHeight || 1500; let changed2 = 0;
      for (let y = 0, i = 0; y < Ht; y += BH, i++) {
        const bh = Math.min(BH, Ht - y);
        const pa = new PNG({ width: w, height: bh }); PNG.bitblt(a, pa, 0, y, w, bh, 0, 0);
        const pb = new PNG({ width: w, height: bh }); PNG.bitblt(b, pb, 0, y, w, bh, 0, 0);
        const pd = new PNG({ width: w, height: bh });
        const n = pixelmatch(pa.data, pb.data, pd.data, w, bh, { threshold: 0.12, includeAA: false });
        changed2 += n;
        const bp = 100 * n / (w * bh);
        if (bp > 0.3) { const fp = `${OUT}/${tag}-band${i}-diff.png`; writeFileSync(fp, PNG.sync.write(pd)); bands.push({ i, pct: bp.toFixed(2), path: fp }); }
      }
      pct = (100 * changed2 / (w * Ht)).toFixed(2);
    } else {
      const ca = new PNG({ width: w, height: Ht }); PNG.bitblt(a, ca, 0, 0, w, Ht, 0, 0);
      const cb = new PNG({ width: w, height: Ht }); PNG.bitblt(b, cb, 0, 0, w, Ht, 0, 0);
      const d = new PNG({ width: w, height: Ht });
      const n = pixelmatch(ca.data, cb.data, d.data, w, Ht, { threshold: 0.12, includeAA: false });
      writeFileSync(`${OUT}/${tag}-diff.png`, PNG.sync.write(d)); pct = (100 * n / (w * Ht)).toFixed(2);
    }
  } catch (e) { console.log(`[${tag}] diff capture failed: ${String(e).slice(0, 120)}`); }
  return { pct, bands };
}

const sections = [];
for (const page of selected) {
  console.log(`\n===== ${page.id} :: ${page.url} =====`);
  const { pct, bands } = await captureDiff(page.url, page.id, { fullPage: page.fullPage, wait: page.wait, segment: page.segment, bandHeight: page.bandHeight });
  const diffHint = bands.length
    ? `The full-page pixel diff was split into vertical bands (this page is very tall); overall ${pct}% changed, ${bands.length} band(s) changed. Load them: load_screenshots([${bands.map((bb) => `"${bb.path}"`).join(', ')}]). NOTE: a change to a card's height (e.g. a truncated title) shifts every card BELOW it upward, so several changed bands can be ONE root cause -- report the root cause(s), not each shifted band.`
    : `A pixel diff of the PR build vs current stable was captured; ${pct}% of pixels changed. Magenta regions mark where the PR changed rendering. Call load_screenshots(["${OUT}/${page.id}-diff.png"]) once to see them, then interact.`;
  const instruction = [
    `Target URL: ${page.url}`, '',
    `You are QA-reviewing pull request #${PR}. The PR's CaaS build is injected into this live page, so you are testing the PR's code on the real page.`,
    diffHint,
    `PR title: ${meta.title}`,
    `Code diff (truncated, secrets redacted): ${redact(diff).slice(0, 5000)}`,
    '', page.instr, '',
    'Report anything broken/truncated/misaligned/wrong; if clean, say so. End with done(report, verdict).',
  ].join('\n');
  const REPORT_OUT = `/tmp/pr-review-${page.id}.json`; try { unlinkSync(REPORT_OUT); } catch {}
  const run = spawnSync('node', ['qa-runner-v2.mjs', instruction], {
    stdio: 'inherit', timeout: Number(env('AGENT_TIMEOUT_MS', '180000')), killSignal: 'SIGKILL',
    env: { ...process.env, DIST_DIR: DIST, REPORT_OUT, MAX_TURNS: env('MAX_TURNS', '16') },
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
