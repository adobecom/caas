// Utility functions for CardsCarousel component

/**
 * Hide navigation buttons utility functions
 * Used to improve test coverage for CardsCarousel component
 */

/**
 * Hides the previous button
 * @param {React.RefObject} prevRef - Reference to the previous button
 * @returns {void}
 */
export function hidePrevButton(prevRef) {
    const prevBtn = prevRef && prevRef.current;
    // eslint-disable-next-line no-unused-expressions
    prevBtn && prevBtn.classList.add('hide');
}

/**
 * Hides the next button
 * @param {React.RefObject} nextRef - Reference to the next button
 * @returns {void}
 */
export function hideNextButton(nextRef) {
    const nextBtn = nextRef && nextRef.current;
    // eslint-disable-next-line no-unused-expressions
    nextBtn && nextBtn.classList.add('hide');
}

/**
 * Hides both navigation buttons
 * @param {React.RefObject} prevRef - Reference to the previous button
 * @param {React.RefObject} nextRef - Reference to the next button
 * @returns {void}
 */
export function hideNav(prevRef, nextRef) {
    hidePrevButton(prevRef);
    hideNextButton(nextRef);
}

/**
 * Sets ARIA attributes for card links based on visibility
 * @param {Element} carousel - The carousel element
 * @param {number} firstVisibleCard - Index of the first visible card
 * @param {number} lastVisibleCard - Index of the last visible card
 * @param {boolean} renderOverlay - Whether to render overlay
 * @param {string} cardStyle - Card style
 * @returns {void}
 */
export function setAriaAttributes(carousel, firstVisibleCard, lastVisibleCard, renderOverlay, cardStyle) {
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