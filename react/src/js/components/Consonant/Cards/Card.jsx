import React from 'react';
import classNames from 'classnames';
import cuid from 'cuid';
import {
    string,
    shape,
    bool,
    func,
    arrayOf,
} from 'prop-types';

import CardFooter from './CardFooter/CardFooter';
import prettyFormatDate from '../Helpers/prettyFormat';
import { INFOBIT_TYPE } from '../Helpers/constants';
import { hasTag } from '../Helpers/Helpers';
import { getEventBanner, getLinkTarget } from '../Helpers/general';
import { useConfig } from '../Helpers/hooks';
import {
    stylesType,
    contentAreaType,
    overlaysType,
    footerType,
    tagsType,
} from '../types/card';
import LinkBlocker from './LinkBlocker/LinkBlocker';
import VideoButton from '../Modal/videoButton';

const CardType = {
    cardStyle: string,
    isBookmarked: bool,
    dateFormat: string,
    id: string.isRequired,
    lh: string,
    styles: shape(stylesType),
    disableBookmarkIco: bool,
    onClick: func.isRequired,
    overlays: shape(overlaysType),
    footer: arrayOf(shape(footerType)),
    contentArea: shape(contentAreaType),
    renderBorder: bool,
    renderOverlay: bool,
    overlayLink: string,
    hideCTA: bool,
    startDate: string,
    endDate: string,
    modifiedDate: string,
    bannerMap: shape(Object).isRequired,
    tags: arrayOf(shape(tagsType)),
    onFocus: func.isRequired,
};

const defaultProps = {
    cardStyle: '',
    footer: [],
    styles: {},
    overlays: {},
    dateFormat: '',
    contentArea: {},
    lh: '',
    isBookmarked: false,
    disableBookmarkIco: false,
    renderBorder: true,
    renderOverlay: false,
    overlayLink: '',
    hideCTA: false,
    startDate: '',
    endDate: '',
    modifiedDate: '',
    tags: [],
};

/**
 * 1/2 image aspect ratio card
 *
 * @component
 * @example
 * const props= {
    id: String,
    styles: Object,
    contentArea: Object,
    overlays: Object,
    renderBorder: Boolean,
    renderOverlay: Boolean,
    overlayLink: String,
 * }
 * return (
 *   <Card {...props}/>
 * )
 */
