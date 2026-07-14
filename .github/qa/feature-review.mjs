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
import path from 'node:path';
import { chromium } from 'playwright';
import { researchCode } from './code-search.mjs';

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
const ROOT  = path.resolve(env('GITHUB_WORKSPACE', process.cwd()));
const MARKER = '<!-- feature-qa-review -->';
const gh = (a) => execFileSync('gh', a, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
const ALLOW = new Set(['app.css', 'main.min.js', 'react.umd.js', 'react.dom.umd.js']);

const CARD_SHAPE = `Each card (chimera-api/collection "cards[]" item) needs at least:
{ "id": "unique", "styles": { "typeOverride": "one-half", "backgroundImage": "https://business.adobe.com/content/dam/dx/us/en/images/cards/default/media_1.jpg", "icon": "" },
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
  const diffSections = rawDiff.split(/(?=^diff --git )/m).filter(Boolean);
  const qaHookPattern = /applyQaConfigOverride|caasQaConfig|__caasQaConfigs|_caasQaReplace/;
  const sectionPath = (section) => section.match(/^diff --git a\/(.+?) b\/(.+)$/m)?.[2] || '';
  const qaHookPaths = new Set(diffSections
    .filter((section) => /react\/src\/js\/components\/Consonant\/Helpers\/(?:general\.js|__tests__\/general\.spec\.js)$/.test(sectionPath(section)) && qaHookPattern.test(section))
    .map(sectionPath));
  const isReviewerInfra = (filePath) => filePath.startsWith('.github/qa/') ||
    filePath === '.github/workflows/qa-feature-review.yml' || qaHookPaths.has(filePath);
  // Drop this reviewer's own implementation and gated QA hook so it judges only
  // the product feature. This matters when replaying older self-test PRs.
  const diff = diffSections.filter((section) => !isReviewerInfra(sectionPath(section))).join('').slice(0, 24000);
  const changedPaths = (meta.files || []).map((f) => f.path).filter((filePath) => !isReviewerInfra(filePath));
  const specPaths = changedPaths.filter((p) => /\.(spec|test)\.(jsx?|tsx?)$/.test(p));
  const specText = specPaths.map((p) => {
    try { return `\n// FILE ${p}\n${readFileSync(path.resolve(ROOT, p), 'utf8')}`; } catch { return ''; }
  }).join('\n').slice(0, 14000);

  // ---- Step 1: decide whether the PR's feature can be exercised at all ----
  const detect = await llm(
`You are triaging an Adobe CaaS (Consonant card collection) pull request to decide if its feature can be EXERCISED by an automated harness.

The harness renders the REAL PR build on a live page and can force exactly two things: (1) the CaaS CONFIG for a collection (it reads the page's real config and can replace it wholesale), and (2) the COLLECTION DATA (the chimera-api/collection JSON, replaced with crafted cards). It then reads the resulting DOM.

TESTABLE only if the behaviour is driven by config and/or card data (a new sort mode, filter behaviour, a card field rendering, a config-gated layout). NOT testable if it is a pure refactor, build/CI/tooling/deps, test-only, backend/service-only, or needs unsupported auth / interaction / external state.

The changed-file list and diff below already exclude this reviewer's own workflow, search implementation, and gated applyQaConfigOverride hook. Never select those QA mechanics as the product feature. For a self-test PR whose title/body names an earlier product behavior, test that named behavior from the included product spec.

PR title: ${meta.title}
PR body:
${(meta.body || '').slice(0, 1500)}

Changed files:
${changedPaths.join('\n')}

Changed unit tests:
${specText}

Diff (truncated):
${diff}

Respond with ONLY a JSON object: {"testable":true|false,"reason":"one sentence"}.`, 4000);

  console.error('[detect raw first 400]:', String(detect).slice(0, 400));
  let plan;
  try { plan = extractJson(detect); }
  catch (e) {
    if (/\b(skip|not testable|not a feature|refactor|tooling|infrastructure|cannot|no runtime)\b/i.test(detect)) {
      postComment('SKIPPED', `**Not an injectable feature** -- skipped.\n\n> ${String(detect).slice(0, 500)}`);
      console.log('skipped (prose): not testable'); process.exit(0);
    }
    throw e;
  }
  console.log(`[detect] testable=${plan.testable} reason=${plan.reason}`);
  if (!plan.testable) {
    postComment('SKIPPED', `**Not an injectable feature** -- skipped.\n\n> ${plan.reason}\n\nThis PR's change isn't driven by config/collection data the harness can force, so a feature test wouldn't be meaningful. (The visual/smoke review still applies.)`);
    console.log('skipped: not testable'); process.exit(0);
  }

  // ---- Step 2: let the planner search the CURRENT PR checkout ----
  const research = await researchCode({
    ask: llm,
    repoRoot: ROOT,
    taskContext: `PR: ${meta.title}\nChanged files:\n${changedPaths.join('\n')}\n\nChanged tests:\n${specText}\n\nDiff:\n${diff.slice(0, 10000)}`,
  });
  console.log(`[research] searches=${research.searches.length} summary=${research.summary.slice(0, 800)}`);
  research.searches.forEach((entry, index) => {
    console.log(`[research ${index + 1}] ${entry.query} in ${entry.searchPath} -> ${entry.result.matches.length} match block(s)`);
  });

  // ---- Step 3: capture the page's REAL live config(s) (first pass, no override) ----
  const browser = await chromium.connectOverCDP(CDP);
  const ctx = browser.contexts()[0] || (await browser.newContext());
  const routeLibs = async (route) => {
    const file = route.request().url().split('?')[0].split('/').pop();
    if (ALLOW.has(file)) { try { return route.fulfill({ path: `${DIST}/${file}` }); } catch (e) {} }
    return route.continue();
  };
  const gateUrl = PAGE + (PAGE.includes('?') ? '&' : '?') + 'caasqa=1';
  const capPage = await ctx.newPage();
  await capPage.setViewportSize({ width: 1280, height: 1800 });
  await capPage.addInitScript(() => { try { window.localStorage.removeItem('caasQaConfig'); } catch (e) {} });
  await capPage.route('**/caas-libs/**', routeLibs);
  await capPage.goto(gateUrl, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
  await capPage.waitForSelector('.consonant-CardsGrid', { timeout: 15000 }).catch(() => {});
  await capPage.waitForTimeout(2500);
  const liveConfigs = await capPage.evaluate(() => window.__caasQaConfigs || []);
  await capPage.close();
  const canReplace = Array.isArray(liveConfigs) && liveConfigs.length > 0;
  console.log(`[capture] ${canReplace ? liveConfigs.length : 0} live collection config(s) captured`);

  // ---- Step 4: plan the injection using live config + searched source ----
  const planHead = canReplace
    ? `The page hosts ${liveConfigs.length} card collection(s). Here are their original configs:\n\n${JSON.stringify(liveConfigs).slice(0, 16000)}\n\nStart from the sortable/main card-grid config. Return a COMPLETE config with the feature enabled, featuredCards removed, and card limits high enough for every fixture card.`
    : 'Live config capture failed. Build a minimal complete CaaS config that activates the feature and renders every fixture card.';

  const planRaw = await llm(
`You are verifying an Adobe CaaS feature by reproducing ONE changed unit test on a real browser render. The unit test is the specification. Do not invent new feature behavior, extra correctness controls, or expected results.

${planHead}

You were allowed to search the CURRENT PR checkout. This research is authoritative for translating component-level test props into complete card JSON. Use the raw source blocks, not intuition:
${research.report}

Changed unit tests:
${specText}

PR title: ${meta.title}
PR body:
${(meta.body || '').slice(0, 1000)}

Diff (truncated):
${diff.slice(0, 8000)}

Card fixture shape:
${CARD_SHAPE}

Pick ONE changed unit test whose effect is observable in the DOM.
- Ignore applyQaConfigOverride, caasQaConfig, __caasQaConfigs, and _caasQaReplace; those are this harness's transport, not the product behavior under test.
- If the PR title/body calls out a self-test target, select that named product behavior from the changed spec.
- If it directly tests a subcomponent, use the searched caller chain to embed its exact props at the correct card JSON path. Do not guess a path.
- Set an explicitly registered card style that actually renders that component, and neutralize searched config conditions that suppress it.
- Preserve the test's exact feature inputs and assertions. Add only nonessential baseline fields needed to make the card render.
- Use dates relative to today (${new Date().toISOString().slice(0, 10)}) when the test uses relative dates.
- If source search did not establish an injection path, return skipReason instead of producing a guessed fixture.

Respond with ONLY one JSON object:
{"sourceTest":"...","config":{},"cards":[],"expected":"exact selected-test assertion restated for DOM","observe":"where to check","mappingEvidence":[{"file":"...","line":123,"fact":"..."}],"skipReason":""}
or {"sourceTest":"...","skipReason":"source search could not prove how the test input reaches config/card JSON"}.`, 16000);
  const plan2 = extractJson(planRaw);
  if (plan2.skipReason) {
    postComment('SKIPPED', `**Scenario mapping was not proven** -- skipped instead of guessing.\n\n> ${String(plan2.skipReason).slice(0, 800)}\n\nCode searches performed: ${research.searches.length}.`);
    console.log(`[plan] skipped: ${plan2.skipReason}`); process.exit(0);
  }
  plan.config = plan2.config || {};
  plan.cards = plan2.cards || [];
  plan.expected = plan2.expected || '';
  plan.observe = plan2.observe || '';
  plan.sourceTest = plan2.sourceTest || '';
  plan.mappingEvidence = plan2.mappingEvidence || [];
  console.log('[plan] sourceTest=' + plan.sourceTest + ' | observe=' + plan.observe);
  console.log('[mapping] ' + JSON.stringify(plan.mappingEvidence));
  console.log('[cards] ' + JSON.stringify(plan.cards.map((card) => ({
    id: card.id, style: card.styles?.typeOverride, country: card.country,
    modifiedDate: card.modifiedDate, footer: card.footer,
  }))));

  // ---- Step 5: inject config + mocked collection, render the PR build ----
  const injected = canReplace ? { ...plan.config, _caasQaReplace: true } : plan.config;
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1280, height: 1800 });
  await page.addInitScript((config) => { try { window.localStorage.setItem('caasQaConfig', config); } catch (e) {} },
    JSON.stringify(injected));
  await page.route('**/caas-libs/**', routeLibs);
  await page.route('**/chimera-api/collection**', async (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify({ cards: plan.cards, filters: [], isHashed: false }) }));
  await page.goto(gateUrl, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
  await page.waitForSelector('.consonant-CardsGrid .consonant-Card', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const observed = await page.evaluate(() => {
    const grid = document.querySelector('.consonant-CardsGrid');
    const cards = grid ? [...grid.querySelectorAll('.consonant-Card')] : [...document.querySelectorAll('.consonant-Card')];
    return cards.slice(0, 12).map((card, index) => {
      const title = card.querySelector('[class*="-title"]');
      const links = [...card.querySelectorAll('a,button')].slice(0, 6).map((element) => ({
        tag: element.tagName.toLowerCase(),
        testId: element.getAttribute('data-testid') || undefined,
        text: (element.textContent || '').trim().slice(0, 50),
        href: element.getAttribute('href') || undefined,
        cls: (element.className || '').toString().slice(0, 100) || undefined,
      }));
      return {
        n: index + 1,
        id: card.id || undefined,
        title: title ? title.textContent.trim().slice(0, 80) : '',
        text: (card.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 220),
        links,
      };
    });
  });
  console.log('[observed] ' + JSON.stringify(observed));
  await page.screenshot({ path: '/tmp/feature-render.png', fullPage: true }).catch(() => {});
  await page.close();

  // ---- Step 6: validate rendered vs the selected test assertion ----
  const check = await llm(
`A CaaS feature was tested by reproducing one changed unit test on a live render.

Source unit test: ${plan.sourceTest}
Where to look: ${plan.observe}
Expected, copied from that test: ${plan.expected}
Source mapping evidence: ${JSON.stringify(plan.mappingEvidence)}

Rendered first-collection cards (id, title, text, links/buttons):
${JSON.stringify(observed).slice(0, 6000) || '(no cards rendered)'}

Does the rendered DOM satisfy ONLY the selected test assertion? Do not introduce new expectations. Respond with ONLY JSON: {"verdict":"PASS"|"FAIL","reason":"one or two sentences citing observed vs expected"}`, 1500);
  const res = extractJson(check);
  console.log(`[validate] ${res.verdict}: ${res.reason}`);

  postComment(res.verdict,
`Injected the PR build with a searched, source-grounded config + collection fixture.

**Source test:** \`${plan.sourceTest || '(n/a)'}\`
**Code searches:** ${research.searches.length}
**Mapping evidence:** ${plan.mappingEvidence.map((item) => `\`${item.file}${item.line ? `:${item.line}` : ''}\``).join(', ') || '_(none returned)_'}
**Fixture cards:** ${plan.cards.length}
**Expected:** ${plan.expected}
**Rendered (first collection):**
${observed.map((item) => `- ${item.n}. ${item.title || item.text.slice(0, 50)}${item.links.length ? ` [${item.links.map((link) => `${link.testId || link.tag}${link.href ? ` ${link.href}` : ''}`).join(', ')}]` : ''}`).join('\n') || '_(no cards rendered)_'}

**Verdict:** ${res.reason}`);
  process.exit(0);
})().catch((e) => { console.error('feature-review error:', e.stack || e.message); process.exit(0); });
