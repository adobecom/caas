import React, {
    Fragment,
    useEffect,
    useRef,
    useState,
    createRef,
} from 'react';
import classNames from 'classnames';
import { shape } from 'prop-types';
import 'whatwg-fetch';
import { logLana } from '../Helpers/lana';
import Popup from '../Sort/Popup';
import Search from '../Search/Search';
import Loader from '../Loader/Loader';
import {
    getByPath,
    saveBookmarksToLocalStorage,
    readBookmarksFromLocalStorage,
    readInclusionsFromLocalStorage,
    getTransitions,
} from '../Helpers/general';
import { configType } from '../types/config';
import CardsCarousel from '../CardsCarousel/CardsCarousel';
import NoResultsView from '../NoResults/View';
import LoadMore from '../Pagination/LoadMore';
import Bookmarks from '../Bookmarks/Bookmarks';
import Paginator from '../Pagination/Paginator';
import Grid from '../Grid/Grid';
import CardFilterer from '../Helpers/CardFilterer';
import FiltersPanelTop from '../Filters/Top/Panel';
import LeftFilterPanel from '../Filters/Left/Panel';
import JsonProcessor from '../Helpers/JsonProcessor';
import { useWindowDimensions, useURLState } from '../Helpers/hooks';
import { Info as LeftInfo } from '../Filters/Left/Info';
import {
    DESKTOP_MIN_WIDTH,
    FILTER_TYPES,
    FILTER_PANEL,
    LOADER_SIZE,
    PAGINATION_COUNT,
    TABLET_MIN_WIDTH,
    TRUNCATE_TEXT_QTY,
    SORT_POPUP_LOCATION,
    THEME_TYPE,
    LAYOUT_CONTAINER,
    ONE_SECOND_DELAY,
    SORT_TYPES,
} from '../Helpers/constants';
import {
    ConfigContext,
    ExpandableContext,
} from '../Helpers/contexts';
import {
    getDefaultSortOption,
    getNumSelectedFilterItems,
    makeConfigGetter,
} from '../Helpers/consonant';

import {
    shouldDisplayPaginator,
    getNumCardsToShow,
    getTotalPages,
    getActiveFilterIds,
    getActivePanels,
    getUpdatedCardBookmarkData,
} from '../Helpers/Helpers';


/**
 * Consonant Card Collection
 * Config is implicitly populated by authors
 *
 * @component
 * @example
 * const config = {
    collection: {},
    featuredCards: [{}],
    filterPanel: {},
    hideCtaIds: [{}],
    hideCtaTags: [{}],
    sort: {},
    pagination: {},
    bookmarks: {},
    search: {},
    language: ''
 * }
 * return (
 *   <Container config={config}/>
 * )
 */
