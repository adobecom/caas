import { authorWatch } from '../watch';

describe('author mode observation', () => {
    const originalObserver = globalThis.MutationObserver;
    const originalCQ = globalThis.CQ;
    let observe;

    beforeEach(() => {
        observe = jest.fn();
        globalThis.MutationObserver = jest.fn(() => ({ observe }));
        delete globalThis.CQ;
    });

    afterEach(() => {
        globalThis.MutationObserver = originalObserver;
        if (originalCQ === undefined) delete globalThis.CQ;
        else globalThis.CQ = originalCQ;
    });

    test('does not observe a published page', () => {
        authorWatch({ element: document.body });
        expect(observe).not.toHaveBeenCalled();
    });

    test('observes the registry when the page exposes CQ', () => {
        window.CQ = {};
        authorWatch({ element: document.body });
        expect(observe).toHaveBeenCalledWith(document.body, { childList: true, subtree: true });
    });
});
