import React from 'react';
import {
    func,
    string,
} from 'prop-types';

const clearButtonType = {
    clearAllFiltersText: string,
    onClearAllFilters: func.isRequired,
};

const defaultProps = {
    clearAllFiltersText: '',
};

/**
 * This button
 * (1) clears all the chosen filters
 * (2) clears the search query
 * (3) and deselects "My bookmarks" feature if selected
 *
 * (This button only shows up for the Left Filter Panel - on desktop breakpoint)
 *
 * @component
 * @example
 * const props= {
    onClearAllFilters: Function,
    clearAllFiltersText: String,
 * }
 * return (
 *   <ClearBtn {...props}/>
 * )
 */
const ClearBtn = (props) => {
    const {
        onClearAllFilters,
        clearAllFiltersText,
    } = props;

    return (
        <button
            type="button"
            data-testid="consonant-LeftFilters-clearLink"
            className="consonant-LeftFilters-clearLink"
            onClick={onClearAllFilters}
            tabIndex="0">
            {clearAllFiltersText}
        </button>
    );
};

ClearBtn.propTypes = clearButtonType;
ClearBtn.defaultProps = defaultProps;

/* eslint-disable-next-line import/prefer-default-export */
export { ClearBtn };
