import {
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { qs, getByPath } from './general';
import { makeConfigGetter } from './consonant';
import {
    ConfigContext,
    ExpandableContext,
} from './contexts';
import { ROOT_MARGIN_DEFAULT } from './constants';

/* eslint-disable */
export function debounce(fn, wait) {
    var timeout = void 0;

    var cancel = function cancel() {
        if (timeout) {
            clearTimeout(timeout);
        }
    };

    // Return non-arrow func to preserve this context
    var debounceFunc = function debounceFunc() {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var functionCall = function functionCall() {
            return fn.apply(_this, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, wait);
    };

    debounceFunc.cancel = cancel;

    return debounceFunc;
};
/* eslint-enable */

/**
 * @typedef {function(): {Int, Int}} WindowDimensionsState - Current Window Dimensions
 * @description — Returns Current Window Dimensions
 *
 * @type {function(): {Int, Int}} WindowDimensions
 */
export const useWindowDimensions = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
});

/**
 * @typedef {String} OpenDropdownState - Id of a selected dropdown
 * @description — Passed in Context Provider So All Nested Components can be in sync
 *
 * @typedef {Function} OpenDropdownStateSetter - handleToggle sets dropdown state
 * @description - This handles keeping multiple popup states in sync
 *
 * @type {[String, Function]} OpenDropdown
 */
export const useExpandable = (dropdownId) => {
    const { value: openDropdown, setValue: setOpenDropdown } = useContext(ExpandableContext);
    const handleToggle = useCallback((e) => {
        e.stopPropagation();
        if (openDropdown === dropdownId) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdownId);
        }
    }, [setOpenDropdown, openDropdown]);

    return [openDropdown, handleToggle];
};

/**
 * @typedef {Function} ConfigStateSetter
 * @description - Configs are grabbed from Authoring Dialog and passed into React Component
 *
 * @type {[Number, Function]} Config
 */
export const useConfig = () => {
    const config = useContext(ConfigContext);
    return useCallback(makeConfigGetter(config), [config]);
};

/**
 * @typedef {Image} LazyLoadedImageState
 * @description — Has image as state after image is lazy loaded
 *
 * @typedef {Function} LazyLoadedImageStateSetter
 * @description - Sets state once image is lazy loaded
 *
 * @type {[Image]} LazyLoadedImage
 */
export const useLazyLoading = (imageRef, image) => {
    const options = {
        rootMargin: ROOT_MARGIN_DEFAULT,
    };
    const [lazyLoadImage, setLazyLoadImage] = useState('');
    const [intersectionImage, setIntersectionImage] = useState('');

    const imageObserver = new IntersectionObserver((elements) => {
        if (elements[0].intersectionRatio !== 0) {
            setIntersectionImage(image);
        }
    }, options);

    useEffect(() => {
        let img;
        if (intersectionImage) {
            img = new Image();

            img.src = intersectionImage;
            img.onload = () => {
                setLazyLoadImage(intersectionImage);
            };
        }
        return () => {
            if (img) {
                img.onload = () => {};
            }
        };
    }, [intersectionImage]);

    useEffect(() => {
        if (imageRef.current) {
            imageObserver.observe(imageRef.current);
        }
        return () => {
            imageObserver.unobserve(imageRef.current);
        };
    }, [imageRef]);

    return [lazyLoadImage];
};

/**
 * Create a state that is sync with url search param.
 *
 * @type {Object, Function, Function]} urlState, handleSetQuery, handleClearQuery
 */
export const useURLState = () => {
    const {
        location: { search, pathname, hash },
    } = window;

    const [urlState, setUrlState] = useState(qs.parse(search));

    const handleSetQuery = useCallback((key, value) => {
        setUrlState((origin) => {
            if (!value || (Array.isArray(value) && !value.length)) {
                const cloneOrigin = { ...origin };
                delete cloneOrigin[key];

                return cloneOrigin;
            }

            return { ...origin, [key]: value };
        });
    }, []);

    const handleClearQuery = useCallback(() => {
        setUrlState({});
    }, []);

    useEffect(() => {
        const searchString = qs.stringify(urlState, { array: 'comma' });
        const urlString = `${pathname}${searchString ? '?' : ''}${searchString}${hash}`;

        window.history.replaceState(null, '', urlString);
    }, [urlState]);

    return [urlState, handleSetQuery, handleClearQuery];
};

export const useRegistered = () => {
    const [registered, setRegistered] = useState(false);

    function isRegisteredForEvent() {
        const fedsData = getByPath(window, 'feds.data', null);
        const eventName = getByPath(fedsData, 'eventName', null);
        const eventData = eventName && fedsData[eventName] ? fedsData[eventName] : null;
        const isUserRegistered = eventData ? eventData.isRegistered : null;

        const isRegisteredForMax = getByPath(fedsData, 'isRegisteredForMax', null);

        return !!((isUserRegistered || isRegisteredForMax));
    }

    useEffect(() => {
        if (!registered) {
            const fedsUtilities = getByPath(window, 'feds.utilities', null);
            const getEventData = fedsUtilities ? fedsUtilities.getEventData : null;
            if (getEventData) {
                getEventData()
                    .then((response = {}) => {
                        const { isRegistered } = response;
                        if (isRegistered) {
                            setRegistered(true);
                        }
                    })
                    .catch(() => {
                        const newIsRegistered = isRegisteredForEvent();
                        if (newIsRegistered) {
                            setRegistered(newIsRegistered);
                        }
                    });
            }
        }
    }, [registered]);

    return registered;
};
