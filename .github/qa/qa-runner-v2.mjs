#!/usr/bin/env node
/**
 * AI QA Runner v2
 *
 * Drives a real browser via Playwright; gives an LLM agent a tool-use
 * loop to navigate, inspect, click, type, and report. v2 changes vs the
 * original portable runner:
 *
 *   1. Numbered-ref interactives.  get_interactives() walks the DOM
 *      (including shadow roots), tags every clickable/typable element with
 *      a stable __qaRef integer, and returns a compact list to the model.
 *      click({ref}) and type({ref,text}) resolve refs server-side; the
 *      model never authors selectors.
 *
 *   2. Instrumented fast-path.  If the loaded page exposes window.caas
 *      (the QA hooks shipped in this build of CaaS), the runner calls
 *      waitForReady() instead of guessing on networkidle, and uses
 *      caas.dump() as the primary structured observation instead of
 *      slicing innerText.
 *
 *   3. No hard sleeps.  Navigation uses domcontentloaded + a real ready
 *      signal (caas:ready when present, otherwise a MutationObserver-based
 *      "DOM idle for 500ms" probe capped at 6s). Clicks rely on Playwright
 *      auto-waiting only.
 *
 *   4. Scoped subtree snapshots.  get_interactives(scope) restricts the
 *      walk to a CSS scope so card-collection tasks don't pay for nav,
 *      footer, and cookie-banner tokens every turn.
 *
 *   5. Screenshots are debug, not observation.  take_screenshot() writes
 *      the JPEG to ./qa-artifacts/ and returns the path, not base64.
 *      A model can re-feed a screenshot explicitly with read_screenshot
 *      when it actually needs to look.
 *
 * Usage:
 *   IMS_ACCESS_TOKEN=... node qa-runner-v2.mjs "verify that filter panel + search work on http://localhost:5151/index-qa.html"
 *
 * Required env:
 *   IMS_ACCESS_TOKEN  Bearer token for the LLM proxy.
 *   PROXY_URL         LLM proxy endpoint URL (no default; never hardcoded).
 *   MODEL             Model name to request from the proxy.
 *
 * Optional env:
 *   CDP_URL           Connect to a running Chrome (e.g. http://127.0.0.1:53647).
 *                     Otherwise launches headless Chromium.
 *   MAX_TURNS         Default 10.
 *   USER_DATA_DIR     Persistent Chrome profile dir; switches to launchPersistentContext.
 *   RECORD_VIDEO      1 to record webm video of the run.
 */

