import React, { forwardRef, createRef } from 'react';
import classNames from 'classnames';
import {
    arrayOf,
    shape,
    number,
    bool,
    func,
    node,
} from 'prop-types';


import Item from './Item';
import { useConfig } from '../../Helpers/hooks';
import { filterType } from '../../types/config';
import ChosenFilter from './Desktop-Only/ChosenItem';
import { Title as MobileTitle } from './Mobile-Only/Title';
import { Title as DesktopTitle } from './Desktop-Only/Title';
import { PanelFooter as MobileFooter } from './Mobile-Only/PanelFooter';
import { ClearBtn as DesktopClearBtn } from './Desktop-Only/ClearButton';
import {
    getSelectedItemsCount,
    isAtleastOneFilterSelected,
} from '../../Helpers/general';


const leftFilterPanelType = {
    resQty: number,
    windowWidth: number,
    showMobileFilters: bool,
    selectedFiltersQty: number,
    onFilterClick: func.isRequired,
    onCheckboxClick: func.isRequired,
    // eslint-disable-next-line react/require-default-props
    onCategoryToggle: func,
    searchComponent: node.isRequired,
    bookmarkComponent: node.isRequired,
    onClearAllFilters: func.isRequired,
    filters: arrayOf(shape(filterType)),
    onClearFilterItems: func.isRequired,
    onSelectedFilterClick: func.isRequired,
    onMobileFiltersToggleClick: func.isRequired,
    useCategoryMappings: bool,
};

const defaultProps = {
    resQty: 0,
    filters: [],
    selectedFiltersQty: 0,
    showMobileFilters: false,
    windowWidth: window.innerWidth,
    useCategoryMappings: false,
};

/**
 * Left filters panel
 *
 * @component
 * @example
 * const props= {
    filters: Array,
    selectedFiltersQty: Number,
    showMobileFilters: Boolean,
    onFilterClick: Function,
    onClearAllFilters: Function,
    onClearFilterItems: Function,
    onCheckboxClick: Function,
    onMobileFiltersToggleClick: Function,
    onSelectedFilterClick: Function,
    resQty: Number,
    searchComponent: Node,
    bookmarkComponent: Node,
    windowWidth: Number,
 * }
 * return (
 *   <LeftFilterPanel {...props}/>
 * )
 */
