#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { researchCode } from './code-search.mjs';
import { applySpecCardStyle, buildScenarioConfig, normalizeEventFixtureCards } from './scenario-config.mjs';
import { buildValidationView } from './observation-view.mjs';
import { requestBoundedJson } from './llm-json.mjs';
import { configEchoContract, enforceConfigEchoContract, needsConfigEchoChallenge } from './plan-discrimination.mjs';
import { shouldChallengeSkip } from './skip-challenge.mjs';
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
  plan.cards = normalizeEventFixtureCards(styleNormalization.cards, plan.config);
  plan.normalizations = [
    ...(styleNormalization.style
      ? [`Copied unambiguous changed-spec cardStyle '${styleNormalization.style}' into fixture cards.`] : []),
    ...(plan.config?.filterPanel?.eventFilter
      ? ['Added safe empty event timing fields/secondary footer entry for historical event sorting.'] : []),
  ];
  plan.configPatch = plan.config;
  plan.config = buildScenarioConfig(liveConfig, plan.configPatch, plan.cards);
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
  const probeMatches = (probes) => new Map((Array.isArray(probes) ? probes : [])
    .map((probe) => [probe?.selector, (Array.isArray(probe?.matches) ? probe.matches : [])
      .filter((match) => !match?.selectorError).length]));
  const finalMatches = probeMatches(observed?.probes);
  const beforeFixtureMatches = probeMatches(observed?.beforeFixture?.probes);
  return required.map(({ selector }) => ({
    selector,
    matches: finalMatches.get(selector) || 0,
    beforeFixtureMatches: beforeFixtureMatches.get(selector) || 0,
  }));
}

async function validateScenario(bundle, observed) {
  const validationView = buildValidationView(observed, 18000);
  console.log(`[validate] payload chars=${validationView.length}`);
  const validationResponse = await requestBoundedJson({
    ask: llmResponse,
    label: 'validation',
    maxTokens: 2000,
    retryMaxTokens: 1200,
    maxChars: 6000,
    retrySuffix: 'Return the complete verdict JSON object only, with no prose or fences: {"verdict":"PASS"|"FAIL","reason":"concrete observed evidence"}.',
    parseAndValidate: (rawValidation) => {
      if (rawValidation?.verdict !== 'PASS' && rawValidation?.verdict !== 'FAIL') {
        throw new Error('validation must return PASS or FAIL');
      }
      return { verdict: rawValidation.verdict, reason: String(rawValidation.reason || '').slice(0, 1200) };
    },
    prompt:
`Judge only this ${VARIANT === 'pre' ? 'frozen PRE-PR' : 'candidate POST-PR'} scenario's exact assertion against the historical build render.

Source test/requirement: ${bundle.plan.sourceTest}
Expected: ${bundle.plan.expected}
Where to observe: ${bundle.plan.observe}
Mapping evidence: ${JSON.stringify(bundle.plan.mappingEvidence || [])}
DOM observations and requested probes (probes+diagnostics bounded first, then generic context):\n${validationView}

If present, beforeFixture.probes was captured after the real collection request was intercepted but before the controlled fixture response was released. It can prove that a real collection host existed before an intentional remove/hide-after-response behavior. Judge ordinary assertions from the final probes/DOM; never PASS an ordinary final-state assertion merely because it existed in beforeFixture. For a remove/hide assertion, require both a positive beforeFixture anchor and the expected final absence.

Reply ONLY JSON: {"verdict":"PASS"|"FAIL","reason":"cite concrete observed evidence"}.`,
  });
  const validation = validationResponse.value;
  const verdict = validation.verdict;
  console.log(`[validation json] ${validationResponse.attempts.map(({ attempt, kind, stopReason, chars }) =>
    `attempt=${attempt} kind=${kind} stop=${stopReason} chars=${chars}`).join('; ')}`);
  console.log(`[validate] ${verdict}: ${validation.reason}`);
  return { verdict, reason: validation.reason, validationPayloadChars: validationView.length };
}

