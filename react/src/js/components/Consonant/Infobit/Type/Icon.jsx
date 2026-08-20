import React from 'react';
import { string } from 'prop-types';

const iconType = {
    alt: string,
    src: string.isRequired,
};

const defaultProps = {
    alt: '',
};

/**
 * Icon With Text Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    src: String,
    srcAltText: String,
    text: String,
 * }
 * return (
 *   <IconWithText {...props}/>
 * )
 */
const Icon = ({
    src,
    alt,
}) => (
    <img
        className="consonant-IconInfobit"
        width="28"
        src={src}
        alt={alt}
        loading="lazy" />);

Icon.propTypes = iconType;
Icon.defaultProps = defaultProps;

export default Icon;
