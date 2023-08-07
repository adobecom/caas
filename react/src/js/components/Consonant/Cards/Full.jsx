// import React from 'react';
// import classNames from 'classnames';
// import {
//     string,
//     shape,
//     bool,
//     func,
// } from 'prop-types';

// import {
//     useConfig,
//     useLazyLoading,
// } from '../Helpers/hooks';
// import { getLinkTarget, getEventBanner } from '../Helpers/general';
// import {
//     stylesType,
//     contentAreaType,
//     overlaysType,
// } from '../types/card';
// import LinkBlocker from './LinkBlocker/LinkBlocker';
// import VideoButton from '../Modal/videoButton';

// const fullCardType = {
//     ctaLink: string,
//     id: string.isRequired,
//     lh: string,
//     styles: shape(stylesType),
//     overlays: shape(overlaysType),
//     contentArea: shape(contentAreaType),
//     renderBorder: bool,
//     renderOverlay: bool,
//     overlayLink: string,
//     startDate: string,
//     endDate: string,
//     modifiedDate: string,
//     bannerMap: shape(Object).isRequired,
//     onFocus: func.isRequired,
// };

// const defaultProps = {
//     styles: {},
//     lh: '',
//     ctaLink: '',
//     overlays: {},
//     contentArea: {},
//     renderBorder: true,
//     renderOverlay: false,
//     overlayLink: '',
//     startDate: '',
//     modifiedDate: '',
//     endDate: '',
// };

// /**
//  * Full card
//  *
//  * @component
//  * @example
//  * const props= {
//     id: String,
//     ctaLink: String,
//     styles: Object,
//     contentArea: Object,
//     overlays: Object,
//     renderBorder: Boolean,
//     renderOverlay: Boolean,
//     overlayLink: String,
//  * }
//  * return (
//  *   <FullCard {...props}/>
//  * )
//  */
// const FullCard = (props) => {
//     const {
//         id,
//         lh,
//         ctaLink,
//         styles: {
//             backgroundImage: image,
//             backgroundAltText: altText,
//         },
//         contentArea: {
//             title,
//             detailText: label,

//         },
//         overlays: {
//             banner: {
//                 description: bannerDescription,
//                 fontColor: bannerFontColor,
//                 backgroundColor: bannerBackgroundColor,
//                 icon: bannerIcon,
//             },
//             videoButton: {
//                 url: videoURL,
//             },
//             logo: {
//                 src: logoSrc,
//                 alt: logoAlt,
//                 backgroundColor: logoBg,
//                 borderColor: logoBorderBg,
//             },
//             label: {
//                 description: badgeText,
//             },
//         },
//         renderBorder,
//         renderOverlay,
//         overlayLink,
//         startDate,
//         endDate,
//         modifiedDate,
//         bannerMap,
//         onFocus,
//     } = props;

//     let bannerBackgroundColorToUse = bannerBackgroundColor;
//     let bannerIconToUse = bannerIcon;
//     let bannerFontColorToUse = bannerFontColor;
//     let bannerDescriptionToUse = bannerDescription;

//     const getConfig = useConfig();

//     /**
//      **** Authored Configs ****
//      */
//     const disableBanners = getConfig('collection', 'disableBanners');
//     const ctaAction = getConfig('collection', 'ctaAction');
//     const additionalParams = getConfig('collection', 'additionalRequestParams');
//     const headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel');
//     const detailsTextOption = getConfig('collection', 'detailsTextOption');
//     const lastModified = getConfig('collection', 'i18n.lastModified');

//     /**
//      * Detail text
//      * @type {String}
//      */
//     let detailText = label;
//     if (modifiedDate && detailsTextOption === 'modifiedDate') {
//         const localModifiedDate = new Date(modifiedDate);
//         detailText = lastModified.replace('{date}', localModifiedDate.toLocaleDateString());
//     }

//     /**
//      * Class name for the card:
//      * whether card border should be rendered or no;
//      * @type {String}
//      */
//     const cardClassName = classNames({
//         'consonant-Card': true,
//         'consonant-FullCard': true,
//         'consonant-u-noBorders': !renderBorder,
//     });

//     /**
//      * Creates a card image DOM reference
//      * @returns {Object} - card image DOM reference
//      */
//     const imageRef = React.useRef();

