/* eslint-disable react/jsx-no-bind,react/forbid-prop-types,react/jsx-no-bind */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useConfig } from '../Helpers/hooks';
import Grid from '../Grid/Grid';
import { RenderTotalResults } from '../Helpers/rendering';

const NEXT_BUTTON_NAME = 'next';
const PREV_BUTTON_NAME = 'previous';
const TABLET_BREAKPOINT = 1199;
let cardsShiftedPerClick = null;
let cardWidth = null;

/**
 * Gets the width of the card based on the size and gap.
 * @param {string} size - The layout type ('2up', '3up', '4up', or '5up').
 * @param {number} gap - The gutter gap (in px).
 * @returns {number} - The card width for that size+gap, or 0 if invalid.
 */
export function getCardWidth(size, gap) {
    const cardWidths = {
        '2up': {
            '8px': 579,
            '16px': 575,
            '24px': 571,
            '32px': 566,
        },
        '3up': {
            '8px': 394,
            '16px': 389,
            '24px': 384,
            '32px': 378,
        },
        '4up': {
            '8px': 294,
            '16px': 288,
            '24px': 282,
            '32px': 276,
        },
        '5up': {
            '8px': 226,
            '16px': 220,
            '24px': 214,
            '32px': 207,
        },
    };

    // Look up the map for this size; if none, return 0
    const sizeMap = cardWidths[size];
    if (!sizeMap) {
        return 0;
    }

    // Build the gap key and only return it if it actually exists
    const key = `${gap}px`;
    if (Object.prototype.hasOwnProperty.call(sizeMap, key)) {
        return sizeMap[key];
    }

    // Fallback when the gap isn't defined for this size
    return 0;
}

export function userIsTabbing() {
    return document.body.classList.contains('tabbing');
}

