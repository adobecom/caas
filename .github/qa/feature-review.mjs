#!/usr/bin/env node
/*
 * Feature QA review (advisory, non-blocking).
 *
 * Unlike the smoke/visual agent review, this tries to actually EXERCISE a new
 * feature. It reasons about the PR: is this a config/data-gated CaaS collection
 * feature we can force by (a) overriding the config (via the ?caasqa localStorage
 * hook) and (b) mocking the chimera-api/collection response? If not, it skips
 * cleanly. If yes, it injects the PR build + the config + a crafted collection,
 * renders it on a live page, reads the result, and validates it against what the
 * PR's own unit tests say should happen.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const env = (k, d = '') => (process.env[k] ?? d);
const PR    = env('PR_NUMBER');
const REPO  = env('GH_REPO', 'adobecom/caas');
const CDP   = env('CDP_URL', 'http://127.0.0.1:9222');
const DIST  = env('DIST_DIR');
const PROXY = env('PROXY_URL');
const MODEL = env('MODEL');
const TOKEN = env('IMS_ACCESS_TOKEN');
const RUN_URL = env('RUN_URL', '');
const PAGE  = env('PAGE_URL', 'https://business.adobe.com/customer-success-stories.html');
const MARKER = '<!-- feature-qa-review -->';
const gh = (a) => execFileSync('gh', a, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
const ALLOW = new Set(['app.css', 'main.min.js', 'react.umd.js', 'react.dom.umd.js']);

const CARD_SHAPE = `Each card (chimera-api/collection "cards[]" item) needs at least:
{ "id": "unique", "styles": { "typeOverride": "default", "backgroundImage": "https://business.adobe.com/content/dam/dx/us/en/images/cards/default/media_1.jpg", "icon": "" },
  "contentArea": { "title": "<visible title>", "detailText": "<eyebrow>", "url": "https://business.adobe.com/" },
  "overlays": { "banner": {}, "logo": { "src": "" }, "label": {}, "videoButton": { "url": "" } },
  "footer": [{ "left": [], "center": [], "right": [] }], "tags": [{ "id": "caas:country/us" }],
  "cardDate": "<ISO>", "modifiedDate": "<ISO>", "createdDate": "<ISO>", "country": "US", "origin": "hawks" }`;

async function llm(prompt, maxTokens = 4000) {
  const body = JSON.stringify({ model: MODEL, max_tokens: maxTokens, stream: true,
    messages: [{ role: 'user', content: prompt }] });
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = execFileSync('curl', ['-sS', '-N', '-X', 'POST', PROXY,
      '-H', `Authorization: Bearer ${TOKEN}`, '-H', 'Content-Type: application/json',
      '-H', 'anthropic-version: 2023-06-01', '--max-time', '150', '-d', body],
      { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    let text = '', stop = false, err = null;
    for (const line of r.split('\n')) {
      const t = line.trim(); if (!t.startsWith('data:')) continue;
      const d = t.slice(5).trim(); if (!d || d === '[DONE]') continue;
      let e; try { e = JSON.parse(d); } catch { continue; }
      if (e.type === 'content_block_delta' && e.delta?.type === 'text_delta') text += e.delta.text || '';
      else if (e.type === 'message_stop') stop = true;
      else if (e.type === 'error') err = e.error;
    }
    if (!err && stop && text.trim()) return text.trim();
    console.error(`[llm] attempt ${attempt + 1} failed (${err ? JSON.stringify(err) : 'incomplete'})`);
    if (attempt < 2) await new Promise((s) => setTimeout(s, 8000 * (attempt + 1)));
  }
  throw new Error('llm failed after retries');
}
const extractJson = (s) => {
  let t = String(s).replace(/```(?:json)?/gi, '').trim();
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a === -1 || b === -1 || b <= a) throw new Error('no JSON in LLM output');
  return JSON.parse(t.slice(a, b + 1));
};

function postComment(verdict, bodyMd) {
  const comment = [MARKER, `## 🧪 Feature QA review — injected feature test (advisory, non-blocking)`, '',
    `Overall: **${verdict}**`, '', bodyMd, '',
    RUN_URL ? `_Screenshot in the [workflow run](${RUN_URL})._` : ''].join('\n');
  writeFileSync('/tmp/feature-comment.md', comment);
  try { gh(['pr', 'comment', PR, '-R', REPO, '--body-file', '/tmp/feature-comment.md']); } catch (e) { console.error('post failed', e.message); }
}

(async () => {
  const meta = JSON.parse(gh(['pr', 'view', PR, '-R', REPO, '--json', 'title,body,files']));
  const rawDiff = gh(['pr', 'diff', PR, '-R', REPO]);
  // Drop this tool's OWN infra from the diff so it judges the PR's real change.
  const diff = rawDiff.split(/(?=^diff --git )/m)
    .filter((h) => !/feature-review\.mjs|qa-feature-review\.yml/.test((h.split('\n')[0] || '')))
    .join('').slice(0, 24000);
  const specPaths = (meta.files || []).map((f) => f.path).filter((p) => /\.spec\.(jsx?|tsx?)$/.test(p));
  const specText = specPaths.map((p) => { try { return `\n// FILE ${p}\n${readFileSync(p, 'utf8')}`; } catch { return ''; } }).join('\n').slice(0, 14000);

  // ---- Step 1: decide + build a test plan ----
  const detect = await llm(
`You are triaging an Adobe CaaS (Consonant card collection) pull request to decide if its feature can be EXERCISED by an automated harness.

The harness can force exactly two things: (1) the CaaS CONFIG (any field, deep-merged, via a ?caasqa localStorage override), and (2) the COLLECTION DATA (the chimera-api/collection JSON response can be replaced with crafted cards). It then renders the real build on a live page and reads the resulting DOM.

A PR is TESTABLE only if its behaviour is driven by config and/or card data — e.g. a new sort mode, filter behaviour, a card field rendering, a config-gated layout. It is NOT testable (skip) if it is: a pure refactor, build/CI/tooling/deps, test-only, backend/service-only, a11y-only, or needs auth / multi-step user interaction / real network you can't mock.

PR title: ${meta.title}
PR body:
${(meta.body || '').slice(0, 1500)}

Unit tests changed (these often ENCODE the config, the input cards, and the expected result — use them):
${specText}

Diff (truncated):
${diff}

Card fixture shape you must follow when building cards:
${CARD_SHAPE}

Respond with ONLY a JSON object:
{
  "testable": true | false,
  "reason": "one sentence",
  "config": { ...deep-merge config override that activates the feature, e.g. {"sort":{"sortType":"localFirst","localFirstRecencyThreshold":6}} ... },
  "cards": [ ...4-8 renderable cards (full shape above) crafted so the feature's effect is VISIBLE in the rendered order/content... ],
  "expected": "a precise, checkable description of what the rendered card order/content should be if the feature works (derive from the unit tests)"
}
If testable is false, omit config/cards/expected.
IMPORTANT: your ENTIRE reply must be a single valid JSON object and NOTHING else -- no "SKIP", no explanation before or after, no code fences. Example when not testable: {"testable": false, "reason": "pure CI/tooling change, nothing config- or data-driven to exercise"}.`, 16000);

  console.error('[detect raw first 800]:', String(detect).slice(0, 800));
  let plan;
  try {
    plan = extractJson(detect);
  } catch (e) {
    // The model sometimes replies with prose (e.g. "SKIP ...") for the not-testable
    // case. Treat a clear skip/refactor/infra signal as a skip rather than erroring.
    if (/\b(skip|not testable|not a feature|refactor|tooling|infrastructure|cannot|no runtime)\b/i.test(detect)) {
      postComment('SKIPPED', `**Not an injectable feature** -- skipped.\n\n> ${String(detect).slice(0, 500)}`);
      console.log('skipped (prose): not testable'); process.exit(0);
    }
    throw e;
  }
  console.log(`[detect] testable=${plan.testable} reason=${plan.reason}`);

  if (!plan.testable) {
    postComment('SKIPPED', `**Not an injectable feature** — skipped.\n\n> ${plan.reason}\n\nThis PR's change isn't driven by config/collection data that the harness can force, so a feature test wouldn't be meaningful. (The visual/smoke review still applies.)`);
    console.log('skipped: not testable'); process.exit(0);
  }

  // ---- Step 2: inject config + mocked collection, render the PR build ----
  const browser = await chromium.connectOverCDP(CDP);
  const ctx = browser.contexts()[0] || (await browser.newContext());
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1280, height: 1800 });
  await page.addInitScript((cfg) => { try { window.localStorage.setItem('caasQaConfig', cfg); } catch (e) {} },
    JSON.stringify(plan.config || {}));
  await page.route('**/caas-libs/**', async (r) => {
    const f = r.request().url().split('?')[0].split('/').pop();
    if (ALLOW.has(f)) { try { return r.fulfill({ path: `${DIST}/${f}` }); } catch (e) {} }
    return r.continue();
  });
  await page.route('**/chimera-api/collection**', async (r) =>
    r.fulfill({ contentType: 'application/json', body: JSON.stringify({ cards: plan.cards || [], filters: [], isHashed: false }) }));

  const url = PAGE + (PAGE.includes('?') ? '&' : '?') + 'caasqa=1';
  await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
  await page.waitForSelector('.consonant-CardsGrid .consonant-Card', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2500);
  // Scope the read to the FIRST card collection on the page. Multi-collection
  // pages (e.g. a Featured row + a main grid) otherwise mix cards across grids,
  // producing duplicates and interleaved order. One grid == one config target.
  const observed = await page.evaluate(() => {
    const grid = document.querySelector('.consonant-CardsGrid');
    const cards = grid
      ? [...grid.querySelectorAll('.consonant-Card')]
      : [...document.querySelectorAll('.consonant-Card')];
    return cards.slice(0, 12).map((c, i) => {
      const t = c.querySelector('[class*="-title"]');
      return `${i + 1}. ${(t ? t.textContent : c.textContent).trim().slice(0, 60)}`;
    });
  });
  await page.screenshot({ path: '/tmp/feature-render.png' }).catch(() => {});
  await browser.close();

  // ---- Step 3: validate rendered vs expected ----
  const check = await llm(
`A CaaS feature was force-tested by injecting a config and a crafted collection, then rendering the real build.

Config injected: ${JSON.stringify(plan.config)}
Expected (what a correct build should render): ${plan.expected}
Actually rendered card order:
${observed.join('\n') || '(no cards rendered)'}

Does the rendered result match the expected behaviour? Respond with ONLY JSON: {"verdict":"PASS"|"FAIL","reason":"one or two sentences citing the observed vs expected order"}`, 1500);
  const res = extractJson(check);
  console.log(`[validate] ${res.verdict}: ${res.reason}`);

  postComment(res.verdict,
`Injected the PR build with a forced config + a crafted collection to exercise the feature.

**Config:** \`${JSON.stringify(plan.config)}\`
**Expected:** ${plan.expected}
**Rendered order:**
${observed.map((o) => `- ${o}`).join('\n') || '_(no cards rendered)_'}

**Verdict:** ${res.reason}`);
  process.exit(0);
})().catch((e) => { console.error('feature-review error:', e.message); process.exit(0); });
