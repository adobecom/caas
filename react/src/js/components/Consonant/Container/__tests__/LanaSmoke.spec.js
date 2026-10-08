import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Container from '../Container';
import config from '../../Testing/Mocks/config.json';
import cards from '../../Testing/Mocks/cards.json';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';

const primary = 'https://example.com/cards';
const fallback = 'https://example.com/fallback';
const allLogs = () => global.fetch.mock.calls
    .filter(([url]) => url.startsWith('https://www.adobe.com/lana/ll?'))
    .map(([url]) => JSON.parse(new URL(url).searchParams.get('m')));

const logs = () => allLogs().filter(message => ['collection_started', 'collection_ready', 'collection_rendered', 'collection_failed', 'collection_fallback'].includes(message.event));

beforeEach(() => {
    delete window[Symbol.for('caas.telemetry.v2')];
    window.digitalData = {};
    window.history.replaceState({}, '', '/?caas_log_poc=smoke-integration');
    window.OnetrustActiveGroups = ',C0002,';
    setupIntersectionObserverMock();
    jestMocks.lana();
});

afterEach(() => {
    window.history.replaceState({}, '', '/');
    delete window.OnetrustActiveGroups;
});

test.each(['success', 'fallback', 'empty', 'failure'])('logs the actual collection outcome: %s', async scenario => {
    global.fetch = jest.fn(url => {
        // Even a blocked logging endpoint must not change the card result.
        if (url.startsWith('https://www.adobe.com/lana/ll?')) return Promise.reject(new Error('logging blocked'));
        if (scenario === 'failure' || (scenario === 'fallback' && url === primary)) {
            return Promise.reject(new Error('card request failed'));
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ cards: scenario === 'empty' ? [] : cards }) });
    });
    render(<Container config={{ ...config,
        collection: {
            ...config.collection, lazyLoad: false, endpoint: primary, fallbackEndpoint: fallback,
        } }} />);
    const outcome = scenario === 'failure' ? 'collection_failed' : 'collection_ready';
    const expected = ['collection_started'];
    if (scenario === 'failure' || scenario === 'fallback') expected.push('collection_fallback');
    expected.push(outcome);
    if (scenario === 'success' || scenario === 'fallback') expected.push('collection_rendered');
    await waitFor(() => expect(logs().map(message => message.event)).toEqual(expected));
    expect(allLogs().find(message => message.event === 'collection_context')).toMatchObject({ collectionId: 'collection-1', configId: 'config-1' });
    if (scenario === 'failure' || scenario === 'fallback') {
        expect(global.fetch).toHaveBeenCalledWith(fallback, expect.any(Object));
    }
    if (scenario === 'empty') expect(logs().find(message => message.event === 'collection_ready').cardCount).toBe(0);
    if (scenario === 'success' || scenario === 'fallback') expect(logs().find(message => message.event === 'collection_ready').cardCount).toBeGreaterThan(0);
});
