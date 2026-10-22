import createLogger, { consentStatus } from '../lanaPulse';

const key = Symbol.for('caas.pulse.v1');
const messages = () => fetch.mock.calls.map(([url]) => JSON.parse(new URL(url).searchParams.get('m')));
beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0.05);
    global.fetch = jest.fn().mockResolvedValue({});
    delete window[key]; delete window.OnetrustActiveGroups; delete window.adobePrivacy;
    window.history.replaceState({}, '', '/');
});
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); jest.restoreAllMocks(); });

test('pulse is visible when the raw consent flag is missing', () => {
    createLogger()('collection_started');
    expect(messages()[0]).toMatchObject({ marker: 'caas_pulse_v1',
sampleRate: 10,
        analyticsConsent: 'unknown',
rawFlag: 'missing',
phase: 'initial' });
});
test('denied consent is counted without detailed analytics', () => {
    window.OnetrustActiveGroups = ',C0001,';
    createLogger()('collection_started');
    expect(messages()[0].analyticsConsent).toBe('disabled');
});
test('uses Adobe consent API even when the raw global is absent', () => {
    window.adobePrivacy = { activeCookieGroups: () => ['C0001', 'C0002'] };
    expect(consentStatus()).toEqual({ analyticsConsent: 'enabled',
        consentSource: 'adobePrivacy',
consentApiState: 'available',
rawFlag: 'missing' });
});
test('API disabled takes precedence over stale raw enabled flag', () => {
    window.OnetrustActiveGroups = ',C0002,';
    window.adobePrivacy = { activeCookieGroups: () => ['C0001'] };
    expect(consentStatus().analyticsConsent).toBe('disabled');
});
test('late consent is measured on the second pulse', () => {
    const log = createLogger(); log('collection_started'); log('collection_rendered');
    window.OnetrustActiveGroups = ',C0002,';
    jest.advanceTimersByTime(10000);
    expect(messages()[1]).toMatchObject({ analyticsConsent: 'enabled',
        phase: 'after_10s',
collectionsRendered: 1 });
});
test('one sample decision and two pulses across multiple collections', () => {
    const a = createLogger(); const b = createLogger();
    a('collection_started'); a('collection_started'); b('collection_started');
    a('collection_rendered'); b('collection_failed');
    jest.advanceTimersByTime(10000);
    expect(Math.random).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(messages()[1]).toMatchObject({ collectionsStarted: 2, collectionsRendered: 1, collectionsFailed: 1 });
});
test('unselected page never sends, even with multiple collections', () => {
    Math.random.mockReturnValue(0.1);
    createLogger()('collection_started'); createLogger()('collection_started');
    jest.advanceTimersByTime(10000);
    expect(fetch).not.toHaveBeenCalled();
    expect(Math.random).toHaveBeenCalledTimes(1);
});
test('labeled controlled test bypasses random sampling', () => {
    Math.random.mockReturnValue(0.99);
    window.history.replaceState({}, '', '/?caas_log_poc=smoke-pulse-proof');
    createLogger()('collection_started');
    expect(messages()[0]).toMatchObject({ mode: 'test', sampleRate: 100, run: 'smoke-pulse-proof' });
});
test('invalid test label does not bypass sampling', () => {
    Math.random.mockReturnValue(0.99);
    window.history.replaceState({}, '', '/?caas_log_poc=invalid');
    createLogger()('collection_started'); expect(fetch).not.toHaveBeenCalled();
});
test('pulse omits page, config, identifiers and sends no credentials or referrer', () => {
    createLogger(() => ({ password: 'secret' }))('collection_started');
    const m = messages()[0];
    expect(Object.keys(m).sort()).toEqual(['analyticsConsent', 'build', 'collectionsFailed',
        'collectionsRendered', 'collectionsStarted', 'consentApiState', 'consentSource', 'marker', 'mode',
        'phase', 'rawFlag', 'release', 'sampleRate'].sort());
    expect(fetch.mock.calls[0][1]).toMatchObject({ credentials: 'omit', referrerPolicy: 'no-referrer' });
});
test('network and consent API failures never interrupt collections', () => {
    window.adobePrivacy = { activeCookieGroups: () => { throw new Error('unavailable'); } };
    fetch.mockImplementation(() => { throw new Error('blocked'); });
    expect(() => createLogger()('collection_started')).not.toThrow();
    expect(() => jest.advanceTimersByTime(10000)).not.toThrow();
});


test.each([
    [undefined, 'missing'],
    [{ activeCookieGroups: () => 'C0002' }, 'invalid_response'],
    [{ activeCookieGroups: () => { throw new Error('failed'); } }, 'error'],
])('reports consent API health without assuming consent', (api, expected) => {
    window.adobePrivacy = api;
    createLogger()('collection_started');
    expect(messages()[0]).toMatchObject({ consentApiState: expected, analyticsConsent: 'unknown' });
});
