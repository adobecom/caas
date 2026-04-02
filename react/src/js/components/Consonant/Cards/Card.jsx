import React, { useMemo } from 'react';
import classNames from 'classnames';
import {
    string,
    shape,
    bool,
    func,
    arrayOf,
    number,
} from 'prop-types';

import CardContext from './CardContext';
import prettyFormatDate from '../Helpers/prettyFormat';
import { INFOBIT_TYPE } from '../Helpers/constants';
import { hasTag } from '../Helpers/Helpers';
import {
    getEventBanner,
    getLinkTarget,
    isDateBeforeInterval,
    isDateWithinInterval,
    isDateAfterInterval,
    getCurrentDate,
    getSearchParam,
    removeMarkDown,
    optimizeImageUrl,
} from '../Helpers/general';
import { useConfig, useRegistered } from '../Helpers/hooks';
import {
    stylesType,
    contentAreaType,
    overlaysType,
    footerType, 
    tagsType,
    bannerMapType,
} from '../types/card';

import OneHalf from './OneHalf';
import ThreeFourths from './ThreeFourths';
import DoubleWide from './DoubleWide';
import HalfHeight from './HalfHeight';
import Product from './Product';
import TextCard from './TextCard';
import FullCard from './FullCard';
import IconCard from './IconCard';
import NewsCard from './NewsCard';
import BladeCard from './BladeCard';
import EditorialCard from './EditorialCard';
import BlogCard from './BlogCard';
import HorizontalCard from './HorizontalCard';
import ButtonCard from './ButtonCard';

