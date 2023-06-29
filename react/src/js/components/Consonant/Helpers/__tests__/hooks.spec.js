import React, { useState } from 'react';

import { renderHook, act } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';
import {
    useExpandable,
    useConfig,
    useWindowDimensions,
    useLazyLoading,
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

            const { result, waitForNextUpdate } = renderHook(() =>
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
});
