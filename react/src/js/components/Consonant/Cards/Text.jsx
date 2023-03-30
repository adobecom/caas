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
import {
    useConfig,
    useLazyLoading,
} from '../Helpers/hooks';
import {
    stylesType,
    contentAreaType,
    overlaysType,
    footerType,
    tagsType,
} from '../types/card';
import LinkBlocker from './LinkBlocker/LinkBlocker';

const textCardType = {
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
    bannerMap: shape(Object).isRequired,
    tags: arrayOf(shape(tagsType)),
    onFocus: func.isRequired,
};

const defaultProps = {
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
    tags: [],
};

/**
 * TextCard design card
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
 *   <TextCard {...props}/>
 * )
 */
const TextCard = (props) => {
    const {
        id,
        footer,
        lh,
        tags,
        disableBookmarkIco,
        isBookmarked,
        onClick,
        dateFormat,
        styles: {
            backgroundImage: image,
            backgroundAltText: altText,
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

    /**
     * Class name for the card:
     * whether card border should be rendered or no;
     * @type {String}
     */
    const cardClassName = classNames({
        'consonant-Card': true,
        'consonant-TextCard': true,
        'consonant-u-noBorders': !renderBorder,
        'consonant-hide-cta': hideCTA,
    });

    /**
     * Creates a card image DOM reference
     * @returns {Object} - card image DOM reference
     */
    const imageRef = React.useRef();

    /**
     * @typedef {Image} LazyLoadedImageState
     * @description — Has image as state after image is lazy loaded
     *
     * @typedef {Function} LazyLoadedImageStateSetter
     * @description - Sets state once image is lazy loaded
     *
     * @type {[Image]} lazyLoadedImage
     */
    const [lazyLoadedImage] = useLazyLoading(imageRef, image);

    /**
     * Formatted date string
     * @type {String}
     */
    const prettyDate = startTime ? prettyFormatDate(startTime, endTime, locale, i18nFormat) : '';

    /**
     * Detail text
     * @type {String}
     */
    const detailText = prettyDate || label;

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
            if (infobit.type === INFOBIT_TYPE.BOOKMARK) {
                if (isGated) {
                    infobit.type = INFOBIT_TYPE.GATED;
                }
                return {
                    ...infobit,
                    cardId: id,
                    disableBookmarkIco,
                    isBookmarked,
                    onClick,
                };
            } else if (infobit.type === INFOBIT_TYPE.DATE) {
                return {
                    ...infobit,
                    dateFormat,
                    locale,
                };
            } else if (cardButtonStyle === 'link') {
                infobit.type = INFOBIT_TYPE.LINK;
            }
            return {
                ...infobit,
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
    const headingAria = (label ||
        detailText || description || (hasBanner && !disableBanners)) ? '' : title;

    let ariaText = title;
    if (hasBanner && !disableBanners) {
        ariaText = `${bannerDescriptionToUse} | ${ariaText}`;
    }

    const linkBlockerTarget = getLinkTarget(overlayLink);
    const addParams = new URLSearchParams(additionalParams);
    const overlay = (additionalParams && addParams.keys().next().value) ? `${overlayLink}?${addParams.toString()}` : overlayLink;

    return (
        <div
            daa-lh={lh}
            className={cardClassName}
            aria-label={ariaText}
            data-testid="consonant-TextCard"
            id={id}>
            {(renderOverlay || hideCTA)
            && <LinkBlocker target={linkBlockerTarget} link={overlay} />}
            <div
                data-testid="consonant-TextCard-header"
                className="consonant-TextCard-header"
                ref={imageRef}
                aria-label={altText}>

                <div
                    style={({
                        backgroundImage: lazyLoadedImage && `url(${lazyLoadedImage})`,
                    })}
                    className="consonant-TextCard-logo" />

                {hasBanner && !disableBanners &&
                <span
                    data-testid="consonant-TextCard-banner"
                    className="consonant-TextCard-banner"
                    style={({
                        backgroundColor: bannerBackgroundColorToUse,
                        color: bannerFontColorToUse,
                    })}>
                    {bannerIconToUse &&
                        <div
                            className="consonant-TextCard-bannerIconWrapper">
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
            </div>
            <div
                className="consonant-TextCard-inner">
                {detailText &&
                <span
                    data-testid="consonant-TextCard-label"
                    className="consonant-TextCard-label">
                    {detailText}
                </span>
                }
                <p
                    role="heading"
                    aria-label={headingAria}
                    aria-level={headingLevel}
                    className="consonant-TextCard-title"
                    data-testid="consonant-TextCard-title">
                    {title}
                </p>
                {
                    description &&
                    <p
                        className="consonant-TextCard-text"
                        data-testid="consonant-TextCard-text">
                        {description}
                    </p>
                }
                {!hideCTA && footer.map(footerItem => (
                    <CardFooter
                        divider={footerItem.divider}
                        isFluid={footerItem.isFluid}
                        key={cuid()}
                        left={extendFooterData(footerItem.left)}
                        right={extendFooterData(footerItem.right)}
                        onFocus={onFocus} />
                ))}
            </div>
        </div>
    );
};

TextCard.propTypes = textCardType;
TextCard.defaultProps = defaultProps;

export default TextCard;
