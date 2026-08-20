/**
 * @file thorttle.js
 * @desc Throttle / Debounce hybrid utilitly method
 * @author augur
 * @since 09/15/17 16:20
 *
 * @exports throttle
 */

/**
 * @func thottle
 * @desc Based on Timeout MS slows occurence of method calls
 *
 * @memberof Utilities
 *
 * @param delay {Integer} in MS
 * @param thorttled {Function} callback
 * @param opts {Object} confs for the callback
 * @example
 * window.addEventListener('scroll', this.utils.throttle(250, method, {options}))
 *
 * @returns {Lambda}
 */

const throttle = (delay = 250, throttled, opts = {}, ...args) => {
    let previousCall = null;
    return () => {
        const time = new Date().getTime();
        let timeout = null;
        if (timeout) {
            clearTimeout(timeout);
        }
        if (!previousCall || time - previousCall >= delay) {
            previousCall = time;
            throttled.apply(null, [opts, args]);
            timeout = setTimeout(() => {
                throttled.apply(null, [opts, args]);
                timeout = null;
            }, (delay * 2));
        }
    };
};

export default throttle;
