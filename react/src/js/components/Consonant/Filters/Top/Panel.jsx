import React from 'react';
import classNames from 'classnames';
import {
    arrayOf,
    shape,
    number,
    bool,
    func,
    node,
} from 'prop-types';

import { filterType } from '../../types/config';
import SearchIcon from '../../Search/SearchIcon';
import { Group as TopFilterItem } from './Group';
import { RenderTotalResults } from '../../Helpers/rendering';
import {
    getSelectedItemsCount,
    isAtleastOneFilterSelected,
} from '../../Helpers/general';
import {
    useConfig,
    useExpandable,
} from '../../Helpers/hooks';
import {
    TABLET_MIN_WIDTH,
    MIN_FILTERS_SHOW_BG,
    MAX_TRUNCATED_FILTERS,
} from '../../Helpers/constants';


const filtersPanelTopType = {
    resQty: number,
    showLimitedFiltersQty: bool,
    sortComponent: node.isRequired,
    windowWidth: number.isRequired,
    onFilterClick: func.isRequired,
    onShowAllClick: func.isRequired,
    searchComponent: node.isRequired,
    filters: arrayOf(shape(filterType)),
    onCheckboxClick: func.isRequired,
    onClearAllFilters: func.isRequired,
    onClearFilterItems: func.isRequired,
    filterPanelEnabled: bool.isRequired,
};

const defaultProps = {
    resQty: 0,
    filters: [],
    showLimitedFiltersQty: false,
};

/**
 * Top filters panel
 *
 * @component
 * @example
 * const props= {
    filters: Array,
    resQty: Number,
    onCheckboxClick: Function,
    onFilterClick: Function,
    onClearAllFilters: Function,
    onClearFilterItems: Function,
    showLimitedFiltersQty: Boolean,
    onShowAllClick: Function,
    windowWidth: Number,
    searchComponent: Node,
    sortComponent: Node,
    filterPanelEnabled: Boolean,
 * }
 * return (
 *   <FiltersPanelTop {...props}/>
 * )
 */
