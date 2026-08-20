import React from 'react';
import {
    string,
    number,
    func,
} from 'prop-types';

const footerType = {
    clearFilterText: string,
    numItemsSelected: number,
    mobileFooterBtnText: string,
    handleClear: func.isRequired,
    handleToggle: func.isRequired,
    mobileGroupTotalResultsText: string,
};

const defaultProps = {
    numItemsSelected: 0,
    clearFilterText: '',
    mobileFooterBtnText: '',
    mobileGroupTotalResultsText: '',
};

/**
 * Top filter footer
 *
 * @component
 * @example
 * const props= {
    mobileGroupTotalResultsText: String,
    numItemsSelected: Number,
    handleClear: Function,
    clearFilterText: String,
    handleToggle: Function,
    mobileFooterBtnText: String,
 * }
 * return (
 *   <Footer {...props}/>
 * )
 */
const Footer = (props) => {
    const {
        mobileGroupTotalResultsText,
        numItemsSelected,
        handleClear,
        clearFilterText,
        handleToggle,
        mobileFooterBtnText,
    } = props;

    /**
     **** Constants ****
     */

    /**
     * Whether the "Clear options" button should be displayed
     * @type {Boolean}
     */
    const shouldShowClearButton = numItemsSelected > 0;

    return (
        <div
            className="consonant-TopFilter-footer">
            <span
                className="consonant-TopFilter-footerResQty"
                role="status"
                aria-live="polite">
                {mobileGroupTotalResultsText}
            </span>
            {shouldShowClearButton &&
            <button
                data-testid="consonant-TopFilter-footerClearBtn"
                type="button"
                onClick={handleClear}
                className="consonant-TopFilter-footerClearBtn"
                tabIndex="0">
                {clearFilterText}
            </button>}
            <button
                type="button"
                onClick={handleToggle}
                className="consonant-TopFilter-footerBtn"
                tabIndex="0">
                {mobileFooterBtnText}
            </button>
        </div>
    );
};

Footer.propTypes = footerType;
Footer.defaultProps = defaultProps;

/* eslint-disable-next-line import/prefer-default-export */
export { Footer };
