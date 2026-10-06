// Temporary, opt-in transport smoke test. This is not a canary traffic allocator.
const EVENTS = ['collection_started', 'collection_ready', 'collection_failed'];
let pageAttempts = 0;
let collectionSequence = 0;

export default function createLanaSmokeLogger() {
    const sent = new Set();
    let collection;

    return (event, cardCount) => {
        try {
            const run = new URLSearchParams(globalThis.location.search).get('caas_log_poc');
            const consent = (globalThis.OnetrustActiveGroups || '').split(',').includes('C0002');
            if (!run || !/^smoke-[a-z0-9_-]{1,40}$/i.test(run) || !consent
                || !EVENTS.includes(event) || sent.has(event) || pageAttempts >= 12) return;

            // Bound traffic even if several collections mount, retry, or rerender.
            sent.add(event);
            pageAttempts += 1;
            if (!collection) collection = ++collectionSequence;
            const message = {
                marker: 'caas_lana_poc_v1', run, collection, event,
            };
            if (event === 'collection_ready' && Number.isSafeInteger(cardCount) && cardCount >= 0) {
                message.cardCount = cardCount;
            }
            // Match LANA's GET query protocol. No page URL, card content, or error text.
            const query = new URLSearchParams({
                m: JSON.stringify(message),
                c: 'chimera',
                s: '100',
                t: 'e',
                r: event === 'collection_failed' ? 'error' : 'info',
                tags: 'caas_lana_poc_v1',
            });
            // An opaque response is NOT proof of ingestion; verify the run in Splunk.
            Promise.resolve(globalThis.fetch(`https://www.adobe.com/lana/ll?${query}`, {
                method: 'GET',
                mode: 'no-cors',
                credentials: 'omit',
                referrerPolicy: 'no-referrer',
                keepalive: true,
            })).catch(() => {});
        } catch (error) {
            // Logging must never interrupt card loading, even if the transport throws.
        }
    };
}
