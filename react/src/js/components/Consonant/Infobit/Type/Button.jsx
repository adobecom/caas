import React from 'react';
import className from 'classnames';
import { string, func, bool } from 'prop-types';

import { useConfig } from '../../Helpers/hooks';
import { getLinkTarget } from '../../Helpers/general';

const BUTTON_STYLE = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    CTA: 'call-to-action',
    DARK: 'dark',
};

const buttonType = {
    text: string,
    href: string,
    style: string,
    iconSrc: string,
    iconAlt: string,
    iconPos: string,
    isCta: bool,
    onFocus: func,
    title: string,
    tabIndex: string,
    renderOverlay: bool,
};

const defaultProps = {
    href: '',
    text: '',
    iconSrc: '',
    iconAlt: '',
    iconPos: '',
    isCta: false,
    style: BUTTON_STYLE.CTA,
    onFocus: () => {},
    title: '',
    tabIndex: '',
    renderOverlay: false,
};

/**
 * Button Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    style: String,
    href: String,
    text: String,
 * }
 * return (
 *   <Button {...props}/>
 * )
 */
const Button = ({
    style,
    text,
    href,
    iconSrc,
    iconAlt,
    iconPos,
    isCta,
    onFocus,
    title,
    tabIndex,
    renderOverlay,
}) => {
    /**
     **** Authored Configs ****
     */
    const getConfig = useConfig();
    const cardButtonStyle = getConfig('collection', 'button.style');
    const additionalParams = getConfig('collection', 'additionalRequestParams');

    let ctaAction = '';

    /**
     * Whether we should render a dark button
     */
    const isDarkButton = cardButtonStyle === BUTTON_STYLE.DARK;

    /**
     * Whether we should render cta button or not
     * cardButtonStyle has higher priority than style
     * @type {Boolean}
     */
    const isCtaButton = !isDarkButton
        && style !== BUTTON_STYLE.PRIMARY
        && cardButtonStyle !== BUTTON_STYLE.PRIMARY
        && cardButtonStyle !== BUTTON_STYLE.SECONDARY;

    if (isCta) {
        ctaAction = getConfig('collection', 'ctaAction');
    }

    /**
     * Class name for button:
     * Whether we should render cta button or not
     * @type {String}
     */
    const buttonClass = className({
        'consonant-BtnInfobit': true,
        'consonant-BtnInfobit--cta': isCtaButton,
        'consonant-BtnInfobit--dark': isDarkButton,
    });

    /**
     * Class name for button icon:
     * Whether icon should be placed before or after the text
     * @type {String}
     */
    const iconClass = className({
        'consonant-BtnInfobit-ico': true,
        'consonant-BtnInfobit-ico--last': iconPos.toLowerCase() === 'aftertext',
    });

    const target = getLinkTarget(href, ctaAction);
    const addParams = new URLSearchParams(additionalParams);
    const buttonLink = (additionalParams && addParams.keys().next().value) ? `${href}?${addParams.toString()}` : href;
    const ariaLabel = `${text} ${title}`;

    return (
        <a
            className={buttonClass}
            daa-ll={text}
            data-testid="consonant-BtnInfobit"
            tabIndex={renderOverlay ? '-1' : tabIndex}
            rel="noopener noreferrer"
            target={target}
            href={buttonLink}
            onFocus={onFocus}
            aria-label={ariaLabel}>
            {iconSrc &&
            <img
                data-testid="consonant-BtnInfobit-ico"
                src={iconSrc}
                width="20"
                height="20"
                className={iconClass}
                alt={iconAlt}
                loading="lazy" />
            }
            <span>{text}</span>
        </a>
    );
};

Button.propTypes = buttonType;
Button.defaultProps = defaultProps;

export default Button;