const FiltersPanelTop = (props) => {
    const {
        filters,
        resQty,
        onCheckboxClick,
        onFilterClick,
        onClearAllFilters,
        onClearFilterItems,
        showLimitedFiltersQty,
        onShowAllClick,
        windowWidth,
        searchComponent,
        sortComponent,
        filterPanelEnabled,
    } = props;

    const getConfig = useConfig();

    /**
     **** Authored Configs ****
     */
    const searchEnabled = getConfig('search', 'enabled');
    const searchTitle = getConfig('search', 'i18n.leftFilterPanel.searchTitle');
    const clearFilterText = getConfig('filterPanel', 'i18n.topPanel.mobile.group.clearFilterText');
    const clearAllFiltersText = getConfig('filterPanel', 'i18n.topPanel.clearAllFiltersText');
    const blurMobileFilters = getConfig('filterPanel', 'topPanel.mobile.blurFilters');
    const showTotalResults = getConfig('collection', 'showTotalResults');
    const showTotalResultsText = getConfig('collection', 'i18n.totalResultsText');
    const sortEnabled = getConfig('sort', 'enabled');
    const sortOptions = getConfig('sort', 'options');
    const filterGroupLabel = getConfig('filterPanel', 'i18n.topPanel.groupLabel');
    const moreFiltersBtnText = getConfig('filterPanel', 'i18n.topPanel.moreFiltersBtnText');
    const HeadingLevel = getConfig('collection', 'i18n.titleHeadingLevel');
    const title = getConfig('collection', 'i18n.title');
    const useLightText = getConfig('collection', 'useLightText');
    const layoutContainer = getConfig('collection', 'layout.container');
    const isCategoryPage = layoutContainer === 'categories';

    /**
     * Top search bar identifier
     * @type {String}
     */
    const searchId = 'top-search';

    /**
     **** Hooks ****
     */

    /**
     * @typedef {String} openExpandableState - Id of the <Search /> component
     * @description — defined in the searchId constant
     *
     * @typedef {Function} ExpandableToggleSetter - Handles toggling opened/closed state of
     * the <Search /> component
     * @description
     *
     * @type {[String, Function]} openExpandable
     */
    const [openExpandable, handleExpandableToggle] = useExpandable(searchId);

    /**
     **** Constants ****
     */

    /**
     * Total results HTML
     * @type {Array}
     */
    const totalResultsHtml = RenderTotalResults(showTotalResultsText, resQty);

    /**
     * Whether at least one filter is selected
     * @type {Boolean}
     */
    const atleastOneFilterSelected = isAtleastOneFilterSelected(filters);

    /**
     * Whether the current viewport width fits mobile devices or tablets
     * @type {Boolean}
     */
    const TABLET_OR_MOBILE_SCREEN_SIZE = windowWidth < TABLET_MIN_WIDTH;

    /**
     * Whether the current viewport width fits tablets or desktops/laptops
     * @type {Boolean}
     */
    const TABLET_OR_DESKTOP_SCREEN_SIZE = windowWidth >= TABLET_MIN_WIDTH;

    /**
     * Whether we should hide all filters after quantity defined in MAX_TRUNCATED_FILTERS constant
     * @type {Boolean}
     */
    const shouldHideSomeFilters = layoutContainer !== 'categories'
        && filters.length > MAX_TRUNCATED_FILTERS;

    /**
     * Whether the sort dropdown should be displayed
     * @type {Boolean}
     */
    const shouldDisplaySortComponent = sortEnabled && sortOptions.length > 0;

    /**
     * Whether the filters should be displayed
     * @type {Boolean}
     */
    const shouldDisplayFilters = filters.length > 0 && filterPanelEnabled;

    /**
     * Whether the "Show all filters" button should be displayed
     * @type {Boolean}
     */
    const shouldDisplayMoreFiltersBtn =
        shouldHideSomeFilters && TABLET_OR_DESKTOP_SCREEN_SIZE && showLimitedFiltersQty;

    /**
     * Whether the title of the collection and the quantity of the filtered cards
     * should be displayed
     * @type {Boolean}
     */
    const shouldDisplayCollectionInfo = (title || showTotalResults) && !isCategoryPage;

    /**
     * Whether the search bar should be displayed
     * @type {Boolean}
     */
    const shouldDisplaySearchBar = searchComponent && TABLET_OR_MOBILE_SCREEN_SIZE;

    /**
     * Whether the "Clear all filters" button should be displayed
     * @type {Boolean}
     */
    const shouldShowClearButtonWrapper = atleastOneFilterSelected
        || filters.length >= MIN_FILTERS_SHOW_BG;

    /**
     * Class name for the top filters:
     * whether we should apply dark or light theme
     * @type {String}
     */
    const topFiltersClass = classNames({
        'consonant-TopFilters': true,
        'consonant-TopFilters--withLightText': useLightText,
    });

    /**
     * Class name for the top filters:
     * whether we should hide all filters after quantity defined in MAX_TRUNCATED_FILTERS constant
     * @type {String}
     */
    const showLimitedFiltersQtyClass = classNames({
        'consonant-TopFilters-filters': true,
        'consonant-TopFilters-filters--truncated': showLimitedFiltersQty,
    });

    /**
     * Class name for the "Clear filters" button:
     * whether the blur effect should be applied to the container
     * @type {String}
     */
    const clearBtnWrapperClass = classNames({
        'consonant-TopFilters-clearBtnWrapper': true,
        'consonant-TopFilters-clearBtnWrapper--withBlur': blurMobileFilters && filters.length > 1,
    });

    /**
     * Whether the search bar should be visible
     * @type {Boolean}
     */
    const shouldShowSearchBar = openExpandable === searchId;

    const shouldRenderInnerWrapper = shouldDisplayFilters
        || searchEnabled || shouldDisplaySortComponent || shouldDisplayCollectionInfo;

    return (
        <div
            data-testid="consonant-TopFilters"
            daa-lh="Filters"
            className={topFiltersClass}>
            {shouldDisplaySearchBar &&
            <div
                data-testid="consonant-TopFilters-searchWrapper"
                className="consonant-TopFilters-searchWrapper">
                {searchComponent}
            </div>
            }
            { shouldRenderInnerWrapper &&
            <div
                className="consonant-TopFilters-inner">
                {shouldDisplayFilters &&
                <div
                    className="consonant-TopFilters-filtersWrapper">
                    {TABLET_OR_DESKTOP_SCREEN_SIZE &&
                    <strong
                        className="consonant-TopFilters-title">
                        {filterGroupLabel}
                    </strong>
                    }
                    <div
                        data-testid="consonant-TopFilters-filters"
                        className={showLimitedFiltersQtyClass}>
                        {filters.map(filter =>
                            (<TopFilterItem
                                key={filter.id}
                                name={filter.group}
                                items={filter.items}
                                numItemsSelected={getSelectedItemsCount(filter.items)}
                                results={resQty}
                                id={filter.id}
                                isOpened={filter.opened}
                                onCheck={onCheckboxClick}
                                onClick={onFilterClick}
                                onClearAll={onClearFilterItems}
                                clearFilterText={clearFilterText}
                                isTopFilter />))
                        }
                        {shouldDisplayMoreFiltersBtn &&
                        <button
                            type="button"
                            data-testid="consonant-TopFilters-moreBtn"
                            className="consonant-TopFilters-moreBtn"
                            onClick={onShowAllClick}>
                            {moreFiltersBtnText}
                        </button>
                        }
                    </div>
                    {shouldShowClearButtonWrapper &&
                    <div
                        data-testid="consonant-TopFilters-clearBtnWrapper"
                        className={clearBtnWrapperClass}>
                        {atleastOneFilterSelected &&
                        <button
                            type="button"
                            data-testid="consonant-TopFilters-clearBtn"
                            className="consonant-TopFilters-clearBtn"
                            onClick={onClearAllFilters}
                            tabIndex="0">
                            {clearAllFiltersText}
                        </button>
                        }
                    </div>
                    }
                </div>
                }
                {searchEnabled && TABLET_OR_DESKTOP_SCREEN_SIZE &&
                <div
                    data-testid="consonant-TopFilters-searchIcoWrapper"
                    className="consonant-TopFilters-searchIcoWrapper">
                    {shouldShowSearchBar && searchComponent}
                    {TABLET_OR_DESKTOP_SCREEN_SIZE &&
                    <SearchIcon
                        searchTitle={searchTitle}
                        onClick={handleExpandableToggle} />
                    }
                </div>
                }
                {shouldDisplaySortComponent &&
                <div
                    data-testid="consonant-TopFilters-selectWrapper"
                    className="consonant-TopFilters-selectWrapper">
                    {sortComponent}
                </div>
                }
                {shouldDisplayCollectionInfo &&
                <div className="consonant-TopFilters-infoWrapper">
                    {title &&
                    <HeadingLevel
                        data-testid="consonant-TopFilters-collectionTitle"
                        className="consonant-TopFilters-collectionTitle">
                        {title}
                    </HeadingLevel>
                    }
                    {showTotalResults &&
                    <div
                        data-testid="consonant-TopFilters-results"
                        className="consonant-TopFilters-results">
                        {totalResultsHtml}
                    </div>
                    }
                </div>
                }
            </div>
            }
        </div>
    );
};

FiltersPanelTop.propTypes = filtersPanelTopType;
FiltersPanelTop.defaultProps = defaultProps;

export default FiltersPanelTop;
