export default () => {
    class LanaMock {
        log = msg => console.log(msg);
    }

    const properties = {
        writable: true,
        configurable: true,
        value: new LanaMock(),
    };

    Object.defineProperty(window, 'lana', properties);
};
