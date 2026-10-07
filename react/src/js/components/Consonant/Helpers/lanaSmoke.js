// One sampling decision per bundle/page; no persistent visitor identifiers.
const EVENTS = ['collection_started', 'collection_ready', 'collection_rendered',
    'collection_failed', 'collection_fallback', 'runtime_error', 'unhandled_rejection'];
let pageAttempts = 0;
let collectionSequence = 0;
let sampled;
let errorsInstalled = false;
const bundleUrl = globalThis.document && globalThis.document.currentScript
    ? globalThis.document.currentScript.src : '';

export default function createLanaSmokeLogger() {
    const sent = new Set();
    let collection;
    let started;
    let usedFallback = false;

    const log = (event, cardCount) => {
        try {
            const run = new URLSearchParams(globalThis.location.search).get('caas_log_poc');
            const consent = (globalThis.OnetrustActiveGroups || '').split(',').includes('C0002');
            if (!consent || !EVENTS.includes(event) || sent.has(event) || pageAttempts >= 12) return;
            // Invalid test labels cannot enable telemetry or enter the payload.
            if (run !== null && !/^smoke-[a-z0-9_-]{1,40}$/i.test(run)) return;
            if (sampled === undefined) sampled = Math.random() < 0.01;
            if (!run && !sampled) return;
            if (event === 'collection_started') started = Date.now();
            if (event === 'collection_fallback') usedFallback = true;
            sent.add(event);
            pageAttempts += 1;
            if (!collection) collection = ++collectionSequence;
            const message = {
                marker: 'caas_telemetry_v1',
                release: process.env.CAAS_RELEASE_VERSION || 'development',
                build: process.env.CAAS_BUILD_COMMIT || 'unknown',
                mode: run ? 'test' : 'sample',
                sampleRate: run ? 100 : 1,
                collection,
                event,
            };
            const isRuntimeError = ['runtime_error', 'unhandled_rejection'].includes(event);
            if (isRuntimeError) delete message.collection;
            if (run) message.run = run;
            if (!isRuntimeError && started !== undefined && event !== 'collection_started') {
                message.durationMs = Math.max(0, Date.now() - started);
                message.fallback = usedFallback;
            }
            if (['collection_ready', 'collection_rendered'].includes(event)
                && Number.isSafeInteger(cardCount) && cardCount >= 0) message.cardCount = cardCount;
            const query = new URLSearchParams({
                m: JSON.stringify(message),
c: 'chimera',
s: String(message.sampleRate),
t: 'e',
                r: ['collection_failed', 'runtime_error', 'unhandled_rejection'].includes(event) ? 'error' : 'info',
                tags: 'caas_telemetry_v1',
            });
            Promise.resolve(globalThis.fetch(`https://www.adobe.com/lana/ll?${query}`, {
                method: 'GET',
mode: 'no-cors',
credentials: 'omit',
                referrerPolicy: 'no-referrer',
keepalive: true,
            })).catch(() => {});
            // Attribute only errors explicitly pointing at this loaded bundle.
            // Never send console arguments, error messages, stacks, or page URLs.
            if (!errorsInstalled && bundleUrl) {
                errorsInstalled = true;
                globalThis.addEventListener('error', (error) => {
                    if (error.filename === bundleUrl) log('runtime_error');
                });
                globalThis.addEventListener('unhandledrejection', (error) => {
                    if (error.reason && typeof error.reason.stack === 'string'
                        && error.reason.stack.includes(bundleUrl)) log('unhandled_rejection');
                });
            }
        } catch (error) {
            // Telemetry must never interrupt card loading.
        }
    };
    return log;
}
