
import produce, { enableES5 } from 'immer';

import { HighlightSearchField } from './rendering';
import {
    getByPath,
    setByPath,
    isSuperset,
    intersection,
    sanitizeText,
    chainFromIterable,
    removeDuplicatesByKey,
} from './general';
import { eventTiming } from './eventSort';

/**
 * Needs to be explicitly called by immer - Needed for IE 11 support
 * @type {Function}
 */
enableES5();

/**
 * Determines whether paginator component should display
 * @param {Boolean} enabled - Authored flag whether component should display or not
 * @param {Number} totalCardLimit - Authored limit for how many cards should display
 * @param {Number} totalResults - Total cards in collection
 * @returns {Boolean} - Whether Paginator should display or not
 */
export const shouldDisplayPaginator = (enabled, totalCardLimit, totalResults) => {
    const totalCardLimitNotZero = totalCardLimit > 0;
    const cardLengthExceedsDisplayLimit = totalResults > totalCardLimit;

    return enabled &&
        totalCardLimitNotZero &&
        !cardLengthExceedsDisplayLimit;
};


/**
 * Determines how many cards to show
 * @param {Number} resultsPerPage - How many cards should show per page (Authored Field)
 * @param {Number} currentPage - Current page user is on
 * @param {Number} totalResults - Total cards in collection
 * @returns {Number} - Number of cards to show
 */
export const getNumCardsToShow = (resultsPerPage, currentPage, totalResults) =>
    Math.min(resultsPerPage * currentPage, totalResults);

/**
 * Gets Total Page Count (For Paginator Component)
 * @param {Number} resultsPerPage - How many cards should show per page (Authored Field)
 * @param {Number} totalResults - Total cards in collection
 * @returns {Number} - Total number of pages
 */
export const getTotalPages = (resultsPerPage, totalResults) => {
    if (resultsPerPage === 0) return 0;
    return Math.ceil(totalResults / resultsPerPage);
};

/**
 * Determines whether to show collection cards or bookmarked cards only
 * (If author chooses bookmarks only collection)

 * @param {Boolean} showBookmarksOnly - Authored Flag to Force Card Collection To
 * Only Show Bookmarks
 * @param {Array} bookmarkedCards - Bookmarked cards only
 * @param {Array} collectionCards - All cards
 * @returns {Array} - Which collection of cards to show
 */
export const getCollectionCards = (showBookmarksOnly, bookmarkedCards, collectionCards) => (
    showBookmarksOnly ? bookmarkedCards : collectionCards
);

/**
 * Filter to get all bookmarked cards
 * @param {Array} collectionCards - All cards
 * @returns {Array} - All bookmarked cards
 */
export const getBookmarkedCards =
    collectionCards => collectionCards.filter(card => card.isBookmarked);

/**
 * Gets all filters checked by a user
 * @param {Array} filters - All filters on page
 * @returns {Array} - All checked filters by user
 */
export const getActiveFilterIds = filters => chainFromIterable(filters.map(f => f.items))
    .filter(item => item.selected)
    .map(item => item.id);

/**
 * Gets all filter panels with filters checked by a user
 * @param {Array} activeFilters - All filters checked
 * @returns {Set} - Set of filter panels with filters checked on the page
 */
export const getActivePanels =
    activeFilters => new Set(activeFilters.map(filter => filter.replace(/\/.*$/, '')));

/**
 * Helper method to dermine whether author chose XOR or AND type filtering
 * @param {String} filterType - Filter used in collection
 * @param {Object} filterTypes - All possible filters
 * @returns {Boolean} - Whether collection is using a XOR or AND type filtering
 */
const getUsingXorAndFilter = (filterType, filterTypes) => (
    filterType === filterTypes.XOR || filterType === filterTypes.AND
);

/**
 * Helper method to dermine whether author chose OR type filtering
 * @param {String} filterType - Filter used in collection
 * @param {Object} filterTypes - All possible filters
 * @returns {Boolean} - Whether collection is using OR type filtering
 */
