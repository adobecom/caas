import React from 'react';
import {
    arrayOf,
    shape,
    func,
} from 'prop-types';

import { filterItemType } from '../../types/config';
import { sanitizeStr } from '../../Helpers/Helpers';

const ItemsType = {
    handleCheck: func.isRequired,
    items: arrayOf(shape(filterItemType)).isRequired,
    onCategoryToggle: func,
};

/**
 * Options of the left filter item
 *
 * @component
 * @example
 * const props= {
    items: Array,
    handleCheck: Function,
    onCategoryToggle: Function,
 * }
 * return (
 *   <Items {...props}/>
 * )
 */
const Items = (props) => {
    const {
        items,
        handleCheck,
        onCategoryToggle,
    } = props;

    return (
        <ul
            data-testid="consonant-LeftFilter-items"
            className="consonant-LeftFilter-items">
            {items.map((item) => {
                // Check if this is a category
                if (item.isCategory) {
                    return (
                        <li
                            key={item.id}
                            data-testid="consonant-LeftFilter-category"
                            className="consonant-LeftFilter-category">
                            <button
                                type="button"
                                className="consonant-LeftFilter-categoryToggle"
                                onClick={() => onCategoryToggle && onCategoryToggle(item.id)}
                                aria-expanded={item.opened}>
                                <span className="consonant-LeftFilter-categoryIcon">
                                    {item.opened ? '−' : '+'}
                                </span>
                                <span className="consonant-LeftFilter-categoryLabel">
                                    {item.label && sanitizeStr(item.label.toString())}
                                </span>
                            </button>
                            {item.opened && item.items && (
                                <ul className="consonant-LeftFilter-categoryItems">
                                    {item.items.map(nestedItem => (
                                        <li
                                            key={nestedItem.id}
                                            data-testid="consonant-LeftFilter-itemsItem"
                                            daa-ll={nestedItem.label}
                                            className="consonant-LeftFilter-itemsItem consonant-LeftFilter-itemsItem--nested">
                                            <label
                                                htmlFor={nestedItem.id}
                                                className="consonant-LeftFilter-itemsItemLabel">
                                                <input
                                                    data-testid="consonant-LeftFilter-itemsItemCheckbox"
                                                    id={nestedItem.id}
                                                    value={nestedItem.id}
                                                    daa-im={nestedItem.label}
                                                    type="checkbox"
                                                    onChange={handleCheck}
                                                    checked={nestedItem.selected}
                                                    tabIndex="0" />
                                                <span
                                                    className="consonant-LeftFilter-itemsItemCheckmark" />
                                                <span
                                                    className="consonant-LeftFilter-itemsItemName">
                                                    {nestedItem.label && sanitizeStr(nestedItem.label.toString())}
                                                </span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                }

                // Regular flat item
                return (
                    <li
                        key={item.id}
                        data-testid="consonant-LeftFilter-itemsItem"
                        daa-ll={item.label}
                        className="consonant-LeftFilter-itemsItem">
                        <label
                            htmlFor={item.id}
                            className="consonant-LeftFilter-itemsItemLabel">
                            <input
                                data-testid="consonant-LeftFilter-itemsItemCheckbox"
                                id={item.id}
                                value={item.id}
                                daa-im={item.label}
                                type="checkbox"
                                onChange={handleCheck}
                                checked={item.selected}
                                tabIndex="0" />
                            <span
                                className="consonant-LeftFilter-itemsItemCheckmark" />
                            <span
                                className="consonant-LeftFilter-itemsItemName">
                                {item.label && sanitizeStr(item.label.toString())}
                            </span>
                        </label>
                    </li>
                );
            })}
        </ul>
    );
};

Items.propTypes = ItemsType;

/* eslint-disable-next-line import/prefer-default-export */
export { Items };
