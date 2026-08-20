/*
Polyfills needed for all browsers.
Unused features are commented out.
*/
// import 'core-js';
// import 'core-js/fn/global';
// import 'core-js/fn/array/flat-map';
// import 'core-js/fn/array/flatten';
// import 'core-js/fn/array/includes';
// import 'core-js/fn/object/assign';
// import 'core-js/fn/array/find-index';
// import 'core-js/fn/array/find';
// import 'core-js/fn/array/from';
// import 'core-js/fn/error/is-error';
// import 'core-js/fn/map/from';
// import 'core-js/fn/map/of';
// import 'core-js/fn/math/clamp';
// import 'core-js/fn/math/deg-per-rad';
// import 'core-js/fn/math/degrees';
// import 'core-js/fn/math/fscale';
// import 'core-js/fn/math/iaddh';
// import 'core-js/fn/math/imulh';
// import 'core-js/fn/math/isubh';
// import 'core-js/fn/math/rad-per-deg';
// import 'core-js/fn/math/radians';
// import 'core-js/fn/math/scale';
// import 'core-js/fn/math/signbit';
// import 'core-js/fn/math/umulh';
// import 'core-js/fn/object/define-getter';
// import 'core-js/fn/object/define-setter';
// import 'core-js/fn/object/get-own-property-descriptors';
// import 'core-js/fn/object/lookup-getter';
// import 'core-js/fn/object/lookup-setter';
// import 'core-js/fn/object/entries';
// import 'core-js/fn/object/values';
// import 'core-js/fn/object/is';
// import 'core-js/fn/object';
// import 'core-js/fn/string/starts-with';
// import 'core-js/fn/observable';
// import 'core-js/fn/promise/finally';
// import 'core-js/fn/promise/try';
// import 'core-js/fn/regexp/flags';
// import 'core-js/fn/regexp/match';
// import 'core-js/fn/regexp/replace';
// import 'core-js/fn/regexp/search';
// import 'core-js/fn/regexp/split';
// import 'core-js/fn/set/from';
// import 'core-js/fn/set/of';
// import 'core-js/fn/string/at';
// import 'core-js/fn/string/pad-end';
// import 'core-js/fn/string/pad-start';
// import 'core-js/fn/string/trim-end';
// import 'core-js/fn/string/trim-start';
// import 'core-js/fn/string/match-all';

// import 'core-js/fn/asap';
// import 'core-js/fn/delay';
// import 'core-js/fn/is-iterable';
// import 'core-js/fn/number/iterator';
// import 'core-js/fn/number/is-nan';
// import 'core-js/fn/object/classof';
// import 'core-js/fn/object/define';
// import 'core-js/fn/object/is-object';
// import 'core-js/fn/object/make';
// import 'core-js/fn/regexp/escape';
// import 'core-js/fn/string/escape-html';
// import 'core-js/fn/string/unescape-html';
// import 'core-js/web/immediate';

// import 'url-search-params-polyfill';
// import 'url-polyfill';
// import 'intersection-observer';

/* eslint-disable */
// if (typeof window.Object.assign !== 'function') {
//     // Must be writable: true, enumerable: false, configurable: true
//     Object.defineProperty(Object, "assign", {
//       value: function assign(target, varArgs) { // .length of function is 2
//         'use strict';
//         if (target === null || target === undefined) {
//           throw new TypeError('Cannot convert undefined or null to object');
//         }

//         var to = Object(target);

//         for (var index = 1; index < arguments.length; index++) {
//           var nextSource = arguments[index];

//           if (nextSource !== null && nextSource !== undefined) {
//             for (var nextKey in nextSource) {
//               // Avoid bugs when hasOwnProperty is shadowed
//               if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
//                 to[nextKey] = nextSource[nextKey];
//               }
//             }
//           }
//         }
//         return to;
//       },
//       writable: true,
//       configurable: true
//     });
//   }
