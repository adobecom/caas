/* eslint-disable */
/**
 * Determine if the element is in the viewport.
 * @param {HTMLElement} element
 */
const isVisible = function isVisible(element) {
    let _element$getBoundingC = element.getBoundingClientRect(),
        top = _element$getBoundingC.top,
        bottom = _element$getBoundingC.bottom;

    const vHeight = window.innerHeight || document.documentElement.clientHeight;
    return (top > 0 || bottom > 0) && top < vHeight;
};

export default isVisible;