const getUsingOrFilter = (filterType, filterTypes) => (
    filterType === filterTypes.OR
);

/**
 * Will return all cards that match a set of filters
 * @param {Array} cards - All cards in the collection
 * @param {Array} activeFilters - All filters selected by user
 * @param {Array} activePanels - Active filters panels selected by user
 * @param {String} filterType - Filter used in collection
 * @param {Object} filterTypes - All possible filters
 * @returns {Array} - All cards that match filter options
 */
export const getFilteredCards = (cards, activeFilters, activePanels, filterType, filterTypes) => {
    const activeFiltersSet = new Set(activeFilters);

    const usingXorAndFilter = getUsingXorAndFilter(filterType, filterTypes);
    const usingOrFilter = getUsingOrFilter(filterType, filterTypes);

    if (activeFiltersSet.size === 0) return cards;

    return cards.filter((card) => {
        if (!card.tags) {
            return false;
        }

        const tagIds = new Set(card.tags.map(tag => tag.id));

        if (usingXorAndFilter) {
            return isSuperset(tagIds, activeFiltersSet);
        } else if (usingOrFilter && activePanels.size < 2) {
            return intersection(tagIds, activeFiltersSet).size;
        } else if (usingOrFilter) {
            // check if card' tags panels include all panels with selected filters
            const tagPanels = new Set(card.tags.map(tag => tag.id.replace(/\/.*$/, '')));
            if (!isSuperset(tagPanels, activePanels)) return false;

            // check if card' tags include all panels with selected filters
            let allPanelsMatch = true;
            // eslint-disable-next-line no-restricted-syntax
            for (const panel of activePanels) {
                const filtersCheckedInPanel = new Set([...activeFiltersSet]
                    .filter(id => id.includes(panel, 0)));
                if (!intersection(tagIds, filtersCheckedInPanel).size) {
                    allPanelsMatch = false;
                }
            }
            return allPanelsMatch;
        }
        throw new Error(`Unrecognized filter type: ${filterType}`);
    });
};

/**
 * If a card matches a search query, this method will highlight it
 * @param {Array} baseCard - Card to highlight
 * @param {Array} searchField - Field that matches Query
 * @param {String} query - The users search query
 * @returns {Card} The highlighted caard
 */
export const highlightCard = (baseCard, searchField, query) => produce(baseCard, (draftCard) => {
    const searchFieldValue = getByPath(draftCard, searchField, null);
    if (searchFieldValue === null || searchFieldValue === '') return;
    const highlightedSearchFieldValue = HighlightSearchField(searchFieldValue, query);
    setByPath(draftCard, searchField, highlightedSearchFieldValue);
});

/**
 * If a card matches a search query, this method will highlight it
 * @param {Array} searchField - Field that matches Query
 * @param {Array} card - Card to check
 * @param {String} query - The users search query
 * @returns {Boolean} If the card matches the user's search query
 */
const cardMatchesQuery = (searchField, card, searchQuery) => {
    const searchFieldValue = getByPath(card, searchField, '');
    const cleanSearchFieldValue = sanitizeText(searchFieldValue);
    return cleanSearchFieldValue.includes(searchQuery);
};

/**
 * Helper to implement Set() data structure w/ Vanilla Arrays
 * Would've used new Set(), but polyfill has bug in IE11 converting Array.from(new Set())
 *
 * @param {Array} cards
 * @return {Array} - Unique Card Set from Cards (filtering based off unique card ids)
 */
const getUniqueCardSet = (cards) => {
    const uniqueCardSet = [];
    cards.forEach((card) => {
        const cardNotInSet = uniqueCardSet.findIndex(element => element.id === card.id) <= -1;
        if (cardNotInSet) {
            uniqueCardSet.push(card);
        }
    });
    return uniqueCardSet;
};

/**
 * Gets all cards that matches a users search query
 * @param {Array} cards - All cards in the card collection
 * @param {Array} searchFields - All authored search fields to check
 * @param {String} query - The users search query
 * @returns {Array} - All cards that match the user's query for a given set of search fields
 */
