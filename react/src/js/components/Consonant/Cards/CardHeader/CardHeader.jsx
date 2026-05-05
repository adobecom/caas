/**
 * Card Header
 * Generates the header section of the card. it may include any combination of these elements:
 * - Image
 * - Banner
 * - Badge
 * - Video Button
 * - Logo
 * - Icon Logo
 */

import React from 'react';
import { string, bool, func, number } from 'prop-types';
import VideoButton from '../../Modal/videoButton';

const CardHeader = ({
    image,
    altText,
    isIcon,
    showBanner,
    bannerBackgroundColor,
    bannerFontColor,
    bannerIcon,
    bannerDescription,
    showBadge,
    badgeText,
    showVideoButton,
    videoURL,
    videoURLToUse,
    gateVideo,
    title,
    onFocus,
    tabIndex,
    videoButtonClassName,
    showLogo,
    logoSrc,
    logoAlt,
    logoBg,
    logoBorderBg,
    showIconLogo,
    cardIcon,
}) => (
    <div
        data-testid="consonant-Card-header"
        className="consonant-Card-header"
        style={{ backgroundImage: `url("${image}")` }}
        role={(!isIcon && altText) ? 'img' : ''}
        aria-label={!isIcon ? altText : ''}>
        {showBanner &&
        <span
            data-testid="consonant-Card-banner"
            className="consonant-Card-banner"
            style={({
                backgroundColor: bannerBackgroundColor,
                color: bannerFontColor,
            })}>
            {bannerIcon &&
                <div
                    className="consonant-Card-bannerIconWrapper">
                    <img
                        alt=""
                        loading="lazy"
                        src={bannerIcon}
                        data-testid="consonant-Card-bannerImg" />
                </div>
            }
            <span>{bannerDescription}</span>
        </span>
        }
        {showBadge && badgeText &&
        <span
            className="consonant-Card-badge">
            {badgeText}
        </span>
        }
        {showVideoButton && videoURL &&
        <VideoButton
            title={title}
            videoURL={videoURLToUse}
            gateVideo={gateVideo}
            onFocus={onFocus}
            tabIndex={tabIndex}
            className={videoButtonClassName} />
        }
        {showLogo &&
        <div
            style={({
                backgroundColor: logoBg,
                borderColor: logoBorderBg,
            })}
            data-testid="consonant-Card-logo"
            className="consonant-Card-logo">
            <img
                src={logoSrc}
                alt={logoAlt}
                loading="lazy"
                width="32" />
        </div>
        }
        {showIconLogo &&
        <div
            data-testid="consonant-Card-logo"
            className="consonant-Card-logo">
            <img
                src={cardIcon}
                alt=""
                loading="lazy"
                width="32"
                data-testid="consonant-Card-logoImg" />
        </div>
        }
    </div>
);

CardHeader.propTypes = {
    image: string,
    altText: string,
    isIcon: bool,
    showBanner: bool,
    bannerBackgroundColor: string,
    bannerFontColor: string,
    bannerIcon: string,
    bannerDescription: string,
    showBadge: bool,
    badgeText: string,
    showVideoButton: bool,
    videoURL: string,
    videoURLToUse: string,
    gateVideo: bool,
    title: string,
    onFocus: func,
    tabIndex: number,
    videoButtonClassName: string,
    showLogo: bool,
    logoSrc: string,
    logoAlt: string,
    logoBg: string,
    logoBorderBg: string,
    showIconLogo: bool,
    cardIcon: string,
};

CardHeader.defaultProps = {
    image: '',
    altText: '',
    isIcon: false,
    showBanner: false,
    bannerBackgroundColor: '',
    bannerFontColor: '',
    bannerIcon: '',
    bannerDescription: '',
    showBadge: false,
    badgeText: '',
    showVideoButton: false,
    videoURL: '',
    videoURLToUse: '',
    gateVideo: false,
    title: '',
    onFocus: undefined,
    tabIndex: 0,
    videoButtonClassName: '',
    showLogo: false,
    logoSrc: '',
    logoAlt: '',
    logoBg: '',
    logoBorderBg: '',
    showIconLogo: false,
    cardIcon: '',
};

export default CardHeader;
