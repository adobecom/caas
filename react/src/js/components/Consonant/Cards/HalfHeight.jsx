import React from 'react';
import CardHeader from './CardHeader/CardHeader';
import CardContent from './CardContent/CardContent';
import VideoButton from '../Modal/videoButton';
import LinkBlocker from './LinkBlocker/LinkBlocker';

const HalfHeight = ({
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
    showCardBadges,
    videoURL,
    videoURLToUse,
    gateVideo,
    logoSrc,
    logoAlt,
    logoBg,
    logoBorderBg,
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
        className={`half-height ${cardClassName}`}
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
            showLogo={!!(showCardBadges && logoSrc)}
            logoSrc={logoSrc}
            logoAlt={logoAlt || ''}
            logoBg={logoBg}
            logoBorderBg={logoBorderBg}
            showIconLogo={false} />
        <div className="consonant-Card-content">
            {videoURL &&
            <VideoButton
                title={title}
                videoURL={videoURLToUse}
                gateVideo={gateVideo}
                onFocus={onFocus}
                tabIndex={tabIndex}
                className="consonant-Card-videoIco" />
            }
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

export default HalfHeight;
