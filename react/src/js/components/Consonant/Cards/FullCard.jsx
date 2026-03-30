import React from 'react';
import { useCardData } from './CardContext';
import CardHeader from './CardHeader/CardHeader';
import CardContent from './CardContent/CardContent';
import LinkBlocker from './LinkBlocker/LinkBlocker';

const FullCard = () => {
    const {
        id, lh, cardClassName,
        optimizedImage, altText,
        hasBanner, disableBanners,
        bannerBackgroundColor, bannerFontColor, bannerIcon, bannerDescription,
        badgeText, fromDexter, showCardBadges,
        videoURL, videoURLToUse, gateVideo, useCenterVideoPlay,
        logoSrc, logoAlt, logoBg, logoBorderBg,
        detailText,
        highlightedTitle, title, headingAria, headingLevel,
        parseMarkDown,
        linkBlockerTarget, overlay, ctaText,
        onFocus, tabIndex, ariaHidden,
        renderOverlay, hideCTA,
    } = useCardData();

    return (
        <li
            daa-lh={lh}
            className={`full-card ${cardClassName}`}
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
                {!renderOverlay &&
                <LinkBlocker
                    target={linkBlockerTarget}
                    link={overlay}
                    title={title}
                    getsFocus
                    daa={ctaText} />}
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

export default FullCard;
