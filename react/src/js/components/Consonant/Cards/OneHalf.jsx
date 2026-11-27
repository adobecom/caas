import React from 'react';
import cuid from 'cuid';
import { useCardData } from './CardContext';
import { useConfig } from '../Helpers/hooks';
import { isC2Presentation } from '../Helpers/presentation';
import CardHeader from './CardHeader/CardHeader';
import CardContent from './CardContent/CardContent';
import CardFooter from './CardFooter/CardFooter';
import LinkBlocker from './LinkBlocker/LinkBlocker';

const OneHalf = () => {
    const {
        id, country, reference, lh, cardClassName,
        optimizedImage, altText, mnemonic,
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

    const getConfig = useConfig();
    const isC2 = isC2Presentation(getConfig('collection'));

    return (
        <li
            daa-lh={lh}
            className={`one-half ${cardClassName}`}
            data-testid="consonant-Card"
            id={id}
            {...(country && { 'data-country': country })}
            {...(reference && { 'data-card-url': reference })}>
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
                {isC2 && mnemonic && (
                    <img className="caas-c2-mnemonic" src={mnemonic} alt="" width="24" height="24" />
                )}
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
                        cardStyle="one-half"
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

export default OneHalf;
