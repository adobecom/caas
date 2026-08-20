/**
 * @func scroller
 * @desc Uses an incremental requestAnimationFrame pattern to make smooth
 scroll animations
 * @param {HTMLElement} scrollElement item to be scrolled
 * @param {Number} newPosition amount by which to scroll scrollElement
 * @oaram {Object}
 {
            @attribute {String} attribute - HTMLElement attribute to effect
            @attribute {Function} callback - Optional callback Function
            @attribute {Number} duration - Duration of scroll
        }
 */

export default function scroller(
    scrollElement = {},
    newPosition = 0,
    {
        attribute = 'scrollLeft',
        callback,
        duration = 300,
    } = {},
) {
    const currentPosition = scrollElement[attribute] || 0;
    const stepSize = ((newPosition - currentPosition) / duration) * 60;
    const isFinalPosition = stepSize > 0 ?
        (scrollValue, position) => scrollValue >= position :
        (scrollValue, position) => scrollValue <= position;

    function stepper() {
        const curScrollVal = scrollElement[attribute] || 0;
        const newScrollValue = curScrollVal + stepSize;

        if (isFinalPosition(newScrollValue, newPosition)) {
            scrollElement[attribute] = newPosition;
            if (typeof callback === 'function') return callback();
        } else {
            scrollElement[attribute] = newScrollValue;
            window.requestAnimationFrame(stepper);
        }
        return true;
    }

    if (newPosition !== scrollElement[attribute]) {
        window.requestAnimationFrame(stepper);
    }
}
