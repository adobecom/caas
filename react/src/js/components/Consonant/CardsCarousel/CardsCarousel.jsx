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
 * @param {string} size - The size of the card based on the layout.
 * @param {number} gap - The gap between the cards.
 * @returns {number} - The width of the card.
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
    return cardWidths[size] ? cardWidths[size][`${gap}px`] : 0;
}

function CardsCarousel({
    cards,
    cardStyle,
    onCardBookmark,
    resQty,
} = {}) {
    const getConfig = useConfig();
    const cardsUp = getConfig('collection', 'layout.type');
    const gridGap = parseInt(getConfig('collection', 'layout.gutter'), 10) * 8;
    const title = getConfig('collection', 'i18n.title');
    const showTotalResults = getConfig('collection', 'showTotalResults');
    const showTotalResultsText = getConfig('collection', 'i18n.totalResultsText');
    const useLightText = getConfig('collection', 'useLightText');
    const isIncremental = getConfig('pagination', 'animationStyle') === 'incremental';
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

    let isDown = null;
    let startX = null;
    /* eslint-disable-next-line no-unused-vars */
    let isMouseMove = false;
    let interactedWith = false;

    let firstVisibleCard = 1;
    let lastVisibleCard = firstVisibleCard + cardsPerPage - 1;

    function isResponsive() {
        return window.innerWidth < TABLET_BREAKPOINT;
    }

    function hideNextButton() {
        const nextBtn = next.current;
        if (nextBtn) {
            nextBtn.classList.add('hide');
        }
    }

    function hidePrevButton() {
        const prevBtn = prev.current;
        if (prevBtn) prevBtn.classList.add('hide');
    }

    function showNextButton() {
        const nextBtn = next.current;
        if (nextBtn) nextBtn.classList.remove('hide');
    }

    function showPrevButton() {
        const prevBtn = prev.current;
        if (prevBtn) prevBtn.classList.remove('hide');
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
        const carousel = carouselRef.current;
        const atStartOfCarousel = (carousel.scrollLeft < cardWidth);
        if (atStartOfCarousel) {
            hidePrevButton();
            setFocusNextBtn();
        }
    }

    function shouldHideNextButton() {
        const carousel = carouselRef.current;
        const atEndOfCarousel =
            (carousel.scrollWidth - carousel.clientWidth < carousel.scrollLeft + cardWidth);
        if (atEndOfCarousel) {
            hideNextButton();
            setFocusPrevBtn();
        }
    }

    function responsiveLogic() {
        if (isResponsive() && interactedWith) {
            hideNav();
        } else {
            showNav();
            shouldHidePrevButton();
            shouldHideNextButton();
        }
    }

    function mouseDownHandler(e) {
        e.preventDefault();
        interactedWith = true;
        responsiveLogic();
        isDown = true;
        startX = e.pageX;
    }

    function mouseUpHandler() {
        isDown = false;
        isMouseMove = false;
    }

    function mouseLeaveHandler() {
        isDown = false;
        isMouseMove = false;
    }

    function mouseMoveHandler(e) {
        if (!isDown) return;
        isMouseMove = true;
        const carousel = carouselRef.current;
        const x = e.pageX - carousel.offsetLeft;
        carousel.scrollLeft -= (x - startX);
    }

    function scrollHandler() {
        interactedWith = true;
        responsiveLogic();
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
            const cardLink = shouldRenderOverlay
                ? card.querySelector('.consonant-LinkBlocker')
                : card.querySelector('.consonant-BtnInfobit');

            if (!cardLink) return;

            if (index + 1 >= firstVisibleCard && index + 1 <= lastVisibleCard) {
                cardLink.removeAttribute('aria-hidden');
                cardLink.removeAttribute('inert');
                cardLink.setAttribute('tabindex', '0');
            } else {
                cardLink.setAttribute('aria-hidden', 'true');
                cardLink.setAttribute('inert', '');
                cardLink.setAttribute('tabindex', '-1');
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
        if (isResponsive()) {
            centerClick();
        } else {
            const carousel = carouselRef.current;
            carousel.scrollLeft += ((cardWidth + gridGap) * cardsShiftedPerClick);
            setVisibleCards('next');
            setAriaAttributes(carousel);
            shouldHideNextButton();
        }
    }

    function prevButtonClick() {
        if (isResponsive()) {
            centerClick();
        } else {
            const carousel = carouselRef.current;
            carousel.scrollLeft -= ((cardWidth + gridGap) * cardsShiftedPerClick);
            setVisibleCards('prev');
            setAriaAttributes(carousel);
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
        responsiveLogic();

        const carousels = document.querySelectorAll('.consonant-Container--carousel');

        function handleKeyDown(e) {
            if (e.key === 'Tab') {
                carousels.forEach(carousel => carousel.parentElement.classList.add('tabbing'));
            }
        }

        function handleMouseDown() {
            carousels.forEach(carousel => carousel.parentElement.classList.remove('tabbing'));
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    return (
        <Fragment>
            <div className="consonant-Navigation--carousel">
                <button
                    aria-label="Previous button"
                    className="consonant-Button--previous"
                    onClick={prevButtonClick}
                    daa-ll="Previous"
                    daa-state="true"
                    name={PREV_BUTTON_NAME}
                    ref={prev}
                    type="button" />
                <button
                    aria-label="Next button"
                    className="consonant-Button--next"
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
                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}
                onMouseMove={mouseMoveHandler}
                onMouseLeave={mouseLeaveHandler}
                onScroll={scrollHandler}
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
};
