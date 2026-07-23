#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { researchCode } from './code-search.mjs';
import { applySpecCardStyle, buildScenarioConfig } from './scenario-config.mjs';
import { validateScenario as checkPayloadSchema } from './schema-validate.mjs';
import { buildValidationView } from './observation-view.mjs';
import { requestBoundedJson } from './llm-json.mjs';
import { shouldChallengeSkip } from './skip-challenge.mjs';
import { classifyChangedPaths } from './detect-gate.mjs';
import {
  applyScenarioRepair,
  findMissingRequiredInitial,
  prioritizeRenderabilityProbes,
  requireRenderability,
} from './renderability.mjs';

const env = (name, fallback = '') => process.env[name] ?? fallback;
const PR = env('PR_NUMBER');
const REPO = env('GH_REPO', 'adobecom/caas');
const ROOT_INPUT = env('TARGET_REPO_ROOT');
const DIST_INPUT = env('DIST_DIR');
const CDP = env('CDP_URL', 'http://127.0.0.1:9222');
const PROXY = env('PROXY_URL');
const MODEL = env('MODEL');
const TOKEN = env('IMS_ACCESS_TOKEN');
const PAGE = env('PAGE_URL', 'https://business.adobe.com/customer-success-stories.html');
const VARIANT = env('BACKTEST_VARIANT', 'post');
const PLAN_INPUT = env('BACKTEST_PLAN_PATH');
const RESULT_INPUT = env('BACKTEST_RESULT_PATH');

for (const [name, value] of Object.entries({ PR_NUMBER: PR, TARGET_REPO_ROOT: ROOT_INPUT,
  DIST_DIR: DIST_INPUT, PROXY_URL: PROXY, MODEL, IMS_ACCESS_TOKEN: TOKEN,
  BACKTEST_PLAN_PATH: PLAN_INPUT, BACKTEST_RESULT_PATH: RESULT_INPUT })) {
  if (!value) throw new Error(`${name} is required`);
}

const ROOT = path.resolve(ROOT_INPUT);
const DIST = path.resolve(DIST_INPUT);
const PLAN_PATH = path.resolve(PLAN_INPUT);
const RESULT_PATH = path.resolve(RESULT_INPUT);
const SCREENSHOT_PATH = path.resolve(env('BACKTEST_SCREENSHOT_PATH', path.join(path.dirname(RESULT_PATH), `${VARIANT}.png`)));
const ALLOW = new Set(['app.css', 'main.min.js', 'react.umd.js', 'react.dom.umd.js']);
const gh = (args) => execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });

const CARD_SHAPE = `A minimal collection card is:
{ "id":"unique", "styles":{"typeOverride":"<copy exact cardStyle from selected test>","backgroundImage":"https://business.adobe.com/content/dam/dx/us/en/images/cards/default/media_1.jpg","icon":""},
  "contentArea":{"title":"visible title","detailText":"eyebrow","url":"https://business.adobe.com/"},
  "overlays":{"banner":{},"logo":{"src":""},"label":{},"videoButton":{"url":""}},
  "footer":[{"left":[],"center":[],"right":[]}], "tags":[{"id":"caas:country/us"}],
  "cardDate":"ISO","modifiedDate":"ISO","createdDate":"ISO","country":"US","origin":"hawks" }`;

const SCHEMA_HINT = `VALID VALUES (your config patch and cards are schema-checked; use only these):
- collection.cardStyle / card.styles.typeOverride (agent-set style): one-half three-fourths double-wide half-height product text-card full-card icon-card news-card blade-card editorial-card blog-card horizontal-card button-card flex-card
- collection.layout.type: 2up 3up 4up 5up | layout.gutter: 1x 2x 3x 4x | layout.container: 83Percent 1200MaxWidth 1600MaxWidth 32Margin carousel categories
- sort.defaultSort / sort.options[].sort: dateasc datedesc modifieddesc modifiedasc eventsort featured titleasc titledesc localfirst locallast random
- filterPanel.type: left top events | filterPanel.filterLogic: and or xor | pagination.type: loadMore paginator
- footer infobit.type: price button icon-with-text link-with-icon text icon link progress-bar rating bookmark date-interval gated
- valid top-level config sections ONLY: collection featuredCards hideCtaIds hideCtaTags header filterPanel sort pagination bookmarks search language country headers products analytics target customCard linkTransformer reservoir
Do NOT invent config keys or use values outside these enums.`;

