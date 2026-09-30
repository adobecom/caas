const mockLocalStorage = (defaultStore) => {
    class LocalStorageMock {
        store = defaultStore || {};

        getItem = key => this.store[key];
        setItem = (key, val) => {
            this.store[key] = val;
        };
        removeItem = (key) => {
            delete this.store[key];
        };
        clear = () => {
            this.store = {};
        };
    }

    const properties = {
        writable: true,
        configurable: true,
        value: new LocalStorageMock(),
    };

    Object.defineProperty(globalThis, 'localStorage', properties);
};

export default mockLocalStorage;
