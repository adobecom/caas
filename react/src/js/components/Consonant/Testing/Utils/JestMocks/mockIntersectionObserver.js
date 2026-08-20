export default ({
    unobserve = () => {},
    intersectionRatio = 1,
    observe = callback => callback(),
} = {}) => {
    class IntersectionObserverMock {
        constructor(callback) {
            this.callback = callback;
            this.unobserve = unobserve;
            this.observeElementsProps = [{ intersectionRatio }];
        }

        observe = () => observe(() => this.callback(this.observeElementsProps));
    }

    const properties = {
        writable: true,
        configurable: true,
        value: IntersectionObserverMock,
    };

    Object.defineProperty(window, 'IntersectionObserver', properties);
    Object.defineProperty(global, 'IntersectionObserver', properties);
};
