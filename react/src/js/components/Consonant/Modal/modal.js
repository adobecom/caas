/* eslint-disable */
import { isAuthor } from './@dexter/environment';
import Video from './video';
import Iframe from './iframe';
import findBackgroundVideos from './backgroundVideo';
import SendLink from './SendLink';
import { focusActiveModal, getActiveModalEl } from './modalFocus';

const BG_COLOR_STYLE = 'background-color';
const DATA_REMEMBER_CLOSE_ACTION = 'data-remember-close-action';
const DISPLAY_TYPE_HASH_CHANGE = 'onHashChange';
const DISPLAY_TYPE_PAGE_LOAD = 'onPageLoad';
const IS_OPEN = 'is-Open';
const LOCALE_MODAL_ID = 'localeModal';
const STICKY_BOTTOM_PRESET = 'stickybottom';

const hasInlineBgColorStyle = el => !!el.style.getPropertyValue(BG_COLOR_STYLE);
const urlNoHash = () => window.location.href.replace(window.location.hash, '');

/**
 * Convert the given element to a Modal.
 *
 * @param {Element} element will be converted
 * @param {object} [callbacks={}] An optional object that contains callback functions for
 *  some modal behavior.  The supported callbacks are:
 *   {
 *      close: Called when the modal is closed by any means
 *      buttonClose: Called when the modal close (X) button is clicked
 *      escClose: Called when the esc button is used to close the modal
 *      onOpen: Called when the modal is opened
 *      overlayClose: Called when the modal is closed by clicking on the overlay
 *   }
 * @param {boolean} resetHashOnClose Reset URL hash, false to skip.
 * (e.g: when closing locale modal).
 */
export default class Modal {
    constructor(element, callbacks = {}) {
        this.callbacks = callbacks;
        this.element = element;
        if (this.isHashChangeModal() || hasInlineBgColorStyle(element.parentElement)) {
            element.parentElement.enableFocusTrap = true;
            this.getOverlay();
            this.setupOverlayClick();
        }
        this.isLocaleModal = this.element.id === LOCALE_MODAL_ID;
        // Always get a close button
        this.setupCloseClick();
        if (this.isPageLoadModal()) {
            this.pageLoadDisplayed = false;
        }
        if (!isAuthor() && this.isStickyBottom()) {
            this.setupFooterObserver();
        }
    }

    isCloseEnabledRepeatUser() {
        const repeatUser = window.localStorage.getItem(this.getUserStorageValue());
        return this.closeButton.hasAttribute(DATA_REMEMBER_CLOSE_ACTION) && JSON.parse(repeatUser);
    }

    isPageLoadModal() {
        return this.getDisplayType() === DISPLAY_TYPE_PAGE_LOAD;
    }

    isHashChangeModal() {
        return this.getDisplayType() === DISPLAY_TYPE_HASH_CHANGE;
    }

    isStickyBottom() {
        if (this.getPresetValue()) {
            return this.getPresetValue().toLowerCase().includes(STICKY_BOTTOM_PRESET);
        }
        return false;
    }

    getDisplayType() {
        if (this.element.parentElement) {
            return this.element.parentElement.dataset.confDisplay;
        }
        return {};
    }

    getId() {
        return this.element.id;
    }

    getDelay() {
        const delay = this.element.parentElement.dataset.confDelay;
        return parseInt(delay, 10);
    }

    getPageName() {
        return this.element.parentElement.dataset.pageName;
    }

    getPresetValue() {
        return this.element.parentElement.dataset.confPreset;
    }

    getUserStorageValue() {
        // creating the localstorage key in the format : modalId_pageName,
        // unless a custom name is set by authors
        const pageName = this.getPageName();
        const customStorageName = this.closeButton.dataset.rememberCloseName;
        return customStorageName || this.getId().concat('_', pageName);
    }