export const getCardsMatchingQuery = (cards, searchFields, query) => {
    const cardsMatchingQuery = [];
    cards.forEach((card) => {
        searchFields.forEach((searchField) => {
            if (cardMatchesQuery(searchField, card, query)) {
                cardsMatchingQuery.push(card);
            }
        });
    });
    return getUniqueCardSet(cardsMatchingQuery);
};
/**
 * @func hasTag
 * @desc Does current entity have a specific tag?
 * @param {RegExp} compare a regEx pattern to test for
 * @param {Array} tags an array of tags
 */
export const hasTag = (compare, tags = []) => {
    if (!tags.length || compare.constructor.name !== 'RegExp') return false;

    return tags.some(({ id = '' } = {}) => id && compare.test(id));
};

/**
 * Returns all cards title sorted (A-Z)
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - All cards sorted by title
 */
export const getTitleAscSort = cards => cards.sort((cardOne, cardTwo) => {
    const cardOneTitle = getByPath(cardOne, 'contentArea.title');
    const cardTwoTitle = getByPath(cardTwo, 'contentArea.title');
    return cardOneTitle.localeCompare(cardTwoTitle);
});

/**
 * Returns all cards title sorted (Z-A)
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - All cards sorted by title
 */
export const getTitleDescSort = cards => getTitleAscSort(cards).reverse();

/**
 * Returns all cards sorted by date modified newest to oldest
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - All cards sorted by title
 */
export const getModifiedDescSort = cards => cards.sort((cardOne, cardTwo) => {
    const cardOneModDate = getByPath(cardOne, 'modifiedDate');
    const cardTwoModDate = getByPath(cardTwo, 'modifiedDate');
    if (cardOneModDate && cardTwoModDate) {
        return cardTwoModDate.localeCompare(cardOneModDate);
    }
    return 0;
});

/**
 * Returns all cards sorted by date modified oldest to newest
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - All cards sorted by title
 */
export const getModifiedAscSort = cards => getModifiedDescSort(cards).reverse();

/**
 * Returns all cards Featured sorted
 * This just returns the original cards returned by Chimera IO
 * Chimera IO is responsible for handling featured sort
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - Cards in the original order given by Chimera IO
 */
export const getFeaturedSort = cards => cards;

/**
 * Returns all Cards Date Sorted (Old To New)
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - All cards sorted by Date
 */
export const getDateAscSort = cards => cards.sort((cardOne, cardTwo) => {
    const cardOneDate = getByPath(cardOne, 'cardDate');
    const cardTwoDate = getByPath(cardTwo, 'cardDate');
    if (cardOneDate && cardTwoDate) {
        return cardOneDate.localeCompare(cardTwoDate);
    }
    return 0;
});

/**
 * Returns all Cards Date Sorted (New To Old)
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - All cards sorted by Date
 */
export const getDateDescSort = cards => getDateAscSort(cards).reverse();

/**
 * @func getEventSort
 * @desc This method, if needed, sets up Timing features for a collection
 (1) Has to check each card for card.contentArea.dateDetailText.startTime
 || endTime, if neither the card gets pushed to back of stack.
 (2) There are six categories for consideration
 a. Live: Current Time > Start Time && Current Time < End Time
 b. Upcoming: Current Time < Start Time and does not have
 "OnDemand scheduled" tag which cannot show until it is onDemand
 c. "OnDemand scheduled": UpComing, and has "OnDemand scheduled" tag,
 will not be seen until it is OnDemand.
 d. OnDemand: Current Time > End Time, does not have "Live Expired" tag
 e. Live Expired: OnDemand, has "live-expired" tag, and is no longer shown.
 f. All other cards, not having startTime || endTime.
 * @param {Array} cards - All cards in the card collection
 * @param {Object} urlState - URL search/query Params.
 * @returns {Array} visibleCards
 */
export const getEventSort = (cards = [], eventFilter) => eventTiming(cards, eventFilter);

/**
 * Gets all cards that matches a users search query
 * @param {String} query - The users search query
 * @param {Array} cards - All cards in the card collection
 * @param {Array} searchFields - All authored search fields to check
 * @returns {Array} - All cards that match the user's query for a given set of search fields
 */