const Container = (props) => {
    const { config } = props;
    const getConfig = makeConfigGetter(config);
    const filterGroupPrefix = 'ch_';
    const searchPrefix = 'sh_';
    const CARD_HASH_LENGTH = 10;

    /**
     **** Authored Configs ****
     */
    const filterPanelEnabled = getConfig('filterPanel', 'enabled');
    const filterPanelType = getConfig('filterPanel', 'type');
    const paginationType = getConfig('pagination', 'type');
    const paginationIsEnabled = getConfig('pagination', 'enabled');
    const resultsPerPage = getConfig('collection', 'resultsPerPage');
    const onlyShowBookmarks = getConfig('bookmarks', 'leftFilterPanel.bookmarkOnlyCollection');
    const authoredFilters = getConfig('filterPanel', 'filters');
    const filterLogic = getConfig('filterPanel', 'filterLogic').toLowerCase().trim();
    let totalCardLimit = getConfig('collection', 'totalCardsToShow');
    const sampleSize = getConfig('collection', 'reservoir.sample');
    const reservoirSize = getConfig('collection', 'reservoir.pool');
    const searchFields = getConfig('search', 'searchFields');
    const sortOptions = getConfig('sort', 'options');
    const defaultSort = getConfig('sort', 'defaultSort');
    const defaultSortOption = getDefaultSortOption(config, defaultSort);
    let featuredCards = getConfig('featuredCards', '')
        .toString()
        .replace(/\[|\]/g, '')
        .replace(/`/g, '')
        .split(',');
    // eslint-disable-next-line no-use-before-define,max-len
    featuredCards = featuredCards.concat(featuredCards.map(id => rollingHash(id, CARD_HASH_LENGTH)));
    let hideCtaIds = getConfig('hideCtaIds', '')
        .toString()
        .replace(/\[|\]/g, '')
        .replace(/`/g, '')
        .split(',');
    // eslint-disable-next-line no-use-before-define
    hideCtaIds = hideCtaIds.concat(hideCtaIds.map(id => rollingHash(id, CARD_HASH_LENGTH)));
    let hideCtaTags = getConfig('hideCtaTags', '')
        .toString()
        .replace(/\[|\]/g, '')
        .replace(/`/g, '')
        .split(',');
    const leftPanelSearchPlaceholder = getConfig('search', 'i18n.leftFilterPanel.searchPlaceholderText');
    const topPanelSearchPlaceholder = getConfig('search', 'i18n.topFilterPanel.searchPlaceholderText');
    const searchPlaceholderText = getConfig('search', 'i18n.filterInfo.searchPlaceholderText');
    const noResultsTitle = getConfig('search', 'i18n.noResultsTitle');
    const noResultsDescription = getConfig('search', 'i18n.noResultsDescription');
    const apiFailureTitle = getConfig('collection', 'i18n.onErrorTitle');
    const apiFailureDescription = getConfig('collection', 'i18n.onErrorDescription');
    const isLazy = getConfig('collection', 'lazyload');
    const trackImpressions = getConfig('analytics', 'trackImpressions');
    const collectionIdentifier = getConfig('analytics', 'collectionIdentifier');
    const targetEnabled = getConfig('target', 'enabled');
    const useLastViewedSession = getConfig('target', 'lastViewedSession');
    const authoredMode = getConfig('collection', 'mode');
    const authoredLayoutContainer = getConfig('collection', 'layout.container');
    const showEmptyFilters = getConfig('filterPanel', 'showEmptyFilters');
    const eventFilter = getConfig('filterPanel', 'eventFilter');
    const searchEnabled = getConfig('search', 'enabled');
    const sortEnabled = getConfig('sort', 'enabled');
    const cardStyle = getConfig('collection', 'cardStyle');
    const title = getConfig('collection', 'i18n.title');
    const headers = getConfig('headers', '');

    /**
     **** Constants ****
     */
    const DESKTOP_SCREEN_SIZE = window.innerWidth >= DESKTOP_MIN_WIDTH;
    const isXorFilter = filterLogic.toLowerCase().trim() === FILTER_TYPES.XOR;
    const isCarouselContainer = authoredLayoutContainer === LAYOUT_CONTAINER.CAROUSEL;
    const isStandardContainer = authoredLayoutContainer !== LAYOUT_CONTAINER.CAROUSEL;
    /**
     **** Hooks ****
     */
    /**
     * @typedef {Array} timedCollection - result of Timed Event Sort
     * @description — As an alternative/iteration on filtered cards for timed
     * collections
     * @typedef {Function} setTimedCollection
     * @description - Sets timedCollection after setTimeout triggers
     *
     * @type {[Array, Function]} timedCollection
     */
    /* eslint-disable no-unused-vars */
    const [timedCollection, setTimedCollection] = useState([]);
    /**
     * @typedef {Number} transition - MS to next transition
     * @description —  set by eventSort, from cardFilteret.nextTransitionMs
     * @typedef {Function} setTransition
     * @description - next Transition trigger
     *
     * @type {[Number, Function]} transition
     */
    /* eslint-disable no-unused-vars */
    const [transition, setTransition] = useState(0);

    const [, updateState] = React.useState();
    const scrollElementRef = useRef(null);
    const nextTransition = React.useCallback(() => updateState({}), []);
    /**
     * @typedef {Object} urlState
     * @description — object with url query values
     *
     * @typedef {Function} setUrlState
     * @description - set url query value by key
     *
     * @typedef {Function} clearUrlState
     * @description - clear whole url query state
     *
     * @type {[Object, Function, Function]} OpenDropdown
     */
    const [urlState, setUrlState, clearUrlState] = useURLState();

    /**
     * @typedef {Number} OpenDropdownState - Id of a selected dropdown
     * @description — Passed in Context Provider So All Nested Components can be in sync
     *
     * @typedef {Function} OpenDropdownStateSetter
     * @description
     *
     * @type {[Number, Function]} OpenDropdown
     */
    const [openDropdown, setOpenDropdown] = useState(null);

    /**
     * @typedef {Array} BookmarkedCardIdsState — Initiailzed From Local Storage
     *
     * @typedef {Function} BookmarkedCardIdsSetter — Sets internal state of saved bookmarks
     *
     * @type {[Array, Function]} BookmarkedCardIds
     */
    const [bookmarkedCardIds, setBookmarkedCardIds] = useState(readBookmarksFromLocalStorage());
    const [inclusionIds] = useState(readInclusionsFromLocalStorage());

    /**
     * @typedef {Number} CurrentPageState — Initialized to the first page
     * @description Same page state for 'Load More' or 'Paginator'
     *
     * @typedef {Function} CurrentPageStateSetter — Sets page as user navigates through pages
     *
     * @type {[Number, Function]} CurrentPage
     */
    const [currentPage, setCurrentPage] = useState(+urlState.page || 1);

    /**
     * @typedef {Array} FiltersState — Contains Filters For Filter Panel
     * @description Same Filter state for Left or Top
     *
     * @typedef {Function} FiltersStateSetter — Sets Authored Filters as State
     *
     * @type {[Array, Function]} Filters
     */
    const [filters, setFilters] = useState([]);

    /**
     * @typedef {String} SearchQueryState — Will be used to search through cards
     * @typedef {Function} SearchQueryStateSetter — Sets user search query
     *
     * @type {[String, Function]} SearchQuery
     */
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * @typedef {String} SortOpenedState — Toggles Sort Popup Opened Or Closed
     * @typedef {Function} SortOpenedStateSetter — Sets Sort Option
     *
     * @type {[Boolean, Function]} SortOpened
     */
    const [sortOpened, setSortOpened] = useState(false);

    /**
     * @typedef {String} SortOptionState — Can be one of a range of types
     * @description 'Title (A-Z)', 'Title (Z-A), Date (New to Old), Date (Old to New), Featured
     *
     * @typedef {Function} SortOptionStateSetter — Sets Sort Option
     *
     * @type {[String, Function]} SortOption
     */
    const [sortOption, setSortOption] = useState(defaultSortOption);

    if (sortOption.sort === SORT_TYPES.RANDOM) {
        totalCardLimit = sampleSize;
    }

    /**
     * @typedef {Boolean} WindowWidthState — Can either be true or false
     * @description Used to toggle between mobile and desktop layouts
     *
     * @typedef {Function} WindowWidthStateSetter — Updates window width
     *
     * @type {[Number]} WindowWidth
     */
    const { width: windowWidth } = useWindowDimensions();

    /**
     * @typedef {Boolean} ShowMobileFiltersState — Can either be true or false
     * @description When true mobile filters will appear on the page
     *
     * @typedef {Function} ShowMobileFiltersStateSetter
     * @description Toggles mobile filter header/footer to show or hide
     *
     * @type {[Boolean, Function]} ShowMobileFilters
     */
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    /**
     * @typedef {Boolean} ShowBookmarkState — Can either be true or false
     * @description For Top Filter Panel, there is a limit to how many filter groups can show
     *
     * @typedef {Function} ShowBookmarkStateSetter — Sets limit on filter quantity
     * @description When over allowed Filter Group Quantity - A "More +" button appears
     *
     * @type {[Boolean, Function]} ShowBookmarks
     */
    const [showBookmarks, setShowBookmarks] = useState(false);

    /**
     * @typedef {Boolean} LimitFilterQuantityState — Can either be true or false
     * @description For Top Filter Panel, there is a limit to how many filter groups can show
     *
     * @typedef {Function} LimitFilterQuantityStateSetter — Sets limit on filter quantity
     * @description When over allowed Filter Group Quantity - A "More +" button appears
     *
     * @type {[Boolean, Function]} LimitFilterQuantity
     */
    const [showLimitedFiltersQty, setShowLimitedFiltersQty] = useState(filterPanelType === 'top');

    /**
     * @typedef {Array} CardState
     * @description sets cards retrieved either server side render or API call
     *
     * @typedef {Function} CardStateSetter
     * @description E.g. Render Featured Cards Server side, While collection cards from API call
     *
     * @type {[Array, Function]} Cards
     */
    const [cards, setCards] = useState([]);

    /**
     * @typedef {Boolean} LoadingState — Can either be true or false
     * @description When true a loading spinner will appear on the page
     *
     * @typedef {Function} LoadingStateSetter — Sets loader true or false
     * @description True while waiting for API response. False on cards retrieved or api failure
     *
     * @type {[Boolean, Function]} Loading
     */
    const [isLoading, setLoading] = useState(false);

    /**
     * @typedef {Boolean} ApiFailureState — Can either be true or false
     * @description When true an API error has occured
     *
     * @typedef {Function} ApiFailureStateSetter — Sets API failure flag true or false
     * @description True when retrieved or api failure. False otherwise
     *
     * @type {[Boolean, Function]} ApiFailure
     */
    const [isApiFailure, setApiFailure] = useState(false);
    const [randomSortId, setRandomSortId] = useState(null);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [visibleStamp, setVisibleStamp] = useState();
    const [hasFetched, setHasFetched] = useState(false);

    /**
     * Creates a DOM reference to first filter item
     * @returns {Object} - filter item DOM reference
     */
    const filterItemRef = createRef();

    /**
     * Creates a DOM reference to filter info button
     * @returns {Object} - filter info DOM reference
     */
    const filterInfoRef = createRef();

    /**
     **** Helper Methods ****
     */

    function getParentChild(id) {
        let i = id.length;
        while (id[i] !== '/' && i >= 0) {
            i--;
        }
        return [id.substring(0, i), id.substring(i + 1)];
    }

    function rollingHash(s, l) {
        if (!s) {
            return '';
        }
        const BASE = 53;
        const MOD = 10 ** l + 7;
        let hash = 0;
        let basePower = 1;
        for (let i = 0; i < s.length; i++) {
            hash = (hash + (s.charCodeAt(i) - 97 + 1) * basePower) % MOD;
            basePower = (basePower * BASE) % MOD;
        }
        return ((hash + MOD) % MOD).toString(36);
    }

    /**
     * For a given group of filters, it will unselect all of them
     * @param {Array} filterGroups - a group of filters
     * @returns {Array} fitlerGroups - the updated group of filters
     */
    const getAllFiltersClearedState = filterGroups => filterGroups.map(filterGroup => ({
        ...filterGroup,
        items: filterGroup.items.map(filterItem => ({
            ...filterItem,
            selected: false,
        })),
    }));

    /**
     * For a given group of filters, it will unselect the one with a given id
     * @param {Number} id - the id of an individual filter item
     * @param {Array} filterGroups - a group of filters
     * @returns {Array} fitlerGroups - the updated group of filters
     */
    const getFilterItemClearedState = (id, filterGroups) => filterGroups.map((filterGroup) => {
        if (filterGroup.id !== id) {
            return filterGroup;
        }
        return {
            ...filterGroup,
            items: filterGroup.items.map(filterItem => ({
                ...filterItem,
                selected: false,
            })),
        };
    });

    /**
     * Will uncheck a filter with a given id
     * @param {Number} id - the id of an individual filter item
     * @returns {Void} - an updated state
     */
    const clearFilterItem = (id, group = '') => {
        setFilters((prevFilters) => {
            const filterClearedState = getFilterItemClearedState(id, prevFilters);
            return filterClearedState;
        });

        const urlParams = new URLSearchParams(window.location.search);
        clearUrlState();
        // actually clear the url state
        urlParams.forEach((value, key) => {
            const chFilter = key.toLowerCase().replace('ch_', '').replace(/ /g, '-');
            if (key.indexOf(filterGroupPrefix) !== 0
                && !id.toLowerCase().includes(chFilter)
                || !group.toLowerCase().replace(/ /g, '-').includes(chFilter)) {
                setUrlState(key, value.replace(/%20/g, ' '));
            }
        });
    };

    /**
     * Will uncheck all filter items
     * @returns {Void} - an updated state
     */
    const clearAllFilters = () => {
        setFilters((prevFilters) => {
            const allFiltersClearedState = getAllFiltersClearedState(prevFilters);
            return allFiltersClearedState;
        });

        const urlParams = new URLSearchParams(window.location.search);

        clearUrlState();
        urlParams.forEach((value, key) => {
            if (key.indexOf(filterGroupPrefix) !== 0) setUrlState(key, value);
        });
    };

    /**
     * Resets filters, and search to empty. Hides bookmark filter
     * @returns {Void} - an updated state
     */
    const resetFiltersSearchAndBookmarks = () => {
        clearAllFilters();
        setSearchQuery('');
        const urlParams = new URLSearchParams(window.location.search);
        clearUrlState();
        urlParams.forEach((value, key) => {
            if (key.indexOf(filterGroupPrefix) === -1
                && key.indexOf(searchPrefix) === -1) setUrlState(key, value);
        });
        setShowBookmarks(false);
    };

    /**
     **** EVENT HANDLERS ****
     */

    /**
     * On Load More Button Click, Increment Page Cuonter By 1
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const onLoadMoreClick = () => {
        setCurrentPage(prevState => prevState + 1);
        window.scrollTo(0, window.pageYOffset);
    };

    /**
     * Takes sort user selects and sets it so cards are sorted
     *
     * @param {ClickEvent} e - The observable event.
     * @listens ClickEvent
     */
    const handleSortChange = (option) => {
        setSortOption(option);
        setSortOpened(false);
        setIsFirstLoad(false);
    };

    /**
     * Handles whenever the search box is clicked or input field
     * changes
     *
     * @param {ClickEvent, ChangeEvent} e
     * @listens ClickEvent, ChangeEvent
     */
    const handleSearchInputChange = (val) => {
        setSearchQuery(val);
        setCurrentPage(1);
        setUrlState(searchPrefix, val);
    };

    /**
     * Handles when a group of filters is clicked. Behavior should be
     * to toggle group open or closed
     *
     * @param {ClickEvent} e - The observable event.
     * @listens ClickEvent
     */
    const handleFilterGroupClick = (filterId) => {
        setFilters((prevFilters) => {
            let opened;
            return prevFilters.map((el) => {
                if (el.id === filterId) {
                    opened = !el.opened;
                } else {
                    // eslint-disable-next-line prefer-destructuring
                    opened = el.opened;
                }
                return { ...el, opened };
            });
        });
    };

    /**
     * Will find and set needed filter to url
     *
     * @param {string} filterId - selected filter group id
     * @param {string} itemId - selected filter item id
     * @param {boolean} isChecked
     * @returns {Void} - an updated url
     */
    const changeUrlState = (filterId, itemId, isChecked) => {
        const { group, items } = filters.find(({ id }) => id === filterId);
        const { label } = items.find(({ id }) => id === itemId);

        let urlStateValue = urlState[filterGroupPrefix + group] || [];
        if (typeof urlStateValue === 'string') {
            urlStateValue = urlStateValue.split(',');
        }

        const value = isChecked
            ? [...urlStateValue, label]
            : urlStateValue.filter(item => item !== label);

        setUrlState(filterGroupPrefix + group, value);
    };

    /**
     * Handles what happens when a specific filter item (checkbox)
     * is clicked
     *
     * @param {CheckboxClickEvent} e
     * @listens CheckboxClickEvent
     */
    const handleCheckBoxChange = (filterId, itemId, isChecked) => {
        if (isXorFilter && isChecked) {
            clearAllFilters();
        }

        setFilters(prevFilters => prevFilters.map((filter) => {
            if (filter.id !== filterId) return filter;

            return {
                ...filter,
                items: filter.items.map(item => ({
                    ...item,
                    selected: item.id === itemId ? !item.selected : item.selected,
                })),
            };
        }));
        setCurrentPage(1);
        changeUrlState(filterId, itemId, isChecked);
    };

    /**
     * Shows/Hides Mobile Filter Panel
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleMobileFiltersToggle = () => setShowMobileFilters(prev => !prev);

    /**
     * When a card's bookmark icon is clicked, save the card
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleCardBookmarking = (id) => {
        // Update bookmarked IDs
        const cardIsBookmarked = bookmarkedCardIds.find(card => card === id);

        if (cardIsBookmarked) {
            setBookmarkedCardIds(prev => prev.filter(el => el !== id));
        } else {
            setBookmarkedCardIds(prev => [...prev, id]);
        }
    };

    /**
     * Will show  or hide all saved bookmarks when clicked
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleShowBookmarksFilterClick = (e) => {
        e.stopPropagation();
        setShowBookmarks(prev => !prev);
        setCurrentPage(1);
    };

    /**
     * If top filter panel, toggle or hide more button
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleShowAllTopFilters = () => {
        setShowLimitedFiltersQty(prev => !prev);
    };

    /**
     * On window click, all dropdowns should hide
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleWindowClick = () => {
        setOpenDropdown(null);
    };

    /**
     * Handles escape for mobile filter dialog
     *
     * @param event
     */
    const handleMobileFilterEscape = (event) => {
        if (event.key !== 'Escape' && event.key !== 'Esc') return;

        setShowMobileFilters(false);
    };

    /**
     **** Effects ****
     */

    /**
     * Sets authored filters as state
     * @returns {Void} - an updated state
     */

    useEffect(() => {
        setFilters(authoredFilters.map(filterGroup => ({
            ...filterGroup,
            opened: DESKTOP_SCREEN_SIZE ? filterGroup.openedOnLoad : false,
            items: filterGroup.items.map(filterItem => ({
                ...filterItem,
                selected: false,
            })),
        })));
    }, []);

    /**
     * Sets filters from url as state
     * @returns {Void} - an updated state
     */
    useEffect(() => {
        setFilters(origin => origin.map((filter) => {
            const { group, items } = filter;
            const urlStateValue = urlState[filterGroupPrefix + group];

            if (!urlStateValue) return filter;

            const urlStateArray = urlStateValue.split(',');
            return {
                ...filter,
                opened: true,
                items: items.map(item => ({
                    ...item,
                    selected: urlStateArray.includes(String(item.label)),
                })),
            };
        }));
        const urlSearchValue = urlState[searchPrefix];
        if (urlSearchValue) {
            setSearchQuery(urlSearchValue[0]);
        }
    }, []);

    useEffect(() => {
        setRandomSortId(Math.floor((Math.random() * 10e12)));
    }, []);

    /**
     * Trigger after button load more click
     * @returns {Void} - an updated url page
     */
    useEffect(() => {
        setUrlState('page', currentPage === 1 ? '' : currentPage);
    }, [currentPage]);

    const removeEmptyFilters = (allFilters, cardsFromJson) => {
        const tags = [].concat(...cardsFromJson.map(card => card.tags.map(tag => tag.id)));

        return allFilters.map(filter => ({
            ...filter,
            items: filter.items.filter(item => tags.includes(item.id)),
        })).filter(filter => filter.items.length > 0);
    };

    /**
     * This handles getting Cards, there are some conditions:
     * - If target is not enabled a simple request is made without mods or delay.
     * - If target is enabled & tVisitor API is present add values from Visitor
     * - If target is enabled & the Visitor API is not present setTimeout with
     * counter to recheck for the Visitor API. If 20 attempts are made w/o
     * success fail the request.
     * @returns {Void} - an updated state
     */
    useEffect(() => {
        if ((isLazy && visibleStamp) || (isLazy && !hasFetched)) {
            return;
        }
        const { __satelliteLoadedPromise: visitorPromise } = window;

        let collectionEndpoint = getConfig('collection', 'endpoint');
        const fallbackEndpoint = getConfig('collection', 'fallbackEndpoint');

        const r = new RegExp('^(?:[a-z]+:)?//', 'i');
        let collectionEndpointURI;
        if (r.test(collectionEndpoint)) {
            collectionEndpointURI = new URL(collectionEndpoint);
        } else {
            collectionEndpointURI = new URL(collectionEndpoint, window.location.origin);
        }

        if (!fallbackEndpoint) {
            collectionEndpointURI.searchParams.set('flatFile', false);
            collectionEndpoint = collectionEndpointURI.toString();
        }

        setLoading(true);

        /**
         * @func getCards
         * @desc wraps fetch with function to make it reusable
         *
         * @param {String} endPoint, URL with params for card request
         * @returns {Void} - an updated state
         */
        function getCards(endPoint = collectionEndpoint) {
            const start = Date.now();
            return window.fetch(endPoint, {
                credentials: 'include',
                headers,
            })
                .then((resp) => {
                    const {
                        ok,
                        status,
                        statusText,
                        url,
                    } = resp;

                    if (ok) {
                        return resp.json().then((json) => {
                            const validData = !!Object.keys(json).length;

                            if (validData) return json;

                            logLana({ message: `no valid response data from ${endPoint}`, tags: 'collection' });
                            return Promise.reject(new Error('no valid reponse data'));
                        });
                    }
                    logLana({ message: `failure for call to ${url}`, tags: 'collection', errorMessage: `${status}: ${statusText}` });
                    return Promise.reject(new Error(`${status}: ${statusText}, failure for call to ${url}`));
                })
                .then((payload) => {
                    logLana({ message: `response took ${(Date.now() - start) / 1000}s`, tags: 'collection' });
                    setLoading(false);
                    setIsFirstLoad(true);
                    if (!getByPath(payload, 'cards.length')) {
                        logLana({ message: `no cards return by query to this endpoint: ${endPoint}`, tags: 'collection' });
                        return;
                    }
                    if (payload.isHashed) {
                        const TAG_HASH_LENGTH = 6;
                        for (const group of authoredFilters) {
                            group.id = rollingHash(group.id, TAG_HASH_LENGTH);
                            for (const filterItem of group.items) {
                                const [parent, child] = getParentChild(filterItem.id);
                                filterItem.id = `${rollingHash(parent, TAG_HASH_LENGTH)}/${rollingHash(child, TAG_HASH_LENGTH)}`;
                            }
                        }
                        const temp = [];
                        for (const tag of hideCtaTags) {
                            const [parent, child] = getParentChild(tag);
                            if (parent !== '' && child !== '') {
                                temp.push(`${rollingHash(parent, TAG_HASH_LENGTH)}/${rollingHash(child, TAG_HASH_LENGTH)}`);
                            }
                        }
                        hideCtaTags = temp;
                    }

                    const { processedCards = [] } = new JsonProcessor(payload.cards)
                        .removeDuplicateCards()
                        .addCardMetaData(
                            TRUNCATE_TEXT_QTY,
                            onlyShowBookmarks,
                            bookmarkedCardIds,
                            hideCtaIds,
                            hideCtaTags,
                        );
                    setFilters(() => authoredFilters.map((filter) => {
                        const { group, items } = filter;
                        const urlStateValue = urlState[filterGroupPrefix + group];
                        if (!urlStateValue) return filter;
                        const urlStateArray = urlStateValue.split(',');
                        return {
                            ...filter,
                            opened: true,
                            items: items.map(item => ({
                                ...item,
                                selected: urlStateArray.includes(String(item.label)),
                            })),
                        };
                    }));

                    const transitions = getTransitions(processedCards);
                    if (sortOption.sort.toLowerCase() === 'eventsort') {
                        while (transitions.size() > 0) {
                            setTimeout(() => {
                                nextTransition();
                            }, transitions.dequeue().priority + ONE_SECOND_DELAY);
                        }
                    }

                    setCards(processedCards);
                    if (!showEmptyFilters) {
                        setFilters(prevFilters => removeEmptyFilters(prevFilters, processedCards));
                    }
                    setTimeout(() => {
                        if (!scrollElementRef.current) return;
                        if (processedCards.length === 0) return;
                        if (currentPage === 1) return;
                        const cardsToshow = processedCards.slice(0, resultsPerPage * currentPage);
                        const getLastPageID = (resultsPerPage * currentPage) - resultsPerPage;
                        if (cardsToshow.length < getLastPageID) return;
                        const lastID = scrollElementRef.current.children[getLastPageID];
                        lastID.scrollIntoView();
                    }, 100);
                }).catch(() => {
                    if (endPoint === collectionEndpoint && fallbackEndpoint) {
                        getCards(fallbackEndpoint);
                        return;
                    }
                    logLana({ message: 'failed to return processed cards', tags: 'collection' });
                    setLoading(false);
                    setApiFailure(true);
                });
        }
        /**
         * @func getVisitorData
         * @desc wraps fetching Visitor API data in a function for reuse, also if
         * last used session is checked, update currentEntityId with targetValueRevealID
         *
         * @param {Promise} visitorApi, window.__satelliteLoadedPromise when accessed
         * @returns {Void} - an updated state, thru calling getCards
         */
        function getVisitorData(visitorApi) {
            const collectionURI = new URL(collectionEndpoint);

            if (useLastViewedSession) {
                const targetRevealId = localStorage.getItem('targetValueRevealID');
                if (targetRevealId) {
                    collectionURI.searchParams.set('currentEntityId', targetRevealId);
                }
            }

            visitorApi.then((result) => {
                if (window.alloy && window.edgeConfigId) {
                    window.alloy('getIdentity')
                        .then((res) => {
                            collectionURI.searchParams.set('mcgvid', res.identity.ECID);
                            collectionURI.searchParams.set('mboxMCGLH', res.edge.regionId);
                            getCards(collectionURI.toString());
                        });
                } else {
                    const visitor = result.getVisitorId();
                    collectionURI.searchParams.set('mcgvid', visitor.getMarketingCloudVisitorID());
                    collectionURI.searchParams.set('sdid', visitor.getSupplementalDataID());
                    collectionURI.searchParams.set('mboxAAMB', visitor.getAudienceManagerBlob());
                    collectionURI.searchParams.set('mboxMCGLH', visitor.getAudienceManagerLocationHint());
                    getCards(collectionURI.toString());
                }
            });
        }

        /**
         * @func visitorRetry
         * @desc Visitor API is late loading often, this sets a recursive call
         * in a setTimeout to run 20 times, and then fail the request.
         *
         * @returns {Void} - an updated state, thru calling getVisitorData which
         * calls getCards
         */
        function visitorRetry() {
            let retryCount = 0;

            const timedRetry = () => {
                setTimeout(() => {
                    if (retryCount >= 20) {
                        setLoading(false);

                        setApiFailure(true);

                        return;
                    }

                    const { __satelliteLoadedPromise: visitorPromiseRetry } = window;

                    if (visitorPromiseRetry) {
                        getVisitorData(visitorPromiseRetry);
                    }

                    if (!visitorPromiseRetry && retryCount < 20) {
                        timedRetry();
                    }

                    retryCount += 1;
                }, 100);
            };

            timedRetry();
        }

        if (targetEnabled && visitorPromise) {
            getVisitorData(visitorPromise);
        }

        if (targetEnabled && !visitorPromise) {
            visitorRetry();
        }

        if (!targetEnabled) {
            getCards();
        }
    }, [visibleStamp, hasFetched]);

    /**
     * Saves cards to local storage and updates card w/ bookmarked data
     * @returns {Void} - an updated state
     */
    useEffect(() => {
        saveBookmarksToLocalStorage(bookmarkedCardIds);
        setCards(getUpdatedCardBookmarkData(cards, bookmarkedCardIds));
    }, [bookmarkedCardIds]);


    /**
     * Handles clearing state on showBookmarks
     * @returns {Void} - an updated state
     */
    useEffect(() => {
        if (showBookmarks) {
            clearAllFilters();
            setSearchQuery('');
        }
    }, [showBookmarks]);

    /**
     * Handles focus and escape on mobile filter toggle
     * @returns {Void}
     */
    useEffect(() => {
        if (showMobileFilters) {
            if (filterItemRef && filterItemRef.current) {
                filterItemRef.current.focusMobTitle();
            }
            document.addEventListener('keydown', handleMobileFilterEscape);
        } else {
            if (filterInfoRef && filterInfoRef.current) {
                filterInfoRef.current.focus();
            }
            document.removeEventListener('keydown', handleMobileFilterEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleMobileFilterEscape);
        };
    }, [showMobileFilters]);

    const box = useRef();

    useEffect(() => {
        if (box && !visibleStamp && isLazy) {
            const io = new IntersectionObserver((entries) => {
                if (entries[0].intersectionRatio <= 0) return;
                setHasFetched(true);
                setVisibleStamp(new Date().getTime());
            });
            io.observe(box.current);
        }
    }, [box]);

    /**
     **** Derived State ****
     */

    /**
     * Array of filters chosen by the user
     * @type {Array}
     */
    const activeFilterIds = getActiveFilterIds(filters);

    /**
     * Array of filters panels (groupings) created by the author
     * @type {Array}
     */
    const activePanels = getActivePanels(activeFilterIds) || new Set();

    /**
     * Instance of CardFilterer class that handles returning subset of cards
     * based off user interactions
     *
     * @type {Object}
     */
    const cardFilterer = new CardFilterer(
        cards,
        randomSortId,
        sampleSize,
        reservoirSize,
        featuredCards,
    );
    /**
     * @type {Function} getFilteredCollection
     * @desc Closure around CardFilterer for reuse within context
     * @returns {Object}
     * */
    const getFilteredCollection = () => cardFilterer
        .sortCards(sortOption, eventFilter, featuredCards, hideCtaIds, isFirstLoad)
        .keepBookmarkedCardsOnly(onlyShowBookmarks, bookmarkedCardIds, showBookmarks)
        .keepCardsWithinDateRange()
        .filterCards(activeFilterIds, activePanels, filterLogic, FILTER_TYPES)
        .truncateList(totalCardLimit)
        .searchCards(searchQuery, searchFields)
        .removeCards(inclusionIds);

    /**
     * @type {Array} filteredCards: Filtered cards based off current state of page
     * @type {Number} nextTransitionMs: Number for timed event sort transition
     */
    /* eslint-disable no-unused-vars */
    const { filteredCards = [], nextTransitionMs = 0 } = getFilteredCollection();

    /**
     * Subset of cards to show the user
     * @type {Array}
     */
    const gridCards = timedCollection.length ? timedCollection : filteredCards;

    /**
     * Total pages (used by Paginator Component)
     * @type {Number}
     */
    const totalPages = getTotalPages(resultsPerPage, gridCards.length);

    /**
     * Number of cards to show (used by Load More component)
     * @type {Number}
     */
    const numCardsToShow = getNumCardsToShow(resultsPerPage, currentPage, gridCards.length);

    /**
     * How many filters were selected - (used by Left Filter Panel)
     * @type {Number}
     */
    const selectedFiltersItemsQty = getNumSelectedFilterItems(filters);

    /**
     * Conditions to Display A Form Of Pagination
     * @type {Boolean}
     */
    const displayPagination = shouldDisplayPaginator(
        paginationIsEnabled,
        totalCardLimit,
        gridCards.length,
    );
    /**
     * Conditions to display the Load More Button
     * @type {Boolean}
     */
    const displayLoadMore = displayPagination && paginationType === 'loadMore';

    /**
     * Conditions to display the Paginator Component
     * @type {Boolean}
     */
    const displayPaginator = displayPagination && paginationType === 'paginator';

    /**
     * Conditions to display the Left Filter Panel Component
     * @type {Boolean}
     */
    const displayLeftFilterPanel = filterPanelEnabled && filterPanelType === FILTER_PANEL.LEFT;

    /**
     * Whether at lease one card was returned by Card Filterer
     * @type {Boolean}
     */
    const atLeastOneCard = gridCards.length > 0;

    /**
     * Where to place the Sort Popup (either left or right)
     * @type {String} - Location of Sort Popup in Top Filter Panel View
     */
    const topPanelSortPopupLocation = filters.length > 0 && windowWidth < TABLET_MIN_WIDTH ?
        SORT_POPUP_LOCATION.LEFT : SORT_POPUP_LOCATION.RIGHT;

    /**
     * How Long Paginator Component Should Be
     * @type {Number} - Location of Sort Popup in Top Filter Panel View
     */
    const paginatorCount = DESKTOP_SCREEN_SIZE ? PAGINATION_COUNT.DESKTOP : PAGINATION_COUNT.MOBILE;

    /**
     * Whether we are using the top filter panel or not
     * @type {Boolean}
     */
    const isTopFilterPanel = filterPanelType === FILTER_PANEL.TOP;

    /**
     * Whether we are using the top filter panel or not
     * @type {Boolean}
     */
    const isLeftFilterPanel = filterPanelType === FILTER_PANEL.LEFT;

    /**
     * Ui options that cause grid to rerender necessitate the aria attribute being set
     * @type {Boolean}
     */
    const isGridAreaLive =
        filterPanelEnabled ||
        searchEnabled ||
        sortEnabled ||
        paginationIsEnabled;

    let filterNames = '';
    filters.forEach((el) => {
        el.items.filter(item => item.selected).forEach((item) => {
            filterNames += `${item.label}, `;
        });
    });

    /**
     **** Class names ****
     */

    /**
     * Class name for the authored theme:
     * light, dark, darkest;
     * @type {String}
     */
    const themeClass = classNames({
        'consonant-u-themeLight': authoredMode === THEME_TYPE.LIGHT,
        'consonant-u-themeDark': authoredMode === THEME_TYPE.DARK,
        'consonant-u-themeDarkest': authoredMode === THEME_TYPE.DARKEST,
    });


    const collectionStr = collectionIdentifier ? `${collectionIdentifier} | ` : '';
    const filterStr = selectedFiltersItemsQty ? filterNames : 'No Filters';
    const searchQueryStr = searchQuery || 'None';
    const collectionAnalytics = `${collectionStr}Card Collection | Filters: ${filterStr}| Search Query: ${searchQueryStr}`;
    /**
     * Class name for the consonant wrapper:
     * whether consonant wrapper contains left filter;
     * @type {String}
     */
    const wrapperClass = classNames({
        'consonant-Wrapper': true,
        'consonant-Wrapper--32MarginContainer': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_100_VW_32_MARGIN,
        'consonant-Wrapper--83PercentContainier': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_83_VW,
        'consonant-Wrapper--1200MaxWidth': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_1200_PX,
        'consonant-Wrapper--1600MaxWidth': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_1600_PX,
        'consonant-Wrapper--carousel': isCarouselContainer,
        'consonant-Wrapper--withLeftFilter': filterPanelEnabled && isLeftFilterPanel,
    });

    return (
        <ConfigContext.Provider value={config}>
            <ExpandableContext.Provider value={{ value: openDropdown, setValue: setOpenDropdown }} >
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */}
                <section
                    ref={box}
                    role="group"
                    aria-label={title}
                    daa-lh={collectionAnalytics}
                    daa-im={String(trackImpressions)}
                    onClick={handleWindowClick}
                    className={`${wrapperClass} ${themeClass}`}>
                    <div className="consonant-Wrapper-inner">
                        { displayLeftFilterPanel && isStandardContainer &&
                        <div className="consonant-Wrapper-leftFilterWrapper">
                            <LeftFilterPanel
                                filters={filters}
                                selectedFiltersQty={selectedFiltersItemsQty}
                                windowWidth={windowWidth}
                                onFilterClick={handleFilterGroupClick}
                                onClearAllFilters={resetFiltersSearchAndBookmarks}
                                onClearFilterItems={clearFilterItem}
                                onCheckboxClick={handleCheckBoxChange}
                                onMobileFiltersToggleClick={handleMobileFiltersToggle}
                                onSelectedFilterClick={handleCheckBoxChange}
                                showMobileFilters={showMobileFilters}
                                resQty={gridCards.length}
                                bookmarkComponent={
                                    <Bookmarks
                                        showBookmarks={showBookmarks}
                                        onClick={handleShowBookmarksFilterClick}
                                        savedCardsCount={bookmarkedCardIds.length} />
                                }
                                searchComponent={
                                    <Search
                                        placeholderText={leftPanelSearchPlaceholder}
                                        name="filtersSideSearch"
                                        value={searchQuery}
                                        autofocus={false}
                                        onSearch={handleSearchInputChange} />
                                }
                                ref={filterItemRef} />
                        </div>
                        }
                        <div className={`consonant-Wrapper-collection${isLoading ? ' is-loading' : ''}`}>
                            { isTopFilterPanel && isStandardContainer &&
                            <FiltersPanelTop
                                filterPanelEnabled={filterPanelEnabled}
                                filters={filters}
                                windowWidth={windowWidth}
                                resQty={gridCards.length}
                                onCheckboxClick={handleCheckBoxChange}
                                onFilterClick={handleFilterGroupClick}
                                onClearFilterItems={clearFilterItem}
                                onClearAllFilters={resetFiltersSearchAndBookmarks}
                                showLimitedFiltersQty={showLimitedFiltersQty}
                                searchComponent={
                                    <Search
                                        placeholderText={topPanelSearchPlaceholder}
                                        name="filtersTopSearch"
                                        value={searchQuery}
                                        autofocus={DESKTOP_SCREEN_SIZE}
                                        onSearch={handleSearchInputChange} />
                                }
                                sortComponent={
                                    <Popup
                                        opened={sortOpened}
                                        id="sort"
                                        val={sortOption}
                                        values={sortOptions}
                                        onSelect={handleSortChange}
                                        name="filtersTopSelect"
                                        autoWidth
                                        optionsAlignment={topPanelSortPopupLocation} />
                                }
                                onShowAllClick={handleShowAllTopFilters} />
                            }
                            { isLeftFilterPanel && isStandardContainer &&
                            <LeftInfo
                                enabled={filterPanelEnabled}
                                filtersQty={filters.length}
                                filters={filters}
                                cardsQty={gridCards.length}
                                selectedFiltersQty={selectedFiltersItemsQty}
                                windowWidth={windowWidth}
                                onMobileFiltersToggleClick={handleMobileFiltersToggle}
                                searchComponent={(
                                    <Search
                                        placeholderText={searchPlaceholderText}
                                        name="searchFiltersInfo"
                                        value={searchQuery}
                                        autofocus={false}
                                        onSearch={handleSearchInputChange} />
                                )}
                                sortComponent={
                                    <Popup
                                        opened={sortOpened}
                                        id="sort"
                                        val={sortOption}
                                        values={sortOptions}
                                        onSelect={handleSortChange}
                                        autoWidth={false}
                                        optionsAlignment="right" />
                                }
                                sortOptions={sortOptions}
                                ref={filterInfoRef} />
                            }
                            { atLeastOneCard && isStandardContainer &&
                            <Fragment>
                                <Grid
                                    resultsPerPage={resultsPerPage}
                                    pages={currentPage}
                                    cards={gridCards}
                                    forwardedRef={scrollElementRef}
                                    onCardBookmark={handleCardBookmarking}
                                    isAriaLiveActive={isGridAreaLive} />
                                {displayLoadMore &&
                                <LoadMore
                                    onClick={onLoadMoreClick}
                                    show={numCardsToShow}
                                    total={gridCards.length} />
                                }
                                {displayPaginator &&
                                <Paginator
                                    pageCount={paginatorCount}
                                    currentPageNumber={currentPage}
                                    totalPages={totalPages}
                                    showItemsPerPage={resultsPerPage}
                                    totalResults={gridCards.length}
                                    onClick={setCurrentPage} />
                                }
                            </Fragment>}
                            { atLeastOneCard && isCarouselContainer && !(cardStyle === 'custom-card') &&
                            <CardsCarousel
                                resQty={gridCards.length}
                                cards={gridCards}
                                onCardBookmark={handleCardBookmarking} />
                            }
                            { atLeastOneCard && isCarouselContainer && (cardStyle === 'custom-card') &&
                            <NoResultsView
                                title="Not Supported"
                                description="Using custom cards within a carousel layout is currently not supported. Please
                                re-author the component"
                                replaceValue="" />
                            }
                            { isLoading && !atLeastOneCard &&
                            <Loader
                                size={LOADER_SIZE.BIG}
                                hidden={!totalCardLimit}
                                absolute />
                            }
                            { !isApiFailure && !atLeastOneCard && !isLoading &&
                            <NoResultsView
                                title={noResultsTitle}
                                description={noResultsDescription}
                                replaceValue={searchQuery} />
                            }
                            { isApiFailure &&
                            <NoResultsView
                                title={apiFailureTitle}
                                description={apiFailureDescription}
                                replaceValue="" />
                            }
                        </div>
                    </div>
                </section>
            </ExpandableContext.Provider>
        </ConfigContext.Provider>
    );
};

Container.propTypes = {
    config: shape(configType),
};

Container.defaultProps = {
    config: {},
};

export default Container;
