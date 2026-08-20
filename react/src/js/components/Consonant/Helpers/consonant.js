import {
    getByPath,
    isNullish,
    chainFromIterable,
    getSelectedItemsCount,
} from './general';

import { DEFAULT_CONFIG, SORT_TYPES } from './constants';


/**
 * Gets the number of selected filter items
 * @param {Array} filters - filters array
 * @returns {Number} - the number of selected filter items
 */
export const getNumSelectedFilterItems = (filters) => {
    const filterItems = chainFromIterable(filters.map(filter => filter.items));
    return getSelectedItemsCount(filterItems);
};

/**
 * Returns the authored or default configuration value
 * @param {Object} config - main configuration object
 * @returns {Object} - authored or default configuration value
 */
export const makeConfigGetter = config => (object, key) => {
    const objectPath = key ? `${object}.${key}` : object;
    const defaultValue = getByPath(DEFAULT_CONFIG, objectPath);

    const value = getByPath(config, objectPath);

    if (isNullish(value)) {
        return defaultValue;
    }
    return value;
};

/**
 * Gets the sorting option to use
 * @param {Object} config - configuration object
 * @param {String} query - title of a sort option
 * @returns {Object} - Sort Option or default if none is found
 */
export function getDefaultSortOption(config, query) {
    const getConfig = makeConfigGetter(config);
    const sortOptions = getConfig('sort', 'options');
    const sortConstant = SORT_TYPES[query.toUpperCase()];

    return sortOptions.find(option => option.sort === query) || {
        label: sortConstant || 'Featured',
        sort: sortConstant || 'featured',
    };
}
