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

function CardsCarousel({
    cards,
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
    if (cardsUp.includes('2up')) {
        cardWidth = 500;
        cardsShiftedPerClick = 1;
    } else if (cardsUp.includes('3up')) {
        cardWidth = 378;
        cardsShiftedPerClick = 1;
    } else if (cardsUp.includes('4up')) {
        cardWidth = 276;
        cardsShiftedPerClick = 4;
    } else if (cardsUp.includes('5up')) {
        cardWidth = 228;
        cardsShiftedPerClick = 4;
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

    function shouldHidePrevButton() {
        const carousel = carouselRef.current;
        const atStartOfCarousel = (carousel.scrollLeft < cardWidth);
        if (atStartOfCarousel) {
            hidePrevButton();
        }
    }

    function shouldHideNextButton() {
        const carousel = carouselRef.current;
        const atEndOfCarousel =
            (carousel.scrollWidth - carousel.clientWidth < carousel.scrollLeft + cardWidth);
        if (atEndOfCarousel) {
            hideNextButton();
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

    function nextButtonClick() {
        if (isResponsive()) {
            centerClick();
        } else {
            const carousel = carouselRef.current;
            carousel.scrollLeft += ((cardWidth + gridGap) * cardsShiftedPerClick);
            shouldHideNextButton();
        }
    }

    function prevButtonClick() {
        if (isResponsive()) {
            centerClick();
        } else {
            const carousel = carouselRef.current;
            carousel.scrollLeft -= ((cardWidth + gridGap) * cardsShiftedPerClick);
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
            <div
                className="consonant-Container--carousel"
                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}
                onMouseMove={mouseMoveHandler}
                onMouseLeave={mouseLeaveHandler}
                onScroll={scrollHandler}
                role="tab"
                tabIndex={-1}
                ref={carouselRef}>
                <Grid
                    cards={cards}
                    containerType="carousel"
                    resultsPerPage={cardsPerPage}
                    onCardBookmark={onCardBookmark}
                    pages={pages} />
            </div>
        </Fragment>
    );
}

export default CardsCarousel;


CardsCarousel.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCardBookmark: PropTypes.func.isRequired,
    resQty: PropTypes.number.isRequired,
};
