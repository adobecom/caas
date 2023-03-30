/**
 * Minimal viewport width to fit desktops/laptops
 * @type {Number}
 */
export const DESKTOP_MIN_WIDTH = 1200;

/**
 * Minimal viewport width to fit tablets
 * @type {Number}
 */
export const TABLET_MIN_WIDTH = 768;

/**
 * Maximum allowed top filters displayed
 * before "More Filters" button shows up
 * @type {Number}
 */
export const MAX_TRUNCATED_FILTERS = 3;

/**
 * Minimum top filters needed to display blurred effect
 * on filters wrapper
 * @type {Number}
 */
export const MIN_FILTERS_SHOW_BG = 3;

/**
 * Maximum allowed card description length
 * after which a truncation will take place
 * @type {Number}
 */
export const TRUNCATE_TEXT_QTY = 200;

/**
 * Quantity of the pagination items to display
 * for mobile and desktop breakpoints
 * @type {Object}
 */
export const PAGINATION_COUNT = {
    DESKTOP: 10,
    MOBILE: 4,
};

/**
 * Available filtering types
 * @type {Object}
 */
export const FILTER_TYPES = {
    AND: 'and',
    OR: 'or',
    XOR: 'xor',
};

/**
 * Available filter panel types
 * @type {Object}
 */
export const FILTER_PANEL = {
    LEFT: 'left',
    TOP: 'top',
};

/**
 * Available sorting types
 * @type {Object}
 */
export const SORT_TYPES = {
    DATEASC: 'dateasc',
    DATEDESC: 'datedesc',
    MODIFIEDDESC: 'modifieddesc',
    MODIFIEDASC: 'modifiedasc',
    EVENTSORT: 'eventsort',
    FEATURED: 'featured',
    TITLEASC: 'titleasc',
    TITLEDESC: 'titledesc',
    RANDOM: 'random',
};

/**
 * Possible Locations of the Sort Popup
 * @type {String}
 */
export const SORT_POPUP_LOCATION = {
    LEFT: 'left',
    RIGHT: 'right',
};

/**
 * Available infobit types
 * @type {Object}
 */
export const INFOBIT_TYPE = {
    PRICE: 'price',
    BUTTON: 'button',
    ICON_TEXT: 'icon-with-text',
    LINK_ICON: 'link-with-icon',
    TEXT: 'text',
    ICON: 'icon',
    LINK: 'link',
    PROGRESS: 'progress-bar',
    RATING: 'rating',
    BOOKMARK: 'bookmark',
    DATE: 'date-interval',
    GATED: 'gated',
};

/**
 * Available themes class names
 * @type {Object}
 */
export const THEME_TYPE = {
    LIGHT: 'light',
    DARK: 'dark',
    DARKEST: 'darkest',
};

/**
 * Default authoring constants
 * @type {Object}
 */
export const DEFAULT_CONFIG = {
    collection: {
        mode: '',
        layout: {
            type: '3up',
            gutter: '4x',
            container: '32Margin',
        },
        button: {
            style: '',
        },
        resultsPerPage: 9,
        endpoint: '',
        title: '',
        totalCardLimit: -1,
        cardStyle: '',
        displayTotalResults: true,
        totalResultsText: '{} results',
        i18n: {
            prettyDateIntervalFormat: '{LLL} {dd} | {timeRange} {timeZone}',
            totalResultsText: '{total} results',
            title: '',
            onErrorTitle: 'Sorry there was a system error.',
            onErrorDescription: 'Please try reloading the page or try coming back to the page another time.',
        },
    },
    featuredCards: [],
    hideCtaIds: [],
    header: {
        enabled: false,
    },
    filterPanel: {
        enabled: true,
        eventFilter: '',
        type: 'left',
        filters: [],
        clearAllFiltersText: 'Clear all',
        clearFilterText: 'Clear',
        filterLogic: 'and',
        leftPanelHeader: 'Refine the results',
        topPanel: {
            mobile: {
                blurFilters: true,
            },
        },
    },
    sort: {
        enabled: true,
        defaultSort: 'featured',
        options: [],
    },
    pagination: {
        enabled: true,
        type: 'loadMore',
        loadMoreButton: {
            style: 'primary',
            useThemeThree: false,
        },
        paginatorQuantityText: 'Showing {}-{} of {} Results',
        paginatorPrevLabel: 'Previous',
        paginatorNextLabel: 'Next',
        loadMoreButtonText: 'Load more',
        loadMoreQuantityText: '{} of {} displayed',
    },
    bookmarks: {
        enabled: true,
        bookmarkOnlyCollection: false,
        cardSavedIcon: '',
        cardUnsavedIcon: '',
        selectBookmarksIcon: '',
        unselectBookmarksIcon: '',
        saveCardText: 'Save card',
        unsaveCardText: 'Unsave card',
        bookmarksFilterTitle: 'My favorites',
    },
    search: {
        enabled: true,
        inputPlaceholderText: 'Search here...',
        leftPanelTitle: 'Search',
        searchFields: [
            'title',
            'description',
        ],
        i18n: {
            noResultsTitle: 'No results found',
            noResultsDescription: `We couldn’t find any results for your {query}.{break}
            Check your spelling or try broadening your search.`,
        },
    },
    language: 'en',
};

/**
 * Default number of cards to display per page
 * @type {Number}
 */
export const DEFAULT_SHOW_ITEMS_PER_PAGE = 8;

/**
 * Available card types
 * @type {Object}
 */
export const CARD_STYLES = {
    WIDE: '1:2',
    SQUARE: '3:4',
    FULL: 'full-card',
    HALF_HEIGHT: 'half-height',
    DOUBLE_WIDE: 'double-wide',
    CUSTOM: 'custom-card',
    PRODUCT: 'product',
    TEXT: 'text-card',
};

/**
 * Available grid types
 * @type {Object}
 */
export const GRID_TYPE = {
    TWO_UP: '2up',
    THREE_UP: '3up',
    FOUR_UP: '4up',
    FIVE_UP: '5up',
};

/**
 * Available gutter sizes
 * @type {Object}
 */
export const GUTTER_SIZE = {
    GUTTER_1_X: '1x',
    GUTTER_2_X: '2x',
    GUTTER_3_X: '3x',
    GUTTER_4_X: '4x',
};

/**
 * Available layout container types
 * @type {Object}
 */
export const LAYOUT_CONTAINER = {
    SIZE_83_VW: '83Percent',
    SIZE_1200_PX: '1200MaxWidth',
    SIZE_1600_PX: '1600MaxWidth',
    SIZE_100_VW_32_MARGIN: '32Margin',
    CAROUSEL: 'carousel',
};

/**
 * Available loader sizes
 * @type {Object}
 */
export const LOADER_SIZE = {
    MEDIUM: 'medium',
    BIG: 'big',
};

/**
 * Used for lazy-loading - lets the lazy load of the image
 * start before it is scrolled into the viewport.
 * @type {String}
 */
export const ROOT_MARGIN_DEFAULT = '500px';
export const ONE_SECOND_DELAY = 1000;
