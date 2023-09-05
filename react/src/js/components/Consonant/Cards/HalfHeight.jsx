import React, { Fragment } from 'react';

import classNames from 'classnames';
import {
    string,
    shape,
    bool,
    func,
    arrayOf,
} from 'prop-types';

import { useConfig, useLazyLoading, useRegistered } from '../Helpers/hooks';
import { hasTag } from '../Helpers/Helpers';
import { getLinkTarget, getEventBanner, isDateBeforeInterval, getCurrentDate } from '../Helpers/general';
import {
    stylesType,
    contentAreaType,
    overlaysType,
    tagsType,
} from '../types/card';
import LinkBlocker from './LinkBlocker/LinkBlocker';
import VideoButton from '../Modal/videoButton';
import prettyFormatDate from '../Helpers/prettyFormat';

const halfHeightCardType = {
    ctaLink: string,
    id: string.isRequired,
    lh: string,
    styles: shape(stylesType),
    overlays: shape(overlaysType),
    contentArea: shape(contentAreaType),
    renderBorder: bool,
    renderOverlay: bool,
    overlayLink: string,
    startDate: string,
    endDate: string,
    modifiedDate: string,
    bannerMap: shape(Object).isRequired,
    tags: arrayOf(shape(tagsType)),
    onFocus: func.isRequired,
};

const defaultProps = {
    styles: {},
    lh: '',
    ctaLink: '',
    overlays: {},
    contentArea: {},
    renderBorder: true,
    renderOverlay: false,
    overlayLink: '',
    startDate: '',
    endDate: '',
    modifiedDate: '',
    tags: [],
};

/**
 * Half height card
 *
 * @component
 * @example
 * const props= {
    id: String,
    ctaLink: String,
    styles: Object,
    contentArea: Object,
    overlays: Object,
    renderBorder: Boolean,
    renderOverlay: Boolean,
    overlayLink: String,
 * }
 * return (
 *   <HalfHeightCard {...props}/>
 * )
 */
