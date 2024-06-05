import React from 'react';

import { string } from 'prop-types';

const LinkBlockerType = {
    link: string,
    target: string,
};

const defaultProps = {
    link: '',
    target: '',
};

/**
 * Link Blocker
 *
 * @component
 * @example
 * const props= {
    link: String,
    target: String,
 * }
 * return (
 *   <LinkBlocker {...props}/>
 * )
 */
const LinkBlocker = (props) => {
    const {
        link,
        target,
    } = props;
    return (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        <a
            href={link}
            target={target}
            rel="noopener noreferrer"
            aria-label={link}
            tabIndex="0"
            className="consonant-LinkBlocker" />
    );
};

LinkBlocker.propTypes = LinkBlockerType;
LinkBlocker.defaultProps = defaultProps;

export default LinkBlocker;