import { chromium } from 'playwright';
import { spawnSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const PROXY_URL  = process.env.PROXY_URL || '';
const MODEL      = process.env.MODEL || '';
const MAX_TURNS  = Number(process.env.MAX_TURNS || 10);
const MAX_TOKENS = 4096;
const ARTIFACTS  = resolve(process.cwd(), 'qa-artifacts');
const RUN_ID     = new Date().toISOString().replace(/[:.]/g, '-');

if (!PROXY_URL || !MODEL) {
    const missing = [!PROXY_URL && 'PROXY_URL', !MODEL && 'MODEL'].filter(Boolean).join(', ');
    console.error(`ERROR: required env vars not set: ${missing}`);
    process.exit(2);
}

const instruction = process.argv.slice(2).join(' ').trim();
if (!instruction) {
    console.error('Usage: node qa-runner-v2.mjs "<plain English instruction>"');
    process.exit(1);
}
const token = process.env.IMS_ACCESS_TOKEN;
if (!token) {
    console.error('Set IMS_ACCESS_TOKEN first.');
    process.exit(1);
}

// ---------------------------------------------------------------------------
// Page-side helpers (stringified, injected into the page)
// ---------------------------------------------------------------------------

// Walks the DOM (and any open shadow roots) and tags every visible
// interactive element with a stable __qaRef integer. Returns a compact array
// of { ref, role, label, tag, scope } that the LLM can reason over.
const QA_WALK_SRC = `
(function(scope) {
    const root = scope ? document.querySelector(scope) : document.body;
    if (!root) return { error: 'scope not found: ' + scope, items: [] };
    window.__qaMap = window.__qaMap || new Map();
    let nextRef = (window.__qaNextRef || 0);
    const items = [];

    function isVisible(el) {
        if (!el || el.nodeType !== 1) return false;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') return false;
        return true;
    }
    function labelFor(el) {
        return (
            el.getAttribute('aria-label') ||
            el.getAttribute('alt') ||
            el.getAttribute('title') ||
            el.getAttribute('placeholder') ||
            el.value ||
            (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 80)
        );
    }
    function classify(el) {
        const tag = el.tagName.toLowerCase();
        const role = el.getAttribute('role');
        if (role) return role;
        if (tag === 'a') return 'link';
        if (tag === 'button') return 'button';
        if (tag === 'input') {
            const t = (el.getAttribute('type') || 'text').toLowerCase();
            return 'input.' + t;
        }
        if (tag === 'select') return 'select';
        if (tag === 'textarea') return 'textarea';
        return null;
    }
    function nearestAncestor(el, predicate, maxDepth) {
        let cur = el.parentElement;
        let depth = 0;
        while (cur && depth < (maxDepth || 12)) {
            if (predicate(cur)) return cur;
            cur = cur.parentElement;
            depth++;
        }
        return null;
    }
    function parentContext(el) {
        const testIdAncestor = nearestAncestor(el, (n) => !!n.getAttribute('data-testid'));
        const landmarkAncestor = nearestAncestor(el, (n) => {
            const r = n.getAttribute('role');
            return r === 'region' || r === 'navigation' || r === 'complementary' || r === 'main';
        });
        const headedAncestor = nearestAncestor(el, (n) => {
            const h = n.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > [class*="title"], :scope > [class*="header"]');
            return h && h !== el;
        });
        const heading = headedAncestor
            ? headedAncestor.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > [class*="title"], :scope > [class*="header"]')
            : null;
        return {
            parentTestId: testIdAncestor ? testIdAncestor.getAttribute('data-testid') : null,
            parentLandmark: landmarkAncestor ? (landmarkAncestor.getAttribute('aria-label') || landmarkAncestor.getAttribute('role')) : null,
            parentHeading: heading ? (heading.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 60) : null,
        };
    }
    function walk(node) {
        if (!node) return;
        if (node.nodeType === 1) {
            const el = node;
            const kind = classify(el);
            if (kind && isVisible(el)) {
                const ref = nextRef++;
                el.setAttribute('data-qa-ref', String(ref));
                window.__qaMap.set(ref, el);
                const ctx = parentContext(el);
                items.push({
                    ref,
                    role: kind,
                    label: labelFor(el).slice(0, 100),
                    tag: el.tagName.toLowerCase(),
                    parentTestId: ctx.parentTestId,
                    parentLandmark: ctx.parentLandmark,
                    parentHeading: ctx.parentHeading,
                    name: el.getAttribute('name') || null,
                    href: el.getAttribute('href') || null,
                    checked: kind.startsWith('input.checkbox') || kind.startsWith('input.radio') ? !!el.checked : undefined,
                    value: (kind && kind.startsWith('input.')) ? (el.value || '').slice(0, 80) : undefined,
                });
            }
            if (el.shadowRoot) walk(el.shadowRoot);
        }
        const children = node.childNodes;
        for (let i = 0; i < children.length; i++) walk(children[i]);
    }
    walk(root);
    window.__qaNextRef = nextRef;
    return { count: items.length, items };
})
`;

const QA_CLICK_SRC = `
(function(ref) {
    const el = (window.__qaMap || new Map()).get(ref);
    if (!el) return { ok: false, error: 'unknown ref: ' + ref };
    try { el.scrollIntoView({ block: 'center' }); } catch (e) {}
    el.click();
    return { ok: true, tag: el.tagName.toLowerCase() };
})
`;

const QA_TYPE_SRC = `
(function(ref, text) {
    const el = (window.__qaMap || new Map()).get(ref);
    if (!el) return { ok: false, error: 'unknown ref: ' + ref };
    el.focus();
    if ('value' in el) {
        el.value = text;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return { ok: true };
})
`;

// "DOM idle" probe: resolves when no DOM mutations for ms milliseconds.
const QA_DOM_IDLE_SRC = `
(function(idleMs) {
    return new Promise((resolve) => {
        let timer = setTimeout(resolve, idleMs);
        const obs = new MutationObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(() => { obs.disconnect(); resolve(); }, idleMs);
        });
        obs.observe(document.documentElement, { subtree: true, childList: true, attributes: false });
    });
})
`;

// ---------------------------------------------------------------------------
// Tool definitions exposed to the LLM agent
// ---------------------------------------------------------------------------

const TOOLS = [
    {
        name: 'navigate',
        description: 'Navigate to a URL. Waits for the page to stabilize (caas:ready signal if present, otherwise DOM idle).',
        input_schema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
    },
    {
        name: 'take_screenshot',
        description: 'Capture the page as a JPEG AND return the image directly into your context so you can see it immediately. Also saves to ./qa-artifacts and includes the file path in the result so you can refer to it later (for diff_screenshots). This is your primary perception channel: take a screenshot after every meaningful action (navigate, click, type). Each screenshot costs ~1500 tokens.',
        input_schema: {
            type: 'object',
            properties: {
                fullPage: { type: 'boolean', description: 'capture full scrollable page (default false, viewport only)' },
                label:    { type: 'string', description: 'optional label appended to filename for your own tracking' },
            },
        },
    },
    {
        name: 'find_and_show',
        description: 'One-shot helper: wait up to 5 seconds for a CSS selector to appear in the DOM, scroll the matching element into view (centered), wait for paint, then take a screenshot and return it inline. Returns {ok:true, screenshot} on success or {ok:false, error} if the selector never appears. Use this as the FIRST step when you know what region you want to inspect (filter panel, pagination, search box, etc) - it collapses 3-4 turns of wait+scrollIntoView+screenshot into one turn.',
        input_schema: {
            type: 'object',
            properties: {
                selector: { type: 'string', description: 'CSS selector to find. Falls back to the first match if multiple.' },
                label:    { type: 'string', description: 'optional label for the saved file' },
            },
            required: ['selector'],
        },
    },
    {
        name: 'load_screenshots',
        description: 'Re-load one or more previously-saved screenshots back into context. Use this when you need to compare images captured several turns ago that may have been stripped from history. Pass paths as an array.',
        input_schema: {
            type: 'object',
            properties: {
                paths: { type: 'array', items: { type: 'string' } },
            },
            required: ['paths'],
        },
    },
    {
        name: 'diff_screenshots',
        description: 'Pixel-diff two saved screenshots via ImageMagick. Returns { pixelsDifferent, percent, diffPath } where diffPath points to a red-highlighted overlay PNG. Use diffPath with read_screenshot to see WHERE the pages differ. Then read_screenshot the originals too if you need to judge whether either side is broken in absolute terms (the diff only flags differences, not absolute correctness).',
        input_schema: {
            type: 'object',
            properties: { pathA: { type: 'string' }, pathB: { type: 'string' } },
            required: ['pathA', 'pathB'],
        },
    },
    {
        name: 'get_interactives',
        description: 'Return a numbered list of visible interactive elements (links, buttons, inputs, selects) currently on the page. Each item has a ref integer plus role and label. Pass a CSS selector as scope to restrict the walk to one subtree (cheaper). Walks open shadow roots. Use this AFTER you have seen a screenshot and decided what to click on.',
        input_schema: {
            type: 'object',
            properties: { scope: { type: 'string', description: 'optional CSS selector to scope the walk' } },
        },
    },
    {
        name: 'click',
        description: 'Click an element by ref returned from get_interactives. Fires the real DOM click event the same way a user mouse click would. Never author a CSS selector here.',
        input_schema: { type: 'object', properties: { ref: { type: 'integer' } }, required: ['ref'] },
    },
    {
        name: 'type',
        description: 'Type text into an input element by ref. Fires input + change events the same way a user keyboard would.',
        input_schema: { type: 'object', properties: { ref: { type: 'integer' }, text: { type: 'string' } }, required: ['ref', 'text'] },
    },
    {
        name: 'evaluate',
        description: 'Escape hatch: run a JS expression on the page and return its value. Use only for things you cannot determine visually or via get_interactives (e.g. checking a network response).',
        input_schema: { type: 'object', properties: { code: { type: 'string' } }, required: ['code'] },
    },
    {
        name: 'get_console_errors',
        description: 'Return any JavaScript errors observed in the browser console since navigation. Free to call; quick way to catch render crashes a human QA would miss without devtools open.',
        input_schema: { type: 'object', properties: {} },
    },
    {
        name: 'run_axe',
        description: 'Run axe-core accessibility audit on the current page. Returns structured violations: each with id, impact (critical/serious/moderate/minor), description, count of affected nodes, and a sample selector. Scope to a CSS selector to limit the audit area. This catches static a11y rule violations (color contrast, missing aria-label, missing form labels, heading order, etc). Does NOT catch dynamic ARIA announcements - for those use evaluate to read aria-live regions after interaction.',
        input_schema: {
            type: 'object',
            properties: {
                scope: { type: 'string', description: 'optional CSS selector to scope the audit' },
            },
        },
    },
    {
        name: 'keyboard_tab',
        description: 'Press the Tab key N times to move keyboard focus. Useful for testing focus-state visibility, focus-ring color contrast, and focus-trap behavior. Optionally pass shift: true to tab backwards.',
        input_schema: {
            type: 'object',
            properties: {
                count: { type: 'integer', description: 'number of Tab presses (default 1)' },
                shift: { type: 'boolean', description: 'shift+tab (default false)' },
            },
        },
    },
    {
        name: 'done',
        description: 'Finish testing. Write a complete plain-text report: what you tested, what passed, what failed.',
        input_schema: {
            type: 'object',
            properties: {
                report:  { type: 'string' },
                verdict: { type: 'string', enum: ['PASS', 'FAIL'] },
            },
            required: ['report', 'verdict'],
        },
    },
];

// ---------------------------------------------------------------------------
// LLM call (sync curl)
// ---------------------------------------------------------------------------

const ACTIVE_TOOLS = process.env.TOOLS_ALLOW
    ? TOOLS.filter((t) => process.env.TOOLS_ALLOW.split(',').map((x) => x.trim()).includes(t.name))
    : TOOLS;

function callLLM(messages) {
    const payload = JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, tools: ACTIVE_TOOLS, messages });
    process.stdout.write(`  [llm] ${messages.length} msgs ${payload.length}b ... `);
    // Retry up to 3 times on transient proxy errors (ETIMEDOUT, 5xx, empty body).
    let lastErr = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
        const result = spawnSync('curl', [
            '-s', '-X', 'POST', PROXY_URL,
            '-H', `Authorization: Bearer ${token}`,
            '-H', 'Content-Type: application/json',
            '-H', 'anthropic-version: 2023-06-01',
            '--max-time', '90',
            '--data-binary', '@-',
        ], { input: payload, encoding: 'utf8', timeout: 95_000 });
        if (result.error) {
            lastErr = new Error('curl: ' + result.error.message);
            process.stdout.write(`(retry ${attempt}: ${result.error.code || result.error.message}) `);
        } else if (!result.stdout || result.stdout.trim().length === 0) {
            lastErr = new Error('empty response from proxy');
            process.stdout.write(`(retry ${attempt}: empty body) `);
        } else {
            let parsed;
            try { parsed = JSON.parse(result.stdout); }
            catch (e) {
                lastErr = new Error('parse: ' + e.message + ' body=' + result.stdout.slice(0, 200));
                process.stdout.write(`(retry ${attempt}: parse fail) `);
                continue;
            }
            if (parsed.error) {
                lastErr = new Error('LLM error: ' + JSON.stringify(parsed.error));
                // Don't retry on 4xx auth errors etc.
                if (JSON.stringify(parsed.error).match(/401|403|invalid_api_key/i)) throw lastErr;
                process.stdout.write(`(retry ${attempt}: ${JSON.stringify(parsed.error).slice(0,80)}) `);
            } else {
                console.log('ok');
                return parsed;
            }
        }
        // Exponential backoff before retry.
        if (attempt < 3) {
            const waitMs = 2000 * Math.pow(2, attempt - 1);
            const until = Date.now() + waitMs;
            while (Date.now() < until) { /* busy wait, spawnSync is sync */ }
        }
    }
    throw lastErr || new Error('LLM call failed after 3 attempts');
}

