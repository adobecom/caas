import { hasTag } from './Helpers';
import { qs } from './general';

/* eslint-disable */
function fixSpaceInDate(date) {
    var time = 'T';
    var splitDate = date.split(' ');

    if (splitDate.length > 1) return '' + splitDate[0] + time + splitDate[1];
    return date;
}

function lcdDateFormat(date) {
    var tTimeDateFix = fixSpaceInDate(date);
    /* eslint-disable no-useless-escape */
    return tTimeDateFix.replace(/([+\-]\d\d)(\d\d)$/, '$1:$2');
    /* eslint-enable no-useless-escape */
}
/* eslint-enable */

// Utility
/**
 * @func convertDateStrToMs
 * @desc Converts Date String to MS
 *
 * @param {String} dateStr, valid date string to be converted
 * @returns {Number} convertDateStrToMs
 */
const convertDateStrToMs = (dateStr = '') => {
    if (!dateStr) return 0;

    return new Date(lcdDateFormat(dateStr)).getTime();
};
// TIMING OVERRIDES, mainly for QA, can also support Akamai time in future
/**
 * @func timeOverride
 * @desc Pass in an EPOCH based value in order to override Date.now
 *
 * @returns {Number} either MS from URL param or 0
 */
const timeOverride = () => {
    const {
        location: {
            search = '',
        } = {},
    } = window;
    const { servertime = '' } = qs.parse(search);

    return servertime ? parseInt(servertime, 10) : undefined;
};
/**
 * @func updateTimeOverride
 * @desc SIDE EFFECT: If timeOverride is used this increments it for next pass
 *
 * @effect overrides URL "timeOverride" param with incremented time
 */
/* eslint-disable no-unused-vars */
const updateTimeOverride = (base, increment) => {
    const {
        location: {
            origin = '',
            pathname = '',
        } = {},
    } = window;
    const currentSearchParams = new URL(window.location).searchParams;

    currentSearchParams.delete('servertime');

    const editedSearch = currentSearchParams.toString();
    const basePath = `${origin}${pathname}`;
    const newSeverTime = `${qs.stringify({ servertime: base + increment })}`;
    const newSearch = `${editedSearch}${editedSearch && '&'}${newSeverTime}`;
    const urlString = `${basePath}?${newSearch}`;

    window.history.replaceState(null, '', urlString);
};
// Definitions
/* eslint-disable no-useless-escape */
const liveExpiredRegEx = /[a-zA-Z0-9-]+:[a-zA-Z0-9-\/]+live-expired/;
const isOnDemandScheduledRegEx = /[a-zA-Z0-9-]+:[a-zA-Z0-9-\/]+on-demand-scheduled/;
/* eslint-enable no-useless-escape */
/**
 * @func defineIsLiveExpired
 * @desc Specific "Session (Card)" has "live expired" tag
 *
 * @param {Array} tags current session tags to seach for "live expired" tag
 * @returns {Boolean} isLiveExpired
 */
const defineIsLiveExpired = tags => hasTag(liveExpiredRegEx, tags);
/**
 * @func defineIsOnDemand
 * @desc Current Time is Greater than EndTime
 *
 * @param {Number} currentTime representation of current time in MS
 * @param {Number} endTime representation of session EndTime in MS
 * @returns {Boolean} isOnDemand
 */
const defineIsOnDemand = (currentTime, endTimeMls) => {
    if (endTimeMls && currentTime) {
        return currentTime >= endTimeMls;
    }

    return false;
};
/**
 * @func defineIsOnDemandScheduled
 * @desc Specific "Session (Card)" has "onDemand scheduled" tag
 *
 * @param {Array} tags current session tags to seach for "onDemand scheduled" tag
 * @returns {Boolean} isLiveExpired
 */
const defineIsOnDemandScheduled = tags => hasTag(isOnDemandScheduledRegEx, tags);
/**
 * @func defineIsUpcoming
 * @desc Current Time is Less than startTime
 *
 * @param {Number} currentTime representation of current time in MS
 * @param {Number} startTime representation of session StartTime in MS
 * @returns {Boolean} isOnDemand
 */
const defineIsUpcoming = (currentTime, startTimeMls) => {
    if (startTimeMls) {
        return startTimeMls >= currentTime;
    }

    return false;
};

/**
 * @func eventTiming
 * @desc First Sorts sessions by startDate, and then partitions them by category
 *
 * @param {Array} sessions sessions to be sorted
 * @returns {Object} nextTransitionMs, value for setTimeout.
 * visibleSessions, sorted cards/sessions to be rendered.
 */
