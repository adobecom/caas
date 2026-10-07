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
            res.end(`<html><body><div id="cards"></div><script>
                window.digitalData={};window.OnetrustActiveGroups=${url.searchParams.has('noConsent') ? "''" : "',C0002,'"};
                window.events=[];const original=window.fetch;
                window.fetch=(url,opts)=>{if(String(url).includes('/lana/ll?')) {
                    events.push(JSON.parse(new URL(url).searchParams.get('m')));
                    return Promise.reject(new Error('Logging intentionally blocked'));
                }return original(url,opts);};
                </script><script src="/main.js"></script><script>
                new window.ConsonantCardCollection(${JSON.stringify(cfg)},document.querySelector('#cards'));
                </script></body></html>`);
        });
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        origin = `http://127.0.0.1:${server.address().port}`;
    });
    after(async () => { await new Promise(resolve => server.close(resolve)); });

    it('renders cards even when logging fails and includes build, count and timing', async () => {
        await browser.url(`${origin}/?caas_log_poc=smoke-e2e`);
        await browser.waitUntil(async () => browser.execute(() => window.events.some(e => e.event === 'collection_rendered')));
        const events = await browser.execute(() => window.events);
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
        const events = await browser.execute(() => window.events);
        assert.deepStrictEqual(events.map(e => e.event), ['collection_started', 'collection_fallback', 'collection_failed']);
        assert.strictEqual(events[2].fallback, true);
        assert.ok((await $('#cards').getText()).includes('system error'));
    });
    it('sends nothing without analytics consent while cards still render', async () => {
        await browser.url(`${origin}/?caas_log_poc=smoke-e2e&noConsent`);
        await browser.waitUntil(async () => (await $('#cards').getText()).includes('Your Top Picks'));
        assert.deepStrictEqual(await browser.execute(() => window.events), []);
    });
});
