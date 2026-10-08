import createPulse, { consentStatus, pulseState } from './lanaPulse';

// Correlate one sampled page visit across independently mounted collections.
const KEY = Symbol.for('caas.telemetry.v2');
const EVENTS = ['collection_started', 'collection_ready', 'collection_rendered',
    'collection_failed', 'collection_fallback', 'request_started', 'request_failed'];
const bundleUrl = globalThis.document && globalThis.document.currentScript
    ? globalThis.document.currentScript.src : '';
const bytes = value => encodeURIComponent(value).replace(/%[A-F\d]{2}/gi, 'x').length;

export function cleanUrl(value, includeQuery = false) {
    try {
        const url = new URL(value, globalThis.location.href);
        if (!['http:', 'https:'].includes(url.protocol)) return '[removed]';
        let clean = `${url.origin}${url.pathname}`;
        if (includeQuery && url.search) {
            const query = new URLSearchParams();
            const allowed = /^(locale|lang|language|country|tags?|limit|size|offset|page|sort|order|originSelection|contentType|namespace|environment|collection|flatFile|partialLoadCount)$/i;
            url.searchParams.forEach((entry, key) => {
                query.append(key, allowed.test(key) && entry.length <= 200 ? entry : '[removed]');
            });
            clean += `?${query}`;
        }
        return clean.length <= 350 ? clean : '[url too long]';
    } catch (error) { return '[invalid url]'; }
}

export function cleanConfig(config) {
    const seen = new WeakSet();
    return JSON.stringify(config, (key, value) => {
        if (/token|secret|password|authorization|cookie|headers|email|visitor|userId|customerId|api.?key/i.test(key)) return '[removed]';
        if (typeof value === 'string') {
            if (/^https?:\/\/|^\//i.test(value) || /url|endpoint|href/i.test(key)) {
                return cleanUrl(value, true);
            }
            if (/bearer\s|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(value)) return '[removed]';
        }
        if (value && typeof value === 'object') {
            if (seen.has(value)) return '[repeated reference]';
            seen.add(value);
        }
        return value;
    }) || '{}';
}

function state() {
    if (!globalThis[KEY]) {
        globalThis[KEY] = { nextCollection: 0,
nextConfig: 0,
configParts: 0,
            outcomes: 0,
snapshots: new Map(),
errors: new Set() };
    }
    return globalThis[KEY];
}

function context() {
    const run = new URLSearchParams(globalThis.location.search).get('caas_log_poc');
    if (run !== null && !/^smoke-[a-z0-9_-]{1,40}$/i.test(run)) return null;
    const page = state();
    if (page.sampled === undefined) page.sampled = !!(pulseState() && pulseState().sampled);
    if (!run && !page.sampled) return null;
    if (!page.id) {
        const random = new Uint32Array(4);
        globalThis.crypto.getRandomValues(random);
        page.id = Array.from(random, n => n.toString(16).padStart(8, '0')).join('');
    }
    return { marker: 'caas_telemetry_v2',
pageVisitId: page.id,
        release: process.env.CAAS_RELEASE_VERSION || 'development',
        build: process.env.CAAS_BUILD_COMMIT || 'unknown',
        mode: run ? 'test' : 'sample',
sampleRate: run ? 100 : 10,
...consentStatus(),
...(run ? { run } : {}) };
}

function transmit(message, event) {
    try {
    const query = new URLSearchParams({ m: message,
c: 'chimera',
s: String(JSON.parse(message).sampleRate),
            t: 'e',
r: /failed|error|rejection/.test(event) ? 'error' : 'info',
tags: 'caas_telemetry_v2' });
        Promise.resolve(globalThis.fetch(`https://www.adobe.com/lana/ll?${query}`, {
            method: 'GET',
mode: 'no-cors',
credentials: 'omit',
            referrerPolicy: 'no-referrer',
keepalive: true,
        })).catch(() => {});
    } catch (error) { /* Logging must never interrupt a page. */ }
}

function send(event, details, isConfigPart = false) {
    try {
        const base = context();
        if (!base) return;
        const page = state();
        if (!isConfigPart && page.outcomes >= 96) return;
        const message = JSON.stringify({ ...base, event, ...details });
        if (bytes(message) > 1800) return;
        if (!isConfigPart) page.outcomes += 1;
        if (consentStatus().analyticsConsent === 'enabled') {
            transmit(message, event);
        } else {
            if (page.pendingClosed) return;
            if (!page.pending) {
                page.pending = [];
                globalThis.setTimeout(() => {
                    const {pending} = page;
                    page.pending = [];
                    page.pendingClosed = true;
                    if (consentStatus().analyticsConsent !== 'enabled') return;
                    pending.forEach(([saved, name]) => transmit(JSON.stringify({
                        ...JSON.parse(saved), ...consentStatus(),
                    }), name));
                }, 10000);
            }
            // The existing page budgets bound this in-memory buffer. It is discarded
            // after ten seconds unless analytics consent is explicitly enabled.
            page.pending.push([message, event]);
        }
    } catch (error) { /* Telemetry cannot interrupt the collection. */ }
}

