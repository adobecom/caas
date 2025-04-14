import React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Container from '../Container';
import config from '../../Testing/Mocks/config.json';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';

global.fetch = jest.fn();

beforeEach(() => {
    window.digitalData = {};
    jest.resetAllMocks();
    setupIntersectionObserverMock();
    jestMocks.lana();
});

describe('Consonant/Container/Alloy Integration', () => {
    test('should wait for satellite promise before calling alloy', async () => {
        const configToUse = { ...config, target: { enabled: true } };
        
        // Mock the satellite promise
        window.__satelliteLoadedPromise = Promise.resolve();
        
        // Mock alloy
        window.alloy = jest.fn().mockReturnValue(Promise.resolve({
            identity: { ECID: 'test-ecid' },
            edge: { regionId: 'test-region' }
        }));
        window.edgeConfigId = 'test-config';

        // Mock fetch to succeed
        global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'success',
            url: 'test.html',
            json: () => Promise.resolve({ cards: [] }),
        }));

        await act(async () => render(<Container config={configToUse} />));

        // Verify that alloy was called after satellite promise resolved
        await waitFor(() => {
            expect(window.alloy).toHaveBeenCalledWith('getIdentity');
        });

        // Verify that fetch was called with the correct parameters
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('mcgvid=test-ecid'),
                expect.any(Object)
            );
        });
    });

    test('should handle alloy not being available', async () => {
        const configToUse = { ...config, target: { enabled: true } };
        
        // Mock the satellite promise
        window.__satelliteLoadedPromise = Promise.resolve();
        
        // Don't mock alloy to simulate it not being available
        window.alloy = undefined;
        window.edgeConfigId = undefined;

        // Mock fetch to succeed
        global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'success',
            url: 'test.html',
            json: () => Promise.resolve({ cards: [] }),
        }));

        await act(async () => render(<Container config={configToUse} />));

        // Verify that fetch was called without alloy parameters
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.not.stringContaining('mcgvid'),
                expect.any(Object)
            );
        });
    });

    test('should handle satellite promise rejection', async () => {
        const configToUse = { ...config, target: { enabled: true } };
        
        // Mock the satellite promise to reject
        window.__satelliteLoadedPromise = Promise.reject(new Error('Satellite failed'));
        
        // Mock alloy
        window.alloy = jest.fn();
        window.edgeConfigId = 'test-config';

        // Mock fetch to succeed
        global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'success',
            url: 'test.html',
            json: () => Promise.resolve({ cards: [] }),
        }));

        await act(async () => render(<Container config={configToUse} />));

        // Verify that fetch was called without alloy parameters
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.not.stringContaining('mcgvid'),
                expect.any(Object)
            );
        });
    });
}); 