const HalfHeightCard = (props) => {
    const {
        id,
        lh,
        ctaLink,
        styles: {
            backgroundImage: image,
            backgroundAltText: altText,
        },
        tags,
        contentArea: {
            title,
            detailText: label,

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
        },
        renderBorder,
        renderOverlay,
        overlayLink,
        startDate,
        endDate,
        modifiedDate,
        bannerMap,
        onFocus,
    } = props;

    let bannerBackgroundColorToUse = bannerBackgroundColor;
    let bannerIconToUse = bannerIcon;
    let bannerFontColorToUse = bannerFontColor;
    let bannerDescriptionToUse = bannerDescription;
    let videoURLToUse = videoURL;
    let gateVideo = false;
    let labelToUse = label;

    const getConfig = useConfig();

    /**
     **** Authored Configs ****
     */
    const registrationUrl = getConfig('collection', 'banner.register.url');
    const i18nFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    const locale = getConfig('language', '');
    const disableBanners = getConfig('collection', 'disableBanners');
    const ctaAction = getConfig('collection', 'ctaAction');
    const additionalParams = getConfig('collection', 'additionalRequestParams');
    const headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel');
    const detailsTextOption = getConfig('collection', 'detailsTextOption');
    const lastModified = getConfig('collection', 'i18n.lastModified');

    /**
     * Detail text
     * @type {String}
     */
    if (modifiedDate && detailsTextOption === 'modifiedDate') {
        const localModifiedDate = new Date(modifiedDate);
        labelToUse = lastModified.replace('{date}', localModifiedDate.toLocaleDateString());
    }

    /**
     * Class name for the card:
     * whether card border should be rendered or no;
     * @type {String}
     */
    const cardClassName = classNames({
        'consonant-Card': true,
        'consonant-HalfHeightCard': true,
        'consonant-u-noBorders': !renderBorder,
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
    const isRegistered = useRegistered(false);
    const isGated = hasTag(/caas:gated/, tags)
        || hasTag(/caas:card-style\/half-height-featured/, tags)
        || hasTag(/7ed3/, tags)
        || hasTag(/1j6zgcx\/3bhv/, tags);

    window.isGated = isGated;

    if (isGated && !isRegistered) {
        bannerDescriptionToUse = bannerMap.register.description;
        bannerIconToUse = '';
        bannerBackgroundColorToUse = bannerMap.register.backgroundColor;
        bannerFontColorToUse = bannerMap.register.fontColor;
        videoURLToUse = registrationUrl;
        gateVideo = true;
    } else if (startDate && endDate) {
        const eventBanner = getEventBanner(startDate, endDate, bannerMap);
        bannerBackgroundColorToUse = eventBanner.backgroundColor;
        bannerDescriptionToUse = eventBanner.description;
        bannerFontColorToUse = eventBanner.fontColor;
        bannerIconToUse = eventBanner.icon;
        const now = getCurrentDate();
        if (isDateBeforeInterval(now, startDate)) {
            labelToUse = prettyFormatDate(startDate, endDate, locale, i18nFormat);
        }
    }

    const target = getLinkTarget(ctaLink, ctaAction);
    const linkBlockerTarget = getLinkTarget(overlayLink);
    let ariaText = lh.split(' | ').slice(1, -1).join(' | ');

    if (bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse
        && (!isGated || !isRegistered) && (!disableBanners || isGated)) {
        ariaText = `${bannerDescriptionToUse} | ${ariaText}`;
    }

    const addParams = new URLSearchParams(additionalParams);
    const cardLink = (additionalParams && addParams.keys().next().value) ? `${ctaLink}?${addParams.toString()}` : ctaLink;
    const overlay = (additionalParams && addParams.keys().next().value) ? `${overlayLink}?${addParams.toString()}` : overlayLink;
    const hasBanner = bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse;
    const headingAria = (videoURL || label || (hasBanner && !disableBanners)) ? '' : title;

    /**
     * Inner HTML of the card, which will be included into either div or a tag;
     */
    const renderCardContent = () => (
        <Fragment>
            {hasBanner
            && (!isGated || !isRegistered) && (!disableBanners || isGated) &&
            <span
                className="consonant-HalfHeightCard-banner"
                style={({
                    backgroundColor: bannerBackgroundColorToUse,
                    color: bannerFontColorToUse,
                })}>
                {bannerIconToUse &&
                    <div
                        className="consonant-HalfHeightCard-bannerIconWrapper">
                        <img
                            alt=""
                            loading="lazy"
                            src={bannerIconToUse} />
                    </div>
                }
                <span>{bannerDescriptionToUse}</span>
            </span>
            }
            <div
                className="consonant-HalfHeightCard-img"
                ref={imageRef}
                style={{ backgroundImage: lazyLoadedImage && `url("${lazyLoadedImage}")` }}
                role={altText && 'img'}
                aria-label={altText} />
            <div className="consonant-HalfHeightCard-inner">
                {videoURLToUse &&
                <VideoButton
                    videoURL={videoURLToUse}
                    gateVideo={gateVideo}
                    onFocus={onFocus}
                    className="consonant-HalfHeightCard-videoIco" />
                }
                {title &&
                <p
                    role="heading"
                    aria-label={headingAria}
                    aria-level={headingLevel}
                    className="consonant-HalfHeightCard-title"
                    daa-ll="Card CTA">{title}
                </p>
                }
                {labelToUse &&
                <span className="consonant-HalfHeightCard-label">{labelToUse}</span>
                }
            </div>
        </Fragment>
    );

    return (
        videoURLToUse ?
            <div
                className={cardClassName}
                daa-lh={lh}
                aria-label={ariaText}
                id={id}>
                onFocus={onFocus}
                {renderOverlay && <LinkBlocker target={linkBlockerTarget} link={overlay} />}
                {renderCardContent()}
            </div> :
            <a
                href={cardLink}
                target={target}
                aria-label={ariaText}
                rel="noopener noreferrer"
                className={cardClassName}
                title=""
                daa-lh={lh}
                tabIndex="0"
                onFocus={onFocus}
                id={id}>
                {renderOverlay && <LinkBlocker target={linkBlockerTarget} link={overlay} />}
                {renderCardContent()}
            </a>
    );
};

HalfHeightCard.propTypes = halfHeightCardType;
HalfHeightCard.defaultProps = defaultProps;

export default HalfHeightCard;
