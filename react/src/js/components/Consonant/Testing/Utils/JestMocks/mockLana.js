const mockLana = () => {
    class LanaMock {
        log = msg => console.log(msg);
    }

    const properties = {
        writable: true,
        configurable: true,
        value: new LanaMock(),
    };

    Object.defineProperty(globalThis, 'lana', properties);
};

export default mockLana;
