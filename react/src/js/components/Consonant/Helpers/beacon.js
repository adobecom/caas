/**
 * CaaS canary telemetry — beacon module.
 *
 * Fires structured beacons to LANA via navigator.sendBeacon (or a GET fetch
 * fallback). Each beacon carries cohort + version + session + sticky identity
 * so the Rundeck canary-compare job can join them in Splunk by sessionId /
 * stickyId / cohort / version.
 *
 * Phase A (this file): always emits cohort='stable' with the current bundle's
 * version. Cohort routing and canary-config.json reading come in Phase B —
 * the public API of this module doesn't change between phases.
 *
 * Consent gating: reads OptanonConsent cookie (set by OneTrust). If C0002
 * (analytics) is not granted, beacons are silently skipped — same predicate
 * Milo / AEP use, so we inherit Adobe's existing privacy posture.
 */

/* eslint-disable no-undef */

const LANA_ENDPOINT = 'https://www.adobe.com/lana/ll';
const LANA_CLIENT = 'chimera';
const VERSION = '0.48.3'; // TODO: inject via webpack DefinePlugin from package.json
const DEFAULT_COHORT = 'stable';  // Phase A: hardcoded; Phase B: from canary-config.json + UUID hash

// --- Internal state ---

let sessionId = null;
let stickyId = null;
let initialized = false;
let consentGranted = false;
let activeCohort = DEFAULT_COHORT;
let cohortForced = false;
let debugLog = false;

// --- Dev / test helpers ---

function getUrlParam(name) {
    try {
        return new URLSearchParams(window.location.search).get(name);
    } catch (e) {
        return null;
    }
}

function isDevHost() {
    const host = (typeof window !== 'undefined' && window.location && window.location.host) || '';
    return /localhost|127\.0\.0\.1|^0\.0\.0\.0|corp\.adobe\.com|adobeio-static|hlx\.(live|page)|aem\.(live|page)/.test(host);
}

// --- UUID generation (fallback for older browsers) ---

function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const b = crypto.getRandomValues(new Uint8Array(16));
        b[6] = (b[6] & 0x0f) | 0x40;
        b[8] = (b[8] & 0x3f) | 0x80;
        const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
        return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
    }
    // Last-resort fallback — non-crypto but fine for an analytics ID.
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}

// --- Consent check (read OptanonConsent cookie set by OneTrust) ---

function hasAnalyticsConsent() {
    try {
        const cookie = document.cookie
            .split(';')
            .find((c) => c.trim().startsWith('OptanonConsent='));
        if (!cookie) return false;

        const value = decodeURIComponent(cookie.split('=').slice(1).join('='));
        const groupsMatch = value.match(/groups=([^&]*)/);
        if (!groupsMatch) return false;

        const consent = Object.fromEntries(
            groupsMatch[1].split(',').map((g) => g.split(':')),
        );
        return consent.C0002 === '1';
    } catch (e) {
        return false;
    }
}

// --- Sticky ID storage ---

const STICKY_KEY = 'caas_cohort';

function loadOrCreateStickyId() {
    try {
        const stored = localStorage.getItem(STICKY_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.uuid) return parsed.uuid;
        }
    } catch (e) { /* localStorage may be disabled */ }

    const uuid = generateUUID();
    try {
        localStorage.setItem(STICKY_KEY, JSON.stringify({ uuid, history: [] }));
    } catch (e) { /* swallow */ }
    return uuid;
}

// --- Public API ---

/**
 * Initialize the beacon system. Idempotent — safe to call multiple times.
 * Should be called once at app boot.
 */
export function initBeacon() {
    if (initialized) return;
    initialized = true;

    // Consent: cookie check OR dev-host auto-grant OR explicit URL-param override
    const consentParamOverride = getUrlParam('caas_consent') === '1';
    consentGranted = hasAnalyticsConsent() || isDevHost() || consentParamOverride;

    // Cohort: URL-param override beats UUID-hash decision (Phase A: hash decision = always 'stable')
    const forced = getUrlParam('caas_cohort');
    if (forced === 'canary' || forced === 'stable') {
        activeCohort = forced;
        cohortForced = true;
    } else {
        activeCohort = DEFAULT_COHORT;
        cohortForced = false;
    }

    // Debug: console.log every beacon payload as it fires
    debugLog = getUrlParam('caas_debug') === '1';

    sessionId = generateUUID();
    if (consentGranted) {
        stickyId = loadOrCreateStickyId();
    } else {
        // No consent — use an ephemeral session UUID as stickyId too.
        // Never written to localStorage.
        stickyId = sessionId;
    }

    // Install passive error capture
    if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('error', handleWindowError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
    }

    if (debugLog) {
        // eslint-disable-next-line no-console
        console.log('[caas-beacon] init', {
            consentGranted,
            consentSource: hasAnalyticsConsent() ? 'cookie' : (isDevHost() ? 'dev-host' : (consentParamOverride ? 'url-param' : 'none')),
            activeCohort,
            cohortForced,
            sessionId,
            stickyId,
        });
    }
}

