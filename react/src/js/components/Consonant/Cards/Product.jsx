// import React from 'react';
// import classNames from 'classnames';
// import {
//     string,
//     shape,
//     bool,
//     arrayOf,
//     func,
// } from 'prop-types';
// import cuid from 'cuid';

// import { INFOBIT_TYPE } from '../Helpers/constants';
// import CardFooter from './CardFooter/CardFooter';
// import { useConfig, useLazyLoading } from '../Helpers/hooks';
// import {
//     stylesType,
//     contentAreaType,
//     footerType,
// } from '../types/card';
// import LinkBlocker from './LinkBlocker/LinkBlocker';
// import { getLinkTarget } from '../Helpers/general';

// const ProductCardType = {
//     footer: arrayOf(shape(footerType)),
//     ctaLink: string,
//     id: string.isRequired,
//     lh: string,
//     styles: shape(stylesType),
//     contentArea: shape(contentAreaType),
//     renderBorder: bool,
//     renderOverlay: bool,
//     overlayLink: string,
//     hideCTA: bool,
//     disableBookmarkIco: bool,
//     isBookmarked: bool,
//     onClick: func,
//     dateFormat: string,
//     onFocus: func.isRequired,
// };

// const defaultProps = {
//     footer: [],
//     styles: {},
//     ctaLink: '',
//     contentArea: {},
//     lh: '',
//     renderBorder: true,
//     renderOverlay: false,
//     overlayLink: '',
//     hideCTA: false,
//     disableBookmarkIco: false,
//     isBookmarked: false,
//     dateFormat: '',
//     onClick: () => {},
// };

// /**
//  * 3/4 image aspect ratio card
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
//  *   <ProductCard {...props}/>
//  * )
//  */
// const ProductCard = (props) => {
//     const {
//         id,
//         footer,
//         ctaLink,
//         lh,
//         styles: {
//             mnemonic,
//         },
//         contentArea: {
//             title,
//             description,
//         },
//         renderBorder,
//         renderOverlay,
//         overlayLink,
//         hideCTA,
//         disableBookmarkIco,
//         isBookmarked,
//         onClick,
//         dateFormat,
//         onFocus,
//     } = props;

//     /**
//      **** Authored Configs ****
//      */
//     const getConfig = useConfig();
//     const locale = getConfig('language', '');
//     const ctaAction = getConfig('collection', 'ctaAction');
//     const cardButtonStyle = getConfig('collection', 'button.style');
//     const additionalParams = getConfig('collection', 'additionalRequestParams');
//     const headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel');

//     /**
//      * Class name for the card:
//      * whether card border should be rendered or no;
//      * @type {String}
//      */
//     const cardClassName = classNames({
//         'consonant-Card': true,
//         'consonant-ProductCard': true,
//         'consonant-u-noBorders': !renderBorder,
//         'consonant-hide-cta': hideCTA,
//     });

//     const mnemonicClassName = classNames({
//         'consonant-ProductCard-img': true,
//         'consonant-ProductCard-img--missing': mnemonic === '',
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
//     const [lazyLoadedImage] = useLazyLoading(imageRef, mnemonic);

//     /**
//      * Extends infobits with the configuration data
//      * @param {Array} data - Array of the infobits
//      * @return {Array} - Array of the infobits with the configuration data added
//      */
//     function extendFooterData(data) {
//         if (!data) return [];

//         return data.map((infobit) => {
//             // MWPW-129085: Compiler wrongly compiles this object to private, read-only,
//             // Created copy so object instance has public methods and properties.
//             const copy = { ...infobit };
//             if (copy.type === INFOBIT_TYPE.BOOKMARK) {
//                 return {
//                     ...copy,
//                     cardId: id,
//                     disableBookmarkIco,
//                     isBookmarked,
//                     onClick,
//                     isProductCard: true,
//                 };
//             } else if (copy.type === INFOBIT_TYPE.DATE) {
//                 return {
//                     ...copy,
//                     dateFormat,
//                     locale,
//                 };
//             } else if (cardButtonStyle === 'link') {
//                 copy.type = INFOBIT_TYPE.LINK;
//             }
//             return copy;
//         });
//     }

//     const target = getLinkTarget(ctaLink, ctaAction);
//     const linkBlockerTarget = getLinkTarget(overlayLink);
//     const addParams = new URLSearchParams(additionalParams);
//     const overlay = (additionalParams && addParams.keys().next().value) ? `${overlayLink}?${addParams.toString()}` : overlayLink;
//     const headingAria = description ? '' : title;

//     return (
//         <div
//             daa-lh={lh}
//             className={cardClassName}
//             data-testid="consonant-ProductCard"
//             aria-label={title}
//             id={id}>
//             {(renderOverlay || hideCTA)
//             && <LinkBlocker target={linkBlockerTarget} link={overlay} />}
//             <div
//                 target={target}
//                 className="consonant-ProductCard-inner">
//                 {
//                     title &&
//                     <div className="consonant-ProductCard-row">
//                         <div
//                             data-testid={mnemonicClassName}
//                             className={mnemonicClassName}
//                             ref={imageRef}
//                             style={{ backgroundImage: lazyLoadedImage && `url("${lazyLoadedImage}")` }} />
//                         <p
//                             role="heading"
//                             aria-label={headingAria}
//                             aria-level={headingLevel}
//                             className="consonant-ProductCard-title">{title}
//                         </p>
//                     </div>
//                 }
//                 {
//                     description &&
//                     <p
//                         className="consonant-ProductCard-text">
//                         {description}
//                     </p>
//                 }
//                 {!hideCTA && footer.map(footerItem => (
//                     <CardFooter
//                         divider={footerItem.divider}
//                         isFluid={footerItem.isFluid}
//                         key={cuid()}
//                         left={extendFooterData(footerItem.left)}
//                         center={extendFooterData(footerItem.center)}
//                         right={extendFooterData(footerItem.right)}
//                         onFocus={onFocus} />
//                 ))}
//             </div>
//         </div>
//     );
// };

// ProductCard.propTypes = ProductCardType;
// ProductCard.defaultProps = defaultProps;

// export default ProductCard;