const LeftFilterPanel = forwardRef(({
    filters,
    selectedFiltersQty,
    showMobileFilters,
    onFilterClick,
    onClearAllFilters,
    onClearFilterItems,
    onCheckboxClick,
    onCategoryToggle,
    onMobileFiltersToggleClick,
    onSelectedFilterClick,
    resQty,
    searchComponent,
    bookmarkComponent,
    windowWidth,
    useCategoryMappings,
}, ref) => {
    const getConfig = useConfig();

    /**
     **** Authored Configs ****
     */
    const showTotalResults = getConfig('collection', 'showTotalResults');
    const clearAllFiltersText = getConfig('filterPanel', 'i18n.leftPanel.clearAllFiltersText');
    const bookmarksEnabled = getConfig('bookmarks', 'leftFilterPanel.showBookmarksFilter');
    const searchEnabled = getConfig('search', 'enabled');
    const panelHeader = getConfig('filterPanel', 'i18n.leftPanel.header');
    const showTotalResultsText = getConfig('filterPanel', 'i18n.leftPanel.mobile.panel.totalResultsText');
    const clearFilterText = getConfig('filterPanel', 'i18n.leftPanel.mobile.panel.clearFilterText');
    const leftPanelMobileHeader = getConfig('filterPanel', 'i18n.leftPanel.mobile.panel.header');
    const applyText = getConfig('filterPanel', 'i18n.leftPanel.mobile.panel.applyBtnText');
    const doneText = getConfig('filterPanel', 'i18n.leftPanel.mobile.panel.doneBtnText');
    const HeadingLevel = getConfig('collection', 'i18n.titleHeadingLevel') || 'h3';

    /**
     **** Constants ****
     */

    /**
     * Whether at least one filter is selected
     * @type {Boolean}
     */
    const atleastOneFilterSelected = isAtleastOneFilterSelected(filters);

    /**
     * Minimal viewport width to fit desktops/laptops
     * @type {Number}
     */
    const DESKTOP_MIN_WIDTH = 1200;

    /**
     * Whether the current viewport width fits desktops/laptops
     * @type {Boolean}
     */
    const DESKTOP_SCREEN_SIZE = windowWidth >= DESKTOP_MIN_WIDTH;

    /**
     * Whether the current viewport width fits tablets or mobile devices
     * @type {Boolean}
     */
    const NOT_DESKTOP_SCREEN_SIZE = windowWidth < DESKTOP_MIN_WIDTH;

    /**
     * Whether the search bar should be displayed
     * @type {Boolean}
     */
    const shouldRenderSearchComponent = windowWidth >= DESKTOP_MIN_WIDTH && searchEnabled;

    /**
     * Whether the chosen filters should be displayed
     * @type {Boolean}
     */
    const shouldRenderChosenFilters = windowWidth >= DESKTOP_MIN_WIDTH && selectedFiltersQty > 0;

    /**
     * Whether at least one filter exist
     * @type {Boolean}
     */
    const atleastOneFilter = filters.length > 0;

    /**
     * Class name for the left filters:
     * whether the left filters panel is opened or closed
     * @type {String}
     */
    const filtersClass = classNames({
        'consonant-LeftFilters': true,
        'consonant-LeftFilters is-opened': showMobileFilters,
    });

    /**
     * Creates a DOM reference to mobile footer button
     * @returns {Object} - footer button DOM reference
     */
    const mobileFooterRef = createRef();

    /**
     * Handles Tab on mobile footer button to trap focus in dialog
     *
     * @param event
     */
    const handleMobileFooterButtonTab = (event) => {
        if (event.key !== 'Tab' || event.shiftKey) return;
        ref.current.focusMobBack();
        event.preventDefault();
    };

    /**
     * Handles Shift + Tab on mob back button to trap focus in dialog
     *
     * @param event
     */
    const handleMobileBackButtonShiftTab = (event) => {
        if (event.key !== 'Tab' || !event.shiftKey) return;
        mobileFooterRef.current.focusFooterButton();
        event.preventDefault();
    };

    return (
        <div
            data-testid="consonant-LeftFilters"
            daa-lh="Filters"
            className={filtersClass}>
            <div
                className="consonant-LeftFilters-header">
                {NOT_DESKTOP_SCREEN_SIZE &&
                <MobileTitle
                    onClick={onMobileFiltersToggleClick}
                    leftPanelMobileHeader={leftPanelMobileHeader}
                    ref={ref}
                    onKeyDown={handleMobileBackButtonShiftTab} />
                }
                {DESKTOP_SCREEN_SIZE &&
                <DesktopTitle
                    panelHeader={panelHeader}
                    HeadingLevel={HeadingLevel} />
                }
                {DESKTOP_SCREEN_SIZE &&
                <DesktopClearBtn
                    clearAllFiltersText={clearAllFiltersText}
                    onClearAllFilters={onClearAllFilters}
                    panelHeader={panelHeader} />
                }
            </div>
            {shouldRenderSearchComponent && searchComponent}
            {shouldRenderChosenFilters &&
            <div
                className="consonant-LeftFilters-chosenFilters">
                {filters.map(el => (
                    el.items.map(filter => (
                        filter.selected &&
                        <ChosenFilter
                            key={filter.id}
                            name={filter.label}
                            id={filter.id}
                            parentId={el.id}
                            onClick={onSelectedFilterClick} />
                    ))
                ))}
            </div>
            }
            {bookmarksEnabled && bookmarkComponent}
            {atleastOneFilter &&
            <div className="consonant-LeftFilters-list">
                {filters.map(filter => (
                    <Item
                        key={filter.id}
                        name={filter.group}
                        icon={filter.icon}
                        items={filter.items}
                        numItemsSelected={getSelectedItemsCount(filter.items)}
                        results={resQty}
                        id={filter.id}
                        isOpened={filter.opened}
                        useCategoryMappings={useCategoryMappings}
                        onCheck={onCheckboxClick}
                        onClick={onFilterClick}
                        onClearAll={onClearFilterItems}
                        onCategoryToggle={(categoryId) => onCategoryToggle && onCategoryToggle(filter.id, categoryId)}
                        clearFilterText={clearFilterText} />
                ))}
            </div>
            }
            {NOT_DESKTOP_SCREEN_SIZE &&
            <MobileFooter
                doneText={doneText}
                applyText={applyText}
                someFiltersAreSelected={atleastOneFilterSelected}
                showTotalResultsText={showTotalResultsText}
                onMobileFiltersToggleClick={onMobileFiltersToggleClick}
                clearAllFiltersText={clearAllFiltersText}
                onClearAllFilters={onClearAllFilters}
                resQty={resQty}
                showTotalResults={showTotalResults}
                ref={mobileFooterRef}
                handleMobileFooterButtonTab={handleMobileFooterButtonTab} />
            }
        </div>
    );
});

LeftFilterPanel.propTypes = leftFilterPanelType;
LeftFilterPanel.defaultProps = defaultProps;

export default LeftFilterPanel;