export const getCardsMatchingSearch = (query, cards, searchFields) => {
    if (!query) {
        return cards;
    }
    const searchQuery = sanitizeText(query);
    const cardsMatchingQuery = getCardsMatchingQuery(cards, searchFields, searchQuery);
    return cardsMatchingQuery;
};

/**
 * Joins two sets of cards
 * @param {Array} cardSetOne - Set one of cards to join
 * @param {Array} cardSetTwo - Set two of cards to join
 * @returns {Array} - Cards sets one and two joined
 */
const joinCardSets = (cardSetOne, cardSetTwo) => cardSetOne.concat(cardSetTwo);

/**
 * Processes featured cards with raw cards received from API response
 * @param {Array} featuredCards - Authored Featured Cards
 * @param {Array} rawCards - Cards from API response
 * @returns {Array} - Set of cards processed
 */
export const processCards = (featuredCards, rawCards) => removeDuplicatesByKey(joinCardSets(featuredCards, rawCards), 'id');

/**
 * Helper method for effect that adds bookmark meta data to cards
 * @param {Array} cards - All cards in card collection
 * @param {Array} bookmarkedCardIds - All bookmarked card ids
 * @returns {Array} - Cards with bookmark meta data
 */
export const getUpdatedCardBookmarkData = (cards, bookmarkedCardIds) => cards.map(card => ({
    ...card,
    isBookmarked: bookmarkedCardIds.some(i => i === card.id),
}));

const cache = new Map();

/**
 * Returns a random number from [start, bound)
 * @param {int} start - Starting bound (inclusive)
 * @param {int} end - Ending bound (exclusive)
 * @returns {int} - A random integer between [start, bound)
 */
function getRandom(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}

/**
 * Returns a random sample of sampleSize from an array stream
 * @param {Array} stream - An array of items to select a random sample from
 * @param {int} sampleSize - The size of the random sample
 * @returns {Array} - A random sample from the array stream
 */
function reservoirSample(stream, sampleSize) {
    const reservoir = [];
    /* eslint-disable-next-line no-restricted-syntax */
    for (const [i, val] of Object.entries(stream)) {
        if (reservoir.length < sampleSize) {
            reservoir.push(val);
        } else {
            const random = getRandom(0, i + 1);
            if (random < sampleSize) {
                reservoir[random] = val;
            }
        }
    }
    return reservoir;
}

/**
 * Returns the input array randomly shuffled using the Fisher-Yates algorithm.
 *
 * @param {Array} arr - Array to be shuffled
 * @returns {Array} - The shuffled array
 */
function fischerYatesShuffle(arr) {
    let currentIndex = arr.length;
    let randomIndex;
    while (currentIndex !== 0) {
        randomIndex = getRandom(0, currentIndex);
        /* eslint-disable-next-line no-plusplus */
        currentIndex--;
        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr;
}

/**
 * Returns an an array of randomly sorted cards.
 *
 * If the cards for a given card collection have already been sorted, return from cache.
 * Otherwise sort randomly and cache result.
 *
 * @param {Array} cards - cards to be randomly sorted
 * @param {int} id - Id of the card collection the cards belong to.
 * @param {int} sampleSize - sample size used for the random sample
 * @returns {Array} - An array of randomly sorted cards
 */
export const getRandomSort = (cards, id, sampleSize, reservoirSize) => {
    if (!cache.get(id)) {
        const stream = fischerYatesShuffle(cards.slice(0, reservoirSize));
        const randomSample = reservoirSample(stream, sampleSize);
        cache.set(id, randomSample);
    }
    return cache.get(id);
};

export const getFeaturedCards = (ids, cards) => {
    const ans = [];
    /* eslint-disable no-restricted-syntax */
    for (const id of ids) {
        for (const card of cards) {
            if (card.id === id) {
                const c = window.structuredClone(card);
                c.isFeatured = true;
                ans.push(c);
            }
        }
    }
    return ans;
};
