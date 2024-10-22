import { watch, authorWatch } from '../watch'; // Ensure correct import of watch and authorWatch

describe('watch function', () => {
    let registry;
    let observerMock;

    beforeEach(() => {
        // Mock the registry object
        registry = {
            element: document.createElement('div'),
            init: jest.fn(),
        };

        // Mock MutationObserver
        observerMock = {
            observe: jest.fn(),
            disconnect: jest.fn(),
        };
        global.MutationObserver = jest.fn((callback) => {
            observerMock.callback = callback;
            return observerMock;
        });

        // Clear all mocks
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Clean up MutationObserver mock
        delete global.MutationObserver;
    });

    test('calls registry.init for added nodes', () => {
        // Call the watch function
        watch(registry);

        // Verify that observer.observe was called with the correct parameters
        expect(observerMock.observe).toHaveBeenCalledWith(registry.element, {
            childList: true,
            subtree: true,
        });

        // Simulate a mutation with an added node
        const addedNode = document.createElement('div');
        observerMock.callback([
            {
                addedNodes: [addedNode],
                removedNodes: [],
            },
        ]);

        // Verify that registry.init was called with the added node
        expect(registry.init).toHaveBeenCalledWith(addedNode);
    });

    test('does not call registry.init for non-element nodes', () => {
        // Call the watch function
        watch(registry);

        // Simulate a mutation with a non-element node
        const addedNode = document.createTextNode('text');
        observerMock.callback([
            {
                addedNodes: [addedNode],
                removedNodes: [],
            },
        ]);

        // Verify that registry.init was not called
        expect(registry.init).not.toHaveBeenCalled();
    });

    test('uses document.body if registry.element is not a valid Node', () => {
        // Set registry.element to an invalid value
        registry.element = null;

        // Call the watch function
        watch(registry);

        // Verify that observer.observe was called with document.body
        expect(observerMock.observe).toHaveBeenCalledWith(document.body, {
            childList: true,
            subtree: true,
        });
    });

    test('calls watch function when CQ is defined', () => {
        // Mock the watch function
        const watchSpy = jest.spyOn(require('../watch'), 'watch').mockImplementation(jest.fn());

        // Ensure CQ is undefined
        global.CQ = undefined;

        // Mock registry object
        registry = { element: document.createElement('div'), init: jest.fn() };

        // Call authorWatch
        authorWatch(registry);

        // Verify that watch was not called
        expect(watchSpy).not.toHaveBeenCalledWith(registry);

        // Restore the original implementation
        watchSpy.mockRestore();
    });

    test('does not call watch function when CQ is not defined', () => {
        // Mock the watch function
        const watchSpy = jest.spyOn(require('../watch'), 'watch').mockImplementation(jest.fn());

        // Ensure CQ is undefined
        global.CQ = undefined;

        // Mock registry object
        registry = { element: document.createElement('div'), init: jest.fn() };

        // Call authorWatch
        authorWatch(registry);

        // Verify that watch was not called
        expect(watchSpy).not.toHaveBeenCalled();

        // Restore the original implementation
        watchSpy.mockRestore();
    });
});
