import { loadLana } from '../lana';

describe('Lana Logging', () => {
    let originalFetch;

    beforeAll(() => {
        // Mock the fetch API
        originalFetch = global.fetch;
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            }));
    });

    afterAll(() => {
        // Restore the original fetch API
        global.fetch = originalFetch;
    });

    beforeEach(() => {
        // Reset the global lana object before each test
        delete window.lana;
    });

    test('should initialize lana if not already initialized', () => {
        loadLana();
        expect(window.lana).toBeDefined();
        expect(window.lana.debug).toBe(false);
        expect(window.lana.options).toEqual({});
    });

    test('should not reinitialize lana if already initialized', () => {
        window.lana = { log: jest.fn() };
        loadLana();
        expect(window.lana).toBeDefined();
    });

    test('should log an error when an error event occurs', async () => {
        loadLana();
        const errorEvent = new ErrorEvent('error', {
            message: 'Test error',
        });

        // Mock logImpl instead of log
        window.lana.logImpl = jest.fn();

        window.dispatchEvent(errorEvent);

        // Check if logImpl was called with the correct arguments
        expect(window.lana.logImpl).toHaveBeenCalledWith('Test error', { errorType: 'i' });
    });

    test('should log an error when an unhandledrejection event occurs', async () => {
        loadLana();
        const rejectionEvent = new Event('unhandledrejection');
        rejectionEvent.reason = 'Test rejection';

        // Mock logImpl instead of log
        window.lana.logImpl = jest.fn();

        window.dispatchEvent(rejectionEvent);

        // Check if logImpl was called with the correct arguments
        expect(window.lana.logImpl).toHaveBeenCalledWith('Test rejection', { errorType: 'i' });
    });
});
describe('Lana Logging - Additional Coverage Tests', () => {
    let originalFetch;
    let originalLana;

    beforeAll(() => {
        originalFetch = global.fetch;
        originalLana = window.lana;
    });

    afterAll(() => {
        global.fetch = originalFetch;
        window.lana = originalLana;
    });

    beforeEach(() => {
        delete window.lana;
        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        }));
        console.log = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should remove event listeners and fetch lana.js when log is called', async () => {
        loadLana();
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        const fetchSpy = jest.spyOn(global, 'fetch');

        await window.lana.log('Test message');

        expect(removeEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
        expect(fetchSpy).toHaveBeenCalledWith('www.caas.com/libs/utils/lana.js');
    });

    test('should handle fetch errors gracefully when calling log', async () => {
        loadLana();
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Fetch error')));

        await window.lana.log('Test message');

        expect(removeEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
        expect(console.log).toHaveBeenCalledWith('Lana not yet loaded, logging to console:', 'Test message');
    });

    test('should call logImpl after fetching', async () => {
        loadLana();
        const mockLogResult = 'Logged successfully';
        const mockLogImpl = jest.fn().mockReturnValue(mockLogResult);

        global.fetch.mockImplementationOnce(() => {
            window.lana.logImpl = mockLogImpl;
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            });
        });

        const result = await window.lana.log('Test message');

        expect(mockLogImpl).toHaveBeenCalledWith('Test message');
        expect(result).toBe(mockLogResult);
    });
});