const Card = (props) => {
    const {
        id,
        footer,
        lh,
        tags,
        cardStyle,
        disableBookmarkIco,
        isBookmarked,
        onClick,
        dateFormat,
        modifiedDate,
        styles: {
            backgroundImage: image,
            backgroundAltText: altText,
            mnemonic,
        },
        contentArea: {
            title,
            detailText: label,
            description,
            dateDetailText: {
                startTime,
                endTime,
            },

        },
        overlays: {
            banner: {
                description: bannerDescription,
                fontColor: bannerFontColor,
                backgroundColor: bannerBackgroundColor,
                icon: bannerIcon,
            },
            videoButton: {
                url: videoURL,
            },
            logo: {
                src: logoSrc,
                alt: logoAlt,
                backgroundColor: logoBg,
                borderColor: logoBorderBg,
            },
            label: {
                description: badgeText,
            },
        },
        renderBorder,
        renderOverlay,
        overlayLink,
        hideCTA,
        startDate,
        endDate,
        bannerMap,
        onFocus,
    } = props;

    let bannerBackgroundColorToUse = bannerBackgroundColor;
    let bannerIconToUse = bannerIcon;
    let bannerFontColorToUse = bannerFontColor;
    let bannerDescriptionToUse = bannerDescription;

    const getConfig = useConfig();

    /**
     **** Authored Configs ****
     */
    const i18nFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    const locale = getConfig('language', '');
    const disableBanners = getConfig('collection', 'disableBanners');
    const cardButtonStyle = getConfig('collection', 'button.style');
    const headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel');
    const additionalParams = getConfig('collection', 'additionalRequestParams');
    const detailsTextOption = getConfig('collection', 'detailsTextOption');
    const lastModified = getConfig('collection', 'i18n.lastModified');

    /**
     * Class name for the card:
     * whether card border should be rendered or no;
     * @type {String}
     */
    const cardClassName = classNames({
        'consonant-Card': true,
        'consonant-u-noBorders': !renderBorder,
        'consonant-hide-cta': hideCTA,
    });

    /**
     * Formatted date string
     * @type {String}
     */
    const prettyDate = startTime ? prettyFormatDate(startTime, endTime, locale, i18nFormat) : '';

    /**
     * Detail text
     * @type {String}
     */
    let detailText = prettyDate || label;
    if (modifiedDate && detailsTextOption === 'modifiedDate') {
        const localModifiedDate = new Date(modifiedDate);
        // detailText = lastModified.replace('{date}', localModifiedDate.toLocaleDateString());
        detailText = lastModified
            && lastModified.replace('{date}', localModifiedDate.toLocaleDateString())
            || localModifiedDate.toLocaleDateString();
    }

    /**
     * isGated
     * @type {Boolean}
     */
    const isGated = hasTag(/caas:gated/, tags);


    /**
     * Extends infobits with the configuration data
     * @param {Array} data - Array of the infobits
     * @return {Array} - Array of the infobits with the configuration data added
     */
    function extendFooterData(data) {
        if (!data) return [];

        return data.map((infobit) => {
            // MWPW-129085: Compiler wrongly compiles this object to private, read-only,
            // Created copy so object instance has public methods and properties.
            const copy = { ...infobit };
            if (copy.type === INFOBIT_TYPE.BOOKMARK) {
                if (isGated) {
                    copy.type = INFOBIT_TYPE.GATED;
                }
                return {
                    ...infobit,
                    cardId: id,
                    disableBookmarkIco,
                    isBookmarked,
                    onClick,
                };
            } else if (copy.type === INFOBIT_TYPE.DATE) {
                return {
                    ...copy,
                    dateFormat,
                    locale,
                };
            } else if (cardButtonStyle === 'link') {
                copy.type = INFOBIT_TYPE.LINK;
            }
            return {
                ...copy,
                isCta: true,
            };
        });
    }

    if (startDate && endDate) {
        const eventBanner = getEventBanner(startDate, endDate, bannerMap);
        bannerBackgroundColorToUse = eventBanner.backgroundColor;
        bannerDescriptionToUse = eventBanner.description;
        bannerFontColorToUse = eventBanner.fontColor;
        bannerIconToUse = eventBanner.icon;
    }
    const hasBanner = bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse;
    const headingAria = (videoURL ||
        label || detailText || description || logoSrc || badgeText || (hasBanner && !disableBanners)) ? '' : title;

    let ariaText = title;
    if (hasBanner && !disableBanners) {
        ariaText = `${bannerDescriptionToUse} | ${ariaText}`;
    }

    const linkBlockerTarget = getLinkTarget(overlayLink);
    const addParams = new URLSearchParams(additionalParams);
    const overlay = (additionalParams && addParams.keys().next().value) ? `${overlayLink}?${addParams.toString()}` : overlayLink;

    // Card styles
    const isOneHalf = cardStyle === '1-2';
    const isThreeFourths = cardStyle === '3-4';
    const isHalfHeight = cardStyle === 'half-height';
    const isProduct = cardStyle === 'product';

    // Card elements to show
    const showHeader = !isProduct;
    const showText = isOneHalf || isProduct || isThreeFourths;
    const showFooter = isOneHalf || isProduct;
    const showLogo = !isHalfHeight;

    return (
        <div
            daa-lh={lh}
            className={cardClassName}
            aria-label={ariaText}
            data-testid="consonant-Card"
            id={id}>
            {showHeader &&
            <div
                data-testid="consonant-Card-header"
                className="consonant-Card-header">
                <img src={image} alt={altText} aria-label={altText} loading="lazy" />
                {hasBanner && !disableBanners &&
                <span
                    data-testid="consonant-Card-banner"
                    className="consonant-Card-banner"
                    style={({
                        backgroundColor: bannerBackgroundColorToUse,
                        color: bannerFontColorToUse,
                    })}>
                    {bannerIconToUse &&
                        <div
                            className="consonant-Card-bannerIconWrapper">
                            <img
                                alt=""
                                loading="lazy"
                                src={bannerIconToUse}
                                data-testid="consonant-Card-bannerImg" />
                        </div>
                    }
                    <span>{bannerDescriptionToUse}</span>
                </span>
                }
                {badgeText &&
                <span
                    className="consonant-Card-badge">
                    {badgeText}
                </span>
                }
                {videoURL &&
                <VideoButton
                    videoURL={videoURL}
                    onFocus={onFocus}
                    className="consonant-Card-videoIco" />
                }
                {showLogo &&
                logoSrc &&
                <div
                    style={({
                        backgroundColor: logoBg,
                        borderColor: logoBorderBg,
                    })}
                    className="consonant-Card-logo">
                    <img
                        src={logoSrc}
                        alt={logoAlt}
                        loading="lazy"
                        width="32" />
                </div>
                }
            </div>
            }
            <div
                className="consonant-Card-inner">
                {detailText &&
                <span
                    data-testid="consonant-Card-label"
                    className="consonant-Card-label">
                    {detailText}
                </span>
                }
                <p
                    role="heading"
                    aria-label={headingAria}
                    aria-level={headingLevel}
                    className="consonant-Card-title">
                    {isProduct && mnemonic && <img src={mnemonic} alt="mnemonic" loading="lazy" />}
                    {title}
                </p>
                {
                    showText &&
                    description &&
                    <p
                        className="consonant-Card-text">
                        {description}
                    </p>
                }
                {showFooter &&
                !hideCTA &&
                footer.map(footerItem => (
                    <CardFooter
                        divider={footerItem.divider}
                        isFluid={footerItem.isFluid}
                        key={cuid()}
                        left={extendFooterData(footerItem.left)}
                        center={extendFooterData(footerItem.center)}
                        right={extendFooterData(footerItem.right)}
                        onFocus={onFocus} />
                ))}
            </div>
            {(renderOverlay || hideCTA || isHalfHeight)
            && <LinkBlocker target={linkBlockerTarget} link={overlay} />}
        </div>
    );
};

Card.propTypes = CardType;
Card.defaultProps = defaultProps;

export default Card;
