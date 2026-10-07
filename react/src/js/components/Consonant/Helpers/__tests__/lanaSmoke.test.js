let createLogger;

beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    jest.isolateModules(() => {
        // Each test represents a fresh page load, including its traffic budget.
        // eslint-disable-next-line global-require
        createLogger = require('../lanaSmoke').default;
    });
    window.history.replaceState({}, '', '/?caas_log_poc=smoke-test-1');
    window.OnetrustActiveGroups = ',C0001,C0002,';
    global.fetch = jest.fn().mockResolvedValue({ type: 'opaque' });
});

afterEach(() => {
    window.history.replaceState({}, '', '/');
    delete window.OnetrustActiveGroups;
    jest.restoreAllMocks();
});

test.each(['', '?caas_log_poc=personal@example.com', '?caas_log_poc=smoke-',
    `?caas_log_poc=smoke-${'x'.repeat(41)}`])('does not send for invalid opt-in %s', query => {
    window.history.replaceState({}, '', `/${query}`);
    createLogger()('collection_started');
    expect(global.fetch).not.toHaveBeenCalled();
});

test.each([undefined, '', ',C0001,', ',C00020,'])('requires analytics consent: %s', groups => {
    window.OnetrustActiveGroups = groups;
    createLogger()('collection_started');
    expect(global.fetch).not.toHaveBeenCalled();
});

test('sends bounded, labeled data to the fixed LANA endpoint without cookies or referrer', () => {
    createLogger()('collection_ready', 5);
    const [url, options] = global.fetch.mock.calls[0];
    const request = new URL(url);
    expect(`${request.origin}${request.pathname}`).toBe('https://www.adobe.com/lana/ll');
    expect(JSON.parse(request.searchParams.get('m'))).toMatchObject({
        marker: 'caas_telemetry_v1',
        run: 'smoke-test-1',
        collection: 1,
        event: 'collection_ready',
        cardCount: 5,
    });
    expect(Object.fromEntries(request.searchParams)).toMatchObject({
        c: 'chimera', s: '100', t: 'e', r: 'info', tags: 'caas_telemetry_v1',
    });
    expect(options).toEqual({ method: 'GET',
        mode: 'no-cors',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        keepalive: true });
});

test('rechecks consent and allows only known events once per collection', () => {
    const log = createLogger();
    log('unknown');
    log('collection_started');
    log('collection_started');
    window.OnetrustActiveGroups = ',C0001,';
    log('collection_ready', 1);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    window.OnetrustActiveGroups = ',C0002,';
    log('collection_failed');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(new URL(global.fetch.mock.calls[1][0]).searchParams.get('r')).toBe('error');
});

test('caps attempts across collections and never forwards arbitrary values', () => {
    for (let i = 0; i < 20; i += 1) createLogger()('collection_ready', 'private text');
    expect(global.fetch).toHaveBeenCalledTimes(12);
    const messages = global.fetch.mock.calls.map(([url]) => JSON.parse(new URL(url).searchParams.get('m')));
    expect(new Set(messages.map(message => message.collection)).size).toBe(12);
    messages.forEach(message => expect(message).not.toHaveProperty('cardCount'));
});

test('logging failures never interrupt the caller or cause unhandled rejections', async () => {
    const log = createLogger();
    global.fetch.mockImplementationOnce(() => { throw new Error('blocked'); });
    expect(() => log('collection_started')).not.toThrow();
    global.fetch.mockRejectedValueOnce(new Error('offline'));
    expect(() => log('collection_failed')).not.toThrow();
    await Promise.resolve();
    expect(global.fetch).toHaveBeenCalledTimes(2);
});

 test('samples normal visits once and reports immutable build identity', () => {
    window.history.replaceState({}, '', '/');
    Math.random.mockReturnValue(0.009);
    const log = createLogger();
    log('collection_started');
    log('collection_ready', 4);
    expect(Math.random).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    const message = JSON.parse(new URL(global.fetch.mock.calls[1][0]).searchParams.get('m'));
    expect(message).toMatchObject({ mode: 'sample',
sampleRate: 1,
release: 'development',
        build: 'unknown',
cardCount: 4,
fallback: false });
    expect(message).not.toHaveProperty('run');
    expect(message.durationMs).toBeGreaterThanOrEqual(0);
 });

 test('does not resample excluded visits across collections', () => {
    window.history.replaceState({}, '', '/');
    Math.random.mockReturnValue(0.01);
    createLogger()('collection_started');
    Math.random.mockReturnValue(0);
    createLogger()('collection_started');
    expect(Math.random).toHaveBeenCalledTimes(1);
    expect(global.fetch).not.toHaveBeenCalled();
 });

 test('keeps total time across fallback and rechecks consent', () => {
    jest.spyOn(Date, 'now').mockReturnValue(100);
    const log = createLogger();
    log('collection_started');
    Date.now.mockReturnValue(150);
    log('collection_fallback');
    log('collection_started');
    Date.now.mockReturnValue(250);
    log('collection_ready', 3);
    expect(JSON.parse(new URL(global.fetch.mock.calls[2][0]).searchParams.get('m')))
        .toMatchObject({ durationMs: 150, fallback: true });
    window.OnetrustActiveGroups = '';
    log('collection_rendered', 3);
    expect(global.fetch).toHaveBeenCalledTimes(3);
 });

 test('reports only errors attributed to this bundle without raw text', () => {
    const handlers = {};
    jest.spyOn(document, 'currentScript', 'get').mockReturnValue({ src: 'https://example.com/caas.js' });
    jest.spyOn(window, 'addEventListener').mockImplementation((name, fn) => { handlers[name] = fn; });
    jest.isolateModules(() => {
        // eslint-disable-next-line global-require
        createLogger = require('../lanaSmoke').default;
    });
    createLogger()('collection_started');
    handlers.error({ filename: 'https://example.com/other.js', message: 'private' });
    handlers.unhandledrejection({ reason: 'private' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    handlers.error({ filename: 'https://example.com/caas.js', message: 'private' });
    handlers.unhandledrejection({ reason: { stack: 'private at https://example.com/caas.js:2' } });
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(JSON.stringify(global.fetch.mock.calls)).not.toContain('private');
 });
