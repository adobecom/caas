import React, { Fragment } from 'react';
import classNames from 'classnames';
import {
    string,
    func,
    number,
    arrayOf,
    shape,
} from 'prop-types';

import { Items } from './Items';
import { Footer } from './Footer';
import { filterItemType } from '../../types/config';
import { stopPropagation } from '../../Helpers/general';
import {
    useConfig,
    useExpandable,
} from '../../Helpers/hooks';

const groupType = {
    id: string.isRequired,
    name: string.isRequired,
    clearFilterText: string,
    numItemsSelected: number,
    onCheck: func.isRequired,
    results: number.isRequired,
    onClearAll: func.isRequired,
    items: arrayOf(shape(filterItemType)).isRequired,
};

const defaultProps = {
    numItemsSelected: 0,
    clearFilterText: '',
};

/**
 * Minimum quantity of the top filter options to apply blur on options' wrapper
 * @type {Number}
 */
const clipWrapperItemsCount = 9;

/**
 * Top filter
 *
 * @component
 * @example
 * const props= {
    name: String,
    id: String,
    items: Array,
    numItemsSelected: Number,
    onCheck: Function,
    onClearAll: Function,
    results: Number,
    clearFilterText: String,
 * }
 * return (
 *   <Group {...props}/>
 * )
 */
const Group = (props) => {
    const {
        name,
        id,
        items,
        numItemsSelected,
        onCheck,
        onClearAll,
        results,
        clearFilterText,
    } = props;

    const getConfig = useConfig();
    // console.log('>>>> Group', name, id, items, results);

    /**
     **** Authored Configs ****
     */
    const mobileGroupTotalResultsText =
        getConfig('filterPanel', 'i18n.topPanel.mobile.group.totalResultsText').replace('{total}', results);
    const mobileGroupApplyBtnText = getConfig('filterPanel', 'i18n.topPanel.mobile.group.applyBtnText');
    const mobileGroupDoneBtnText = getConfig('filterPanel', 'i18n.topPanel.mobile.group.doneBtnText');

    const isCategoriesPage = getConfig('collection', 'layout.container') === 'categories';
    // const isProductsFilter = id === 'caas:zzz_events-tier-3-testing/product-family';
    // const isAllProductsFilter = id === 'caas:products';
    const isProductsFilter = id === 'caas:products';
    const showProductsFilter = !isCategoriesPage
        || (isCategoriesPage && isProductsFilter)
        || !id.startsWith('caas:product-categories')
        || id.includes(name);

    /**
     **** Hooks ****
     */

    /**
     * @typedef {String} openDropdownState -  Id of the top filter
     * @description — defined in the component props
     *
     * @typedef {Function} ToggleSetter - Handles toggling opened/closed state of
     * the top filter
     * @description
     *
     * @type {[String, Function]} openDropdown
     */
    const [openDropdown, handleToggle] = useExpandable(id);

    /**
     **** Constants ****
     */

    /**
     * Whether the top filter is opened
     * @type {Boolean}
     */
    const isOpened = openDropdown === id;

    /**
     * Whether at least one top filter option is selected
     * @type {Boolean}
     */
    const atleastOneItemSelected = numItemsSelected > 0;

    /**
     * Text of the top filter footer button:
     * whether the "Apply changes" text should be shown or "Done"
     * @type {String}
     */
    const mobileFooterBtnText =
        atleastOneItemSelected ? mobileGroupApplyBtnText : mobileGroupDoneBtnText;

    /**
     * Handles unselection of the top filter options
     * when the "Clear filter options" link is clicked
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleClear = (e) => {
        e.stopPropagation();
        onClearAll(id);
    };

    /**
     * Handles toggling the selected/unselected state of the top filter option
     * when the filter option is checked/unchecked
     * @param {ChangeEvent} e
     * @listens ChangeEvent
     */
    const handleCheck = (e) => {
        e.stopPropagation();
        onCheck(id, e.target.value, e.target.checked);
    };

    /**
     * Array of the top filter selected options
     * @type {Array}
     */
    const selectedFilters = items.filter(item => item.selected);

    /**
     * Whether at least one top filter option is selected
     * @type {Boolean}
     */
    const atleastOneFilterSelected = selectedFilters.length > 0;

    /**
     * Text indicating the quantity of the selected top filter options
     * @type {String}
     */
    const selectedItemQtyText = selectedFilters.length > 0 ? `${selectedFilters.length}` : '';

    /**
     * Whether the top filter is opened
     * @type {Boolean}
     */
    const filterGroupOpened = isOpened;

    /**
     * Whether the top filter is closed
     * @type {Boolean}
     */
    const filterGroupNotOpened = !isOpened;

    /**
     * Whether the top filter options should be blurred at the bottom of the parent container
     * @type {Boolean}
     */
    const shouldClipFilters = items.length >= clipWrapperItemsCount;

    /**
     * Class name for the top filter:
     * whether the top filter is opened
     * whether the top filter contains at least one selected option
     * @type {String}
     */
    const containerClassname = classNames({
        'consonant-TopFilter': true,
        'is-opened': filterGroupOpened,
        'is-selected': atleastOneFilterSelected && filterGroupNotOpened,
    });

    const filterLabel = (isCategoriesPage && id.includes(name))
        ? `All ${name}`
        : name;

    /**
     * Impression Tracking
     */
    const filterName = `${name} ${isOpened ? 'Close' : 'Open'}`;

    return (
        <Fragment>
            {
                showProductsFilter &&
                <div
                    data-testid="consonant-TopFilter"
                    daa-lh={name}
                    className={`${containerClassname} FILTER-ID-${id}`}>
                    <div
                        className="consonant-TopFilter-inner">
                        <h3
                            className="consonant-TopFilter-name"
                            daa-ll={filterName}>
                            <button
                                type="button"
                                className="consonant-TopFilter-link"
                                data-testid="consonant-TopFilter-link"
                                onClick={handleToggle}
                                tabIndex="0">
                                {filterLabel}
                                <span
                                    className="consonant-TopFilter-selectedItemsQty">
                                    {selectedItemQtyText}
                                </span>
                            </button>
                        </h3>
                        <div
                            className="consonant-TopFilter-selectedItems">
                            <div
                                className="consonant-TopFilter-absoluteWrapper">
                                <Items
                                    clipWrapperItemsCount={clipWrapperItemsCount}
                                    handleCheck={handleCheck}
                                    stopPropagation={stopPropagation}
                                    items={items} />
                                {shouldClipFilters &&
                                <aside
                                    className="consonant-TopFilter-bg" />
                                }
                                <Footer
                                    mobileFooterBtnText={mobileFooterBtnText}
                                    handleToggle={handleToggle}
                                    clearFilterText={clearFilterText}
                                    handleClear={handleClear}
                                    numItemsSelected={numItemsSelected}
                                    mobileGroupTotalResultsText={mobileGroupTotalResultsText} />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </Fragment>
    );
};

Group.propTypes = groupType;
Group.defaultProps = defaultProps;

/* eslint-disable-next-line import/prefer-default-export */
export { Group };
