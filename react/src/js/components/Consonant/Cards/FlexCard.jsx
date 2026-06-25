import React from 'react';
import cuid from 'cuid';
import { useCardData } from './CardContext';
import CardHeader from './CardHeader/CardHeader';
import CardContent from './CardContent/CardContent';
import CardFooter from './CardFooter/CardFooter';
import LinkBlocker from './LinkBlocker/LinkBlocker';
import { useConfig } from '../Helpers/hooks';

const FlexCard = () => {
    const {
        id, country, reference, lh, cardClassName,
        optimizedImage, altText, flexCardOptions,
        hasBanner, disableBanners,
        bannerBackgroundColor, bannerFontColor, bannerIcon, bannerDescription,
        badgeText, fromDexter, showCardBadges,
        videoURL, videoURLToUse, gateVideo, useCenterVideoPlay,
        logoSrc, logoAlt, logoBg, logoBorderBg,
        detailText,
        highlightedTitle, title, headingAria, headingLevel,
        highlightedDescription, description,
        parseMarkDown,
        footer, renderDivider, cardDate, startDate, endDate,
        extendFooterData, altCtaUsed, hideOnDemandDates,
        linkBlockerTarget, overlay, ctaText,
        onFocus, tabIndex, ariaHidden,
        renderOverlay, hideCTA,
    } = useCardData();

    const imageOption = flexCardOptions?.imageOption || '';
    const textAlign = flexCardOptions?.textAlign || 'text-left';
    const showDetails = !(flexCardOptions?.hideDetails === true);
    const showTitle = !(flexCardOptions?.hideTitle === true);
    const showDescription = !(flexCardOptions?.hideDescription === true);
    const showFooter = !(flexCardOptions?.hideFooter === true);
    const textSize = flexCardOptions?.textSize || '';
    const textSizeClass = textSize === 'text-large' ? 'text-large' : '';

    const getConfig = useConfig();
    const detailsTextOption = getConfig('collection', 'detailsTextOption');
    const products = detailsTextOption === 'productName'
        ? Object.values(getConfig('products', '')).filter((product) => product && product.tagID)
        : [];

    let showProductName = false;
    let productInfo = null;
    if (products.length > 0) {
        const productData = products.find(product => product.tagID === detailText);
        if (productData) {
            showProductName = true;
            productInfo = {
                tagID: productData.tagID || '',
                title: productData.title || '',
                tagImage: productData.tagImage || '',
            };
        }
    }

    return (
        <li
            daa-lh={lh}
            className={`flex-card ${cardClassName} ${imageOption} ${textAlign} ${textSizeClass}`}
            data-testid="consonant-Card"
            id={id}
            {...(country && { 'data-country': country })}
            {...(reference && { 'data-card-url': reference })}>
            {imageOption !== 'hidden' && <CardHeader
                image={optimizedImage}
                imageOption={imageOption}
                altText={altText}
                isIcon={false}
                showBanner={hasBanner && !disableBanners}
                bannerBackgroundColor={bannerBackgroundColor}
                bannerFontColor={bannerFontColor}
                bannerIcon={bannerIcon}
                bannerDescription={bannerDescription}
                showBadge={!!(fromDexter || showCardBadges)}
                badgeText={badgeText}
                showVideoButton
                videoURL={videoURL}
                videoURLToUse={videoURLToUse}
                gateVideo={gateVideo}
                title={title}
                onFocus={onFocus}
                tabIndex={tabIndex}
                videoButtonClassName={`consonant-Card-videoIco ${useCenterVideoPlay ? 'center' : ''}`}
                showLogo={!!logoSrc}
                logoSrc={logoSrc}
                logoAlt={logoAlt || ''}
                logoBg={logoBg}
                logoBorderBg={logoBorderBg}
                showIconLogo={false} />}

            <div className="consonant-Card-content">
                <CardContent
                    showLabel
                    detailText={showDetails && !showProductName ? detailText : ''}
                    productInfo={showDetails && productInfo && productInfo.tagID && productInfo.title ? productInfo : null}
                    showIconAlt={false}
                    isTitleOnly={false}
                    showTitle={showTitle}
                    highlightedTitle={highlightedTitle}
                    title={showTitle ? title : ''}
                    headingAria={headingAria}
                    headingLevel={headingLevel}
                    parseMarkDown={parseMarkDown}
                    showText
                    highlightedDescription={highlightedDescription}
                    description={showDescription ? description : ''} />
                {!hideCTA && showFooter &&
                footer.map(footerItem => (
                    <CardFooter
                        divider={renderDivider || footerItem.divider}
                        isFluid={footerItem.isFluid}
                        key={cuid()}
                        left={!hideOnDemandDates ? extendFooterData(footerItem.left) : []}
                        center={!altCtaUsed ? extendFooterData(footerItem.center) : []}
                        right={extendFooterData(footerItem.right)}
                        altRight={altCtaUsed ? extendFooterData(footerItem.altCta) : []}
                        cardDate={new Date(cardDate)}
                        startDate={startDate}
                        endDate={endDate}
                        cardStyle="flex-card"
                        onFocus={onFocus}
                        title={title}
                        tabIndex={tabIndex}
                        renderOverlay={renderOverlay}
                        hideCTA={hideCTA}
                        isBlog={false} />
                ))}
            </div>
            {(renderOverlay || hideCTA) &&
            <LinkBlocker
                target={linkBlockerTarget}
                link={overlay}
                title={title}
                getsFocus
                ariaHidden={ariaHidden}
                tabIndex={ariaHidden ? -1 : 0}
                daa={ctaText} />}
        </li>
    );
};

export default FlexCard;
