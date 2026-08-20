import React from 'react';
import {
    string,
    bool,
    oneOfType,
} from 'prop-types';

const linkWithIconType = {
    src: string,
    href: string,
    text: string,
    linkHint: string,
    srcAltText: string,
    openInNewTab: oneOfType([string, bool]),
};

const defaultProps = {
    src: '',
    href: '',
    text: '',
    linkHint: '',
    srcAltText: '',
    openInNewTab: true,
};

/**
 * LinkWithIcon Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    href: String,
    openInNewTab: Boolean,
    linkHint: String,
    text: String,
    src: String,
    srcAltText: String,
 * }
 * return (
 *   <LinkWithIcon {...props}/>
 * )
 */
const LinkWithIcon = ({
    href,
    openInNewTab,
    linkHint,
    text,
    src,
    srcAltText,
}) => (
    <a
        daa-ll={text}
        href={href}
        data-testid="consonant-LinkWithIcoInfobit"
        target={openInNewTab ? '_blank' : '_self'}
        className="consonant-LinkWithIcoInfobit"
        title={linkHint}
        rel="noopener noreferrer"
        tabIndex="0">
        {src &&
        <img src={src} alt={srcAltText} loading="lazy" height="18" />
        }
        <span>{text}</span>
    </a>
);

LinkWithIcon.propTypes = linkWithIconType;
LinkWithIcon.defaultProps = defaultProps;

export default LinkWithIcon;
