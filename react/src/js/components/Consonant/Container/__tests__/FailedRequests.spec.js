import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect'; // Import jest-dom for additional matchers
import Container from '../Container'; // Adjust the import based on your project structure
import config from '../../Testing/Mocks/config.json'; // Adjust the import based on your project structure
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';

global.fetch = jest.fn();
const cardRequests = () => global.fetch.mock.calls.filter(([url]) => !url.startsWith('https://www.adobe.com/lana/ll?'));
const mockCardRequests = () => {
    global.fetch.mockImplementation((url) => {
        if (url.startsWith('https://www.adobe.com/lana/ll?')) return Promise.resolve({ type: 'opaque' });
        if (url === 'https://www.somedomain.com/some-test-api.json') return Promise.reject(new Error('Network error'));
        return Promise.resolve({ ok: true, status: 200, statusText: 'success', url, json: () => Promise.resolve({ cards: [] }) });
    });
};

beforeEach(() => {
    window.digitalData = {};
    jest.resetAllMocks();
    jest.useFakeTimers();
    delete window[Symbol.for('caas.pulse.v1')];
    delete window[Symbol.for('caas.telemetry.v2')];
    setupIntersectionObserverMock();
    jestMocks.lana();
});

afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
});

describe.each([0.05, 0.5])('Consonant/Container/Failed Requests (sample draw %s)', (draw) => {
    beforeEach(() => jest.spyOn(Math, 'random').mockReturnValue(draw));
    test('should fallback to the fallback endpoint on fetch failure', async () => {
        const configToUse = { ...config, collection: { ...config.collection, endpoint: 'https://www.somedomain.com/some-test-api.json', fallbackEndpoint: 'https://www.somedomain.com/some-fallback-api.json' } };

        mockCardRequests();

        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => expect(cardRequests()).toHaveLength(2));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('https://www.somedomain.com/some-fallback-api.json', expect.any(Object)));
    });

    test('should handle fetch failure with no fallback endpoint', async () => {
        const configToUse = { ...config, collection: { ...config.collection, endpoint: 'https://www.somedomain.com/some-test-api.json', fallbackEndpoint: null } };

        mockCardRequests();

        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => expect(cardRequests()).toHaveLength(1));
        await waitFor(() => expect(screen.queryByTestId('consonant-CardsGrid')).not.toBeInTheDocument());
    });

    test('should succeed on subsequent fetch after initial failure', async () => {
        const configToUse = { ...config, collection: { ...config.collection, endpoint: 'https://www.somedomain.com/some-test-api.json', fallbackEndpoint: 'https://www.somedomain.com/some-fallback-api.json' } };

        mockCardRequests();

        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => expect(cardRequests()).toHaveLength(2));
    });
    test('should fallback to the fallback endpoint with string', async () => {
        const configToUse = { ...config, collection: { ...config.collection, endpoint: 'https://www.somedomain.com/some-test-api.json', fallbackEndpoint: 'https://www.somedomain.com/some-fallback-api.json' } };

        mockCardRequests();

        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => expect(cardRequests()).toHaveLength(2));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('https://www.somedomain.com/some-fallback-api.json', expect.any(Object)));
    });
});
