import React from 'react';

import { string, bool } from 'prop-types';

const LinkBlockerType = {
    link: string,
    target: string,
    title: string,
    ariaHidden: bool,
    getsFocus: bool,
    daa: string,
};

const defaultProps = {
    link: '',
    target: '',
    title: '',
    ariaHidden: false,
    getsFocus: false,
    daa: '',
};

/**
 * Link Blocker
 *
 * @component
 * @example
 * const props= {
    link: String,
    target: String,
    title: String,
    daa: String,
 * }
 * return (
 *   <LinkBlocker {...props}/>
 * )
 */
const LinkBlocker = (props) => {
    const {
        link,
        target,
        title,
        getsFocus,
        ariaHidden,
        daa,
    } = props;
    return (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        <a
            href={link}
            target={target}
            rel="noopener noreferrer"
            aria-label={title}
            aria-hidden={ariaHidden}
            tabIndex={(!ariaHidden && getsFocus) ? 0 : -1}
            daa-ll={daa}
            className="consonant-LinkBlocker" />
    );
};

LinkBlocker.propTypes = LinkBlockerType;
LinkBlocker.defaultProps = defaultProps;

export default LinkBlocker;
