import React from 'react';
import { string } from 'prop-types';

const titleType = {
    panelHeader: string,
};

const defaultProps = {
    panelHeader: '',
};

/**
 * Title for the left filter panel for the desktop breakpoint
 *
 * @component
 * @example
 * const props= {
    panelHeader: String,
 * }
 * return (
 *   <Title {...props}/>
 * )
 */
const Title = (props) => {
    const {
        panelHeader,
        HeadingLevel,
    } = props;

    return (
        <HeadingLevel className="consonant-LeftFilters-deskTitle">
            {panelHeader}
        </HeadingLevel>
    );
};

Title.propTypes = titleType;
Title.defaultProps = defaultProps;

/* eslint-disable-next-line import/prefer-default-export */
export { Title };