//     /**
//      * @typedef {Image} LazyLoadedImageState
//      * @description — Has image as state after image is lazy loaded
//      *
//      * @typedef {Function} LazyLoadedImageStateSetter
//      * @description - Sets state once image is lazy loaded
//      *
//      * @type {[Image]} lazyLoadedImage
//      */
//     const [lazyLoadedImage] = useLazyLoading(imageRef, image);

//     if (startDate && endDate) {
//         const eventBanner = getEventBanner(startDate, endDate, bannerMap);
//         bannerBackgroundColorToUse = eventBanner.backgroundColor;
//         bannerDescriptionToUse = eventBanner.description;
//         bannerFontColorToUse = eventBanner.fontColor;
//         bannerIconToUse = eventBanner.icon;
//     }

//     const target = getLinkTarget(ctaLink, ctaAction);
//     const linkBlockerTarget = getLinkTarget(overlayLink);
//     const addParams = new URLSearchParams(additionalParams);
//     const cardLink = (additionalParams && addParams.keys().next().value) ? `${ctaLink}?${addParams.toString()}` : ctaLink;
//     const overlay = (additionalParams && addParams.keys().next().value) ? `${overlayLink}?${addParams.toString()}` : overlayLink;

//     let ariaText = title;
//     const hasBanner = bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse;
//     if (hasBanner) {
//         ariaText = `${bannerDescriptionToUse} | ${ariaText}`;
//     }

//     const headingAria = (videoURL || logoSrc || badgeText || (hasBanner && !disableBanners) || label) ? '' : title;


//     return (
//         <div
//             className={cardClassName}
//             data-testid="consonant-FullCard"
//             daa-lh={lh}
//             id={id}>
//             {renderOverlay && <LinkBlocker target={linkBlockerTarget} link={overlay} />}
//             <div
//                 data-testid="consonant-FullCard-img"
//                 className="consonant-FullCard-img"
//                 ref={imageRef}
//                 style={{ backgroundImage: lazyLoadedImage && `url("${lazyLoadedImage}")` }}
//                 role={altText && 'img'}
//                 aria-label={altText}>
//                 {hasBanner && !disableBanners &&
//                 <span
//                     data-testid="consonant-FullCard-banner"
//                     className="consonant-FullCard-banner"
//                     style={({
//                         backgroundColor: bannerBackgroundColorToUse,
//                         color: bannerFontColorToUse,
//                     })}>
//                     {bannerIconToUse &&
//                         <div
//                             className="consonant-FullCard-bannerIconWrapper">
//                             <img
//                                 alt=""
//                                 loading="lazy"
//                                 data-testid="consonant-Card-bannerImg"
//                                 src={bannerIconToUse} />
//                         </div>
//                     }
//                     <span>{bannerDescriptionToUse}</span>
//                 </span>
//                 }
//                 {badgeText &&
//                 <span
//                     className="consonant-FullCard-badge">
//                     {badgeText}
//                 </span>
//                 }
//                 {videoURL &&
//                 <VideoButton
//                     videoURL={videoURL}
//                     onFocus={onFocus}
//                     className="consonant-FullCard-videoIco" />
//                 }
//                 {logoSrc &&
//                 <div
//                     style={({
//                         backgroundColor: logoBg,
//                         borderColor: logoBorderBg,
//                     })}
//                     className="consonant-FullCard-logo">
//                     <img
//                         src={logoSrc}
//                         alt={logoAlt}
//                         loading="lazy"
//                         width="32" />
//                 </div>
//                 }
//             </div>
//             <a
//                 href={cardLink}
//                 target={target}
//                 daa-ll="Card CTA"
//                 aria-label={ariaText}
//                 rel="noopener noreferrer"
//                 title=""
//                 className="consonant-FullCard-inner"
//                 tabIndex="0"
//                 onFocus={onFocus}>
//                 {detailText &&
//                 <span
//                     className="consonant-FullCard-label">
//                     {detailText}
//                 </span>
//                 }
//                 <p
//                     role="heading"
//                     aria-label={headingAria}
//                     aria-level={headingLevel}
//                     className="consonant-FullCard-title">
//                     {title}
//                 </p>
//             </a>
//         </div>
//     );
// };

// FullCard.propTypes = fullCardType;
// FullCard.defaultProps = defaultProps;

// export default FullCard;
