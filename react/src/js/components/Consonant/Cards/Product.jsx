import React from 'react';
import cuid from 'cuid';
import { useCardData } from './CardContext';
import CardContent from './CardContent/CardContent';
import CardFooter from './CardFooter/CardFooter';
import LinkBlocker from './LinkBlocker/LinkBlocker';

const Product = () => {
    const {
        id, lh, cardClassName,
        highlightedTitle, title, headingAria, headingLevel,
        highlightedDescription, description,
        parseMarkDown,
        footer, renderDivider, cardDate, startDate, endDate,
        extendFooterData, altCtaUsed,
        linkBlockerTarget, overlay, ctaText,
        onFocus, tabIndex, ariaHidden,
        renderOverlay, hideCTA,
    } = useCardData();

    return (
        <li
            daa-lh={lh}
            className={`product ${cardClassName}`}
            data-testid="consonant-Card"
            id={id}>
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
                        left={[]}
                        center={[]}
                        right={extendFooterData(footerItem.right)}
                        altRight={altCtaUsed ? extendFooterData(footerItem.altCta) : []}
                        cardDate={new Date(cardDate)}
                        startDate={startDate}
                        endDate={endDate}
                        cardStyle="product"
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

export default Product;
