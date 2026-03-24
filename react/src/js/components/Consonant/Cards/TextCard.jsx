import React from 'react';
import cuid from 'cuid';
import { useCardData } from './CardContext';
import CardHeader from './CardHeader/CardHeader';
import CardContent from './CardContent/CardContent';
import CardFooter from './CardFooter/CardFooter';
import LinkBlocker from './LinkBlocker/LinkBlocker';

const TextCard = () => {
    const {
        id, lh, cardClassName,
        optimizedImage, altText,
        hasBanner, disableBanners,
        bannerBackgroundColor, bannerFontColor, bannerIcon, bannerDescription,
        logoSrc, logoBg, logoBorderBg, image,
        highlightedTitle, title, headingAria, headingLevel,
        highlightedDescription, description,
        parseMarkDown,
        footer, renderDivider, cardDate, startDate, endDate,
        extendFooterData, altCtaUsed, hideOnDemandDates,
        linkBlockerTarget, overlay, ctaText,
        onFocus, tabIndex, ariaHidden,
        renderOverlay, hideCTA,
    } = useCardData();

    return (
        <li
            daa-lh={lh}
            className={`text-card ${cardClassName}`}
            data-testid="consonant-Card"
            id={id}>
            <CardHeader
                image={optimizedImage}
                altText={altText}
                isIcon={false}
                showBanner={hasBanner && !disableBanners}
                bannerBackgroundColor={bannerBackgroundColor}
                bannerFontColor={bannerFontColor}
                bannerIcon={bannerIcon}
                bannerDescription={bannerDescription}
                showBadge={false}
                showVideoButton={false}
                showLogo={!!(logoSrc || image)}
                logoSrc={image || logoSrc}
                logoAlt=""
                logoBg={logoBg}
                logoBorderBg={logoBorderBg}
                showIconLogo={false} />
            <div className="consonant-Card-content">
                <CardContent
                    showLabel={false}
                    showIconAlt={false}
                    isTitleOnly={false}
                    highlightedTitle={highlightedTitle}
                    title={title}
                    headingAria={headingAria}
                    headingLevel={headingLevel}
                    parseMarkDown={parseMarkDown}
                    showText
                    highlightedDescription={highlightedDescription}
                    description={description} />
                {!hideCTA &&
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
                        cardStyle="text-card"
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

export default TextCard;
