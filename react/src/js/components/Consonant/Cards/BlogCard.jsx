import React from 'react';
import cuid from 'cuid';
import CardHeader from './CardHeader/CardHeader';
import CardContent from './CardContent/CardContent';
import CardFooter from './CardFooter/CardFooter';
import LinkBlocker from './LinkBlocker/LinkBlocker';

const BlogCard = ({
    id,
    lh,
    cardClassName,
    optimizedImage,
    altText,
    hasBanner,
    disableBanners,
    bannerBackgroundColor,
    bannerFontColor,
    bannerIcon,
    bannerDescription,
    videoURL,
    videoURLToUse,
    gateVideo,
    useCenterVideoPlay,
    detailText,
    highlightedTitle,
    title,
    headingAria,
    headingLevel,
    highlightedDescription,
    description,
    parseMarkDown,
    footer,
    renderDivider,
    cardDate,
    startDate,
    endDate,
    extendFooterData,
    altCtaUsed,
    hideOnDemandDates,
    linkBlockerTarget,
    overlay,
    ctaText,
    onFocus,
    tabIndex,
    ariaHidden,
    renderOverlay,
    hideCTA,
}) => (
    <li
        daa-lh={lh}
        className={`blog-card ${cardClassName}`}
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
            showVideoButton
            videoURL={videoURL}
            videoURLToUse={videoURLToUse}
            gateVideo={gateVideo}
            title={title}
            onFocus={onFocus}
            tabIndex={tabIndex}
            videoButtonClassName={`consonant-Card-videoIco ${useCenterVideoPlay ? 'center' : ''}`}
            showLogo={false}
            showIconLogo={false} />
        <div className="consonant-Card-content">
            <CardContent
                showLabel
                detailText={detailText}
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
            {footer.map(footerItem => (
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
                    cardStyle="blog-card"
                    onFocus={onFocus}
                    title={title}
                    tabIndex={tabIndex}
                    renderOverlay={renderOverlay}
                    hideCTA={hideCTA}
                    isBlog />
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

export default BlogCard;
