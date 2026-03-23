import React from 'react';
import CardHeader from './CardHeader/CardHeader';
import CardContent from './CardContent/CardContent';
import LinkBlocker from './LinkBlocker/LinkBlocker';

const IconCard = ({
    id,
    lh,
    cardClassName,
    optimizedImage,
    altText,
    cardIcon,
    iconAlt,
    detailText,
    highlightedTitle,
    title,
    headingAria,
    headingLevel,
    parseMarkDown,
    linkBlockerTarget,
    overlay,
    ctaText,
    ariaHidden,
}) => (
    <li
        daa-lh={lh}
        className={`icon-card ${cardClassName}`}
        data-testid="consonant-Card"
        id={id}>
        <CardHeader
            image={optimizedImage}
            altText={altText}
            isIcon
            showBanner={false}
            showBadge={false}
            showVideoButton={false}
            showLogo={false}
            showIconLogo
            cardIcon={cardIcon} />
        <div className="consonant-Card-content">
            <CardContent
                showLabel
                detailText={detailText}
                showIconAlt
                iconAlt={iconAlt}
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

export default IconCard;