function eventTiming(sessions = [], eventFilter) {
    if (!sessions.length) return [];

    const overrideTime = timeOverride();

    let nextTransitionMs;

    function setNextTransitionMs(compareTime, curMs) {
        if (compareTime < curMs) return nextTransitionMs;
        // Therefore current time should be less than transTimeMs
        const countDownMs = compareTime - curMs;
        /* if the countdown > 1 day (86400000ms) do not set a timer
         * The max number of MS a timer can have is 2147483647ms
         * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
         */
        if (countDownMs > 86400000) return nextTransitionMs;

        return (!nextTransitionMs && countDownMs > 0) ||
        (countDownMs < nextTransitionMs) ?
            countDownMs : nextTransitionMs;
    }
    /*
        If msAsNumber from urlState.servertime use this value, otherwise epoch
        from Date.now(). This is mainly an override for QA purposes.
    */
    const timeSinceArrival = performance.now();
    const curMs = overrideTime + timeSinceArrival || Date.now();
    // Stack per category
    const live = [];
    const notTimed = [];
    const onDemand = [];
    const upComing = [];
    /*
        The data has no default order, therefore have to sort according to
        session data before partitioning by category
    */
    sessions.sort((
        {
            startDate: aStart,
        } = {},
        {
            startDate: bStart,
        } = {},
    ) => {
        // "a" is what sort uses for the first item
        // converting the value to MS, therefore aMs
        const aMs = convertDateStrToMs(aStart);
        // "b" is what sort uses for the second item
        // converting the value to MS, therefore aMs
        const bMs = convertDateStrToMs(bStart);

        if (aMs === 0) return 1;

        if (bMs === 0) return -1;

        if (aMs < bMs) return -1;

        if (aMs > bMs) return 1;

        return 0;
    }).forEach((session = {}) => {
        const {
            endDate,
            startDate,
            tags = [],
        } = session;
        // Session Times in milliseconds
        const endMs = convertDateStrToMs(endDate);
        const startMs = convertDateStrToMs(startDate);
        // Timed categories
        const isTimed = !!(endMs && startMs);
        const isUpComing = isTimed ?
            defineIsUpcoming(curMs, startMs) : false;
        const isOnDemand = isTimed && !isUpComing ?
            defineIsOnDemand(curMs, endMs) : false;
        const isLive = !!(isTimed && !isUpComing && !isOnDemand && startMs);
        // Tagged Exceptions
        const isOnDemandScheduled = defineIsOnDemandScheduled(tags);
        const isLiveExpired = defineIsLiveExpired(tags);

        // Cards with no Date information, pushed to back of stack
        if (!isTimed) {
            notTimed.push(session);
        }

        // Upcoming and not tagged with On Demand Scheduled tag
        if (isUpComing && isTimed && !isOnDemandScheduled) {
            const upComingTransition = setNextTransitionMs(startMs, curMs);

            upComing.push(session);
            // GET Upcoming Badge here
            nextTransitionMs = upComingTransition && upComingTransition > 0 ?
                upComingTransition : nextTransitionMs;
        }
        // On demand and not tagged with Live Expired tag
        if (isOnDemand && isTimed && !isLiveExpired) {
            // Get OnDemand Badge here
            onDemand.push(session);
        }
        // Currently Live
        if (isLive && isTimed) {
            const liveTransition = setNextTransitionMs(startMs, curMs);

            live.push(session);
            // GET Live Badge here
            nextTransitionMs = liveTransition && liveTransition > 0 ?
                liveTransition : nextTransitionMs;
        }

        if (isUpComing && isOnDemandScheduled && isTimed) {
            const odTransition = setNextTransitionMs(startMs, curMs);

            nextTransitionMs = odTransition && odTransition > 0 ?
                odTransition : nextTransitionMs;
        }
    });
    // If no transitions are needed zero out transition time
    if ((!live.length && !upComing.length) || !nextTransitionMs) {
        nextTransitionMs = 0;
    }

    if (overrideTime && nextTransitionMs) {
        // TO BE REFACTORED AFTER MAX -- commented out for now:
        // This line of code causes the following bugs:
        // 1. It always updates the query param (time) to be ahead of what should be shown
        // 2. It triggers additional time transitions on  load more clicks, pagination, etc.
        // updateTimeOverride(curMs, nextTransitionMs);
    }

    let cards = [].concat(live, upComing, onDemand, notTimed);
    if (eventFilter === 'live') {
        cards = live;
    } else if (eventFilter === 'upcoming') {
        cards = upComing;
    } else if (eventFilter === 'on-demand') {
        cards = onDemand;
    } else if (eventFilter === 'not-timed') {
        cards = notTimed;
    }

    /*
        returns object
        - conditionally adds next sort transition time to returns
        - returns an Array of cards sorted by Category and then Date ASC
    */
    return {
        ...((nextTransitionMs && { nextTransitionMs })),
        visibleSessions: cards,
    };
}

export {
    eventTiming,
    convertDateStrToMs,
    defineIsLiveExpired,
    defineIsOnDemand,
    defineIsOnDemandScheduled,
    defineIsUpcoming,
};