function CardsCarousel({
    cards,
    cardStyle,
    carouselType,
    onCardBookmark,
    resQty,
} = {}) {
    const getConfig = useConfig();
    const cardsUp = getConfig('collection', 'layout.type');
    const gridGap = parseInt(getConfig('collection', 'layout.gutter'), 10) * 8;
    const title = getConfig('collection', 'i18n.title');
    const showTotalResults = getConfig('collection', 'showTotalResults');
    const showTotalResultsText = getConfig('collection', 'i18n.totalResultsText');
    const nextCard = getConfig('collection', 'i18n.nextCards') || 'Next Cards';
    const prevCard = getConfig('collection', 'i18n.prevCards') || 'Previous Cards';
    const useLightText = getConfig('collection', 'useLightText');
    const isIncremental = getConfig('pagination', 'animationStyle').includes('incremental');
    const renderOverlay = getConfig('collection', 'useOverlayLinks');

    if (cardsUp.includes('2up')) {
        cardWidth = getCardWidth('2up', gridGap);
        cardsShiftedPerClick = isIncremental ? 1 : 2;
    } else if (cardsUp.includes('3up')) {
        cardWidth = getCardWidth('3up', gridGap);
        cardsShiftedPerClick = isIncremental ? 1 : 3;
    } else if (cardsUp.includes('4up')) {
        cardWidth = getCardWidth('4up', gridGap);
        cardsShiftedPerClick = isIncremental ? 1 : 4;
    } else if (cardsUp.includes('5up')) {
        cardWidth = getCardWidth('5up', gridGap);
        cardsShiftedPerClick = isIncremental ? 1 : 5;
    }
    const HeadingLevel = getConfig('collection', 'i18n.titleHeadingLevel');
    const cardsPerPage = parseInt(cardsUp, 10);
    const [pages] = useState(Number.POSITIVE_INFINITY);
    const carouselRef = useRef(null);
    const prev = useRef(null);
    const next = useRef(null);

    let firstVisibleCard = 1;
    let lastVisibleCard = firstVisibleCard + cardsPerPage - 1;

    function isMobile() {
        return window.innerWidth < TABLET_BREAKPOINT;
    }

    function hideNextButton() {
        const nextBtn = next.current;
        if (!nextBtn) return;

        if (carouselType === 'default') {
            nextBtn.classList.add('hide');
            nextBtn.setAttribute('aria-hidden', 'true');
        } else {
            nextBtn.setAttribute('disabled', 'true');
            nextBtn.setAttribute('aria-hidden', 'true');
            nextBtn.classList.add('disabled');
        }
    }

    function hidePrevButton() {
        const prevBtn = prev.current;
        if (prevBtn && carouselType === 'default') {
            prevBtn.classList.add('hide');
            prevBtn.setAttribute('aria-hidden', 'true');
        } else {
            prevBtn.setAttribute('disabled', 'true');
            prevBtn.setAttribute('aria-hidden', 'true');
            prevBtn.classList.add('disabled');
        }
    }

    function showNextButton() {
        const nextBtn = next.current;
        if (nextBtn && carouselType === 'default') {
            nextBtn.classList.remove('hide');
            nextBtn.setAttribute('aria-hidden', 'false');
        } else {
            nextBtn.removeAttribute('disabled');
            nextBtn.removeAttribute('aria-hidden');
            nextBtn.classList.remove('disabled');
        }
    }

    function showPrevButton() {
        const prevBtn = prev.current;
        if (prevBtn && carouselType === 'default') {
            prevBtn.classList.remove('hide');
            prevBtn.setAttribute('aria-hidden', 'false');
        } else {
            prevBtn.removeAttribute('disabled');
            prevBtn.removeAttribute('aria-hidden');
            prevBtn.classList.remove('disabled');
        }
    }

    function hideNav() {
        hidePrevButton();
        hideNextButton();
    }

    function showNav() {
        showPrevButton();
        showNextButton();
    }

    function setFocusPrevBtn() {
        const prevBtn = prev.current;
        if (prevBtn) prevBtn.focus();
    }

    function setFocusNextBtn() {
        const nextBtn = next.current;
        if (nextBtn) nextBtn.focus();
    }

    function shouldHidePrevButton() {
        if (firstVisibleCard === 1) {
            hidePrevButton();
            if (userIsTabbing()) {
                setFocusNextBtn();
            }
        }
    }

    function shouldHideNextButton() {
        const atEndOfCarousel = firstVisibleCard > cards.length - cardsPerPage;
        if (atEndOfCarousel) {
            hideNextButton();
            if (userIsTabbing()) {
                setFocusPrevBtn();
            }
        }
    }

    function mobileLogic() {
        if (isMobile()) {
            hideNav();
        } else {
            showNav();
            shouldHidePrevButton();
            shouldHideNextButton();
        }
    }

    /**
     * 620 = (tablet range) + average grid gap
     * 620 = 1200px - 600px + (8 + 32)/2
     */
    function centerClick() {
        const carousel = carouselRef.current;
        /* eslint-disable-next-line no-mixed-operators */
        carousel.scrollLeft += (-window.innerWidth / 2 + 620);
    }

    /**
     * Jira ticket: MWPW-164509
     * Sets the ARIA attributes for the cards based on their visibility.
     * @param {HTMLElement} carousel - The carousel element.
     */
    function setAriaAttributes(carousel) {
        const shouldRenderOverlay = renderOverlay || cardStyle === 'half-height';

        carousel.querySelectorAll('.consonant-Card').forEach((card, index) => {
            const cardLinks = card.querySelectorAll('a, button');

            if (!cardLinks.length) return;
            cardLinks.forEach((link) => {
                link.setAttribute('aria-hidden', 'true');
                link.setAttribute('tabindex', '-1');
            });

            if (index + 1 >= firstVisibleCard && index + 1 <= lastVisibleCard) {
                if (shouldRenderOverlay) {
                    const linkBlockers = card.querySelectorAll('.consonant-LinkBlocker');
                    linkBlockers.forEach((link) => {
                        link.removeAttribute('aria-hidden');
                        link.setAttribute('tabindex', '0');
                    });
                    const modalVideo = card.querySelector('.consonant-Card-videoIco');
                    if (modalVideo) {
                        modalVideo.removeAttribute('aria-hidden');
                        modalVideo.setAttribute('tabindex', '0');
                    }
                } else {
                    cardLinks.forEach((link) => {
                        link.removeAttribute('aria-hidden');
                        link.setAttribute('tabindex', '0');
                    });
                }
            }
        });
    }

    /**
     * Jira ticket: MWPW-164509
     * Sets first and last visible cards based on the navigation direction and pagination type.
     * @param {string} direction - The direction of the click.
     */
    function setVisibleCards(direction) {
        const incrementBy = isIncremental ? 1 : cardsPerPage;
        if (direction === 'next') {
            firstVisibleCard += incrementBy;
            lastVisibleCard += incrementBy;
        } else {
            firstVisibleCard -= incrementBy;
            lastVisibleCard -= incrementBy;
        }
    }

    function nextButtonClick() {
        if (isMobile()) {
            centerClick();
        } else {
            const carousel = carouselRef.current;
            carousel.scrollLeft += ((cardWidth + gridGap) * cardsShiftedPerClick);
            setVisibleCards('next');
            setAriaAttributes(carousel);
            showPrevButton();
            shouldHideNextButton();
        }
    }

    function prevButtonClick() {
        if (isMobile()) {
            centerClick();
        } else {
            const carousel = carouselRef.current;
            carousel.scrollLeft -= ((cardWidth + gridGap) * cardsShiftedPerClick);
            setVisibleCards('prev');
            setAriaAttributes(carousel);
            showNextButton();
            shouldHidePrevButton();
        }
    }

    const carouselTitleClass = classNames({
        'consonant-CarouselInfo-collectionTitle': true,
        'consonant-CarouselInfo-collectionTitle--withLightText': useLightText,
    });

    const carouselTotalResultsClass = classNames({
        'consonant-CarouselInfo-results': true,
        'consonant-CarouselInfo-results--withLightText': useLightText,
    });

    const totalResultsHtml = RenderTotalResults(showTotalResultsText, resQty);

    useEffect(() => {
        mobileLogic();
        setAriaAttributes(carouselRef.current);
    }, []);

    return (
        <Fragment>
            <div className="consonant-Navigation--carousel">
                <button
                    aria-label={prevCard}
                    aria-hidden="true"
                    className="consonant-Button--previous disabled"
                    onClick={prevButtonClick}
                    daa-ll="Previous"
                    daa-state="true"
                    name={PREV_BUTTON_NAME}
                    ref={prev}
                    type="button" />
                <button
                    aria-label={nextCard}
                    className="consonant-Button--next disabled"
                    daa-ll="Next"
                    daa-state="true"
                    onClick={nextButtonClick}
                    name={NEXT_BUTTON_NAME}
                    ref={next}
                    type="button" />
            </div>
            <div
                className="consonant-CarouselInfo">
                {title &&
                <HeadingLevel
                    data-testid="consonant-CarouselInfo-collectionTitle"
                    className={carouselTitleClass}>
                    {title}
                </HeadingLevel>
                }
                {showTotalResults &&
                <div
                    data-testid="consonant-CarouselInfo-results"
                    className={carouselTotalResultsClass}>
                    {totalResultsHtml}
                </div>
                }
            </div>
            {/* eslint-disable jsx-a11y/no-static-element-interactions */}
            <div
                className="consonant-Container--carousel"
                ref={carouselRef}>
                <Grid
                    cards={cards}
                    containerType="carousel"
                    resultsPerPage={cardsPerPage}
                    onCardBookmark={onCardBookmark}
                    pages={pages}
                    renderOverlay={renderOverlay} />
            </div>
            {/* eslint-enable jsx-a11y/no-static-element-interactions */}
        </Fragment>
    );
}

export default CardsCarousel;
CardsCarousel.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCardBookmark: PropTypes.func.isRequired,
    resQty: PropTypes.number.isRequired,
    cardStyle: PropTypes.string.isRequired,
    carouselType: PropTypes.string.isRequired,
};
