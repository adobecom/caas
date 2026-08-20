export default (defaultStore) => {
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

    Object.defineProperty(window, 'localStorage', properties);
    Object.defineProperty(global, 'localStorage', properties);
};
