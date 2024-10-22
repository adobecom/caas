import React, { useState } from 'react';

import { renderHook, act } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';
import {
    useExpandable,
    useConfig,
    useWindowDimensions,
    useLazyLoading,
    useRegistered,
    useURLState,
    debounce,
} from '../hooks';
import { ConfigContext, ExpandableContext } from '../contexts';

import jestMocks from '../../Testing/Utils/JestMocks';

// eslint-disable-next-line react/prop-types
const ExpandableContextProvider = ({ children }) => {
    const [expandValue, setExpand] = useState(null);

    return (
        <ExpandableContext.Provider
            value={{ value: expandValue, setValue: setExpand }}>
            {children}
        </ExpandableContext.Provider>
    );
};

// eslint-disable-next-line react/prop-types
const ConfigContextProvider = ({ children }) => (
    <ConfigContext.Provider value={{ info: { name: 'name' } }}>
        {children}
    </ConfigContext.Provider>
);

describe('utils/hooks', () => {
    describe('useExpandable', () => {
        test('should change expand value if dropdownId provided', () => {
            const { result } = renderHook(() => useExpandable('dropdownId'), {
                wrapper: ExpandableContextProvider,
            });

            expect(result.current[0]).toBe(null);

            act(() => {
                result.current[1]({ stopPropagation: jest.fn() });
            });

            expect(result.current[0]).toBe('dropdownId');

            act(() => {
                result.current[1]({ stopPropagation: jest.fn() });
            });

            expect(result.current[0]).toBe(null);
        });
    });
    describe('useConfig', () => {
        test('should get correct context value', () => {
            const { result } = renderHook(() => useConfig(), {
                wrapper: ConfigContextProvider,
            });

            const name = result.current('info', 'name');

            expect(name).toBe('name');
        });
    });
    describe('useWindowDimensions', () => {
        test('should return window dimensions', async () => {
            global.window.innerWidth = 100;
            global.window.innerHeight = 150;

            const { result } = renderHook(() =>
                useWindowDimensions());

            expect(result.current).toEqual({ width: 100, height: 150 });
        });
    });
    describe('useLazyLoading', () => {
        const imageUrl = 'https://wikipedia.org/wiki.jpeg';

        test('shouldn`t return image url when element.intersectionRatio === 0', async () => {
            jestMocks.intersectionObserver({ intersectionRatio: 0 });

            const { result } = renderHook(() => useLazyLoading({ current: {} }, imageUrl));

            expect(result.current[0]).toBe('');
        });
        test('shouldn`t return image url when ref.current doesn`t exists', async () => {
            jestMocks.intersectionObserver();

            const { result } = renderHook(() => useLazyLoading({}, imageUrl));

            expect(result.current[0]).toBe('');
        });
        test('shouldn`t return image url when ref.current doesn`t exists 2', async () => {
            const unobserve = jest.fn();

            jestMocks.intersectionObserver({
                unobserve,
                observe: (callback) => {
                    setTimeout(() => callback(), 100);
                },
            });
            jestMocks.imageOnLoad({ delay: 500 });

            const {
                result, waitForNextUpdate, unmount,
            } = renderHook(({ imageRef, url }) => useLazyLoading(imageRef, url), {
                initialProps: { imageRef: { current: {} }, url: imageUrl },
            });

            await waitForNextUpdate();

            expect(unobserve).toHaveBeenCalledTimes(0);
            expect(result.current[0]).toBe(imageUrl);

            unmount();

            expect(unobserve).toHaveBeenCalledTimes(1);
            expect(result.current[0]).toBe(imageUrl);
        });
    });
    describe('useURLState', () => {
        test('should parse initial URL state', () => {
            const { result } = renderHook(() => useURLState());

            const expectedState = {};
            const params = new URLSearchParams(window.location.search);
            for (const [key, value] of params.entries()) {
                expectedState[key] = value;
            }

            expect(result.current[0]).toEqual(expectedState);
        });

        test('should set query parameter', () => {
            const { result } = renderHook(() => useURLState());
            const [, setQuery] = result.current;

            act(() => {
                setQuery('testKey', 'testValue');
            });

            expect(result.current[0]).toEqual({ testKey: 'testValue' });
            expect(window.location.search).toContain('testKey=testValue');
        });

        test('should clear query parameters', () => {
            const { result } = renderHook(() => useURLState());
            const [, , clearQuery] = result.current;

            act(() => {
                clearQuery();
            });

            expect(result.current[0]).toEqual({});
            expect(window.location.search).toBe('');
        });
    });
    describe('useRegistered', () => {
        test('should return false if not registered', () => {
            const { result } = renderHook(() => useRegistered());

            expect(result.current).toBe(false);
        });

        test('should return true if registered', async () => {
            const mockGetEventData = jest.fn().mockResolvedValue({ isRegistered: true });
            window.feds = {
                utilities: {
                    getEventData: mockGetEventData,
                },
            };

            const { result, waitForNextUpdate } = renderHook(() => useRegistered());

            await waitForNextUpdate();

            expect(result.current).toBe(true);
        });

        test('should handle error in getEventData', async () => {
            const mockGetEventData = jest.fn().mockRejectedValue(new Error('Error'));
            window.feds = {
                utilities: {
                    getEventData: mockGetEventData,
                },
                data: {
                    eventName: 'testEvent',
                    testEvent: { isRegistered: true },
                    isRegisteredForMax: false,
                },
            };

            const { result, waitForNextUpdate } = renderHook(() => useRegistered());

            await waitForNextUpdate();

            expect(result.current).toBe(true);
        });
    });

    describe('debounce', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });
        afterEach(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });
        test('should delay the function execution', () => {
            const fn = jest.fn();
            const debouncedFn = debounce(fn, 1000);
            debouncedFn();
            expect(fn).not.toBeCalled();
            jest.advanceTimersByTime(500);
            expect(fn).not.toBeCalled();
            jest.advanceTimersByTime(500);
            expect(fn).toBeCalledTimes(1);
        });
        test('should pass arguments to the debounced function', () => {
            const fn = jest.fn();
            const debouncedFn = debounce(fn, 1000);
            debouncedFn('arg1', 'arg2');
            jest.advanceTimersByTime(1000);
            expect(fn).toBeCalledWith('arg1', 'arg2');
        });
        test('should preserve the context of the debounced function', () => {
            const context = { value: 42 };
            const fn = jest.fn(function fn() {
                return this.value;
            });
            const debouncedFn = debounce(fn, 1000);
            debouncedFn.call(context);
            jest.advanceTimersByTime(1000);
            expect(fn).toBeCalled();
            expect(fn.mock.results[0].value).toBe(42);
        });
        test('should cancel the debounced function', () => {
            const fn = jest.fn();
            const debouncedFn = debounce(fn, 1000);
            debouncedFn();
            debouncedFn.cancel();
            jest.advanceTimersByTime(1000);
            expect(fn).not.toBeCalled();
        });
    });
});
