/* eslint-env mocha */
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const config = require('../../react/src/js/components/Consonant/Testing/Mocks/config.json');
const cards = require('../../react/src/js/components/Consonant/Testing/Mocks/cards.json');

// Exercise the built collection, not a second implementation of its logger.
// Stub only LANA transport so CI never sends synthetic production records.
describe('CaaS telemetry integration', () => {
    let server;
    let origin;
    before(async () => {
        server = http.createServer((req, res) => {
            const url = new URL(req.url, 'http://localhost');
            if (url.pathname === '/main.js') {
                res.setHeader('Content-Type', 'text/javascript');
                res.end(fs.readFileSync(path.resolve(__dirname, '../../dist/main.min.js')));
                return;
            }
            if (['/cards', '/fallback'].includes(url.pathname)) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = url.searchParams.has('fail') ? 503 : 200;
                res.end(JSON.stringify({ cards }));
                return;
            }
            const failure = url.searchParams.has('failure');
            const cfg = JSON.parse(JSON.stringify(config));
            cfg.collection.endpoint = `/cards${failure ? '?fail' : ''}`;
            cfg.collection.fallbackEndpoint = `/fallback${failure ? '?fail' : ''}`;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<html><body><div id="cards"></div><div id="second"></div><script>
                window.digitalData={};window.OnetrustActiveGroups=${url.searchParams.has('noConsent') ? "''" : "',C0002,'"};
                ${url.searchParams.has('brokenConsent') ? `delete window.OnetrustActiveGroups;window.adobePrivacy={activeCookieGroups:()=>{throw new Error('consent unavailable');}};` : ''}
                window.events=[];const original=window.fetch;
                window.fetch=(url,opts)=>{if(String(url).includes('/lana/ll?')) {
                    events.push(JSON.parse(new URL(url).searchParams.get('m')));
                    return Promise.reject(new Error('Logging intentionally blocked'));
                }return original(url,opts);};
                </script><script src="/main.js"></script><script>
                new window.ConsonantCardCollection(${JSON.stringify(cfg)},document.querySelector('#cards'));
                ${url.searchParams.has('multiple') ? `new window.ConsonantCardCollection(${JSON.stringify({ ...cfg, collection: { ...cfg.collection, endpoint: '/cards?fail', fallbackEndpoint: '/fallback?fail' } })},document.querySelector('#second'));` : ''}
                </script></body></html>`);
        });
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        origin = `http://127.0.0.1:${server.address().port}`;
    });
    after(async () => { await new Promise(resolve => server.close(resolve)); });

    it('renders cards even when logging fails and includes build, count and timing', async () => {
        await browser.url(`${origin}/?caas_log_poc=smoke-e2e`);
        await browser.waitUntil(async () => browser.execute(() => window.events.some(e => e.event === 'collection_rendered')));
        const events = await browser.execute(() => window.events.filter(e => ['collection_started','collection_ready','collection_rendered','collection_fallback','collection_failed'].includes(e.event)));
        assert.deepStrictEqual(events.map(e => e.event), ['collection_started', 'collection_ready', 'collection_rendered']);
        assert.ok(events[1].cardCount > 0);
        assert.ok(events[1].durationMs >= 0);
        assert.notStrictEqual(events[1].release, 'development');
        assert.match(events[1].build, /^[a-f0-9]{12}$/);
        assert.strictEqual(events[1].mode, 'test');
        assert.ok((await $('#cards').getText()).includes('Your Top Picks'));
    });
    it('reports failure only after both card sources fail', async () => {
        await browser.url(`${origin}/?caas_log_poc=smoke-e2e-failure&failure`);
        await browser.waitUntil(async () => browser.execute(() => window.events.some(e => e.event === 'collection_failed')));
        const events = await browser.execute(() => window.events.filter(e => ['collection_started','collection_ready','collection_rendered','collection_fallback','collection_failed'].includes(e.event)));
        assert.deepStrictEqual(events.map(e => e.event), ['collection_started', 'collection_fallback', 'collection_failed']);
        assert.strictEqual(events[2].fallback, true);
        assert.ok((await $('#cards').getText()).includes('system error'));
    });
    it('correlates two collections and reconstructs their actual configs', async () => {
        await browser.url(`${origin}/?caas_log_poc=smoke-multiple&multiple`);
        await browser.waitUntil(async () => browser.execute(() => window.events.some(e => e.event === 'collection_failed') && window.events.some(e => e.event === 'collection_rendered')));
        const events = await browser.execute(() => window.events.filter(e => e.marker === 'caas_telemetry_v2'));
        assert.strictEqual(new Set(events.map(e => e.pageVisitId)).size, 1);
        const contexts = events.filter(e => e.event === 'collection_context');
        assert.strictEqual(contexts.length, 2);
        assert.notStrictEqual(contexts[0].collectionId, contexts[1].collectionId);
        const failure = events.find(e => e.event === 'collection_failed');
        assert.strictEqual(failure.collectionId, contexts[1].collectionId);
        const requestFailure = events.find(e => e.event === 'request_failed');
        assert.strictEqual(requestFailure.error.status, 503);
        assert.strictEqual(requestFailure.error.kind, 'http');
        assert.ok(events.some(e => e.event === 'request_started' && e.collectionId === requestFailure.collectionId && e.requestId === requestFailure.requestId));
        for (const context of contexts) {
            const parts = events.filter(e => e.event === 'config_part' && e.configId === context.configId).sort((a,b) => a.part-b.part);
            assert.strictEqual(parts.length, parts[0].totalParts);
            const snapshot = JSON.parse(parts.map(e => e.data).join(''));
            assert.strictEqual(snapshot.collection.resultsPerPage, config.collection.resultsPerPage);
            assert.ok(context.browser);
            assert.ok(!context.page.includes('?'));
        }
    });
    for (const scenario of ['noConsent', 'brokenConsent']) {
        it(`sends linked config, URL and outcomes with ${scenario}`, async () => {
            await browser.url(`${origin}/?caas_log_poc=smoke-e2e&${scenario}`);
            await browser.waitUntil(async () => browser.execute(() => window.events.some(e => e.event === 'collection_rendered')));
            const events = await browser.execute(() => window.events);
            const context = events.find(e => e.event === 'collection_context');
            assert.strictEqual(context.page, `${origin}/`);
            assert.strictEqual(context.analyticsConsent, scenario === 'noConsent' ? 'disabled' : 'unknown');
            if (scenario === 'brokenConsent') assert.strictEqual(context.consentApiState, 'error');
            const parts = events.filter(e => e.event === 'config_part' && e.configId === context.configId).sort((a,b) => a.part-b.part);
            const snapshot = JSON.parse(parts.map(e => e.data).join(''));
            assert.strictEqual(snapshot.collection.resultsPerPage, config.collection.resultsPerPage);
            const outcome = events.find(e => e.event === 'collection_rendered');
            assert.strictEqual(outcome.pageVisitId, context.pageVisitId);
            assert.strictEqual(outcome.collectionId, context.collectionId);
            assert.ok(outcome.cardCount > 0);
            assert.ok((await $('#cards').getText()).includes('Your Top Picks'));
        });
    }
});
