import React from 'react';
import { string, number } from 'prop-types';
import { useConfig } from '../../Helpers/hooks';
import { getLinkTarget } from '../../Helpers/general';

const linkType = {
    linkHint: string,
    href: string.isRequired,
    text: string.isRequired,
    title: string,
    tabIndex: number,
};

const defaultProps = {
    linkHint: '',
    title: '',
    tabIndex: 0,
};

/**
 * Link Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    href: String,
    linkHint: String,
    text: String,
 * }
 * return (
 *   <Link {...props}/>
 * )
 */
const Link = ({
    href,
    linkHint,
    text,
    title,
    tabIndex,
}) => {
    /**
     **** Authored Configs ****
     */
    const getConfig = useConfig();
    const ctaAction = getConfig('collection', 'ctaAction');
    const ariaLabel = `${text} ${title}`;

    const target = getLinkTarget(href, ctaAction);
    return (
        <a
            className="consonant-LinkInfobit"
            data-testid="consonant-LinkInfobit"
            daa-ll={text}
            href={href}
            target={target}
            title={linkHint}
            rel="noopener noreferrer"
            tabIndex={tabIndex}
            aria-label={ariaLabel}>
            {text}
        </a>
    );
};

Link.propTypes = linkType;
Link.defaultProps = defaultProps;

export default Link;
