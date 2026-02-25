import React, { forwardRef } from 'react';
import classNames from 'classnames';
import {
    shape,
    arrayOf,
    bool,
    node,
    number,
    func,
} from 'prop-types';

import { useConfig } from '../../Helpers/hooks';
import { sortOptionType } from '../../types/config';
import { Info as MobileInfo } from './Mobile-Only/Info';
import { RenderTotalResults } from '../../Helpers/rendering';

const InfoType = {
    cardsQty: number,
    filtersQty: number,
    windowWidth: number,
    enabled: bool.isRequired,
    selectedFiltersQty: number,
    sortComponent: node.isRequired,
    searchComponent: node.isRequired,
    onMobileFiltersToggleClick: func.isRequired,
    sortOptions: arrayOf(shape(sortOptionType)).isRequired,
};

const defaultProps = {
    cardsQty: 0,
    filtersQty: 0,
    selectedFiltersQty: 0,
    windowWidth: window.innerWidth,
};

/**
 * Left filter info panel
 *
 * @component
 * @example
 * const props= {
    enabled: Boolean,
    filtersQty: Number,
    cardsQty: Number,
    selectedFiltersQty: Number,
    onMobileFiltersToggleClick: Function,
    searchComponent: Node,
    sortComponent: Node,
    sortOptions: Array,
    windowWidth: Number,
 * }
 * return (
 *   <Info {...props}/>
 * )
 */
const Info = forwardRef((props, ref) => {
    const {
        enabled,
        filtersQty,
        cardsQty,
        selectedFiltersQty,
        onMobileFiltersToggleClick,
        searchComponent,
        sortComponent,
        sortOptions,
        windowWidth,
    } = props;

    const getConfig = useConfig();

    /**
     **** Authored Configs ****
     */
    const title = getConfig('collection', 'i18n.title');
    const HeadingLevel = getConfig('collection', 'i18n.titleHeadingLevel');
    const showTotalResults = getConfig('collection', 'showTotalResults');
    const showTotalResultsText = getConfig('collection', 'i18n.totalResultsText');
    const searchEnabled = getConfig('search', 'enabled');
    const sortEnabled = getConfig('sort', 'enabled');
    const mobileFilterBtnLabel = getConfig('filterPanel', 'i18n.leftPanel.mobile.filtersBtnLabel');
    const useLightText = getConfig('collection', 'useLightText');

    /**
     **** Constants ****
     */

    /**
     * Total results HTML
     * @type {Array}
     */
    const totalResultsHtml = RenderTotalResults(showTotalResultsText, cardsQty);

    /**
     * Minimal viewport width to fit desktops/laptops
     * @type {Number}
     */
    const DESKTOP_MIN_WIDTH = 1200;

    /**
     * Whether the current viewport width fits tablets or mobile devices
     * @type {Boolean}
     */
    const NOT_DESKTOP_SCREEN_SIZE = windowWidth < DESKTOP_MIN_WIDTH;

    /**
     * Whether the sort dropdown should be displayed
     * @type {Boolean}
     */
    const shouldRenderSortPopup = sortEnabled && sortOptions.length > 0;

    /**
     * Whether the search bar should be displayed
     * @type {Boolean}
     */
    const shouldRenderSearch = searchEnabled && NOT_DESKTOP_SCREEN_SIZE;

    /**
     * Whether the left filters info block should be displayed
     * on mobile and tablet breakpoints
     * @type {Boolean}
     */
    const shouldRenderMobileInfo = NOT_DESKTOP_SCREEN_SIZE && filtersQty > 0 && enabled;

    const shouldRenderInnerWrapper = title || showTotalResults;

    /**
     * Class name for the left filters info:
     * whether the left filters info should be light or dark
     * @type {String}
     */
    const filtersInfoClassName = classNames({
        'consonant-FiltersInfo': true,
        'consonant-FiltersInfo--withLightText': useLightText,
    });

    /**
     * Class name for the left filters info inner wrapper:
     * whether the left filters info inner wrapper should display a vertical separator
     * after the block with the quantity of the filtered cards
     * @type {String}
     */
    const wrapperClassName = classNames({
        'consonant-FiltersInfo-wrapper': true,
        'consonant-FiltersInfo-wrapper--noLine': !sortEnabled || !sortOptions.length,
    });

    return (
        <aside
            data-testid="consonant-FiltersInfo"
            className={filtersInfoClassName}>
            { shouldRenderSearch &&
            <div
                className="consonant-FiltersInfo-search">
                {searchComponent}
            </div>
            }
            {shouldRenderMobileInfo &&
            <MobileInfo
                selectedFiltersQty={selectedFiltersQty}
                mobileFilterBtnLabel={mobileFilterBtnLabel}
                onMobileFiltersToggleClick={onMobileFiltersToggleClick}
                ref={ref} />
            }
            {shouldRenderSortPopup && sortComponent}
            {shouldRenderInnerWrapper &&
            <div
                className={wrapperClassName}>
                {title &&
                <HeadingLevel
                    data-testid="consonant-FiltersInfo-title"
                    className="consonant-FiltersInfo-title">
                    {title}
                </HeadingLevel>
                }
                {showTotalResults &&
                <div
                    data-testid="consonant-FiltersInfo-results"
                    className="consonant-FiltersInfo-results"
                    role="status"
                    aria-live="polite">
                    {totalResultsHtml}
                </div>
                }
            </div>
            }
        </aside>
    );
});

Info.propTypes = InfoType;
Info.defaultProps = defaultProps;

/* eslint-disable-next-line import/prefer-default-export */
export { Info };
