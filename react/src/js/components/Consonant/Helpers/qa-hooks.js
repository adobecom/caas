/**
 * QA hooks: structured introspection for headless agents.
 *
 * Exposes a small, stable API on `window.caas` that AI-driven browser
 * agents can call instead of guessing CSS selectors or scraping innerText.
 * The goals are:
 *   - Tell the agent when the collection is actually rendered (ready signal).
 *   - Hand the agent a structured snapshot of cards, filters, search, and sort
 *     so the LLM never has to author selectors.
 *   - Stay out of the way of normal users (no UI changes, no telemetry side
 *     effects, no console noise).
 *
 * Wiring:
 *   - `initQaHooks()` runs once at boot from app.jsx. Idempotent.
 *   - `markCaasReady(detail)` is called from Container.jsx after setCards.
 *     Multiple fetches (partial + full load) will fire it more than once;
 *     the latest call wins.
 *
 * Surface area:
 *   window.__caasReady           : boolean flag, true after first ready signal
 *   window.__caasReadyDetail     : { cardCount, totalCountFromApi, ts, ... }
 *   window.caas.version          : package.json version baked at build time
 *   window.caas.dump()           : structured snapshot (see shape below)
 *   window.caas.waitForReady(ms) : Promise that resolves on caas:ready
 *   CustomEvent('caas:ready')    : window-level event, detail mirrors flag
 *
 * Dump shape (deliberately flat and stable):
 *   {
 *     version, url, ts, ready, cardCount,
 *     cards: [{ id, title, description, image, ctaText, ctaHref, badges, style }],
 *     search: { present, value, placeholder, ariaLabel },
 *     filters: { panel: 'left'|'top'|null, groups: [{ name, items: [{ label, selected }] }] },
 *     sort: { present, label, value },
 *     pagination: { type, currentPage, totalPages },
 *     consoleErrors: number   (only populated if a listener was installed)
 *   }
 */

/* eslint-disable */

// Baked at build time by webpack DefinePlugin if available, else 'unknown'.
const PKG_VERSION =
    (typeof process !== 'undefined' && process.env && process.env.CAAS_VERSION) || 'unknown';

let initialized = false;
let readyResolvers = [];

function safeText(el) {
    if (!el) return '';
    return (el.textContent || '').trim().replace(/\s+/g, ' ');
}

function safeAttr(el, attr) {
    if (!el) return '';
    return el.getAttribute(attr) || '';
}

function dumpCards() {
    const nodes = document.querySelectorAll('[data-testid="consonant-Card"]');
    return Array.from(nodes).map((node) => {
        const heading =
            node.querySelector('.consonant-Card-title, h2, h3, h4, h5, h6') || null;
        const desc = node.querySelector('.consonant-Card-text, p') || null;
        const img = node.querySelector('img') || null;
        const cta =
            node.querySelector('.consonant-BtnInfobit, a[href]') || null;
        const badges = Array.from(
            node.querySelectorAll('.consonant-Card-badge, [class*="badge"]'),
        ).map(safeText).filter(Boolean);

        return {
            id: node.id || null,
            style:
                Array.from(node.classList).find((c) =>
                    /^(one-half|full-card|half-height|blog-card|news-card|product|three-fourths|double-wide|editorial|horizontal|icon|blade|text-card)/.test(c),
                ) || null,
            title: safeText(heading),
            description: safeText(desc).slice(0, 280),
            image: safeAttr(img, 'src') || safeAttr(img, 'data-src'),
            ctaText: safeText(cta),
            ctaHref: safeAttr(cta, 'href'),
            badges,
        };
    });
}

function dumpSearch() {
    const input = document.querySelector('[data-testid="consonant-Search-input"]');
    if (!input) return { present: false };
    return {
        present: true,
        value: input.value || '',
        placeholder: input.getAttribute('placeholder') || '',
        ariaLabel: input.getAttribute('aria-label') || '',
    };
}

function dumpFilters() {
    // Selectors match the actual data-testid surface in Consonant/Filters.
    const leftPanel = document.querySelector('[data-testid="consonant-LeftFilters"]');
    const topPanel  = document.querySelector('[data-testid="consonant-TopFilter"]');
    const panel = leftPanel ? 'left' : (topPanel ? 'top' : null);
    const root = leftPanel || topPanel;
    if (!root) return { panel: null, groups: [] };

    // Each filter group is its own LeftFilter / TopFilter node, with a -name
    // child for the heading and -itemsItemCheckbox / -itemCheckbox inputs.
    const groupSel = panel === 'left'
        ? '[data-testid="consonant-LeftFilter"]'
        : '[data-testid="consonant-TopFilter"]';
    const itemBoxSel = panel === 'left'
        ? '[data-testid="consonant-LeftFilter-itemsItemCheckbox"]'
        : '[data-testid="consonant-TopFilter-itemCheckbox"]';

    const groupNodes = root.querySelectorAll(groupSel);
    const groups = Array.from(groupNodes).map((g) => {
        const nameNode =
            g.querySelector('[data-testid="consonant-LeftFilter-name"]') ||
            g.querySelector('button[aria-expanded], h3, h4');
        const itemNodes = g.querySelectorAll(itemBoxSel);
        const items = Array.from(itemNodes).map((i) => {
            const labelEl =
                (i.id && document.querySelector(`label[for="${i.id}"]`)) ||
                i.closest('label') ||
                i.parentElement;
            return {
                label: safeText(labelEl) || i.getAttribute('aria-label') || '',
                selected: !!i.checked,
            };
        });
        return { name: safeText(nameNode), items };
    });
    return { panel, groups };
}

