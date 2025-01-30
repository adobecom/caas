import React from 'react';
import classNames from 'classnames';
import {
    shape,
    func,
    arrayOf,
    bool,
    string,
} from 'prop-types';

import { useExpandable } from '../Helpers/hooks';
import { sortOptionType } from '../types/config';

const popupType = {
    autoWidth: bool,
    id: string.isRequired,
    optionsAlignment: string,
    onSelect: func.isRequired,
    val: shape({
        label: string,
        sort: string,
    }).isRequired,
    values: arrayOf(shape(sortOptionType)).isRequired,
};

const defaultProps = {
    autoWidth: false,
    optionsAlignment: 'right',
};

/**
 * Sort popup
 *
 * @component
 * @example
 * const props= {
    val: Object,
    values: Array,
    onSelect: Function,
    autoWidth: Boolean,
    optionsAlignment: String,
    id: String,
 * }
 * return (
 *   <Select {...props}/>
 * )
 */
const Popup = ({
    val,
    values,
    onSelect,
    autoWidth,
    optionsAlignment,
    id,
}) => {
    /**
     * @typedef {String} OpenDropdownState - Id of a selected dropdown
     * @description — Passed in Context Provider So All Nested Components can be in sync
     *
     * @typedef {Function} Handles toggling popup
     * @description
     *
     * @type {[String, Function]} OpenDropdown
     */
    const [openDropdown, handleToggle] = useExpandable(id);

    /**
     * Handles whether the sort dropdown is visible or not
     * @type {Boolean}
     */
    const opened = openDropdown === id;

    /**
     * Handles choosing of a sort option
     *
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleOptionClick = (e, item) => {
        onSelect(item);
        handleToggle(e);
    };

    const shouldAutoWidthSortClass = classNames({
        'consonant-Select': true,
        'consonant-Select--autoWidth': autoWidth,
    });

    const openButtonClass = classNames({
        'consonant-Select-btn': true,
        'is-active': opened,
    });

    return (
        <div
            className={shouldAutoWidthSortClass}>
            <button
                data-testid="consonant-Select-btn"
                type="button"
                onClick={handleToggle}
                className={openButtonClass}
                tabIndex="0"
                aria-haspopup="menu"
                aria-expanded={opened}>
                {val.label}
            </button>
            { opened &&
                <div
                    data-testid="consonant-Select-options"
                    className={`consonant-Select-options consonant-Select-options--${optionsAlignment}`}
                    role="menu">
                    {values.map(item => (
                        <button
                            data-testid="consonant-Select-option"
                            key={item.label}
                            type="button"
                            role="menuitem"
                            className={item.label === val.label ?
                                'consonant-Select-option is-selected' :
                                'consonant-Select-option'
                            }
                            onClick={e => handleOptionClick(e, item)}
                            tabIndex={0}>
                            {item.label}
                        </button>
                    ))}
                </div>
            }
        </div>
    );
};

Popup.propTypes = popupType;
Popup.defaultProps = defaultProps;

export default Popup;