// ---------------------------------------------------------------------------
// Tool execution
// ---------------------------------------------------------------------------

async function readyWait(page) {
    // Prefer the instrumented signal if present.
    const hasCaas = await page.evaluate(() => !!(window.caas && window.caas.waitForReady));
    if (hasCaas) {
        try {
            await page.evaluate(() => window.caas.waitForReady(6000).catch(() => null));
            return 'caas:ready';
        } catch (e) { /* fall through */ }
    }
    // Otherwise wait for DOM idle, capped at 6s.
    await page.evaluate(`(${QA_DOM_IDLE_SRC})(500)`).catch(() => null);
    return 'dom-idle';
}

async function runTool(page, consoleErrors, name, input) {
    switch (name) {
        case 'navigate': {
            try {
                await page.goto(input.url, { waitUntil: 'domcontentloaded', timeout: 25_000 });
                const how = await Promise.race([
                    readyWait(page),
                    new Promise((r) => setTimeout(() => r('cap-6s'), 6500)),
                ]);
                return `Navigated to ${input.url} (settled via ${how})`;
            } catch (e) { return `Navigation failed: ${e.message}`; }
        }
        case 'diff_screenshots': {
            mkdirSync(ARTIFACTS, { recursive: true });
            const { spawnSync } = await import('child_process');
            const diffPath = resolve(ARTIFACTS, `${RUN_ID}-diff-${Date.now()}.png`);
            // ImageMagick `magick compare` returns the count of differing pixels
            // on stderr with -metric AE. -fuzz tolerates small antialias noise.
            const r = spawnSync('magick', [
                'compare', '-metric', 'AE', '-fuzz', '3%',
                input.pathA, input.pathB, diffPath,
            ], { encoding: 'utf8' });
            // magick exits 1 when the images differ; that is expected.
            // ImageMagick 7+ writes "<count> (<fraction>)" to stderr;
            // parse both rather than trusting a fragile computed total.
            const raw = (r.stderr || '').trim();
            const m = raw.match(/^(\d+(?:\.\d+)?)\s*(?:\(([\d.]+)\))?/);
            const pixelsDifferent = m ? Math.round(Number(m[1])) : 0;
            const percent = m && m[2] ? +(Number(m[2]) * 100).toFixed(3) : null;
            return JSON.stringify({
                pixelsDifferent,
                percent,
                diffPath,
                magickRaw: raw,
            }, null, 2);
        }
        case 'get_interactives': {
            const r = await page.evaluate(`(${QA_WALK_SRC})(${JSON.stringify(input.scope || null)})`);
            return JSON.stringify(r, null, 2);
        }
        case 'click': {
            const r = await page.evaluate(`(${QA_CLICK_SRC})(${JSON.stringify(input.ref)})`);
            if (!r.ok) return `click failed: ${r.error}`;
            await readyWait(page);
            return `clicked ref ${input.ref} (${r.tag})`;
        }
        case 'type': {
            const r = await page.evaluate(`(${QA_TYPE_SRC})(${JSON.stringify(input.ref)}, ${JSON.stringify(input.text)})`);
            if (!r.ok) return `type failed: ${r.error}`;
            await readyWait(page);
            return `typed into ref ${input.ref}`;
        }
        case 'evaluate': {
            try {
                const v = await page.evaluate(input.code);
                return JSON.stringify(v, null, 2);
            } catch (e) { return `Error: ${e.message}`; }
        }
        case 'get_console_errors': {
            return consoleErrors.length ? consoleErrors.join('\n') : 'no console errors';
        }
        case 'run_axe': {
            // Inject axe-core from CDN if not already present.
            const hasAxe = await page.evaluate(() => typeof window.axe !== 'undefined');
            if (!hasAxe) {
                await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/axe-core@4/axe.min.js' });
            }
            const scope = input.scope || null;
            const result = await page.evaluate(async (sel) => {
                const ctx = sel ? document.querySelectorAll(sel) : document;
                const r = await window.axe.run(ctx, {
                    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
                });
                return {
                    violations: r.violations.map((v) => ({
                        id: v.id,
                        impact: v.impact,
                        description: v.description,
                        help: v.help,
                        nodeCount: v.nodes.length,
                        sampleTargets: v.nodes.slice(0, 3).map((n) => n.target),
                        sampleFailureSummary: v.nodes[0] ? v.nodes[0].failureSummary : null,
                    })),
                    passes: r.passes.length,
                    incomplete: r.incomplete.length,
                };
            }, scope);
            return JSON.stringify({
                violationCount: result.violations.length,
                passesCount: result.passes,
                incompleteCount: result.incomplete,
                violations: result.violations,
            }, null, 2);
        }
        case 'keyboard_tab': {
            const count = Math.max(1, Number(input.count || 1));
            const key = input.shift ? 'Shift+Tab' : 'Tab';
            for (let i = 0; i < count; i++) {
                await page.keyboard.press(key);
            }
            const focused = await page.evaluate(() => {
                const el = document.activeElement;
                if (!el) return null;
                return {
                    tag: el.tagName.toLowerCase(),
                    label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 80),
                    testId: el.getAttribute('data-testid'),
                };
            });
            return JSON.stringify({ pressed: `${key} x${count}`, focused }, null, 2);
        }
        case 'take_screenshot': {
            mkdirSync(ARTIFACTS, { recursive: true });
            const path = resolve(ARTIFACTS, `${RUN_ID}-${Date.now()}.jpg`);
            const buf = await page.screenshot({ path, type: 'jpeg', quality: 70, fullPage: !!input.fullPage });
            return {
                type: 'image_with_text',
                base64: buf.toString('base64'),
                mediaType: 'image/jpeg',
                text: `saved to: ${path}`,
            };
        }
        case 'find_and_show': {
            mkdirSync(ARTIFACTS, { recursive: true });
            // Accept a single selector string OR an array of fallbacks.
            // Try each in order; the first to appear within 5s wins.
            const candidates = Array.isArray(input.selector)
                ? input.selector
                : String(input.selector || '').split(',').map(s => s.trim()).filter(Boolean);
            let matched = null;
            for (const sel of candidates) {
                try {
                    await page.waitForSelector(sel, { state: 'attached', timeout: 5000 / candidates.length });
                    matched = sel;
                    break;
                } catch (e) { /* try next */ }
            }
            if (!matched) {
                return JSON.stringify({ ok: false, triedSelectors: candidates, error: 'no candidate selector matched within 5s' });
            }
            try {
                await page.evaluate((sel) => {
                    const el = document.querySelector(sel);
                    if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' });
                }, matched);
                await page.waitForTimeout(400);
                const label = input.label || 'find';
                const path = resolve(ARTIFACTS, `${RUN_ID}-${label}-${Date.now()}.jpg`);
                const buf = await page.screenshot({ path, type: 'jpeg', quality: 70 });
                return {
                    type: 'image_with_text',
                    base64: buf.toString('base64'),
                    mediaType: 'image/jpeg',
                    text: `find_and_show ok: matched selector "${matched}" out of [${candidates.join(', ')}]. screenshot saved to: ${path}`,
                };
            } catch (e) {
                return JSON.stringify({ ok: false, matched, error: e.message });
            }
        }
        case 'load_screenshots': {
            const { readFileSync } = await import('fs');
            const paths = Array.isArray(input.paths) ? input.paths : [];
            if (paths.length === 0) return 'no paths provided';
            const images = paths.map((p) => {
                const ext = (p.split('.').pop() || '').toLowerCase();
                const mediaType = ext === 'png' ? 'image/png'
                    : ext === 'webp' ? 'image/webp'
                    : ext === 'gif' ? 'image/gif'
                    : 'image/jpeg';
                return {
                    type: 'image',
                    base64: readFileSync(p).toString('base64'),
                    mediaType,
                };
            });
            return { type: 'images', images };
        }
        default: return `unknown tool: ${name}`;
    }
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