    setupCloseClick() {
        this.closeButton = this.element.querySelector('.dexter-CloseButton');
        const closeButtonHandler = (event) => {
            event.stopPropagation();
            event.preventDefault();
            if (this.closeButton.hasAttribute(DATA_REMEMBER_CLOSE_ACTION)) {
                // setting the userVisited to true
                window.localStorage.setItem(this.getUserStorageValue(), true);
            }
            if (typeof this.callbacks.buttonClose === 'function') this.callbacks.buttonClose();
            this.close();
        };
        this.closeButton.addEventListener('click', closeButtonHandler);

        // set up to allow the space key to activate the modal close button
        const onKeyDown = (event) => {
            let isSpace = false;
            if ('key' in event) {
                isSpace = (event.code === 'Space');
            } else {
                isSpace = (event.keyCode === 32);
            }
            if (isSpace) {
                closeButtonHandler(event);
            }
        };
        this.closeButton.addEventListener('keydown', onKeyDown);
    }

    sendCloseAnalytics() {
        /* eslint-disable no-underscore-dangle */
        if (window.digitalData && window._satellite) {
            window.digitalData._set('primaryEvent.eventInfo.eventName', window.digitalData._get('digitalData.page.pageInfo.pageName').concat(':tryFreeCloseClick', this.getId()));
            window._satellite.track('event', {
                digitalData: window.digitalData._snapshot(),
            });
        }
        /* eslint-enable no-underscore-dangle */
    }

    getOverlay() {
        this.modalOverlay = this.element.parentElement;
    }

    getIframes() {
        if (!this.iframes || this.iframes.length === 0) {
            const iframeElements = this.element.querySelectorAll('.frame-container iframe');
            this.iframes = Array.from(iframeElements, element => new Iframe(element));
        }
    }

    getSendLink() {
        if (!this.sendLink || this.sendLink.length === 0) {
            const sendLinkElement = this.element.querySelector('.sendLink');
            if (sendLinkElement) {
                this.sendLink = new SendLink(sendLinkElement);
            }
        }
    }

    setupFooterObserver() {
        const footer = document.querySelector('.globalNavFooter');
        if (!footer) {
            return;
        }
        this.isIntersecting = false;
        const rootParent = this.element.closest('.modal');
        const onIntersect = () => {
            const anchor = document.body.clientHeight - window.innerHeight -
                footer.clientHeight;
            rootParent.classList.add('stuck-above-footer');
            this.element.parentElement.style.top = `${anchor}px`;
            if (anchor < 0) {
                this.element.parentElement.style.bottom = `${Math.abs(anchor)}px`;
            }
        };
        const intersectHandler = ([entry]) => {
            if (entry.isIntersecting) {
                onIntersect();
                this.isIntersecting = true;
            } else {
                rootParent.classList.remove('stuck-above-footer');
                this.element.parentElement.style.top = '';
                this.element.parentElement.style.bottom = '';
                this.isIntersecting = false;
            }
        };
        const observer = new IntersectionObserver(intersectHandler);
        this.callbacks.onOpen = () => {
            footer.style.marginTop = `${this.element.clientHeight}px`;
            if (this.isIntersecting) onIntersect();
        };
        window.addEventListener('resize', () => {
            if (this.isIntersecting) onIntersect();
        });
        document.querySelector('#languageNavigation').addEventListener('modalClose', () => {
            if (this.isIntersecting) requestAnimationFrame(onIntersect);
        });
        observer.observe(footer);
    }

    setupOverlayClick() {
        if (this.isPageLoadModal()) {
            this.modalOverlay.style.pointerEvents = 'auto';
        }
        const overlayHandler = (event) => {
            if (event.target.classList.contains('dexter-Modal_overlay')) {
                event.stopPropagation();
                event.preventDefault();
                if (typeof this.callbacks.overlayClose === 'function') this.callbacks.overlayClose();
                this.close();
            }
        };
        this.modalOverlay.addEventListener('click', overlayHandler);
    }