const CARD_STYLES = {
    'one-half': OneHalf,
    'three-fourths': ThreeFourths,
    'double-wide': DoubleWide,
    'half-height': HalfHeight,
    'product': Product,
    'text-card': TextCard,
    'full-card': FullCard,
    'icon-card': IconCard,
    'news-card': NewsCard,
    'blade-card': BladeCard,
    'editorial-card': EditorialCard,
    'blog-card': BlogCard,
    'horizontal-card': HorizontalCard,
    'button-card': ButtonCard,
};

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
    bannerMap: shape(bannerMapType),
    tags: arrayOf(shape(tagsType)),
    onFocus: func.isRequired,
    origin: string,
    ariaHidden: bool,
    tabIndex: number,
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
    bannerMap: {},
    origin: '',
    ariaHidden: false,
    tabIndex: 0,
};

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
            highlightedTitle,
            detailText: label,
            description,
            highlightedDescription,
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
        ariaHidden,
        tabIndex,
    } = props;

    let bannerBackgroundColorToUse = bannerBackgroundColor;
    let bannerIconToUse = bannerIcon;
    let bannerFontColorToUse = bannerFontColor;
    let bannerDescriptionToUse = bannerDescription;
    let videoURLToUse = videoURL;
    let gateVideo = false;

    const getConfig = useConfig();

    const i18nFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    const locale = getConfig('language', '');
    const disableBanners = getConfig('collection', 'disableBanners');
    const cardButtonStyle = getConfig('collection', 'button.style');
    const headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel') || 3;
    const additionalParams = getConfig('collection', 'additionalRequestParams');
    const detailsTextOption = getConfig('collection', 'detailsTextOption');
    const lastModified = getConfig('collection', 'i18n.lastModified');
    const registrationUrl = getConfig('collection', 'banner.register.url');
    const hideDateInterval = getConfig('collection', 'hideDateInterval');
    const showCardBadges = getConfig('collection', 'showCardBadges');
    const altCtaUsed = getConfig('collection', 'dynamicCTAForLiveEvents');
    const ctaAction = getConfig('collection', 'ctaAction');
    const bladeCard = getConfig('collection', 'bladeCard');
    const useCenterVideoPlay = getConfig('collection', 'useCenterVideoPlay');
    const searchEnabled = getConfig('search', 'enabled');
    const editorialOpenVariant = getConfig('collection', 'editorialOpenVariant') || false;
    const useRoundedCorners = getConfig('collection', 'oneHalfRoundedCorners') || false;

    const cardClassName = classNames({
        'consonant-Card': true,
        'consonant-u-noBorders': !renderBorder,
        'consonant-hide-cta': hideCTA,
        'consonant-editorial--open': editorialOpenVariant,
        'rounded-corners': useRoundedCorners,
    });

    const prettyDate = startTime ? prettyFormatDate(startTime, endTime, locale, i18nFormat) : '';

    let detailText = prettyDate || label;
    if (detailsTextOption === 'modifiedDate' && modifiedDate) {
        const localModifiedDate = new Date(modifiedDate);
        detailText = lastModified
            && lastModified.replace('{date}', localModifiedDate.toLocaleDateString())
            || localModifiedDate.toLocaleDateString();
    } else if (detailsTextOption === 'createdDate' && cardDate) {
        const localCreatedDate = new Date(cardDate);
        detailText = localCreatedDate.toLocaleDateString();
    } else if (detailsTextOption === 'staticDate' && cardDate) {
        const staticDate = new Date(cardDate.replace(/Z$/, ''));
        detailText = staticDate.toLocaleDateString();
    }

    const isGated = hasTag(/caas:gated/, tags)
        || hasTag(/caas:card-style\/half-height-featured/, tags)
        || hasTag(/7ed3/, tags)
        || hasTag(/1j6zgcx\/3bhv/, tags);

    const isRegistered = useRegistered(false);

    const isInPerson = hasTag(/events\/session-format\/in-person/, tags)
        || hasTag(/e505\/3ssk/, tags);

    function extendFooterData(data) {
        if (!data) return [];

        return data.map((infobit) => {
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

    function getAltCtaLink(footerData) {
        if (!footerData) return '';
        if (footerData.length === 1) {
            const {
                altCta = [],
            } = footerData[0];
            if (altCta.length === 1) {
                return altCta[0].href;
            }
        }
        return '';
    }

    function getCtaText(footerData, ctaUsed) {
        if (!footerData) return '';
        if (footerData.length === 1) {
            const {
                altCta = [],
                right = [],
                center = [],
            } = footerData[0];
            if (ctaUsed === 'right' && right.length === 1) {
                return right[0].text;
            } else if (ctaUsed === 'center' && center.length === 1) {
                return center[0].text;
            } else if (ctaUsed === 'alt' && altCta.length === 1) {
                return altCta[0].text;
            }
        }
        return '';
    }   

    const isHalfHeight = cardStyle === 'half-height';
    const isProduct = cardStyle === 'product';
    const isBlade = cardStyle === 'blade-card';
    const isIcon = cardStyle === 'icon-card';

    const bladeVariant = isBlade
        ? [
            bladeCard.reverse ? 'reverse' : '',
            bladeCard.lightText ? 'light-text' : '',
            bladeCard.transparent ? 'transparent' : '',
        ].filter(Boolean).join(' ')
        : '';

    const fromDexter = origin === 'Dexter';
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

    const linkBlockerTarget = getLinkTarget(overlayLink, ctaAction);
    const addParams = new URLSearchParams(additionalParams);
    const overlayParams = (additionalParams && addParams.keys().next().value) ? `${overlayLink}?${addParams.toString()}` : overlayLink;
    const isLive = isDateWithinInterval(getCurrentDate(), startDate, endDate);
    const isUpcoming = isDateBeforeInterval(getCurrentDate(), startDate);
    const altCtaLink = getAltCtaLink(footer);
    const ctaText = (altCtaUsed && isUpcoming && altCtaLink !== '') ? getCtaText(footer, 'alt') : getCtaText(footer, 'right');
    const cta2Text = getCtaText(footer, 'center');
    const overlay = (altCtaUsed && isLive && altCtaLink !== '') ? altCtaLink : overlayParams;

    const parseMarkDown = (md = '') => {
        if (searchEnabled) {
            return removeMarkDown(md.replace(/<[^>]*>/g, ''));
        }
        let markup = '';
        if (isProduct && mnemonic) {
            markup += `<img src=${mnemonic} alt="mnemonic" loading="lazy" />`;
        }
        markup += md && md.toString()
            .replace(/<[^>]*>/g, '')
            .replaceAll('{**', '<b>')
            .replaceAll('**}', '</b>')
            .replaceAll('{*', '<i>')
            .replaceAll('*}', '</i>');
        return markup;
    };

    const optimizedImage = optimizeImageUrl(image);

    const cardData = useMemo(() => ({
        id, lh, cardClassName, cardStyle, bladeVariant,
<<<<<<< HEAD
        optimizedImage, altText, cta2Text,
=======
        optimizedImage, altText,
>>>>>>> main
        hasBanner, disableBanners,
        bannerBackgroundColor: bannerBackgroundColorToUse,
        bannerFontColor: bannerFontColorToUse,
        bannerIcon: bannerIconToUse,
        bannerDescription: bannerDescriptionToUse,
        badgeText, fromDexter, showCardBadges,
        videoURL, videoURLToUse, gateVideo, useCenterVideoPlay,
        logoSrc, logoAlt, logoBg, logoBorderBg, image,
        cardIcon, iconAlt,
        detailText, editorialOpenVariant,
        highlightedTitle, title, headingAria, headingLevel,
        highlightedDescription, description, parseMarkDown,
        footer, renderDivider, cardDate, startDate, endDate,
        extendFooterData, altCtaUsed, hideOnDemandDates,
        linkBlockerTarget, overlay, ctaText,
        onFocus, tabIndex, ariaHidden, renderOverlay, hideCTA,
    }));

    const CardComponent = CARD_STYLES[cardStyle] || OneHalf;

    return (
        <CardContext.Provider value={cardData}>
            <CardComponent />
        </CardContext.Provider>
    );
};

Card.propTypes = CardType;
Card.defaultProps = defaultProps;

export default Card;
