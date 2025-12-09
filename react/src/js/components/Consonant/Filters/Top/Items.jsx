import React, { Fragment } from 'react';
import classNames from 'classnames';
import {
    arrayOf,
    shape,
    func,
    number,
} from 'prop-types';

import { filterItemType } from '../../types/config';

const itemsType = {
    handleCheck: func.isRequired,
    stopPropagation: func.isRequired,
    clipWrapperItemsCount: number.isRequired,
    items: arrayOf(shape(filterItemType)).isRequired,
    // eslint-disable-next-line react/require-default-props
    onCategoryToggle: func,
};

/**
 * Options of the top filter
 *
 * @component
 * @example
 * const props= {
    items: Array,
    handleCheck: Function,
    stopPropagation: Function,
    clipWrapperItemsCount: Number,
 * }
 * return (
 *   <Items {...props}/>
 * )
 */
const Items = (props) => {
    const {
        items,
        handleCheck,
        stopPropagation,
        clipWrapperItemsCount,
        onCategoryToggle,
    } = props;

    /**
     **** Constants ****
     */

    /**
     * Whether the top filter options should be blurred at the bottom of the parent container
     * @type {Boolean}
     */
    const shouldClipItems = items.length >= clipWrapperItemsCount;

    /**
     * Class name for the top filter options wrapper:
     * whether the top filter options should be blurred at the bottom of the parent container
     * @type {String}
     */
    const clipFilterItemsClass = classNames({
        'consonant-TopFilter-items': true,
        'consonant-TopFilter-items--clipped': shouldClipItems,
    });

    const set = new Set();
    return (
        <ul
            data-testid="consonant-TopFilter-items"
            className={clipFilterItemsClass}>
            {items.map((item) => {
                // Check if this is a category
                if (item.isCategory) {
                    return (
                        <Fragment key={item.id}>
                            <li
                                data-testid="consonant-TopFilter-item"
                                className={`consonant-TopFilter-item consonant-TopFilter-item--category ${item.opened ? 'is-opened' : ''}`}>
                                <label
                                    htmlFor={item.id}
                                    className="consonant-TopFilter-itemLabel consonant-TopFilter-itemLabel--category"
                                    onClick={stopPropagation}
                                    onKeyDown={stopPropagation}
                                    role="presentation">
                                    <input
                                        data-testid="consonant-TopFilter-categoryCheckbox"
                                        id={item.id}
                                        value={item.id}
                                        type="checkbox"
                                        onChange={(e) => {
                                            handleCheck(e);
                                            // Top filter: Only expand when selecting (not context-aware)
                                            if (onCategoryToggle) {
                                                if (e.target.checked && !item.opened) {
                                                    onCategoryToggle(item.id);
                                                } else if (!e.target.checked && item.opened) {
                                                    onCategoryToggle(item.id);
                                                }
                                            }
                                        }}
                                        checked={item.selected}
                                        tabIndex="0" />
                                    <span className="consonant-TopFilter-itemCheckmark" />
                                    <span className="consonant-TopFilter-itemName">
                                        {item.label}
                                    </span>
                                </label>
                            </li>
                            {item.opened && item.items && (
                                item.items.map(nestedItem => (
                                    <li
                                        key={nestedItem.id}
                                        data-testid="consonant-TopFilter-item"
                                        daa-ll={nestedItem.label}
                                        className="consonant-TopFilter-item consonant-TopFilter-item--nested">
                                        <label
                                            htmlFor={nestedItem.id}
                                            className="consonant-TopFilter-itemLabel"
                                            onClick={stopPropagation}
                                            onKeyDown={stopPropagation}
                                            role="presentation">
                                            <input
                                                data-testid="consonant-TopFilter-itemCheckbox"
                                                id={nestedItem.id}
                                                value={nestedItem.id}
                                                type="checkbox"
                                                onChange={handleCheck}
                                                checked={nestedItem.selected}
                                                tabIndex="0" />
                                            <span className="consonant-TopFilter-itemCheckmark" />
                                            <span className="consonant-TopFilter-itemName">
                                                {nestedItem.label}
                                            </span>
                                        </label>
                                    </li>
                                ))
                            )}
                        </Fragment>
                    );
                }

                // Regular flat item
                const category = item.id.split('/')[0];
                let title;
                if (!set.has(category)) {
                    title = category.replaceAll('-', ' ');
                    set.add(category);
                }
                return (
                    <Fragment key={item.id}>
                        {item.fromCategory && title && <span className="filter-group-title" data-testid={`filter-group-title-${category}`}>{title}</span>}
                        <li
                            key={item.id}
                            data-testid="consonant-TopFilter-item"
                            daa-ll={item.label}
                            className="consonant-TopFilter-item">
                            {/* eslint-disable-next-line max-len */}
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                            <label
                                htmlFor={item.id}
                                className="consonant-TopFilter-itemLabel"
                                onClick={stopPropagation}>
                                <input
                                    data-testid="consonant-TopFilter-itemCheckbox"
                                    id={item.id}
                                    value={item.id}
                                    type="checkbox"
                                    onChange={handleCheck}
                                    checked={item.selected}
                                    tabIndex="0" />
                                <span className="consonant-TopFilter-itemCheckmark" />
                                <span className="consonant-TopFilter-itemName">
                                    {item.group || item.label}
                                </span>
                            </label>
                        </li>
                    </Fragment>
                );
            })}
        </ul>
    );
};

Items.propTypes = itemsType;

/* eslint-disable-next-line import/prefer-default-export */
export { Items };