function extractJson(source) {
  const text = String(source).replace(/```(?:json)?/gi, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('no JSON object in LLM output');
  const candidate = text.slice(start, end + 1);
  try { return JSON.parse(candidate); }
  catch (jsonErr) {
    // LLM sometimes emits raw control chars (newlines/tabs) inside string values -> "Unterminated string".
    // Collapse C0 control chars and retry before giving up.
    try { return JSON.parse(candidate.replace(/[\u0000-\u001f]+/g, ' ')); }
    catch { throw jsonErr; }
  }
}

async function llmResponse(prompt, maxTokens = 4000) {
  const body = JSON.stringify({ model: MODEL, max_tokens: maxTokens, stream: true,
    messages: [{ role: 'user', content: prompt }] });
  for (let attempt = 0; attempt < 3; attempt += 1) {
    let raw = '';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000);
    try {
      const response = await fetch(PROXY, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body,
        signal: controller.signal,
      });
      raw = await response.text();
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${raw.slice(0, 500)}`);
    } catch (error) {
      console.error(`[llm] transport attempt ${attempt + 1} failed: ${error.message}`);
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 10000 * (attempt + 1)));
      continue;
    } finally {
      clearTimeout(timeout);
    }
    let text = '';
    let stopped = false;
    let stopReason = '';
    let apiError = null;
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      let event;
      try { event = JSON.parse(data); } catch { continue; }
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') text += event.delta.text || '';
      else if (event.type === 'message_delta') stopReason = event.delta?.stop_reason || stopReason;
      else if (event.type === 'message_stop') {
        stopped = true;
        stopReason = event.message?.stop_reason || stopReason;
      }
      else if (event.type === 'error') apiError = event.error;
    }
    if (!apiError && stopped && text.trim()) {
      return { text: text.trim(), stopReason: stopReason || 'end_turn' };
    }
    console.error(`[llm] response attempt ${attempt + 1} failed (${apiError ? JSON.stringify(apiError) : 'incomplete'})`);
    if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 10000 * (attempt + 1)));
  }
  throw new Error('LLM proxy failed after three attempts');
}

async function llm(prompt, maxTokens = 4000) {
  return (await llmResponse(prompt, maxTokens)).text;
}

function saveResult(result) {
  mkdirSync(path.dirname(RESULT_PATH), { recursive: true });
  writeFileSync(RESULT_PATH, `${JSON.stringify({ pr: Number(PR), variant: VARIANT, ...result }, null, 2)}\n`);
  console.log(`[result] ${result.status}${result.reason ? `: ${result.reason}` : ''}`);
}

function productEvidence() {
  const meta = JSON.parse(gh(['pr', 'view', PR, '-R', REPO, '--json', 'title,body,files']));
  const rawDiff = gh(['pr', 'diff', PR, '-R', REPO]);
  const sections = rawDiff.split(/(?=^diff --git )/m).filter(Boolean);
  const sectionPath = (section) => section.match(/^diff --git a\/(.+?) b\/(.+)$/m)?.[2] || '';
  const isInfra = (filePath) => filePath.startsWith('.github/') || filePath === 'package-lock.json';
  const diff = sections.filter((section) => !isInfra(sectionPath(section))).join('').slice(0, 30000);
  const changedPaths = (meta.files || []).map(({ path: filePath }) => filePath).filter((filePath) => !isInfra(filePath));
  const specPaths = changedPaths.filter((filePath) => /\.(spec|test)\.(jsx?|tsx?)$/.test(filePath));
  const specPathSet = new Set(specPaths);
  const specText = specPaths.map((filePath) => {
    try { return `\n// FILE ${filePath}\n${readFileSync(path.resolve(ROOT, filePath), 'utf8')}`; } catch { return ''; }
  }).join('\n').slice(0, 18000);
  const specDiff = sections.filter((section) => specPathSet.has(sectionPath(section))).join('').slice(0, 14000);
  return { meta, diff, changedPaths, specText, specDiff };
}

function cleanProbes(probes) {
  if (!Array.isArray(probes)) return [];
  return probes.slice(0, 6).flatMap((probe) => {
    const selector = String(probe?.selector || '').trim();
    if (!selector || selector.length > 200) return [];
    const attributes = Array.isArray(probe.attributes)
      ? probe.attributes.map(String).filter((name) => /^[a-zA-Z_:][-a-zA-Z0-9_:.]*$/.test(name)).slice(0, 12) : [];
    return [{ selector, attributes, why: String(probe.why || '').slice(0, 300) }];
  });
}

