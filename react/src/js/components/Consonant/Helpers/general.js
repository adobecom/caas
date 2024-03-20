import { MinPriorityQueue } from '@datastructures-js/priority-queue';

/**
 * Saves a card to local storage
 * @param {Number} bookmarksValue - The id of the card to save
 * @return {Void}
 */
export const saveBookmarksToLocalStorage = (bookmarksValue) => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarksValue, null, 2));
};

/**
 * Returns all cards saved in local storage
 * @return {Array} - All saved bookmarks
 */
export const readBookmarksFromLocalStorage = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    return Array.isArray(bookmarks) ? bookmarks : [];
};

export const readInclusionsFromLocalStorage = () => {
    const favorites = JSON.parse(localStorage.getItem('chimera.favorites')) || [];
    const schedule = JSON.parse(localStorage.getItem('chimera.schedule')) || [];
    const lastWatched = localStorage.getItem('chimera.lastWatched') || '';

    return new Set([].concat(favorites, [lastWatched], schedule));
};

/**
 * Helper method to truncate strings
 * @param {String} str - The string to truncate
 * @param {Number} num - How much to truncate
 * @return {String} - The truncated string
 */
export const truncateString = (str, num) => {
    if (str.length <= num) return str;
    return `${str.slice(0, num)}...`;
};

/**
 * Helper method to truncate a list of cards
 * @param {Number} limit - How much to truncate by
 * @param {Array} list - What to truncate
 * @return {Array} - The truncated list
 */
export const truncateList = (limit, list) => {
    // No limit, return all;
    if (limit < 0) return list;

    // Slice received data to required q-ty;
    return list.slice(0, limit);
};

/**
 * Helper method to remove duplicate cards from list
 * @param {Array} list - The list of cards
 * @param {key} key - What key to search for duplicates for
 * @return {Array} - A list of cards with no duplicates
 */
export const removeDuplicatesByKey = (list, key) => {
    const newList = [];
    const ids = new Set();
    list.forEach((item) => {
        if (!ids.has(item[key])) {
            newList.push(item);
            ids.add(item[key]);
        }
    });
    return newList;
};

/**
 * Helper method that chains lists together
 * @param {Any} args - Any set of args
 * @example chain(['A', 'B', 'C'], ['D', 'E', 'F']) --> ['A' 'B' 'C' 'D' 'E' 'F']
 */
export const chain = (...args) => args.reduce((a, b) => a.concat(b), []);

/**
 * Helper method that chains iterables together
 * @param {Any} args - Any set of iterable arguments
 * @example chainFromIterable(someIterable) --> ['A' 'B' 'C' 'D' 'E' 'F']
 */
export const chainFromIterable = args => chain(...args);

/**
 * Helper method to determine wheether set A is a superset of set B
 * @param {Set} superset - The first set
 * @param {Set} subset - The second set
 * @return {Boolean} - Whether set A is a superset of set B
 */
export const isSuperset = (superset, subset) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const elem of subset) {
        if (!superset.has(elem)) {
            return false;
        }
    }
    return true;
};

/**
 * Helper method to do determine whether the two sets have an intersection
 * @param {Set} setA - The first set
 * @param {Set} setB - The second set
 * @return {Boolean} - Whether there is an intersection of elements between the sets
 */
export const intersection = (setA, setB) => {
    const intersectionSet = new Set();
    // eslint-disable-next-line no-restricted-syntax
    for (const elem of setB) {
        if (setA.has(elem)) {
            intersectionSet.add(elem);
        }
    }
    return intersectionSet;
};

/**
 * Helper method to sort by keys
 * @param {Iterable} iterable - The iterable object
 * @param {Function} keyFunc - The function to apply
 */
export const sortByKey = (iterable, keyFunc) =>
    [...iterable].sort((a, b) => {
        if (keyFunc(a) < keyFunc(b)) return -1;
        if (keyFunc(a) > keyFunc(b)) return 1;
        return 0;
    });

const allowedChars = /[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s.]/g;

/**
 * Returns cleaned up text
 * don't allow urls
 * @param {String} text - The text so sanitize
 * @return {String} - The cleaned up text
 */
export const sanitizeText = (text) => {
    if (!text) return '';
    let sanitized = text.toLowerCase().trim();
    // remove any invalid chars
    const matchedAllowedChars = sanitized.match(allowedChars);
    sanitized = matchedAllowedChars ? matchedAllowedChars.join('') : '';
    return sanitized;
};

/**
 * For a given object, applies a function to key in that object
 * @param {Object} object - The object to apply the function to
 * @param {Function} func - The function to apply to the entries in the object
 * @return {Object} - The new object
 */
export const mapObject = (object, func) => {
    const newObj = {};
    const keys = Object.keys(object);

    keys.forEach((key) => {
        newObj[key] = func(object[key]);
    });

    return newObj;
};

/**
 * Determines whether the passed in value is an object or not
 * @param {Any} val - Start value in the range array;
 * @return {Boolean} - Whether the passed in value is nullish or not
 */
