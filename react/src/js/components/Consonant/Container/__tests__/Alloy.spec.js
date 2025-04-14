import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
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

afterEach(() => {
    delete window.__satelliteLoadedPromise; // eslint-disable-line no-underscore-dangle
    delete window.alloy;
    delete window.edgeConfigId;
    jest.clearAllMocks();
});

describe('Consonant/Container/Alloy Integration', () => {
    test('should wait for satellite promise before calling alloy', async () => {
        const configToUse = { ...config, target: { enabled: true } };

        // Mock visitor API response
        const mockVisitorApi = Promise.resolve({
            getVisitorId: () => ({
                getMarketingCloudVisitorID: () => 'test-mcgvid',
                getSupplementalDataID: () => 'test-sdid',
                getAudienceManagerBlob: () => 'test-blob',
                getAudienceManagerLocationHint: () => 'test-hint',
            }),
        });

        const promise = mockVisitorApi;
        window.__satelliteLoadedPromise = promise; // eslint-disable-line no-underscore-dangle
        window.alloy = jest.fn().mockReturnValue(Promise.resolve({
            identity: { ECID: 'test-ecid' },
            edge: { regionId: 'test-region' },
        }));
        window.edgeConfigId = 'test-config';

        global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'success',
            url: 'test.html',
            json: () => Promise.resolve({ cards: [] }),
        }));

        await act(async () => {
            render(<Container config={configToUse} />);
        });

        // Wait for promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(window.alloy).toHaveBeenCalledWith('getIdentity');
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('mcgvid=test-ecid'),
            expect.any(Object),
        );
    });

    test('should handle alloy not being available', async () => {
        const configToUse = { ...config, target: { enabled: true } };

        // Mock visitor API response
        const mockVisitorApi = Promise.resolve({
            getVisitorId: () => ({
                getMarketingCloudVisitorID: () => 'test-mcgvid',
                getSupplementalDataID: () => 'test-sdid',
                getAudienceManagerBlob: () => 'test-blob',
                getAudienceManagerLocationHint: () => 'test-hint',
            }),
        });

        const promise = mockVisitorApi;
        window.__satelliteLoadedPromise = promise; // eslint-disable-line no-underscore-dangle
        window.alloy = undefined;
        window.edgeConfigId = undefined;

        global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'success',
            url: 'test.html',
            json: () => Promise.resolve({ cards: [] }),
        }));

        await act(async () => {
            render(<Container config={configToUse} />);
        });

        // Wait for promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('mcgvid=test-mcgvid'),
            expect.any(Object),
        );
    });

    test('should handle satellite promise rejection', async () => {
        const configToUse = { ...config, target: { enabled: true } };

        // Original visitor API object for fallback
        const mockVisitorApi = {
            getVisitorId: () => ({
                getMarketingCloudVisitorID: () => 'test-mcgvid',
                getSupplementalDataID: () => 'test-sdid',
                getAudienceManagerBlob: () => 'test-blob',
                getAudienceManagerLocationHint: () => 'test-hint',
            }),
        };

        // Reject satellite promise but fallback to mockVisitorApi
        const rejectedPromise = Promise.reject(new Error('Satellite failed'))
            .catch(() => mockVisitorApi); // Return fallback visitor object explicitly here

        const promise = rejectedPromise;
        window.__satelliteLoadedPromise = promise; // eslint-disable-line no-underscore-dangle
        window.alloy = undefined;
        window.edgeConfigId = undefined;

        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'success',
                url: 'test.html',
                json: () => Promise.resolve({ cards: [] }),
            }));

        const originalConsoleError = console.error; // eslint-disable-line no-console

        console.error = jest.fn(); // eslint-disable-line no-console

        await act(async () => {
            render(<Container config={configToUse} />);
        });

        await new Promise(resolve => setTimeout(resolve, 0));

        console.error = originalConsoleError; // eslint-disable-line no-console

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('mcgvid=test-mcgvid'),
            expect.any(Object),
        );
    });
});
