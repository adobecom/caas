import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
    string,
    func,
} from 'prop-types';

const titleType = {
    onClick: func.isRequired,
    leftPanelMobileHeader: string,
    onKeyDown: func.isRequired,
};

const defaultProps = {
    leftPanelMobileHeader: '',
};

/**
 * Title of the left filters panel for mobile and tablet breakpoints
 *
 * @component
 * @example
 * const props= {
    onClick: Function,
    leftPanelMobileHeader: String,
 * }
 * return (
 *   <Title {...props}/>
 * )
 */
const Title = forwardRef((props, ref) => {
    const {
        onClick,
        leftPanelMobileHeader,
        onKeyDown,
    } = props;

    /**
     * Creates a DOM reference to mob title element
     * @returns {Object} - mob title DOM reference
     */
    const mobTitleRef = useRef();

    /**
     * Creates a DOM reference to mob back button
     * @returns {Object} - mob back button DOM reference
     */
    const mobBackRef = useRef();

    /**
     * Allows multiple refs to be used in parent component
     */
    useImperativeHandle(ref, () => ({
        focusMobTitle: () => {
            mobTitleRef.current.focus();
        },
        focusMobBack: () => {
            mobBackRef.current.focus();
        },
    }));

    return (
        <div
            className="consonant-LeftFilters-mobTitle">
            <button
                data-testid="consonant-LeftFilters-mobBack"
                type="button"
                onClick={onClick}
                className="consonant-LeftFilters-mobBack"
                onKeyDown={onKeyDown}
                ref={mobBackRef} />
            <span tabIndex="-1" ref={mobTitleRef}>
                {leftPanelMobileHeader}
            </span>
        </div>
    );
});

Title.propTypes = titleType;
Title.defaultProps = defaultProps;

/* eslint-disable-next-line import/prefer-default-export */
export { Title };