export const isObject = val => !!val && val.constructor === Object;

/**
 * Support method so HTL/Sightly can pass authored properties to React
 * @param {Object} value - Start value in the range array;
 * @return {Object} - Authored config used by react component
 */
export const parseToPrimitive = (value) => {
    if (isObject(value)) {
        return mapObject(value, parseToPrimitive);
    } else if (Array.isArray(value)) {
        return value.map(parseToPrimitive);
    }

    try {
        return parseToPrimitive(JSON.parse(value));
    } catch (e) {
        return value;
    }
};

/**
 * Determines whether the passed in value is nullish or not
 * @param {Any} val - Start value in the range array;
 * @return {Boolean} - Whether the passed in value is nullish or not
 */
export const isNullish = val =>
    val === undefined || val === null || Number.isNaN(val);

export const isAtleastOneFilterSelected = filters =>
    chainFromIterable(filters.map(f => f.items)).some(item => item.selected);

/**
 * Helper method to stop propagation for events
 * @param {Event} e - The event to stop propagation for
 * @return {Void}
 */
export const stopPropagation = e => e.stopPropagation();

/**
 * Return a range of numbers from [start, ... , end];
 * @param {number} startVal - Start value in the range array;
 * @param {number} end - End value in the range array;
 * @return {Array}
 */
export const generateRange = (startVal, end) => {
    let start = startVal;
    let step = 1;
    const range = [];

    if (end < start) {
        step = -step;
    }

    while (step > 0 ? end >= start : end <= start) {
        range.push(start);
        start += step;
    }

    return range;
};

/**
 * Gets what start and end numbers should be for a given page
 * @param {number} pageCount - Total pages to display
 * @param {number} currentPageNumber - Current page user is on
 * @param {number} totalPages - Total number of pages available
 * @return {Array} - The start and end page numbers
 */
export const getPageStartEnd = (currentPageNumber, pageCount, totalPages) => {
    const halfPageCount = Math.floor(pageCount / 2);
    let start;
    let end;

    if (totalPages <= pageCount + 1) {
        // show all pages
        start = 1;
        end = totalPages;
    } else {
        start = Math.min(
            Math.max(1, currentPageNumber - halfPageCount),
            totalPages - pageCount,
        );
        end = Math.max(
            Math.min(currentPageNumber + halfPageCount, totalPages),
            pageCount + 1,
        );
    }

    return [start, end];
};

/**
 * Gets the start number for Paginator Component
 * @param {Number} currentPageNumber - Current page the user is on
 * @param {Number} showItemsPerPage - How many items to show per page
 * @returns {Number} - The start number for Paginator Component
 */
export const getStartNumber = (currentPageNumber, showItemsPerPage) => {
    if (currentPageNumber === 1) return 1;
    return (currentPageNumber * showItemsPerPage) - (showItemsPerPage - 1);
};

/**
 * Gets the end number for Paginator Component
 * @param {Number} currentPageNumber - Current page the user is on
 * @param {Number} showItemsPerPage - How many items to show per page
 * @param {Number} totalResults - Total count of cards in collection
 * @returns {Number} - The end number for Paginator Component
 */
export const getEndNumber = (
    currentPageNumber,
    showItemsPerPage,
    totalResults,
) => {
    const res = currentPageNumber * showItemsPerPage;
    return res < totalResults ? res : totalResults;
};

/**
 * Gets the end number for Paginator Component
 * @param {string} text - template string like a '{0} {1}'
 * @param {object} props - object with props to replace part of text in brackets
 * @returns {string} - ('{placeholderKey}', { placeholderKey: 'placeholderValue' })
 *  => 'placeholderValue'
 */
export const template = (text = '', props) => {
    if (!props) return text;

    const regExp = /{([A-z]*)}/gi;
    const replacer = (fullMatch, key) => props[key] || fullMatch;

    return text.replace(regExp, replacer);
};

/**
 * Gets the object/path/defaultValue and return object value by this path
 * @param {Object} object - object to get value
 * @param {String} path - path to searched value
 * @param {any} defaultValue - will return when no value was found
 * @returns {any} - searched value
 */
export const getByPath = (object, path, defaultValue) => {
    if (!object || !path) return defaultValue;

    let result = object;
    const chunks = path.split('.');

    for (let index = 0; index < chunks.length; index += 1) {
        const chunk = chunks[index];

        /* eslint-disable-next-line no-prototype-builtins */
        if (result != null && result.hasOwnProperty(chunk)) {
            result = result[chunk];
        } else {
            result = defaultValue;
            break;
        }
    }

    return result;
};

/**
 * Return sum of the selected filters
 * @param {items} array - filter items
 * @returns {number} - selected items count
 */
export const getSelectedItemsCount = items =>
    items.filter(({ selected }) => Boolean(selected)).length;

/**
 * Func to make debounced functions
 * @param {Function} func - target function
 * @param {number} timeout - debounce delay
 * @returns {func} - debounced function
 */
export const debounce = (func, timeout = 0) => {
    let timer;

    return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            func(...args);
        }, timeout);
    };
};