async function main() {
    console.log('\nAI QA Runner v2');
    console.log('-'.repeat(60));
    console.log('Instruction:', instruction);
    console.log('-'.repeat(60), '\n');

    let browser, context, page, attached = false;
    const userDataDir = process.env.USER_DATA_DIR;
    const recordVideo = process.env.RECORD_VIDEO === '1';
    const videoDir = resolve(ARTIFACTS, 'videos');

    if (userDataDir) {
        // Launch real installed Chrome with a persistent profile. This gives
        // adobe.com a real fingerprint AND supports recordVideo (CDP-attached
        // contexts don't).
        if (recordVideo) mkdirSync(videoDir, { recursive: true });
        context = await chromium.launchPersistentContext(userDataDir, {
            channel: 'chrome',
            headless: false,
            viewport: { width: 1456, height: 900 },
            args: ['--no-default-browser-check', '--no-first-run'],
            ...(recordVideo ? { recordVideo: { dir: videoDir, size: { width: 1456, height: 900 } } } : {}),
        });
        page = context.pages()[0] || await context.newPage();
        browser = context.browser();
        attached = false; // we own this browser; close it at the end
        console.log(`[browser] real Chrome with persistent profile at ${userDataDir}` + (recordVideo ? ' (recording video)' : '') + '\n');
    } else if (process.env.CDP_URL) {
        browser = await chromium.connectOverCDP(process.env.CDP_URL);
        context = browser.contexts()[0] ?? await browser.newContext();
        page = await context.newPage();
        attached = true;
        console.log(`[browser] attached to ${process.env.CDP_URL}\n`);
    } else {
        // adobe.com bot detection rejects headless Playwright over HTTP/2.
        // Mirror the args the original portable runner used.
        browser = await chromium.launch({
            headless: true,
            args: ['--disable-http2', '--no-sandbox', '--disable-blink-features=AutomationControlled'],
        });
        context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            viewport: { width: 1456, height: 900 },
        });
        page = await context.newPage();
        console.log('[browser] headless chromium with bot-evasion args\n');
    }

    if (process.env.DIST_DIR) {
        const __distRoot = process.env.DIST_DIR;
        const __allow = new Set(['main.min.js', 'app.css', 'react.umd.js', 'react.dom.umd.js']);
        await context.route('**/caas-libs/**', async (route) => {
            const f = route.request().url().split('?')[0].split('/').pop();
            if (!__allow.has(f)) return route.continue();
            try { await route.fulfill({ path: __distRoot + '/' + f }); } catch { await route.continue(); }
        });
        console.log('[browser] injecting PR dist for caas-libs from ' + __distRoot + '\n');
    }

    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push('[pageerror] ' + e.message));

    const systemNudge =
        'You are a human QA engineer. Test the page the way a real user would: look at it with your eyes, click with the mouse, type with the keyboard. Tools: navigate, take_screenshot, read_screenshot, diff_screenshots, get_interactives, click, type, evaluate, get_console_errors, done.\n' +
        '\n' +
        'Observation pattern:\n' +
        '  - take_screenshot returns the image DIRECTLY into your context. You see it on the same turn. The text part of the result contains the file path so you can refer to it later in diff_screenshots.\n' +
        '  - Look at it: does anything look broken, misaligned, off-color, overlapping, missing?\n' +
        '  - Use load_screenshots({paths: [...]}) only when you need to re-fetch images that were stripped from older turns.\n' +
        '\n' +
        'Interaction pattern:\n' +
        '  - get_interactives() returns numbered refs, each with parentTestId, parentLandmark, parentHeading. Use these to disambiguate when multiple elements share a label (e.g. "Acrobat" in filter panel vs nav).\n' +
        '  - ALWAYS pass a scope CSS selector to get_interactives when you know the area you want. Examples: scope: "[data-testid=\\"consonant-LeftFilters\\"]" for filter panel, "[data-testid=\\"consonant-CardsGrid\\"]" for cards, "[data-testid=\\"consonant-Search\\"]" for search box. Scoping is 10x cheaper than walking the whole page.\n' +
        '  - click(ref) or type(ref, text). Never author a CSS selector for click/type.\n' +
        '  - After acting, take_screenshot + read_screenshot again to see the new state.\n' +
        '\n' +
        'Version comparison pattern (4 turns total):\n' +
        '  Turn 1: navigate to A, take_screenshot (you SEE A).\n' +
        '  Turn 2: navigate to B, take_screenshot (you SEE B).\n' +
        '  Turn 3: diff_screenshots(pathA, pathB) THEN load_screenshots({paths:[diffPath]}) to bring the diff overlay into view alongside your already-fresh memory of A and B.\n' +
        '  Turn 4: call done(report, verdict). Report meaningful differences AND any standalone problems either version has.\n' +
        '  Do NOT take more screenshots after the diff; you already saw A, B, and the diff. Just synthesize and report.\n' +
        '\n' +
        'Cost discipline: each read_screenshot is ~1500 tokens. Take many, read selectively.\n' +
        'End with done(report, verdict). Aim for 4-8 turns.';

    // Checkpoint file: persists messages + turn state across crashes/resumes.
    // Always written to a stable path so RESUME=1 can find the most recent.
    const checkpointPath = resolve(ARTIFACTS, 'checkpoint.json');
    const resume = process.env.RESUME === '1';
    const { existsSync, readFileSync, writeFileSync, unlinkSync } = await import('fs');

    let messages, startTurn = 1;
    if (resume && existsSync(checkpointPath)) {
        try {
            const ck = JSON.parse(readFileSync(checkpointPath, 'utf8'));
            if (ck.instruction === instruction) {
                messages = ck.messages;
                startTurn = ck.nextTurn || (ck.lastTurn ? ck.lastTurn + 1 : 1);
                console.log(`[resume] loaded checkpoint from turn ${ck.lastTurn}, continuing at turn ${startTurn}`);
            } else {
                console.log('[resume] checkpoint instruction mismatch; starting fresh');
            }
        } catch (e) {
            console.log(`[resume] checkpoint unreadable (${e.message}); starting fresh`);
        }
    } else if (existsSync(checkpointPath)) {
        // Fresh run, old checkpoint sitting around. Wipe it.
        try { unlinkSync(checkpointPath); } catch (e) {}
    }
    if (!messages) {
        mkdirSync(ARTIFACTS, { recursive: true });
        messages = [{
            role: 'user',
            content: `${systemNudge}\n\nTask: ${instruction}`,
        }];
    }

    function saveCheckpoint(lastTurn, reportSoFar, verdictSoFar) {
        try {
            // Strip raw image data from checkpoint so the JSON stays small.
            // Resumed runs may need to re-fetch images, which is acceptable.
            const slimMessages = messages.map((m) => {
                if (!Array.isArray(m.content)) return m;
                return {
                    ...m,
                    content: m.content.map((c) => {
                        if (c.type === 'tool_result' && Array.isArray(c.content)) {
                            return {
                                ...c,
                                content: c.content.map((p) =>
                                    p.type === 'image'
                                        ? { type: 'text', text: '[checkpoint: image stripped]' }
                                        : p
                                ),
                            };
                        }
                        return c;
                    }),
                };
            });
            writeFileSync(checkpointPath, JSON.stringify({
                instruction,
                lastTurn,
                nextTurn: lastTurn + 1,
                report: reportSoFar,
                verdict: verdictSoFar,
                savedAt: new Date().toISOString(),
                messages: slimMessages,
            }, null, 2));
        } catch (e) { /* checkpointing is best-effort */ }
    }

    let report = null, verdict = 'FAIL';

    try {
        for (let turn = startTurn; turn <= MAX_TURNS; turn++) {
            // Turn-budget warning: when 2 turns remain, append a high-priority
            // reminder to the last user message so the agent sees it on this turn.
            // This forces the agent to wrap up before the cap rather than
            // exploring indefinitely.
            if (turn === MAX_TURNS - 1 && !report) {
                const warning = '\n\n[SYSTEM]: You have 2 turns remaining. STOP exploring. Call done(report, verdict) on this turn or next with whatever findings you have so far. A partial report is better than no report.';
                const last = messages[messages.length - 1];
                if (last && last.role === 'user') {
                    if (typeof last.content === 'string') {
                        last.content += warning;
                    } else if (Array.isArray(last.content)) {
                        last.content.push({ type: 'text', text: warning });
                    }
                }
            }
            process.stdout.write(`Turn ${turn}/${MAX_TURNS} `);
            const response = callLLM(messages);
            messages.push({ role: 'assistant', content: response.content });

            const toolCalls = response.content.filter((c) => c.type === 'tool_use');
            if (toolCalls.length === 0 || response.stop_reason === 'end_turn') {
                console.log('  (done, no tool calls)');
                break;
            }
            const results = [];
            for (const call of toolCalls) {
                if (call.name === 'done') {
                    report = call.input?.report || '(no report)';
                    verdict = call.input?.verdict || 'FAIL';
                    results.push({ type: 'tool_result', tool_use_id: call.id, content: 'report recorded' });
                    console.log(`  > done (${verdict})`);
                    break;
                }
                const shortIn = JSON.stringify(call.input).slice(0, 80);
                process.stdout.write(`  > ${call.name}(${shortIn}) `);
                let r;
                try {
                    r = await runTool(page, consoleErrors, call.name, call.input);
                } catch (toolErr) {
                    // Any tool throwing is converted into a recoverable
                    // tool_result so the agent can adjust its next move
                    // instead of crashing the whole run.
                    console.log(`< [tool error] ${toolErr.message.slice(0, 100)}`);
                    results.push({
                        type: 'tool_result',
                        tool_use_id: call.id,
                        content: `Tool ${call.name} failed: ${toolErr.message}. Try a different selector or input. Do NOT pass selectors with literal quote characters (use scope: ".consonant-Pagination" not scope: "\\".consonant-Pagination\\"").`,
                        is_error: true,
                    });
                    continue;
                }
                if (r && r.type === 'image') {
                    console.log(`< [image]`);
                    results.push({
                        type: 'tool_result',
                        tool_use_id: call.id,
                        content: [{ type: 'image', source: { type: 'base64', media_type: r.mediaType, data: r.base64 } }],
                    });
                } else if (r && r.type === 'image_with_text') {
                    console.log(`< [image+text]`);
                    results.push({
                        type: 'tool_result',
                        tool_use_id: call.id,
                        content: [
                            { type: 'image', source: { type: 'base64', media_type: r.mediaType, data: r.base64 } },
                            { type: 'text', text: r.text },
                        ],
                    });
                } else if (r && r.type === 'images') {
                    console.log(`< [${r.images.length} images]`);
                    results.push({
                        type: 'tool_result',
                        tool_use_id: call.id,
                        content: r.images.map((img) => ({
                            type: 'image',
                            source: { type: 'base64', media_type: img.mediaType, data: img.base64 },
                        })),
                    });
                } else {
                    const s = String(r);
                    console.log(`< ${s.split('\n')[0].slice(0, 100)}${s.length > 100 ? '...' : ''}`);
                    results.push({ type: 'tool_result', tool_use_id: call.id, content: s.slice(0, 8000) });
                }
            }
            if (report) break;

            // Strip image content from OLD turns only (keep last 2 turns of
            // images). This preserves the agent's ability to compare images
            // across recent turns while preventing context bloat.
            const KEEP_LAST_N_IMAGE_TURNS = 2;
            const userTurnsWithImages = [];
            messages.forEach((msg, i) => {
                if (Array.isArray(msg.content) && msg.content.some((c) =>
                    c.type === 'tool_result' && Array.isArray(c.content) &&
                    c.content.some((p) => p.type === 'image'))) {
                    userTurnsWithImages.push(i);
                }
            });
            const stripBefore = userTurnsWithImages.length > KEEP_LAST_N_IMAGE_TURNS
                ? userTurnsWithImages[userTurnsWithImages.length - KEEP_LAST_N_IMAGE_TURNS]
                : -1;
            messages.forEach((msg, i) => {
                if (i >= stripBefore) return;
                if (Array.isArray(msg.content)) {
                    msg.content = msg.content.map((c) => {
                        if (c.type === 'tool_result' && Array.isArray(c.content) &&
                            c.content.some((p) => p.type === 'image')) {
                            // Preserve any text part (file paths etc) for reference.
                            const textPart = c.content.find((p) => p.type === 'text');
                            const note = textPart ? `[image stripped; ${textPart.text}]` : '[image stripped from history]';
                            return { ...c, content: note };
                        }
                        return c;
                    });
                }
            });

            messages.push({ role: 'user', content: results });

            // Checkpoint after every successful turn. If callLLM or any
            // tool throws on the NEXT turn, RESUME=1 can pick up here.
            saveCheckpoint(turn, report, verdict);
        }

        // SAFETY NET: agent hit the turn cap without calling done().
        // Fire ONE last forced-synthesis call with no tools available so
        // the model must respond with text only. Parse that as the report.
        // This guarantees CI always receives a structured verdict instead
        // of "Agent did not call done()".
        if (!report) {
            console.log('  [auto-done] turn cap reached without done(); forcing synthesis...');
            try {
                const forcedMessages = [...messages, {
                    role: 'user',
                    content: 'You have exhausted your turn budget without calling done(). Write your final QA report now as plain text. Start with "VERDICT: PASS" or "VERDICT: FAIL" on the first line, then a structured report based on whatever data you gathered. Do NOT call any tools.',
                }];
                const forcedPayload = JSON.stringify({ model: MODEL, max_tokens: 2048, messages: forcedMessages });
                const forced = spawnSync('curl', [
                    '-s', '-X', 'POST', PROXY_URL,
                    '-H', `Authorization: Bearer ${token}`,
                    '-H', 'Content-Type: application/json',
                    '-H', 'anthropic-version: 2023-06-01',
                    '--max-time', '90',
                    '--data-binary', '@-',
                ], { input: forcedPayload, encoding: 'utf8', timeout: 95_000 });
                if (forced.stdout) {
                    const parsed = JSON.parse(forced.stdout);
                    const text = (parsed.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n');
                    if (text) {
                        report = text;
                        verdict = /^VERDICT:\s*PASS/im.test(text) ? 'PASS' : 'FAIL';
                        console.log(`  [auto-done] synthesized report, verdict=${verdict}`);
                    }
                }
            } catch (e) {
                console.log(`  [auto-done] synthesis failed: ${e.message}`);
            }
            if (!report) {
                // Last-resort: dump the last 5 messages so CI gets SOMETHING actionable.
                const tail = messages.slice(-5).map((m, i) => {
                    const c = typeof m.content === 'string' ? m.content : JSON.stringify(m.content).slice(0, 500);
                    return `[${m.role} #${i}] ${c}`;
                }).join('\n\n');
                report = `Agent did not call done() and synthesis fallback also failed. Last 5 messages of the conversation:\n\n${tail}`;
                verdict = 'FAIL_INCOMPLETE';
            }
        }
    } finally {
        // Capture the video path BEFORE closing (the video file is finalized on close).
        let videoPath = null;
        if (recordVideo && page.video) {
            try { videoPath = await page.video().path(); } catch (e) {}
        }
        await page.close();
        if (!attached) {
            if (browser) { await browser.close(); }
            else { await context.close(); }
        }
        if (videoPath) {
            console.log(`\n[video] saved to: ${videoPath}`);
        }
    }

    if (!report) { report = 'Agent did not call done(). No final report.'; verdict = 'FAIL'; }

    // Successful end-of-run: clear the checkpoint so the next fresh run
    // doesn't accidentally resume from this one.
    if (report && verdict !== 'FAIL_INCOMPLETE') {
        try { unlinkSync(checkpointPath); } catch (e) {}
    }

    console.log('\n' + '='.repeat(60));
    console.log(`  ${verdict === 'PASS' ? '[PASS]' : '[FAIL]'}  ${instruction.slice(0, 50)}`);
    console.log('='.repeat(60));
    console.log(report);
    console.log('='.repeat(60), '\n');

    if (process.env.GITHUB_STEP_SUMMARY) {
        writeFileSync(process.env.GITHUB_STEP_SUMMARY,
            `## ${verdict} ${instruction.slice(0, 80)}\n\n\`\`\`\n${report}\n\`\`\`\n`, { flag: 'a' });
    }
    if (process.env.REPORT_OUT) {
        try { writeFileSync(process.env.REPORT_OUT, JSON.stringify({ verdict, report })); } catch (e) {}
    }
    process.exit(verdict === 'PASS' ? 0 : 1);
}

main().catch((e) => { console.error('Error:', e); process.exit(2); });