async function rootRenderDetectChallenge(evidence) {
  const response = await requestBoundedJson({
    ask: llmResponse,
    label: 'root-render detect challenge',
    maxTokens: 2500,
    retryMaxTokens: 1500,
    maxChars: 4000,
    retrySuffix: 'Return the complete JSON object only, with no prose or fences: {"testable":true|false,"reason":"one concise source-flow reason"}.',
    parseAndValidate: (rawChallenge) => {
      if (typeof rawChallenge?.testable !== 'boolean') throw new Error('challenge must return boolean testable');
      return { testable: rawChallenge.testable, reason: String(rawChallenge.reason || '').slice(0, 800) };
    },
    prompt:
`A historical Adobe CaaS PR is about to be skipped as non-browser-testable. Audit one narrow possibility: a changed DOM/custom-element/config bridge may prevent parsed config from reaching the React root, which is testable by preserving a captured live config and injecting uniquely identifiable cards.

Do not call a change internal-only merely because the changed test asserts model.props or a constructor field. Trace whether that value is passed through a production wrapper/decorator into a mounted component. This challenge applies only to initial render; do not claim click, type, viewport, visual, or accessibility behavior is supported.

PR: ${evidence.meta.title}
Body: ${(evidence.meta.body || '').slice(0, 1800)}
Changed test diff:\n${evidence.specDiff}
Product diff:\n${evidence.diff.slice(0, 12000)}

Reply ONLY JSON: {"testable":true|false,"reason":"one concise source-flow reason"}.`,
  });
  console.log(`[root-render detect json] ${response.attempts.map(({ attempt, kind, stopReason, chars }) =>
    `attempt=${attempt} kind=${kind} stop=${stopReason} chars=${chars}`).join('; ')}`);
  return response.value;
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
  const capture = await page.evaluate(() => {
    const candidates = [
      '.caas-preview[data-caas-block]',
      '[data-caas-block]',
      '.caas-preview',
      '[data-testid="consonant-CardsGrid"]',
    ];
    const rootHints = candidates.map((selector) => {
      try { return { selector, matches: document.querySelectorAll(selector).length }; }
      catch { return { selector, matches: 0 }; }
    }).filter(({ matches }) => matches > 0).slice(0, 4);
    return { configs: window.__caasQaConfigs || [], rootHints };
  });
  await page.close();
  return capture;
}

