import React from 'react';
import { string } from 'prop-types';

const textType = {
    text: string.isRequired,
};

/**
 * Text infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    text: String,
 * }
 * return (
 *   <Text {...props}/>
 * )
 */
const Text = ({ text }) => <p className="consonant-TextInfobit">{text}</p>;

Text.propTypes = textType;

export default Text;
