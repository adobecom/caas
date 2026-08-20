import { isAuthor } from './@dexter/environment';
import Debug from './@dexter/debug';
import isVisible from './@dexter/isVisible';
import breakpoints from './@dexter/breakpoints';
import throttle from './throttle';
import { logLana } from '../Helpers/lana';

const THROTTLE_TIME = 300;
const VIDEO_VIEW_SELECTOR = '.video-Wrapper.has-playOnView video';
const VIDEO_HOVER_SELECTOR = '.video-Wrapper.has-playOnHover video';

const debug = new Debug({ debug: false, control: 'BackgroundVideo' });

/**
 * Determine if HTMLMediaElement is playing.
 * @param {HTMLMediaElement} video
 */
const isPlaying = video =>
    !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);

const getParentContainer = video =>
    video.closest('.dexter-FlexContainer') || video.closest('.dexter-Position');

const playVideo = (video) => {
    const promise = video.play();
    return promise && promise.then(() => {
        debug.log('Video starts playing successfully');
    }).catch(() => {
        logLana({ message: 'error while playing a video', tags: 'backgroundVideo' });
        debug.log('Error while playing video');
    });
};

/**
 * Set the state of the video to play or pause.
 * @param {HTMLMediaElement} video
 */
const setViewVideoState = (video) => {
    if (isVisible(video) && !isPlaying(video) && !video.ended) {
        if (video.getAttribute('preload') === 'none') {
            video.setAttribute('preload', 'metadata');
        }
        if (!video.classList.contains('play-Onclick')) {
            playVideo(video);
        }
    } else if (!isVisible(video) && isPlaying(video)) {
        video.pause();
    }
};

const setHoverVideoState = (video) => {
    const parent = getParentContainer(video);

    parent.addEventListener('mouseover', () => {
        if (isVisible(video) && !isPlaying(video) && !video.ended) {
            playVideo(video);
        }
    });
    parent.addEventListener('mouseout', () => {
        if (isPlaying(video)) {
            video.pause();
        }
    });
};

/**
 * If we have videos, loop through them and set their state.
 * @param {NodeList} videos
 */
const setVideoStates = (opts) => {
    const { videos, callback } = opts;
    if (videos) {
        videos.forEach((video) => {
            callback(video);
        });
    }
};

/**
 * @method mediaWatcher
 * @desc MediaMatch handler will be fired if mediaMatch changes
 *
 * @param e {Object}
 * @param opts {Object}
 */
const mediaWatcher = (e, opts) => {
    if (e.matches) {
        setVideoStates(opts);
    }
};

/**
 * @method enableResponsiveEvent
 * @desc Enables Responsive behaviour for background video
 *
 * @param opts {Object}
 */
const enableResponsiveEvent = (opts) => {
    Object.keys(breakpoints.mediaExpression).forEach((surface) => {
        const surfacePoint = window.matchMedia(breakpoints.mediaExpression[surface]);
        surfacePoint.addListener(e => mediaWatcher(e, opts));
    });
};

const initViewVideos = (parentElement, setScroll) => {
    const selector = parentElement instanceof HTMLDocument ? `.root ${VIDEO_VIEW_SELECTOR}` : VIDEO_VIEW_SELECTOR;
    const videos = parentElement.querySelectorAll(selector);
    if (videos.length > 0) {
        setVideoStates({ videos, callback: setViewVideoState });
        enableResponsiveEvent({ videos, callback: setViewVideoState });
        if (setScroll) {
            window.addEventListener('scroll', throttle(THROTTLE_TIME, setVideoStates, { videos, callback: setViewVideoState }));
        }
    }
};

const initHoverVideos = (parentElement) => {
    const videos = parentElement.querySelectorAll(VIDEO_HOVER_SELECTOR);
    if (videos.length > 0) {
        setVideoStates({ videos, callback: setHoverVideoState });
    }
};

/**
 * Initialize background videos.
 * @param {HTMLElement} parentElement
 * @param {Boolean} setScroll
 */
const initBackgroundVideos = (parentElement = document, setScroll = false) => {
    // Don't play videos in author.
    if (!isAuthor()) {
        // If the element is document, search root to prevent modal videos from being iterated on.
        initViewVideos(parentElement, setScroll);
        initHoverVideos(parentElement);
    }
};

export default initBackgroundVideos;
