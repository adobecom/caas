import React from 'react';

import { string } from 'prop-types';

const LinkBlockerType = {
    link: string,
    target: string,
    title: string,
};

const defaultProps = {
    link: '',
    target: '',
    title: '',
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
    } = props;
    return (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        <a
            href={link}
            target={target}
            rel="noopener noreferrer"
            aria-label={title}
            tabIndex="0"
            className="consonant-LinkBlocker" />
    );
};

LinkBlocker.propTypes = LinkBlockerType;
LinkBlocker.defaultProps = defaultProps;

export default LinkBlocker;
