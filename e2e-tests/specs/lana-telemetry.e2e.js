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
                res.end(url.searchParams.has('badJson') ? '{not-json' : JSON.stringify({ cards: url.searchParams.has('empty') ? [] : cards }));
                return;
            }
            const failure = url.searchParams.has('failure');
            const cfg = JSON.parse(JSON.stringify(config));
            const suffix = failure ? '?fail' : url.searchParams.has('badJson') ? '?badJson' : url.searchParams.has('empty') ? '?empty' : '';
            cfg.collection.endpoint = `/cards${suffix}`;
            cfg.collection.fallbackEndpoint = `/fallback${suffix}`;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<html><head><style>[data-testid="consonant-Card"]{display:block;width:200px;min-height:100px} ${url.searchParams.has('hidden') ? '#cards{display:none}' : ''}</style></head><body><div id="cards"></div><div id="second"></div><script>
                window.digitalData={};window.OnetrustActiveGroups=${url.searchParams.has('noConsent') ? "''" : "',C0002,'"};
                ${url.searchParams.has('brokenConsent') ? `delete window.OnetrustActiveGroups;window.adobePrivacy={activeCookieGroups:()=>{throw new Error('consent unavailable');}};` : ''}
                window.events=[];const original=window.fetch;
                window.fetch=(url,opts)=>{if(String(url).includes('/lana/ll?')) {
                    events.push(JSON.parse(new URL(url).searchParams.get('m')));
                    return Promise.reject(new Error('Logging intentionally blocked'));
                }${url.searchParams.has('network') ? `if(/^\\/(cards|fallback)/.test(String(url)))return Promise.reject(new TypeError('Test network rejection'));` : ''}return original(url,opts);};
                </script><script src="/main.js"></script><script>
                new window.ConsonantCardCollection(${JSON.stringify(cfg)},document.querySelector('#cards'));
                ${url.searchParams.has('multiple') ? `new window.ConsonantCardCollection(${JSON.stringify({ ...cfg, collection: { ...cfg.collection, endpoint: '/cards?fail', fallbackEndpoint: '/fallback?fail' } })},document.querySelector('#second'));` : ''}
                </script></body></html>`);
        });
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        origin = `http://127.0.0.1:${server.address().port}`;
    });
    after(async () => {
        server.closeAllConnections();
        await new Promise(resolve => server.close(resolve));
    });
    afterEach(async function saveLocalEvidence() {
        if (!process.env.CAAS_TELEMETRY_EVIDENCE_DIR) return;
        const events = await browser.execute(() => window.events || []);
        const directory = process.env.CAAS_TELEMETRY_EVIDENCE_DIR;
        fs.mkdirSync(directory, { recursive: true });
        const name = this.currentTest.title.replace(/[^a-z0-9]+/gi, '-');
        fs.writeFileSync(path.join(directory, `${name}.json`), JSON.stringify({
            test: this.currentTest.title, state: this.currentTest.state, events,
        }, null, 2));
    });

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
    for (const scenario of ['normal', 'hidden', 'empty', 'badJson', 'network']) {
        it(`classifies ${scenario} in the built bundle with a unique test run`, async () => {
            await browser.url(`${origin}/?caas_log_poc=smoke-${scenario}&${scenario}`);
            const expected = scenario === 'empty' ? 'collection_empty'
                : ['badJson', 'network'].includes(scenario) ? 'collection_failed' : 'collection_dom';
            await browser.waitUntil(async () => browser.execute(event => window.events.some(e => e.event === event), expected));
            const events = await browser.execute(() => window.events);
            const outcome = events.find(e => e.event === expected);
            assert.strictEqual(outcome.run, `smoke-${scenario}`);
            assert.strictEqual(outcome.mode, 'test');
            assert.strictEqual(outcome.sampleRate, 100);
            assert.ok(events.some(e => e.event === 'collection_context' && e.collectionId === outcome.collectionId && e.pageVisitId === outcome.pageVisitId));
            if (scenario === 'normal') {
                assert.strictEqual(outcome.domStatus, 'present');
                assert.ok(outcome.displayedCardCount > 0);
                assert.ok(await $('#cards [data-testid="consonant-Card"]').isDisplayed());
            }
            if (scenario === 'hidden') {
                assert.strictEqual(outcome.domStatus, 'hidden');
                assert.strictEqual(outcome.displayedCardCount, 0);
            }
            if (scenario === 'empty') assert.strictEqual(outcome.cardCount, 0);
            if (['badJson', 'network'].includes(scenario)) {
                const failure = events.find(e => e.event === 'request_failed');
                assert.strictEqual(failure.error.kind, scenario === 'badJson' ? 'parse' : 'network');
                assert.strictEqual(failure.endpoint, `${origin}/cards`);
                assert.strictEqual(failure.collectionId, outcome.collectionId);
                if (scenario === 'badJson') assert.strictEqual(failure.error.status, 200);
            }
        });
    }
    it('normal visit sends no diagnostics with the default-off build', async () => {
        await browser.url(`${origin}/`);
        await browser.waitUntil(async () => (await $('#cards').getText()).includes('Your Top Picks'));
        assert.deepStrictEqual(await browser.execute(() => window.events), []);
    });

});
