import {
    getFilteredCards,
    getCardsMatchingSearch,
    highlightCard,
    getDateAscSort,
    getDateDescSort,
    getModifiedDescSort,
    getModifiedAscSort,
    getEventSort,
    getFeaturedSort,
    getTitleAscSort,
    getTitleDescSort,
    getRandomSort,
    getFeaturedCards,
} from './Helpers';
import { SORT_TYPES } from './constants';
import { filterCardsByDateRange } from './cards';
import { removeDuplicatesByKey, truncateList } from './general';

/**
 * Class that will constrain result set based on current state of the component
 *
 * @export
 * @class CardFilterer
 */
export default class CardFilterer {
    /**
     * Creates an instance of a CardFilterer
     *
     * @param {*} cardsToFilter
     * @param {*} randomSortId
     * @param {*} reservoirSize
     * @memberof CardFilterer
     */
    constructor(cardsToFilter, randomSortId, sampleSize, reservoirSize, ids = []) {
        this.sampleSize = sampleSize;
        this.filteredCards = cardsToFilter;
        this.randomSortId = randomSortId;
        this.reservoirSize = reservoirSize;
        this.featuredCards = getFeaturedCards(ids, this.filteredCards);
    }

    /**
     * Given a set of filters a user selected, this method will return all cards that contain
     * those filtlers
     *
     * @param {*} activeFilters
     * @param {*} activePanels
     * @param {*} filterType
     * @param {*} filterTypes
     * @return {*} Chainable
     * @memberof CardFilterer
     */
    filterCards(activeFilters, activePanels, filterType, filterTypes) {
        this.filteredCards = getFilteredCards(
            this.filteredCards,
            activeFilters,
            activePanels,
            filterType,
            filterTypes,
        );
        return this;
    }

    /**
     * Given a user search query and the fields to search, this method will return all cards that
     * match that query.
     *
     * @param {*} searchQuery
     * @param {*} searchFields
     * @return {*} Chainable
     * @memberof CardFilterer
     */
    searchCards(searchQuery, searchFields, cardStyle) {
        const query = searchQuery.trim().toLowerCase();
        const cardsMatchingSearch = getCardsMatchingSearch(
            searchQuery,
            this.filteredCards,
            searchFields,
        );

        if (query.length >= 3 && cardStyle !== 'custom-card') {
            this.filteredCards = cardsMatchingSearch
                .map(card => searchFields.reduce((baseCard, searchField) => highlightCard(
                    baseCard,
                    searchField,
                    query,
                ), card));
        } else {
            this.filteredCards = cardsMatchingSearch;
        }

        return this;
    }

    /**
     * This method will return a chainable of all cards sorted by a given sort option
     *
     * @param {*} sortOption
     * @return {*} Chainable
     * @memberof CardFilterer
     */
    sortCards(sortOption, eventFilter, featuredCardIds, hideCtaIds, isFirstLoad) {
        if (!this.filteredCards.length) return this;

        const sortType = sortOption ? sortOption.sort.toLowerCase() : null;

        switch (sortType) {
            case SORT_TYPES.DATEASC:
                this.filteredCards = getDateAscSort(this.filteredCards);
                break;
            case SORT_TYPES.DATEDESC:
                this.filteredCards = getDateDescSort(this.filteredCards);
                break;
            case SORT_TYPES.MODIFIEDDESC:
                this.filteredCards = getModifiedDescSort(this.filteredCards);
                break;
            case SORT_TYPES.MODIFIEDASC:
                this.filteredCards = getModifiedAscSort(this.filteredCards);
                break;
            case SORT_TYPES.EVENTSORT: {
                const {
                    nextTransitionMs,
                    visibleSessions = [],
                } = getEventSort(this.filteredCards, eventFilter);

                this.filteredCards = visibleSessions;

                if (nextTransitionMs > 0) {
                    this.nextTransitionMs = nextTransitionMs;
                }

                break;
            }
            case SORT_TYPES.FEATURED:
                this.filteredCards = getFeaturedSort(this.filteredCards);
                break;
            case SORT_TYPES.TITLEASC:
                this.filteredCards = getTitleAscSort(this.filteredCards);
                break;
            case SORT_TYPES.TITLEDESC:
                this.filteredCards = getTitleDescSort(this.filteredCards);
                break;
            case SORT_TYPES.RANDOM:
                this.filteredCards = getRandomSort(
                    this.filteredCards,
                    this.randomSortId,
                    this.sampleSize,
                    this.reservoirSize,
                );
                break;
            default:
                break;
        }
        if (isFirstLoad || sortType === SORT_TYPES.FEATURED) {
            this.filteredCards = removeDuplicatesByKey(this.featuredCards.concat(this.filteredCards), 'id');
        }
        return this;
    }
    /**
     * If cards were authored to be shown or hidden based off a given date range, this method
     * constrains the result set to only cards that should be shown within that date interval.
     *
     * @return {*} Chainable
     * @memberof CardFilterer
     */
    keepCardsWithinDateRange() {
        if (!this.filteredCards.length) return this;

        this.filteredCards = filterCardsByDateRange(this.filteredCards);

        return this;
    }
    /**
     * If a bookmark only collection is authored, this method will constrain result set to only
     * cards that were saved.
     *
     * @param {*} onlyShowBookmarks
     * @param {*} bookmarkedCardIds
     * @param {*} showBookmarks
     * @return {*} Chainable
     * @memberof CardFilterer
     */
    keepBookmarkedCardsOnly(onlyShowBookmarks, bookmarkedCardIds, showBookmarks) {
        if (onlyShowBookmarks || showBookmarks) {
            this.filteredCards = this.filteredCards
                .filter(card => bookmarkedCardIds.includes(card.id));
        }
        return this;
    }

    removeCards(ids) {
        this.filteredCards = this.filteredCards.filter(card => !ids.has(card.id));
        return this;
    }

    /**
     * If a total card limit is authored, this method will truncate returned cards to adhere to
     * that limit.
     *
     * @param {*} totalCardLimit
     * @return {*} Chainable
     * @memberof CardFilterer
     */
    truncateList(totalCardLimit) {
        if (!this.filteredCards.length) return this;

        this.filteredCards = truncateList(totalCardLimit, this.filteredCards);

        return this;
    }
}
