import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect'; // Import jest-dom for additional matchers
import Container from '../Container'; // Adjust the import based on your project structure
import config from '../../Testing/Mocks/config.json'; // Adjust the import based on your project structure
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';

global.fetch = jest.fn();

beforeEach(() => {
    window.digitalData = {};
    jest.resetAllMocks();
    setupIntersectionObserverMock();
    jestMocks.lana();
});

describe('Consonant/Container/Failed Requests', () => {
    test('should fallback to the fallback endpoint on fetch failure', async () => {
        const configToUse = { ...config, collection: { ...config.collection, endpoint: 'https://www.somedomain.com/some-test-api.json', fallbackEndpoint: 'https://www.somedomain.com/some-fallback-api.json' } };

        // Mock fetch to fail initially and succeed on fallback
        global.fetch
            .mockImplementationOnce(() => Promise.reject(new Error('Network error')))
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'success',
                url: 'test.html',
                json: () => Promise.resolve({ cards: [] }),
            }));

        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('https://www.somedomain.com/some-fallback-api.json', expect.any(Object)));
    });

    test('should handle fetch failure with no fallback endpoint', async () => {
        const configToUse = { ...config, collection: { ...config.collection, endpoint: 'https://www.somedomain.com/some-test-api.json', fallbackEndpoint: null } };

        // Mock fetch to fail
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(screen.queryByTestId('consonant-CardsGrid')).not.toBeInTheDocument());
    });

    test('should succeed on subsequent fetch after initial failure', async () => {
        const configToUse = { ...config, collection: { ...config.collection, endpoint: 'https://www.somedomain.com/some-test-api.json', fallbackEndpoint: 'https://www.somedomain.com/some-fallback-api.json' } };

        // Mock fetch to fail initially and succeed on retry
        global.fetch
            .mockImplementationOnce(() => Promise.reject(new Error('Network error')))
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'success',
                url: 'test.html',
                json: () => Promise.resolve({ cards: [] }),
            }));

        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    });
    test('should fallback to the fallback endpoint with string', async () => {
        const configToUse = { ...config, collection: { ...config.collection, endpoint: 'https://www.somedomain.com/some-test-api.json', fallbackEndpoint: 'https://www.somedomain.com/some-fallback-api.json' } };

        // Mock fetch to fail initially and succeed on fallback
        global.fetch
            .mockImplementationOnce(() => Promise.reject(new Error('Network error')))
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'success',
                url: 'test.html',
                json: () => Promise.resolve({ cards: [] }),
            }));

        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('https://www.somedomain.com/some-fallback-api.json', expect.any(Object)));
    });
});
