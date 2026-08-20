import React from 'react';
import {
    oneOfType,
    string,
    number,
} from 'prop-types';

const iconWithTextType = {
    src: string,
    srcAltText: string,
    text: oneOfType([
        string,
        number,
    ]),
};

const defaultProps = {
    src: '',
    text: '',
    srcAltText: '',
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
const IconWithText = ({
    src,
    srcAltText,
    text,
}) => (
    <div
        className="consonant-IconWithTextInfobit">
        {src &&
        <img
            src={src}
            height="22"
            alt={srcAltText}
            loading="lazy" />
        }
        <span
            className="consonant-IconWithTextInfobit-text">
            {text}
        </span>
    </div>
);

IconWithText.propTypes = iconWithTextType;
IconWithText.defaultProps = defaultProps;

export default IconWithText;