    open(previousHashValue, focusState, isDeepLinked) {
        const openEvent = new Event('modalOpen');
        this.element.dispatchEvent(openEvent);

        this.openHistoryLength = window.history.length;

        this.isOpen = true;
        this.isDeepLinked = !!isDeepLinked;
        if (focusState) {
            this.focusState = focusState;
            this.focusState.modalOpen = true;
        }
        // saving the focused element before open
        this.lastScrollPosition = window.scrollY;
        this.previousHashValue = previousHashValue && previousHashValue.replace('#', '');
        if (this.modalOverlay) {
            this.modalOverlay.classList.add(IS_OPEN);
        }
        this.element.parentElement.classList.add(IS_OPEN);
        this.element.classList.add(IS_OPEN);
        this.getVideos();
        this.videos.forEach((video) => {
            video.setSrc();
        });
        this.getIframes();
        const focusIntoIframe = () => {
            const iframe = this.element.querySelector('iframe');
            if (iframe) {
                iframe.focus();
            }
        };
        this.iframes.forEach((iframe) => {
            iframe.element.onload = focusIntoIframe;
            iframe.setSrc();
        });
        this.getSendLink();
        if (this.sendLink) {
            this.sendLink.openView();
        }
        findBackgroundVideos(this.element, false);
        this.closeEscapeListener = this.setupCloseEscape();

        if (getActiveModalEl() === this.element.parentElement) {
            // if model is open behind another modal, skip focus change.
            focusActiveModal();
        }

        if (typeof this.callbacks.onOpen === 'function') this.callbacks.onOpen();
    }

    getVideos() {
        if (!this.videos || this.videos.length === 0) {
            const videoElements = this.element.querySelectorAll('.videoContainer iframe');
            this.videos = Array.from(videoElements, element => new Video(element));
        }
    }

    /**
     * Close the modal
     * @param {Object} options - Optional options
     * @param {string} options.modifyHistory - Defaults to `true`
     *     Note that this will only apply if this is not a page load modal
     */
    close({ modifyHistory = true } = {}) {
        const closeEvent = new Event('modalClose');
        this.element.dispatchEvent(closeEvent);

        if (this.focusState) {
            this.focusState.modalOpen = false;
        }
        if (this.closeEscapeListener) {
            this.closeEscapeListener();
            delete this.closeEscapeListener;
        }

        if (this.videos && this.videos.length) {
            this.videos.forEach((video) => {
                video.removeSrc();
            });
        }
        if (this.modalOverlay) {
            this.modalOverlay.classList.remove(IS_OPEN);
        }
        if (this.iframes && this.iframes.length) {
            this.iframes.forEach((iframe) => {
                iframe.removeSrc();
            });
        }
        this.element.classList.remove(IS_OPEN);

        this.resetFocus();
        if (typeof this.callbacks.close === 'function') this.callbacks.close();
        this.isOpen = false;

        if (this.isPageLoadModal()) {
            // Page load modals do not have any href/history modifications done
            focusActiveModal();
            return;
        }
        if (!this.isLocaleModal) {
            if (this.isDeepLinked) {
                // Deeplink modals are kept in history
                window.location.hash = '';
                focusActiveModal(); // if there is any other open modal.
                return;
            }

            const currentHash = window.location.hash;

            if (this.previousHashValue && this.previousHashValue !== this.getId()) {
                window.history.replaceState(null, null, `${urlNoHash()}#${this.previousHashValue}`);
            } else {
                window.history.replaceState(null, null, urlNoHash());
            }
            if (modifyHistory && currentHash !== this.deepLinkedModalId) {
                // This accounts for Safari where opening iFrames adds history entries
                // for every iFrame opened.
                const goBackCount = (window.history.length - this.openHistoryLength) + 1;
                window.history.go(-goBackCount);
            }
        }
        focusActiveModal(); // if there is any other open modal.
        // analytics for modal close button
        this.sendCloseAnalytics();
    }

    resetFocus() {
        try {
            window.scrollTo(0, this.lastScrollPosition);
            this.focusState.lastFocusedElement.focus();
        } catch (e) {
            // prevent console error
        }
    }

    setupCloseEscape() {
        const onKeyDown = (event) => {
            let isEscape = false;
            if ('key' in event) {
                isEscape = (event.key === 'Escape' || event.key === 'Esc');
            } else {
                isEscape = (event.keyCode === 27);
            }
            if (isEscape) {
                if (typeof this.callbacks.escClose === 'function') this.callbacks.escClose();
                document.removeEventListener('keydown', onKeyDown);
                this.close();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }
}