/**
 * Fire a structured beacon to LANA. Drops silently if consent not granted.
 *
 * @param {string} event   - one of: page_load, cards_rendered, target_missing,
 *                           assertions, error, fetch_fail, performance
 * @param {object} data    - event-specific payload (will be JSON-serialized)
 */
export function beacon(event, data = {}) {
    try {
        if (!initialized) initBeacon();
        if (!consentGranted) return;

        const payload = {
            event,
            timestamp: Date.now(),
            cohort: activeCohort,
            version: VERSION,
            sessionId,
            stickyId,
            data: cohortForced ? { ...data, forcedCohort: true } : data,
        };

        // Debug tap — keep the last 50 in-memory for DevTools inspection.
        try {
            if (typeof window !== 'undefined') {
                window.__CAAS_BEACON_TAP__ = window.__CAAS_BEACON_TAP__ || [];
                window.__CAAS_BEACON_TAP__.push(payload);
                if (window.__CAAS_BEACON_TAP__.length > 50) {
                    window.__CAAS_BEACON_TAP__.shift();
                }
            }
        } catch (e) { /* swallow */ }

        if (debugLog) {
            // eslint-disable-next-line no-console
            console.log(`[caas-beacon] ${event}`, payload);
        }

        const params = new URLSearchParams({
            c: LANA_CLIENT,
            m: JSON.stringify(payload),
            tags: `${activeCohort},${VERSION.replace(/\./g, '-')}`,
            r: event === 'error' ? 'e' : 'i',
            s: '100',  // Phase A: keep all; Phase B: scale per cohort (canary=100, stable=1)
            t: event === 'error' ? 'i' : 'e',
        });

        const url = `${LANA_ENDPOINT}?${params.toString()}`;

        // Prefer sendBeacon (survives unload, async). Fall back to fetch with keepalive.
        if (navigator && navigator.sendBeacon) {
            navigator.sendBeacon(url);
        } else if (typeof fetch !== 'undefined') {
            fetch(url, { method: 'GET', keepalive: true }).catch(() => {});
        }
    } catch (e) {
        // Beacon must never throw out — telemetry failure should not break the app.
    }
}

// --- Convenience helpers for common events ---

export function beaconPageLoad() {
    const nav = (performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {};
    beacon('page_load', {
        navigationStartMs: 0,
        domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd || 0),
        bundleParsedMs: Math.round(performance && performance.now ? performance.now() : 0),
        reactMountedMs: Math.round(performance && performance.now ? performance.now() : 0),
    });
}

export function beaconCardsRendered({ cardCount, totalCountFromApi, fetchDurationMs, timeToFirstCardMs, endpointUsed }) {
    const isPartialLoad = typeof endpointUsed === 'string' && endpointUsed.indexOf('partialLoadCount') !== -1;
    beacon('cards_rendered', {
        cardCount,
        totalCountFromApi,
        fetchDurationMs,
        timeToFirstCardMs,
        endpointUsed,
        isPartialLoad,
    });
}

// --- Assertion debounce ---
let _assertionTimeoutId = null;

/**
 * Schedule a single assertions beacon. If called multiple times within `delayMs`,
 * only the LAST scheduled call actually fires — debounce. Prevents duplicate
 * assertion beacons when CaaS does multi-phase fetches (partial load + full load
 * each trigger setCards, and we don't need two assertion beacons reporting the
 * same DOM state).
 */
export function scheduleAssertions(delayMs = 800) {
    if (typeof window === 'undefined') return;
    if (_assertionTimeoutId) {
        clearTimeout(_assertionTimeoutId);
    }
    _assertionTimeoutId = setTimeout(() => {
        _assertionTimeoutId = null;
        try {
            beaconAssertions(runCaasAssertions());
        } catch (e) { /* swallow */ }
    }, delayMs);
}

export function beaconTargetMissing({ reason, endpointUsed, httpStatus }) {
    beacon('target_missing', { reason, endpointUsed, httpStatus });
}

export function beaconFetchFail({ url, method, httpStatus, responseTimeMs, errorMessage }) {
    beacon('fetch_fail', { url, method, httpStatus, responseTimeMs, errorMessage });
}

