import React from 'react';
import classNames from 'classnames';
import {
    number,
    bool,
    string,
    func,
    arrayOf,
    shape,
} from 'prop-types';

import { Items } from './Items';
import { useConfig } from '../../Helpers/hooks';
import { filterItemType } from '../../types/config';
import { GroupFooter } from './Mobile-Only/GroupFooter';
import { SelectedItem as DesktopSelectedItem } from './Desktop-Only/SelectedItem';

const itemType = {
    icon: string,
    isOpened: bool,
    id: string.isRequired,
    clearFilterText: string,
    name: string.isRequired,
    onCheck: func.isRequired,
    onClick: func.isRequired,
    numItemsSelected: number,
    results: number.isRequired,
    onClearAll: func.isRequired,
    items: arrayOf(shape(filterItemType)).isRequired,
};

const defaultProps = {
    icon: '',
    isOpened: false,
    numItemsSelected: 0,
    clearFilterText: '',
};

/**
 * Left filter
 *
 * @component
 * @example
 * const props= {
    name: String,
    icon: String,
    id: String,
    items: Array,
    numItemsSelected: Number,
    isOpened: Boolean,
    onCheck: Function,
    onClick: Function,
    onClearAll: Function,
    results: Number,
    clearFilterText: String,
 * }
 * return (
 *   <Item {...props}/>
 * )
 */
const Item = (props) => {
    const {
        name,
        icon,
        id,
        items,
        numItemsSelected,
        isOpened,
        onCheck,
        onClick,
        onClearAll,
        results,
        clearFilterText,
    } = props;

    const getConfig = useConfig();

    /**
     **** Authored Configs ****
     */
    const mobileGroupTotalResultsText =
        getConfig('filterPanel', 'i18n.leftPanel.mobile.group.totalResultsText').replace('{total}', results);
    const applyBtnText = getConfig('filterPanel', 'i18n.leftPanel.mobile.group.applyBtnText');
    const doneBtnText = getConfig('filterPanel', 'i18n.leftPanel.mobile.group.doneBtnText');

    /**
     **** Constants ****
     */

    /**
     * Text of the left filter footer button on the mobile and tablet breakpoints:
     * whether the "Apply changes" text should be shown or "Done"
     * @type {String}
     */
    const buttonText = numItemsSelected > 0 ? applyBtnText : doneBtnText;

    /**
     * Text indicating the quantity of the selected left filter options
     * @type {String}
     */
    const dataQtyTxt = numItemsSelected > 0 ? `+${numItemsSelected}` : '';

    /**
     * Whether the left filter selected options badge should be shown on desktop breakpoint
     * @type {Boolean}
     */
    const shouldRenderSelectedBadge = numItemsSelected > 0;

    /**
     * Array of the left filter selected options
     * @type {Array}
     */
    const selectedFilters = items.filter(item => item.selected);

    /**
     * Array of the selected filters labels shown on mobile and tablet breakpoints
     * @type {Array}
     */
    const mobileTagsSelectedText = selectedFilters.map((item, index) => {
        const lastItem = index === selectedFilters.length - 1;
        return (!lastItem ? `${item.label}, ` : item.label);
    });

    /**
     * Handles toggling the opened/closed state of the left filter
     * when the filter is clicked
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleClick = (e) => {
        e.preventDefault();
        onClick(id);
    };

    /**
     * Handles unselection of the left filter options
     * when the "Clear filter options" button is clicked
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleClear = () => {
        onClearAll(id, name);
    };

    /**
     * Handles toggling the selected/unselected state of the left filter option
     * when the filter option is checked/unchecked
     * @param {ChangeEvent} e
     * @listens ChangeEvent
     */
    const handleCheck = (evt) => {
        evt.stopPropagation();
        onCheck(id, evt.target.value, evt.target.checked);
    };

    /**
     * Class name for the left filter:
     * whether the left filter is opened
     * @type {String}
     */
    const leftFilterClassName = classNames({
        'consonant-LeftFilter': true,
        'consonant-LeftFilter is-opened': isOpened,
    });

    /**
     * Impression Tracking
     */
    const filterName = `${name} ${isOpened ? 'Close' : 'Open'}`;

    return (
        <div
            data-testid="consonant-LeftFilter"
            daa-lh={name}
            className={leftFilterClassName}>
            <div
                className="consonant-LeftFilter-inner">
                <p
                    data-testid="consonant-LeftFilter-name"
                    className="consonant-LeftFilter-name"
                    daa-ll={filterName}>
                    {icon &&
                    <img
                        src={icon}
                        width="16"
                        alt=""
                        loading="lazy" />
                    }
                    <button
                        type="button"
                        aria-expanded={isOpened}
                        data-testid="consonant-LeftFilter-link"
                        className="consonant-LeftFilter-link"
                        aria-controls={`${id}-panel`}
                        id={`${id}-link`}
                        onClick={handleClick}
                        tabIndex="0">
                        {name}
                        <div
                            className="consonant-LeftFilter-selectedItemsQty"
                            data-qty={dataQtyTxt}>
                            {mobileTagsSelectedText}
                        </div>
                    </button>
                </p>
                {
                    shouldRenderSelectedBadge &&
                    <DesktopSelectedItem
                        handleClear={handleClear}
                        numItemsSelected={numItemsSelected} />
                }
                <section
                    id={`${id}-panel`}
                    aria-labelledby={`${id}-link`}>
                    <Items
                        items={items}
                        handleCheck={handleCheck} />
                </section>
                <GroupFooter
                    ctaText={buttonText}
                    handleClick={handleClick}
                    clearFilterText={clearFilterText}
                    handleClear={handleClear}
                    numItemsSelected={numItemsSelected}
                    mobileGroupTotalResultsText={mobileGroupTotalResultsText} />
            </div>
        </div>
    );
};

Item.propTypes = itemType;
Item.defaultProps = defaultProps;

export default Item;
