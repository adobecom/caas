#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { researchCode } from './code-search.mjs';
import { applySpecCardStyle, buildScenarioConfig } from './scenario-config.mjs';
import { buildValidationView } from './observation-view.mjs';

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

function extractJson(source) {
  const text = String(source).replace(/```(?:json)?/gi, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('no JSON object in LLM output');
  return JSON.parse(text.slice(start, end + 1));
}

async function llm(prompt, maxTokens = 4000) {
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
    let apiError = null;
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      let event;
      try { event = JSON.parse(data); } catch { continue; }
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') text += event.delta.text || '';
      else if (event.type === 'message_stop') stopped = true;
      else if (event.type === 'error') apiError = event.error;
    }
    if (!apiError && stopped && text.trim()) return text.trim();
    console.error(`[llm] response attempt ${attempt + 1} failed (${apiError ? JSON.stringify(apiError) : 'incomplete'})`);
    if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 10000 * (attempt + 1)));
  }
  throw new Error('LLM proxy failed after three attempts');
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
    return {
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
  if (VARIANT === 'pre') {
    bundle = JSON.parse(readFileSync(PLAN_PATH, 'utf8'));
    console.log(`[plan] reusing post-PR scenario: ${bundle.plan.sourceTest}`);
  } else {
    const evidence = productEvidence();
    const detectRaw = await llm(
`Decide whether this historical Adobe CaaS PR contains a product behavior that can be reproduced on a live page by replacing collection config and collection JSON, then observing the DOM.

Testable examples: newly introduced card rendering, sorting, filtering, config-gated layout, or semantic DOM output. Not testable with this worker: pure refactor, build/tooling, backend-only, performance-only, or behavior requiring user interaction before observation.

The full changed spec files below are context only and contain many old tests. A test is evidence of new behavior only when its assertion/requirement is actually added or modified in CHANGED TEST DIFF, or the product diff/body explicitly introduces that observable behavior. Never classify a component split/file move as a feature merely because existing regression tests still pass or a spec's import paths changed.

PR: ${evidence.meta.title}
Body: ${(evidence.meta.body || '').slice(0, 1800)}
Changed files:\n${evidence.changedPaths.join('\n')}
Changed test diff:\n${evidence.specDiff}
Full changed spec context:\n${evidence.specText}
Diff:\n${evidence.diff}

Reply ONLY JSON: {"testable":true|false,"reason":"one sentence"}.`, 3000);
    const detect = extractJson(detectRaw);
    console.log(`[detect] testable=${detect.testable} reason=${detect.reason}`);
    if (!detect.testable) {
      saveResult({ status: 'SKIPPED', stage: 'detect', reason: detect.reason });
      return;
    }

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
    console.log(`[capture] ${liveConfigs.length} live config(s)`);
    const planRaw = await llm(
`Reproduce exactly ONE human-authored test/requirement from this historical Adobe CaaS PR on a real page. Do not invent expected behavior.

PR: ${evidence.meta.title}
Body: ${(evidence.meta.body || '').slice(0, 1800)}
Changed test diff (authoritative for which tests changed):\n${evidence.specDiff}
Full changed spec context (do not select an old unchanged test):\n${evidence.specText}
Diff:\n${evidence.diff.slice(0, 12000)}

Current-checkout source research:\n${research.report}

Live collection configs:\n${JSON.stringify(liveConfigs).slice(0, 18000)}

${CARD_SHAPE}

Harness contract: return only the config keys needed for the selected feature/test. Code deep-merges that feature patch into the captured live config before React receives it, preserving required transport fields such as collection.endpoint and i18n defaults. You MAY and SHOULD add config keys introduced by this PR even when they do not exist on the current live page. A field read through ConfigContext/useConfig/getConfig and supplied by the changed unit test is a proven injectable config path. Absence from today's live config is expected for a historical new feature and is NEVER, by itself, a reason to skip. Do not require an authoring-UI, metadata, or currently deployed production path; this back-test deliberately swaps the parsed config and collection response to exercise the PR build.

Return a minimal feature config patch, crafted cards and filters, the exact expected assertion, and up to six read-only CSS probes that expose the relevant DOM. A probe is {"selector":"CSS selector","attributes":["attribute"],"why":"..."}. The selected assertion must come from the changed test diff or a new observable product requirement explicitly introduced by the PR diff/body; never borrow an old unchanged regression test from the full spec. Follow the production caller chain from test props to config/card/filter JSON and cite it. Return skipReason only if the relevant input cannot be expressed in the replaced config/card/filter JSON, or the assertion fundamentally requires unsupported interaction or visual judgment.

CRITICAL: copy the selected test's exact cardStyle literal into every crafted card's styles.typeOverride. For example, if the spec says const cardStyle = 'flex-card', typeOverride MUST be 'flex-card'. The angle-bracket value in the shape above is a placeholder, never a default.

Reply ONLY JSON:
{"sourceTest":"...","config":{},"cards":[],"filters":[],"isHashed":false,"expected":"exact assertion","observe":"...","probes":[],"mappingEvidence":[{"file":"...","line":1,"fact":"..."}],"skipReason":""}
or {"sourceTest":"...","skipReason":"precise unsupported capability or missing mapping"}.`, 16000);
    const plan = extractJson(planRaw);
    if (plan.skipReason) {
      saveResult({ status: 'SKIPPED', stage: 'plan', reason: plan.skipReason,
        researchCount: research.searches.length, sourceTest: plan.sourceTest || '' });
      return;
    }
    if (!plan.sourceTest || !plan.expected || !plan.config || typeof plan.config !== 'object' ||
      !Array.isArray(plan.cards) || !Array.isArray(plan.filters)) {
      throw new Error('agent returned an incomplete scenario plan');
    }
    const styleNormalization = applySpecCardStyle(plan.cards, evidence.specText);
    plan.cards = styleNormalization.cards;
    plan.normalizations = styleNormalization.style
      ? [`Copied unambiguous changed-spec cardStyle '${styleNormalization.style}' into fixture cards.`] : [];
    plan.configPatch = plan.config;
    plan.config = buildScenarioConfig(liveConfigs[0], plan.configPatch, plan.cards);
    plan.probes = cleanProbes(plan.probes);
    bundle = { pr: Number(PR), meta: evidence.meta, plan, researchCount: research.searches.length,
      researchSummary: research.summary, researchSearches: research.searches };
    mkdirSync(path.dirname(PLAN_PATH), { recursive: true });
    writeFileSync(PLAN_PATH, `${JSON.stringify(bundle, null, 2)}\n`);
    console.log(`[plan] ${plan.sourceTest} cards=${plan.cards?.length || 0} probes=${plan.probes.length}`);
  }

  const { context, routeLibraries } = await browserSession();
  const observed = await renderScenario(context, routeLibraries, bundle.plan);
  console.log(`[observed] ${JSON.stringify(observed).slice(0, 8000)}`);
  const validationRaw = await llm(
`Judge only the frozen post-PR scenario's exact assertion against this ${VARIANT === 'pre' ? 'PRE-PR historical build' : 'POST-PR historical build'} render.

Source test/requirement: ${bundle.plan.sourceTest}
Expected: ${bundle.plan.expected}
Where to observe: ${bundle.plan.observe}
Mapping evidence: ${JSON.stringify(bundle.plan.mappingEvidence || [])}
DOM observations and requested probes:\n${buildValidationView(observed, 18000)}

Reply ONLY JSON: {"verdict":"PASS"|"FAIL","reason":"cite concrete observed evidence"}.`, 2000);
  const validation = extractJson(validationRaw);
  const verdict = validation.verdict === 'PASS' ? 'PASS' : 'FAIL';
  console.log(`[validate] ${verdict}: ${validation.reason}`);
  saveResult({ status: verdict, reason: validation.reason, sourceTest: bundle.plan.sourceTest,
    expected: bundle.plan.expected, researchCount: bundle.researchCount, mappingEvidence: bundle.plan.mappingEvidence,
    probes: bundle.plan.probes, observed, screenshot: SCREENSHOT_PATH });
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