function dumpSort() {
    const btn = document.querySelector('[data-testid="consonant-Select-btn"]');
    if (!btn) return { present: false };
    // The sort widget renders the visible "Sort by:" label next to the
    // button after the mwpw-177207 fix; capture both.
    const label = safeText(btn.previousElementSibling) || safeText(btn.parentElement);
    return {
        present: true,
        label,
        value: safeText(btn),
        ariaLabel: btn.getAttribute('aria-label') || '',
    };
}

function dumpPagination() {
    const loadMore = document.querySelector('[data-testid="consonant-LoadMore-btn"]');
    if (loadMore) {
        return {
            type: 'loadMore',
            buttonLabel: safeText(loadMore),
            disabled: loadMore.disabled || loadMore.getAttribute('aria-disabled') === 'true',
        };
    }
    const paginatorBtns = document.querySelectorAll('[data-testid="consonant-Pagination-itemBtn"]');
    const summary = document.querySelector('[data-testid="consonant-Pagination-summary"]');
    if (paginatorBtns.length || summary) {
        const active = Array.from(paginatorBtns).find(
            (b) => b.getAttribute('aria-current') === 'true' ||
                   b.classList.contains('consonant-Pagination-itemBtn--active'),
        );
        return {
            type: 'paginator',
            currentPage: active ? safeText(active) : null,
            totalPages: paginatorBtns.length || null,
            summary: safeText(summary),
        };
    }
    return { type: 'none' };
}

function dump() {
    const ready = !!window.__caasReady;
    const cards = dumpCards();
    return {
        version: PKG_VERSION,
        url: window.location.href,
        ts: Date.now(),
        ready,
        cardCount: cards.length,
        cards,
        search: dumpSearch(),
        filters: dumpFilters(),
        sort: dumpSort(),
        pagination: dumpPagination(),
    };
}

/**
 * Resolves on the next caas:ready event, or immediately if already ready.
 * Times out by rejecting after ms milliseconds; default 10000.
 */
function waitForReady(ms) {
    const timeoutMs = typeof ms === 'number' ? ms : 10000;
    if (window.__caasReady) return Promise.resolve(window.__caasReadyDetail || {});
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            const idx = readyResolvers.indexOf(resolve);
            if (idx >= 0) readyResolvers.splice(idx, 1);
            reject(new Error(`caas:ready timeout after ${timeoutMs}ms`));
        }, timeoutMs);
        readyResolvers.push((detail) => {
            clearTimeout(timer);
            resolve(detail);
        });
    });
}

/**
 * Mark the CaaS collection as rendered. Called from Container.jsx
 * immediately after setCards. React 16 commits asynchronously, so we defer
 * the public ready signal until the DOM actually contains the expected
 * number of card nodes. This guarantees that subscribers calling
 * window.caas.dump() inside their ready handler see the cards.
 *
 * The detail.cardCount supplied by the caller is the React-state count.
 * We poll for [data-testid="consonant-Card"] to reach that number, then
 * fire. If the DOM never settles within the cap (e.g. the render path
 * crashed downstream), we fire anyway after the cap so the signal isn't
 * silenced -- readers can compare detail.cardCount to dump().cardCount to
 * detect that discrepancy.
 */
export function markCaasReady(detail) {
    // Diagnostic markers (visible via window.__caasReadyTrace) so external
    // verifiers can tell whether this function was called at all and where
    // the deferred poll landed.
    try {
        window.__caasReadyTrace = window.__caasReadyTrace || [];
        window.__caasReadyTrace.push({ ev: 'called', ts: Date.now(), detail });
    } catch (e) { /* swallow */ }

    const enriched = Object.assign({ ts: Date.now() }, detail || {});
    const expected = Number(enriched.cardCount) || 0;
    const startedAt = Date.now();
    const capMs = 5000;
    const pollMs = 25;

    function fire() {
        try {
            window.__caasReady = true;
            window.__caasReadyDetail = Object.assign({}, enriched, {
                domCardCount: document.querySelectorAll('[data-testid="consonant-Card"]').length,
                committedMs: Date.now() - startedAt,
            });
            window.__caasReadyTrace.push({ ev: 'fired', ts: Date.now(), domCount: window.__caasReadyDetail.domCardCount });
        } catch (e) { /* sealed window in tests */ }

        const waiters = readyResolvers;
        readyResolvers = [];
        waiters.forEach((fn) => {
            try { fn(window.__caasReadyDetail); } catch (e) { /* swallow */ }
        });

        try {
            window.dispatchEvent(
                new CustomEvent('caas:ready', { detail: window.__caasReadyDetail }),
            );
        } catch (e) { /* polyfill issue */ }
    }

    function check() {
        const have = document.querySelectorAll('[data-testid="consonant-Card"]').length;
        try { window.__caasReadyTrace.push({ ev: 'check', ts: Date.now(), have, expected }); } catch (e) {}
        if (have >= expected || Date.now() - startedAt > capMs) {
            fire();
            return;
        }
        setTimeout(check, pollMs);
    }

    // setTimeout is more reliable than requestAnimationFrame here:
    // rAF callbacks are throttled or skipped when the tab is not in the
    // foreground, which the verifier hits whenever Playwright/MCP focuses
    // devtools or another window. setTimeout fires regardless.
    setTimeout(check, 0);
}

/**
 * Mount window.caas with the introspection API. Idempotent.
 */
export function initQaHooks() {
    if (initialized) return;
    initialized = true;
    try {
        window.caas = window.caas || {};
        Object.assign(window.caas, {
            version: PKG_VERSION,
            dump,
            waitForReady,
        });
    } catch (e) { /* swallow */ }
}

export default initQaHooks;
