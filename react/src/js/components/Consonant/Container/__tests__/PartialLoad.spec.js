import React from 'react';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Container from '../Container';
import config from '../../Testing/Mocks/config.json';
import cards from '../../Testing/Mocks/cards.json';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';

global.fetch = jest.fn();
setupIntersectionObserverMock();
jestMocks.lana();

describe('Consonant/Container/Partial Load', () => {
    beforeEach(() => {
        global.fetch.mockClear();
        window.digitalData = {};
    });

    describe('When partial load is enabled', () => {
        test('should make two fetch calls - one for partial load and one for full load', async () => {
            const configWithPartialLoad = {
                ...config,
                collection: {
                    ...config.collection,
                    endpoint: 'https://test-endpoint/api',
                    partialLoadWithBackgroundFetch: {
                        enabled: true,
                        partialLoadCount: 10,
                    },
                },
            };

            // Mock first fetch for partial load
            global.fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    ok: 'ok',
                    status: 200,
                    statusText: 'success',
                    url: 'test.html',
                    json: () => Promise.resolve({
                        cards: cards.slice(0, 10),
                        totalCount: cards.length,
                    }),
                }));

            // Mock second fetch for full load
            global.fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    ok: 'ok',
                    status: 200,
                    statusText: 'success',
                    url: 'test.html',
                    json: () => Promise.resolve({ cards }),
                }));

            await act(async () => {
                render(<Container config={configWithPartialLoad} />);
            });

            // Should make two fetch calls
            expect(global.fetch).toHaveBeenCalledTimes(2);

            // First call should include partialLoadCount param
            const firstCallUrl = new URL(global.fetch.mock.calls[0][0]);
            expect(firstCallUrl.searchParams.get('partialLoadCount')).toBe('10');

            // Second call should be the full URL without partialLoadCount
            const secondCallUrl = new URL(global.fetch.mock.calls[1][0]);
            expect(secondCallUrl.searchParams.get('partialLoadCount')).toBeNull();
        });
    });

    describe('When partial load is disabled', () => {
        test('should only make one fetch call for full load', async () => {
            const configWithoutPartialLoad = {
                ...config,
                collection: {
                    ...config.collection,
                    endpoint: 'https://test-endpoint/api',
                    partialLoadWithBackgroundFetch: {
                        enabled: false,
                    },
                },
            };

            global.fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    ok: 'ok',
                    status: 200,
                    statusText: 'success',
                    url: 'test.html',
                    json: () => Promise.resolve({ cards }),
                }));

            await act(async () => {
                render(<Container config={configWithoutPartialLoad} />);
            });

            // Should only make one fetch call
            expect(global.fetch).toHaveBeenCalledTimes(1);

            // Call should not include partialLoadCount param
            const callUrl = new URL(global.fetch.mock.calls[0][0]);
            expect(callUrl.searchParams.get('partialLoadCount')).toBeNull();
        });
    });
});