/**
 * Set object value by path
 * @param {Object} object - target object
 * @param {string} path - destination path
 * @param {any} value - value which should be assign
 */
export const setByPath = (object, path, value) => {
    if (!object || !path) return;

    const chunks = path.split('.');
    const withoutLast = chunks.slice(0, -1);
    const lastChunk = chunks[chunks.length - 1];

    const target = withoutLast.reduce((accumulator, chunk) => {
        if (!isObject(accumulator[chunk])) {
            accumulator[chunk] = {};
        }
        return accumulator[chunk];
    }, object);

    target[lastChunk] = value;
};

/**
 * Deep merge objects without undefined values
 * @param {Object} target - target object
 * @param {...Object} sources - objects to merge
 * @return {Obect} merge object
 */
export const mergeDeep = (target, ...sources) => {
    if (!sources.length) return target;

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        const keys = Object.keys(source);

        keys.forEach((key) => {
            if (isObject(source[key])) {
                if (!target[key]) target[key] = {};

                mergeDeep(target[key], source[key]);
            } else if (source[key] !== undefined) {
                Object.assign(target, { [key]: source[key] });
            }
        });
    }

    return mergeDeep(target, ...sources);
};

const isCaasGroup = group => group.indexOf('ch_') === 0;

/**
 * Methods to create/parse queryString
 */
export const qs = {
    parse: (string) => {
        const searchParams = new URLSearchParams(string);

        return [...searchParams.keys()].reduce((accumulator, key) => {
            if (!accumulator[key]) {
                let value = searchParams.getAll(key);

                if (isCaasGroup(key)) {
                    if (value.length === 1) {
                        const [firstItem] = value;

                        if (firstItem.includes('|')) {
                            value = firstItem.split('|');
                        }
                    }
                    accumulator[key] = decodeURIComponent(value);
                } else {
                    accumulator[key] = value;
                }
            }

            return accumulator;
        }, {});
    },
    stringify: (obj, { array } = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(obj).forEach(([key, value]) => {
            if (isCaasGroup(key)) {
                if (Array.isArray(value)) {
                    if (array === 'comma') {
                        searchParams.append(key, encodeURIComponent(value));
                    } else {
                        searchParams.append(key, encodeURIComponent(value.join('|')));
                    }
                } else {
                    searchParams.append(key, encodeURIComponent(value));
                }
            } else {
                searchParams.append(key, value);
            }
        });

        return searchParams.toString();
    },
};

export const isDateWithinInterval = (currentDate, startDate, endDate) => {
    const curr = Date.parse(currentDate);
    const start = Date.parse(startDate);
    const end = Date.parse(endDate);

    return (start <= curr && end > curr);
};

export const isDateBeforeInterval = (currentDate, startDate) => {
    const curr = Date.parse(currentDate);
    const start = Date.parse(startDate);

    return curr < start;
};

export const getCurrentDate = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const servertime = parseInt(urlParams.get('servertime'), 10);
    const timeSinceArrival = performance.now();
    const currDate = servertime ? new Date(servertime + timeSinceArrival) : new Date();
    return currDate;
};

export const getEventBanner = function foo(startDate, endDate, bannerMap) {
    const currDate = getCurrentDate();
    if (isDateWithinInterval(currDate, startDate, endDate)) {
        return bannerMap.live;
    } else if (isDateBeforeInterval(currDate, startDate)) {
        return bannerMap.upcoming;
    }
    return bannerMap.onDemand;
};


export function getTransitions(cardsPtr) {
    const cards = [...cardsPtr];
    const currentDate = getCurrentDate();
    const transitions = new MinPriorityQueue();

    /* eslint-disable no-plusplus */
    for (let i = 0; i < cards.length; i++) {
        const priority = Date.parse(cards[i].startDate) - currentDate;
        if (priority && priority > 0) {
            transitions.enqueue(cards[i], priority);
        }
        const endPriority = Date.parse(Date.parse(cards[i].endDate) - currentDate);
        if (cards[i].endDate && endPriority > 0) {
            transitions.enqueue(null, endPriority);
        }
    }
    return transitions;
}


export const getLinkTarget = (link, ctaAction = '', domain = window.location.hostname) => {
    if (ctaAction) {
        return ctaAction;
    }
    let target = '_blank';
    try {
        const { hostname: linkHostName = '' } = new URL(link);
        if (domain === linkHostName) {
            target = '_self';
        }
    } catch (e) {
        /* eslint-disable-line no-empty */
    }
    return target;
};


export const getGlobalNavHeight = () => {
    const header = document.querySelector('header');
    const offSet = 20; // margin above card collection
    if (!header) return offSet;

    const isBacom = header.getAttribute('daa-lh') && header.getAttribute('daa-lh').includes('bacom');
    const headerWrapper = isBacom ? header : document.querySelector('.feds-header-wrapper');

    return isBacom || (headerWrapper && headerWrapper.classList.contains('feds-header-wrapper--sticky'))
        ? header.offsetHeight + offSet
        : offSet;
};