async function observePage(page, probes, { generic = true } = {}) {
  return page.evaluate(({ probeSpecs, includeGeneric }) => {
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
    const targeted = { probes: probeSpecs.map((probe) => ({ ...probe, matches: take(probe.selector, 20, probe.attributes) })) };
    if (!includeGeneric) return targeted;
    return {
      cards: take('.consonant-Card', 15),
      headings: take('h1,h2,h3,h4,h5,h6,[role="heading"]', 30),
      controls: take('label,button,input,select,[role="button"],[role="searchbox"]', 40),
      filters: take('[class*="Filter"],[class*="filter"]', 40),
      liveRegions: take('[aria-live],[role="status"],[role="alert"]', 20),
      collectionRoots: take('.consonant-CardsGrid,.caas-preview,.caas-config,[class*="consonant-Container"]', 20),
      ...targeted,
    };
  }, { probeSpecs: cleanProbes(probes), includeGeneric: generic });
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
  let beforeFixture;
  let beforeFixtureCapture;
  const captureBeforeFixture = () => {
    if (!beforeFixtureCapture) {
      beforeFixtureCapture = observePage(page, plan.probes, { generic: false })
        .then((snapshot) => {
          beforeFixture = snapshot;
          return snapshot;
        })
        .catch((error) => {
          console.warn(`[before-fixture] probe capture failed: ${String(error.message || error).slice(0, 300)}`);
          return null;
        });
    }
    return beforeFixtureCapture;
  };
  await page.route('**/chimera-api/collection**', async (route) => {
    diagnostics.collectionRequests.push(route.request().url().slice(0, 1000));
    // Freeze this narrow probe snapshot while the first real collection
    // response is paused. It gives removal/hide tests a real pre-response
    // anchor without adding an interaction capability to the harness.
    await captureBeforeFixture();
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ cards: plan.cards || [], filters: plan.filters || [], isHashed: Boolean(plan.isHashed) }),
    });
  });
  await page.goto(gateUrl, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
  await page.waitForSelector('.consonant-CardsGrid, .consonant-Card', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const observed = await observePage(page, plan.probes);
  if (beforeFixture) observed.beforeFixture = beforeFixture;
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
    const detectResponse = await requestBoundedJson({
      ask: llmResponse,
      label: 'detect',
      maxTokens: 3000,
      retryMaxTokens: 1800,
      maxChars: 5000,
      retrySuffix: 'Return the complete JSON object only, with no prose or fences: {"testable":true|false,"reason":"one sentence"}.',
      parseAndValidate: (rawDetect) => {
        if (typeof rawDetect?.testable !== 'boolean') throw new Error('detect must return boolean testable');
        return { testable: rawDetect.testable, reason: String(rawDetect.reason || '').slice(0, 800) };
      },
      prompt:
`Decide whether this historical Adobe CaaS PR contains a product behavior that can be reproduced on a live page by replacing collection config and collection JSON, then observing the DOM.

Testable examples: newly introduced card rendering, sorting, filtering, config-gated layout, or semantic DOM output. Not testable with this worker: pure refactor, build/tooling, backend-only, performance-only, or behavior requiring user interaction before observation.

STATIC-BOUNDARY CHECK: before calling a behavior interaction-only, inspect every changed comparison, visibility predicate, and mount effect. Trace its initial state and ask whether fixture-controlled config, card count, or filter data can put it exactly on the old/new boundary at first render. A ticket may describe a click/navigation symptom while the changed predicate is already evaluated on mount; that is testable without interaction. Only call it interaction-only after ruling out this bounded initial-state case from the changed source.

The full changed spec files below are context only and contain many old tests. A test is evidence of new behavior only when its assertion/requirement is actually added or modified in CHANGED TEST DIFF, or the product diff/body explicitly introduces that observable behavior. Never classify a component split/file move as a feature merely because existing regression tests still pass or a spec's import paths changed.

PR: ${evidence.meta.title}
Body: ${(evidence.meta.body || '').slice(0, 1800)}
Changed files:\n${evidence.changedPaths.join('\n')}
Changed test diff:\n${evidence.specDiff}
Full changed spec context:\n${evidence.specText}
Diff:\n${evidence.diff}

Reply ONLY JSON: {"testable":true|false,"reason":"one sentence"}.`,
    });
    let detect = detectResponse.value;
    console.log(`[detect json] ${detectResponse.attempts.map(({ attempt, kind, stopReason, chars }) =>
      `attempt=${attempt} kind=${kind} stop=${stopReason} chars=${chars}`).join('; ')}`);
    console.log(`[detect] testable=${detect.testable} reason=${detect.reason}`);
    let detectSkipChallenge;
    if (!detect.testable && shouldChallengeSkip({ stage: 'detect', evidence })) {
      const challenge = await rootRenderDetectChallenge(evidence);
      detectSkipChallenge = {
        triggered: true,
        outcome: challenge.testable ? 'CONTINUE' : 'SKIPPED',
        reason: challenge.reason,
      };
      console.log(`[detect root-render challenge] testable=${challenge.testable} reason=${challenge.reason}`);
      if (challenge.testable) detect = { ...detect, testable: true, reason: challenge.reason };
    }
    if (!detect.testable) {
      saveResult({ status: 'SKIPPED', stage: 'detect', reason: detect.reason, skipChallenge: detectSkipChallenge });
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
    const liveCapture = await captureLiveConfigs(context, routeLibraries);
    const liveConfigs = Array.isArray(liveCapture?.configs) ? liveCapture.configs : [];
    const rootHints = Array.isArray(liveCapture?.rootHints) ? liveCapture.rootHints : [];
    if (!Array.isArray(liveConfigs) || liveConfigs.length === 0) {
      throw new Error('QA overlay did not capture a live collection config from the historical build');
    }
    postLiveConfig = liveConfigs[0];
    console.log(`[capture] ${liveConfigs.length} live config(s); root hints=${JSON.stringify(rootHints)}`);
    const planRaw = `Reproduce exactly ONE human-authored test/requirement from this historical Adobe CaaS PR on a real page. Do not invent expected behavior.

PR: ${evidence.meta.title}
Body: ${(evidence.meta.body || '').slice(0, 1800)}
Changed test diff (authoritative for which tests changed):\n${evidence.specDiff}
Full changed spec context (do not select an old unchanged test):\n${evidence.specText}
Diff:\n${evidence.diff.slice(0, 12000)}

Current-checkout source research:\n${research.report}

Live collection configs:\n${JSON.stringify(liveConfigs).slice(0, 18000)}

Live DOM root hints captured before injection (use these for scoped probes if a custom element is replaced during React mount):\n${JSON.stringify(rootHints)}

${CARD_SHAPE}

RAW CARD CONTRACT: CARD_SHAPE is illustrative, not a universal schema. Trace the selected renderer's raw card reads and preserve both field location and value shape exactly. Keep top-level fields it reads (for example overlayLink, reference, country) at top level; do not assume contentArea.url supplies every CTA/link. Preserve footer entry type/style/text/href exactly (for example {type:"link", style:"button", ...}) rather than inventing a generic button object.

Harness contract: return only the config keys needed for the selected feature/test. Code deep-merges that feature patch into the captured live config before React receives it, preserving required transport fields such as collection.endpoint and i18n defaults. You MAY and SHOULD add config keys introduced by this PR even when they do not exist on the current live page. A field read through ConfigContext/useConfig/getConfig and supplied by the changed unit test is a proven injectable config path. Absence from today's live config is expected for a historical new feature and is NEVER, by itself, a reason to skip. Do not require an authoring-UI, metadata, or currently deployed production path; this back-test deliberately swaps the parsed config and collection response to exercise the PR build.

BOOTSTRAP DATA-FLOW CHECK: a changed DOM model/custom-element constructor or getAttribute implementation is not automatically internal-only. If a changed property is passed through model.props, createRDC, a decorator, or another wrapper into a mounted React component, test whether preserving the custom element's existing data-config bridge plus sentinel cards makes the collection mount. The local replacement config is only usable after that bridge reaches the mounted component; do not assume it bypasses the changed constructor. React may replace the original custom-element tag during mount, so use a surviving root from the captured Live DOM root hints for one scoped selector that includes the sentinel's unique id/title and proves it is inside each rendered collection; do not require the original tag/data-config attribute to remain in the final DOM. This page captured ${liveConfigs.length} collection config(s): require the scoped selector's minMatches to cover every equivalent captured root, not separate generic root/card selectors or a screenshot.

PRIMARY + DISCRIMINATING ASSERTION: choose the PR's primary new visitor-visible behavior, not an easier added legacy/backward-compatibility regression test when the diff also introduces a new capability. The assertion must be able to differ between the historical base and head because it exercises a runtime branch or DOM output added/changed by this PR. Compare added and removed source before selecting it: a newly added unit test is not enough if it only checks a generic string/class/config pass-through that the base already performed. For a new card style, prefer post-only semantic markup or variant classes from the changed runtime branch; if the change is otherwise visual geometry/color only, return a visual-judgment skip rather than claiming a shallow DOM class proves the design.

Return a minimal feature config patch, crafted cards and filters, the exact expected assertion, and up to six read-only CSS probes that expose the relevant DOM. A probe is {"selector":"CSS selector","attributes":["attribute"],"why":"..."}. The selected assertion must come from the changed test diff or a new observable product requirement explicitly introduced by the PR diff/body; never borrow an old unchanged regression test from the full spec. Follow the production caller chain from test props to config/card/filter JSON and cite it. Return skipReason only if the relevant input cannot be expressed in the replaced config/card/filter JSON, or the assertion fundamentally requires unsupported interaction or visual judgment.

BOUNDARY CASES: when the changed source adjusts a comparison or visibility condition, trace its initial values and mount effects. Prefer a minimal fixture whose injected card/filter/config values land exactly at the changed boundary on the initial render (for example, cards.length = cardsPerPage + 1) over assuming a click is necessary from the ticket wording.

ASYNC REMOVAL/HIDE: existing collection hosts in the live DOM root hints are real page DOM, not elements you need to create. The harness records targeted probes after the first collection request is intercepted and before it releases the controlled fixture response, then again after rendering. When the changed behavior removes/hides an existing host after data resolves (for example an empty response), use a stable host/root probe and assert both its positive pre-response anchor and its expected final absence. Do not call that unsupported merely because the final DOM no longer contains the host.

RENDER-OR-SKIP: your config MUST actually render the exact component your assertion observes. If the assertion targets a carousel control, set the collection layout/style to the carousel variant so CardsCarousel renders; if it targets nested filter items, the filter panel and its nested filter data must render those items directly. If the target element would only appear after an interaction the harness cannot perform (advancing/scrolling a carousel, hovering, clicking, typing, resizing the viewport), that is an UNSUPPORTED interaction: return a precise skipReason naming the required interaction instead of a scenario whose target never appears. Never select an assertion you cannot make observable in the initial render.

NESTED FILTER INITIAL STATE: distinguish mapping-derived categories from directly supplied filter state. A categoryMappings transform may force a category closed, so it cannot prove a no-click scenario. Before skipping, trace whether the initial filter data can directly seed an open outer group and an {isCategory:true, opened:true, items:[...]} category. That is valid only for the changed initial data/predicate—not proof that expand/click wiring works. Probe the stable filter list plus a positive and an excluded leaf; nested leaves may be sibling list items, not descendants.

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
    if (plan.skipReason && shouldChallengeSkip({ stage: 'plan', evidence })) {
      const replanResponse = await requestBoundedJson({
        ask: llmResponse,
        prompt: `${planRaw}\n\nROOT-RENDER SKIP CHALLENGE: This PR changed a DOM/config-to-React bridge and its changed test proves a config/props handoff. A previous planner proposed a skip. Re-plan adversarially before accepting that conclusion. Trace the production caller chain into the mounted component. Preserve the live custom element's data-config as the bridge input; the injected replacement only takes effect after the bridge reaches React. If controlled sentinel cards can prove collection mount, return a complete normal scenario plan. Use a surviving root from the captured Live DOM root hints—React may replace the original custom-element tag—and require one scoped selector containing the sentinel's unique id/title with minMatches covering every equivalent captured root, not separate generic cards elsewhere. Return skipReason only after proving that this handoff cannot affect initial mount through injected config/cards.`,
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
    // A generic style literal echoed into a class or data attribute can be
    // existing renderer plumbing, not evidence of the changed feature. Give
    // the planner one chance to find the post-only semantic DOM consequence
    // (or explicitly call the change visual-only) before accepting that plan.
    let planConfigEchoChallenge;
    if (!plan.skipReason && needsConfigEchoChallenge(plan)) {
      const contract = configEchoContract(plan);
      try {
        const replanResponse = await requestBoundedJson({
          ask: llmResponse,
          prompt: `${planRaw}\n\nCONFIG-ECHO DISCRIMINATION CHALLENGE: The previous plan only proves that the injected cardStyle literal is echoed into a generic class/data attribute. That generic plumbing can already exist in the historical base, so it is not discriminating evidence of this PR. The replan is bound to this immutable feature contract: ${JSON.stringify(contract)}. Do not switch to another changed test or cardStyle. Re-plan from that same changed runtime source. Prefer a post-only semantic DOM consequence introduced by this PR (for example a conditional footer, CTA/button, modifier, or accessible attribute) and craft fixture data that renders it on initial load. If the change is only visual geometry/color/styling and no post-only semantic DOM output can be observed, return a precise visual-judgment skipReason. Do not claim that the configured style name's own class/data echo proves the feature.`,
          label: 'config-echo replan',
          maxTokens: 16000,
          retryMaxTokens: 8000,
          maxChars: 24000,
          retrySuffix: `Return the entire replacement JSON object again, with no prose or fences. Either provide a complete plan whose assertion uses post-only semantic DOM evidence, or a precise visual-judgment skipReason. Do not use the configured style literal's generic class/data echo as evidence. Keep it below 24,000 characters.`,
          parseAndValidate: (rawPlan) => enforceConfigEchoContract(contract,
            finalizePlan(rawPlan, { evidence, liveConfig: postLiveConfig })),
        });
        plan = replanResponse.value;
        planConfigEchoChallenge = {
          triggered: true,
          outcome: plan.skipReason ? 'SKIPPED' : 'REPLANNED',
          attempts: replanResponse.attempts,
        };
        console.log(`[plan config-echo challenge] ${planConfigEchoChallenge.outcome}; ${replanResponse.attempts.map(({ attempt, kind, stopReason, chars }) =>
          `attempt=${attempt} kind=${kind} stop=${stopReason} chars=${chars}`).join('; ')}`);
      } catch (error) {
        // This is a discrimination hardening attempt, not the primary plan.
        // A malformed optional replan must not turn a runnable feature test
        // into an infrastructure ERROR; retain the original constrained plan.
        planConfigEchoChallenge = {
          triggered: true,
          outcome: 'UNRESOLVED',
          reason: String(error.message || error).slice(0, 1000),
        };
        console.warn(`[plan config-echo challenge] UNRESOLVED: ${planConfigEchoChallenge.reason}`);
      }
    }
    if (plan.skipReason) {
      saveResult({ status: 'SKIPPED', stage: 'plan', reason: plan.skipReason,
        researchCount: research.searches.length, sourceTest: plan.sourceTest || '', skipChallenge: planSkipChallenge,
        discriminationChallenge: planConfigEchoChallenge });
      return;
    }
    bundle = { pr: Number(PR), meta: evidence.meta, plan, researchCount: research.searches.length,
      researchSummary: research.summary, researchSearches: research.searches };
    if (planSkipChallenge) bundle.skipChallenge = planSkipChallenge;
    if (planConfigEchoChallenge) bundle.discriminationChallenge = planConfigEchoChallenge;
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
        taskContext: `Repair a failed initial-render scenario for this historical Adobe CaaS feature test. The changed requirement is immutable; do not seek a different/easier assertion. Find whether another production caller, config/layout, or fixture-data shape can render the exact required selector without a browser interaction. If no static path exists, say so precisely.\n\nPR: ${postEvidence.meta.title}\nChanged test diff:\n${postEvidence.specDiff}\nProduct diff:\n${postEvidence.diff.slice(0, 10000)}\n\nImmutable source test: ${bundle.plan.sourceTest}\nImmutable expected assertion: ${bundle.plan.expected}\nInitial config patch: ${JSON.stringify(bundle.plan.configPatch)}\nRequired initial selectors: ${JSON.stringify(bundle.plan.renderability.requiredInitial)}\nMissing evidence: ${JSON.stringify(missingInitial)}\nInitial requested probe results: ${JSON.stringify(observed.probes).slice(0, 12000)}\nPre-fixture probe results (when present, captured before the controlled collection response): ${JSON.stringify(observed.beforeFixture?.probes || []).slice(0, 12000)}`,
      });
      console.log(`[renderability research] searches=${repairResearch.searches.length} summary=${repairResearch.summary.slice(0, 800)}`);
      const repairResponse = await requestBoundedJson({
        ask: llmResponse,
        label: 'renderability repair',
        maxTokens: 12000,
        retryMaxTokens: 8000,
        maxChars: 24000,
        retrySuffix: `Return the COMPLETE replacement JSON object again, with no prose or fences. Preserve the immutable assertion contract, use only config/cards/filters/isHashed scenario inputs, and keep the result below 24,000 characters. If no supported initial-render scenario exists, return only a precise skipReason.`,
        parseAndValidate: (rawRepair) => applyScenarioRepair(bundle.plan, rawRepair),
        prompt:
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
Pre-fixture requested probes (captured before controlled response): ${JSON.stringify(observed.beforeFixture?.probes || []).slice(0, 12000)}

Fresh bounded source research:\n${repairResearch.report}

The harness supports initial render from injected config, cards, and filters, plus a targeted pre-response snapshot for intentional removal/hide behavior. It cannot click, type, expand, scroll, hover, resize, or alter URL state. Return a COMPLETE replacement feature config patch (not a delta from the initial patch), plus the complete replacement cards and filters. Preserve raw card field locations and exact footer entry shapes read by the selected renderer; contentArea.url is not a universal CTA/overlay field. For nested filters, do not rely on a categoryMappings transform that forces a category closed when direct initial filter data can seed openedOnLoad and {isCategory:true, opened:true, items:[...]}. If the same exact component has another static config/layout caller, use it. If no static injected scenario can mount the exact target, return a precise skipReason naming the unsupported interaction/state. Do not weaken the assertion, substitute a wrapper, or change probes/renderability.

Reply ONLY JSON:
{"config":{},"cards":[],"filters":[],"isHashed":false}
or {"skipReason":"precise unsupported interaction or state"}.`,
      });
      const repair = repairResponse.value;
      console.log(`[renderability repair json] ${repairResponse.attempts.map(({ attempt, kind, stopReason, chars }) =>
        `attempt=${attempt} kind=${kind} stop=${stopReason} chars=${chars}`).join('; ')}`);
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
        initialBeforeFixtureRequiredProbes: (Array.isArray(observed.beforeFixture?.probes) ? observed.beforeFixture.probes : [])
          .filter((probe) => bundle.plan.renderability.requiredInitial
            .some((requirement) => requirement.selector === probe.selector)),
        missingInitial,
        researchCount: repairResearch.searches.length,
        responseAttempts: repairResponse.attempts,
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