function finalizePlan(rawPlan, { evidence, liveConfig }) {
  const plan = rawPlan;
  if (plan.skipReason) return plan;
  if (!plan.sourceTest || !plan.expected || !plan.config || typeof plan.config !== 'object' ||
    !Array.isArray(plan.cards) || !Array.isArray(plan.filters)) {
    throw new Error('agent returned an incomplete scenario plan');
  }
  const styleNormalization = applySpecCardStyle(plan.cards, evidence.specText);
  plan.cards = styleNormalization.cards;
  plan.normalizations = styleNormalization.style
    ? [`Copied unambiguous changed-spec cardStyle '${styleNormalization.style}' into fixture cards.`] : [];
  plan.configPatch = plan.config;
  plan.config = buildScenarioConfig(liveConfig, plan.configPatch, plan.cards);
  const schemaCheck = checkPayloadSchema({ configPatch: plan.configPatch, cards: plan.cards });
  plan.schemaValid = schemaCheck.valid;
  if (!schemaCheck.valid) { plan.schemaErrors = schemaCheck.errors; console.warn(`[schema] emitted patch/cards invalid: ${schemaCheck.errors}`); }
  else { console.log('[schema] emitted patch/cards valid'); }
  plan.probes = cleanProbes(plan.probes);
  plan.renderability = requireRenderability(plan.renderability);
  plan.probes = cleanProbes(prioritizeRenderabilityProbes(plan.probes, plan.renderability));
  return plan;
}

function persistBundle(bundle) {
  mkdirSync(path.dirname(PLAN_PATH), { recursive: true });
  writeFileSync(PLAN_PATH, `${JSON.stringify(bundle, null, 2)}\n`);
}

function requiredProbeSummary(observed, renderability) {
  const required = renderability?.requiredInitial || [];
  const probes = new Map((Array.isArray(observed?.probes) ? observed.probes : [])
    .map((probe) => [probe?.selector, (Array.isArray(probe?.matches) ? probe.matches : [])
      .filter((match) => !match?.selectorError).length]));
  return required.map(({ selector }) => ({ selector, matches: probes.get(selector) || 0 }));
}

async function validateScenario(bundle, observed) {
  const validationView = buildValidationView(observed, 18000);
  console.log(`[validate] payload chars=${validationView.length}`);
  const validationRaw = await llm(
`Judge only this ${VARIANT === 'pre' ? 'frozen PRE-PR' : 'candidate POST-PR'} scenario's exact assertion against the historical build render.

Source test/requirement: ${bundle.plan.sourceTest}
Expected: ${bundle.plan.expected}
Where to observe: ${bundle.plan.observe}
Mapping evidence: ${JSON.stringify(bundle.plan.mappingEvidence || [])}
DOM observations and requested probes (probes+diagnostics bounded first, then generic context):\n${validationView}

Reply ONLY JSON: {"verdict":"PASS"|"FAIL","reason":"cite concrete observed evidence"}.`, 2000);
  const validation = extractJson(validationRaw);
  const verdict = validation.verdict === 'PASS' ? 'PASS' : 'FAIL';
  console.log(`[validate] ${verdict}: ${validation.reason}`);
  return { verdict, reason: validation.reason, validationPayloadChars: validationView.length };
}

async function browserSession() {
  const browser = await chromium.connectOverCDP(CDP);
  const context = browser.contexts()[0] || await browser.newContext();
  const routeLibraries = async (route) => {
    const file = route.request().url().split('?')[0].split('/').pop();
    if (ALLOW.has(file)) {
      try { return await route.fulfill({ path: path.join(DIST, file) }); } catch { /* use network fallback */ }
    }
    return route.continue();
  };
  return { context, routeLibraries };
}

