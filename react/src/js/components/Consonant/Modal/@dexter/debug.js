/* eslint-disable */
/**
 * @file debug.js
 * @desc Console debugger for optionally logging step by step progress.
 * Can be used with a {debug: true} in the instantiating call, or by URL parameter.
 * Setup: this.debug = new Debug({debug: true, control: 'Price'});
 * @author jisutton
 * @since 03/22/18 16:20
 * @func Debug
 * @constructs Base.Utilities.Debug
 * @exports class Debug
 */

// import 'url-search-params-polyfill'; // Removed: URLSearchParams is native in modern browsers

const _createClass = (function () { function defineProperties(target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }());

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

const Debug = (function () {
    /**
     * @func constructor
     * @desc initializing Debug constructor
     * @memberof Debug
     */
    function Debug() {
        const options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Debug);

        this.log = this.logFactory('log');
        this.warn = this.logFactory('warn');
        this.error = this.logFactory('error');
        this.info = this.logFactory('info');
        this.debug = this.logFactory('debug');
        this.table = this.logFactory('table');
        this.trace = this.logFactory('trace');

        const hasControl = options.control !== undefined;
        const decodeSearch = new URLSearchParams(window.location.search);
        this.options = {
            debug: false,
            param: 'dexter:debug',
            urlMode: 'Enabling URL Debug mode for',
            fileMode: 'Enabling File Debug mode for',
            debugAll: 'All',
            concatenator: ':',
            control: hasControl ? options.control : '',
        };
        const findDebugs = decodeSearch.getAll(this.options.param);
        const isDebug = decodeSearch.has(this.options.param);
        const allInUrl = hasControl && isDebug && this.find(findDebugs, this.options.debugAll);
        const inUrl = hasControl && isDebug && this.find(findDebugs, options.control);

        if (this.options.debug) {
            this.info(this.options.fileMode, this.options.debugAll);
        } else if (!options.debug && allInUrl && !inUrl) {
            this.options.debug = true;
            this.info(this.options.urlMode, this.options.debugAll);
        } else if (!options.debug && inUrl && !allInUrl) {
            this.options.debug = true;
            this.info(this.options.urlMode, options.control);
        } else if (options.debug && hasControl) {
            this.options.debug = true;
            this.info(this.options.fileMode, options.control);
        }
    }

    /**
     * @func find
     * @desc Search all cases of dexter:debug in the search params and match them
     * with the control name.
     *
     * @param findDebugs {Array} List of debug params
     * @param param {String} Control name to search for
     * @memberof Debug
     *
     * @returns {Boolean} True or False if it's matched the param
     */


    _createClass(Debug, [{
        key: 'find',
        value: function find(findDebugs, param) {
            return findDebugs.some(v => v === param);
        },

        /**
         * @func logFactory
         * @desc Take a type and console out that type to this.printIt()
         * @param logType {String} log, warn, error, info, table, debug
         * @memberof Debug
         * @returns {Function | Boolean} Returns
         */

    }, {
        key: 'logFactory',
        value: function logFactory(logType) {
            const _this = this;

            return function () {
                for (var _len = arguments.length, log = Array(_len), _key = 0; _key < _len; _key++) {
                    log[_key] = arguments[_key];
                }

                return log.length ? _this.printIt(logType, log) : false;
            };
        },

        /**
         * @func log
         * @desc console.log output
         * @param log {String | Array | Object} Accepts any number of arguments of any type.
         * @memberof Debug
         * @returns {Function} Returns this.logFactory with the type
         */

        /**
         * @func warn
         * @desc console.warn output
         * @param log {String | Array | Object} Accepts any number of arguments of any type.
         * @memberof Debug
         * @returns {Function} Returns this.logFactory with the type
         */

        /**
         * @func error
         * @desc console.error output
         * @param log {String | Array | Object} Accepts any number of arguments of any type.
         * @memberof Debug
         * @returns {Function} Returns this.logFactory with the type
         */

        /**
         * @func info
         * @desc console.info output
         * @param log {String | Array | Object} Accepts any number of arguments of any type.
         * @memberof Debug
         * @returns {Function} Returns this.logFactory with the type
         */

        /**
         * @func debug
         * @desc console.debug output
         * @param log {String | Array | Object} Accepts any number of arguments of any type.
         * @memberof Debug
         * @returns {Function} Returns this.logFactory with the type
         */

        /**
         * @func table
         * @desc console.table output
         * @param log {Array | Object} Accepts any number of arguments of any type.
         * @memberof Debug
         * @returns {Function} Returns this.logFactory with the type
         */

        /**
         * @func trace
         * @desc console.trace output
         * @param log {Array | Object} Accepts any number of arguments of any type.
         * @memberof Debug
         * @returns {Function} Returns this.logFactory with the type
         */

    }, {
        key: 'printIt',

        /**
         * @func debug
         * @desc console.debug output
         * @param type {String} Type of logger to use
         * @param log {String | Array | Object} Accepts any number of arguments of any type.
         * @memberof Debug
         * @returns {Function} Returns this.logFactory with the type
         */
        value: function printIt(type, log) {
            let logger = void 0;
            let output = void 0;

            /* eslint-disable no-console */
            switch (type) {
                case 'error':
                {
                    logger = console.error;
                    break;
                }
                case 'warn':
                {
                    logger = console.warn;
                    break;
                }
                case 'log':
                {
                    logger = console.log;
                    break;
                }
                case 'info':
                {
                    logger = console.info;
                    break;
                }
                case 'debug':
                {
                    logger = console.debug;
                    break;
                }
                case 'table':
                {
                    logger = console.table;
                    break;
                }
                case 'trace':
                {
                    logger = console.trace;
                    break;
                }
                default:
                {
                    logger = console.log;
                    break;
                }
            }
            /* eslint-enable */

            if (type !== undefined && log !== undefined && this.options.debug) {
                // Place control tag as first array item
                output = [this.options.control + this.options.concatenator];

                log.forEach((val) => {
                    output.push(val);
                });

                // Flatten the array once for output
                output = [].concat.apply(output);
                // pass the log array as arguments to console.*
                logger.apply(console, output);

                return true;
            }

            return false;
        },
    }]);

    return Debug;
}());

export default Debug;