function installErrors() {
    const page = state();
    if (!bundleUrl || (page.bundles && page.bundles.has(bundleUrl))) return;
    if (!page.bundles) page.bundles = new Set();
    page.bundles.add(bundleUrl);
    const report = (event, error, line, column) => {
        try {
            if (!context() || page.errors.has(event)) return;
            page.errors.add(event);
            const names = ['TypeError', 'ReferenceError', 'RangeError', 'SyntaxError', 'Error'];
            send(event, { collectionId: null,
configId: null,
                error: { kind: names.includes(error && error.name) ? error.name : 'Error',
                    source: cleanUrl(bundleUrl),
                    ...(Number.isSafeInteger(line) ? { line } : {}),
                    ...(Number.isSafeInteger(column) ? { column } : {}) } });
        } catch (ignored) { /* Never throw from global listeners. */ }
    };
    globalThis.addEventListener('error', (event) => {
        if (event.filename === bundleUrl) report('runtime_error', event.error, event.lineno, event.colno);
    });
    globalThis.addEventListener('unhandledrejection', (event) => {
        if (event.reason && typeof event.reason.stack === 'string'
            && event.reason.stack.includes(bundleUrl)) report('unhandled_rejection', event.reason);
    });
}

export default function createLanaSmokeLogger(getConfig = () => ({})) {
    const pulse = createPulse();
    const collectionId = `collection-${++state().nextCollection}`;
    const sent = new Set();
    let configId;
    let started;
    let fallback = false;
    let requestSequence = 0;
    let request;
    const requests = new Map();
    let attempts = 0;
    let limitSent = false;

    const initialize = () => {
        if (configId) return;
        const page = state();
        const snapshot = cleanConfig(getConfig()).replace(/[\u007f-\uffff]/g,
            char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
        configId = page.snapshots.get(snapshot);
        if (!configId) {
            configId = `config-${++page.nextConfig}`;
            // Chunk the snapshot without changing it. Parts are numbered from zero.
            const totalParts = Math.ceil(snapshot.length / 400);
            const omitted = snapshot.length > 12000 || page.configParts + totalParts > 64;
            page.snapshots.set(snapshot, configId);
            send('config_snapshot', { configId,
snapshotKind: 'collection_input',
                status: omitted ? 'omitted' : 'chunked',
totalParts: omitted ? 0 : totalParts,
                characters: snapshot.length,
...(omitted ? { reason: 'size_budget' } : {}) });
            if (!omitted) {
                page.configParts += totalParts;
                for (let part = 0; part < totalParts; part += 1) {
                    send('config_part', { configId,
part,
totalParts,
                        data: snapshot.slice(part * 400, (part + 1) * 400) }, true);
                }
            }
        }
        send('collection_context', { collectionId,
configId,
page: cleanUrl(globalThis.location.href),
            browser: String(globalThis.navigator.userAgent).slice(0, 220) });
        installErrors();
    };

    return (event, value) => {
        pulse(event);
        try {
            if (!EVENTS.includes(event) || !context()) return undefined;
            // Bound collections separately so snapshots cannot consume outcome capacity.
            if (Number(collectionId.split('-')[1]) > 8) {
                if (!state().limitSent) {
                    state().limitSent = true;
                    send('telemetry_limit', { collectionId: null, reason: 'collection_budget' });
                }
                return undefined;
            }
            if (event !== 'request_started' && event !== 'request_failed' && sent.has(event)) return undefined;
            if (attempts >= 8) {
                if (!limitSent) {
                    limitSent = true;
                    send('telemetry_limit', { collectionId, configId, reason: 'event_budget' });
                }
                return undefined;
            }
            initialize();
            sent.add(event);
            attempts += 1;
            if (event === 'collection_started') started = Date.now();
            if (event === 'collection_fallback') fallback = true;
            const details = { collectionId, configId };
            if (event === 'request_started') {
                request = `request-${++requestSequence}`;
                requests.set(request, Date.now());
                details.endpoint = cleanUrl(value.endpoint);
                details.source = value.source === 'fallback' ? 'fallback' : 'primary';
            }
            if (event.startsWith('request_')) {
                const requestId = event === 'request_failed' ? value.requestId : request;
                if (!requests.has(requestId)) return undefined;
                details.requestId = requestId;
                details.durationMs = Math.max(0, Date.now() - requests.get(requestId));
            } else if (started !== undefined && event !== 'collection_started') {
                details.durationMs = Math.max(0, Date.now() - started);
                details.fallback = fallback;
            }
            if (['collection_ready', 'collection_rendered'].includes(event)
                && Number.isSafeInteger(value) && value >= 0) details.cardCount = value;
            if (event === 'request_failed') {
                const kind = ['http', 'network', 'parse', 'processing'].includes(value.kind) ? value.kind : 'processing';
                details.error = { kind };
                if (Number.isInteger(value.status) && value.status >= 100 && value.status <= 599) details.error.status = value.status;
            }
            send(event, details);
            return request;
        } catch (error) { return undefined; }
    };
}
