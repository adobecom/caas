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
import { getEventBanner, getLinkTarget, isDateBeforeInterval, isDateAfterInterval, getCurrentDate, getSearchParam } from '../Helpers/general';
import { useConfig, useRegistered } from '../Helpers/hooks';
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
    renderDivider: bool,
    renderOverlay: bool,
    overlayLink: string,
    hideCTA: bool,
    startDate: string,
    endDate: string,
    cardDate: string,
    modifiedDate: string,
    bannerMap: shape(Object).isRequired,
    tags: arrayOf(shape(tagsType)),
    onFocus: func.isRequired,
    origin: string,
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
    renderDivider: false,
    renderOverlay: false,
    overlayLink: '',
    hideCTA: false,
    startDate: '',
    endDate: '',
    cardDate: '',
    modifiedDate: '',
    tags: [],
    origin: '',
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
        cardDate,
        modifiedDate,
        styles: {
            backgroundImage: image,
            backgroundAltText: altText,
            mnemonic,
            icon: cardIcon,
            iconAlt,
        },
        contentArea: {
            title,
            detailText: label,
            description,
            dateDetailText: {
                startTime = '',
                endTime = '',
            } = {},
        } = {},
        overlays: {
            banner: {
                description: bannerDescription,
                fontColor: bannerFontColor,
                backgroundColor: bannerBackgroundColor,
                icon: bannerIcon,
            } = {},
            videoButton: {
                url: videoURL,
            } = {},
            logo: {
                src: logoSrc,
                alt: logoAlt,
                backgroundColor: logoBg,
                borderColor: logoBorderBg,
            } = {},
            label: {
                description: badgeText,
            } = {},
        } = {},
        renderBorder,
        renderDivider,
        renderOverlay,
        overlayLink,
        hideCTA,
        startDate,
        endDate,
        bannerMap,
        onFocus,
        origin,
    } = props;

    let bannerBackgroundColorToUse = bannerBackgroundColor;
    let bannerIconToUse = bannerIcon;
    let bannerFontColorToUse = bannerFontColor;
    let bannerDescriptionToUse = bannerDescription;
    let videoURLToUse = videoURL;
    let gateVideo = false;

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
    const registrationUrl = getConfig('collection', 'banner.register.url');
    const hideDateInterval = getConfig('collection', 'hideDateInterval');
    const showCardBadges = getConfig('collection', 'showCardBadges');
    const altCta = getConfig('collection', 'dynamicCTAForLiveEvents');
    const ctaAction = getConfig('collection', 'ctaAction');

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
    if (detailsTextOption === 'modifiedDate' && modifiedDate) {
        const localModifiedDate = new Date(modifiedDate);
        detailText = lastModified
            && lastModified.replace('{date}', localModifiedDate.toLocaleDateString())
            || localModifiedDate.toLocaleDateString();
    } else if (detailsTextOption === 'createdDate' && cardDate) {
        const localCreatedDate = new Date(cardDate);
        detailText = localCreatedDate.toLocaleDateString();
    }

    /**
     * isGated
     * @type {Boolean}
     */
    const isGated = hasTag(/caas:gated/, tags)
        || hasTag(/caas:card-style\/half-height-featured/, tags)
        || hasTag(/7ed3/, tags)
        || hasTag(/1j6zgcx\/3bhv/, tags);

    /**
     * isRegistered
     * @type {Boolean}
     */
    const isRegistered = useRegistered(false);

    /**
     * isInPerson
     * @type {Boolean}
     */
    const isInPerson = hasTag(/events\/session-format\/in-person/, tags)
        || hasTag(/e505\/3ssk/, tags);

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
                    ...copy,
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

    // Card styles
    const isOneHalf = cardStyle === 'one-half';
    const isThreeFourths = cardStyle === 'three-fourths';
    const isDoubleWide = cardStyle === 'double-wide';
    const isHalfHeight = cardStyle === 'half-height';
    const isProduct = cardStyle === 'product';
    const isText = cardStyle === 'text-card';
    const isFull = cardStyle === 'full-card';
    const isIcon = cardStyle === 'icon-card';

    // Card elements to show
    const showHeader = !isProduct;
    const fromDexter = origin === 'Dexter';
    const showBadge = (isOneHalf || isThreeFourths || isFull) && (fromDexter || showCardBadges);
    const showLogo = isOneHalf || isThreeFourths || isFull || isText;
    const showLabel = !isProduct && !isText;
    const showVideoButton = !isProduct && !isText && !isIcon;
    const showText = !isHalfHeight && !isFull;
    const showFooter = isOneHalf || isProduct || isText;
    const showFooterLeft = !isProduct;
    const showFooterCenter = !isProduct && !altCta;
    let hideBanner = false;
    let eventBanner = '';
    const hideOnDemandDates = hideDateInterval && isDateAfterInterval(getCurrentDate(), endDate);
    const isEventsCard = getSearchParam(getConfig('collection', 'endpoint'), 'originSelection') === 'events';

    if (isHalfHeight && isGated && !isRegistered) {
        bannerDescriptionToUse = bannerMap.register.description;
        bannerIconToUse = '';
        bannerBackgroundColorToUse = bannerMap.register.backgroundColor;
        bannerFontColorToUse = bannerMap.register.fontColor;
        videoURLToUse = registrationUrl;
        gateVideo = true;
    } else if (startDate && endDate) {
        eventBanner = getEventBanner(startDate, endDate, bannerMap);
        bannerBackgroundColorToUse = eventBanner.backgroundColor;
        bannerDescriptionToUse = eventBanner.description;
        bannerFontColorToUse = eventBanner.fontColor;
        bannerIconToUse = eventBanner.icon;
        if (isHalfHeight) {
            const now = getCurrentDate();
            if (isDateBeforeInterval(now, startDate)) {
                detailText = prettyFormatDate(startDate, endDate, locale, i18nFormat);
            }
        }
    }

    // Events card custom banners
    /* istanbul ignore if */
    if (isEventsCard) {
        hideBanner = isInPerson && eventBanner === bannerMap.onDemand;
        bannerDescriptionToUse = isInPerson && eventBanner === bannerMap.live
            ? 'Live Today'
            : bannerDescriptionToUse;
    }

    const hasBanner = bannerDescriptionToUse
        && bannerFontColorToUse
        && bannerBackgroundColorToUse
        && !hideBanner;

    const headingAria = (videoURL ||
        label || detailText || description || logoSrc || badgeText || (hasBanner && !disableBanners) || !isIcon) ? '' : title;

    let ariaText = title;
    if (hasBanner && !disableBanners) {
        ariaText = `${bannerDescriptionToUse} | ${ariaText}`;
    }

    const linkBlockerTarget = getLinkTarget(overlayLink, ctaAction);
    const addParams = new URLSearchParams(additionalParams);
    const overlay = (additionalParams && addParams.keys().next().value) ? `${overlayLink}?${addParams.toString()}` : overlayLink;
    const getsFocus = isHalfHeight
        || isThreeFourths
        || isFull
        || isDoubleWide
        || isIcon
        || hideCTA;

    return (
        <div
            daa-lh={lh}
            className={`${cardStyle} ${cardClassName}`}
            aria-label={ariaText}
            data-testid="consonant-Card"
            id={id}>
            {showHeader &&
            <div
                data-testid="consonant-Card-header"
                className="consonant-Card-header"
                style={{ backgroundImage: `url("${image}")` }}
                role={altText && 'img'}
                aria-label={altText}>
                {hasBanner && !disableBanners && !isIcon &&
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
                {showBadge &&
                badgeText &&
                <span
                    className="consonant-Card-badge">
                    {badgeText}
                </span>
                }
                {showVideoButton &&
                videoURL &&
                !isHalfHeight &&
                <VideoButton
                    videoURL={videoURLToUse}
                    gateVideo={gateVideo}
                    onFocus={onFocus}
                    className="consonant-Card-videoIco" />
                }
                {showLogo &&
                (logoSrc || (isText && image)) &&
                <div
                    style={({
                        backgroundColor: logoBg,
                        borderColor: logoBorderBg,
                    })}
                    data-testid="consonant-Card-logo"
                    className="consonant-Card-logo">
                    <img
                        // the text card uses the image as logo
                        src={isText ? image : logoSrc}
                        alt={isText ? altText : logoAlt}
                        loading="lazy"
                        width="32" />
                </div>
                }
                {isIcon &&
                <div
                    data-testid="consonant-Card-logo"
                    className="consonant-Card-logo">
                    <img
                        src={cardIcon}
                        alt={iconAlt}
                        loading="lazy"
                        width="32"
                        data-testid="consonant-Card-logoImg" />
                </div>
                }
            </div>
            }
            <div
                className="consonant-Card-content">
                {showVideoButton &&
                videoURL &&
                isHalfHeight &&
                <VideoButton
                    videoURL={videoURLToUse}
                    gateVideo={gateVideo}
                    onFocus={onFocus}
                    className="consonant-Card-videoIco" />
                }

                {showLabel &&
                detailText &&
                <span
                    data-testid="consonant-Card-label"
                    className="consonant-Card-label">
                    {detailText}
                </span>
                }
                {isIcon &&
                (detailText === '') &&
                <span
                    data-testid="consonant-Card-label"
                    className="consonant-Card-label">
                    {iconAlt}
                </span>
                }
                <p
                    role="heading"
                    aria-label={headingAria}
                    aria-level={headingLevel}
                    data-testid="consonant-Card-title"
                    className="consonant-Card-title"
                    title={title}>
                    {isProduct && mnemonic && <img src={mnemonic} alt="mnemonic" loading="lazy" />}
                    {title}
                </p>
                {
                    showText &&
                    description &&
                    !isIcon &&
                    <p
                        data-testid="consonant-Card-text"
                        className="consonant-Card-text">
                        {description}
                    </p>
                }
                {showFooter &&
                !hideCTA &&
                footer.map(footerItem => (
                    <CardFooter
                        divider={renderDivider || footerItem.divider}
                        isFluid={footerItem.isFluid}
                        key={cuid()}
                        left={(showFooterLeft && !hideOnDemandDates) ?
                            extendFooterData(footerItem.left) : []}
                        center={showFooterCenter ? extendFooterData(footerItem.center) : []}
                        right={extendFooterData(footerItem.right)}
                        altRight={altCta ? extendFooterData(footerItem.altCta) : []}
                        startDate={startDate}
                        endDate={endDate}
                        cardStyle={cardStyle}
                        onFocus={onFocus} />
                ))}
                {(isThreeFourths || isDoubleWide || isFull)
                    && !renderOverlay
                    && <LinkBlocker
                        target={linkBlockerTarget}
                        link={overlay}
                        title={title}
                        getsFocus={getsFocus} />}
            </div>
            {(renderOverlay || hideCTA || isHalfHeight || isIcon)
            && <LinkBlocker
                target={linkBlockerTarget}
                link={overlay}
                title={title}
                getsFocus={getsFocus} />}
        </div>
    );
};

Card.propTypes = CardType;
Card.defaultProps = defaultProps;

export default Card;
