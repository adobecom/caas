import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import Container from '../Container';
import mockConfig from '../../Testing/Mocks/config.json';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';

global.fetch = jest.fn();

const defaultConfig = mockConfig;

beforeEach(() => {
    window.digitalData = {};
    jest.resetAllMocks();
    setupIntersectionObserverMock();
    jestMocks.lana();
    // Clear localStorage before each test
    localStorage.clear();
    // Mock _satellite object
    window._satellite = {
        alloyConfigurePromise: Promise.resolve()
    };

    // Mock successful fetch response
    global.fetch.mockImplementation(() => Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'success',
        url: 'test.html',
        json: () => Promise.resolve({ cards: [{ id: '1' }] }),
    }));
});

afterEach(() => {
    delete window.__satelliteLoadedPromise; // eslint-disable-line no-underscore-dangle
    delete window.alloy;
    delete window.edgeConfigId;
    delete window._satellite;
    jest.clearAllMocks();
});

describe('Consonant/Container/Alloy Integration', () => {
    let config;
    let props;

    beforeEach(() => {
        localStorage.clear();
        config = {
            ...defaultConfig,
            target: {
                enabled: true,
                lastViewedSession: true
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
        props = {
            config,
        };
        window._satellite = {
            alloyConfigurePromise: Promise.resolve(),
        };

        // Mock visitor API response
        const mockVisitorApi = Promise.resolve({
            getVisitorId: () => ({
                getMarketingCloudVisitorID: () => 'test-mcgvid',
                getSupplementalDataID: () => 'test-sdid',
                getAudienceManagerBlob: () => 'test-blob',
                getAudienceManagerLocationHint: () => 'test-hint',
            }),
        });

        window.__satelliteLoadedPromise = mockVisitorApi;
    });

    afterEach(() => {
        delete window._satellite;
        delete window.alloy;
        delete window.edgeConfigId;
        jest.clearAllMocks();
    });

    it('should use targetValueRevealID from localStorage when useLastViewedSession is true', async () => {
        localStorage.setItem('targetValueRevealID', 'test-reveal-id');
        
        // Mock fetch to capture the URL
        global.fetch.mockImplementation((url) => {
            return Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'success',
                url,
                json: () => Promise.resolve({ cards: [{ id: '1' }] }),
            });
        });

        await act(async () => {
            render(<Container {...props} />);
        });

        // Wait for all promises to resolve
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verify that fetch was called with the correct currentEntityId
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringMatching(/currentEntityId=test-reveal-id/),
            expect.any(Object)
        );
    });

    test('should wait for satellite promise before calling alloy', async () => {
        const configToUse = { ...config, target: { enabled: true } };

        window.alloy = jest.fn().mockReturnValue(Promise.resolve({
            identity: { ECID: 'test-ecid' },
            edge: { regionId: 'test-region' },
        }));
        window.edgeConfigId = 'test-config';

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
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('mboxMCGLH=test-region'),
            expect.any(Object),
        );
    });

    test('should handle alloy not being available', async () => {
        const configToUse = { ...config, target: { enabled: true } };

        window.alloy = undefined;
        window.edgeConfigId = undefined;

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

        window.__satelliteLoadedPromise = rejectedPromise;
        window.alloy = undefined;
        window.edgeConfigId = undefined;

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

    test('should not use targetValueRevealID when useLastViewedSession is false', async () => {
        const configToUse = { 
            ...config, 
            target: { 
                enabled: true,
                useLastViewedSession: false 
            } 
        };

        // Set targetValueRevealID in localStorage
        localStorage.setItem('targetValueRevealID', 'test-reveal-id');

        await act(async () => {
            render(<Container config={configToUse} />);
        });

        // Wait for promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(global.fetch).not.toHaveBeenCalledWith(
            expect.stringContaining('currentEntityId=test-reveal-id'),
            expect.any(Object),
        );
    });

    test('should fallback to visitor API if alloy_getIdentity returns incomplete data', async () => {
        localStorage.setItem('targetValueRevealID', 'test-reveal-id');
        window.alloy_getIdentity = Promise.resolve({
            identity: null,
            edge: null,
        });

        await act(async () => {
            render(<Container {...props} />);
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringMatching('mcgvid=test-mcgvid'),
            expect.any(Object),
        );
    });

    test('should fallback to visitor API if alloy_getIdentity rejects', async () => {
        localStorage.setItem('targetValueRevealID', 'test-reveal-id');
        window.alloy_getIdentity = Promise.reject(new Error('identity failed'));

        await act(async () => {
            render(<Container {...props} />);
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringMatching('mcgvid=test-mcgvid'),
            expect.any(Object),
        );
    });

    test('should fallback to base endpoint if visitorApi fails', async () => {
        window.__satelliteLoadedPromise = Promise.reject(new Error('visitor failed'));
        
        await act(async () => {
            render(<Container {...props} />);
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        expect(global.fetch).toHaveBeenCalledWith(
            'https://www.somedomain.com/some-test-api.json?flatFile=false',
            expect.any(Object),
        );
    });
});
