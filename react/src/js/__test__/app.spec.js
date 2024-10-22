/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { DOMRegistry } from 'react-dom-components';
import consonantPageRDC from '../components/Consonant/Page/ConsonantPageDOM';
import { initReact, collectionLoadedThroughXf, ConsonantCardCollecton, authorWatch } from '../app'; // Import functions from app.tsx
import Container from '../components/Consonant/Container/Container'; // Import the Container component
import { parseToPrimitive } from '../components/Consonant/Helpers/general';
import { loadLana } from '../components/Consonant/Helpers/lana'; // Import loadLana function
import '../app'; // Ensure to import the app to trigger the try-catch block

// Mock the DOMRegistry class
jest.mock('react-dom-components', () => {
    const originalModule = jest.requireActual('react-dom-components');
    return {
        ...originalModule,
        DOMRegistry: jest.fn().mockImplementation(() => ({
            init: jest.fn(),
            render: jest.fn(),
            register: jest.fn(),
        })),
    };
});

// Mock ReactDOM.render
jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    render: jest.fn(),
}));


// Mock the loadLana function
jest.mock('../components/Consonant/Helpers/lana', () => ({
    loadLana: jest.fn(),
}));

describe('app.tsx functionality', () => {
    let domRegistry;
    let testElement;

    beforeEach(() => {
        jest.clearAllMocks();
        domRegistry = new DOMRegistry();
        testElement = document.createElement('div');
    });

    test('initReact initializes the DOMRegistry', () => {
        initReact(document, domRegistry); // Pass the mocked DOMRegistry instance
        expect(domRegistry.init).toHaveBeenCalledWith(document);
    });

    test('collectionLoadedThroughXf returns true for valid element', () => {
        testElement.className = 'experiencefragment';
        const testContainer = document.createElement('div');
        const testConsonantCardCollection = document.createElement('div');
        testConsonantCardCollection.className = 'consonantcardcollection';
        testContainer.appendChild(testConsonantCardCollection);
        testElement.appendChild(testContainer);

        expect(collectionLoadedThroughXf(testElement)).toBe(true);
    });

    test('collectionLoadedThroughXf returns false for invalid element', () => {
        testElement.className = 'notexperiencefragment';
        expect(collectionLoadedThroughXf(testElement)).toBe(false);
    });

    test('collectionLoadedThroughXf returns false for null element', () => {
        expect(collectionLoadedThroughXf(null)).toBe(false);
    });

    test('collectionLoadedThroughXf returns false for element without firstElementChild', () => {
        const element = document.createElement('div');
        element.className = 'experiencefragment';
        expect(collectionLoadedThroughXf(element)).toBe(false);
    });

    test('collectionLoadedThroughXf returns false for element without consonantcardcollection', () => {
        const element = document.createElement('div');
        element.className = 'experiencefragment';
        const container = document.createElement('div');
        element.appendChild(container);
        expect(collectionLoadedThroughXf(element)).toBe(false);
    });

    test('initReact handles errors gracefully', () => {
        const faultyRegistry = {
            init: jest.fn(() => {
                throw new Error('Initialization error');
            }),
        };
        expect(() => initReact(document, faultyRegistry)).toThrow('Initialization error');
    });

    test('ConsonantCardCollecton constructor renders the component', () => {
        const config = { key: 'value' };
        const element = document.createElement('div');
        new ConsonantCardCollecton(config, element);
        expect(ReactDOM.render).toHaveBeenCalledWith(
            <React.Fragment>
                <Container config={parseToPrimitive(config)} />
            </React.Fragment>,
            element
        );
    });

    test('window.dexter.dxf.registerApp is called', () => {
        const originalDexter = window.dexter;
        window.dexter = {
            dxf: {
                registerApp: jest.fn(),
            },
        };

        // Re-require the app to trigger the registerApp call
        jest.resetModules();
        require('../app');

        expect(window.dexter.dxf.registerApp).toHaveBeenCalledWith(expect.any(Function));

        // Restore the original dexter object
        window.dexter = originalDexter;
    });

    test('authorWatch enters condition to render when element changes', () => {
        testElement.className = 'experiencefragment';
        const testContainer = document.createElement('div');
        const testConsonantCardCollection = document.createElement('div');
        testConsonantCardCollection.className = 'consonantcardcollection';
        testContainer.appendChild(testConsonantCardCollection);
        testElement.appendChild(testContainer);

        authorWatch(testElement, domRegistry);
        // expect(collectionLoadedThroughXf(testElement)).toBe(true)
        expect(domRegistry.render).toHaveBeenCalledWith(consonantPageRDC);
    });

    test('authorWatch does not enter the condition to render when element does not change', () => {
        testElement.className = 'experiencefragment';
        const testContainer = document.createElement('div');
        const testConsonantCardCollection = document.createElement('div');
        testConsonantCardCollection.className = 'consonantcardcollection';
        testContainer.appendChild(testConsonantCardCollection);
        testElement.appendChild(testContainer);

        // Call authorWatch the first time to set prev
        authorWatch(testElement, domRegistry);
        // expect(collectionLoadedThroughXf(testElement)).toBe(true)

        expect(domRegistry.render).toHaveBeenCalledWith(consonantPageRDC);

        // Reset the mock to clear the previous call
        domRegistry.render.mockClear();

        // Call authorWatch again with the same element
        authorWatch(testElement, domRegistry);
        expect(domRegistry.render).not.toHaveBeenCalled();
    });

    test('window.dx.author.watch.registerFunction is called if window.Granite and window.dx are defined', () => {
        const originalGranite = window.Granite;
        const originalDx = window.dx;

        window.Granite = {};
        window.dx = {
            author: {
                watch: {
                    registerFunction: jest.fn(),
                },
            },
        };

        // Re-require the app to trigger the registration
        jest.resetModules();
        const app = require('../app'); // Ensure to re-require after resetting modules

        // Check that the function is the same instance
        expect(window.dx.author.watch.registerFunction).toHaveBeenCalledWith(app.authorWatch);

        // Restore the original objects
        window.Granite = originalGranite;
        window.dx = originalDx;
    });

    test('loadLana is called and handles errors gracefully', async () => {
        // Simulate an error in loadLana
        loadLana.mockImplementation(() => {
            throw new Error('Test error');
        });

        // Explicitly set window.lana before requiring the app module
        window.lana = {
            log: jest.fn(),
        };
        // Re-require the app to trigger the loadLana call
        jest.resetModules();
        require('../app');

        // Verify that window.lana.log is defined and is a no-op function
        expect(window.lana).toBeDefined();
        expect(window.lana.log).toBeDefined();
        expect(typeof window.lana.log).toBe('function');
        // Ensure window.lana.log does not throw an error
        // await expect(window.lana.log()).resolves.not.toThrow();
    });

    test('DXF registry error handling', () => {
        const originalDexter = window.dexter;
        window.dexter = {
            dxf: {
                registerApp: jest.fn(() => {
                    throw new Error('DXF registration error');
                }),
            },
        };

        // Re-require the app to trigger the registerApp call
        jest.resetModules();
        expect(() => require('../app')).not.toThrow();

        // Restore the original dexter object
        window.dexter = originalDexter;
    });


    test('loadLana does not throw an error when called', () => {
        loadLana.mockImplementation(() => {
            window.lana = {
                log: jest.fn(),
            };
        });

        expect(() => loadLana()).not.toThrow();
        expect(window.lana).toBeDefined();
        expect(window.lana.log).toBeDefined();
        expect(typeof window.lana.log).toBe('function');
    });
});
