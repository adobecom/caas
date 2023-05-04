/* eslint-disable */
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
