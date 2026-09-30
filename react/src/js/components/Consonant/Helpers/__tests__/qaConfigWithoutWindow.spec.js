/** @jest-environment node */
import { applyQaConfigOverride } from '../general';

test('does not apply browser QA overrides in a non-window environment', () => {
    const config = { collection: { size: 3 } };
    const locationDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'location');
    const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    const getItem = jest.fn(() => JSON.stringify({ collection: { size: 99 } }));
    Object.defineProperty(globalThis, 'location', { configurable: true, value: { search: '?caasqa=1' } });
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem } });
    try {
        expect(globalThis.window).toBeUndefined();
        expect(applyQaConfigOverride(config)).toBe(config);
        expect(getItem).not.toHaveBeenCalled();
    } finally {
        if (locationDescriptor) Object.defineProperty(globalThis, 'location', locationDescriptor);
        else delete globalThis.location;
        if (storageDescriptor) Object.defineProperty(globalThis, 'localStorage', storageDescriptor);
        else delete globalThis.localStorage;
    }
});
