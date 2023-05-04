import React from 'react';
import classNames from 'classnames';
import {
    string,
    shape,
    bool,
    func,
} from 'prop-types';

import { useConfig, useLazyLoading } from '../Helpers/hooks';
import {
    stylesType,
    contentAreaType,
    overlaysType,
} from '../types/card';
import LinkBlocker from './LinkBlocker/LinkBlocker';
import { getEventBanner, getLinkTarget } from '../Helpers/general';

const doubleWideCardType = {
    ctaLink: string,
    id: string.isRequired,
    lh: string,
    styles: shape(stylesType),
    contentArea: shape(contentAreaType),
    overlays: shape(overlaysType),
    renderBorder: bool,
    renderOverlay: bool,
    overlayLink: string,
    startDate: string,
    endDate: string,
    modifiedDate: string,
    bannerMap: shape(Object).isRequired,
    onFocus: func.isRequired,
};

const defaultProps = {
    styles: {},
    lh: '',
    ctaLink: '',
    contentArea: {},
    overlays: {},
    renderBorder: true,
    renderOverlay: false,
    overlayLink: '',
    startDate: '',
    modifiedDate: '',
    endDate: '',
};

/**
 * Double wide card
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
 *   <DoubleWideCard {...props}/>
 * )
 */
const DoubleWideCard = (props) => {
    const {
        id,
        lh,
        ctaLink,
        styles: {
            backgroundImage: image,
            backgroundAltText: altText,
        },
        contentArea: {
            title,
            description,
            detailText: label,
        },
        overlays: {
            videoButton: {
                url: videoURL,
            },
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

    const getConfig = useConfig();

    /**
     **** Authored Configs ****
     */
    const ctaAction = getConfig('collection', 'ctaAction');
    const additionalParams = getConfig('collection', 'additionalRequestParams');
    const headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel');
    const detailsTextOption = getConfig('collection', 'detailsTextOption');
    const lastModified = getConfig('collection', 'i18n.lastModified');

    /**
     * Detail text
     * @type {String}
     */
    let detailText = label;
    if (modifiedDate && detailsTextOption === 'modifiedDate') {
        const localModifiedDate = new Date(modifiedDate);
        detailText = lastModified.replace('{date}', localModifiedDate.toLocaleDateString());
    }

    /**
     * Class name for the card:
     * whether card text content should be rendered or no;
     * whether card border should be rendered or no;
     * @type {String}
     */
    const cardClassName = classNames({
        'consonant-Card': true,
        'consonant-DoubleWideCard': true,
        'consonant-DoubleWideCard--noTextInfo': !title && !description && !label,
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

    if (startDate && endDate) {
        const eventBanner = getEventBanner(startDate, endDate, bannerMap);
        bannerBackgroundColorToUse = eventBanner.backgroundColor;
        bannerDescriptionToUse = eventBanner.description;
        bannerFontColorToUse = eventBanner.fontColor;
        bannerIconToUse = eventBanner.icon;
    }

    const target = getLinkTarget(ctaLink, ctaAction);
    const linkBlockerTarget = getLinkTarget(overlayLink);
    const addParams = new URLSearchParams(additionalParams);
    const cardLink = (additionalParams && addParams.keys().next().value) ? `${ctaLink}?${addParams.toString()}` : ctaLink;
    const overlay = (additionalParams && addParams.keys().next().value) ? `${overlayLink}?${addParams.toString()}` : overlayLink;
    const hasBanner = bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse;
    const headingAria = (videoURL || hasBanner || label || description) ? '' : title;

    let ariaText = title;
    if (hasBanner) {
        ariaText = `${bannerDescriptionToUse} | ${ariaText}`;
    }

    return (
        <div
            className={cardClassName}
            daa-lh={lh}
            id={id}>
            {renderOverlay && <LinkBlocker target={linkBlockerTarget} link={overlay} />}
            {bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse &&
            <span
                data-testid="consonant-OneHalfCard-banner"
                className="consonant-OneHalfCard-banner"
                style={({
                    backgroundColor: bannerBackgroundColorToUse,
                    color: bannerFontColorToUse,
                })}>
                {bannerIconToUse &&
                <div
                    className="consonant-OneHalfCard-bannerIconWrapper">
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
            <div
                className="consonant-DoubleWideCard-img"
                ref={imageRef}
                style={{ backgroundImage: lazyLoadedImage && `url("${lazyLoadedImage}")` }}
                role={altText && 'img'}
                aria-label={altText}>
                {videoURL && true}
            </div>
            <a
                href={cardLink}
                target={target}
                aria-label={ariaText}
                daa-ll="Card CTA"
                rel="noopener noreferrer"
                tabIndex="0"
                className="consonant-DoubleWideCard-inner"
                onFocus={onFocus}>
                {detailText &&
                <span className="consonant-DoubleWideCard-label">{detailText}</span>
                }
                {title &&
                <p
                    role="heading"
                    aria-label={headingAria}
                    aria-level={headingLevel}
                    className="consonant-DoubleWideCard-title">{title}
                </p>
                }
                {description &&
                <p className="consonant-DoubleWideCard-text">{description}</p>
                }
            </a>
        </div>
    );
};

DoubleWideCard.propTypes = doubleWideCardType;
DoubleWideCard.defaultProps = defaultProps;

export default DoubleWideCard;
