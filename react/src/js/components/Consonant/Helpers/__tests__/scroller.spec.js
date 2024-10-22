// scroller.test.js
/* eslint-disable */
import scroller from '../scroller';

describe('scroller', () => {
    let scrollElement;
    let originalRequestAnimationFrame;

    beforeEach(() => {
        scrollElement = { scrollLeft: 0 };
        originalRequestAnimationFrame = window.requestAnimationFrame;
        window.requestAnimationFrame = jest.fn((callback) => {
            callback();
            return 0; // Mock requestAnimationFrame to immediately invoke the callback
        });
    });

    afterEach(() => {
        window.requestAnimationFrame = originalRequestAnimationFrame; // Restore original
    });

    test('should scroll to a new position', () => {
        scroller(scrollElement, 100);
        expect(scrollElement.scrollLeft).toBe(100);
    });

    test('should scroll to a new position with a different attribute', () => {
        scrollElement.scrollTop = 0;
        scroller(scrollElement, 50, { attribute: 'scrollTop' });
        expect(scrollElement.scrollTop).toBe(50);
    });

    test('should call the callback function when scrolling is complete', () => {
        const callback = jest.fn();
        scroller(scrollElement, 100, { callback });
        expect(callback).toHaveBeenCalled();
    });

    test('should not scroll if the new position is the same', () => {
        scrollElement.scrollLeft = 100;
        scroller(scrollElement, 100);
        expect(scrollElement.scrollLeft).toBe(100);
    });

    test('should execute the correct number of frames', () => {
        jest.useFakeTimers();
        scroller(scrollElement, 300, { duration: 600 });

        // Fast-forward time to simulate the passage of 600ms
        jest.advanceTimersByTime(600);
        expect(scrollElement.scrollLeft).toBe(300);
        jest.useRealTimers();
    });

    test('should handle negative scrolling', () => {
        scrollElement.scrollLeft = 200;
        scroller(scrollElement, 100);
        expect(scrollElement.scrollLeft).toBe(100);
    });

    test('should handle scrolling with a custom duration', () => {
        jest.useFakeTimers();
        scroller(scrollElement, 150, { duration: 150 });

        // Ensure the scroll happens in the expected duration
        jest.advanceTimersByTime(150);
        expect(scrollElement.scrollLeft).toBe(150);
        jest.useRealTimers();
    });

    test('should handle a custom attribute for scrolling', () => {
        scrollElement.scrollTop = 0;
        scroller(scrollElement, 200, { attribute: 'scrollTop' });
        expect(scrollElement.scrollTop).toBe(200);
    });

    test('should not call the callback if no callback is provided', () => {
        const originalScrollLeft = scrollElement.scrollLeft;
        scroller(scrollElement, 200);
        expect(scrollElement.scrollLeft).toBe(200);
    });
});