async function captureLiveConfigs(context, routeLibraries) {
  const gateUrl = PAGE + (PAGE.includes('?') ? '&' : '?') + 'caasqa=1';
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 1800 });
  await page.addInitScript(() => { try { window.localStorage.removeItem('caasQaConfig'); } catch { /* noop */ } });
  await page.route('**/caas-libs/**', routeLibraries);
  await page.goto(gateUrl, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
  await page.waitForSelector('.consonant-CardsGrid', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const configs = await page.evaluate(() => window.__caasQaConfigs || []);
  await page.close();
  return configs;
}

async function renderScenario(context, routeLibraries, plan) {
  const gateUrl = PAGE + (PAGE.includes('?') ? '&' : '?') + 'caasqa=1';
  const page = await context.newPage();
  const diagnostics = { collectionRequests: [], pageErrors: [], consoleErrors: [], requestFailures: [] };
  page.on('pageerror', (error) => diagnostics.pageErrors.push(String(error.message || error).slice(0, 1000)));
  page.on('console', (message) => {
    if (message.type() === 'error') diagnostics.consoleErrors.push(message.text().slice(0, 1000));
  });
  page.on('requestfailed', (request) => {
    if (request.url().includes('chimera-api') || request.url().includes('caas-libs')) {
      diagnostics.requestFailures.push({ url: request.url().slice(0, 500),
        error: String(request.failure()?.errorText || '').slice(0, 500) });
    }
  });
  await page.setViewportSize({ width: 1280, height: 1800 });
  const injected = { ...(plan.config || {}), _caasQaReplace: true };
  await page.addInitScript((config) => {
    try { window.localStorage.setItem('caasQaConfig', config); } catch { /* noop */ }
  }, JSON.stringify(injected));
  await page.route('**/caas-libs/**', routeLibraries);
  await page.route('**/chimera-api/collection**', async (route) => {
    diagnostics.collectionRequests.push(route.request().url().slice(0, 1000));
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ cards: plan.cards || [], filters: plan.filters || [], isHashed: Boolean(plan.isHashed) }),
    });
  });
  await page.goto(gateUrl, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
  await page.waitForSelector('.consonant-CardsGrid, .consonant-Card', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const observed = await page.evaluate((probeSpecs) => {
    const defaultAttributes = ['role', 'aria-label', 'aria-current', 'aria-live', 'data-testid',
      'data-country', 'data-card-url', 'href', 'src', 'alt', 'type', 'value'];
    const snapshot = (element, requested = []) => {
      const attributes = {};
      [...new Set([...defaultAttributes, ...requested])].forEach((name) => {
        const value = element.getAttribute?.(name);
        if (value !== null && value !== undefined) attributes[name] = value;
      });
      return {
        tag: element.tagName?.toLowerCase(),
        id: element.id || undefined,
        cls: String(element.className || '').slice(0, 180) || undefined,
        text: String(element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 300),
        attributes,
        html: String(element.outerHTML || '').replace(/\s+/g, ' ').slice(0, 700),
      };
    };
    const take = (selector, limit, attributes = []) => {
      try { return [...document.querySelectorAll(selector)].slice(0, limit).map((element) => snapshot(element, attributes)); }
      catch (error) { return [{ selectorError: error.message }]; }
    };
    const sigRoot = document.querySelector('.consonant-CardsGrid, [class*="consonant-Container"], #caas, .caas-preview') || document.body;
    const domSignature = (() => {
      const classes = {}; const attrs = {}; const tags = {}; const testidSet = new Set(); const texts = [];
      for (const el of sigRoot.querySelectorAll('*')) {
        const tag = (el.tagName || '').toLowerCase(); if (!tag) continue;
        tags[tag] = (tags[tag] || 0) + 1;
        String(el.className || '').split(/\s+/).filter(Boolean).forEach((c) => { classes[c] = (classes[c] || 0) + 1; });
        if (el.getAttributeNames) for (const n of el.getAttributeNames()) {
          if (n === 'class' || n === 'style' || n === 'id') continue;
          if (n === 'data-testid') { const t = el.getAttribute(n); if (t) testidSet.add(t); }
          if (n.startsWith('data-') || n.startsWith('aria-') || ['role', 'href', 'type', 'alt'].includes(n)) {
            const v = String(el.getAttribute(n) || '').slice(0, 40); attrs[`${n}=${v}`] = (attrs[`${n}=${v}`] || 0) + 1;
          }
        }
      }
      sigRoot.querySelectorAll('.consonant-Card [class*="-title"], [class*="Card-label"], [class*="Card-content"]').forEach((e) => {
        const t = String(e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60); if (t) texts.push(t);
      });
      return { classes, attrs, tags, testids: [...testidSet].sort(), texts };
    })();
    return {
      domSignature,
      cards: take('.consonant-Card', 15),
      headings: take('h1,h2,h3,h4,h5,h6,[role="heading"]', 30),
      controls: take('label,button,input,select,[role="button"],[role="searchbox"]', 40),
      filters: take('[class*="Filter"],[class*="filter"]', 40),
      liveRegions: take('[aria-live],[role="status"],[role="alert"]', 20),
      collectionRoots: take('.consonant-CardsGrid,.caas-preview,.caas-config,[class*="consonant-Container"]', 20),
      probes: probeSpecs.map((probe) => ({ ...probe, matches: take(probe.selector, 20, probe.attributes) })),
    };
  }, cleanProbes(plan.probes));
  observed.diagnostics = diagnostics;
  mkdirSync(path.dirname(SCREENSHOT_PATH), { recursive: true });
  await page.screenshot({ path: SCREENSHOT_PATH, fullPage: true }).catch(() => {});
  await page.close();
  return observed;
}

(async () => {
  let bundle;
  let postEvidence;
  let postLiveConfig;
  if (VARIANT === 'pre') {
    bundle = JSON.parse(readFileSync(PLAN_PATH, 'utf8'));
    console.log(`[plan] reusing post-PR scenario: ${bundle.plan.sourceTest}`);
  } else {
    const evidence = productEvidence();
    postEvidence = evidence;
    let rootRenderChallengeAttempted = false;
    // Detect gate: the diff-based pipeline renders the forced scenario on pre- and
    // post-PR code and lets the judge compare the detected old-vs-new diff against PR
    // intent, so we no longer decide up front whether a behavior is "assertable" (a
    // call the old LLM detect prompt got wrong for visual-only and no-op changes).
    // Skip ONLY CI/tooling/docs changes; every product-code change (including
    // visual/CSS-only tweaks and apparent no-ops) proceeds to render + diff + judge.
    const gate = classifyChangedPaths(evidence.changedPaths);
    console.log(`[detect] product=${gate.productPaths.length} nonProduct=${gate.nonProductPaths.length}`);
    if (gate.skip) {
      const reason = evidence.changedPaths.length
        ? `only CI/tooling/docs changed (${gate.nonProductPaths.join(', ')}); no product-code render to diff`
        : 'no product-code files changed';
      saveResult({ status: 'SKIPPED', stage: 'detect', reason });
      return;
    }
    console.log(`[detect] product-code change -> render+diff+judge: ${gate.productPaths.join(', ')}`);

    const research = await researchCode({
      ask: llm,
      repoRoot: ROOT,
      taskContext: `PR: ${evidence.meta.title}\nBody: ${(evidence.meta.body || '').slice(0, 1500)}\nChanged files:\n${evidence.changedPaths.join('\n')}\nChanged test diff:\n${evidence.specDiff}\nFull changed spec context:\n${evidence.specText}\nDiff:\n${evidence.diff.slice(0, 12000)}`,
    });
    console.log(`[research] searches=${research.searches.length} summary=${research.summary.slice(0, 800)}`);
    research.searches.forEach((entry, index) => console.log(
      `[research ${index + 1}] ${entry.query} in ${entry.searchPath} -> ${entry.result.matches.length} block(s)`));

    const { context, routeLibraries } = await browserSession();
    const liveConfigs = await captureLiveConfigs(context, routeLibraries);
    if (!Array.isArray(liveConfigs) || liveConfigs.length === 0) {
      throw new Error('QA overlay did not capture a live collection config from the historical build');
    }
    postLiveConfig = liveConfigs[0];
    console.log(`[capture] ${liveConfigs.length} live config(s)`);
    const planRaw = `Reproduce exactly ONE human-authored test/requirement from this historical Adobe CaaS PR on a real page. Do not invent expected behavior.

PR: ${evidence.meta.title}
Body: ${(evidence.meta.body || '').slice(0, 1800)}
Changed test diff (authoritative for which tests changed):\n${evidence.specDiff}
Full changed spec context (do not select an old unchanged test):\n${evidence.specText}
Diff:\n${evidence.diff.slice(0, 12000)}

Current-checkout source research:\n${research.report}

Live collection configs:\n${JSON.stringify(liveConfigs).slice(0, 18000)}

${CARD_SHAPE}\n\n${SCHEMA_HINT}

Harness contract: return only the config keys needed for the selected feature/test. Code deep-merges that feature patch into the captured live config before React receives it, preserving required transport fields such as collection.endpoint and i18n defaults. You MAY and SHOULD add config keys introduced by this PR even when they do not exist on the current live page. A field read through ConfigContext/useConfig/getConfig and supplied by the changed unit test is a proven injectable config path. Absence from today's live config is expected for a historical new feature and is NEVER, by itself, a reason to skip. Do not require an authoring-UI, metadata, or currently deployed production path; this back-test deliberately swaps the parsed config and collection response to exercise the PR build.

BOOTSTRAP DATA-FLOW CHECK: a changed DOM model/custom-element constructor or getAttribute implementation is not automatically internal-only. If a changed property is passed through model.props, createRDC, a decorator, or another wrapper into a mounted React component, test whether preserving the captured live config plus sentinel cards makes the collection mount. For that root-render case, require a real collection/root selector and unique sentinel-card selectors under that same root; generic .consonant-Card evidence or a screenshot alone is not proof.

Return a minimal feature config patch, crafted cards and filters, the exact expected assertion, and up to six read-only CSS probes that expose the relevant DOM. A probe is {"selector":"CSS selector","attributes":["attribute"],"why":"..."}. The selected assertion must come from the changed test diff or a new observable product requirement explicitly introduced by the PR diff/body; never borrow an old unchanged regression test from the full spec. Follow the production caller chain from test props to config/card/filter JSON and cite it. Return skipReason only if the relevant input cannot be expressed in the replaced config/card/filter JSON, or the change fundamentally requires unsupported interaction (click/hover/type/scroll/resize). For a visual/CSS-only change, do NOT skip: still emit a scenario that renders the affected element (e.g. a card with long text for a line-clamp change); the old-vs-new diff judges the change.

BOUNDARY CASES: when the changed source adjusts a comparison or visibility condition, trace its initial values and mount effects. Prefer a minimal fixture whose injected card/filter/config values land exactly at the changed boundary on the initial render (for example, cards.length = cardsPerPage + 1) over assuming a click is necessary from the ticket wording.

RENDER-OR-SKIP: your config MUST actually render the exact component your assertion observes. If the assertion targets a carousel control, set the collection layout/style to the carousel variant so CardsCarousel renders; if it targets nested filter items, the filter panel and its nested filter data must render those items directly. If the target element would only appear after an interaction the harness cannot perform (expanding/collapsing a filter category, advancing/scrolling a carousel, hovering, clicking, typing, resizing the viewport), that is an UNSUPPORTED interaction: return a precise skipReason naming the required interaction instead of a scenario whose target never appears. Never select an assertion you cannot make observable in the initial render.

INITIAL-RENDER CONTRACT: return renderability.requiredInitial with up to three positive DOM prerequisites that must exist in the initial POST render before the assertion can be judged. Include the exact input/button/card/label whose property you assert, not just a wrapper. For a genuine absence assertion, require a stable rendered parent/card/root instead of the element expected to be absent. Each selector must also be a probe; code prioritizes these probes and will make one bounded scenario-only repair attempt if a prerequisite is missing. Before choosing a click-gated caller, search for another supported config/layout caller that renders the same target initially. An enabled config flag is not proof that a local user-state gate has been satisfied.

CRITICAL: copy the selected test's exact cardStyle literal into every crafted card's styles.typeOverride. For example, if the spec says const cardStyle = 'flex-card', typeOverride MUST be 'flex-card'. The angle-bracket value in the shape above is a placeholder, never a default.

RESPONSE SIZE: keep the complete JSON below 24,000 characters. Use no more than eight cards, four filter groups with sixteen total leaf items, four probes, and three mappingEvidence entries. Omit non-rendering card fields and keep explanations concise; the fixture need only prove the exact changed behavior.

Reply ONLY JSON:
{"sourceTest":"...","config":{},"cards":[],"filters":[],"isHashed":false,"expected":"exact assertion","observe":"...","probes":[],"renderability":{"requiredInitial":[{"selector":"...","minMatches":1,"why":"..."}]},"mappingEvidence":[{"file":"...","line":1,"fact":"..."}],"skipReason":""}
or {"sourceTest":"...","skipReason":"precise unsupported capability or missing mapping"}.`;
    const planResponse = await requestBoundedJson({
      ask: llmResponse,
      prompt: planRaw,
      label: 'plan',
      maxTokens: 16000,
      retryMaxTokens: 8000,
      maxChars: 24000,
      retrySuffix: `Return the entire replacement JSON object again, with no prose or fences. The prior response was unusable. Keep it below 24,000 characters: use at most eight cards, four filter groups with sixteen total leaf items, four probes, and three concise mappingEvidence entries. Omit non-rendering card fields. If the exact changed behavior requires an unsupported interaction, return the precise skipReason instead of a partial plan.`,
      parseAndValidate: (rawPlan) => finalizePlan(rawPlan, { evidence, liveConfig: postLiveConfig }),
    });
    let plan = planResponse.value;
    console.log(`[plan json] ${planResponse.attempts.map(({ attempt, kind, stopReason, chars }) =>
      `attempt=${attempt} kind=${kind} stop=${stopReason} chars=${chars}`).join('; ')}`);
    let planSkipChallenge;
    if (plan.skipReason && shouldChallengeSkip({
      stage: 'plan', evidence, challengeAttempted: rootRenderChallengeAttempted,
    })) {
      const replanResponse = await requestBoundedJson({
        ask: llmResponse,
        prompt: `${planRaw}\n\nROOT-RENDER SKIP CHALLENGE: This PR changed a DOM/config-to-React bridge and its changed test proves a config/props handoff. A previous planner proposed a skip. Re-plan adversarially before accepting that conclusion. Trace the production caller chain into the mounted component. If a captured live config plus controlled sentinel cards can prove collection mount, return a complete normal scenario plan. Require the sentinel cards to be observed under the actual CaaS/custom-element root, not as generic cards elsewhere. Return skipReason only after proving that this handoff cannot affect initial mount through injected config/cards.`,
        label: 'root-render replan',
        maxTokens: 16000,
        retryMaxTokens: 8000,
        maxChars: 24000,
        retrySuffix: `Return the entire replacement JSON object again, with no prose or fences. The prior response was unusable. Keep it below 24,000 characters and either provide the complete root-render scenario or a precise unsupported reason.`,
        parseAndValidate: (rawPlan) => finalizePlan(rawPlan, { evidence, liveConfig: postLiveConfig }),
      });
      plan = replanResponse.value;
      planSkipChallenge = {
        triggered: true,
        outcome: plan.skipReason ? 'SKIPPED' : 'REPLANNED',
        attempts: replanResponse.attempts,
      };
      console.log(`[plan root-render challenge] ${planSkipChallenge.outcome}; ${replanResponse.attempts.map(({ attempt, kind, stopReason, chars }) =>
        `attempt=${attempt} kind=${kind} stop=${stopReason} chars=${chars}`).join('; ')}`);
    }
    if (plan.skipReason) {
      saveResult({ status: 'SKIPPED', stage: 'plan', reason: plan.skipReason,
        researchCount: research.searches.length, sourceTest: plan.sourceTest || '', skipChallenge: planSkipChallenge });
      return;
    }
    bundle = { pr: Number(PR), meta: evidence.meta, plan, researchCount: research.searches.length,
      researchSummary: research.summary, researchSearches: research.searches };
    if (planSkipChallenge) bundle.skipChallenge = planSkipChallenge;
    console.log(`[plan] ${plan.sourceTest} cards=${plan.cards?.length || 0} probes=${plan.probes.length} initial=${plan.renderability.requiredInitial.length}`);
  }

  const { context, routeLibraries } = await browserSession();
  let observed = await renderScenario(context, routeLibraries, bundle.plan);
  console.log(`[observed] ${JSON.stringify(observed).slice(0, 8000)}`);
  let missingInitial = VARIANT === 'post'
    ? findMissingRequiredInitial(observed, bundle.plan.renderability) : [];
  let validation = missingInitial.length ? null : await validateScenario(bundle, observed);

  // A missing post prerequisite means the planner chose a scenario that did not
  // actually mount its target. Repair before semantic validation so a model can
  // never accidentally PASS an unrendered assertion. Never do this on PRE:
  // that historical build may correctly lack the new target.
  if (VARIANT === 'post' && missingInitial.length) {
      console.log(`[renderability] missing initial prerequisites: ${JSON.stringify(missingInitial)}`);
      const repairResearch = await researchCode({
        ask: llm,
        repoRoot: ROOT,
        maxSearches: 4,
        taskContext: `Repair a failed initial-render scenario for this historical Adobe CaaS feature test. The changed requirement is immutable; do not seek a different/easier assertion. Find whether another production caller, config/layout, or fixture-data shape can render the exact required selector without a browser interaction. If no static path exists, say so precisely.\n\nPR: ${postEvidence.meta.title}\nChanged test diff:\n${postEvidence.specDiff}\nProduct diff:\n${postEvidence.diff.slice(0, 10000)}\n\nImmutable source test: ${bundle.plan.sourceTest}\nImmutable expected assertion: ${bundle.plan.expected}\nInitial config patch: ${JSON.stringify(bundle.plan.configPatch)}\nRequired initial selectors: ${JSON.stringify(bundle.plan.renderability.requiredInitial)}\nMissing evidence: ${JSON.stringify(missingInitial)}\nInitial requested probe results: ${JSON.stringify(observed.probes).slice(0, 12000)}`,
      });
      console.log(`[renderability research] searches=${repairResearch.searches.length} summary=${repairResearch.summary.slice(0, 800)}`);
      const repairRaw = await llm(
`The initial POST render for a historical Adobe CaaS feature test failed because required DOM prerequisites were missing. Repair the SCENARIO only, not the test's meaning.

Immutable test intent (do not change any of these):
Source test: ${bundle.plan.sourceTest}
Expected assertion: ${bundle.plan.expected}
Where to observe: ${bundle.plan.observe}
Mapping evidence: ${JSON.stringify(bundle.plan.mappingEvidence || [])}
Probes: ${JSON.stringify(bundle.plan.probes)}
Initial-render contract: ${JSON.stringify(bundle.plan.renderability)}

Initial scenario config patch: ${JSON.stringify(bundle.plan.configPatch)}
Initial cards: ${JSON.stringify(bundle.plan.cards).slice(0, 12000)}
Initial filters: ${JSON.stringify(bundle.plan.filters).slice(0, 8000)}
Missing prerequisite evidence: ${JSON.stringify(missingInitial)}
Observed requested probes: ${JSON.stringify(observed.probes).slice(0, 12000)}

Fresh bounded source research:\n${repairResearch.report}

The harness supports only initial render from injected config, cards, and filters. It cannot click, type, expand, scroll, hover, resize, or alter URL state. Return a COMPLETE replacement feature config patch (not a delta from the initial patch), plus the complete replacement cards and filters. If the same exact component has another static config/layout caller, use it. If no static injected scenario can mount the exact target, return a precise skipReason naming the unsupported interaction/state. Do not weaken the assertion, substitute a wrapper, or change probes/renderability.

Reply ONLY JSON:
{"config":{},"cards":[],"filters":[],"isHashed":false}
or {"skipReason":"precise unsupported interaction or state"}.`, 12000);
      const repair = applyScenarioRepair(bundle.plan, extractJson(repairRaw));
      const repairMetadata = {
        initialValidationReason: 'not judged because required initial DOM was absent',
        initialValidationPayloadChars: null,
        initialRequiredMatches: requiredProbeSummary(observed, bundle.plan.renderability),
        initialScenario: {
          configPatch: bundle.plan.configPatch,
          cards: bundle.plan.cards,
          filters: bundle.plan.filters,
          isHashed: Boolean(bundle.plan.isHashed),
        },
        initialRequiredProbes: (Array.isArray(observed.probes) ? observed.probes : [])
          .filter((probe) => bundle.plan.renderability.requiredInitial
            .some((requirement) => requirement.selector === probe.selector)),
        missingInitial,
        researchCount: repairResearch.searches.length,
      };
      if (repair.skipReason) {
        bundle.renderabilityRepair = { ...repairMetadata, outcome: 'SKIPPED', reason: repair.skipReason };
        persistBundle(bundle);
        saveResult({ status: 'SKIPPED', stage: 'renderability', reason: repair.skipReason,
          sourceTest: bundle.plan.sourceTest, expected: bundle.plan.expected, probes: bundle.plan.probes,
          renderability: bundle.plan.renderability, renderabilityRepair: bundle.renderabilityRepair, observed,
          screenshot: SCREENSHOT_PATH });
        return;
      }
      bundle.plan = finalizePlan(repair, { evidence: postEvidence, liveConfig: postLiveConfig });
      bundle.renderabilityRepair = { ...repairMetadata, outcome: 'REPAIRED' };
      console.log(`[renderability] rerendering repaired scenario; initial=${bundle.plan.renderability.requiredInitial.length}`);
      observed = await renderScenario(context, routeLibraries, bundle.plan);
      console.log(`[observed repaired] ${JSON.stringify(observed).slice(0, 8000)}`);
      validation = await validateScenario(bundle, observed);
      const remaining = findMissingRequiredInitial(observed, bundle.plan.renderability);
      if (remaining.length) {
        bundle.renderabilityRepair = { ...bundle.renderabilityRepair, outcome: 'UNRESOLVED', remaining };
        persistBundle(bundle);
        saveResult({ status: 'FAIL', stage: 'renderability',
          reason: `repaired post scenario still lacks required initial DOM: ${JSON.stringify(remaining)}`,
          sourceTest: bundle.plan.sourceTest, expected: bundle.plan.expected, probes: bundle.plan.probes,
          renderability: bundle.plan.renderability, renderabilityRepair: bundle.renderabilityRepair, observed,
          screenshot: SCREENSHOT_PATH });
        return;
      }
  }

  if (VARIANT === 'post') persistBundle(bundle);
  saveResult({ status: validation.verdict, reason: validation.reason, sourceTest: bundle.plan.sourceTest,
    expected: bundle.plan.expected, researchCount: bundle.researchCount, mappingEvidence: bundle.plan.mappingEvidence,
    probes: bundle.plan.probes, renderability: bundle.plan.renderability,
    renderabilityRepair: bundle.renderabilityRepair, validationPayloadChars: validation.validationPayloadChars,
    observed, screenshot: SCREENSHOT_PATH });
})().then(() => {
  // connectOverCDP keeps a transport referenced even after every test page is
  // closed. This process owns no browser, so exit without closing the Mini's
  // persistent Chrome instance.
  process.exit(0);
}).catch((error) => {
  console.error('[backtest-worker] error:', error.stack || error.message);
  saveResult({ status: 'ERROR', reason: error.message });
  process.exit(1);
});
