import React from 'react';
import CardHeader from './CardHeader/CardHeader';
import CardContent from './CardContent/CardContent';
import LinkBlocker from './LinkBlocker/LinkBlocker';

const HorizontalCard = ({
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
    parseMarkDown,
    linkBlockerTarget,
    overlay,
    ctaText,
    onFocus,
    tabIndex,
    ariaHidden,
}) => (
    <li
        daa-lh={lh}
        className={`horizontal-card ${cardClassName}`}
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
                isTitleOnly
                highlightedTitle={highlightedTitle}
                title={title}
                headingAria={headingAria}
                headingLevel={headingLevel}
                parseMarkDown={parseMarkDown}
                showText={false} />
        </div>
        <LinkBlocker
            target={linkBlockerTarget}
            link={overlay}
            title={title}
            getsFocus
            ariaHidden={ariaHidden}
            tabIndex={ariaHidden ? -1 : 0}
            daa={ctaText} />
    </li>
);

export default HorizontalCard;
