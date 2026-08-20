import React from 'react';
import { string } from 'prop-types';

const tooltipType = { text: string };
const defaultProps = { text: '' };

/**
 * Tooltip (shown in 3:2 Card Footer -- primarily used with bookmark infobit)
 * Used on hover to indicate to users that they do or not do an actino
 *
 * @component
 * @example
 * const props= {
    text: String,
 * }
 * return (
 *   <Tooltip {...props}/>
 * )
 */
const Tooltip = ({ text }) => (
    <span
        className="consonant-Tooltip">
        {text}
    </span>
);

Tooltip.propTypes = tooltipType;
Tooltip.defaultProps = defaultProps;

export default Tooltip;
