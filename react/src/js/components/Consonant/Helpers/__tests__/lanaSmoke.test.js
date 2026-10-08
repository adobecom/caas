import { cleanConfig, cleanUrl } from '../lanaSmoke';

let createLogger;
const records = () => global.fetch.mock.calls.map(([url]) => JSON.parse(new URL(url).searchParams.get('m')));
const outcomes = () => records().filter(record => /^(collection|request)_/.test(record.event) && record.event !== 'collection_context');
const fresh = () => {
    delete window[Symbol.for('caas.telemetry.v2')];
    jest.isolateModules(() => {
        // eslint-disable-next-line global-require
        createLogger = require('../lanaSmoke').default;
    });
};
beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    fresh();
    window.history.replaceState({}, '', '/events?caas_log_poc=smoke-test');
    window.OnetrustActiveGroups = ',C0001,C0002,';
    global.fetch = jest.fn().mockResolvedValue({ type: 'opaque' });
});
afterEach(() => { jest.restoreAllMocks(); delete window[Symbol.for('caas.telemetry.v2')]; delete window.OnetrustActiveGroups; });

test.each(['', '?caas_log_poc=private@example.com', '?caas_log_poc=smoke-', `?caas_log_poc=smoke-${'x'.repeat(41)}`])('does not send for excluded or invalid visits %s', query => {
    window.history.replaceState({}, '', `/${query}`);
    createLogger()('collection_started');
    expect(global.fetch).not.toHaveBeenCalled();
});
test.each([undefined, '', ',C0001,', ',C00020,'])('requires consent %s', consent => {
    window.OnetrustActiveGroups = consent;
    createLogger()('collection_started');
    expect(global.fetch).not.toHaveBeenCalled();
});
test('links separate collections, deduplicates snapshots, and strips page queries', () => {
    const config = { collection: { layout: { type: '3up' }, resultsPerPage: 9 } };
    const first = createLogger(() => config);
    const second = createLogger(() => config);
    first('collection_started'); second('collection_started'); first('collection_ready', 22);
    expect(new Set(records().map(r => r.pageVisitId)).size).toBe(1);
    expect(records()[0].pageVisitId).toMatch(/^[a-f0-9]{32}$/);
    expect(records().filter(r => r.event === 'config_snapshot')).toHaveLength(1);
    expect(records().filter(r => r.event === 'collection_context').map(r => r.collectionId)).toEqual(['collection-1', 'collection-2']);
    expect(records().find(r => r.event === 'collection_context')).toMatchObject({ configId: 'config-1', page: 'http://localhost/events' });
    expect(outcomes()[2]).toMatchObject({ collectionId: 'collection-1', configId: 'config-1', cardCount: 22, release: 'development', build: 'unknown' });
    expect(records().filter(r => r.event === 'config_part').map(r => r.data).join('')).toBe(JSON.stringify(config));
    expect(global.fetch.mock.calls[0][1]).toEqual({ method: 'GET', mode: 'no-cors', credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true });
});
test('different configs stay distinct and chunks reconstruct Unicode and escaped strings', () => {
    const config = { labels: ['日本語 "label" \\'.repeat(80)] };
    createLogger(() => config)('collection_started');
    createLogger(() => ({ layout: 'other' }))('collection_started');
    const parts = records().filter(r => r.event === 'config_part' && r.configId === 'config-1');
    expect(parts.length).toBeGreaterThan(1);
    expect(JSON.parse(parts.sort((a, b) => a.part - b.part).map(r => r.data).join(''))).toEqual(config);
    expect(records().filter(r => r.event === 'config_snapshot')).toHaveLength(2);
    records().forEach(r => expect(Buffer.byteLength(JSON.stringify(r))).toBeLessThanOrEqual(1800));
});
test('one sampling decision for the page and a new ephemeral ID for a fresh page', () => {
    window.history.replaceState({}, '', '/'); Math.random.mockReturnValue(0.009);
    createLogger()('collection_started'); createLogger()('collection_started');
    expect(Math.random).toHaveBeenCalledTimes(1);
    const id = records()[0].pageVisitId;
    expect(records()[0]).toMatchObject({ mode: 'sample', sampleRate: 1 });
    expect(records()[0]).not.toHaveProperty('run');
    fresh(); createLogger()('collection_started');
    expect(records()[records().length - 1].pageVisitId).not.toBe(id);
});
test('does not resample excluded visits', () => {
    window.history.replaceState({}, '', '/'); Math.random.mockReturnValue(0.01);
    createLogger()('collection_started'); Math.random.mockReturnValue(0);
    createLogger()('collection_started'); expect(global.fetch).not.toHaveBeenCalled();
    expect(Math.random).toHaveBeenCalledTimes(1);
});
test('ties primary and fallback failures to separate requests and includes total elapsed time', () => {
    jest.spyOn(Date, 'now').mockReturnValue(100);
    const log = createLogger();
    log('collection_started'); log('request_started', { endpoint: '/cards?token=secret', source: 'primary' });
    Date.now.mockReturnValue(150); log('request_failed', { kind: 'http', status: 503, requestId: 'request-1' });
    log('collection_fallback'); log('collection_started');
    log('request_started', { endpoint: '/backup', source: 'fallback' });
    Date.now.mockReturnValue(250); log('request_failed', { kind: 'network', requestId: 'request-2' }); log('collection_failed');
    const failed = outcomes().filter(r => r.event === 'request_failed');
    expect(failed[0]).toMatchObject({ requestId: 'request-1', durationMs: 50, error: { kind: 'http', status: 503 } });
    expect(failed[1]).toMatchObject({ requestId: 'request-2', durationMs: 100, error: { kind: 'network' } });
    expect(outcomes().pop()).toMatchObject({ durationMs: 150, fallback: true });
    expect(JSON.stringify(records())).not.toContain('secret');
});
test('rechecks consent, deduplicates outcomes and bounds noisy collections', () => {
    const log = createLogger(); log('unknown'); log('collection_started'); log('collection_started');
    window.OnetrustActiveGroups = ''; log('collection_ready', 1);
    expect(outcomes()).toHaveLength(1);
    window.OnetrustActiveGroups = ',C0002,';
    for (let i = 0; i < 20; i += 1) log('request_started', { endpoint: '/cards' });
    expect(outcomes()).toHaveLength(8);
});
test('explicitly reports collection and config limits while preserving outcomes', () => {
    for (let i = 0; i < 12; i += 1) {
        const log = createLogger(() => ({ data: 'x'.repeat(13000), i }));
        log('collection_started'); log('collection_ready', 5);
    }
    expect(records().filter(r => r.event === 'collection_ready')).toHaveLength(8);
    expect(records().filter(r => r.event === 'config_snapshot').every(r => r.status === 'omitted')).toBe(true);
    expect(records().filter(r => r.event === 'telemetry_limit')).toHaveLength(1);
    expect(records().some(r => r.event === 'config_part')).toBe(false);
});
test('config budget does not swallow result records', () => {
    for (let i = 0; i < 4; i += 1) createLogger(() => ({ value: 'x'.repeat(9000), i }))('collection_ready', 1);
    expect(records().filter(r => r.event === 'config_part').length).toBeLessThanOrEqual(64);
    expect(outcomes()).toHaveLength(4);
    expect(records().some(r => r.status === 'omitted')).toBe(true);
});
test('removes credentials, URL secrets, email values, and handles cyclic input', () => {
    const config = { token: 'secret', endpoint: 'https://user:pass@example.com/cards?token=secret#private', label: 'person@example.com' };
    config.self = config;
    const result = JSON.parse(cleanConfig(config));
    expect(result).toEqual({ token: '[removed]', endpoint: 'https://example.com/cards?token=%5Bremoved%5D', label: '[removed]', self: '[repeated reference]' });
    // eslint-disable-next-line no-script-url
    expect(cleanUrl('javascript:alert(1)')).toBe('[removed]');
    expect(cleanUrl('http://[')).toBe('[invalid url]');
    expect(cleanUrl(`https://example.com/${'a'.repeat(400)}`)).toBe('[url too long]');
    expect(cleanConfig(undefined)).toBe('{}');
});
test('logging failures never interrupt cards or create unhandled rejections', async () => {
    global.fetch.mockImplementationOnce(() => { throw new Error('blocked'); });
    global.fetch.mockRejectedValue(new Error('offline'));
    expect(() => createLogger()('collection_started')).not.toThrow();
    await Promise.resolve();
    expect(() => createLogger(() => { throw new Error('bad config'); })('collection_started')).not.toThrow();
});
test('browser errors correlate to the visit, never to an arbitrary collection', () => {
    const handlers = {};
    jest.spyOn(document, 'currentScript', 'get').mockReturnValue({ src: 'https://example.com/caas.js' });
    jest.spyOn(window, 'addEventListener').mockImplementation((name, fn) => { handlers[name] = fn; });
    fresh(); createLogger()('collection_started'); createLogger()('collection_started');
    handlers.error({ filename: 'https://other.com/other.js' });
    handlers.unhandledrejection({ reason: 'private' });
    handlers.error({ filename: 'https://example.com/caas.js', error: new TypeError('private'), lineno: 4, colno: 9 });
    handlers.unhandledrejection({ reason: { stack: 'private at https://example.com/caas.js:3' } });
    handlers.error({ filename: 'https://example.com/caas.js' });
    const errors = records().filter(r => ['runtime_error', 'unhandled_rejection'].includes(r.event));
    expect(errors).toHaveLength(2);
    expect(errors[0]).toMatchObject({ collectionId: null, configId: null, error: { kind: 'TypeError', line: 4, column: 9 } });
    expect(new Set(records().map(r => r.pageVisitId)).size).toBe(1);
    expect(JSON.stringify(errors)).not.toContain('private');
});

test('retains public endpoint options and correlates overlapping request failures', () => {
    expect(cleanUrl('https://example.com/cards?locale=en&token=private', true))
        .toBe('https://example.com/cards?locale=en&token=%5Bremoved%5D');
    const log = createLogger();
    const first = log('request_started', { endpoint: '/one' });
    const second = log('request_started', { endpoint: '/two' });
    log('request_failed', { requestId: first, kind: 'parse' });
    log('request_failed', { requestId: second, kind: 'processing' });
    const failures = outcomes().filter(r => r.event === 'request_failed');
    expect(failures.map(r => r.requestId)).toEqual([first, second]);
    expect(failures.map(r => r.error.kind)).toEqual(['parse', 'processing']);
});
