import React from 'react';
import {
    string,
    number,
    func,
} from 'prop-types';

const groupFooterType = {
    ctaText: string,
    clearFilterText: string,
    numItemsSelected: number,
    handleClear: func.isRequired,
    handleClick: func.isRequired,
    mobileGroupTotalResultsText: string,
};

const defaultProps = {
    ctaText: '',
    numItemsSelected: 0,
    clearFilterText: '',
    mobileGroupTotalResultsText: '',
};

/**
 * Footer for the left filter for mobile and tablet breakpoints
 *
 * @component
 * @example
 * const props= {
    mobileGroupTotalResultsText: String,
    numItemsSelected: Number,
    handleClear: Function,
    clearFilterText: String,
    handleClick: Function,
    ctaText: String,
 * }
 * return (
 *   <GroupFooter {...props}/>
 * )
 */
const GroupFooter = (props) => {
    const {
        mobileGroupTotalResultsText,
        numItemsSelected,
        handleClear,
        clearFilterText,
        handleClick,
        ctaText,
    } = props;

    return (
        <div
            className="consonant-LeftFilter-footer">
            <span
                className="consonant-LeftFilter-footerResQty">
                {mobileGroupTotalResultsText}
            </span>
            {numItemsSelected > 0 &&
            <button
                type="button"
                onClick={handleClear}
                className="consonant-LeftFilter-footerClearBtn">
                {clearFilterText}
            </button>
            }
            <button
                type="button"
                onClick={handleClick}
                className="consonant-LeftFilter-footerBtn">
                {ctaText}
            </button>
        </div>
    );
};

GroupFooter.propTypes = groupFooterType;
GroupFooter.defaultProps = defaultProps;

/* eslint-disable-next-line import/prefer-default-export */
export { GroupFooter };
