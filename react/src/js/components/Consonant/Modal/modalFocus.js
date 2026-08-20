import * as focusTrap from 'focus-trap';
import getPropertySafely from './@dexter/getPropertySafely';

const NO_SCROLL = 'u-noScroll';
const OPEN_MODAL_SELECTOR = '.dexter-Modal_overlay.is-Open';
const CLOSE_BUTTON_CLASS = 'dexter-CloseButton';
const isDesktop =
    getPropertySafely(
        window,
        'dexter.personalization.technology.platform.type',
    ) === 'desktop';

const getActiveModalEl = () => {
    const topEl = document.elementFromPoint(0, 0);
    if (!topEl) return null;
    return topEl.closest(OPEN_MODAL_SELECTOR);
};

/* focus-trap works best as a singleton. This is to prevent scope collision
 * when the modal is imported from a consumer project.
 */
const getModalFocusTrap = () => {
    window.dexter = window.dexter || {};
    window.dexter.utils = window.dexter.utils || {};
    if (window.dexter.utils.modalFocusTrap) {
        return window.dexter.utils.modalFocusTrap;
    }
    window.dexter.utils.modalFocusTrap = focusTrap.createFocusTrap(
        OPEN_MODAL_SELECTOR,
        {
            escapeDeactivates: false,
            clickOutsideDeactivates: false,
            preventScroll: false,
            allowOutsideClick: true,
            onActivate: () => {
                if (isDesktop) {
                    document.body.classList.add(NO_SCROLL);
                }
                const activeModalEl = getActiveModalEl();
                const listener = () => {
                    activeModalEl.removeEventListener('focusin', listener);
                    if (
                        !document.activeElement ||
                        !document.activeElement.classList.contains(CLOSE_BUTTON_CLASS)
                    ) {
                        return;
                    }
                    // if the close button has the focus, that means the modal doesn't have any
                    // focusable element. Make the container focusable
                    // so that it can be scrolled with arrow keys.
                    const grid = activeModalEl.querySelector('.dexter-Modal > .aem-Grid');
                    if (grid) {
                        grid.tabIndex = '0';
                    }
                };
                activeModalEl.addEventListener('focusin', listener);
            },
            onDeactivate: () => {
                if (isDesktop) {
                    document.body.classList.remove(NO_SCROLL);
                }
            },
            fallbackFocus: document.body,
        },
    );
    return window.dexter.utils.modalFocusTrap;
};

const focusActiveModal = () => {
    const activeModalEl = getActiveModalEl();
    const modalFocusTrap = getModalFocusTrap();
    modalFocusTrap.deactivate();
    if (!activeModalEl || !activeModalEl.enableFocusTrap) return;
    modalFocusTrap.updateContainerElements(activeModalEl);
    modalFocusTrap.activate();
};

export { focusActiveModal, getActiveModalEl };
