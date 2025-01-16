import PROPS from '../TestingConstants/general';
import jestMocks from '../../Testing/Utils/JestMocks';

import {
    chain,
    isObject,
    sortByKey,
    mapObject,
    isNullish,
    isSuperset,
    intersection,
    sanitizeText,
    truncateList,
    truncateString,
    generateRange,
    getLinkTarget,
    getPageStartEnd,
    getStartNumber,
    getEndNumber,
    stopPropagation,
    parseToPrimitive,
    chainFromIterable,
    removeDuplicatesByKey,
    isAtleastOneFilterSelected,
    saveBookmarksToLocalStorage,
    readBookmarksFromLocalStorage,
    getByPath,
    setByPath,
    getSelectedItemsCount,
    debounce,
    mergeDeep,
    template,
} from '../general';

jest.useFakeTimers();

describe('utils/general', () => {
    jestMocks.localStorage();

    describe('localStorage', () => {
        afterEach(() => {
            window.localStorage.clear();
        });

        describe('saveBookmarksToLocalStorage', () => {
            test('should save item to localStorage', () => {
                const list = [1, 2, 3];
                const stringifyList = JSON.stringify(list, null, 2);

                saveBookmarksToLocalStorage(list);

                const bookmarksValue = window.localStorage.getItem('bookmarks');

                expect(bookmarksValue).toEqual(stringifyList);
            });
        });
        describe('readBookmarksFromLocalStorage', () => {
            PROPS.readBookmarksFromLocalStorage.forEach(({ value, expectedValue }) => {
                test(`shouldn't return ${expectedValue}`, () => {
                    window.localStorage.setItem('bookmarks', value);

                    const bookmarksValue = readBookmarksFromLocalStorage();

                    expect(bookmarksValue).toEqual(expectedValue);
                });
            });
        });
    });

    describe('truncateString', () => {
        PROPS.truncateString.forEach(({ str, num, expectedValue }) => {
            test(`shouldn't return ${expectedValue} value`, () => {
                const value = truncateString(str, num);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('truncateList', () => {
        PROPS.truncateList.forEach(({ limit, list, expectedValue }) => {
            test(`shouldn't return array length === ${expectedValue}`, () => {
                const value = truncateList(limit, list);

                expect(value).toHaveLength(expectedValue);
            });
        });
    });
    describe('removeDuplicatesByKey', () => {
        PROPS.removeDuplicatesByKey.forEach(({ list, key, expectedValue }) => {
            test(`shouldn't return array length === ${expectedValue}`, () => {
                const value = removeDuplicatesByKey(list, key);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('chain', () => {
        test('shouldn`t create new array from arguments', () => {
            const arrayFromArguments = chain(1, 'string', null, undefined);

            expect(arrayFromArguments).toEqual([1, 'string', null, undefined]);
        });
    });
    describe('chainFromIterable', () => {
        test('shouldn`t clone array', () => {
            const clonedArray = chainFromIterable([1, 'string', null, undefined]);

            expect(clonedArray).toEqual([1, 'string', null, undefined]);
        });
    });
    describe('isSuperset', () => {
        PROPS.isSuperset.forEach(({ superset, subset, expectedValue }) => {
            test('should return true if subset is a part of superset, else should return false', () => {
                const value = isSuperset(superset, subset);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('intersection', () => {
        PROPS.intersection.forEach(({ superset, subset, expectedValue }) => {
            test('should return a new set with the matched values', () => {
                const value = intersection(superset, subset);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('sortByKey', () => {
        PROPS.sortByKey.forEach(({ iterable, keyFunc, expectedValue }) => {
            test('should return sorted object', () => {
                const value = sortByKey(iterable, keyFunc);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('sanitizeText', () => {
        PROPS.sanitizeText.forEach(({ text, expectedValue }) => {
            test('should return sanitized text', () => {
                const value = sanitizeText(text);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('mapObject', () => {
        PROPS.mapObject.forEach(({ object, func, expectedValue }) => {
            test('should return new object with mapped values', () => {
                const value = mapObject(object, func);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('isObject', () => {
        PROPS.isObject.forEach(({ val, expectedValue }) => {
            test('should return true if value is object, else return false', () => {
                const value = isObject(val);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('parseToPrimitive', () => {
        PROPS.parseToPrimitive.forEach(({ value, expectedValue }) => {
            test('should recursively parse to primitive', () => {
                const val = parseToPrimitive(value);

                expect(val).toEqual(expectedValue);
            });
        });
    });
    describe('isNullish', () => {
        PROPS.isNullish.forEach(({ val, expectedValue }) => {
            test('should return true if value is undefined/null/NaN, else return false', () => {
                const value = isNullish(val);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('isAtleastOneFilterSelected', () => {
        PROPS.isAtleastOneFilterSelected.forEach(({ filters, expectedValue }) => {
            test('should return true if at least one filter is selected', () => {
                const value = isAtleastOneFilterSelected(filters);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('stopPropagation', () => {
        test('should call stopPropagation', () => {
            const handleStopPropagation = jest.fn();

            stopPropagation({ stopPropagation: handleStopPropagation });

            expect(handleStopPropagation).toHaveBeenCalledTimes(1);
        });
    });
    describe('generateRange', () => {
        PROPS.generateRange.forEach(({ startVal, end, expectedValue }) => {
            test('should return generated range', () => {
                const value = generateRange(startVal, end);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getPageStartEnd', () => {
        PROPS.getPageStartEnd.forEach(({
            currentPageNumber, pageCount, totalPages, expectedValue,
        }) => {
            test('should return array with start and end', () => {
                const value = getPageStartEnd(
                    currentPageNumber,
                    pageCount,
                    totalPages,
                );

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getStartNumber', () => {
        PROPS.getStartNumber.forEach(({
            currentPageNumber, showItemsPerPage, expectedValue,
        }) => {
            test('should return start number', () => {
                const value = getStartNumber(
                    currentPageNumber,
                    showItemsPerPage,
                );

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getEndNumber', () => {
        PROPS.getEndNumber.forEach(({
            currentPageNumber, showItemsPerPage, totalResults, expectedValue,
        }) => {
            test('should return start number', () => {
                const value = getEndNumber(
                    currentPageNumber,
                    showItemsPerPage,
                    totalResults,
                );

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getByPath', () => {
        PROPS.getByPath.forEach(({
            object, path, defaultValue, expectedValue,
        }) => {
            test('should return correct value', () => {
                const value = getByPath(
                    object,
                    path,
                    defaultValue,
                );

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getSelectedItemsCount', () => {
        PROPS.getSelectedItemsCount.forEach(({
            items, expectedValue,
        }) => {
            test('should return correct count', () => {
                const count = getSelectedItemsCount(items);

                expect(count).toEqual(expectedValue);
            });
        });
    });
    describe('setByPath', () => {
        PROPS.setByPath.forEach(({
            object, path, value, expectedValue,
        }) => {
            test('should return correct value', () => {
                setByPath(
                    object,
                    path,
                    value,
                );

                expect(object).toEqual(expectedValue);
            });
        });
    });
    describe('mergeDeep', () => {
        PROPS.mergeDeep.forEach(({
            firstObj, secondObj, expectedValue,
        }) => {
            test('should return correct value', () => {
                const target = mergeDeep(firstObj, secondObj);

                expect(target).toEqual(expectedValue);
            });
        });
    });
    describe('template', () => {
        PROPS.template.forEach(({
            text, props, expectedValue,
        }) => {
            test('should return correct value', () => {
                const templatedText = template(text, props);

                expect(templatedText).toEqual(expectedValue);
            });
        });
    });
    describe('debounce', () => {
        test('should return correct value', () => {
            const func = jest.fn();

            const debouncedFunc = debounce(func);

            debouncedFunc();
            debouncedFunc();
            debouncedFunc();
            debouncedFunc();

            jest.runAllTimers();

            expect(func).toHaveBeenCalledTimes(1);
        });
    });
    describe('getLinkTarget', () => {
        PROPS.getLinkTarget.forEach(({
            domain, link, authoredPageProp, expectedValue,
        }) => {
            test('should return correct value', () => {
                const target = getLinkTarget(link, authoredPageProp, domain);
                expect(target).toEqual(expectedValue);
            });
        });
    });
});
