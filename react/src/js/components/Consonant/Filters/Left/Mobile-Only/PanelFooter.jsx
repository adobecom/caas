import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
    string,
    number,
    func,
    bool,
} from 'prop-types';

const panelFooterType = {
    resQty: number,
    doneText: string,
    applyText: string,
    showTotalResults: bool,
    clearAllFiltersText: string,
    someFiltersAreSelected: bool,
    showTotalResultsText: string,
    onClearAllFilters: func.isRequired,
    onMobileFiltersToggleClick: func.isRequired,
    handleMobileFooterButtonTab: func.isRequired,
};

const defaultProps = {
    resQty: 0,
    doneText: '',
    applyText: '',
    showTotalResults: false,
    clearAllFiltersText: '',
    showTotalResultsText: '',
    someFiltersAreSelected: false,
};

/**
 * Footer of the left filter panel for mobile and tablet breakpoints
 *
 * @component
 * @example
 * const props= {
    showTotalResults: Boolean,
    resQty: Number,
    onClearAllFilters: Function,
    clearAllFiltersText: String,
    onMobileFiltersToggleClick: Function,
    someFiltersAreSelected: Boolean,
    applyText: String,
    doneText: String,
    showTotalResultsText: String,
 * }
 * return (
 *   <PanelFooter {...props}/>
 * )
 */
const PanelFooter = forwardRef((props, ref) => {
    const {
        showTotalResults,
        resQty,
        onClearAllFilters,
        clearAllFiltersText,
        onMobileFiltersToggleClick,
        someFiltersAreSelected,
        applyText,
        doneText,
        showTotalResultsText,
        handleMobileFooterButtonTab,
    } = props;

    /**
     * Text of the left filters footer button for mobile and tablet breakpoints:
     * whether the "Apply changes" text should be shown or "Done"
     * @type {String}
     */
    const buttonText = someFiltersAreSelected ? applyText : doneText;

    /**
     * Creates a DOM reference to footer button
     * @returns {Object} - footer button DOM reference
     */
    const footerBtnRef = useRef();

    /**
     * Allows multiple refs to be used in parent component
     */
    useImperativeHandle(ref, () => ({
        focusFooterButton: () => {
            footerBtnRef.current.focus();
        },
    }));

    return (
        <div
            className="consonant-LeftFilters-mobileFooter">
            {showTotalResults &&
            <span
                data-testid="consonant-LeftFilters-mobileFooterTotalResQty"
                className="consonant-LeftFilters-mobileFooterTotalResQty">
                {showTotalResultsText.replace('{total}', resQty)}
            </span>
            }
            {someFiltersAreSelected &&
            <button
                type="button"
                data-testid="consonant-LeftFilters-mobileFooterClearBtn"
                className="consonant-LeftFilters-mobileFooterClearBtn"
                onClick={onClearAllFilters}>
                {clearAllFiltersText}
            </button>
            }
            <button
                type="button"
                data-testid="consonant-LeftFilters-mobileFooterBtn"
                className="consonant-LeftFilters-mobileFooterBtn"
                onClick={onMobileFiltersToggleClick}
                ref={footerBtnRef}
                onKeyDown={handleMobileFooterButtonTab}>
                {buttonText}
            </button>
        </div>
    );
});

PanelFooter.propTypes = panelFooterType;
PanelFooter.defaultProps = defaultProps;

/* eslint-disable-next-line import/prefer-default-export */
export { PanelFooter };
