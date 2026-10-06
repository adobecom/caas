let createLogger;

beforeEach(() => {
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
    expect(JSON.parse(request.searchParams.get('m'))).toEqual({
        marker: 'caas_lana_poc_v1',
        run: 'smoke-test-1',
        collection: 1,
        event: 'collection_ready',
        cardCount: 5,
    });
    expect(Object.fromEntries(request.searchParams)).toMatchObject({
        c: 'chimera', s: '100', t: 'e', r: 'info', tags: 'caas_lana_poc_v1',
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
