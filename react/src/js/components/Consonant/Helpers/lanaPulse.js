// Small operational pulse: one sampling decision and at most two requests per page.
const KEY = Symbol.for('caas.pulse.v1');
const SAMPLE_RATE = 10;

export function consentStatus() {
    const raw = globalThis.OnetrustActiveGroups;
    let rawFlag = 'missing';
    if (typeof raw === 'string') rawFlag = raw.split(',').includes('C0002') ? 'enabled' : 'disabled';
    let consentApiState = 'missing';
    try {
        const privacy = globalThis.adobePrivacy;
        if (privacy && typeof privacy.activeCookieGroups === 'function') {
            consentApiState = 'invalid_response';
            const groups = privacy.activeCookieGroups();
            if (Array.isArray(groups)) {
                return { analyticsConsent: groups.includes('C0002') ? 'enabled' : 'disabled',
                    consentSource: 'adobePrivacy',
                    consentApiState: 'available',
rawFlag };
            }
        }
    } catch (error) { consentApiState = 'error'; }
    return { analyticsConsent: rawFlag === 'missing' ? 'unknown' : rawFlag,
        consentSource: rawFlag === 'missing' ? 'unavailable' : 'onetrust',
        consentApiState,
rawFlag };
}

export function pulseState() { return globalThis[KEY]; }

function send(page, phase) {
    try {
        const message = { marker: 'caas_pulse_v1',
            release: process.env.CAAS_RELEASE_VERSION || 'development',
            build: process.env.CAAS_BUILD_COMMIT || 'unknown',
            mode: page.run ? 'test' : 'sample',
sampleRate: page.run ? 100 : SAMPLE_RATE,
            phase,
...consentStatus(),
            collectionsStarted: page.started,
collectionsRendered: page.rendered,
            collectionsFailed: page.failed,
...(page.run ? { run: page.run } : {}) };
        const query = new URLSearchParams({ m: JSON.stringify(message),
c: 'chimera',
            s: String(message.sampleRate),
t: 'e',
r: 'info',
tags: message.marker });
        // This consent-state diagnostic is deliberately independent of analytics consent.
        // No cookies, URL, config, visitor/session ID or error text are included.
        Promise.resolve(globalThis.fetch(`https://www.adobe.com/lana/ll?${query}`, {
            method: 'GET',
mode: 'no-cors',
credentials: 'omit',
            referrerPolicy: 'no-referrer',
keepalive: true,
        })).catch(() => {});
    } catch (error) { /* Diagnostics must never break card rendering. */ }
}

export default function createLanaSmokeLogger() {
    const seen = new Set();
    return (event) => {
        try {
            if (!['collection_started', 'collection_rendered', 'collection_failed'].includes(event)
                || seen.has(event)) return;
            seen.add(event);
            if (!globalThis[KEY]) {
                const value = new URLSearchParams(globalThis.location.search).get('caas_log_poc');
                const run = /^smoke-[a-z0-9_-]{1,40}$/i.test(value || '') ? value : null;
                globalThis[KEY] = { run,
sampled: !!run || Math.random() < SAMPLE_RATE / 100,
                    started: 0,
rendered: 0,
failed: 0,
sent: false };
            }
            const page = globalThis[KEY];
            if (!page.sampled) return;
            if (event === 'collection_started') page.started += 1;
            if (event === 'collection_rendered') page.rendered += 1;
            if (event === 'collection_failed') page.failed += 1;
            if (!page.sent) {
                page.sent = true;
                send(page, 'initial');
                globalThis.setTimeout(() => send(page, 'after_10s'), 10000);
            }
        } catch (error) { /* Diagnostics must never break card rendering. */ }
    };
}