export function beaconAssertions(checks) {
    beacon('assertions', checks);
}

/**
 * Run DOM-based assertions about CaaS render state.
 * Pure observation — no config dependency. The Rundeck comparison job
 * computes presence-rate deltas across cohorts to detect regressions
 * (e.g., canary's filter panel present rate drops from 100% to 75%
 * vs stable's 100% on the same page → regression).
 */
export function runCaasAssertions() {
    if (typeof document === 'undefined') return {};

    const doc = document;
    const container = doc.querySelector('.consonant-Wrapper, .consonant-CardsGrid');
    const containerPresent = !!container;
    const containerHasChildren = container ? container.children.length > 0 : false;

    // Card visibility check
    const cards = [...doc.querySelectorAll('.consonant-Card')];
    const cardCount = cards.length;
    let visibleCardCount = 0;
    cards.forEach((el) => {
        try {
            const rect = el.getBoundingClientRect();
            const cs = window.getComputedStyle(el);
            const visible = rect.width > 0 && rect.height > 0
                && cs.opacity !== '0'
                && cs.display !== 'none'
                && cs.visibility !== 'hidden';
            if (visible) visibleCardCount += 1;
        } catch (e) { /* skip this card */ }
    });
    const allCardsVisible = cardCount > 0 ? visibleCardCount === cardCount : null;

    // Component presence (mount checks — does the DOM contain it?)
    const filterPanelLeftPresent = !!doc.querySelector('.consonant-LeftFilters');
    const filterPanelTopPresent = !!doc.querySelector('.consonant-TopFilters');
    const filterPanelPresent = filterPanelLeftPresent || filterPanelTopPresent;
    const sortPresent = !!doc.querySelector('.consonant-Select-btn');
    const searchPresent = !!doc.querySelector('.consonant-Search');
    const paginatorPresent = !!doc.querySelector('.consonant-Pagination');
    const loadMorePresent = !!doc.querySelector('.consonant-LoadMore');

    // Loader: is the spinner still visible after render?
    let loaderStillVisible = false;
    const loaderEl = doc.querySelector('[class*="oader"]'); // Loader or loader
    if (loaderEl) {
        try {
            const rect = loaderEl.getBoundingClientRect();
            const cs = window.getComputedStyle(loaderEl);
            loaderStillVisible = rect.height > 0
                && cs.display !== 'none'
                && cs.visibility !== 'hidden';
        } catch (e) { /* swallow */ }
    }

    // Error UI
    const errorUiPresent = !!doc.querySelector(
        '[data-react-error], .error-boundary, .consonant-Error, .consonant-FailedRequest',
    );

    return {
        containerPresent,
        containerHasChildren,
        cardCount,
        visibleCardCount,
        allCardsVisible,
        filterPanelPresent,
        filterPanelLeftPresent,
        filterPanelTopPresent,
        sortPresent,
        searchPresent,
        paginatorPresent,
        loadMorePresent,
        loaderStillVisible,
        errorUiPresent,
    };
}

// --- Internal error handlers ---

function handleWindowError(evt) {
    try {
        beacon('error', {
            message: (evt && evt.message) ? String(evt.message).slice(0, 500) : 'unknown',
            errorType: (evt && evt.error && evt.error.name) || 'Error',
            source: evt && evt.filename ? evt.filename.split('/').pop() : 'unknown',
            lineNumber: evt && typeof evt.lineno === 'number' ? evt.lineno : 0,
            columnNumber: evt && typeof evt.colno === 'number' ? evt.colno : 0,
            stackTrace: evt && evt.error && evt.error.stack ? String(evt.error.stack).slice(0, 1500) : '',
        });
    } catch (e) { /* swallow */ }
}

function handleUnhandledRejection(evt) {
    try {
        const reason = evt && evt.reason;
        const msg = (reason && reason.message) ? reason.message : String(reason || 'unknown');
        beacon('error', {
            message: msg.slice(0, 500),
            errorType: (reason && reason.name) || 'UnhandledRejection',
            source: 'promise',
            lineNumber: 0,
            columnNumber: 0,
            stackTrace: reason && reason.stack ? String(reason.stack).slice(0, 1500) : '',
        });
    } catch (e) { /* swallow */ }
}

// --- Debug helper ---
// window.__CAAS_BEACON_TAP__ is populated by beacon() (above) with the last 50 payloads.
// Useful for inspecting what was sent without going to Splunk:
//     console.log(window.__CAAS_BEACON_TAP__)
//
// The tap is populated unconditionally (cost is negligible). It's per-page-load
// and lost on navigation.
