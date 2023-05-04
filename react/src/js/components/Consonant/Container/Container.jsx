/* eslint-disable */
import React, {
    Fragment,
    // useEffect,
    useRef,
    useState,
    // createRef,
} from 'react';
// import classNames from 'classnames';
// import { shape } from 'prop-types';
// import 'whatwg-fetch';
// import Popup from '../Sort/Popup';
// import Search from '../Search/Search';
// import Loader from '../Loader/Loader';
// import {
//     getByPath,
//     saveBookmarksToLocalStorage,
//     readBookmarksFromLocalStorage,
//     readInclusionsFromLocalStorage,
//     getTransitions,
// } from '../Helpers/general';
// import { configType } from '../types/config';
// import CardsCarousel from '../CardsCarousel/CardsCarousel';
import NoResultsView from '../NoResults/View';
// import LoadMore from '../Pagination/LoadMore';
// import Bookmarks from '../Bookmarks/Bookmarks';
// import Paginator from '../Pagination/Paginator';
import Grid from '../Grid/Grid';
import CardFilterer from '../Helpers/CardFilterer';
// import FiltersPanelTop from '../Filters/Top/Panel';
// import LeftFilterPanel from '../Filters/Left/Panel';
// import JsonProcessor from '../Helpers/JsonProcessor';
// import { useWindowDimensions, useURLState } from '../Helpers/hooks';
// import { Info as LeftInfo } from '../Filters/Left/Info';
// import {
//     DESKTOP_MIN_WIDTH,
//     FILTER_TYPES,
//     FILTER_PANEL,
//     LOADER_SIZE,
//     PAGINATION_COUNT,
//     TABLET_MIN_WIDTH,
//     TRUNCATE_TEXT_QTY,
//     SORT_POPUP_LOCATION,
//     THEME_TYPE,
//     LAYOUT_CONTAINER,
//     ONE_SECOND_DELAY,
//     SORT_TYPES,
// } from '../Helpers/constants';
// import {
//     ConfigContext,
//     ExpandableContext,
// } from '../Helpers/contexts';
import {
    getDefaultSortOption,
    makeConfigGetter,
} from '../Helpers/consonant';
//
// import {
//     shouldDisplayPaginator,
//     getNumCardsToShow,
//     getTotalPages,
//     getActiveFilterIds,
//     getActivePanels,
//     getUpdatedCardBookmarkData,
// } from '../Helpers/Helpers';


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
    // const filterGroupPrefix = 'ch_';
    // const searchPrefix = 'sh_';

    /**
     **** Authored Configs ****
     */
        // const filterPanelEnabled = getConfig('filterPanel', 'enabled');
        // const filterPanelType = getConfig('filterPanel', 'type');
        // const paginationType = getConfig('pagination', 'type');
        // const paginationIsEnabled = getConfig('pagination', 'enabled');
        // const resultsPerPage = getConfig('collection', 'resultsPerPage');
        // const onlyShowBookmarks = getConfig('bookmarks', 'leftFilterPanel.bookmarkOnlyCollection');
        // const authoredFilters = getConfig('filterPanel', 'filters');
        // const filterLogic = getConfig('filterPanel', 'filterLogic').toLowerCase().trim();
        // let totalCardLimit = getConfig('collection', 'totalCardsToShow');
        // const sampleSize = getConfig('collection', 'reservoir.sample');
        // const reservoirSize = getConfig('collection', 'reservoir.pool');
        // const searchFields = getConfig('search', 'searchFields');
    const sortOptions = getConfig('sort', 'options');
    const defaultSort = getConfig('sort', 'defaultSort');
    const defaultSortOption = getDefaultSortOption(config, defaultSort);
    // const featuredCards = getConfig('featuredCards', '')
    //     .toString()
    //     .replace(/\[|\]/g, '')
    //     .replace(/`/g, '')
    //     .split(',');
    // const hideCtaIds = getConfig('hideCtaIds', '')
    //     .toString()
    //     .replace(/\[|\]/g, '')
    //     .replace(/`/g, '')
    //     .split(',');
    // const leftPanelSearchPlaceholder = getConfig('search', 'i18n.leftFilterPanel.searchPlaceholderText');
    // const topPanelSearchPlaceholder = getConfig('search', 'i18n.topFilterPanel.searchPlaceholderText');
    // const searchPlaceholderText = getConfig('search', 'i18n.filterInfo.searchPlaceholderText');
    // const noResultsTitle = getConfig('search', 'i18n.noResultsTitle');
    // const noResultsDescription = getConfig('search', 'i18n.noResultsDescription');
    // const apiFailureTitle = getConfig('collection', 'i18n.onErrorTitle');
    // const apiFailureDescription = getConfig('collection', 'i18n.onErrorDescription');
    // const isLazy = getConfig('collection', 'lazyload');
    // const trackImpressions = getConfig('analytics', 'trackImpressions');
    // const collectionIdentifier = getConfig('analytics', 'collectionIdentifier');
    // const targetEnabled = getConfig('target', 'enabled');
    // const useLastViewedSession = getConfig('target', 'lastViewedSession');
    // const authoredMode = getConfig('collection', 'mode');
    // const authoredLayoutContainer = getConfig('collection', 'layout.container');
    // const showEmptyFilters = getConfig('filterPanel', 'showEmptyFilters');
    // const eventFilter = getConfig('filterPanel', 'eventFilter');
    // const searchEnabled = getConfig('search', 'enabled');
    // const sortEnabled = getConfig('sort', 'enabled');
    // const cardStyle = getConfig('collection', 'cardStyle');
    // const title = getConfig('collection', 'i18n.title');

    /**
     **** Constants ****
     */
    // const DESKTOP_SCREEN_SIZE = window.innerWidth >= DESKTOP_MIN_WIDTH;
    // const isXorFilter = filterLogic.toLowerCase().trim() === FILTER_TYPES.XOR;
    // const isCarouselContainer = authoredLayoutContainer === LAYOUT_CONTAINER.CAROUSEL;
    // const isStandardContainer = authoredLayoutContainer !== LAYOUT_CONTAINER.CAROUSEL;
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
    // const [timedCollection, setTimedCollection] = useState([]);
    /**
     * @typedef {Number} transition - MS to next transition
     * @description —  set by eventSort, from cardFilteret.nextTransitionMs
     * @typedef {Function} setTransition
     * @description - next Transition trigger
     *
     * @type {[Number, Function]} transition
     */
    /* eslint-disable no-unused-vars */
    // const [transition, setTransition] = useState(0);
    //
    // const [, updateState] = React.useState();
    const scrollElementRef = useRef(null);
    // const nextTransition = React.useCallback(() => updateState({}), []);
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
    // const [urlState, setUrlState, clearUrlState] = useURLState();

    /**
     * @typedef {Number} OpenDropdownState - Id of a selected dropdown
     * @description — Passed in Context Provider So All Nested Components can be in sync
     *
     * @typedef {Function} OpenDropdownStateSetter
     * @description
     *
     * @type {[Number, Function]} OpenDropdown
     */
    // const [openDropdown, setOpenDropdown] = useState(null);

    /**
     * @typedef {Array} BookmarkedCardIdsState — Initiailzed From Local Storage
     *
     * @typedef {Function} BookmarkedCardIdsSetter — Sets internal state of saved bookmarks
     *
     * @type {[Array, Function]} BookmarkedCardIds
     */
    // const [bookmarkedCardIds, setBookmarkedCardIds] = useState(readBookmarksFromLocalStorage());
    // const [inclusionIds] = useState(readInclusionsFromLocalStorage());

    /**
     * @typedef {Number} CurrentPageState — Initialized to the first page
     * @description Same page state for 'Load More' or 'Paginator'
     *
     * @typedef {Function} CurrentPageStateSetter — Sets page as user navigates through pages
     *
     * @type {[Number, Function]} CurrentPage
     */
    // const [currentPage, setCurrentPage] = useState(+urlState.page || 1);

    /**
     * @typedef {Array} FiltersState — Contains Filters For Filter Panel
     * @description Same Filter state for Left or Top
     *
     * @typedef {Function} FiltersStateSetter — Sets Authored Filters as State
     *
     * @type {[Array, Function]} Filters
     */
    // const [filters, setFilters] = useState([]);

    /**
     * @typedef {String} SearchQueryState — Will be used to search through cards
     * @typedef {Function} SearchQueryStateSetter — Sets user search query
     *
     * @type {[String, Function]} SearchQuery
     */
    // const [searchQuery, setSearchQuery] = useState('');

    /**
     * @typedef {String} SortOpenedState — Toggles Sort Popup Opened Or Closed
     * @typedef {Function} SortOpenedStateSetter — Sets Sort Option
     *
     * @type {[Boolean, Function]} SortOpened
     */
    // const [sortOpened, setSortOpened] = useState(false);

    /**
     * @typedef {String} SortOptionState — Can be one of a range of types
     * @description 'Title (A-Z)', 'Title (Z-A), Date (New to Old), Date (Old to New), Featured
     *
     * @typedef {Function} SortOptionStateSetter — Sets Sort Option
     *
     * @type {[String, Function]} SortOption
     */
    const [sortOption, setSortOption] = useState(defaultSortOption);
    //
    // if (sortOption.sort === SORT_TYPES.RANDOM) {
    //     totalCardLimit = sampleSize;
    // }

    /**
     * @typedef {Boolean} WindowWidthState — Can either be true or false
     * @description Used to toggle between mobile and desktop layouts
     *
     * @typedef {Function} WindowWidthStateSetter — Updates window width
     *
     * @type {[Number]} WindowWidth
     */
    // const { width: windowWidth } = useWindowDimensions();

    /**
     * @typedef {Boolean} ShowMobileFiltersState — Can either be true or false
     * @description When true mobile filters will appear on the page
     *
     * @typedef {Function} ShowMobileFiltersStateSetter
     * @description Toggles mobile filter header/footer to show or hide
     *
     * @type {[Boolean, Function]} ShowMobileFilters
     */
    // const [showMobileFilters, setShowMobileFilters] = useState(false);

    /**
     * @typedef {Boolean} ShowBookmarkState — Can either be true or false
     * @description For Top Filter Panel, there is a limit to how many filter groups can show
     *
     * @typedef {Function} ShowBookmarkStateSetter — Sets limit on filter quantity
     * @description When over allowed Filter Group Quantity - A "More +" button appears
     *
     * @type {[Boolean, Function]} ShowBookmarks
     */
    // const [showBookmarks, setShowBookmarks] = useState(false);

    /**
     * @typedef {Boolean} LimitFilterQuantityState — Can either be true or false
     * @description For Top Filter Panel, there is a limit to how many filter groups can show
     *
     * @typedef {Function} LimitFilterQuantityStateSetter — Sets limit on filter quantity
     * @description When over allowed Filter Group Quantity - A "More +" button appears
     *
     * @type {[Boolean, Function]} LimitFilterQuantity
     */
    // const [showLimitedFiltersQty, setShowLimitedFiltersQty] = useState(filterPanelType === 'top');

    /**
     * @typedef {Array} CardState
     * @description sets cards retrieved either server side render or API call
     *
     * @typedef {Function} CardStateSetter
     * @description E.g. Render Featured Cards Server side, While collection cards from API call
     *
     * @type {[Array, Function]} Cards
     */
    const [cards, setCards] = useState([
        {
            "id": "6d6438c8-5aa2-36be-bfd0-18a9f6e4cd9c",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/upcoming"
                },
                {
                    "id": "adobe-com-enterprise:topic/digital-trends"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#CB6F10",
                    "fontColor": "#FFFFFF",
                    "description": "Upcoming",
                    "icon": ""
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Bebudegedo rugemanolo kecigaxico ru. Maco vebuc muqelohur terex repec heludem pepam do regisa vec noleviwur puladabu. Ho zuduno nerakema pufe.",
                "description": "Toverah nabili. Rarohapudi mamik neneh bor ti tado do. Decede de cebimolona moba yoten malizo norunecac ca mubun cun lube nek tebabi dezekexi pulu pa dunubec varec cet livo. Dibeloj ko reradir nomemason cinotojub bucicib qimabadal peponecig lepudonob besoku.",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/marquee's/104643%20Adobe_Digital-Bites-web-graphics_marquee%201600x600.jpg"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "primary",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-02T09:41:35.933Z"
        },
        {
            "id": "ac578dee-f01b-3ea0-a282-2116619e4251",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/upcoming"
                },
                {
                    "id": "adobe-com-enterprise:topic/Stock"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#FFFFFF",
                    "fontColor": "#D7373F",
                    "description": "Live",
                    "icon": "https://upload.wikimedia.org/wikipedia/commons/9/92/Location_dot_red.svg"
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "No sanoken pore.",
                "description": "Bopibi ducipasa torureda za rotiludona lupo denos jemo pipupekeb putobepal dare yucidekina lu tamiha no. Cabohanus lujesir tonagico paxudigatu banunejo. Bab heben bareze cimelob giced kalu dubetu bogo. Lecole ni rido mami nanoc muwulobu nobiniyas moxotuqa yej ti cofirupu ci buharal perocin.",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/marquee's/Adobe_Stock_Audio_Banner_1600x%20600.jpg"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-30T08:45:42.881Z"
        },
        {
            "id": "5187e934-ed9e-39de-bf6d-ea796098de3f",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/upcoming"
                },
                {
                    "id": "adobe-com-enterprise:topic/digital-foundation"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#CB6F10",
                    "fontColor": "#FFFFFF",
                    "description": "Upcoming",
                    "icon": ""
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Nafucoz cipagehu cope wo lidumoq. Rubotixore tol melec dagamicadi nadurijo sohehax pup lapunijew royi nehecoro sedic mabuk ducej ribide.",
                "description": "Bareg. Xekileb qi rapobumo bar dabiq remorugib bigiromo yulodobere detubur. Dugemubilu koyibepire. Do bikebopi kiluhe. Mexuralucu ro pu peb.",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/marquee's/landing_page_no_description.png"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-08-10T12:54:50.040Z"
        },
        {
            "id": "ad83970f-c987-3c86-846f-4edaec827fb1",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/upcoming"
                },
                {
                    "id": "adobe-com-enterprise:topic/digital-foundation"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#CB6F10",
                    "fontColor": "#FFFFFF",
                    "description": "Upcoming",
                    "icon": ""
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Zapiv rebucu rup nubahareja pu dad cunu muna.",
                "description": "Korubopep pana.",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/marquee's/104820%20Adobe%20pharma%20webinar%20web%20graphics_2400x800.png"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-16T12:24:48.834Z"
        },
        {
            "id": "79c4132f-d4f4-3291-8d31-6bea27759a79",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/on-demand"
                },
                {
                    "id": "adobe-com-enterprise:topic/digital-foundation"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#1473E6",
                    "fontColor": "#FFFFFF",
                    "description": "On-Demand",
                    "icon": ""
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Gi.",
                "description": "Momicucil bogoruwi werari ner minib cicicinu lemu ceb. Dugunirik tibape zaligumoju. Vobura teyeru tonip ci. Doconim topuc toderita bekag. Pecul rimohep..",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/marquee's/1440x400acomfullbanner_2.png"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-08-06T09:13:35.392Z"
        },
        {
            "id": "a122e5f1-55df-3021-ad4d-154909059ee6",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/on-demand"
                },
                {
                    "id": "adobe-com-enterprise:topic/business-continuity"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#FFFFFF",
                    "fontColor": "#D7373F",
                    "description": "Live",
                    "icon": "https://upload.wikimedia.org/wikipedia/commons/9/92/Location_dot_red.svg"
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Der put dulatupu. Dopo ma morema..",
                "description": "Qewugitiru labavutur babereluq bu bi pora ciboneluye. Niropob xuciropeyo. Temirim.",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/business-continuity/mobile_image_1440x810_option%201c.jpg"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-24T11:01:47.558Z"
        },
        {
            "id": "4b689970-e9fa-37ce-8faa-acf01c653bdc",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/on-demand"
                },
                {
                    "id": "adobe-com-enterprise:topic/business-continuity"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#1473E6",
                    "fontColor": "#FFFFFF",
                    "description": "On-Demand",
                    "icon": ""
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Gepanos tipakobena zotibodeb rejegoperu daceciro racoc pixudicota xeficebu rukoluto suliqom hitirifi waritic kubakib roduw..",
                "description": "Yo dab. Niloh guranebod mohirehada hotud xanepulewe rin nalam five nadomod tuduwukipa dadabim worur. Rac pe. Gi. Bapuzar puro me lihopicozo li quc label belaxikar naruli noburide qehabi ficipiga nakofunova fopoqo vonodinete lip how medup dopur ruboda karac mepe. Vilubumam bipobobeva tobe radu. Haceqacuda puculici balonodi pimeriwabo. Boto ca. Mapara calaki pahuf wite lakid miroha lemu zuc. Bu.",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/business-continuity/mobile_image_1440x810_option%201d.jpg"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-24T11:01:41.854Z"
        },
        {
            "id": "194d8a83-d22d-3d78-b0f9-1a890112dcc0",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/on-demand"
                },
                {
                    "id": "adobe-com-enterprise:topic/business-continuity"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#1473E6",
                    "fontColor": "#FFFFFF",
                    "description": "On-Demand",
                    "icon": ""
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Niririritu dibahe.",
                "description": "He wezo baxedoco nerukimul pec nafepiqa guro cimiranid remetib kopinu. Darihowu jakunu nekedek nok me tir niqataz mezo behe kebew ba sul wobune ponur qa zemapu lekedebo wimocamoba cificey qumunelul. Jekucako ga pitageric kapag decec. Diqodar bonebu hi qikorelile hutomi tutoled ki wu nopoci robicor. Nab qiter box pu nugilitur helobu. Cima neta. Dec. Gutikawon deniwu dililo loliw.",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/business-continuity/mobile_image_1440x810_option%201c.jpg"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-24T10:36:59.320Z"
        },
        {
            "id": "48c1906c-9ba5-32c2-afe3-4554af25ac99",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/on-demand"
                },
                {
                    "id": "adobe-com-enterprise:topic/business-continuity"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#1473E6",
                    "fontColor": "#FFFFFF",
                    "description": "On-Demand",
                    "icon": ""
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Bod pi poriyucabu catanet pote pudu yo. Turudoweto tera qulax cuponiducu damen vineyu ropupepib papov lalokopub gededec du toxo. Guq.",
                "description": "Lurap pudubedo. Hofih dota pimu qen jubuy sacozikeje deni bewuyibap ro ga pametiha ci jusaq gamugilur hupohal cu li nojuzigeha pa pa gubabi xohitume beh goxu lucufiripi tonalur. Mabe boxa nomen be dinalisoc pepela lulira ladimax zac ruraq cekub. Gupefep nevi. Bumi pa patiliwig negibemimu pec peti tivat ped ti cal ra rata nuloyip mojudona lebamituk cojemolebe..",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/business-continuity/mobile_image_1440x810_option%201c.jpg"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-24T10:36:55.358Z"
        },
        {
            "id": "e8dad9e3-2cd3-3b46-9985-46a3c3a2ff31",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/on-demand"
                },
                {
                    "id": "adobe-com-enterprise:topic/business-continuity"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#1473E6",
                    "fontColor": "#FFFFFF",
                    "description": "On-Demand",
                    "icon": ""
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Soju nar gahu ke dol cacen puba zukirubidu dobipodol.",
                "description": "Be yu quw ro pa cereg roruru xol yudimutiro cedi bumekohire quco humarubi bulacoga.",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/business-continuity/mobile_image_1440x810_option%201c.jpg"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-24T10:36:50.122Z"
        },
        {
            "id": "b10726b9-e35b-33d6-a140-6f8e38add752",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/on-demand"
                },
                {
                    "id": "adobe-com-enterprise:topic/business-continuity"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#1473E6",
                    "fontColor": "#FFFFFF",
                    "description": "On-Demand",
                    "icon": ""
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Diyubohome. Nu hodibubol netilo lodeqapi gedutuxode zocemu recopori. Nudapulule kid pib nol cucebi luki ci copoc vabacamum dizic bucogobak. Buraganada.",
                "description": "Jalo jeli rekiqoxi loralanixe mahiw pe yucotinod. Pod bogiba gud bute yobagi gixinofir buneq laxedig tuhake padamemey zeb bagaru bovuro pubopepuhi herudida qunepahuno bu pope huhah ka zonu xanucugace bulob redomuxoge bic cimumim gelorodo.",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/business-continuity/mobile_image_1440x810_option%201c.jpg"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-24T10:36:25.686Z"
        },
        {
            "id": "3f17494c-7dd7-3a09-a664-09efacfa5984",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/on-demand"
                },
                {
                    "id": "adobe-com-enterprise:topic/business-continuity"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#1473E6",
                    "fontColor": "#FFFFFF",
                    "description": "On-Demand",
                    "icon": ""
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Yumo vopij talapona daceyatoqe botaxukeje pili qojaris gogura li pon bodi. Punut jipunu tehicubup tutohido.",
                "description": "Pahid rid mac. Joc mire.",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/business-continuity/mobile_image_1440x810_option%201b.jpg"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-24T10:36:21.639Z"
        },
        {
            "id": "9f4a974f-6247-3246-aba1-1f202f58c590",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/on-demand"
                },
                {
                    "id": "adobe-com-enterprise:topic/business-continuity"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#FFFFFF",
                    "fontColor": "#D7373F",
                    "description": "Live",
                    "icon": "https://upload.wikimedia.org/wikipedia/commons/9/92/Location_dot_red.svg"
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Kan mojulegaye rimapit.",
                "description": "Kolup xuwubuk ledova buvid. Pedomer. Lerib muwijiq hasepuv bozucimar minos galogacu copegod coduni desudep. Huduberefe tugucenabo hibonaxal wodeto wafax tec penelebuhu radocinaru lunodir minodina robicu momihabudu. Tunel copu. Getarirase qapah meminemosi nulud. Qupibo mobera pena boho tos. Domo piw gohijanar bacabili paturedaro gu dicapud ga suw reci bo. Vegenigabi bepokuled buf qirer cucehaju jabuna yulep ri. Romalekapi leg. Ren li nuyorote mihepi. Fudi tec madat bam. Ca. Bubebi mo cimedut.",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/business-continuity/mobile_image_1440x810_option%201b.jpg"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-24T10:36:16.193Z"
        },
        {
            "id": "d5ce10b3-feee-3cb0-a36f-b92f3686b36f",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/on-demand"
                },
                {
                    "id": "adobe-com-enterprise:topic/business-continuity"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#1473E6",
                    "fontColor": "#FFFFFF",
                    "description": "On-Demand",
                    "icon": ""
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "No rifew libabo miluba xapudu rilomob ne bewaduputo begete ceb hoh. Bavalabom debemes. Hamariwun bedatu cidemame..",
                "description": "Tibap keli tohima muvude. Mulabecu xihokor. Reraq cemidilun pep kedotefite pecocu gecunetolo rulomo dujamadod bare rizipojiq nirid poneciqo ni juvijo nepiberego re de ronepocac malire. Noner hep wilej. Pi rarab delalutap caponavaq dom ken jetun purarabe tebu sobifebu defemuled ralumeri zi mi cucerim. Lej kameduqab hanalog li. Bizomut modobe. Xo donuqep nojob meg di vubaboco mogalefum giko pisobopop ranuta ba yogisebop barujab xanux.",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/business-continuity/mobile_image_1440x810_option%201b.jpg"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-24T10:36:11.569Z"
        },
        {
            "id": "89ac773a-e3ef-34a2-adb3-e40e5a519fb5",
            "showCard": {
                "from": "2020-10-01T20:00:00Z",
                "until": "2025-10-31T21:45:00Z"
            },
            "tags": [
                {
                    "id": "adobe-com-enterprise:content-type/webinar"
                },
                {
                    "id": "adobe-com-enterprise:availability/on-demand"
                },
                {
                    "id": "adobe-com-enterprise:topic/business-continuity"
                }
            ],
            "overlays": {
                "banner": {
                    "backgroundColor": "#FFFFFF",
                    "fontColor": "#D7373F",
                    "description": "Live",
                    "icon": "https://upload.wikimedia.org/wikipedia/commons/9/92/Location_dot_red.svg"
                },
                "logo": {},
                "label": {},
                "videoButton": {}
            },
            "contentArea": {
                "detailText": "",
                "title": "Dihutumow rih re gida norojedera ledobe lokelite duj jecaro budecobalu jodugoro lumuho cun lacimoj lebayitima nisuju negomo yekuri folara.",
                "description": "Vidim yanakad. Ne. Padiquco moromih kizabirixe babi bicesac dewaholuwa derunipi rakuga bu bipedaviwi ladiwecof tove bupubefuv. Moma. Panup nuje sibi timose mubimider dedob le pere ga bo naco ro. Hilib lalalicot su vocutu pavi pibaduro donet pi. Zuvope tid nuyahudib tam. Ridip fopedo. La yah bati ranuliqohu higi..",
                "dateDetailText": {}
            },
            "styles": {
                "typeOverride": "",
                "backgroundImage": "https://adobe.com/content/dam/www/uk/en/enterprise/events/webinars/marquee's/Thumbnail__Create-and-Collaborate_small.jpg"
            },
            "footer": [
                {
                    "divider": true,
                    "left": [
                        {
                            "type": "bookmark",
                            "saveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/saved_bookmark.svg",
                            "unsaveCardIcon": "https://caas-chimera.s3-us-west-1.amazonaws.com/icons/unsaved_bookmark.svg",
                            "cardSaveText": "Save Card",
                            "cardUnsaveText": "Unsave Card"
                        },
                        {
                            "type": "date-interval",
                            "startTime": "2020-10-20T20:00:00Z",
                            "endTime": "2020-10-27T21:45:00Z"
                        }
                    ],
                    "center": [],
                    "right": [
                        {
                            "type": "button",
                            "style": "call-to-action",
                            "text": "Read More",
                            "href": "https://www.google.com"
                        }
                    ]
                }
            ],
            "cardDate": "2020-07-24T10:35:58.220Z"
        },
    ]);

    /**
     * @typedef {Boolean} LoadingState — Can either be true or false
     * @description When true a loading spinner will appear on the page
     *
     * @typedef {Function} LoadingStateSetter — Sets loader true or false
     * @description True while waiting for API response. False on cards retrieved or api failure
     *
     * @type {[Boolean, Function]} Loading
     */
    // const [isLoading, setLoading] = useState(false);

    /**
     * @typedef {Boolean} ApiFailureState — Can either be true or false
     * @description When true an API error has occured
     *
     * @typedef {Function} ApiFailureStateSetter — Sets API failure flag true or false
     * @description True when retrieved or api failure. False otherwise
     *
     * @type {[Boolean, Function]} ApiFailure
     */
    // const [isApiFailure, setApiFailure] = useState(false);
    // const [randomSortId, setRandomSortId] = useState(null);
    // const [isFirstLoad, setIsFirstLoad] = useState(true);
    // const [visibleStamp, setVisibleStamp] = useState();
    // const [hasFetched, setHasFetched] = useState(false);

    /**
     * Creates a DOM reference to first filter item
     * @returns {Object} - filter item DOM reference
     */
    // const filterItemRef = createRef();

    /**
     * Creates a DOM reference to filter info button
     * @returns {Object} - filter info DOM reference
     */
    // const filterInfoRef = createRef();

    /**
     **** Helper Methods ****
     */

    /**
     * For a given group of filters, it will unselect all of them
     * @param {Array} filterGroups - a group of filters
     * @returns {Array} fitlerGroups - the updated group of filters
     */
    // const getAllFiltersClearedState = filterGroups => filterGroups.map(filterGroup => ({
    //     ...filterGroup,
    //     items: filterGroup.items.map(filterItem => ({
    //         ...filterItem,
    //         selected: false,
    //     })),
    // }));

    /**
     * For a given group of filters, it will unselect the one with a given id
     * @param {Number} id - the id of an individual filter item
     * @param {Array} filterGroups - a group of filters
     * @returns {Array} fitlerGroups - the updated group of filters
     */
    // const getFilterItemClearedState = (id, filterGroups) => filterGroups.map((filterGroup) => {
    //     if (filterGroup.id !== id) {
    //         return filterGroup;
    //     }
    //     return {
    //         ...filterGroup,
    //         items: filterGroup.items.map(filterItem => ({
    //             ...filterItem,
    //             selected: false,
    //         })),
    //     };
    // });

    /**
     * Will uncheck a filter with a given id
     * @param {Number} id - the id of an individual filter item
     * @returns {Void} - an updated state
     */
    // const clearFilterItem = (id) => {
    //     setFilters((prevFilters) => {
    //         const filterClearedState = getFilterItemClearedState(id, prevFilters);
    //         return filterClearedState;
    //     });
    //
    //     const urlParams = new URLSearchParams(window.location.search);
    //     clearUrlState();
    //     urlParams.forEach((value, key) => {
    //         const chFilter = key.toLowerCase().replace('ch_', '').replace(' ', '-');
    //         if (key.indexOf(filterGroupPrefix) !== 0 || !id.includes(chFilter)) {
    //             setUrlState(key, value.replace('%20', ' '));
    //         }
    //     });
    // };

    /**
     * Will uncheck all filter items
     * @returns {Void} - an updated state
     */
    // const clearAllFilters = () => {
    //     setFilters((prevFilters) => {
    //         const allFiltersClearedState = getAllFiltersClearedState(prevFilters);
    //         return allFiltersClearedState;
    //     });
    //
    //     const urlParams = new URLSearchParams(window.location.search);
    //
    //     clearUrlState();
    //     urlParams.forEach((value, key) => {
    //         if (key.indexOf(filterGroupPrefix) !== 0) setUrlState(key, value);
    //     });
    // };

    /**
     * Resets filters, and search to empty. Hides bookmark filter
     * @returns {Void} - an updated state
     */
    // const resetFiltersSearchAndBookmarks = () => {
    //     clearAllFilters();
    //     setSearchQuery('');
    //     setShowBookmarks(false);
    // };

    /**
     **** EVENT HANDLERS ****
     */

    /**
     * On Load More Button Click, Increment Page Cuonter By 1
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    // const onLoadMoreClick = () => {
    //     setCurrentPage(prevState => prevState + 1);
    //     window.scrollTo(0, window.pageYOffset);
    // };

    /**
     * Takes sort user selects and sets it so cards are sorted
     *
     * @param {ClickEvent} e - The observable event.
     * @listens ClickEvent
     */
    // const handleSortChange = (option) => {
    //     setSortOption(option);
    //     setSortOpened(false);
    //     setIsFirstLoad(false);
    // };

    /**
     * Handles whenever the search box is clicked or input field
     * changes
     *
     * @param {ClickEvent, ChangeEvent} e
     * @listens ClickEvent, ChangeEvent
     */
    // const handleSearchInputChange = (val) => {
    //     setSearchQuery(val);
    //     setUrlState(searchPrefix, val);
    // };

    /**
     * Handles when a group of filters is clicked. Behavior should be
     * to toggle group open or closed
     *
     * @param {ClickEvent} e - The observable event.
     * @listens ClickEvent
     */
    // const handleFilterGroupClick = (filterId) => {
    //     setFilters((prevFilters) => {
    //         let opened;
    //         return prevFilters.map((el) => {
    //             if (el.id === filterId) {
    //                 opened = !el.opened;
    //             } else {
    //                 // eslint-disable-next-line prefer-destructuring
    //                 opened = el.opened;
    //             }
    //             return { ...el, opened };
    //         });
    //     });
    // };

    /**
     * Will find and set needed filter to url
     *
     * @param {string} filterId - selected filter group id
     * @param {string} itemId - selected filter item id
     * @param {boolean} isChecked
     * @returns {Void} - an updated url
     */
    // const changeUrlState = (filterId, itemId, isChecked) => {
    //     const { group, items } = filters.find(({ id }) => id === filterId);
    //     const { label } = items.find(({ id }) => id === itemId);
    //
    //     let urlStateValue = urlState[filterGroupPrefix + group] || [];
    //     if (typeof urlStateValue === 'string') {
    //         urlStateValue = urlStateValue.split(',');
    //     }
    //
    //     const value = isChecked
    //         ? [...urlStateValue, label]
    //         : urlStateValue.filter(item => item !== label);
    //
    //     setUrlState(filterGroupPrefix + group, value);
    // };

    /**
     * Handles what happens when a specific filter item (checkbox)
     * is clicked
     *
     * @param {CheckboxClickEvent} e
     * @listens CheckboxClickEvent
     */
    // const handleCheckBoxChange = (filterId, itemId, isChecked) => {
    //     if (isXorFilter && isChecked) {
    //         clearAllFilters();
    //     }
    //
    //     setFilters(prevFilters => prevFilters.map((filter) => {
    //         if (filter.id !== filterId) return filter;
    //
    //         return {
    //             ...filter,
    //             items: filter.items.map(item => ({
    //                 ...item,
    //                 selected: item.id === itemId ? !item.selected : item.selected,
    //             })),
    //         };
    //     }));
    //     setCurrentPage(1);
    //     changeUrlState(filterId, itemId, isChecked);
    // };

    /**
     * Shows/Hides Mobile Filter Panel
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    // const handleMobileFiltersToggle = () => setShowMobileFilters(prev => !prev);

    /**
     * When a card's bookmark icon is clicked, save the card
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    // const handleCardBookmarking = (id) => {
    //     // Update bookmarked IDs
    //     const cardIsBookmarked = bookmarkedCardIds.find(card => card === id);
    //
    //     if (cardIsBookmarked) {
    //         setBookmarkedCardIds(prev => prev.filter(el => el !== id));
    //     } else {
    //         setBookmarkedCardIds(prev => [...prev, id]);
    //     }
    // };

    /**
     * Will show  or hide all saved bookmarks when clicked
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    // const handleShowBookmarksFilterClick = (e) => {
    //     e.stopPropagation();
    //     setShowBookmarks(prev => !prev);
    //     setCurrentPage(1);
    // };

    /**
     * If top filter panel, toggle or hide more button
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    // const handleShowAllTopFilters = () => {
    //     setShowLimitedFiltersQty(prev => !prev);
    // };

    /**
     * On window click, all dropdowns should hide
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    // const handleWindowClick = () => {
    //     setOpenDropdown(null);
    // };

    /**
     * Handles escape for mobile filter dialog
     *
     * @param event
     */
    // const handleMobileFilterEscape = (event) => {
    //     if (event.key !== 'Escape' && event.key !== 'Esc') return;
    //
    //     setShowMobileFilters(false);
    // };

    /**
     **** Effects ****
     */

    /**
     * Sets authored filters as state
     * @returns {Void} - an updated state
     */

    // useEffect(() => {
    //     setFilters(authoredFilters.map(filterGroup => ({
    //         ...filterGroup,
    //         opened: DESKTOP_SCREEN_SIZE ? filterGroup.openedOnLoad : false,
    //         items: filterGroup.items.map(filterItem => ({
    //             ...filterItem,
    //             selected: false,
    //         })),
    //     })));
    // }, []);

    /**
     * Sets filters from url as tate
     * @returns {Void} - an updated state
     */

    // useEffect(() => {
    //     setFilters(origin => origin.map((filter) => {
    //         const { group, items } = filter;
    //         const urlStateValue = urlState[filterGroupPrefix + group];
    //
    //         if (!urlStateValue) return filter;
    //
    //         const urlStateArray = urlStateValue.split(',');
    //         return {
    //             ...filter,
    //             opened: true,
    //             items: items.map(item => ({
    //                 ...item,
    //                 selected: urlStateArray.includes(String(item.label)),
    //             })),
    //         };
    //     }));
    // }, []);
    //
    // useEffect(() => {
    //     setRandomSortId(Math.floor((Math.random() * 10e12)));
    // }, []);

    /**
     * Trigger after button load more click
     * @returns {Void} - an updated url page
     */
    // useEffect(() => {
    //     setUrlState('page', currentPage === 1 ? '' : currentPage);
    // }, [currentPage]);

    // const removeEmptyFilters = (allFilters, cardsFromJson) => {
    //     const tags = [].concat(...cardsFromJson.map(card => card.tags.map(tag => tag.id)));
    //
    //     return allFilters.map(filter => ({
    //         ...filter,
    //         items: filter.items.filter(item => tags.includes(item.id)),
    //     })).filter(filter => filter.items.length > 0);
    // };

    /**
     * This handles getting Cards, there are some conditions:
     * - If target is not enabled a simple request is made without mods or delay.
     * - If target is enabled & tVisitor API is present add values from Visitor
     * - If target is enabled & the Visitor API is not present setTimeout with
     * counter to recheck for the Visitor API. If 20 attempts are made w/o
     * success fail the request.
     * @returns {Void} - an updated state
     */
    // useEffect(() => {
    //     if ((isLazy && visibleStamp) || (isLazy && !hasFetched)) {
    //         return;
    //     }
    //     const { __satelliteLoadedPromise: visitorPromise } = window;
    //
    //     let collectionEndpoint = getConfig('collection', 'endpoint');
    //     const fallbackEndpoint = getConfig('collection', 'fallbackEndpoint');
    //
    //     const r = new RegExp('^(?:[a-z]+:)?//', 'i');
    //     let collectionEndpointURI;
    //     if (r.test(collectionEndpoint)) {
    //         collectionEndpointURI = new URL(collectionEndpoint);
    //     } else {
    //         collectionEndpointURI = new URL(collectionEndpoint, window.location.origin);
    //     }
    //
    //     if (!fallbackEndpoint) {
    //         collectionEndpointURI.searchParams.set('flatFile', false);
    //         collectionEndpoint = collectionEndpointURI.toString();
    //     }
    //
    //     setLoading(true);
    //
    //     /**
    //      * @func getCards
    //      * @desc wraps fetch with function to make it reusable
    //      *
    //      * @param {String} endPoint, URL with params for card request
    //      * @returns {Void} - an updated state
    //      */
    //     function getCards(endPoint = collectionEndpoint) {
    //         return window.fetch(endPoint, {
    //             credentials: 'include',
    //         })
    //             .then((resp) => {
    //                 const {
    //                     ok,
    //                     status,
    //                     statusText,
    //                     url,
    //                 } = resp;
    //
    //                 if (ok) {
    //                     return resp.json().then((json) => {
    //                         const validData = !!Object.keys(json).length;
    //
    //                         if (validData) return json;
    //
    //                         return Promise.reject(new Error('no valid reponse data'));
    //                     });
    //                 }
    //
    //                 return Promise.reject(new Error(`${status}: ${statusText}, failure for call to ${url}`));
    //             })
    //             .then((payload) => {
    //                 setLoading(false);
    //                 setIsFirstLoad(true);
    //                 if (!getByPath(payload, 'cards.length')) return;
    //
    //                 const { processedCards = [] } = new JsonProcessor(payload.cards)
    //                     .removeDuplicateCards()
    //                     .addCardMetaData(
    //                         TRUNCATE_TEXT_QTY,
    //                         onlyShowBookmarks,
    //                         bookmarkedCardIds,
    //                         hideCtaIds,
    //                     );
    //
    //                 const transitions = getTransitions(processedCards);
    //                 if (sortOption.sort.toLowerCase() === 'eventsort') {
    //                     while (transitions.size() > 0) {
    //                         setTimeout(() => {
    //                             nextTransition();
    //                         }, transitions.dequeue().priority + ONE_SECOND_DELAY);
    //                     }
    //                 }
    //
    //                 setCards(processedCards);
    //                 if (!showEmptyFilters) {
    //                     setFilters(prevFilters => removeEmptyFilters(prevFilters, processedCards));
    //                 }
    //                 setTimeout(() => {
    //                     if (!scrollElementRef.current) return;
    //                     if (processedCards.length === 0) return;
    //                     if (currentPage === 1) return;
    //                     const cardsToshow = processedCards.slice(0, resultsPerPage * currentPage);
    //                     const getLastPageID = (resultsPerPage * currentPage) - resultsPerPage;
    //                     if (cardsToshow.length < getLastPageID) return;
    //                     const lastID = scrollElementRef.current.children[getLastPageID];
    //                     lastID.scrollIntoView();
    //                 }, 100);
    //             }).catch(() => {
    //                 if (endPoint === collectionEndpoint && fallbackEndpoint) {
    //                     getCards(fallbackEndpoint);
    //                     return;
    //                 }
    //                 setLoading(false);
    //                 setApiFailure(true);
    //             });
    //     }
    //     /**
    //      * @func getVisitorData
    //      * @desc wraps fetching Visitor API data in a function for reuse, also if
    //      * last used session is checked, update currentEntityId with targetValueRevealID
    //      *
    //      * @param {Promise} visitorApi, window.__satelliteLoadedPromise when accessed
    //      * @returns {Void} - an updated state, thru calling getCards
    //      */
    //     function getVisitorData(visitorApi) {
    //         const collectionURI = new URL(collectionEndpoint);
    //
    //         if (useLastViewedSession) {
    //             const targetRevealId = localStorage.getItem('targetValueRevealID');
    //             if (targetRevealId) {
    //                 collectionURI.searchParams.set('currentEntityId', targetRevealId);
    //             }
    //         }
    //
    //         visitorApi.then((result) => {
    //             if (window.alloy && window.edgeConfigId) {
    //                 window.alloy('getIdentity')
    //                     .then((res) => {
    //                         collectionURI.searchParams.set('mcgvid', res.identity.ECID);
    //                         collectionURI.searchParams.set('mboxMCGLH', res.edge.regionId);
    //                         getCards(collectionURI.toString());
    //                     });
    //             } else {
    //                 const visitor = result.getVisitorId();
    //                 collectionURI.searchParams.set('mcgvid', visitor.getMarketingCloudVisitorID());
    //                 collectionURI.searchParams.set('sdid', visitor.getSupplementalDataID());
    //                 collectionURI.searchParams.set('mboxAAMB', visitor.getAudienceManagerBlob());
    //                 collectionURI.searchParams.set('mboxMCGLH', visitor.getAudienceManagerLocationHint());
    //                 getCards(collectionURI.toString());
    //             }
    //         });
    //     }
    //
    //     /**
    //      * @func visitorRetry
    //      * @desc Visitor API is late loading often, this sets a recursive call
    //      * in a setTimeout to run 20 times, and then fail the request.
    //      *
    //      * @returns {Void} - an updated state, thru calling getVisitorData which
    //      * calls getCards
    //      */
    //     function visitorRetry() {
    //         let retryCount = 0;
    //
    //         const timedRetry = () => {
    //             setTimeout(() => {
    //                 if (retryCount >= 20) {
    //                     setLoading(false);
    //
    //                     setApiFailure(true);
    //
    //                     return;
    //                 }
    //
    //                 const { __satelliteLoadedPromise: visitorPromiseRetry } = window;
    //
    //                 if (visitorPromiseRetry) {
    //                     getVisitorData(visitorPromiseRetry);
    //                 }
    //
    //                 if (!visitorPromiseRetry && retryCount < 20) {
    //                     timedRetry();
    //                 }
    //
    //                 retryCount += 1;
    //             }, 100);
    //         };
    //
    //         timedRetry();
    //     }
    //
    //     if (targetEnabled && visitorPromise) {
    //         getVisitorData(visitorPromise);
    //     }
    //
    //     if (targetEnabled && !visitorPromise) {
    //         visitorRetry();
    //     }
    //
    //     if (!targetEnabled) {
    //         getCards();
    //     }
    // }, [visibleStamp, hasFetched]);

    /**
     * Saves cards to local storage and updates card w/ bookmarked data
     * @returns {Void} - an updated state
     */
    // useEffect(() => {
    //     saveBookmarksToLocalStorage(bookmarkedCardIds);
    //     setCards(getUpdatedCardBookmarkData(cards, bookmarkedCardIds));
    // }, [bookmarkedCardIds]);


    /**
     * Handles clearing state on showBookmarks
     * @returns {Void} - an updated state
     */
    // useEffect(() => {
    //     if (showBookmarks) {
    //         clearAllFilters();
    //         setSearchQuery('');
    //     }
    // }, [showBookmarks]);

    /**
     * Handles focus and escape on mobile filter toggle
     * @returns {Void}
     */
    // useEffect(() => {
    //     if (showMobileFilters) {
    //         if (filterItemRef && filterItemRef.current) {
    //             filterItemRef.current.focusMobTitle();
    //         }
    //         document.addEventListener('keydown', handleMobileFilterEscape);
    //     } else {
    //         if (filterInfoRef && filterInfoRef.current) {
    //             filterInfoRef.current.focus();
    //         }
    //         document.removeEventListener('keydown', handleMobileFilterEscape);
    //     }
    //
    //     return () => {
    //         document.removeEventListener('keydown', handleMobileFilterEscape);
    //     };
    // }, [showMobileFilters]);
    //
    // const box = useRef();
    //
    // useEffect(() => {
    //     if (box && !visibleStamp && isLazy) {
    //         const io = new IntersectionObserver((entries) => {
    //             if (entries[0].intersectionRatio <= 0) return;
    //             setHasFetched(true);
    //             setVisibleStamp(new Date().getTime());
    //         });
    //         io.observe(box.current);
    //     }
    // }, [box]);

    /**
     **** Derived State ****
     */

    /**
     * Array of filters chosen by the user
     * @type {Array}
     */
    // const activeFilterIds = getActiveFilterIds(filters);

    /**
     * Array of filters panels (groupings) created by the author
     * @type {Array}
     */
    // const activePanels = getActivePanels(activeFilterIds) || new Set();

    /**
     * Instance of CardFilterer class that handles returning subset of cards
     * based off user interactions
     *
     * @type {Object}
     */
    /**
     * @type {Function} getFilteredCollection
     * @desc Closure around CardFilterer for reuse within context
     * @returns {Object}
     * */
    // const getFilteredCollection = cards;

    /**
     * @type {Array} filteredCards: Filtered cards based off current state of page
     * @type {Number} nextTransitionMs: Number for timed event sort transition
     */
    /* eslint-disable no-unused-vars */
    // const { filteredCards = [], nextTransitionMs = 0 } = getFilteredCollection();

    /**
     * Subset of cards to show the user
     * @type {Array}
     */
    //const gridCards = cards;

    /**
     * Total pages (used by Paginator Component)
     * @type {Number}
     */
    // const totalPages = getTotalPages(resultsPerPage, gridCards.length);

    /**
     * Number of cards to show (used by Load More component)
     * @type {Number}
     */
    // const numCardsToShow = getNumCardsToShow(resultsPerPage, currentPage, gridCards.length);

    /**
     * How many filters were selected - (used by Left Filter Panel)
     * @type {Number}
     */
    // const selectedFiltersItemsQty = getNumSelectedFilterItems(filters);

    /**
     * Conditions to Display A Form Of Pagination
     * @type {Boolean}
     */
    // const displayPagination = shouldDisplayPaginator(
    //     paginationIsEnabled,
    //     totalCardLimit,
    //     gridCards.length,
    // );
    /**
     * Conditions to display the Load More Button
     * @type {Boolean}
     */
    // const displayLoadMore = displayPagination && paginationType === 'loadMore';

    /**
     * Conditions to display the Paginator Component
     * @type {Boolean}
     */
    // const displayPaginator = displayPagination && paginationType === 'paginator';

    /**
     * Conditions to display the Left Filter Panel Component
     * @type {Boolean}
     */
    // const displayLeftFilterPanel = filterPanelEnabled && filterPanelType === FILTER_PANEL.LEFT;

    /**
     * Whether at lease one card was returned by Card Filterer
     * @type {Boolean}
     */
    // const atLeastOneCard = gridCards.length > 0;

    /**
     * Where to place the Sort Popup (either left or right)
     * @type {String} - Location of Sort Popup in Top Filter Panel View
     */
    // const topPanelSortPopupLocation = filters.length > 0 && windowWidth < TABLET_MIN_WIDTH ?
    //     SORT_POPUP_LOCATION.LEFT : SORT_POPUP_LOCATION.RIGHT;

    /**
     * How Long Paginator Component Should Be
     * @type {Number} - Location of Sort Popup in Top Filter Panel View
     */
    // const paginatorCount = DESKTOP_SCREEN_SIZE ? PAGINATION_COUNT.DESKTOP : PAGINATION_COUNT.MOBILE;

    /**
     * Whether we are using the top filter panel or not
     * @type {Boolean}
     */
    // const isTopFilterPanel = filterPanelType === FILTER_PANEL.TOP;

    /**
     * Whether we are using the top filter panel or not
     * @type {Boolean}
     */
    // const isLeftFilterPanel = filterPanelType === FILTER_PANEL.LEFT;

    /**
     * Ui options that cause grid to rerender necessitate the aria attribute being set
     * @type {Boolean}
     */
    // const isGridAreaLive =
    //     filterPanelEnabled ||
    //     searchEnabled ||
    //     sortEnabled ||
    //     paginationIsEnabled;
    //
    // let filterNames = '';
    // filters.forEach((el) => {
    //     el.items.filter(item => item.selected).forEach((item) => {
    //         filterNames += `${item.label}, `;
    //     });
    // });

    /**
     **** Class names ****
     */

    /**
     * Class name for the authored theme:
     * light, dark, darkest;
     * @type {String}
     */
    // const themeClass = classNames({
    //     'consonant-u-themeLight': authoredMode === THEME_TYPE.LIGHT,
    //     'consonant-u-themeDark': authoredMode === THEME_TYPE.DARK,
    //     'consonant-u-themeDarkest': authoredMode === THEME_TYPE.DARKEST,
    // });


    // const collectionStr = collectionIdentifier ? `${collectionIdentifier} | ` : '';
    // const filterStr = selectedFiltersItemsQty ? filterNames : 'No Filters';
    // const searchQueryStr = searchQuery || 'None';
    // const collectionAnalytics = `${collectionStr}Card Collection | Filters: ${filterStr}| Search Query: ${searchQueryStr}`;
    /**
     * Class name for the consonant wrapper:
     * whether consonant wrapper contains left filter;
     * @type {String}
     */
    // const wrapperClass = classNames({
    //     'consonant-Wrapper': true,
    //     'consonant-Wrapper--32MarginContainer': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_100_VW_32_MARGIN,
    //     'consonant-Wrapper--83PercentContainier': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_83_VW,
    //     'consonant-Wrapper--1200MaxWidth': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_1200_PX,
    //     'consonant-Wrapper--1600MaxWidth': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_1600_PX,
    //     'consonant-Wrapper--carousel': isCarouselContainer,
    //     'consonant-Wrapper--withLeftFilter': filterPanelEnabled && isLeftFilterPanel,
    // });

    return (
        <Fragment>
            {/* eslint-disable-next-line max-len */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */}
            <section
                role="group"
                aria-label={'title'}
                daa-lh={'collectionAnalytics'}
                daa-im={String('')}
                onClick={()=>{}}
                className={`a b`}>
                <div className="consonant-Wrapper-inner">
                    Hello
                    { true && true &&
                        <div className="consonant-Wrapper-leftFilterWrapper">
                            {/*<LeftFilterPanel*/}
                            {/*    filters={filters}*/}
                            {/*    selectedFiltersQty={selectedFiltersItemsQty}*/}
                            {/*    windowWidth={windowWidth}*/}
                            {/*    onFilterClick={handleFilterGroupClick}*/}
                            {/*    onClearAllFilters={resetFiltersSearchAndBookmarks}*/}
                            {/*    onClearFilterItems={clearFilterItem}*/}
                            {/*    onCheckboxClick={handleCheckBoxChange}*/}
                            {/*    onMobileFiltersToggleClick={handleMobileFiltersToggle}*/}
                            {/*    onSelectedFilterClick={handleCheckBoxChange}*/}
                            {/*    showMobileFilters={showMobileFilters}*/}
                            {/*    resQty={gridCards.length}*/}
                            {/*    bookmarkComponent={*/}
                            {/*        <Bookmarks*/}
                            {/*            showBookmarks={showBookmarks}*/}
                            {/*            onClick={handleShowBookmarksFilterClick}*/}
                            {/*            savedCardsCount={bookmarkedCardIds.length} />*/}
                            {/*    }*/}
                            {/*    searchComponent={*/}
                            {/*        <Search*/}
                            {/*            placeholderText={leftPanelSearchPlaceholder}*/}
                            {/*            name="filtersSideSearch"*/}
                            {/*            value={searchQuery}*/}
                            {/*            autofocus={false}*/}
                            {/*            onSearch={handleSearchInputChange} />*/}
                            {/*    }*/}
                            {/*    ref={filterItemRef} />*/}
                        </div>
                    }
                    <div className={`consonant-Wrapper-collection${true ? ' is-loading' : ''}`}>
                        {/*{ isTopFilterPanel && isStandardContainer &&*/}
                        {/*<FiltersPanelTop*/}
                        {/*    filterPanelEnabled={filterPanelEnabled}*/}
                        {/*    filters={filters}*/}
                        {/*    windowWidth={windowWidth}*/}
                        {/*    resQty={gridCards.length}*/}
                        {/*    onCheckboxClick={handleCheckBoxChange}*/}
                        {/*    onFilterClick={handleFilterGroupClick}*/}
                        {/*    onClearFilterItems={clearFilterItem}*/}
                        {/*    onClearAllFilters={resetFiltersSearchAndBookmarks}*/}
                        {/*    showLimitedFiltersQty={showLimitedFiltersQty}*/}
                        {/*    searchComponent={*/}
                        {/*        <Search*/}
                        {/*            placeholderText={topPanelSearchPlaceholder}*/}
                        {/*            name="filtersTopSearch"*/}
                        {/*            value={searchQuery}*/}
                        {/*            autofocus={DESKTOP_SCREEN_SIZE}*/}
                        {/*            onSearch={handleSearchInputChange} />*/}
                        {/*    }*/}
                        {/*    sortComponent={*/}
                        {/*        <Popup*/}
                        {/*            opened={sortOpened}*/}
                        {/*            id="sort"*/}
                        {/*            val={sortOption}*/}
                        {/*            values={sortOptions}*/}
                        {/*            onSelect={handleSortChange}*/}
                        {/*            name="filtersTopSelect"*/}
                        {/*            autoWidth*/}
                        {/*            optionsAlignment={topPanelSortPopupLocation} />*/}
                        {/*    }*/}
                        {/*    onShowAllClick={handleShowAllTopFilters} />*/}
                        {/*}*/}
                        {
                            // <LeftInfo
                            //     enabled={filterPanelEnabled}
                            //     filtersQty={filters.length}
                            //     filters={filters}
                            //     cardsQty={gridCards.length}
                            //     selectedFiltersQty={selectedFiltersItemsQty}
                            //     windowWidth={windowWidth}
                            //     onMobileFiltersToggleClick={handleMobileFiltersToggle}
                            //     searchComponent={(
                            //         <Search
                            //             placeholderText={searchPlaceholderText}
                            //             name="searchFiltersInfo"
                            //             value={searchQuery}
                            //             autofocus={false}
                            //             onSearch={handleSearchInputChange} />
                            //     )}
                            //     sortComponent={
                            //         <Popup
                            //             opened={sortOpened}
                            //             id="sort"
                            //             val={sortOption}
                            //             values={sortOptions}
                            //             onSelect={handleSortChange}
                            //             autoWidth={false}
                            //             optionsAlignment="right" />
                            //     }
                            //     sortOptions={sortOptions}
                            //     ref={filterInfoRef} />
                        }
                        {
                            <Fragment>
                                <Grid
                                    resultsPerPage={55}
                                    pages={1}
                                    cards={cards}
                                    forwardedRef={scrollElementRef}
                                    onCardBookmark={() => {}}
                                    isAriaLiveActive={false} />
                                {/*{displayLoadMore &&*/}
                                {/*<LoadMore*/}
                                {/*    onClick={onLoadMoreClick}*/}
                                {/*    show={numCardsToShow}*/}
                                {/*    total={gridCards.length} />*/}
                                {/*}*/}
                                {/*{displayPaginator &&*/}
                                {/*<Paginator*/}
                                {/*    pageCount={paginatorCount}*/}
                                {/*    currentPageNumber={currentPage}*/}
                                {/*    totalPages={totalPages}*/}
                                {/*    showItemsPerPage={resultsPerPage}*/}
                                {/*    totalResults={gridCards.length}*/}
                                {/*    onClick={setCurrentPage} />*/}
                                {/*}*/}
                            </Fragment>}
                        {/*{ atLeastOneCard && isCarouselContainer && !(cardStyle === 'custom-card') &&*/}
                        {/*<CardsCarousel*/}
                        {/*    resQty={gridCards.length}*/}
                        {/*    cards={gridCards}*/}
                        {/*    onCardBookmark={handleCardBookmarking} />*/}
                        {/*}*/}
                        {/*{ atLeastOneCard && isCarouselContainer && (cardStyle === 'custom-card') &&*/}
                        {/*<NoResultsView*/}
                        {/*    title="Not Supported"*/}
                        {/*    description="Using custom cards within a carousel layout is currently not supported. Please*/}
                        {/*    re-author the component"*/}
                        {/*    replaceValue="" />*/}
                        {/*}*/}
                        {/*{ isLoading && !atLeastOneCard &&*/}
                        {/*<Loader*/}
                        {/*    size={LOADER_SIZE.BIG}*/}
                        {/*    hidden={!totalCardLimit}*/}
                        {/*    absolute />*/}
                        {/*}*/}
                        {/*{ !isApiFailure && !atLeastOneCard && !isLoading &&*/}
                        {/*<NoResultsView*/}
                        {/*    title={'No results'}*/}
                        {/*    description={'Some description'}*/}
                        {/*    replaceValue={'searchQuery'} />*/}
                        {/*}*/}
                        {/*{ isApiFailure &&*/}
                        {/*<NoResultsView*/}
                        {/*    title={apiFailureTitle}*/}
                        {/*    description={apiFailureDescription}*/}
                        {/*    replaceValue="" />*/}
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

// Container.propTypes = {
//     config: shape(configType),
// };

Container.defaultProps = {
    config: {},
};

export default Container;
