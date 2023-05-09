/*!
 * Chimera UI Libraries - Build 5/9/2023, 15:15:47
 *         
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 29);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Children", function() { return O; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PureComponent", function() { return w; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StrictMode", function() { return mn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Suspense", function() { return D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SuspenseList", function() { return V; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED", function() { return ln; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneElement", function() { return sn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createFactory", function() { return fn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createPortal", function() { return z; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Cn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findDOMNode", function() { return vn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flushSync", function() { return pn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forwardRef", function() { return k; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hydrate", function() { return J; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isValidElement", function() { return an; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lazy", function() { return M; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "memo", function() { return x; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return G; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "startTransition", function() { return yn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unmountComponentAtNode", function() { return hn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unstable_batchedUpdates", function() { return dn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useDeferredValue", function() { return _n; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useInsertionEffect", function() { return Sn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useSyncExternalStore", function() { return gn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useTransition", function() { return bn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return cn; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(12);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return __WEBPACK_IMPORTED_MODULE_0_preact__["Component"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Fragment", function() { return __WEBPACK_IMPORTED_MODULE_0_preact__["Fragment"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "createContext", function() { return __WEBPACK_IMPORTED_MODULE_0_preact__["createContext"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "createElement", function() { return __WEBPACK_IMPORTED_MODULE_0_preact__["createElement"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "createRef", function() { return __WEBPACK_IMPORTED_MODULE_0_preact__["createRef"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_preact_hooks__ = __webpack_require__(19);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "useCallback", function() { return __WEBPACK_IMPORTED_MODULE_1_preact_hooks__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "useContext", function() { return __WEBPACK_IMPORTED_MODULE_1_preact_hooks__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "useDebugValue", function() { return __WEBPACK_IMPORTED_MODULE_1_preact_hooks__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "useEffect", function() { return __WEBPACK_IMPORTED_MODULE_1_preact_hooks__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "useErrorBoundary", function() { return __WEBPACK_IMPORTED_MODULE_1_preact_hooks__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "useId", function() { return __WEBPACK_IMPORTED_MODULE_1_preact_hooks__["f"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "useImperativeHandle", function() { return __WEBPACK_IMPORTED_MODULE_1_preact_hooks__["g"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "useLayoutEffect", function() { return __WEBPACK_IMPORTED_MODULE_1_preact_hooks__["h"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "useMemo", function() { return __WEBPACK_IMPORTED_MODULE_1_preact_hooks__["i"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "useReducer", function() { return __WEBPACK_IMPORTED_MODULE_1_preact_hooks__["j"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "useRef", function() { return __WEBPACK_IMPORTED_MODULE_1_preact_hooks__["k"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "useState", function() { return __WEBPACK_IMPORTED_MODULE_1_preact_hooks__["l"]; });
function g(n,t){for(var e in t)n[e]=t[e];return n}function C(n,t){for(var e in n)if("__source"!==e&&!(e in t))return!0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return!0;return!1}function E(n,t){return n===t&&(0!==n||1/n==1/t)||n!=n&&t!=t}function w(n){this.props=n}function x(n,e){function r(n){var t=this.props.ref,r=t==n.ref;return!r&&t&&(t.call?t(null):t.current=null),e?!e(this.props,n)||!r:C(this.props,n)}function u(e){return this.shouldComponentUpdate=r,Object(__WEBPACK_IMPORTED_MODULE_0_preact__["createElement"])(n,e)}return u.displayName="Memo("+(n.displayName||n.name)+")",u.prototype.isReactComponent=!0,u.__f=!0,u}(w.prototype=new __WEBPACK_IMPORTED_MODULE_0_preact__["Component"]).isPureReactComponent=!0,w.prototype.shouldComponentUpdate=function(n,t){return C(this.props,n)||C(this.state,t)};var R=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__b;__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),R&&R(n)};var N="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function k(n){function t(t){var e=g({},t);return delete e.ref,n(e,t.ref||null)}return t.$$typeof=N,t.render=t,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}var A=function(n,t){return null==n?null:Object(__WEBPACK_IMPORTED_MODULE_0_preact__["toChildArray"])(Object(__WEBPACK_IMPORTED_MODULE_0_preact__["toChildArray"])(n).map(t))},O={map:A,forEach:A,count:function(n){return n?Object(__WEBPACK_IMPORTED_MODULE_0_preact__["toChildArray"])(n).length:0},only:function(n){var t=Object(__WEBPACK_IMPORTED_MODULE_0_preact__["toChildArray"])(n);if(1!==t.length)throw"Children.only";return t[0]},toArray:__WEBPACK_IMPORTED_MODULE_0_preact__["toChildArray"]},T=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__e;__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__e=function(n,t,e,r){if(n.then)for(var u,o=t;o=o.__;)if((u=o.__c)&&u.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k),u.__c(n,t);T(n,t,e,r)};var I=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].unmount;function L(n,t,e){return n&&(n.__c&&n.__c.__H&&(n.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c()}),n.__c.__H=null),null!=(n=g({},n)).__c&&(n.__c.__P===e&&(n.__c.__P=t),n.__c=null),n.__k=n.__k&&n.__k.map(function(n){return L(n,t,e)})),n}function U(n,t,e){return n&&(n.__v=null,n.__k=n.__k&&n.__k.map(function(n){return U(n,t,e)}),n.__c&&n.__c.__P===t&&(n.__e&&e.insertBefore(n.__e,n.__d),n.__c.__e=!0,n.__c.__P=e)),n}function D(){this.__u=0,this.t=null,this.__b=null}function F(n){var t=n.__.__c;return t&&t.__a&&t.__a(n)}function M(n){var e,r,u;function o(o){if(e||(e=n()).then(function(n){r=n.default||n},function(n){u=n}),u)throw u;if(!r)throw e;return Object(__WEBPACK_IMPORTED_MODULE_0_preact__["createElement"])(r,o)}return o.displayName="Lazy",o.__f=!0,o}function V(){this.u=null,this.o=null}__WEBPACK_IMPORTED_MODULE_0_preact__["options"].unmount=function(n){var t=n.__c;t&&t.__R&&t.__R(),t&&!0===n.__h&&(n.type=null),I&&I(n)},(D.prototype=new __WEBPACK_IMPORTED_MODULE_0_preact__["Component"]).__c=function(n,t){var e=t.__c,r=this;null==r.t&&(r.t=[]),r.t.push(e);var u=F(r.__v),o=!1,i=function(){o||(o=!0,e.__R=null,u?u(l):l())};e.__R=i;var l=function(){if(!--r.__u){if(r.state.__a){var n=r.state.__a;r.__v.__k[0]=U(n,n.__c.__P,n.__c.__O)}var t;for(r.setState({__a:r.__b=null});t=r.t.pop();)t.forceUpdate()}},c=!0===t.__h;r.__u++||c||r.setState({__a:r.__b=r.__v.__k[0]}),n.then(i,i)},D.prototype.componentWillUnmount=function(){this.t=[]},D.prototype.render=function(n,e){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),o=this.__v.__k[0].__c;this.__v.__k[0]=L(this.__b,r,o.__O=o.__P)}this.__b=null}var i=e.__a&&Object(__WEBPACK_IMPORTED_MODULE_0_preact__["createElement"])(__WEBPACK_IMPORTED_MODULE_0_preact__["Fragment"],null,n.fallback);return i&&(i.__h=null),[Object(__WEBPACK_IMPORTED_MODULE_0_preact__["createElement"])(__WEBPACK_IMPORTED_MODULE_0_preact__["Fragment"],null,e.__a?null:n.children),i]};var W=function(n,t,e){if(++e[1]===e[0]&&n.o.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.o.size))for(e=n.u;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.u=e=e[2]}};function P(n){return this.getChildContext=function(){return n.context},n.children}function j(n){var e=this,r=n.i;e.componentWillUnmount=function(){Object(__WEBPACK_IMPORTED_MODULE_0_preact__["render"])(null,e.l),e.l=null,e.i=null},e.i&&e.i!==r&&e.componentWillUnmount(),n.__v?(e.l||(e.i=r,e.l={nodeType:1,parentNode:r,childNodes:[],appendChild:function(n){this.childNodes.push(n),e.i.appendChild(n)},insertBefore:function(n,t){this.childNodes.push(n),e.i.appendChild(n)},removeChild:function(n){this.childNodes.splice(this.childNodes.indexOf(n)>>>1,1),e.i.removeChild(n)}}),Object(__WEBPACK_IMPORTED_MODULE_0_preact__["render"])(Object(__WEBPACK_IMPORTED_MODULE_0_preact__["createElement"])(P,{context:e.context},n.__v),e.l)):e.l&&e.componentWillUnmount()}function z(n,e){var r=Object(__WEBPACK_IMPORTED_MODULE_0_preact__["createElement"])(j,{__v:n,i:e});return r.containerInfo=e,r}(V.prototype=new __WEBPACK_IMPORTED_MODULE_0_preact__["Component"]).__a=function(n){var t=this,e=F(t.__v),r=t.o.get(n);return r[0]++,function(u){var o=function(){t.props.revealOrder?(r.push(u),W(t,n,r)):u()};e?e(o):o()}},V.prototype.render=function(n){this.u=null,this.o=new Map;var t=Object(__WEBPACK_IMPORTED_MODULE_0_preact__["toChildArray"])(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.o.set(t[e],this.u=[1,0,this.u]);return n.children},V.prototype.componentDidUpdate=V.prototype.componentDidMount=function(){var n=this;this.o.forEach(function(t,e){W(n,e,t)})};var B="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,H=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,Z=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,Y=/[A-Z0-9]/g,$="undefined"!=typeof document,q=function(n){return("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/:/fil|che|ra/).test(n)};function G(n,t,e){return null==t.__k&&(t.textContent=""),Object(__WEBPACK_IMPORTED_MODULE_0_preact__["render"])(n,t),"function"==typeof e&&e(),n?n.__c:null}function J(n,t,e){return Object(__WEBPACK_IMPORTED_MODULE_0_preact__["hydrate"])(n,t),"function"==typeof e&&e(),n?n.__c:null}__WEBPACK_IMPORTED_MODULE_0_preact__["Component"].prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(t){Object.defineProperty(__WEBPACK_IMPORTED_MODULE_0_preact__["Component"].prototype,t,{configurable:!0,get:function(){return this["UNSAFE_"+t]},set:function(n){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:n})}})});var K=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].event;function Q(){}function X(){return this.cancelBubble}function nn(){return this.defaultPrevented}__WEBPACK_IMPORTED_MODULE_0_preact__["options"].event=function(n){return K&&(n=K(n)),n.persist=Q,n.isPropagationStopped=X,n.isDefaultPrevented=nn,n.nativeEvent=n};var tn,en={enumerable:!1,configurable:!0,get:function(){return this.class}},rn=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].vnode;__WEBPACK_IMPORTED_MODULE_0_preact__["options"].vnode=function(n){"string"==typeof n.type&&function(n){var t=n.props,e=n.type,u={};for(var o in t){var i=t[o];if(!("value"===o&&"defaultValue"in t&&null==i||$&&"children"===o&&"noscript"===e||"class"===o||"className"===o)){var l=o.toLowerCase();"defaultValue"===o&&"value"in t&&null==t.value?o="value":"download"===o&&!0===i?i="":"ondoubleclick"===l?o="ondblclick":"onchange"!==l||"input"!==e&&"textarea"!==e||q(t.type)?"onfocus"===l?o="onfocusin":"onblur"===l?o="onfocusout":Z.test(o)?o=l:-1===e.indexOf("-")&&H.test(o)?o=o.replace(Y,"-$&").toLowerCase():null===i&&(i=void 0):l=o="oninput","oninput"===l&&u[o=l]&&(o="oninputCapture"),u[o]=i}}"select"==e&&u.multiple&&Array.isArray(u.value)&&(u.value=Object(__WEBPACK_IMPORTED_MODULE_0_preact__["toChildArray"])(t.children).forEach(function(n){n.props.selected=-1!=u.value.indexOf(n.props.value)})),"select"==e&&null!=u.defaultValue&&(u.value=Object(__WEBPACK_IMPORTED_MODULE_0_preact__["toChildArray"])(t.children).forEach(function(n){n.props.selected=u.multiple?-1!=u.defaultValue.indexOf(n.props.value):u.defaultValue==n.props.value})),t.class&&!t.className?(u.class=t.class,Object.defineProperty(u,"className",en)):(t.className&&!t.class||t.class&&t.className)&&(u.class=u.className=t.className),n.props=u}(n),n.$$typeof=B,rn&&rn(n)};var un=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__r;__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__r=function(n){un&&un(n),tn=n.__c};var on=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].diffed;__WEBPACK_IMPORTED_MODULE_0_preact__["options"].diffed=function(n){on&&on(n);var t=n.props,e=n.__e;null!=e&&"textarea"===n.type&&"value"in t&&t.value!==e.value&&(e.value=null==t.value?"":t.value),tn=null};var ln={ReactCurrentDispatcher:{current:{readContext:function(n){return tn.__n[n.__c].props.value}}}},cn="17.0.2";function fn(n){return __WEBPACK_IMPORTED_MODULE_0_preact__["createElement"].bind(null,n)}function an(n){return!!n&&n.$$typeof===B}function sn(n){return an(n)?__WEBPACK_IMPORTED_MODULE_0_preact__["cloneElement"].apply(null,arguments):n}function hn(n){return!!n.__k&&(Object(__WEBPACK_IMPORTED_MODULE_0_preact__["render"])(null,n),!0)}function vn(n){return n&&(n.base||1===n.nodeType&&n)||null}var dn=function(n,t){return n(t)},pn=function(n,t){return n(t)},mn=__WEBPACK_IMPORTED_MODULE_0_preact__["Fragment"];function yn(n){n()}function _n(n){return n}function bn(){return[!1,yn]}var Sn=__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["h" /* useLayoutEffect */];function gn(n,t){var e=t(),r=Object(__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["l" /* useState */])({h:{__:e,v:t}}),u=r[0].h,o=r[1];return Object(__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["h" /* useLayoutEffect */])(function(){u.__=e,u.v=t,E(u.__,t())||o({h:u})},[n,e,t]),Object(__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["d" /* useEffect */])(function(){return E(u.__,u.v())||o({h:u}),n(function(){E(u.__,u.v())||o({h:u})})},[n]),e}var Cn={useState:__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["l" /* useState */],useId:__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["f" /* useId */],useReducer:__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["j" /* useReducer */],useEffect:__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["d" /* useEffect */],useLayoutEffect:__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["h" /* useLayoutEffect */],useInsertionEffect:Sn,useTransition:bn,useDeferredValue:_n,useSyncExternalStore:gn,startTransition:yn,useRef:__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["k" /* useRef */],useImperativeHandle:__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["g" /* useImperativeHandle */],useMemo:__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["i" /* useMemo */],useCallback:__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["a" /* useCallback */],useContext:__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["b" /* useContext */],useDebugValue:__WEBPACK_IMPORTED_MODULE_1_preact_hooks__["c" /* useDebugValue */],version:"17.0.2",Children:O,render:G,hydrate:J,unmountComponentAtNode:hn,createPortal:z,createElement:__WEBPACK_IMPORTED_MODULE_0_preact__["createElement"],createContext:__WEBPACK_IMPORTED_MODULE_0_preact__["createContext"],createFactory:fn,cloneElement:sn,createRef:__WEBPACK_IMPORTED_MODULE_0_preact__["createRef"],Fragment:__WEBPACK_IMPORTED_MODULE_0_preact__["Fragment"],isValidElement:an,findDOMNode:vn,Component:__WEBPACK_IMPORTED_MODULE_0_preact__["Component"],PureComponent:w,memo:x,forwardRef:k,flushSync:pn,unstable_batchedUpdates:dn,StrictMode:mn,Suspense:D,SuspenseList:V,lazy:M,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:ln};
//# sourceMappingURL=compat.module.js.map


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = __webpack_require__(20);

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(41)(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(44)();
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getLinkTarget = exports.getEventBanner = exports.getCurrentDate = exports.isDateBeforeInterval = exports.isDateWithinInterval = exports.qs = exports.mergeDeep = exports.setByPath = exports.debounce = exports.getSelectedItemsCount = exports.getByPath = exports.template = exports.getEndNumber = exports.getStartNumber = exports.getPageStartEnd = exports.generateRange = exports.stopPropagation = exports.isAtleastOneFilterSelected = exports.isNullish = exports.parseToPrimitive = exports.isObject = exports.mapObject = exports.sanitizeText = exports.sortByKey = exports.intersection = exports.isSuperset = exports.chainFromIterable = exports.chain = exports.removeDuplicatesByKey = exports.truncateList = exports.truncateString = exports.readInclusionsFromLocalStorage = exports.readBookmarksFromLocalStorage = exports.saveBookmarksToLocalStorage = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getTransitions = getTransitions;

var _priorityQueue = __webpack_require__(31);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Saves a card to local storage
 * @param {Number} bookmarksValue - The id of the card to save
 * @return {Void}
 */
var saveBookmarksToLocalStorage = exports.saveBookmarksToLocalStorage = function saveBookmarksToLocalStorage(bookmarksValue) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarksValue, null, 2));
};

/**
 * Returns all cards saved in local storage
 * @return {Array} - All saved bookmarks
 */
var readBookmarksFromLocalStorage = exports.readBookmarksFromLocalStorage = function readBookmarksFromLocalStorage() {
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    return Array.isArray(bookmarks) ? bookmarks : [];
};

var readInclusionsFromLocalStorage = exports.readInclusionsFromLocalStorage = function readInclusionsFromLocalStorage() {
    var favorites = JSON.parse(localStorage.getItem('chimera.favorites')) || [];
    var schedule = JSON.parse(localStorage.getItem('chimera.schedule')) || [];
    var lastWatched = localStorage.getItem('chimera.lastWatched') || '';

    return new Set([].concat(favorites, [lastWatched], schedule));
};

/**
 * Helper method to truncate strings
 * @param {String} str - The string to truncate
 * @param {Number} num - How much to truncate
 * @return {String} - The truncated string
 */
var truncateString = exports.truncateString = function truncateString(str, num) {
    if (str.length <= num) return str;
    return str.slice(0, num) + '...';
};

/**
 * Helper method to truncate a list of cards
 * @param {Number} limit - How much to truncate by
 * @param {Array} list - What to truncate
 * @return {Array} - The truncated list
 */
var truncateList = exports.truncateList = function truncateList(limit, list) {
    // No limit, return all;
    if (limit < 0) return list;

    // Slice received data to required q-ty;
    return list.slice(0, limit);
};

/**
 * Helper method to remove duplicate cards from list
 * @param {Array} list - The list of cards
 * @param {key} key - What key to search for duplicates for
 * @return {Array} - A list of cards with no duplicates
 */
var removeDuplicatesByKey = exports.removeDuplicatesByKey = function removeDuplicatesByKey(list, key) {
    var newList = [];
    var ids = new Set();
    list.forEach(function (item) {
        if (!ids.has(item[key])) {
            newList.push(item);
            ids.add(item[key]);
        }
    });
    return newList;
};

/**
 * Helper method that chains lists together
 * @param {Any} args - Any set of args
 * @example chain(['A', 'B', 'C'], ['D', 'E', 'F']) --> ['A' 'B' 'C' 'D' 'E' 'F']
 */
var chain = exports.chain = function chain() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return args.reduce(function (a, b) {
        return a.concat(b);
    }, []);
};

/**
 * Helper method that chains iterables together
 * @param {Any} args - Any set of iterable arguments
 * @example chainFromIterable(someIterable) --> ['A' 'B' 'C' 'D' 'E' 'F']
 */
var chainFromIterable = exports.chainFromIterable = function chainFromIterable(args) {
    return chain.apply(undefined, _toConsumableArray(args));
};

/**
 * Helper method to determine wheether set A is a superset of set B
 * @param {Set} superset - The first set
 * @param {Set} subset - The second set
 * @return {Boolean} - Whether set A is a superset of set B
 */
var isSuperset = exports.isSuperset = function isSuperset(superset, subset) {
    // eslint-disable-next-line no-restricted-syntax
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = subset[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var elem = _step.value;

            if (!superset.has(elem)) {
                return false;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return true;
};

/**
 * Helper method to do determine whether the two sets have an intersection
 * @param {Set} setA - The first set
 * @param {Set} setB - The second set
 * @return {Boolean} - Whether there is an intersection of elements between the sets
 */
var intersection = exports.intersection = function intersection(setA, setB) {
    var intersectionSet = new Set();
    // eslint-disable-next-line no-restricted-syntax
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = setB[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var elem = _step2.value;

            if (setA.has(elem)) {
                intersectionSet.add(elem);
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return intersectionSet;
};

/**
 * Helper method to sort by keys
 * @param {Iterable} iterable - The iterable object
 * @param {Function} keyFunc - The function to apply
 */
var sortByKey = exports.sortByKey = function sortByKey(iterable, keyFunc) {
    return [].concat(_toConsumableArray(iterable)).sort(function (a, b) {
        if (keyFunc(a) < keyFunc(b)) return -1;
        if (keyFunc(a) > keyFunc(b)) return 1;
        return 0;
    });
};

/**
 * Returns cleaned up text
 * @param {String} text - The text so sanitize
 * @return {String} - The cleaned up text
 */
var sanitizeText = exports.sanitizeText = function sanitizeText(text) {
    return text.toLowerCase().trim();
};

/**
 * For a given object, applies a function to key in that object
 * @param {Object} object - The object to apply the function to
 * @param {Function} func - The function to apply to the entries in the object
 * @return {Object} - The new object
 */
var mapObject = exports.mapObject = function mapObject(object, func) {
    var newObj = {};
    var keys = Object.keys(object);

    keys.forEach(function (key) {
        newObj[key] = func(object[key]);
    });

    return newObj;
};

/**
 * Determines whether the passed in value is an object or not
 * @param {Any} val - Start value in the range array;
 * @return {Boolean} - Whether the passed in value is nullish or not
 */
var isObject = exports.isObject = function isObject(val) {
    return !!val && val.constructor === Object;
};

/**
 * Support method so HTL/Sightly can pass authored properties to React
 * @param {Object} value - Start value in the range array;
 * @return {Object} - Authored config used by react component
 */
var parseToPrimitive = exports.parseToPrimitive = function parseToPrimitive(value) {
    if (isObject(value)) {
        return mapObject(value, parseToPrimitive);
    } else if (Array.isArray(value)) {
        return value.map(parseToPrimitive);
    }

    try {
        return parseToPrimitive(JSON.parse(value));
    } catch (e) {
        return value;
    }
};

/**
 * Determines whether the passed in value is nullish or not
 * @param {Any} val - Start value in the range array;
 * @return {Boolean} - Whether the passed in value is nullish or not
 */
var isNullish = exports.isNullish = function isNullish(val) {
    return val === undefined || val === null || Number.isNaN(val);
};

var isAtleastOneFilterSelected = exports.isAtleastOneFilterSelected = function isAtleastOneFilterSelected(filters) {
    return chainFromIterable(filters.map(function (f) {
        return f.items;
    })).some(function (item) {
        return item.selected;
    });
};

/**
 * Helper method to stop propagation for events
 * @param {Event} e - The event to stop propagation for
 * @return {Void}
 */
var stopPropagation = exports.stopPropagation = function stopPropagation(e) {
    return e.stopPropagation();
};

/**
 * Return a range of numbers from [start, ... , end];
 * @param {number} startVal - Start value in the range array;
 * @param {number} end - End value in the range array;
 * @return {Array}
 */
var generateRange = exports.generateRange = function generateRange(startVal, end) {
    var start = startVal;
    var step = 1;
    var range = [];

    if (end < start) {
        step = -step;
    }

    while (step > 0 ? end >= start : end <= start) {
        range.push(start);
        start += step;
    }

    return range;
};

/**
 * Gets what start and end numbers should be for a given page
 * @param {number} pageCount - Total pages to display
 * @param {number} currentPageNumber - Current page user is on
 * @param {number} totalPages - Total number of pages available
 * @return {Array} - The start and end page numbers
 */
var getPageStartEnd = exports.getPageStartEnd = function getPageStartEnd(currentPageNumber, pageCount, totalPages) {
    var halfPageCount = Math.floor(pageCount / 2);
    var start = void 0;
    var end = void 0;

    if (totalPages <= pageCount + 1) {
        // show all pages
        start = 1;
        end = totalPages;
    } else {
        start = Math.min(Math.max(1, currentPageNumber - halfPageCount), totalPages - pageCount);
        end = Math.max(Math.min(currentPageNumber + halfPageCount, totalPages), pageCount + 1);
    }

    return [start, end];
};

/**
 * Gets the start number for Paginator Component
 * @param {Number} currentPageNumber - Current page the user is on
 * @param {Number} showItemsPerPage - How many items to show per page
 * @returns {Number} - The start number for Paginator Component
 */
var getStartNumber = exports.getStartNumber = function getStartNumber(currentPageNumber, showItemsPerPage) {
    if (currentPageNumber === 1) return 1;
    return currentPageNumber * showItemsPerPage - (showItemsPerPage - 1);
};

/**
 * Gets the end number for Paginator Component
 * @param {Number} currentPageNumber - Current page the user is on
 * @param {Number} showItemsPerPage - How many items to show per page
 * @param {Number} totalResults - Total count of cards in collection
 * @returns {Number} - The end number for Paginator Component
 */
var getEndNumber = exports.getEndNumber = function getEndNumber(currentPageNumber, showItemsPerPage, totalResults) {
    var res = currentPageNumber * showItemsPerPage;
    return res < totalResults ? res : totalResults;
};

/**
 * Gets the end number for Paginator Component
 * @param {string} text - template string like a '{0} {1}'
 * @param {object} props - object with props to replace part of text in brackets
 * @returns {string} - ('{placeholderKey}', { placeholderKey: 'placeholderValue' })
 *  => 'placeholderValue'
 */
var template = exports.template = function template() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var props = arguments[1];

    if (!props) return text;

    var regExp = /{([A-z]*)}/gi;
    var replacer = function replacer(fullMatch, key) {
        return props[key] || fullMatch;
    };

    return text.replace(regExp, replacer);
};

/**
 * Gets the object/path/defaultValue and return object value by this path
 * @param {Object} object - object to get value
 * @param {String} path - path to searched value
 * @param {any} defaultValue - will return when no value was found
 * @returns {any} - searched value
 */
var getByPath = exports.getByPath = function getByPath(object, path, defaultValue) {
    if (!object || !path) return defaultValue;

    var result = object;
    var chunks = path.split('.');

    for (var index = 0; index < chunks.length; index += 1) {
        var chunk = chunks[index];

        /* eslint-disable-next-line no-prototype-builtins */
        if (result != null && result.hasOwnProperty(chunk)) {
            result = result[chunk];
        } else {
            result = defaultValue;
            break;
        }
    }

    return result;
};

/**
 * Return sum of the selected filters
 * @param {items} array - filter items
 * @returns {number} - selected items count
 */
var getSelectedItemsCount = exports.getSelectedItemsCount = function getSelectedItemsCount(items) {
    return items.filter(function (_ref) {
        var selected = _ref.selected;
        return Boolean(selected);
    }).length;
};

/**
 * Func to make debounced functions
 * @param {Function} func - target function
 * @param {number} timeout - debounce delay
 * @returns {func} - debounced function
 */
var debounce = exports.debounce = function debounce(func) {
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var timer = void 0;

    return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        clearTimeout(timer);

        timer = setTimeout(function () {
            func.apply(undefined, args);
        }, timeout);
    };
};

/**
 * Set object value by path
 * @param {Object} object - target object
 * @param {string} path - destination path
 * @param {any} value - value which should be assign
 */
var setByPath = exports.setByPath = function setByPath(object, path, value) {
    if (!object || !path) return;

    var chunks = path.split('.');
    var withoutLast = chunks.slice(0, -1);
    var lastChunk = chunks[chunks.length - 1];

    var target = withoutLast.reduce(function (accumulator, chunk) {
        if (!isObject(accumulator[chunk])) {
            accumulator[chunk] = {};
        }
        return accumulator[chunk];
    }, object);

    target[lastChunk] = value;
};

/**
 * Deep merge objects without undefined values
 * @param {Object} target - target object
 * @param {...Object} sources - objects to merge
 * @return {Obect} merge object
 */
var mergeDeep = exports.mergeDeep = function mergeDeep(target) {
    for (var _len3 = arguments.length, sources = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        sources[_key3 - 1] = arguments[_key3];
    }

    if (!sources.length) return target;

    var source = sources.shift();

    if (isObject(target) && isObject(source)) {
        var keys = Object.keys(source);

        keys.forEach(function (key) {
            if (isObject(source[key])) {
                if (!target[key]) target[key] = {};

                mergeDeep(target[key], source[key]);
            } else if (source[key] !== undefined) {
                Object.assign(target, _defineProperty({}, key, source[key]));
            }
        });
    }

    return mergeDeep.apply(undefined, [target].concat(sources));
};

var isCaasGroup = function isCaasGroup(group) {
    return group.indexOf('ch_') === 0;
};

/**
 * Methods to create/parse queryString
 */
var qs = exports.qs = {
    parse: function parse(string) {
        var searchParams = new URLSearchParams(string);

        return [].concat(_toConsumableArray(searchParams.keys())).reduce(function (accumulator, key) {
            if (!accumulator[key]) {
                var value = searchParams.getAll(key);

                if (isCaasGroup(key)) {
                    if (value.length === 1) {
                        var _value = value,
                            _value2 = _slicedToArray(_value, 1),
                            firstItem = _value2[0];

                        if (firstItem.includes('|')) {
                            value = firstItem.split('|');
                        }
                    }
                    accumulator[key] = decodeURIComponent(value);
                } else {
                    accumulator[key] = value;
                }
            }

            return accumulator;
        }, {});
    },
    stringify: function stringify(obj) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            array = _ref2.array;

        var searchParams = new URLSearchParams();
        Object.entries(obj).forEach(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                key = _ref4[0],
                value = _ref4[1];

            if (isCaasGroup(key)) {
                if (Array.isArray(value)) {
                    if (array === 'comma') {
                        searchParams.append(key, encodeURIComponent(value));
                    } else {
                        searchParams.append(key, encodeURIComponent(value.join('|')));
                    }
                } else {
                    searchParams.append(key, encodeURIComponent(value));
                }
            } else {
                searchParams.append(key, value);
            }
        });

        return searchParams.toString();
    }
};

var isDateWithinInterval = exports.isDateWithinInterval = function isDateWithinInterval(currentDate, startDate, endDate) {
    var curr = Date.parse(currentDate);
    var start = Date.parse(startDate);
    var end = Date.parse(endDate);

    return start <= curr && end >= curr;
};

var isDateBeforeInterval = exports.isDateBeforeInterval = function isDateBeforeInterval(currentDate, startDate) {
    var curr = Date.parse(currentDate);
    var start = Date.parse(startDate);

    return curr < start;
};

var differential = 0;
function incrementDifferential() {
    differential += 1000;
}
setInterval(incrementDifferential, 1000);

var getCurrentDate = exports.getCurrentDate = function getCurrentDate() {
    var urlParams = new URLSearchParams(window.location.search);
    var servertime = parseInt(urlParams.get('servertime'), 10);
    var currDate = servertime ? new Date(servertime + differential) : new Date();
    return currDate;
};

var getEventBanner = exports.getEventBanner = function foo(startDate, endDate, bannerMap) {
    var currDate = getCurrentDate();
    if (isDateWithinInterval(currDate, startDate, endDate)) {
        return bannerMap.live;
    } else if (isDateBeforeInterval(currDate, startDate)) {
        return bannerMap.upcoming;
    }
    return bannerMap.onDemand;
};

function getTransitions(cardsPtr) {
    var cards = [].concat(_toConsumableArray(cardsPtr));
    var currentDate = getCurrentDate();
    var transitions = new _priorityQueue.MinPriorityQueue();

    /* eslint-disable no-plusplus */
    for (var i = 0; i < cards.length; i++) {
        var priority = Date.parse(cards[i].startDate) - currentDate;
        if (priority && priority > 0) {
            transitions.enqueue(cards[i], priority);
        }
        var endPriority = Date.parse(Date.parse(cards[i].endDate) - currentDate);
        if (cards[i].endDate && endPriority > 0) {
            transitions.enqueue(null, endPriority);
        }
    }
    return transitions;
}

var getLinkTarget = exports.getLinkTarget = function getLinkTarget(link) {
    var ctaAction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var domain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window.location.hostname;

    if (ctaAction) {
        return ctaAction;
    }
    var target = '_blank';
    try {
        var _ref5 = new URL(link),
            _ref5$hostname = _ref5.hostname,
            linkHostName = _ref5$hostname === undefined ? '' : _ref5$hostname;

        if (domain === linkHostName) {
            target = '_self';
        }
    } catch (e) {
        /* eslint-disable-line no-empty */
    }
    return target;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;
	var nativeCodeString = '[native code]';

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
					classes.push(arg.toString());
					continue;
				}

				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useRegistered = exports.useURLState = exports.useLazyLoading = exports.useConfig = exports.useExpandable = exports.useWindowDimensions = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(0);

var _general = __webpack_require__(2);

var _consonant = __webpack_require__(24);

var _contexts = __webpack_require__(47);

var _constants = __webpack_require__(6);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable */
function debounce(fn, wait) {
    var timeout = void 0;

    var cancel = function cancel() {
        if (timeout) {
            clearTimeout(timeout);
        }
    };

    // Return non-arrow func to preserve this context
    var debounceFunc = function debounceFunc() {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var functionCall = function functionCall() {
            return fn.apply(_this, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, wait);
    };

    debounceFunc.cancel = cancel;

    return debounceFunc;
};
/* eslint-enable */

/**
 * @typedef {function(): {Int, Int}} WindowDimensionsState - Current Window Dimensions
 * @description — Handles debouncing when window is re-sized
 *
 * @type {function(): {Int, Int}} WindowDimensions
 */
var useWindowDimensions = exports.useWindowDimensions = function useWindowDimensions() {
    var getWindowDimensions = function getWindowDimensions() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    };

    var _useState = (0, _react.useState)(getWindowDimensions()),
        _useState2 = _slicedToArray(_useState, 2),
        windowDimensions = _useState2[0],
        setWindowDimensions = _useState2[1];

    (0, _react.useEffect)(function () {
        var handleResize = debounce(function () {
            return setWindowDimensions(getWindowDimensions());
        });

        window.addEventListener('resize', handleResize);
        return function () {
            return window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowDimensions;
};

/**
 * @typedef {String} OpenDropdownState - Id of a selected dropdown
 * @description — Passed in Context Provider So All Nested Components can be in sync
 *
 * @typedef {Function} OpenDropdownStateSetter - handleToggle sets dropdown state
 * @description - This handles keeping multiple popup states in sync
 *
 * @type {[String, Function]} OpenDropdown
 */
var useExpandable = exports.useExpandable = function useExpandable(dropdownId) {
    var _useContext = (0, _react.useContext)(_contexts.ExpandableContext),
        openDropdown = _useContext.value,
        setOpenDropdown = _useContext.setValue;

    var handleToggle = (0, _react.useCallback)(function (e) {
        e.stopPropagation();
        if (openDropdown === dropdownId) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdownId);
        }
    }, [setOpenDropdown, openDropdown]);

    return [openDropdown, handleToggle];
};

/**
 * @typedef {Function} ConfigStateSetter
 * @description - Configs are grabbed from Authoring Dialog and passed into React Component
 *
 * @type {[Number, Function]} Config
 */
var useConfig = exports.useConfig = function useConfig() {
    var config = (0, _react.useContext)(_contexts.ConfigContext);
    return (0, _react.useCallback)((0, _consonant.makeConfigGetter)(config), [config]);
};

/**
 * @typedef {Image} LazyLoadedImageState
 * @description — Has image as state after image is lazy loaded
 *
 * @typedef {Function} LazyLoadedImageStateSetter
 * @description - Sets state once image is lazy loaded
 *
 * @type {[Image]} LazyLoadedImage
 */
var useLazyLoading = exports.useLazyLoading = function useLazyLoading(imageRef, image) {
    var options = {
        rootMargin: _constants.ROOT_MARGIN_DEFAULT
    };

    var _useState3 = (0, _react.useState)(''),
        _useState4 = _slicedToArray(_useState3, 2),
        lazyLoadImage = _useState4[0],
        setLazyLoadImage = _useState4[1];

    var _useState5 = (0, _react.useState)(''),
        _useState6 = _slicedToArray(_useState5, 2),
        intersectionImage = _useState6[0],
        setIntersectionImage = _useState6[1];

    var imageObserver = new IntersectionObserver(function (elements) {
        if (elements[0].intersectionRatio !== 0) {
            setIntersectionImage(image);
        }
    }, options);

    (0, _react.useEffect)(function () {
        var img = void 0;
        if (intersectionImage) {
            img = new Image();

            img.src = intersectionImage;
            img.onload = function () {
                setLazyLoadImage(intersectionImage);
            };
        }
        return function () {
            if (img) {
                img.onload = function () {};
            }
        };
    }, [intersectionImage]);

    (0, _react.useEffect)(function () {
        if (imageRef.current) {
            imageObserver.observe(imageRef.current);
        }
        return function () {
            imageObserver.unobserve(imageRef.current);
        };
    }, [imageRef]);

    return [lazyLoadImage];
};

/**
 * Create a state that is sync with url search param.
 *
 * @type {Object, Function, Function]} urlState, handleSetQuery, handleClearQuery
 */
var useURLState = exports.useURLState = function useURLState() {
    var _window = window,
        _window$location = _window.location,
        search = _window$location.search,
        pathname = _window$location.pathname;

    var _useState7 = (0, _react.useState)(_general.qs.parse(search)),
        _useState8 = _slicedToArray(_useState7, 2),
        urlState = _useState8[0],
        setUrlState = _useState8[1];

    var handleSetQuery = (0, _react.useCallback)(function (key, value) {
        setUrlState(function (origin) {
            if (!value || Array.isArray(value) && !value.length) {
                var cloneOrigin = _extends({}, origin);
                delete cloneOrigin[key];

                return cloneOrigin;
            }

            return _extends({}, origin, _defineProperty({}, key, value));
        });
    }, []);

    var handleClearQuery = (0, _react.useCallback)(function () {
        setUrlState({});
    }, []);

    (0, _react.useEffect)(function () {
        var searchString = _general.qs.stringify(urlState, { array: 'comma' });
        var urlString = '' + pathname + (searchString ? '?' : '') + searchString;

        window.history.replaceState(null, '', urlString);
    }, [urlState]);

    return [urlState, handleSetQuery, handleClearQuery];
};

var useRegistered = exports.useRegistered = function useRegistered() {
    var _useState9 = (0, _react.useState)(false),
        _useState10 = _slicedToArray(_useState9, 2),
        registered = _useState10[0],
        setRegistered = _useState10[1];

    function isRegisteredForEvent() {
        var fedsData = (0, _general.getByPath)(window, 'feds.data', null);
        var eventName = (0, _general.getByPath)(fedsData, 'eventName', null);
        var eventData = eventName && fedsData[eventName] ? fedsData[eventName] : null;
        var isUserRegistered = eventData ? eventData.isRegistered : null;

        var isRegisteredForMax = (0, _general.getByPath)(fedsData, 'isRegisteredForMax', null);

        return !!(isUserRegistered || isRegisteredForMax);
    }

    (0, _react.useEffect)(function () {
        if (!registered) {
            var fedsUtilities = (0, _general.getByPath)(window, 'feds.utilities', null);
            var getEventData = fedsUtilities ? fedsUtilities.getEventData : null;
            if (getEventData) {
                getEventData().then(function () {
                    var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                    var isRegistered = response.isRegistered;

                    if (isRegistered) {
                        setRegistered(true);
                    }
                }).catch(function () {
                    var newIsRegistered = isRegisteredForEvent();
                    if (newIsRegistered) {
                        setRegistered(newIsRegistered);
                    }
                });
            }
        }
    }, [registered]);

    return registered;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cardType = exports.footerType = exports.overlaysType = exports.contentAreaType = exports.stylesType = exports.footerRightType = exports.footerCenterType = exports.footerLeftType = exports.tagsType = undefined;

var _propTypes = __webpack_require__(1);

var appliesToType = {
    id: _propTypes.string
};

var showCardType = {
    from: _propTypes.string,
    until: _propTypes.string
};

var tagsType = exports.tagsType = {
    id: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.number])
};
var searchType = {};

var footerLeftType = exports.footerLeftType = {
    src: _propTypes.string,
    type: _propTypes.string,
    term: _propTypes.string,
    text: _propTypes.string,
    label: _propTypes.string,
    price: _propTypes.string,
    color: _propTypes.string,
    linkHint: _propTypes.string,
    percentage: _propTypes.string,
    openInNewTab: _propTypes.bool,
    srcAltText: _propTypes.string,
    totalStars: _propTypes.number,
    starsFilled: _propTypes.number,
    saveCardIcon: _propTypes.string,
    cardSaveText: _propTypes.string,
    unsaveCardIcon: _propTypes.string,
    cardUnsaveText: _propTypes.string,
    completionText: _propTypes.string
};

var footerCenterType = exports.footerCenterType = {
    src: _propTypes.string,
    type: _propTypes.string,
    href: _propTypes.string,
    text: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.number])
};

var footerRightType = exports.footerRightType = {
    src: _propTypes.string,
    type: _propTypes.string,
    style: _propTypes.string,
    endTime: _propTypes.string,
    startTime: _propTypes.string,
    text: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.number])
};

var overlaysBannerType = {
    icon: _propTypes.string,
    fontColor: _propTypes.string,
    description: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.array]),
    backgroundColor: _propTypes.string
};

var overlaysLogoType = {
    src: _propTypes.string,
    alt: _propTypes.string,
    borderColor: _propTypes.string,
    backgroundColor: _propTypes.string
};

var overlaysLabelType = {
    description: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.array])
};

var overlaysVideoButtonType = {
    url: _propTypes.string
};

var stylesType = exports.stylesType = {
    typeOverride: _propTypes.string,
    backgroundImage: _propTypes.string
};

var contentAreaType = exports.contentAreaType = {
    detailText: _propTypes.string,
    title: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.array]),
    description: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.array]),
    dateDetailText: (0, _propTypes.shape)({
        endTime: _propTypes.string,
        startTime: _propTypes.string
    })
};

var overlaysType = exports.overlaysType = {
    logo: (0, _propTypes.shape)(overlaysLogoType),
    label: (0, _propTypes.shape)(overlaysLabelType),
    banner: (0, _propTypes.shape)(overlaysBannerType),
    videoButton: (0, _propTypes.shape)(overlaysVideoButtonType)
};

var footerType = exports.footerType = {
    divider: _propTypes.bool,
    isFluid: _propTypes.bool,
    left: (0, _propTypes.arrayOf)((0, _propTypes.shape)(footerLeftType)),
    right: (0, _propTypes.arrayOf)((0, _propTypes.shape)(footerRightType)),
    center: (0, _propTypes.arrayOf)((0, _propTypes.shape)(footerCenterType))
};

var cardType = exports.cardType = {
    id: _propTypes.string,
    title: _propTypes.string,
    cardDate: _propTypes.string,
    styles: (0, _propTypes.shape)(stylesType),
    search: (0, _propTypes.shape)(searchType),
    showCard: (0, _propTypes.shape)(showCardType),
    overlays: (0, _propTypes.shape)(overlaysType),
    tags: (0, _propTypes.arrayOf)((0, _propTypes.shape)(tagsType)),
    footer: (0, _propTypes.arrayOf)((0, _propTypes.shape)(footerType)),
    contentArea: (0, _propTypes.shape)(contentAreaType),
    appliesTo: (0, _propTypes.arrayOf)((0, _propTypes.shape)(appliesToType))
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Minimal viewport width to fit desktops/laptops
 * @type {Number}
 */
var DESKTOP_MIN_WIDTH = exports.DESKTOP_MIN_WIDTH = 1200;

/**
 * Minimal viewport width to fit tablets
 * @type {Number}
 */
var TABLET_MIN_WIDTH = exports.TABLET_MIN_WIDTH = 768;

/**
 * Maximum allowed top filters displayed
 * before "More Filters" button shows up
 * @type {Number}
 */
var MAX_TRUNCATED_FILTERS = exports.MAX_TRUNCATED_FILTERS = 3;

/**
 * Minimum top filters needed to display blurred effect
 * on filters wrapper
 * @type {Number}
 */
var MIN_FILTERS_SHOW_BG = exports.MIN_FILTERS_SHOW_BG = 3;

/**
 * Maximum allowed card description length
 * after which a truncation will take place
 * @type {Number}
 */
var TRUNCATE_TEXT_QTY = exports.TRUNCATE_TEXT_QTY = 200;

/**
 * Quantity of the pagination items to display
 * for mobile and desktop breakpoints
 * @type {Object}
 */
var PAGINATION_COUNT = exports.PAGINATION_COUNT = {
    DESKTOP: 10,
    MOBILE: 4
};

/**
 * Available filtering types
 * @type {Object}
 */
var FILTER_TYPES = exports.FILTER_TYPES = {
    AND: 'and',
    OR: 'or',
    XOR: 'xor'
};

/**
 * Available filter panel types
 * @type {Object}
 */
var FILTER_PANEL = exports.FILTER_PANEL = {
    LEFT: 'left',
    TOP: 'top'
};

/**
 * Available sorting types
 * @type {Object}
 */
var SORT_TYPES = exports.SORT_TYPES = {
    DATEASC: 'dateasc',
    DATEDESC: 'datedesc',
    MODIFIEDDESC: 'modifieddesc',
    MODIFIEDASC: 'modifiedasc',
    EVENTSORT: 'eventsort',
    FEATURED: 'featured',
    TITLEASC: 'titleasc',
    TITLEDESC: 'titledesc',
    RANDOM: 'random'
};

/**
 * Possible Locations of the Sort Popup
 * @type {String}
 */
var SORT_POPUP_LOCATION = exports.SORT_POPUP_LOCATION = {
    LEFT: 'left',
    RIGHT: 'right'
};

/**
 * Available infobit types
 * @type {Object}
 */
var INFOBIT_TYPE = exports.INFOBIT_TYPE = {
    PRICE: 'price',
    BUTTON: 'button',
    ICON_TEXT: 'icon-with-text',
    LINK_ICON: 'link-with-icon',
    TEXT: 'text',
    ICON: 'icon',
    LINK: 'link',
    PROGRESS: 'progress-bar',
    RATING: 'rating',
    BOOKMARK: 'bookmark',
    DATE: 'date-interval',
    GATED: 'gated'
};

/**
 * Available themes class names
 * @type {Object}
 */
var THEME_TYPE = exports.THEME_TYPE = {
    LIGHT: 'light',
    DARK: 'dark',
    DARKEST: 'darkest'
};

/**
 * Default authoring constants
 * @type {Object}
 */
var DEFAULT_CONFIG = exports.DEFAULT_CONFIG = {
    collection: {
        mode: '',
        layout: {
            type: '3up',
            gutter: '4x',
            container: '32Margin'
        },
        button: {
            style: ''
        },
        resultsPerPage: 9,
        endpoint: '',
        title: '',
        totalCardLimit: -1,
        cardStyle: '',
        displayTotalResults: true,
        totalResultsText: '{} results',
        i18n: {
            prettyDateIntervalFormat: '{LLL} {dd} | {timeRange} {timeZone}',
            totalResultsText: '{total} results',
            title: '',
            onErrorTitle: 'Sorry there was a system error.',
            onErrorDescription: 'Please try reloading the page or try coming back to the page another time.'
        }
    },
    featuredCards: [],
    hideCtaIds: [],
    header: {
        enabled: false
    },
    filterPanel: {
        enabled: true,
        eventFilter: '',
        type: 'left',
        filters: [],
        clearAllFiltersText: 'Clear all',
        clearFilterText: 'Clear',
        filterLogic: 'and',
        leftPanelHeader: 'Refine the results',
        topPanel: {
            mobile: {
                blurFilters: true
            }
        }
    },
    sort: {
        enabled: true,
        defaultSort: 'featured',
        options: []
    },
    pagination: {
        enabled: true,
        type: 'loadMore',
        loadMoreButton: {
            style: 'primary',
            useThemeThree: false
        },
        paginatorQuantityText: 'Showing {}-{} of {} Results',
        paginatorPrevLabel: 'Previous',
        paginatorNextLabel: 'Next',
        loadMoreButtonText: 'Load more',
        loadMoreQuantityText: '{} of {} displayed'
    },
    bookmarks: {
        enabled: true,
        bookmarkOnlyCollection: false,
        cardSavedIcon: '',
        cardUnsavedIcon: '',
        selectBookmarksIcon: '',
        unselectBookmarksIcon: '',
        saveCardText: 'Save card',
        unsaveCardText: 'Unsave card',
        bookmarksFilterTitle: 'My favorites'
    },
    search: {
        enabled: true,
        inputPlaceholderText: 'Search here...',
        leftPanelTitle: 'Search',
        searchFields: ['title', 'description'],
        i18n: {
            noResultsTitle: 'No results found',
            noResultsDescription: 'We couldn\u2019t find any results for your {query}.{break}\n            Check your spelling or try broadening your search.'
        }
    },
    language: 'en'
};

/**
 * Default number of cards to display per page
 * @type {Number}
 */
var DEFAULT_SHOW_ITEMS_PER_PAGE = exports.DEFAULT_SHOW_ITEMS_PER_PAGE = 8;

/**
 * Available card types
 * @type {Object}
 */
var CARD_STYLES = exports.CARD_STYLES = {
    WIDE: '1:2',
    SQUARE: '3:4',
    FULL: 'full-card',
    HALF_HEIGHT: 'half-height',
    DOUBLE_WIDE: 'double-wide',
    CUSTOM: 'custom-card',
    PRODUCT: 'product',
    TEXT: 'text-card'
};

/**
 * Available grid types
 * @type {Object}
 */
var GRID_TYPE = exports.GRID_TYPE = {
    TWO_UP: '2up',
    THREE_UP: '3up',
    FOUR_UP: '4up',
    FIVE_UP: '5up'
};

/**
 * Available gutter sizes
 * @type {Object}
 */
var GUTTER_SIZE = exports.GUTTER_SIZE = {
    GUTTER_1_X: '1x',
    GUTTER_2_X: '2x',
    GUTTER_3_X: '3x',
    GUTTER_4_X: '4x'
};

/**
 * Available layout container types
 * @type {Object}
 */
var LAYOUT_CONTAINER = exports.LAYOUT_CONTAINER = {
    SIZE_83_VW: '83Percent',
    SIZE_1200_PX: '1200MaxWidth',
    SIZE_1600_PX: '1600MaxWidth',
    SIZE_100_VW_32_MARGIN: '32Margin',
    CAROUSEL: 'carousel'
};

/**
 * Available loader sizes
 * @type {Object}
 */
var LOADER_SIZE = exports.LOADER_SIZE = {
    MEDIUM: 'medium',
    BIG: 'big'
};

/**
 * Used for lazy-loading - lets the lazy load of the image
 * start before it is scrolled into the viewport.
 * @type {String}
 */
var ROOT_MARGIN_DEFAULT = exports.ROOT_MARGIN_DEFAULT = '500px';
var ONE_SECOND_DELAY = exports.ONE_SECOND_DELAY = 1000;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LinkBlockerType = {
    link: _propTypes.string,
    target: _propTypes.string
};

var defaultProps = {
    link: '',
    target: ''
};

/**
 * Link Blocker
 *
 * @component
 * @example
 * const props= {
    link: String,
    target: String,
 * }
 * return (
 *   <LinkBlocker {...props}/>
 * )
 */
var LinkBlocker = function LinkBlocker(props) {
    var link = props.link,
        target = props.target;

    return (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        _react2.default.createElement('a', {
            href: link,
            target: target,
            rel: 'noopener noreferrer',
            tabIndex: '0',
            className: 'consonant-LinkBlocker' })
    );
};

LinkBlocker.propTypes = LinkBlockerType;
LinkBlocker.defaultProps = defaultProps;

exports.default = LinkBlocker;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * cuid.js
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 * Extracted from CLCTR
 *
 * Copyright (c) Eric Elliott 2012
 * MIT License
 */

var fingerprint = __webpack_require__(45);
var pad = __webpack_require__(23);
var getRandomValue = __webpack_require__(46);

var c = 0,
  blockSize = 4,
  base = 36,
  discreteValues = Math.pow(base, blockSize);

function randomBlock () {
  return pad((getRandomValue() *
    discreteValues << 0)
    .toString(base), blockSize);
}

function safeCounter () {
  c = c < discreteValues ? c : 0;
  c++; // this is not subliminal
  return c - 1;
}

function cuid () {
  // Starting with a lowercase letter makes
  // it HTML element ID friendly.
  var letter = 'c', // hard-coded allows for sequential access

    // timestamp
    // warning: this exposes the exact date and time
    // that the uid was created.
    timestamp = (new Date().getTime()).toString(base),

    // Prevent same-machine collisions.
    counter = pad(safeCounter().toString(base), blockSize),

    // A few chars to generate distinct ids for different
    // clients (so different computers are far less
    // likely to generate the same id)
    print = fingerprint(),

    // Grab some more chars from Math.random()
    random = randomBlock() + randomBlock();

  return letter + timestamp + counter + print + random;
}

cuid.slug = function slug () {
  var date = new Date().getTime().toString(36),
    counter = safeCounter().toString(36).slice(-4),
    print = fingerprint().slice(0, 1) +
      fingerprint().slice(-1),
    random = randomBlock().slice(-2);

  return date.slice(-2) +
    counter + print + random;
};

cuid.isCuid = function isCuid (stringToCheck) {
  if (typeof stringToCheck !== 'string') return false;
  if (stringToCheck.startsWith('c')) return true;
  return false;
};

cuid.isSlug = function isSlug (stringToCheck) {
  if (typeof stringToCheck !== 'string') return false;
  var stringLength = stringToCheck.length;
  if (stringLength >= 7 && stringLength <= 10) return true;
  return false;
};

cuid.fingerprint = fingerprint;

module.exports = cuid;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Gets the Localized Local Time Zone
 * @param {Date} someTimeUTC - An authored time in UTC
 * @returns {Date} - Locale Time Zone in abbreviated named offset
 * @example - EST
 */
var getLocalTimeZone = function getLocalTimeZone(someTimeUTC, someLocale) {
  return new Date(someTimeUTC).toLocaleTimeString(someLocale, { timeZoneName: 'short' }).split(' ').slice(-1)[0];
};

/**
 * Gets the Local Time Interval
 * @param {Date} startDateUTC - An authored start date in UTC
 * @param {Date} endDateUTC - An authored end date in UTC
 * @param {String} locale - Locale to translate things to
 * @returns {Date} - Time Interval in localized 24-hour time
 * @example - 13:00 - 14:45
 */
var getTimeInterval = function getTimeInterval(startTimeUTC, endTimeUTC, someLocale) {
  var options = { hour: '2-digit', minute: '2-digit' };

  var startTime = new Date(startTimeUTC).toLocaleTimeString(someLocale, options);
  var endTime = new Date(endTimeUTC).toLocaleTimeString(someLocale, options);

  return startTime + ' - ' + endTime;
};

/**
 * Gets the localized day
 * @param {Date} someTimeUTC - An authored time in UTC
 * @returns {Date} - A day of the month, padded to 2
 * @example - 06
 */
var getDay = function getDay(someTimeUTC, someLocale) {
  return new Date(someTimeUTC).toLocaleDateString(someLocale, { day: '2-digit' });
};

/**
 * Gets the localized month
 * @param {Date} someTimeUTC - An authored time in UTC
 * @returns {Date} - Month as an abbreviated localized string
 * @example - Aug
 */
var getMonth = function getMonth(someTimeUTC, someLocale) {
  return new Date(someTimeUTC).toLocaleDateString(someLocale, { month: 'short' });
};

/**
 * Gets the localized day of the week
 * @param {Date} someTimeUTC - An authored time in UTC
 * @returns {Date} - A day of the month, padded to 2
 * @example - Tue
 */
var getDayOfTheWeek = function getDayOfTheWeek(someTimeUTC, someLocale) {
  return new Date(someTimeUTC).toLocaleDateString(someLocale, { weekday: 'short' });
};

/**
 * Gets Date Interval for Infobit in pretty format
 * @param {Date} startDateUTC - An authored start date in UTC
 * @param {Date} endDateUTC - An authored end date in UTC
 * @param {String} locale - Locale to translate things to
 * @param {String} i18nFormat - Format from AEM on how to render date
 * @returns {String} - Date interval in pretty format
 * @example - Oct 20 | 13:00 - 14:45 PDT
 */
var getPrettyDateInterval = function getPrettyDateInterval(startDateUTC, endDateUTC, locale, i18nFormat) {
  return i18nFormat.replace('{LLL}', getMonth(startDateUTC, locale)).replace('{dd}', getDay(startDateUTC, locale)).replace('{ddd}', getDayOfTheWeek(startDateUTC, locale)).replace('{timeRange}', getTimeInterval(startDateUTC, endDateUTC, locale)).replace('{timeZone}', getLocalTimeZone(startDateUTC, locale));
};

exports.default = getPrettyDateInterval;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFeaturedCards = exports.getRandomSort = exports.getUpdatedCardBookmarkData = exports.processCards = exports.getCardsMatchingSearch = exports.getEventSort = exports.getDateDescSort = exports.getDateAscSort = exports.getFeaturedSort = exports.getModifiedAscSort = exports.getModifiedDescSort = exports.getTitleDescSort = exports.getTitleAscSort = exports.hasTag = exports.getCardsMatchingQuery = exports.highlightCard = exports.getFilteredCards = exports.getActivePanels = exports.getActiveFilterIds = exports.getBookmarkedCards = exports.getCollectionCards = exports.getTotalPages = exports.getNumCardsToShow = exports.shouldDisplayPaginator = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _immer = __webpack_require__(81);

var _immer2 = _interopRequireDefault(_immer);

var _rendering = __webpack_require__(22);

var _general = __webpack_require__(2);

var _eventSort = __webpack_require__(82);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Needs to be explicitly called by immer - Needed for IE 11 support
 * @type {Function}
 */
(0, _immer.enableES5)();

/**
 * Determines whether paginator component should display
 * @param {Boolean} enabled - Authored flag whether component should display or not
 * @param {Number} totalCardLimit - Authored limit for how many cards should display
 * @param {Number} totalResults - Total cards in collection
 * @returns {Boolean} - Whether Paginator should display or not
 */
var shouldDisplayPaginator = exports.shouldDisplayPaginator = function shouldDisplayPaginator(enabled, totalCardLimit, totalResults) {
    var totalCardLimitNotZero = totalCardLimit > 0;
    var cardLengthExceedsDisplayLimit = totalResults > totalCardLimit;

    return enabled && totalCardLimitNotZero && !cardLengthExceedsDisplayLimit;
};

/**
 * Determines how many cards to show
 * @param {Number} resultsPerPage - How many cards should show per page (Authored Field)
 * @param {Number} currentPage - Current page user is on
 * @param {Number} totalResults - Total cards in collection
 * @returns {Number} - Number of cards to show
 */
var getNumCardsToShow = exports.getNumCardsToShow = function getNumCardsToShow(resultsPerPage, currentPage, totalResults) {
    return Math.min(resultsPerPage * currentPage, totalResults);
};

/**
 * Gets Total Page Count (For Paginator Component)
 * @param {Number} resultsPerPage - How many cards should show per page (Authored Field)
 * @param {Number} totalResults - Total cards in collection
 * @returns {Number} - Total number of pages
 */
var getTotalPages = exports.getTotalPages = function getTotalPages(resultsPerPage, totalResults) {
    if (resultsPerPage === 0) return 0;
    return Math.ceil(totalResults / resultsPerPage);
};

/**
 * Determines whether to show collection cards or bookmarked cards only
 * (If author chooses bookmarks only collection)

 * @param {Boolean} showBookmarksOnly - Authored Flag to Force Card Collection To
 * Only Show Bookmarks
 * @param {Array} bookmarkedCards - Bookmarked cards only
 * @param {Array} collectionCards - All cards
 * @returns {Array} - Which collection of cards to show
 */
var getCollectionCards = exports.getCollectionCards = function getCollectionCards(showBookmarksOnly, bookmarkedCards, collectionCards) {
    return showBookmarksOnly ? bookmarkedCards : collectionCards;
};

/**
 * Filter to get all bookmarked cards
 * @param {Array} collectionCards - All cards
 * @returns {Array} - All bookmarked cards
 */
var getBookmarkedCards = exports.getBookmarkedCards = function getBookmarkedCards(collectionCards) {
    return collectionCards.filter(function (card) {
        return card.isBookmarked;
    });
};

/**
 * Gets all filters checked by a user
 * @param {Array} filters - All filters on page
 * @returns {Array} - All checked filters by user
 */
var getActiveFilterIds = exports.getActiveFilterIds = function getActiveFilterIds(filters) {
    return (0, _general.chainFromIterable)(filters.map(function (f) {
        return f.items;
    })).filter(function (item) {
        return item.selected;
    }).map(function (item) {
        return item.id;
    });
};

/**
 * Gets all filter panels with filters checked by a user
 * @param {Array} activeFilters - All filters checked
 * @returns {Set} - Set of filter panels with filters checked on the page
 */
var getActivePanels = exports.getActivePanels = function getActivePanels(activeFilters) {
    return new Set(activeFilters.map(function (filter) {
        return filter.replace(/\/.*$/, '');
    }));
};

/**
 * Helper method to dermine whether author chose XOR or AND type filtering
 * @param {String} filterType - Filter used in collection
 * @param {Object} filterTypes - All possible filters
 * @returns {Boolean} - Whether collection is using a XOR or AND type filtering
 */
var getUsingXorAndFilter = function getUsingXorAndFilter(filterType, filterTypes) {
    return filterType === filterTypes.XOR || filterType === filterTypes.AND;
};

/**
 * Helper method to dermine whether author chose OR type filtering
 * @param {String} filterType - Filter used in collection
 * @param {Object} filterTypes - All possible filters
 * @returns {Boolean} - Whether collection is using OR type filtering
 */
var getUsingOrFilter = function getUsingOrFilter(filterType, filterTypes) {
    return filterType === filterTypes.OR;
};

/**
 * Will return all cards that match a set of filters
 * @param {Array} cards - All cards in the collection
 * @param {Array} activeFilters - All filters selected by user
 * @param {Array} activePanels - Active filters panels selected by user
 * @param {String} filterType - Filter used in collection
 * @param {Object} filterTypes - All possible filters
 * @returns {Array} - All cards that match filter options
 */
var getFilteredCards = exports.getFilteredCards = function getFilteredCards(cards, activeFilters, activePanels, filterType, filterTypes) {
    var activeFiltersSet = new Set(activeFilters);

    var usingXorAndFilter = getUsingXorAndFilter(filterType, filterTypes);
    var usingOrFilter = getUsingOrFilter(filterType, filterTypes);

    if (activeFiltersSet.size === 0) return cards;

    return cards.filter(function (card) {
        if (!card.tags) {
            return false;
        }

        var tagIds = new Set(card.tags.map(function (tag) {
            return tag.id;
        }));

        if (usingXorAndFilter) {
            return (0, _general.isSuperset)(tagIds, activeFiltersSet);
        } else if (usingOrFilter && activePanels.size < 2) {
            return (0, _general.intersection)(tagIds, activeFiltersSet).size;
        } else if (usingOrFilter) {
            // check if card' tags panels include all panels with selected filters
            var tagPanels = new Set(card.tags.map(function (tag) {
                return tag.parent.id || tag.id.replace(/\/.*$/, '');
            }));
            if (!(0, _general.isSuperset)(tagPanels, activePanels)) return false;

            // check if card' tags include all panels with selected filters
            var allPanelsMatch = true;
            // eslint-disable-next-line no-restricted-syntax

            var _loop = function _loop(panel) {
                var filtersCheckedInPanel = new Set([].concat(_toConsumableArray(activeFiltersSet)).filter(function (id) {
                    return id.includes(panel, 0);
                }));
                if (!(0, _general.intersection)(tagIds, filtersCheckedInPanel).size) {
                    allPanelsMatch = false;
                }
            };

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = activePanels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var panel = _step.value;

                    _loop(panel);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return allPanelsMatch;
        }
        throw new Error('Unrecognized filter type: ' + filterType);
    });
};

/**
 * If a card matches a search query, this method will highlight it
 * @param {Array} baseCard - Card to highlight
 * @param {Array} searchField - Field that matches Query
 * @param {String} query - The users search query
 * @returns {Card} The highlighted caard
 */
var highlightCard = exports.highlightCard = function highlightCard(baseCard, searchField, query) {
    return (0, _immer2.default)(baseCard, function (draftCard) {
        var searchFieldValue = (0, _general.getByPath)(draftCard, searchField, null);
        if (searchFieldValue === null || searchFieldValue === '') return;
        var highlightedSearchFieldValue = (0, _rendering.HighlightSearchField)(searchFieldValue, query);
        (0, _general.setByPath)(draftCard, searchField, highlightedSearchFieldValue);
    });
};

/**
 * If a card matches a search query, this method will highlight it
 * @param {Array} searchField - Field that matches Query
 * @param {Array} card - Card to check
 * @param {String} query - The users search query
 * @returns {Boolean} If the card matches the user's search query
 */
var cardMatchesQuery = function cardMatchesQuery(searchField, card, searchQuery) {
    var searchFieldValue = (0, _general.getByPath)(card, searchField, '');
    var cleanSearchFieldValue = (0, _general.sanitizeText)(searchFieldValue);
    return cleanSearchFieldValue.includes(searchQuery);
};

/**
 * Helper to implement Set() data structure w/ Vanilla Arrays
 * Would've used new Set(), but polyfill has bug in IE11 converting Array.from(new Set())
 *
 * @param {Array} cards
 * @return {Array} - Unique Card Set from Cards (filtering based off unique card ids)
 */
var getUniqueCardSet = function getUniqueCardSet(cards) {
    var uniqueCardSet = [];
    cards.forEach(function (card) {
        var cardNotInSet = uniqueCardSet.findIndex(function (element) {
            return element.id === card.id;
        }) <= -1;
        if (cardNotInSet) {
            uniqueCardSet.push(card);
        }
    });
    return uniqueCardSet;
};

/**
 * Gets all cards that matches a users search query
 * @param {Array} cards - All cards in the card collection
 * @param {Array} searchFields - All authored search fields to check
 * @param {String} query - The users search query
 * @returns {Array} - All cards that match the user's query for a given set of search fields
 */
var getCardsMatchingQuery = exports.getCardsMatchingQuery = function getCardsMatchingQuery(cards, searchFields, query) {
    var cardsMatchingQuery = [];
    cards.forEach(function (card) {
        searchFields.forEach(function (searchField) {
            if (cardMatchesQuery(searchField, card, query)) {
                cardsMatchingQuery.push(card);
            }
        });
    });
    return getUniqueCardSet(cardsMatchingQuery);
};
/**
 * @func hasTag
 * @desc Does current entity have a specific tag?
 * @param {RegExp} compare a regEx pattern to test for
 * @param {Array} tags an array of tags
 */
var hasTag = exports.hasTag = function hasTag(compare) {
    var tags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (!tags.length || compare.constructor.name !== 'RegExp') return false;

    return tags.some(function () {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$id = _ref.id,
            id = _ref$id === undefined ? '' : _ref$id;

        return id && compare.test(id);
    });
};

/**
 * Returns all cards title sorted (A-Z)
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - All cards sorted by title
 */
var getTitleAscSort = exports.getTitleAscSort = function getTitleAscSort(cards) {
    return cards.sort(function (cardOne, cardTwo) {
        var cardOneTitle = (0, _general.getByPath)(cardOne, 'contentArea.title');
        var cardTwoTitle = (0, _general.getByPath)(cardTwo, 'contentArea.title');
        return cardOneTitle.localeCompare(cardTwoTitle);
    });
};

/**
 * Returns all cards title sorted (Z-A)
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - All cards sorted by title
 */
var getTitleDescSort = exports.getTitleDescSort = function getTitleDescSort(cards) {
    return getTitleAscSort(cards).reverse();
};

/**
 * Returns all cards sorted by date modified newest to oldest
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - All cards sorted by title
 */
var getModifiedDescSort = exports.getModifiedDescSort = function getModifiedDescSort(cards) {
    return cards.sort(function (cardOne, cardTwo) {
        var cardOneModDate = (0, _general.getByPath)(cardOne, 'modifiedDate');
        var cardTwoModDate = (0, _general.getByPath)(cardTwo, 'modifiedDate');
        if (cardOneModDate && cardTwoModDate) {
            return cardTwoModDate.localeCompare(cardOneModDate);
        }
        return 0;
    });
};

/**
 * Returns all cards sorted by date modified oldest to newest
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - All cards sorted by title
 */
var getModifiedAscSort = exports.getModifiedAscSort = function getModifiedAscSort(cards) {
    return getModifiedDescSort(cards).reverse();
};

/**
 * Returns all cards Featured sorted
 * This just returns the original cards returned by Chimera IO
 * Chimera IO is responsible for handling featured sort
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - Cards in the original order given by Chimera IO
 */
var getFeaturedSort = exports.getFeaturedSort = function getFeaturedSort(cards) {
    return cards;
};

/**
 * Returns all Cards Date Sorted (Old To New)
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - All cards sorted by Date
 */
var getDateAscSort = exports.getDateAscSort = function getDateAscSort(cards) {
    return cards.sort(function (cardOne, cardTwo) {
        var cardOneDate = (0, _general.getByPath)(cardOne, 'cardDate');
        var cardTwoDate = (0, _general.getByPath)(cardTwo, 'cardDate');
        if (cardOneDate && cardTwoDate) {
            return cardOneDate.localeCompare(cardTwoDate);
        }
        return 0;
    });
};

/**
 * Returns all Cards Date Sorted (New To Old)
 * @param {Array} cards - All cards in the card collection
 * @returns {Array} - All cards sorted by Date
 */
var getDateDescSort = exports.getDateDescSort = function getDateDescSort(cards) {
    return getDateAscSort(cards).reverse();
};

/**
 * @func getEventSort
 * @desc This method, if needed, sets up Timing features for a collection
 (1) Has to check each card for card.contentArea.dateDetailText.startTime
 || endTime, if neither the card gets pushed to back of stack.
 (2) There are six categories for consideration
 a. Live: Current Time > Start Time && Current Time < End Time
 b. Upcoming: Current Time < Start Time and does not have
 "OnDemand scheduled" tag which cannot show until it is onDemand
 c. "OnDemand scheduled": UpComing, and has "OnDemand scheduled" tag,
 will not be seen until it is OnDemand.
 d. OnDemand: Current Time > End Time, does not have "Live Expired" tag
 e. Live Expired: OnDemand, has "live-expired" tag, and is no longer shown.
 f. All other cards, not having startTime || endTime.
 * @param {Array} cards - All cards in the card collection
 * @param {Object} urlState - URL search/query Params.
 * @returns {Array} visibleCards
 */
var getEventSort = exports.getEventSort = function getEventSort() {
    var cards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var eventFilter = arguments[1];
    return (0, _eventSort.eventTiming)(cards, eventFilter);
};

/**
 * Gets all cards that matches a users search query
 * @param {String} query - The users search query
 * @param {Array} cards - All cards in the card collection
 * @param {Array} searchFields - All authored search fields to check
 * @returns {Array} - All cards that match the user's query for a given set of search fields
 */
var getCardsMatchingSearch = exports.getCardsMatchingSearch = function getCardsMatchingSearch(query, cards, searchFields) {
    if (!query) {
        return cards;
    }
    var searchQuery = (0, _general.sanitizeText)(query);
    var cardsMatchingQuery = getCardsMatchingQuery(cards, searchFields, searchQuery);
    return cardsMatchingQuery;
};

/**
 * Joins two sets of cards
 * @param {Array} cardSetOne - Set one of cards to join
 * @param {Array} cardSetTwo - Set two of cards to join
 * @returns {Array} - Cards sets one and two joined
 */
var joinCardSets = function joinCardSets(cardSetOne, cardSetTwo) {
    return cardSetOne.concat(cardSetTwo);
};

/**
 * Processes featured cards with raw cards received from API response
 * @param {Array} featuredCards - Authored Featured Cards
 * @param {Array} rawCards - Cards from API response
 * @returns {Array} - Set of cards processed
 */
var processCards = exports.processCards = function processCards(featuredCards, rawCards) {
    return (0, _general.removeDuplicatesByKey)(joinCardSets(featuredCards, rawCards), 'id');
};

/**
 * Helper method for effect that adds bookmark meta data to cards
 * @param {Array} cards - All cards in card collection
 * @param {Array} bookmarkedCardIds - All bookmarked card ids
 * @returns {Array} - Cards with bookmark meta data
 */
var getUpdatedCardBookmarkData = exports.getUpdatedCardBookmarkData = function getUpdatedCardBookmarkData(cards, bookmarkedCardIds) {
    return cards.map(function (card) {
        return _extends({}, card, {
            isBookmarked: bookmarkedCardIds.some(function (i) {
                return i === card.id;
            })
        });
    });
};

var cache = new Map();

/**
 * Returns a random number from [start, bound)
 * @param {int} start - Starting bound (inclusive)
 * @param {int} end - Ending bound (exclusive)
 * @returns {int} - A random integer between [start, bound)
 */
function getRandom(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}

/**
 * Returns a random sample of sampleSize from an array stream
 * @param {Array} stream - An array of items to select a random sample from
 * @param {int} sampleSize - The size of the random sample
 * @returns {Array} - A random sample from the array stream
 */
function reservoirSample(stream, sampleSize) {
    var reservoir = [];
    /* eslint-disable-next-line no-restricted-syntax */
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Object.entries(stream)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _ref2 = _step2.value;

            var _ref3 = _slicedToArray(_ref2, 2);

            var i = _ref3[0];
            var val = _ref3[1];

            if (reservoir.length < sampleSize) {
                reservoir.push(val);
            } else {
                var random = getRandom(0, i + 1);
                if (random < sampleSize) {
                    reservoir[random] = val;
                }
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return reservoir;
}

/**
 * Returns the input array randomly shuffled using the Fisher-Yates algorithm.
 *
 * @param {Array} arr - Array to be shuffled
 * @returns {Array} - The shuffled array
 */
function fischerYatesShuffle(arr) {
    var currentIndex = arr.length;
    var randomIndex = void 0;
    while (currentIndex !== 0) {
        randomIndex = getRandom(0, currentIndex);
        /* eslint-disable-next-line no-plusplus */
        currentIndex--;
        var _ref4 = [arr[randomIndex], arr[currentIndex]];
        arr[currentIndex] = _ref4[0];
        arr[randomIndex] = _ref4[1];
    }
    return arr;
}

/**
 * Returns an an array of randomly sorted cards.
 *
 * If the cards for a given card collection have already been sorted, return from cache.
 * Otherwise sort randomly and cache result.
 *
 * @param {Array} cards - cards to be randomly sorted
 * @param {int} id - Id of the card collection the cards belong to.
 * @param {int} sampleSize - sample size used for the random sample
 * @returns {Array} - An array of randomly sorted cards
 */
var getRandomSort = exports.getRandomSort = function getRandomSort(cards, id, sampleSize, reservoirSize) {
    if (!cache.get(id)) {
        var stream = fischerYatesShuffle(cards.slice(0, reservoirSize));
        var randomSample = reservoirSample(stream, sampleSize);
        cache.set(id, randomSample);
    }
    return cache.get(id);
};

var getFeaturedCards = exports.getFeaturedCards = function getFeaturedCards(ids, cards) {
    var ans = [];
    /* eslint-disable no-restricted-syntax */
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = ids[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var id = _step3.value;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = cards[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var card = _step4.value;

                    if (card.id === id) {
                        card.isFeatured = true;
                        ans.push(card);
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return ans;
};

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return k; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fragment", function() { return _; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneElement", function() { return E; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createContext", function() { return F; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createElement", function() { return y; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRef", function() { return d; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return y; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hydrate", function() { return D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isValidElement", function() { return i; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "options", function() { return l; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return B; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toChildArray", function() { return P; });
var n,l,u,i,t,r,o,f,e,c={},s=[],a=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function h(n,l){for(var u in l)n[u]=l[u];return n}function v(n){var l=n.parentNode;l&&l.removeChild(n)}function y(l,u,i){var t,r,o,f={};for(o in u)"key"==o?t=u[o]:"ref"==o?r=u[o]:f[o]=u[o];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),"function"==typeof l&&null!=l.defaultProps)for(o in l.defaultProps)void 0===f[o]&&(f[o]=l.defaultProps[o]);return p(l,f,t,r,null)}function p(n,i,t,r,o){var f={type:n,props:i,key:t,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==o?++u:o};return null==o&&null!=l.vnode&&l.vnode(f),f}function d(){return{current:null}}function _(n){return n.children}function k(n,l){this.props=n,this.context=l}function b(n,l){if(null==l)return n.__?b(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?b(n):null}function g(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return g(n)}}function m(n){(!n.__d&&(n.__d=!0)&&t.push(n)&&!w.__r++||r!==l.debounceRendering)&&((r=l.debounceRendering)||o)(w)}function w(){var n,l,u,i,r,o,e,c;for(t.sort(f);n=t.shift();)n.__d&&(l=t.length,i=void 0,r=void 0,e=(o=(u=n).__v).__e,(c=u.__P)&&(i=[],(r=h({},o)).__v=o.__v+1,L(c,o,r,u.__n,void 0!==c.ownerSVGElement,null!=o.__h?[e]:null,i,null==e?b(o):e,o.__h),M(i,o),o.__e!=e&&g(o)),t.length>l&&t.sort(f));w.__r=0}function x(n,l,u,i,t,r,o,f,e,a){var h,v,y,d,k,g,m,w=i&&i.__k||s,x=w.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(d=u.__k[h]=null==(d=l[h])||"boolean"==typeof d||"function"==typeof d?null:"string"==typeof d||"number"==typeof d||"bigint"==typeof d?p(null,d,null,null,d):Array.isArray(d)?p(_,{children:d},null,null,null):d.__b>0?p(d.type,d.props,d.key,d.ref?d.ref:null,d.__v):d)){if(d.__=u,d.__b=u.__b+1,null===(y=w[h])||y&&d.key==y.key&&d.type===y.type)w[h]=void 0;else for(v=0;v<x;v++){if((y=w[v])&&d.key==y.key&&d.type===y.type){w[v]=void 0;break}y=null}L(n,d,y=y||c,t,r,o,f,e,a),k=d.__e,(v=d.ref)&&y.ref!=v&&(m||(m=[]),y.ref&&m.push(y.ref,null,d),m.push(v,d.__c||k,d)),null!=k?(null==g&&(g=k),"function"==typeof d.type&&d.__k===y.__k?d.__d=e=A(d,e,n):e=C(n,d,y,w,k,e),"function"==typeof u.type&&(u.__d=e)):e&&y.__e==e&&e.parentNode!=n&&(e=b(y))}for(u.__e=g,h=x;h--;)null!=w[h]&&("function"==typeof u.type&&null!=w[h].__e&&w[h].__e==u.__d&&(u.__d=$(i).nextSibling),S(w[h],w[h]));if(m)for(h=0;h<m.length;h++)O(m[h],m[++h],m[++h])}function A(n,l,u){for(var i,t=n.__k,r=0;t&&r<t.length;r++)(i=t[r])&&(i.__=n,l="function"==typeof i.type?A(i,l,u):C(u,i,i,t,i.__e,l));return l}function P(n,l){return l=l||[],null==n||"boolean"==typeof n||(Array.isArray(n)?n.some(function(n){P(n,l)}):l.push(n)),l}function C(n,l,u,i,t,r){var o,f,e;if(void 0!==l.__d)o=l.__d,l.__d=void 0;else if(null==u||t!=r||null==t.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(t),o=null;else{for(f=r,e=0;(f=f.nextSibling)&&e<i.length;e+=1)if(f==t)break n;n.insertBefore(t,r),o=r}return void 0!==o?o:t.nextSibling}function $(n){var l,u,i;if(null==n.type||"string"==typeof n.type)return n.__e;if(n.__k)for(l=n.__k.length-1;l>=0;l--)if((u=n.__k[l])&&(i=$(u)))return i;return null}function H(n,l,u,i,t){var r;for(r in u)"children"===r||"key"===r||r in l||T(n,r,null,u[r],i);for(r in l)t&&"function"!=typeof l[r]||"children"===r||"key"===r||"value"===r||"checked"===r||u[r]===l[r]||T(n,r,l[r],u[r],i)}function I(n,l,u){"-"===l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||a.test(l)?u:u+"px"}function T(n,l,u,i,t){var r;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||I(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||I(n.style,l,u[l])}else if("o"===l[0]&&"n"===l[1])r=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?i||n.addEventListener(l,r?z:j,r):n.removeEventListener(l,r?z:j,r);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!==l&&"height"!==l&&"href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||!1===u&&"-"!==l[4]?n.removeAttribute(l):n.setAttribute(l,u))}}function j(n){return this.l[n.type+!1](l.event?l.event(n):n)}function z(n){return this.l[n.type+!0](l.event?l.event(n):n)}function L(n,u,i,t,r,o,f,e,c){var s,a,v,y,p,d,b,g,m,w,A,P,C,$,H,I=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(c=i.__h,e=u.__e=i.__e,u.__h=null,o=[e]),(s=l.__b)&&s(u);try{n:if("function"==typeof I){if(g=u.props,m=(s=I.contextType)&&t[s.__c],w=s?m?m.props.value:s.__:t,i.__c?b=(a=u.__c=i.__c).__=a.__E:("prototype"in I&&I.prototype.render?u.__c=a=new I(g,w):(u.__c=a=new k(g,w),a.constructor=I,a.render=q),m&&m.sub(a),a.props=g,a.state||(a.state={}),a.context=w,a.__n=t,v=a.__d=!0,a.__h=[],a._sb=[]),null==a.__s&&(a.__s=a.state),null!=I.getDerivedStateFromProps&&(a.__s==a.state&&(a.__s=h({},a.__s)),h(a.__s,I.getDerivedStateFromProps(g,a.__s))),y=a.props,p=a.state,a.__v=u,v)null==I.getDerivedStateFromProps&&null!=a.componentWillMount&&a.componentWillMount(),null!=a.componentDidMount&&a.__h.push(a.componentDidMount);else{if(null==I.getDerivedStateFromProps&&g!==y&&null!=a.componentWillReceiveProps&&a.componentWillReceiveProps(g,w),!a.__e&&null!=a.shouldComponentUpdate&&!1===a.shouldComponentUpdate(g,a.__s,w)||u.__v===i.__v){for(u.__v!==i.__v&&(a.props=g,a.state=a.__s,a.__d=!1),a.__e=!1,u.__e=i.__e,u.__k=i.__k,u.__k.forEach(function(n){n&&(n.__=u)}),A=0;A<a._sb.length;A++)a.__h.push(a._sb[A]);a._sb=[],a.__h.length&&f.push(a);break n}null!=a.componentWillUpdate&&a.componentWillUpdate(g,a.__s,w),null!=a.componentDidUpdate&&a.__h.push(function(){a.componentDidUpdate(y,p,d)})}if(a.context=w,a.props=g,a.__P=n,P=l.__r,C=0,"prototype"in I&&I.prototype.render){for(a.state=a.__s,a.__d=!1,P&&P(u),s=a.render(a.props,a.state,a.context),$=0;$<a._sb.length;$++)a.__h.push(a._sb[$]);a._sb=[]}else do{a.__d=!1,P&&P(u),s=a.render(a.props,a.state,a.context),a.state=a.__s}while(a.__d&&++C<25);a.state=a.__s,null!=a.getChildContext&&(t=h(h({},t),a.getChildContext())),v||null==a.getSnapshotBeforeUpdate||(d=a.getSnapshotBeforeUpdate(y,p)),H=null!=s&&s.type===_&&null==s.key?s.props.children:s,x(n,Array.isArray(H)?H:[H],u,i,t,r,o,f,e,c),a.base=u.__e,u.__h=null,a.__h.length&&f.push(a),b&&(a.__E=a.__=null),a.__e=!1}else null==o&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=N(i.__e,u,i,t,r,o,f,c);(s=l.diffed)&&s(u)}catch(n){u.__v=null,(c||null!=o)&&(u.__e=e,u.__h=!!c,o[o.indexOf(e)]=null),l.__e(n,u,i)}}function M(n,u){l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function N(l,u,i,t,r,o,f,e){var s,a,h,y=i.props,p=u.props,d=u.type,_=0;if("svg"===d&&(r=!0),null!=o)for(;_<o.length;_++)if((s=o[_])&&"setAttribute"in s==!!d&&(d?s.localName===d:3===s.nodeType)){l=s,o[_]=null;break}if(null==l){if(null===d)return document.createTextNode(p);l=r?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,p.is&&p),o=null,e=!1}if(null===d)y===p||e&&l.data===p||(l.data=p);else{if(o=o&&n.call(l.childNodes),a=(y=i.props||c).dangerouslySetInnerHTML,h=p.dangerouslySetInnerHTML,!e){if(null!=o)for(y={},_=0;_<l.attributes.length;_++)y[l.attributes[_].name]=l.attributes[_].value;(h||a)&&(h&&(a&&h.__html==a.__html||h.__html===l.innerHTML)||(l.innerHTML=h&&h.__html||""))}if(H(l,p,y,r,e),h)u.__k=[];else if(_=u.props.children,x(l,Array.isArray(_)?_:[_],u,i,t,r&&"foreignObject"!==d,o,f,o?o[0]:i.__k&&b(i,0),e),null!=o)for(_=o.length;_--;)null!=o[_]&&v(o[_]);e||("value"in p&&void 0!==(_=p.value)&&(_!==l.value||"progress"===d&&!_||"option"===d&&_!==y.value)&&T(l,"value",_,y.value,!1),"checked"in p&&void 0!==(_=p.checked)&&_!==l.checked&&T(l,"checked",_,y.checked,!1))}return l}function O(n,u,i){try{"function"==typeof n?n(u):n.current=u}catch(n){l.__e(n,i)}}function S(n,u,i){var t,r;if(l.unmount&&l.unmount(n),(t=n.ref)&&(t.current&&t.current!==n.__e||O(t,null,u)),null!=(t=n.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount()}catch(n){l.__e(n,u)}t.base=t.__P=null,n.__c=void 0}if(t=n.__k)for(r=0;r<t.length;r++)t[r]&&S(t[r],u,i||"function"!=typeof n.type);i||null==n.__e||v(n.__e),n.__=n.__e=n.__d=void 0}function q(n,l,u){return this.constructor(n,u)}function B(u,i,t){var r,o,f;l.__&&l.__(u,i),o=(r="function"==typeof t)?null:t&&t.__k||i.__k,f=[],L(i,u=(!r&&t||i).__k=y(_,null,[u]),o||c,c,void 0!==i.ownerSVGElement,!r&&t?[t]:o?null:i.firstChild?n.call(i.childNodes):null,f,!r&&t?t:o?o.__e:i.firstChild,r),M(f,u)}function D(n,l){B(n,l,D)}function E(l,u,i){var t,r,o,f=h({},l.props);for(o in u)"key"==o?t=u[o]:"ref"==o?r=u[o]:f[o]=u[o];return arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),p(l.type,f,t||l.key,r||l.ref,null)}function F(n,l){var u={__c:l="__cC"+e++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,i;return this.getChildContext||(u=[],(i={})[l]=this,this.getChildContext=function(){return i},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(function(n){n.__e=!0,m(n)})},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u}n=s.slice,l={__e:function(n,l,u,i){for(var t,r,o;l=l.__;)if((t=l.__c)&&!t.__)try{if((r=t.constructor)&&null!=r.getDerivedStateFromError&&(t.setState(r.getDerivedStateFromError(n)),o=t.__d),null!=t.componentDidCatch&&(t.componentDidCatch(n,i||{}),o=t.__d),o)return t.__E=t}catch(l){n=l}throw n}},u=0,i=function(n){return null!=n&&void 0===n.constructor},k.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=h({},this.state),"function"==typeof n&&(n=n(h({},u),this.props)),n&&h(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),m(this))},k.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),m(this))},k.prototype.render=_,t=[],o="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,f=function(n,l){return n.__v.__b-l.__v.__b},w.__r=0,e=0;
//# sourceMappingURL=preact.module.js.map


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const { MinHeap } = __webpack_require__(33);
const { MaxHeap } = __webpack_require__(34);
const { CustomHeap } = __webpack_require__(35);

exports.MinHeap = MinHeap;
exports.MaxHeap = MaxHeap;
exports.CustomHeap = CustomHeap;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * @license MIT
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 *
 * @class
 * @abstract
 */
class Heap {
  /**
   * Creates a heap instance
   * @param {array<string|number|object>} nodes
   * @param {string|number|object} [leaf]
   * @returns {number}
   */
  constructor(nodes, leaf) {
    this._nodes = Array.isArray(nodes) ? nodes : [];
    this._leaf = leaf || null;
  }

  /**
   * Checks if a parent has a left child
   * @private
   * @param {number} parentIndex
   * @returns {boolean}
   */
  _hasLeftChild(parentIndex) {
    const leftChildIndex = (parentIndex * 2) + 1;
    return leftChildIndex < this.size();
  }

  /**
   * Checks if a parent has a right child
   * @private
   * @param {number} parentIndex
   * @returns {boolean}
   */
  _hasRightChild(parentIndex) {
    const rightChildIndex = (parentIndex * 2) + 2;
    return rightChildIndex < this.size();
  }

  /**
   * Returns heap node's key
   * @private
   * @param {object|number|string} node
   * @returns {number|string}
   */
  _getKey(node) {
    if (typeof node === 'object') return node.key;
    return node;
  }

  /**
   * Swaps two nodes in the heap
   * @private
   * @param {number} i
   * @param {number} j
   */
  _swap(i, j) {
    const temp = this._nodes[i];
    this._nodes[i] = this._nodes[j];
    this._nodes[j] = temp;
  }

  /**
   * Compares parent & child nodes
   * and returns true if they are in right positions
   *
   * @private
   * @param {object|number|string} parent
   * @param {object|number|string} child
   * @returns {boolean}
   */
  _compare(parentNode, childNode) {
    return this._compareKeys(
      this._getKey(parentNode),
      this._getKey(childNode)
    );
  }

  /**
   * Checks if parent and child nodes should be swapped
   * @private
   * @param {number} parentIndex
   * @param {number} childIndex
   * @returns {boolean}
   */
  _shouldSwap(parentIndex, childIndex) {
    if (parentIndex < 0 || parentIndex >= this.size()) return false;
    if (childIndex < 0 || childIndex >= this.size()) return false;

    return !this._compare(
      this._nodes[parentIndex],
      this._nodes[childIndex]
    );
  }

  /**
   * Bubbles a node from a starting index up in the heap
   * @param {number} startingIndex
   * @public
   */
  heapifyUp(startingIndex) {
    let childIndex = startingIndex;
    let parentIndex = Math.floor((childIndex - 1) / 2);

    while (this._shouldSwap(parentIndex, childIndex)) {
      this._swap(parentIndex, childIndex);
      childIndex = parentIndex;
      parentIndex = Math.floor((childIndex - 1) / 2);
    }
  }

  /**
   * Compares left and right & children of a parent
   * @private
   * @param {number} parentIndex
   * @returns {number} - a child's index
   */
  _compareChildrenOf(parentIndex) {
    if (
      !this._hasLeftChild(parentIndex)
      && !this._hasRightChild(parentIndex)
    ) {
      return -1;
    }

    const leftChildIndex = (parentIndex * 2) + 1;
    const rightChildIndex = (parentIndex * 2) + 2;

    if (!this._hasLeftChild(parentIndex)) {
      return rightChildIndex;
    }

    if (!this._hasRightChild(parentIndex)) {
      return leftChildIndex;
    }

    const isLeft = this._compare(
      this._nodes[leftChildIndex],
      this._nodes[rightChildIndex]
    );

    return isLeft ? leftChildIndex : rightChildIndex;
  }

  /**
   * Pushes a node from a starting index down in the heap
   * @private
   */
  _heapifyDown(startingIndex) {
    let parentIndex = startingIndex;
    let childIndex = this._compareChildrenOf(parentIndex);

    while (this._shouldSwap(parentIndex, childIndex)) {
      this._swap(parentIndex, childIndex);
      parentIndex = childIndex;
      childIndex = this._compareChildrenOf(parentIndex);
    }
  }

  /**
   * Removes and returns the root node in the heap
   * @public
   * @returns {object}
   */
  extractRoot() {
    if (this.isEmpty()) return null;

    const root = this.root();
    this._nodes[0] = this._nodes[this.size() - 1];
    this._nodes.pop();
    this._heapifyDown(0);

    if (root === this._leaf) {
      this._leaf = this.root();
    }

    return root;
  }

  /**
   * Pushes a node with down in the heap before an index
   * @private
   * @param {number} index
   */
  _heapifyDownUntil(index) {
    let parentIndex = 0;
    let leftChildIndex = 1;
    let rightChildIndex = 2;
    let childIndex;

    while (leftChildIndex < index) {
      childIndex = this._compareChildrenBefore(
        index,
        leftChildIndex,
        rightChildIndex
      );

      if (this._shouldSwap(parentIndex, childIndex)) {
        this._swap(parentIndex, childIndex);
      }

      parentIndex = childIndex;
      leftChildIndex = (parentIndex * 2) + 1;
      rightChildIndex = (parentIndex * 2) + 2;
    }
  }

  /**
   * Returns a shallow copy of the heap
   * @protected
   * @param {class} HeapType
   * @returns {Heap}
   */
  _clone(HeapType) {
    return new HeapType(this._nodes.slice(), this._leaf);
  }

  /**
   * Sorts the heap by swapping root with all nodes and fixing positions
   * @public
   * @returns {array} the sorted nodes
   */
  sort() {
    for (let i = this.size() - 1; i > 0; i -= 1) {
      this._swap(0, i);
      this._heapifyDownUntil(i);
    }

    return this._nodes;
  }

  /**
   * Inserts a node in the right position into the heap
   * @public
   * @param {number|string} key
   * @param {any} [value]
   * @returns {Heap}
   */
  insert(key, value) {
    const newNode = value !== undefined ? { key, value } : key;
    this._nodes.push(newNode);
    this.heapifyUp(this.size() - 1);
    if (this._leaf === null || !this._compare(newNode, this._leaf)) {
      this._leaf = newNode;
    }
    return this;
  }

  /**
   * Fixes all positions of the nodes in the heap
   * @public
   * @returns {Heap}
   */
  fix() {
    for (let i = 0; i < this.size(); i += 1) {
      this.heapifyUp(i);
    }
    return this;
  }

  /**
   * Verifies that the heap is valid
   * @public
   * @returns {boolean}
   */
  isValid() {
    const isValidRecursive = (parentIndex) => {
      let isValidLeft = true;
      let isValidRight = true;

      if (this._hasLeftChild(parentIndex)) {
        const leftChildIndex = (parentIndex * 2) + 1;
        isValidLeft = this._compare(
          this._nodes[parentIndex],
          this._nodes[leftChildIndex]
        );

        if (!isValidLeft) {
          return false;
        }

        isValidLeft = isValidRecursive(leftChildIndex);
      }

      if (this._hasRightChild(parentIndex)) {
        const rightChildIndex = (parentIndex * 2) + 2;
        isValidRight = this._compare(
          this._nodes[parentIndex],
          this._nodes[rightChildIndex]
        );

        if (!isValidRight) {
          return false;
        }

        isValidRight = isValidRecursive(rightChildIndex);
      }

      return isValidLeft && isValidRight;
    };

    return isValidRecursive(0);
  }

  /**
   * Returns the root node in the heap
   * @public
   * @returns {object|number|string|null}
   */
  root() {
    if (this.isEmpty()) return null;
    return this._nodes[0];
  }

  /**
   * Returns a leaf node in the heap
   * @public
   * @returns {object|number|string|null}
   */
  leaf() {
    return this._leaf;
  }

  /**
   * Returns the number of nodes in the heap
   * @public
   * @returns {number}
   */
  size() {
    return this._nodes.length;
  }

  /**
   * Checks if the heap is empty
   * @public
   * @returns {boolean}
   */
  isEmpty() {
    return this.size() === 0;
  }

  /**
   * Clears the heap
   * @public
   */
  clear() {
    this._nodes = [];
    this._leaf = null;
  }

  /**
   * Convert a list of items into a heap
   * @protected
   * @static
   * @param {array} array
   * @param {class} HeapType
   * @returns {Heap}
   */
  static _heapify(list, HeapType) {
    if (!Array.isArray(list)) {
      throw new Error('.heapify expects an array');
    }

    return new HeapType(list).fix();
  }

  /**
   * Checks if a list of items is a valid heap
   * @protected
   * @static
   * @param {array} array
   * @param {class} HeapType
   * @returns {boolean}
   */
  static _isHeapified(list, HeapType) {
    return new HeapType(list).isValid();
  }
}

exports.Heap = Heap;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 * @license MIT
 */

const { CustomHeap } = __webpack_require__(13);

/**
 * @class PriorityQueue
 */
class PriorityQueue {
  /**
   * Creates a priority queue
   * @public
   * @params {object} [options]
   */
  constructor(options = {}) {
    const { priority, compare } = options;
    if (compare) {
      if (typeof compare !== 'function') {
        throw new Error('.constructor expects a valid compare function');
      }
      this._compare = compare;
      this._heap = new CustomHeap(this._compare);
    } else {
      if (priority !== undefined && typeof priority !== 'function') {
        throw new Error('.constructor expects a valid priority function');
      }

      this._priority = priority || ((el) => +el);
    }
  }

  /**
   * @private
   * @returns {object}
   */
  _getElementWithPriority(node) {
    return {
      priority: node.key,
      element: node.value
    };
  }

  /**
   * @public
   * @returns {number}
   */
  size() {
    return this._heap.size();
  }

  /**
   * @public
   * @returns {boolean}
   */
  isEmpty() {
    return this._heap.isEmpty();
  }

  /**
   * Returns an element with highest priority in the queue
   * @public
   * @returns {object}
   */
  front() {
    if (this.isEmpty()) return null;

    if (this._compare) {
      return this._heap.root();
    }

    return this._getElementWithPriority(this._heap.root());
  }

  /**
   * Returns an element with lowest priority in the queue
   * @public
   * @returns {object}
   */
  back() {
    if (this.isEmpty()) return null;

    if (this._compare) {
      return this._heap.leaf();
    }

    return this._getElementWithPriority(this._heap.leaf());
  }

  /**
   * Adds an element to the queue
   * @public
   * @param {any} element
   * @param {number} p - priority
   * @throws {Error} if priority is not a valid number
   */
  enqueue(element, p) {
    if (this._compare) {
      this._heap.insert(element);
      return this;
    }

    if (p && Number.isNaN(+p)) {
      throw new Error('.enqueue expects a numeric priority');
    }

    if (Number.isNaN(+p) && Number.isNaN(this._priority(element))) {
      throw new Error(
        '.enqueue expects a numeric priority '
        + 'or a constructor callback that returns a number'
      );
    }

    const priority = !Number.isNaN(+p) ? p : this._priority(element);
    this._heap.insert(+priority, element);
    return this;
  }

  /**
   * Removes and returns an element with highest priority in the queue
   * @public
   * @returns {object}
   */
  dequeue() {
    if (this.isEmpty()) return null;

    if (this._compare) {
      return this._heap.extractRoot();
    }

    return this._getElementWithPriority(this._heap.extractRoot());
  }

  /**
   * Returns a sorted list of elements from highest to lowest priority
   * @public
   * @returns {array}
   */
  toArray() {
    if (this._compare) {
      return this._heap.clone().sort().reverse();
    }

    return this._heap
      .clone()
      .sort()
      .map((n) => this._getElementWithPriority(n))
      .reverse();
  }

  /**
   * Clears the queue
   * @public
   */
  clear() {
    this._heap.clear();
  }
}

exports.PriorityQueue = PriorityQueue;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ElementType", function() { return ElementType; });
/* harmony export (immutable) */ __webpack_exports__["isTag"] = isTag;
/** Types of elements found in htmlparser2's DOM */
var ElementType;
(function (ElementType) {
    /** Type for the root element of a document */
    ElementType["Root"] = "root";
    /** Type for Text */
    ElementType["Text"] = "text";
    /** Type for <? ... ?> */
    ElementType["Directive"] = "directive";
    /** Type for <!-- ... --> */
    ElementType["Comment"] = "comment";
    /** Type for <script> tags */
    ElementType["Script"] = "script";
    /** Type for <style> tags */
    ElementType["Style"] = "style";
    /** Type for Any tag */
    ElementType["Tag"] = "tag";
    /** Type for <![CDATA[ ... ]]> */
    ElementType["CDATA"] = "cdata";
    /** Type for <!doctype ...> */
    ElementType["Doctype"] = "doctype";
})(ElementType || (ElementType = {}));
/**
 * Tests whether an element is a tag or not.
 *
 * @param elem Element to test
 */
function isTag(elem) {
    return (elem.type === ElementType.Tag ||
        elem.type === ElementType.Script ||
        elem.type === ElementType.Style);
}
// Exports for backwards compatibility
/** Type for the root element of a document */
const Root = ElementType.Root;
/* harmony export (immutable) */ __webpack_exports__["Root"] = Root;

/** Type for Text */
const Text = ElementType.Text;
/* harmony export (immutable) */ __webpack_exports__["Text"] = Text;

/** Type for <? ... ?> */
const Directive = ElementType.Directive;
/* harmony export (immutable) */ __webpack_exports__["Directive"] = Directive;

/** Type for <!-- ... --> */
const Comment = ElementType.Comment;
/* harmony export (immutable) */ __webpack_exports__["Comment"] = Comment;

/** Type for <script> tags */
const Script = ElementType.Script;
/* harmony export (immutable) */ __webpack_exports__["Script"] = Script;

/** Type for <style> tags */
const Style = ElementType.Style;
/* harmony export (immutable) */ __webpack_exports__["Style"] = Style;

/** Type for Any tag */
const Tag = ElementType.Tag;
/* harmony export (immutable) */ __webpack_exports__["Tag"] = Tag;

/** Type for <![CDATA[ ... ]]> */
const CDATA = ElementType.CDATA;
/* harmony export (immutable) */ __webpack_exports__["CDATA"] = CDATA;

/** Type for <!doctype ...> */
const Doctype = ElementType.Doctype;
/* harmony export (immutable) */ __webpack_exports__["Doctype"] = Doctype;



/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _Group = __webpack_require__(67);

var _Group2 = _interopRequireDefault(_Group);

var _card = __webpack_require__(5);

var _constants = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultProps = {
    left: [],
    center: [],
    right: [],
    divider: false,
    isFluid: false
};

/**
 * The footer that is displayed for 3:2 cards
 *
 * @component
 * @example
 * const props= {
    divider: Boolean,
    left: Array,
    center: Array,
    right: Array,
    isFluid: Boolean,
 * }
 * return (
 *   <CardFooter {...props}/>
 * )
 */
var CardFooter = function CardFooter(props) {
    var divider = props.divider,
        left = props.left,
        center = props.center,
        right = props.right,
        isFluid = props.isFluid,
        onFocus = props.onFocus;

    /**
     * Class name for the card footer:
     * whether the card footer should have a horizontal divider
     * @type {Number}
     */

    var footerClassName = (0, _classnames2.default)({
        'consonant-CardFooter': true,
        'consonant-CardFooter--divider': divider
    });

    /**
     * Class name for the card footer row:
     * whether the the card footer row should be fluid or of fixed width
     * @type {Number}
     */
    var rowClassName = (0, _classnames2.default)({
        'consonant-CardFooter-row': true,
        'consonant-CardFooter-row--fluid': isFluid
    });

    /**
     * How many groups are displayed in the footer
     * @type {Number}
     */
    var dataCells = left.some(function (_ref) {
        var type = _ref.type;
        return type === _constants.INFOBIT_TYPE.DATE;
    }) ? 2 : 1;

    /**
     * Whether the left footer infobits should render
     * @type {Boolean}
     */
    var shouldRenderLeft = left && left.length > 0;

    /**
     * Whether the center footer infobits should render
     * @type {Boolean}
     */
    var shouldRenderCenter = center && center.length > 0;

    /**
     * Whether the center footer infobits should render
     * @type {Boolean}
     */
    var shouldRenderRight = right && right.length > 0;

    return _react2.default.createElement(
        'div',
        {
            className: footerClassName },
        _react2.default.createElement(
            'div',
            {
                className: rowClassName,
                'data-cells': dataCells },
            shouldRenderLeft && _react2.default.createElement(
                'div',
                {
                    className: 'consonant-CardFooter-cell consonant-CardFooter-cell--left' },
                _react2.default.createElement(_Group2.default, { renderList: left, onFocus: onFocus })
            ),
            shouldRenderCenter && _react2.default.createElement(
                'div',
                {
                    className: 'consonant-CardFooter-cell consonant-CardFooter-cell--center' },
                _react2.default.createElement(_Group2.default, { renderList: center, onFocus: onFocus })
            ),
            shouldRenderRight && _react2.default.createElement(
                'div',
                {
                    className: 'consonant-CardFooter-cell consonant-CardFooter-cell--right' },
                _react2.default.createElement(_Group2.default, { renderList: right, onFocus: onFocus })
            )
        )
    );
};

CardFooter.propTypes = _card.footerType;
CardFooter.defaultProps = defaultProps;

exports.default = CardFooter;

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return T; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return q; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return x; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return p; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return P; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return V; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return A; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return y; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return F; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return s; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return _; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return h; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(12);
var t,r,u,i,o=0,f=[],c=[],e=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__b,a=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__r,v=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].diffed,l=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__c,m=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].unmount;function d(t,u){__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__h&&__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__h(r,t,o||u),o=0;var i=r.__H||(r.__H={__:[],__h:[]});return t>=i.__.length&&i.__.push({__V:c}),i.__[t]}function h(n){return o=1,s(B,n)}function s(n,u,i){var o=d(t++,2);if(o.t=n,!o.__c&&(o.__=[i?i(u):B(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}))}],o.__c=r,!r.u)){var f=function(n,t,r){if(!o.__c.__H)return!0;var u=o.__c.__H.__.filter(function(n){return n.__c});if(u.every(function(n){return!n.__N}))return!c||c.call(this,n,t,r);var i=!1;return u.forEach(function(n){if(n.__N){var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=!0)}}),!(!i&&o.__c.props===n)&&(!c||c.call(this,n,t,r))};r.u=!0;var c=r.shouldComponentUpdate,e=r.componentWillUpdate;r.componentWillUpdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u}e&&e.call(this,n,t,r)},r.shouldComponentUpdate=f}return o.__N||o.__}function p(u,i){var o=d(t++,3);!__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__s&&z(o.__H,i)&&(o.__=u,o.i=i,r.__H.__h.push(o))}function y(u,i){var o=d(t++,4);!__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__s&&z(o.__H,i)&&(o.__=u,o.i=i,r.__h.push(o))}function _(n){return o=5,F(function(){return{current:n}},[])}function A(n,t,r){o=6,y(function(){return"function"==typeof n?(n(t()),function(){return n(null)}):n?(n.current=t(),function(){return n.current=null}):void 0},null==r?r:r.concat(n))}function F(n,r){var u=d(t++,7);return z(u.__H,r)?(u.__V=n(),u.i=r,u.__h=n,u.__V):u.__}function T(n,t){return o=8,F(function(){return n},t)}function q(n){var u=r.context[n.__c],i=d(t++,9);return i.c=n,u?(null==i.__&&(i.__=!0,u.sub(r)),u.props.value):n.__}function x(t,r){__WEBPACK_IMPORTED_MODULE_0_preact__["options"].useDebugValue&&__WEBPACK_IMPORTED_MODULE_0_preact__["options"].useDebugValue(r?r(t):t)}function P(n){var u=d(t++,10),i=h();return u.__=n,r.componentDidCatch||(r.componentDidCatch=function(n,t){u.__&&u.__(n,t),i[1](n)}),[i[0],function(){i[1](void 0)}]}function V(){var n=d(t++,11);if(!n.__){for(var u=r.__v;null!==u&&!u.__m&&null!==u.__;)u=u.__;var i=u.__m||(u.__m=[0,0]);n.__="P"+i[0]+"-"+i[1]++}return n.__}function b(){for(var t;t=f.shift();)if(t.__P&&t.__H)try{t.__H.__h.forEach(k),t.__H.__h.forEach(w),t.__H.__h=[]}catch(r){t.__H.__h=[],__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__e(r,t.__v)}}__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__b=function(n){r=null,e&&e(n)},__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__r=function(n){a&&a(n),t=0;var i=(r=n.__c).__H;i&&(u===r?(i.__h=[],r.__h=[],i.__.forEach(function(n){n.__N&&(n.__=n.__N),n.__V=c,n.__N=n.i=void 0})):(i.__h.forEach(k),i.__h.forEach(w),i.__h=[])),u=r},__WEBPACK_IMPORTED_MODULE_0_preact__["options"].diffed=function(t){v&&v(t);var o=t.__c;o&&o.__H&&(o.__H.__h.length&&(1!==f.push(o)&&i===__WEBPACK_IMPORTED_MODULE_0_preact__["options"].requestAnimationFrame||((i=__WEBPACK_IMPORTED_MODULE_0_preact__["options"].requestAnimationFrame)||j)(b)),o.__H.__.forEach(function(n){n.i&&(n.__H=n.i),n.__V!==c&&(n.__=n.__V),n.i=void 0,n.__V=c})),u=r=null},__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__c=function(t,r){r.some(function(t){try{t.__h.forEach(k),t.__h=t.__h.filter(function(n){return!n.__||w(n)})}catch(u){r.some(function(n){n.__h&&(n.__h=[])}),r=[],__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__e(u,t.__v)}}),l&&l(t,r)},__WEBPACK_IMPORTED_MODULE_0_preact__["options"].unmount=function(t){m&&m(t);var r,u=t.__c;u&&u.__H&&(u.__H.__.forEach(function(n){try{k(n)}catch(n){r=n}}),u.__H=void 0,r&&__WEBPACK_IMPORTED_MODULE_0_preact__["options"].__e(r,u.__v))};var g="function"==typeof requestAnimationFrame;function j(n){var t,r=function(){clearTimeout(u),g&&cancelAnimationFrame(t),setTimeout(n)},u=setTimeout(r,100);g&&(t=requestAnimationFrame(r))}function k(n){var t=r,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r=t}function w(n){var t=r;n.__c=n.__(),r=t}function z(n,t){return!n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function B(n,t){return"function"==typeof t?t(n):t}
//# sourceMappingURL=hooks.module.js.map


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (process.env.NODE_ENV === 'production') {
  module.exports = __webpack_require__(39);
} else {
  module.exports = __webpack_require__(40);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RenderTotalResults = exports.RenderDisplayMsg = exports.HighlightSearchField = undefined;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _cuid = __webpack_require__(9);

var _cuid2 = _interopRequireDefault(_cuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Handles highlighting search results on search
 * @param {String} text - Search Text
 * @param {String} value - Values to highlight
 * @returns {String []} - HTML with text highlighting
 */
var HighlightSearchField = exports.HighlightSearchField = function HighlightSearchField(text, value) {
    var parts = text.split(new RegExp('(' + value + ')', 'gi'));
    return parts.map(function (part) {
        return part.toLowerCase() === value ? _react2.default.createElement(
            'span',
            {
                'data-testid': 'consonant-SearchResult',
                className: 'consonant-SearchResult',
                key: (0, _cuid2.default)() },
            part
        ) : part;
    });
};

/**
 * Handles generating HTML for errors
 * @param {String} text - Error Text
 * @param {String} value - Values to modify
 * @returns {String []} - HTML to render users on page error
 */
var RenderDisplayMsg = exports.RenderDisplayMsg = function RenderDisplayMsg(text, value) {
    var arr = text.split(new RegExp('({query}|{break})', 'gi')).filter(function (item) {
        return item;
    });
    return arr.map(function (item) {
        switch (item.toLowerCase()) {
            case '{query}':
                return _react2.default.createElement(
                    'strong',
                    {
                        key: (0, _cuid2.default)() },
                    value
                );
            case '{break}':
                return _react2.default.createElement('br', {
                    key: (0, _cuid2.default)() });
            default:
                return _react2.default.createElement(
                    'span',
                    {
                        key: (0, _cuid2.default)() },
                    item
                );
        }
    });
};

/**
 * Handles generating HTML for total results text
 * @param {String} text - Text
 * @param {String} value - Values to modify
 * @returns {String []} - HTML to render total results text
 */
var RenderTotalResults = exports.RenderTotalResults = function RenderTotalResults(text, value) {
    var arr = text.split(new RegExp('({total})', 'gi')).filter(function (item) {
        return item;
    });
    return arr.map(function (item) {
        return item.toLowerCase() === '{total}' ? _react2.default.createElement(
            'strong',
            { key: (0, _cuid2.default)() },
            value
        ) : _react2.default.createElement(
            'span',
            { key: (0, _cuid2.default)() },
            item
        );
    });
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = function pad (num, size) {
  var s = '000000000' + num;
  return s.substr(s.length - size);
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeConfigGetter = exports.getNumSelectedFilterItems = undefined;
exports.getDefaultSortOption = getDefaultSortOption;

var _general = __webpack_require__(2);

var _constants = __webpack_require__(6);

/**
 * Gets the number of selected filter items
 * @param {Array} filters - filters array
 * @returns {Number} - the number of selected filter items
 */
var getNumSelectedFilterItems = exports.getNumSelectedFilterItems = function getNumSelectedFilterItems(filters) {
    var filterItems = (0, _general.chainFromIterable)(filters.map(function (filter) {
        return filter.items;
    }));
    return (0, _general.getSelectedItemsCount)(filterItems);
};

/**
 * Returns the authored or default configuration value
 * @param {Object} config - main configuration object
 * @returns {Object} - authored or default configuration value
 */
var makeConfigGetter = exports.makeConfigGetter = function makeConfigGetter(config) {
    return function (object, key) {
        var objectPath = key ? object + '.' + key : object;
        var defaultValue = (0, _general.getByPath)(_constants.DEFAULT_CONFIG, objectPath);

        var value = (0, _general.getByPath)(config, objectPath);

        if ((0, _general.isNullish)(value)) {
            return defaultValue;
        }
        return value;
    };
};

/**
 * Gets the sorting option to use
 * @param {Object} config - configuration object
 * @param {String} query - title of a sort option
 * @returns {Object} - Sort Option or default if none is found
 */
function getDefaultSortOption(config, query) {
    var getConfig = makeConfigGetter(config);
    var sortOptions = getConfig('sort', 'options');
    var sortConstant = _constants.SORT_TYPES[query.toUpperCase()];

    return sortOptions.find(function (option) {
        return option.sort === query;
    }) || {
        label: sortConstant || 'Featured',
        sort: sortConstant || 'featured'
    };
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var reactProperty = __webpack_require__(52);
var utilities = __webpack_require__(26);

/**
 * Converts HTML/SVG DOM attributes to React props.
 *
 * @param {object} [attributes={}] - HTML/SVG DOM attributes.
 * @returns - React props.
 */
module.exports = function attributesToProps(attributes) {
  attributes = attributes || {};

  var valueOnlyInputs = {
    reset: true,
    submit: true
  };

  var attributeName;
  var attributeNameLowerCased;
  var attributeValue;
  var propName;
  var propertyInfo;
  var props = {};
  var inputIsValueOnly = attributes.type && valueOnlyInputs[attributes.type];

  for (attributeName in attributes) {
    attributeValue = attributes[attributeName];

    // ARIA (aria-*) or custom data (data-*) attribute
    if (reactProperty.isCustomAttribute(attributeName)) {
      props[attributeName] = attributeValue;
      continue;
    }

    // convert HTML/SVG attribute to React prop
    attributeNameLowerCased = attributeName.toLowerCase();
    propName = getPropName(attributeNameLowerCased);

    if (propName) {
      propertyInfo = reactProperty.getPropertyInfo(propName);

      // convert attribute to uncontrolled component prop (e.g., `value` to `defaultValue`)
      // https://reactjs.org/docs/uncontrolled-components.html
      if (
        (propName === 'checked' || propName === 'value') &&
        !inputIsValueOnly
      ) {
        propName = getPropName('default' + attributeNameLowerCased);
      }

      props[propName] = attributeValue;

      switch (propertyInfo && propertyInfo.type) {
        case reactProperty.BOOLEAN:
          props[propName] = true;
          break;
        case reactProperty.OVERLOADED_BOOLEAN:
          if (attributeValue === '') {
            props[propName] = true;
          }
          break;
      }
      continue;
    }

    // preserve custom attribute if React >=16
    if (utilities.PRESERVE_CUSTOM_ATTRIBUTES) {
      props[attributeName] = attributeValue;
    }
  }

  // transform inline style to object
  utilities.setStyleProp(attributes.style, props);

  return props;
};

/**
 * Gets prop name from lowercased attribute name.
 *
 * @param {string} attributeName - Lowercased attribute name.
 * @returns - Prop name.
 */
function getPropName(attributeName) {
  return reactProperty.possibleStandardNames[attributeName];
}


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(0);
var styleToJS = __webpack_require__(54).default;

/**
 * Swap key with value in an object.
 *
 * @param {object} obj - The object.
 * @param {Function} [override] - The override method.
 * @returns - The inverted object.
 */
function invertObject(obj, override) {
  if (!obj || typeof obj !== 'object') {
    throw new TypeError('First argument must be an object');
  }

  var key;
  var value;
  var isOverridePresent = typeof override === 'function';
  var overrides = {};
  var result = {};

  for (key in obj) {
    value = obj[key];

    if (isOverridePresent) {
      overrides = override(key, value);
      if (overrides && overrides.length === 2) {
        result[overrides[0]] = overrides[1];
        continue;
      }
    }

    if (typeof value === 'string') {
      result[value] = key;
    }
  }

  return result;
}

/**
 * Check if a given tag is a custom component.
 *
 * @see {@link https://github.com/facebook/react/blob/v16.6.3/packages/react-dom/src/shared/isCustomComponent.js}
 *
 * @param {string} tagName - The name of the html tag.
 * @param {object} props - The props being passed to the element.
 * @returns - Whether tag is custom component.
 */
function isCustomComponent(tagName, props) {
  if (tagName.indexOf('-') === -1) {
    return props && typeof props.is === 'string';
  }

  switch (tagName) {
    // These are reserved SVG and MathML elements.
    // We don't mind this whitelist too much because we expect it to never grow.
    // The alternative is to track the namespace in a few places which is convoluted.
    // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    case 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    case 'font-face-name':
    case 'missing-glyph':
      return false;
    default:
      return true;
  }
}

var styleToJSOptions = { reactCompat: true };

/**
 * Sets style prop.
 *
 * @param {null|undefined|string} style
 * @param {object} props
 */
function setStyleProp(style, props) {
  if (style === null || style === undefined) {
    return;
  }
  try {
    props.style = styleToJS(style, styleToJSOptions);
  } catch (err) {
    props.style = {};
  }
}

/**
 * @constant {boolean}
 * @see {@link https://reactjs.org/blog/2017/09/08/dom-attributes-in-react-16.html}
 */
var PRESERVE_CUSTOM_ATTRIBUTES = React.version.split('.')[0] >= 16;

// Taken from
// https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/packages/react-dom/src/client/validateDOMNesting.js#L213
var elementsWithNoTextChildren = new Set([
  'tr',
  'tbody',
  'thead',
  'tfoot',
  'colgroup',
  'table',
  'head',
  'html',
  'frameset'
]);

/**
 * Checks if the given node can contain text nodes
 *
 * @param {DomElement} node - Node.
 * @returns - Whether node can contain text nodes.
 */
function canTextBeChildOfNode(node) {
  return !elementsWithNoTextChildren.has(node.name);
}

module.exports = {
  PRESERVE_CUSTOM_ATTRIBUTES: PRESERVE_CUSTOM_ATTRIBUTES,
  invertObject: invertObject,
  isCustomComponent: isCustomComponent,
  setStyleProp: setStyleProp,
  canTextBeChildOfNode: canTextBeChildOfNode,
  elementsWithNoTextChildren: elementsWithNoTextChildren
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(61);
var domhandler = __webpack_require__(62);

var CASE_SENSITIVE_TAG_NAMES = constants.CASE_SENSITIVE_TAG_NAMES;

var Comment = domhandler.Comment;
var Element = domhandler.Element;
var ProcessingInstruction = domhandler.ProcessingInstruction;
var Text = domhandler.Text;

var caseSensitiveTagNamesMap = {};
var tagName;

for (var i = 0, len = CASE_SENSITIVE_TAG_NAMES.length; i < len; i++) {
  tagName = CASE_SENSITIVE_TAG_NAMES[i];
  caseSensitiveTagNamesMap[tagName.toLowerCase()] = tagName;
}

/**
 * Gets case-sensitive tag name.
 *
 * @param  {string}           tagName - Tag name in lowercase.
 * @return {string|undefined}         - Case-sensitive tag name.
 */
function getCaseSensitiveTagName(tagName) {
  return caseSensitiveTagNamesMap[tagName];
}

/**
 * Formats DOM attributes to a hash map.
 *
 * @param  {NamedNodeMap} attributes - List of attributes.
 * @return {object}                  - Map of attribute name to value.
 */
function formatAttributes(attributes) {
  var result = {};
  var attribute;
  // `NamedNodeMap` is array-like
  for (var i = 0, len = attributes.length; i < len; i++) {
    attribute = attributes[i];
    result[attribute.name] = attribute.value;
  }
  return result;
}

/**
 * Corrects the tag name if it is case-sensitive (SVG).
 * Otherwise, returns the lowercase tag name (HTML).
 *
 * @param  {string} tagName - Lowercase tag name.
 * @return {string}         - Formatted tag name.
 */
function formatTagName(tagName) {
  tagName = tagName.toLowerCase();
  var caseSensitiveTagName = getCaseSensitiveTagName(tagName);
  if (caseSensitiveTagName) {
    return caseSensitiveTagName;
  }
  return tagName;
}

/**
 * Transforms DOM nodes to `domhandler` nodes.
 *
 * @param  {NodeList}     nodes         - DOM nodes.
 * @param  {Element|null} [parent=null] - Parent node.
 * @param  {string}       [directive]   - Directive.
 * @return {Array<Comment|Element|ProcessingInstruction|Text>}
 */
function formatDOM(nodes, parent, directive) {
  parent = parent || null;
  var result = [];

  for (var index = 0, len = nodes.length; index < len; index++) {
    var node = nodes[index];
    var current;

    // set the node data given the type
    switch (node.nodeType) {
      case 1:
        // script, style, or tag
        current = new Element(
          formatTagName(node.nodeName),
          formatAttributes(node.attributes)
        );
        current.children = formatDOM(node.childNodes, current);
        break;

      case 3:
        current = new Text(node.nodeValue);
        break;

      case 8:
        current = new Comment(node.nodeValue);
        break;

      default:
        continue;
    }

    // set previous node next
    var prev = result[index - 1] || null;
    if (prev) {
      prev.next = current;
    }

    // set properties for current node
    current.parent = parent;
    current.prev = prev;
    current.next = null;

    result.push(current);
  }

  if (directive) {
    current = new ProcessingInstruction(
      directive.substring(0, directive.indexOf(' ')).toLowerCase(),
      directive
    );
    current.next = result[0] || null;
    current.parent = parent;
    result.unshift(current);

    if (result[1]) {
      result[1].prev = result[0];
    }
  }

  return result;
}

/**
 * Detects if browser is Internet Explorer.
 *
 * @return {boolean} - Whether IE is detected.
 */
function isIE() {
  return /(MSIE |Trident\/|Edge\/)/.test(navigator.userAgent);
}

module.exports = {
  formatAttributes: formatAttributes,
  formatDOM: formatDOM,
  isIE: isIE
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneNode = exports.hasChildren = exports.isDocument = exports.isDirective = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = exports.Element = exports.Document = exports.NodeWithChildren = exports.ProcessingInstruction = exports.Comment = exports.Text = exports.DataNode = exports.Node = void 0;
var domelementtype_1 = __webpack_require__(17);
var nodeTypes = new Map([
    [domelementtype_1.ElementType.Tag, 1],
    [domelementtype_1.ElementType.Script, 1],
    [domelementtype_1.ElementType.Style, 1],
    [domelementtype_1.ElementType.Directive, 1],
    [domelementtype_1.ElementType.Text, 3],
    [domelementtype_1.ElementType.CDATA, 4],
    [domelementtype_1.ElementType.Comment, 8],
    [domelementtype_1.ElementType.Root, 9],
]);
/**
 * This object will be used as the prototype for Nodes when creating a
 * DOM-Level-1-compliant structure.
 */
var Node = /** @class */ (function () {
    /**
     *
     * @param type The type of the node.
     */
    function Node(type) {
        this.type = type;
        /** Parent of the node */
        this.parent = null;
        /** Previous sibling */
        this.prev = null;
        /** Next sibling */
        this.next = null;
        /** The start index of the node. Requires `withStartIndices` on the handler to be `true. */
        this.startIndex = null;
        /** The end index of the node. Requires `withEndIndices` on the handler to be `true. */
        this.endIndex = null;
    }
    Object.defineProperty(Node.prototype, "nodeType", {
        // Read-only aliases
        /**
         * [DOM spec](https://dom.spec.whatwg.org/#dom-node-nodetype)-compatible
         * node {@link type}.
         */
        get: function () {
            var _a;
            return (_a = nodeTypes.get(this.type)) !== null && _a !== void 0 ? _a : 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "parentNode", {
        // Read-write aliases for properties
        /**
         * Same as {@link parent}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.parent;
        },
        set: function (parent) {
            this.parent = parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "previousSibling", {
        /**
         * Same as {@link prev}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.prev;
        },
        set: function (prev) {
            this.prev = prev;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "nextSibling", {
        /**
         * Same as {@link next}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.next;
        },
        set: function (next) {
            this.next = next;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Clone this node, and optionally its children.
     *
     * @param recursive Clone child nodes as well.
     * @returns A clone of the node.
     */
    Node.prototype.cloneNode = function (recursive) {
        if (recursive === void 0) { recursive = false; }
        return cloneNode(this, recursive);
    };
    return Node;
}());
exports.Node = Node;
/**
 * A node that contains some data.
 */
var DataNode = /** @class */ (function (_super) {
    __extends(DataNode, _super);
    /**
     * @param type The type of the node
     * @param data The content of the data node
     */
    function DataNode(type, data) {
        var _this = _super.call(this, type) || this;
        _this.data = data;
        return _this;
    }
    Object.defineProperty(DataNode.prototype, "nodeValue", {
        /**
         * Same as {@link data}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.data;
        },
        set: function (data) {
            this.data = data;
        },
        enumerable: false,
        configurable: true
    });
    return DataNode;
}(Node));
exports.DataNode = DataNode;
/**
 * Text within the document.
 */
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(data) {
        return _super.call(this, domelementtype_1.ElementType.Text, data) || this;
    }
    return Text;
}(DataNode));
exports.Text = Text;
/**
 * Comments within the document.
 */
var Comment = /** @class */ (function (_super) {
    __extends(Comment, _super);
    function Comment(data) {
        return _super.call(this, domelementtype_1.ElementType.Comment, data) || this;
    }
    return Comment;
}(DataNode));
exports.Comment = Comment;
/**
 * Processing instructions, including doc types.
 */
var ProcessingInstruction = /** @class */ (function (_super) {
    __extends(ProcessingInstruction, _super);
    function ProcessingInstruction(name, data) {
        var _this = _super.call(this, domelementtype_1.ElementType.Directive, data) || this;
        _this.name = name;
        return _this;
    }
    return ProcessingInstruction;
}(DataNode));
exports.ProcessingInstruction = ProcessingInstruction;
/**
 * A `Node` that can have children.
 */
var NodeWithChildren = /** @class */ (function (_super) {
    __extends(NodeWithChildren, _super);
    /**
     * @param type Type of the node.
     * @param children Children of the node. Only certain node types can have children.
     */
    function NodeWithChildren(type, children) {
        var _this = _super.call(this, type) || this;
        _this.children = children;
        return _this;
    }
    Object.defineProperty(NodeWithChildren.prototype, "firstChild", {
        // Aliases
        /** First child of the node. */
        get: function () {
            var _a;
            return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeWithChildren.prototype, "lastChild", {
        /** Last child of the node. */
        get: function () {
            return this.children.length > 0
                ? this.children[this.children.length - 1]
                : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeWithChildren.prototype, "childNodes", {
        /**
         * Same as {@link children}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.children;
        },
        set: function (children) {
            this.children = children;
        },
        enumerable: false,
        configurable: true
    });
    return NodeWithChildren;
}(Node));
exports.NodeWithChildren = NodeWithChildren;
/**
 * The root node of the document.
 */
var Document = /** @class */ (function (_super) {
    __extends(Document, _super);
    function Document(children) {
        return _super.call(this, domelementtype_1.ElementType.Root, children) || this;
    }
    return Document;
}(NodeWithChildren));
exports.Document = Document;
/**
 * An element within the DOM.
 */
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    /**
     * @param name Name of the tag, eg. `div`, `span`.
     * @param attribs Object mapping attribute names to attribute values.
     * @param children Children of the node.
     */
    function Element(name, attribs, children, type) {
        if (children === void 0) { children = []; }
        if (type === void 0) { type = name === "script"
            ? domelementtype_1.ElementType.Script
            : name === "style"
                ? domelementtype_1.ElementType.Style
                : domelementtype_1.ElementType.Tag; }
        var _this = _super.call(this, type, children) || this;
        _this.name = name;
        _this.attribs = attribs;
        return _this;
    }
    Object.defineProperty(Element.prototype, "tagName", {
        // DOM Level 1 aliases
        /**
         * Same as {@link name}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.name;
        },
        set: function (name) {
            this.name = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "attributes", {
        get: function () {
            var _this = this;
            return Object.keys(this.attribs).map(function (name) {
                var _a, _b;
                return ({
                    name: name,
                    value: _this.attribs[name],
                    namespace: (_a = _this["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
                    prefix: (_b = _this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name],
                });
            });
        },
        enumerable: false,
        configurable: true
    });
    return Element;
}(NodeWithChildren));
exports.Element = Element;
/**
 * @param node Node to check.
 * @returns `true` if the node is a `Element`, `false` otherwise.
 */
function isTag(node) {
    return (0, domelementtype_1.isTag)(node);
}
exports.isTag = isTag;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `CDATA`, `false` otherwise.
 */
function isCDATA(node) {
    return node.type === domelementtype_1.ElementType.CDATA;
}
exports.isCDATA = isCDATA;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Text`, `false` otherwise.
 */
function isText(node) {
    return node.type === domelementtype_1.ElementType.Text;
}
exports.isText = isText;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Comment`, `false` otherwise.
 */
function isComment(node) {
    return node.type === domelementtype_1.ElementType.Comment;
}
exports.isComment = isComment;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */
function isDirective(node) {
    return node.type === domelementtype_1.ElementType.Directive;
}
exports.isDirective = isDirective;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */
function isDocument(node) {
    return node.type === domelementtype_1.ElementType.Root;
}
exports.isDocument = isDocument;
/**
 * @param node Node to check.
 * @returns `true` if the node is a `NodeWithChildren` (has children), `false` otherwise.
 */
function hasChildren(node) {
    return Object.prototype.hasOwnProperty.call(node, "children");
}
exports.hasChildren = hasChildren;
/**
 * Clone a node, and optionally its children.
 *
 * @param recursive Clone child nodes as well.
 * @returns A clone of the node.
 */
function cloneNode(node, recursive) {
    if (recursive === void 0) { recursive = false; }
    var result;
    if (isText(node)) {
        result = new Text(node.data);
    }
    else if (isComment(node)) {
        result = new Comment(node.data);
    }
    else if (isTag(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_1 = new Element(node.name, __assign({}, node.attribs), children);
        children.forEach(function (child) { return (child.parent = clone_1); });
        if (node.namespace != null) {
            clone_1.namespace = node.namespace;
        }
        if (node["x-attribsNamespace"]) {
            clone_1["x-attribsNamespace"] = __assign({}, node["x-attribsNamespace"]);
        }
        if (node["x-attribsPrefix"]) {
            clone_1["x-attribsPrefix"] = __assign({}, node["x-attribsPrefix"]);
        }
        result = clone_1;
    }
    else if (isCDATA(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_2 = new NodeWithChildren(domelementtype_1.ElementType.CDATA, children);
        children.forEach(function (child) { return (child.parent = clone_2); });
        result = clone_2;
    }
    else if (isDocument(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_3 = new Document(children);
        children.forEach(function (child) { return (child.parent = clone_3); });
        if (node["x-mode"]) {
            clone_3["x-mode"] = node["x-mode"];
        }
        result = clone_3;
    }
    else if (isDirective(node)) {
        var instruction = new ProcessingInstruction(node.name, node.data);
        if (node["x-name"] != null) {
            instruction["x-name"] = node["x-name"];
            instruction["x-publicId"] = node["x-publicId"];
            instruction["x-systemId"] = node["x-systemId"];
        }
        result = instruction;
    }
    else {
        throw new Error("Not implemented yet: ".concat(node.type));
    }
    result.startIndex = node.startIndex;
    result.endIndex = node.endIndex;
    if (node.sourceCodeLocation != null) {
        result.sourceCodeLocation = node.sourceCodeLocation;
    }
    return result;
}
exports.cloneNode = cloneNode;
function cloneChildren(childs) {
    var children = childs.map(function (child) { return cloneNode(child, true); });
    for (var i = 1; i < children.length; i++) {
        children[i].prev = children[i - 1];
        children[i - 1].next = children[i];
    }
    return children;
}


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30);
module.exports = __webpack_require__(90);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _preact = __webpack_require__(12);

var _compat = __webpack_require__(0);

var _general = __webpack_require__(2);

var _Container = __webpack_require__(37);

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import consonantPageRDC from './components/Consonant/Page/ConsonantPageDOM';
//
// const domRegistry = new DOMRegistry(React, render);
// domRegistry.register({
//     consonantPageRDC,
// });
//
// const initReact = (element) => {
//     domRegistry.init(element);
// };
//
// initReact(document);
//
// function collectionLoadedThroughXf(el) {
//     const container = el.firstElementChild;
//     let consonantCardCollection = null;
//     if (container !== null) {
//         consonantCardCollection = container.querySelectorAll('.consonantcardcollection');
//     }
//     return el.className.indexOf('experiencefragment')
//         && consonantCardCollection
//         && consonantCardCollection.length > 0;
// }
//
// let prev = null;
// function authorWatch(el) {
//     if (prev !== el && collectionLoadedThroughXf(el)) {
//         prev = el;
//         domRegistry.render(consonantPageRDC);
//     }
// }
//
// console.log("hi");
//
// // Add to DXF Registry
// try {
//     window.dexter.dxf.registerApp(initReact);
// } catch (e) {
//     /* eslint-disable no-empty */
// }

// export class ConsonantCardCollection {
//     constructor(config) {
//         const root = ReactDOM.createRoot(document.getElementById('someDivId'));
//         root.render(<React.Fragment>
//             <Container />
//         </React.Fragment>);
//     }
// }
//
// window.ConsonantCardCollection = ConsonantCardCollecton;

// var ReactDOMServer = require('react-dom/server');
// var config = {
//     collection: {
//         mode: "lightest", // Can be empty, "light", "dark", "darkest";
//         layout: {
//             type: '3up', // Can be "2up", "3up", "4up", "5up";
//             gutter: '4x', // Can be "2x", "3x", "4x";
//             container: '1200MaxWidth', // Can be "83Percent", "1200MaxWidth", "32Margin";
//         },
//         lazyLoad: false,
//         button: {
//             style: "call-to-action", // Can be "primary", "call-to-action";
//         },
//         banner: {
//             upcoming: {
//                 description: "Upcoming"
//             },
//             live: {
//                 description: "Live"
//             },
//             onDemand: {
//                 description: "On Demand"
//             }
//         },
//         resultsPerPage: '5',
//         endpoint: location.hostname === "localhost" ? "../../mock-json/smoke.json" : "../../caas/mock-json/smoke.json",
//         totalCardsToShow: '55',
//         cardStyle: "1:2", // available options: "1:2", "3:4", "full-card", "half-height", "custom-card", "product", "double-wide";
//         showTotalResults: 'true',
//         i18n: {
//             prettyDateIntervalFormat: '{LLL} {dd} | {timeRange} {timeZone}',
//             totalResultsText: '{total} Results',
//             title: 'Lorem Ipsum 7',
//             titleHeadingLevel: 'h2',
//             cardTitleAccessibilityLevel: '3',
//             onErrorTitle: 'Sorry there was a system error.',
//             onErrorDescription: 'Please try reloading the page or try coming back to the page another time.',
//             lastModified: "Last modified {date}"
//         },
//         setCardBorders: "true", // Can be true or false;
//         useOverlayLinks: "false", // Can be true or false;
//     },
//     featuredCards: ['c7d34f39-397c-3727-9dff-5d0d9d8cf731'],
//     filterPanel: {
//         enabled: 'true',
//         type: 'left',
//         eventFilter: 'all',
//         showEmptyFilters: true,
//         filters: [
//             {
//                 "group": "By Solution",
//                 "id": "adobe-com-enterprise:topic",
//                 "items": [
//                     {
//                         "label": "Business Continuity",
//                         "id": "adobe-com-enterprise:topic/business-continuity"
//                     },
//                     {
//                         "label": "Creativity and Design",
//                         "id": "adobe-com-enterprise:topic/creativity-design"
//                     },
//                     {
//                         "label": "Customer Intelligence",
//                         "id": "adobe-com-enterprise:topic/customer-intelligence"
//                     },
//                     {
//                         "label": "Data Management Platform",
//                         "id": "adobe-com-enterprise:topic/data-management-platform"
//                     },
//                     {
//                         "label": "Digital Foundation",
//                         "id": "adobe-com-enterprise:topic/digital-foundation"
//                     },
//                     {
//                         "label": "Digital Trends",
//                         "id": "adobe-com-enterprise:topic/digital-trends"
//                     },
//                     {
//                         "label": "Document Management",
//                         "id": "adobe-com-enterprise:topic/document-management"
//                     },
//                     {
//                         "label": "Marketing Automation",
//                         "id": "adobe-com-enterprise:topic/marketing-automation"
//                     },
//                     {
//                         "label": "Personalization",
//                         "id": "adobe-com-enterprise:topic/personalization"
//                     },
//                     {
//                         "label": "Stock",
//                         "id": "adobe-com-enterprise:topic/Stock"
//                     }
//                 ]
//             },
//             {
//                 "group": "Availability",
//                 "id": "adobe-com-enterprise:availability",
//                 "items": [
//                     {
//                         "label": "On-Demand",
//                         "id": "adobe-com-enterprise:availability/on-demand"
//                     },
//                     {
//                         "label": "Upcoming",
//                         "id": "adobe-com-enterprise:availability/upcoming"
//                     }
//                 ]
//             },
//             {
//                 "group": "Duration",
//                 "id": "adobe-com-enterprise:duration",
//                 "items": [
//                     {
//                         "label": "Long",
//                         "id": "adobe-com-enterprise:duration/long"
//                     },
//                     {
//                         "label": "Short",
//                         "id": "adobe-com-enterprise:duration/short"
//                     }
//                 ]
//             },
//             {
//                 "group": "Rating",
//                 "id": "adobe-com-enterprise:rating",
//                 "items": [
//                     {
//                         "label": "5",
//                         "id": "adobe-com-enterprise:rating/5"
//                     },
//                     {
//                         "label": "4",
//                         "id": "adobe-com-enterprise:rating/4"
//                     }
//                 ]
//             }
//         ],
//         filterLogic: 'or',
//         topPanel: {
//             mobile: {
//                 blurFilters: true,
//             }
//         },
//         i18n: {
//             leftPanel: {
//                 header: 'My Favorites',
//                 // searchBoxTitle: 'Search',
//                 clearAllFiltersText: 'Clear All',
//                 mobile: {
//                     filtersBtnLabel: 'Filters:',
//                     panel: {
//                         header: 'Filters',
//                         totalResultsText: '{total} Results',
//                         applyBtnText: 'Apply',
//                         clearFilterText: 'Clear',
//                         doneBtnText: 'Done',
//                     },
//                     group: {
//                         totalResultsText: '{total} Results',
//                         applyBtnText: 'Apply',
//                         clearFilterText: 'Clear Left',
//                         doneBtnText: 'Done',
//                     }
//                 }
//             },
//             topPanel: {
//                 groupLabel: 'Filters',
//                 clearAllFiltersText: 'Clear All Top',
//                 moreFiltersBtnText: 'More Filters: +',
//                 mobile: {
//                     group: {
//                         totalResultsText: '{total} esults',
//                         applyBtnText: 'Apply',
//                         clearFilterText: 'Clear Top',
//                         doneBtnText: 'Done',
//                     }
//                 }
//             }
//         }
//     },
//     hideCtaIds: [''],
//     sort: {
//         enabled: 'true',
//         defaultSort: 'customSort',
//         options: '[{"label":"Random", "sort":"random"},{"label":"Featured","sort":"featured"},{"label":"Title: (A-Z)","sort":"titleAsc"},{"label":"Title: (Z-A)","sort":"titleDesc"},{"label":"Date: (Oldest to newest)","sort":"dateAsc"},{"label":"Date: (Newest to oldest)","sort":"dateDesc"}, {"label": "Custom Sort", "sort": "customSort"}]',
//         customSort: function(card){console.log("customSort: ", card); return card;}
//     },
//     pagination: {
//         animationStyle: 'paged',
//         enabled: 'true',
//         type: 'loadMore',
//         loadMoreButton: {
//             style: "primary", // Can be "primary", "over-background";
//             useThemeThree: "true", // Can be "true" or "false";
//         },
//         i18n: {
//             loadMore: {
//                 btnText: 'Load More',
//                 resultsQuantityText: 'Showing {start} of {end} cards',
//             },
//             paginator: {
//                 resultsQuantityText: '{start}-{end} of {total} results',
//                 prevLabel: 'Prev',
//                 nextLabel: 'Next',
//             }
//         }
//     },
//     bookmarks: {
//         showOnCards: 'true',
//         leftFilterPanel: {
//             bookmarkOnlyCollection: 'false',
//             showBookmarksFilter: 'true',
//             selectBookmarksIcon: '',
//             unselectBookmarksIcon: '',
//         },
//         i18n: {
//             leftFilterPanel: {
//                 filterTitle: 'My Favorites',
//             }
//         }
//     },
//     search: {
//         enabled: 'true',
//         searchFields: '["contentArea.title","contentArea.description","search.meta.author","overlays.banner.description", "foo.bar"]',
//         i18n: {
//             noResultsTitle: 'No Results Found',
//             noResultsDescription: 'We could not find any results. {break} Try checking your spelling or broadening your search.',
//             leftFilterPanel: {
//                 searchTitle: 'Search',
//                 searchPlaceholderText: 'Search here...',
//             },
//             topFilterPanel: {
//                 searchPlaceholderText: 'i18n.topFilterPanel.searchPlaceholderText',
//             },
//             filterInfo: {
//                 searchPlaceholderText: 'i18n.filterInfo.searchPlaceholderText',
//             }
//         }
//     },
//     language: 'en-US',
//     analytics: {
//         trackImpressions: 'true',
//         collectionIdentifier: 'Some Identifier',
//     },
//     customCard: ["data", "return `<div class=customCard><div class=backgroundImg></div> <section><label>PHOTO EDITING</label><p><b>Transform a landscape with Sky Replacement.</b></p></div></section> </div>`"],
//     onCardSaved: function(){},
//     onCardUnsaved: function(){}
// };

//render(<Container config={parseToPrimitive(window.config)} />, document.getElementById('someDivId'));

// class Foo extends PureComponent {
//     render(props) {
//         console.log("render");
//         return <div> Hi </div>
//     }
// }

//function ConsonantCardCollection(config, dom){
//}

// import ReactDOM, {render} from 'react-dom'
//import * as ReactDOM from 'react-dom/client';
// import { DOMRegistry } from 'react-dom-components';
(0, _preact.render)(_react2.default.createElement(_Container2.default, { config: (0, _general.parseToPrimitive)(window.config) }), document.getElementById('someDivId'));

//window.ConsonantCardCollection = ConsonantCardCollection;

// var a = ReactDOMServer.renderToString(<React.Fragment>
//     <Container config={parseToPrimitive(config)} />
// </React.Fragment>);
//
// window.a = a;
// console.log(a);

// ReactDOM.hydrate(<React.Fragment>
//     <Container config={parseToPrimitive(config)} />
// </React.Fragment>, document.getElementById('someDivId'));

// if (window.Granite && window.dx) {
//     window.dx.author.watch.registerFunction(authorWatch);
// }
// export default initReact;
/* eslint-disable */
//import "./polyfills";

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const { MinPriorityQueue } = __webpack_require__(32);
const { MaxPriorityQueue } = __webpack_require__(36);
const { PriorityQueue } = __webpack_require__(15)

module.exports = { MinPriorityQueue, MaxPriorityQueue, PriorityQueue };


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 * @license MIT
 */

const { MinHeap } = __webpack_require__(13);
const { PriorityQueue } = __webpack_require__(15);

/**
 * @class MinPriorityQueue
 * @extends PriorityQueue
 */
class MinPriorityQueue extends PriorityQueue {
  constructor(options) {
    super(options);
    if (!this._compare) {
      this._heap = new MinHeap();
    }
  }
}

exports.MinPriorityQueue = MinPriorityQueue;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @license MIT
 * @copyright 2019 Eyas Ranjous <eyas.ranjous@gmail.com>
 */

const { Heap } = __webpack_require__(14);

/**
 * @class MinHeap
 * @extends Heap
 */
class MinHeap extends Heap {
  /**
   * Checks two nodes are in relatively valid position
   * @private
   * @param {object} parent
   * @param {object} child
   * @returns {boolean}
   */
  _compareKeys(parentKey, childKey) {
    return parentKey < childKey;
  }

  /**
   * Returns min child's index of two children before an index
   * @protected
   * @param {number} index
   * @param {number} leftChildIndex
   * @param {number} rightChildIndex
   * @returns {number}
   */
  _compareChildrenBefore(index, leftChildIndex, rightChildIndex) {
    const leftChildKey = this._getKey(this._nodes[leftChildIndex]);
    const rightChildKey = this._getKey(this._nodes[rightChildIndex]);

    if (rightChildKey < leftChildKey && rightChildIndex < index) {
      return rightChildIndex;
    }
    return leftChildIndex;
  }

  /**
   * Returns a shallow copy of the heap
   * @public
   * @returns {MinHeap}
   */
  clone() {
    return super._clone(MinHeap);
  }

  /**
   * Builds a min heap from an array of items
   * @public
   * @static
   * @param {array} list
   * @returns {MinHeap}
   */
  static heapify(list) {
    return super._heapify(list, MinHeap);
  }

  /**
   * Checks if a list of list is a valid min heap
   * @public
   * @static
   * @param {array} list
   * @returns {boolean}
   */
  static isHeapified(list) {
    return super._isHeapified(list, MinHeap);
  }
}

exports.MinHeap = MinHeap;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @license MIT
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 */

const { Heap } = __webpack_require__(14);

/**
 * @class MaxHeap
 * @extends Heap
 */
class MaxHeap extends Heap {
  /**
   * Checks two nodes are in relatively valid position
   * @private
   * @param {object} parent
   * @param {object} child
   * @returns {boolean}
   */
  _compareKeys(parentKey, childKey) {
    return parentKey > childKey;
  }

  /**
   * Returns max child's index of two children before an index
   * @private
   * @param {number} index
   * @param {number} leftChildIndex
   * @param {number} rightChildIndex
   * @returns {number}
   */
  _compareChildrenBefore(index, leftChildIndex, rightChildIndex) {
    const leftChildKey = this._getKey(this._nodes[leftChildIndex]);
    const rightChildKey = this._getKey(this._nodes[rightChildIndex]);

    if (rightChildKey > leftChildKey && rightChildIndex < index) {
      return rightChildIndex;
    }
    return leftChildIndex;
  }

  /**
   * Returns a shallow copy of the heap
   * @public
   * @returns {MaxHeap}
   */
  clone() {
    return super._clone(MaxHeap);
  }

  /**
   * Builds a max heap from an array of items
   * @public
   * @static
   * @param {array} list
   * @returns {MaxHeap}
   */
  static heapify(list) {
    return super._heapify(list, MaxHeap);
  }

  /**
   * Checks if a list of items is a valid max heap
   * @public
   * @static
   * @param {array} list
   * @returns {boolean}
   */
  static isHeapified(list) {
    return super._isHeapified(list, MaxHeap);
  }
}

exports.MaxHeap = MaxHeap;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @license MIT
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 */

const { Heap } = __webpack_require__(14);

/**
 * @class CustomHeap
 * @extends Heap
 */
class CustomHeap extends Heap {
  constructor(comparator, nodes, leaf) {
    if (typeof comparator !== 'function') {
      throw new Error('CustomHeap expects a comparator function');
    }
    super(nodes, leaf);
    this._comparator = comparator;
  }

  /**
   * Compares parent & child nodes
   * and returns true if they are in right positions
   *
   * @private
   * @param {object|number|string} parent
   * @param {object|number|string} child
   * @returns {number}
   */
  _compare(parentNode, childNode) {
    return this._comparator(parentNode, childNode) <= 0;
  }

  /**
   * Returns child's index of two children before an index
   * @private
   * @param {number} index
   * @param {number} leftChildIndex
   * @param {number} rightChildIndex
   * @returns {number}
   */
  _compareChildrenBefore(index, leftChildIndex, rightChildIndex) {
    const compare = this._comparator(
      this._nodes[rightChildIndex],
      this._nodes[leftChildIndex]
    );

    if (compare <= 0 && rightChildIndex < index) {
      return rightChildIndex;
    }

    return leftChildIndex;
  }

  /**
   * Returns a shallow copy of the heap
   * @public
   * @returns {CustomHeap}
   */
  clone() {
    return new CustomHeap(
      this._comparator,
      this._nodes.slice(),
      this._leaf
    );
  }

  /**
   * Builds a custom heap from an array of items
   * @public
   * @static
   * @param {array} list
   * @param {function} comparator
   * @returns {CustomHeap}
   */
  static heapify(list, comparator) {
    if (!Array.isArray(list)) {
      throw new Error('.heapify expects an array');
    }

    if (typeof comparator !== 'function') {
      throw new Error('.heapify expects a comparator function');
    }

    return new CustomHeap(comparator, list).fix();
  }

  /**
   * Checks if a list of items is a valid custom heap
   * @public
   * @static
   * @param {array} list
   * @param {function} comparator
   * @returns {boolean}
   */
  static isHeapified(list, comparator) {
    if (!Array.isArray(list)) {
      throw new Error('.heapify expects an array');
    }

    if (typeof comparator !== 'function') {
      throw new Error('.isHeapified expects a comparator function');
    }

    return new CustomHeap(comparator, list).isValid();
  }
}

exports.CustomHeap = CustomHeap;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 * @license MIT
 */

const { MaxHeap } = __webpack_require__(13);
const { PriorityQueue } = __webpack_require__(15);

/**
 * @class MaxPriorityQueue
 * @extends PriorityQueue
 */
class MaxPriorityQueue extends PriorityQueue {
  constructor(options) {
    super(options);
    if (!this._compare) {
      this._heap = new MaxHeap();
    }
  }
}

exports.MaxPriorityQueue = MaxPriorityQueue;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint-disable */

// import classNames from 'classnames';
// import { shape } from 'prop-types';
// import 'whatwg-fetch';
// import Popup from '../Sort/Popup';
// import Search from '../Search/Search';
// import Loader from '../Loader/Loader';

// import { configType } from '../types/config';
// import CardsCarousel from '../CardsCarousel/CardsCarousel';

// import LoadMore from '../Pagination/LoadMore';
// import Bookmarks from '../Bookmarks/Bookmarks';
// import Paginator from '../Pagination/Paginator';

// import FiltersPanelTop from '../Filters/Top/Panel';
// import LeftFilterPanel from '../Filters/Left/Panel';

// import { useWindowDimensions, useURLState } from '../Helpers/hooks';
// import { Info as LeftInfo } from '../Filters/Left/Info';
// import {
//     DESKTOP_MIN_WIDTH,
//     FILTER_TYPES,
//     FILTER_PANEL,
//     LOADER_SIZE,
//     PAGINATION_COUNT,
//     TABLET_MIN_WIDTH,
//     TRUNCATE_TEXT_QTY,
//     SORT_POPUP_LOCATION,
//     THEME_TYPE,
//     LAYOUT_CONTAINER,
//     ONE_SECOND_DELAY,
//     SORT_TYPES,
// } from '../Helpers/constants';
// import {
//     ConfigContext,
//     ExpandableContext,
// } from '../Helpers/contexts';


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _general = __webpack_require__(2);

var _View = __webpack_require__(38);

var _View2 = _interopRequireDefault(_View);

var _Grid = __webpack_require__(48);

var _Grid2 = _interopRequireDefault(_Grid);

var _CardFilterer = __webpack_require__(87);

var _CardFilterer2 = _interopRequireDefault(_CardFilterer);

var _JsonProcessor = __webpack_require__(89);

var _JsonProcessor2 = _interopRequireDefault(_JsonProcessor);

var _consonant = __webpack_require__(24);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// import {
//     shouldDisplayPaginator,
//     getNumCardsToShow,
//     getTotalPages,
//     getActiveFilterIds,
//     getActivePanels,
//     getUpdatedCardBookmarkData,
// } from '../Helpers/Helpers';


/**
 * Consonant Card Collection
 * Config is implicitly populated by authors
 *
 * @component
 * @example
 * const config = {
    collection: {},
    featuredCards: [{}],
    filterPanel: {},
    hideCtaIds: [{}],
    sort: {},
    pagination: {},
    bookmarks: {},
    search: {},
    language: ''
 * }
 * return (
 *   <Container config={config}/>
 * )
 */
var Container = function Container(props) {
  var config = props.config;

  var getConfig = (0, _consonant.makeConfigGetter)(config);
  // const filterGroupPrefix = 'ch_';
  // const searchPrefix = 'sh_';

  /**
   **** Authored Configs ****
   */
  // const filterPanelEnabled = getConfig('filterPanel', 'enabled');
  // const filterPanelType = getConfig('filterPanel', 'type');
  // const paginationType = getConfig('pagination', 'type');
  // const paginationIsEnabled = getConfig('pagination', 'enabled');
  // const resultsPerPage = getConfig('collection', 'resultsPerPage');
  // const onlyShowBookmarks = getConfig('bookmarks', 'leftFilterPanel.bookmarkOnlyCollection');
  // const authoredFilters = getConfig('filterPanel', 'filters');
  // const filterLogic = getConfig('filterPanel', 'filterLogic').toLowerCase().trim();
  // let totalCardLimit = getConfig('collection', 'totalCardsToShow');
  // const sampleSize = getConfig('collection', 'reservoir.sample');
  // const reservoirSize = getConfig('collection', 'reservoir.pool');
  // const searchFields = getConfig('search', 'searchFields');
  var sortOptions = getConfig('sort', 'options');
  var defaultSort = getConfig('sort', 'defaultSort');
  var tempCards = getConfig('cards', '');
  //const defaultSortOption = getDefaultSortOption(config, defaultSort);
  // const featuredCards = getConfig('featuredCards', '')
  //     .toString()
  //     .replace(/\[|\]/g, '')
  //     .replace(/`/g, '')
  //     .split(',');
  // const hideCtaIds = getConfig('hideCtaIds', '')
  //     .toString()
  //     .replace(/\[|\]/g, '')
  //     .replace(/`/g, '')
  //     .split(',');
  // const leftPanelSearchPlaceholder = getConfig('search', 'i18n.leftFilterPanel.searchPlaceholderText');
  // const topPanelSearchPlaceholder = getConfig('search', 'i18n.topFilterPanel.searchPlaceholderText');
  // const searchPlaceholderText = getConfig('search', 'i18n.filterInfo.searchPlaceholderText');
  // const noResultsTitle = getConfig('search', 'i18n.noResultsTitle');
  // const noResultsDescription = getConfig('search', 'i18n.noResultsDescription');
  // const apiFailureTitle = getConfig('collection', 'i18n.onErrorTitle');
  // const apiFailureDescription = getConfig('collection', 'i18n.onErrorDescription');
  // const isLazy = getConfig('collection', 'lazyload');
  // const trackImpressions = getConfig('analytics', 'trackImpressions');
  // const collectionIdentifier = getConfig('analytics', 'collectionIdentifier');
  // const targetEnabled = getConfig('target', 'enabled');
  // const useLastViewedSession = getConfig('target', 'lastViewedSession');
  // const authoredMode = getConfig('collection', 'mode');
  // const authoredLayoutContainer = getConfig('collection', 'layout.container');
  // const showEmptyFilters = getConfig('filterPanel', 'showEmptyFilters');
  // const eventFilter = getConfig('filterPanel', 'eventFilter');
  // const searchEnabled = getConfig('search', 'enabled');
  // const sortEnabled = getConfig('sort', 'enabled');
  // const cardStyle = getConfig('collection', 'cardStyle');
  // const title = getConfig('collection', 'i18n.title');

  /**
   **** Constants ****
   */
  // const DESKTOP_SCREEN_SIZE = window.innerWidth >= DESKTOP_MIN_WIDTH;
  // const isXorFilter = filterLogic.toLowerCase().trim() === FILTER_TYPES.XOR;
  // const isCarouselContainer = authoredLayoutContainer === LAYOUT_CONTAINER.CAROUSEL;
  // const isStandardContainer = authoredLayoutContainer !== LAYOUT_CONTAINER.CAROUSEL;
  /**
   **** Hooks ****
   */
  /**
   * @typedef {Array} timedCollection - result of Timed Event Sort
   * @description — As an alternative/iteration on filtered cards for timed
   * collections
   * @typedef {Function} setTimedCollection
   * @description - Sets timedCollection after setTimeout triggers
   *
   * @type {[Array, Function]} timedCollection
   */
  /* eslint-disable no-unused-vars */
  // const [timedCollection, setTimedCollection] = useState([]);
  /**
   * @typedef {Number} transition - MS to next transition
   * @description —  set by eventSort, from cardFilteret.nextTransitionMs
   * @typedef {Function} setTransition
   * @description - next Transition trigger
   *
   * @type {[Number, Function]} transition
   */
  /* eslint-disable no-unused-vars */
  // const [transition, setTransition] = useState(0);
  //
  // const [, updateState] = React.useState();
  var scrollElementRef = (0, _react.useRef)(null);
  // const nextTransition = React.useCallback(() => updateState({}), []);
  /**
   * @typedef {Object} urlState
   * @description — object with url query values
   *
   * @typedef {Function} setUrlState
   * @description - set url query value by key
   *
   * @typedef {Function} clearUrlState
   * @description - clear whole url query state
   *
   * @type {[Object, Function, Function]} OpenDropdown
   */
  // const [urlState, setUrlState, clearUrlState] = useURLState();

  /**
   * @typedef {Number} OpenDropdownState - Id of a selected dropdown
   * @description — Passed in Context Provider So All Nested Components can be in sync
   *
   * @typedef {Function} OpenDropdownStateSetter
   * @description
   *
   * @type {[Number, Function]} OpenDropdown
   */
  // const [openDropdown, setOpenDropdown] = useState(null);

  /**
   * @typedef {Array} BookmarkedCardIdsState — Initiailzed From Local Storage
   *
   * @typedef {Function} BookmarkedCardIdsSetter — Sets internal state of saved bookmarks
   *
   * @type {[Array, Function]} BookmarkedCardIds
   */
  // const [bookmarkedCardIds, setBookmarkedCardIds] = useState(readBookmarksFromLocalStorage());
  // const [inclusionIds] = useState(readInclusionsFromLocalStorage());

  /**
   * @typedef {Number} CurrentPageState — Initialized to the first page
   * @description Same page state for 'Load More' or 'Paginator'
   *
   * @typedef {Function} CurrentPageStateSetter — Sets page as user navigates through pages
   *
   * @type {[Number, Function]} CurrentPage
   */
  // const [currentPage, setCurrentPage] = useState(+urlState.page || 1);

  /**
   * @typedef {Array} FiltersState — Contains Filters For Filter Panel
   * @description Same Filter state for Left or Top
   *
   * @typedef {Function} FiltersStateSetter — Sets Authored Filters as State
   *
   * @type {[Array, Function]} Filters
   */
  // const [filters, setFilters] = useState([]);

  /**
   * @typedef {String} SearchQueryState — Will be used to search through cards
   * @typedef {Function} SearchQueryStateSetter — Sets user search query
   *
   * @type {[String, Function]} SearchQuery
   */
  // const [searchQuery, setSearchQuery] = useState('');

  /**
   * @typedef {String} SortOpenedState — Toggles Sort Popup Opened Or Closed
   * @typedef {Function} SortOpenedStateSetter — Sets Sort Option
   *
   * @type {[Boolean, Function]} SortOpened
   */
  // const [sortOpened, setSortOpened] = useState(false);

  /**
   * @typedef {String} SortOptionState — Can be one of a range of types
   * @description 'Title (A-Z)', 'Title (Z-A), Date (New to Old), Date (Old to New), Featured
   *
   * @typedef {Function} SortOptionStateSetter — Sets Sort Option
   *
   * @type {[String, Function]} SortOption
   */
  //const [sortOption, setSortOption] = useState(defaultSortOption);
  //
  // if (sortOption.sort === SORT_TYPES.RANDOM) {
  //     totalCardLimit = sampleSize;
  // }

  /**
   * @typedef {Boolean} WindowWidthState — Can either be true or false
   * @description Used to toggle between mobile and desktop layouts
   *
   * @typedef {Function} WindowWidthStateSetter — Updates window width
   *
   * @type {[Number]} WindowWidth
   */
  // const { width: windowWidth } = useWindowDimensions();

  /**
   * @typedef {Boolean} ShowMobileFiltersState — Can either be true or false
   * @description When true mobile filters will appear on the page
   *
   * @typedef {Function} ShowMobileFiltersStateSetter
   * @description Toggles mobile filter header/footer to show or hide
   *
   * @type {[Boolean, Function]} ShowMobileFilters
   */
  // const [showMobileFilters, setShowMobileFilters] = useState(false);

  /**
   * @typedef {Boolean} ShowBookmarkState — Can either be true or false
   * @description For Top Filter Panel, there is a limit to how many filter groups can show
   *
   * @typedef {Function} ShowBookmarkStateSetter — Sets limit on filter quantity
   * @description When over allowed Filter Group Quantity - A "More +" button appears
   *
   * @type {[Boolean, Function]} ShowBookmarks
   */
  // const [showBookmarks, setShowBookmarks] = useState(false);

  /**
   * @typedef {Boolean} LimitFilterQuantityState — Can either be true or false
   * @description For Top Filter Panel, there is a limit to how many filter groups can show
   *
   * @typedef {Function} LimitFilterQuantityStateSetter — Sets limit on filter quantity
   * @description When over allowed Filter Group Quantity - A "More +" button appears
   *
   * @type {[Boolean, Function]} LimitFilterQuantity
   */
  // const [showLimitedFiltersQty, setShowLimitedFiltersQty] = useState(filterPanelType === 'top');

  /**
   * @typedef {Array} CardState
   * @description sets cards retrieved either server side render or API call
   *
   * @typedef {Function} CardStateSetter
   * @description E.g. Render Featured Cards Server side, While collection cards from API call
   *
   * @type {[Array, Function]} Cards
   */

  var _useState = (0, _react.useState)(tempCards),
      _useState2 = _slicedToArray(_useState, 2),
      cards = _useState2[0],
      setCards = _useState2[1];

  /**
   * @typedef {Boolean} LoadingState — Can either be true or false
   * @description When true a loading spinner will appear on the page
   *
   * @typedef {Function} LoadingStateSetter — Sets loader true or false
   * @description True while waiting for API response. False on cards retrieved or api failure
   *
   * @type {[Boolean, Function]} Loading
   */


  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isLoading = _useState4[0],
      setLoading = _useState4[1];

  /**
   * @typedef {Boolean} ApiFailureState — Can either be true or false
   * @description When true an API error has occured
   *
   * @typedef {Function} ApiFailureStateSetter — Sets API failure flag true or false
   * @description True when retrieved or api failure. False otherwise
   *
   * @type {[Boolean, Function]} ApiFailure
   */


  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isApiFailure = _useState6[0],
      setApiFailure = _useState6[1];
  // const [randomSortId, setRandomSortId] = useState(null);


  var _useState7 = (0, _react.useState)(true),
      _useState8 = _slicedToArray(_useState7, 2),
      isFirstLoad = _useState8[0],
      setIsFirstLoad = _useState8[1];

  var _useState9 = (0, _react.useState)(),
      _useState10 = _slicedToArray(_useState9, 2),
      visibleStamp = _useState10[0],
      setVisibleStamp = _useState10[1];

  var _useState11 = (0, _react.useState)(false),
      _useState12 = _slicedToArray(_useState11, 2),
      hasFetched = _useState12[0],
      setHasFetched = _useState12[1];

  /**
   * Creates a DOM reference to first filter item
   * @returns {Object} - filter item DOM reference
   */
  // const filterItemRef = createRef();

  /**
   * Creates a DOM reference to filter info button
   * @returns {Object} - filter info DOM reference
   */
  // const filterInfoRef = createRef();

  /**
   **** Helper Methods ****
   */

  /**
   * For a given group of filters, it will unselect all of them
   * @param {Array} filterGroups - a group of filters
   * @returns {Array} fitlerGroups - the updated group of filters
   */
  // const getAllFiltersClearedState = filterGroups => filterGroups.map(filterGroup => ({
  //     ...filterGroup,
  //     items: filterGroup.items.map(filterItem => ({
  //         ...filterItem,
  //         selected: false,
  //     })),
  // }));

  /**
   * For a given group of filters, it will unselect the one with a given id
   * @param {Number} id - the id of an individual filter item
   * @param {Array} filterGroups - a group of filters
   * @returns {Array} fitlerGroups - the updated group of filters
   */
  // const getFilterItemClearedState = (id, filterGroups) => filterGroups.map((filterGroup) => {
  //     if (filterGroup.id !== id) {
  //         return filterGroup;
  //     }
  //     return {
  //         ...filterGroup,
  //         items: filterGroup.items.map(filterItem => ({
  //             ...filterItem,
  //             selected: false,
  //         })),
  //     };
  // });

  /**
   * Will uncheck a filter with a given id
   * @param {Number} id - the id of an individual filter item
   * @returns {Void} - an updated state
   */
  // const clearFilterItem = (id) => {
  //     setFilters((prevFilters) => {
  //         const filterClearedState = getFilterItemClearedState(id, prevFilters);
  //         return filterClearedState;
  //     });
  //
  //     const urlParams = new URLSearchParams(window.location.search);
  //     clearUrlState();
  //     urlParams.forEach((value, key) => {
  //         const chFilter = key.toLowerCase().replace('ch_', '').replace(' ', '-');
  //         if (key.indexOf(filterGroupPrefix) !== 0 || !id.includes(chFilter)) {
  //             setUrlState(key, value.replace('%20', ' '));
  //         }
  //     });
  // };

  /**
   * Will uncheck all filter items
   * @returns {Void} - an updated state
   */
  // const clearAllFilters = () => {
  //     setFilters((prevFilters) => {
  //         const allFiltersClearedState = getAllFiltersClearedState(prevFilters);
  //         return allFiltersClearedState;
  //     });
  //
  //     const urlParams = new URLSearchParams(window.location.search);
  //
  //     clearUrlState();
  //     urlParams.forEach((value, key) => {
  //         if (key.indexOf(filterGroupPrefix) !== 0) setUrlState(key, value);
  //     });
  // };

  /**
   * Resets filters, and search to empty. Hides bookmark filter
   * @returns {Void} - an updated state
   */
  // const resetFiltersSearchAndBookmarks = () => {
  //     clearAllFilters();
  //     setSearchQuery('');
  //     setShowBookmarks(false);
  // };

  /**
   **** EVENT HANDLERS ****
   */

  /**
   * On Load More Button Click, Increment Page Cuonter By 1
   *
   * @param {ClickEvent} e
   * @listens ClickEvent
   */
  // const onLoadMoreClick = () => {
  //     setCurrentPage(prevState => prevState + 1);
  //     window.scrollTo(0, window.pageYOffset);
  // };

  /**
   * Takes sort user selects and sets it so cards are sorted
   *
   * @param {ClickEvent} e - The observable event.
   * @listens ClickEvent
   */
  // const handleSortChange = (option) => {
  //     setSortOption(option);
  //     setSortOpened(false);
  //     setIsFirstLoad(false);
  // };

  /**
   * Handles whenever the search box is clicked or input field
   * changes
   *
   * @param {ClickEvent, ChangeEvent} e
   * @listens ClickEvent, ChangeEvent
   */
  // const handleSearchInputChange = (val) => {
  //     setSearchQuery(val);
  //     setUrlState(searchPrefix, val);
  // };

  /**
   * Handles when a group of filters is clicked. Behavior should be
   * to toggle group open or closed
   *
   * @param {ClickEvent} e - The observable event.
   * @listens ClickEvent
   */
  // const handleFilterGroupClick = (filterId) => {
  //     setFilters((prevFilters) => {
  //         let opened;
  //         return prevFilters.map((el) => {
  //             if (el.id === filterId) {
  //                 opened = !el.opened;
  //             } else {
  //                 // eslint-disable-next-line prefer-destructuring
  //                 opened = el.opened;
  //             }
  //             return { ...el, opened };
  //         });
  //     });
  // };

  /**
   * Will find and set needed filter to url
   *
   * @param {string} filterId - selected filter group id
   * @param {string} itemId - selected filter item id
   * @param {boolean} isChecked
   * @returns {Void} - an updated url
   */
  // const changeUrlState = (filterId, itemId, isChecked) => {
  //     const { group, items } = filters.find(({ id }) => id === filterId);
  //     const { label } = items.find(({ id }) => id === itemId);
  //
  //     let urlStateValue = urlState[filterGroupPrefix + group] || [];
  //     if (typeof urlStateValue === 'string') {
  //         urlStateValue = urlStateValue.split(',');
  //     }
  //
  //     const value = isChecked
  //         ? [...urlStateValue, label]
  //         : urlStateValue.filter(item => item !== label);
  //
  //     setUrlState(filterGroupPrefix + group, value);
  // };

  /**
   * Handles what happens when a specific filter item (checkbox)
   * is clicked
   *
   * @param {CheckboxClickEvent} e
   * @listens CheckboxClickEvent
   */
  // const handleCheckBoxChange = (filterId, itemId, isChecked) => {
  //     if (isXorFilter && isChecked) {
  //         clearAllFilters();
  //     }
  //
  //     setFilters(prevFilters => prevFilters.map((filter) => {
  //         if (filter.id !== filterId) return filter;
  //
  //         return {
  //             ...filter,
  //             items: filter.items.map(item => ({
  //                 ...item,
  //                 selected: item.id === itemId ? !item.selected : item.selected,
  //             })),
  //         };
  //     }));
  //     setCurrentPage(1);
  //     changeUrlState(filterId, itemId, isChecked);
  // };

  /**
   * Shows/Hides Mobile Filter Panel
   *
   * @param {ClickEvent} e
   * @listens ClickEvent
   */
  // const handleMobileFiltersToggle = () => setShowMobileFilters(prev => !prev);

  /**
   * When a card's bookmark icon is clicked, save the card
   *
   * @param {ClickEvent} e
   * @listens ClickEvent
   */
  // const handleCardBookmarking = (id) => {
  //     // Update bookmarked IDs
  //     const cardIsBookmarked = bookmarkedCardIds.find(card => card === id);
  //
  //     if (cardIsBookmarked) {
  //         setBookmarkedCardIds(prev => prev.filter(el => el !== id));
  //     } else {
  //         setBookmarkedCardIds(prev => [...prev, id]);
  //     }
  // };

  /**
   * Will show  or hide all saved bookmarks when clicked
   *
   * @param {ClickEvent} e
   * @listens ClickEvent
   */
  // const handleShowBookmarksFilterClick = (e) => {
  //     e.stopPropagation();
  //     setShowBookmarks(prev => !prev);
  //     setCurrentPage(1);
  // };

  /**
   * If top filter panel, toggle or hide more button
   *
   * @param {ClickEvent} e
   * @listens ClickEvent
   */
  // const handleShowAllTopFilters = () => {
  //     setShowLimitedFiltersQty(prev => !prev);
  // };

  /**
   * On window click, all dropdowns should hide
   *
   * @param {ClickEvent} e
   * @listens ClickEvent
   */
  // const handleWindowClick = () => {
  //     setOpenDropdown(null);
  // };

  /**
   * Handles escape for mobile filter dialog
   *
   * @param event
   */
  // const handleMobileFilterEscape = (event) => {
  //     if (event.key !== 'Escape' && event.key !== 'Esc') return;
  //
  //     setShowMobileFilters(false);
  // };

  /**
   **** Effects ****
   */

  /**
   * Sets authored filters as state
   * @returns {Void} - an updated state
   */

  // useEffect(() => {
  //     setFilters(authoredFilters.map(filterGroup => ({
  //         ...filterGroup,
  //         opened: DESKTOP_SCREEN_SIZE ? filterGroup.openedOnLoad : false,
  //         items: filterGroup.items.map(filterItem => ({
  //             ...filterItem,
  //             selected: false,
  //         })),
  //     })));
  // }, []);

  /**
   * Sets filters from url as tate
   * @returns {Void} - an updated state
   */

  // useEffect(() => {
  //     setFilters(origin => origin.map((filter) => {
  //         const { group, items } = filter;
  //         const urlStateValue = urlState[filterGroupPrefix + group];
  //
  //         if (!urlStateValue) return filter;
  //
  //         const urlStateArray = urlStateValue.split(',');
  //         return {
  //             ...filter,
  //             opened: true,
  //             items: items.map(item => ({
  //                 ...item,
  //                 selected: urlStateArray.includes(String(item.label)),
  //             })),
  //         };
  //     }));
  // }, []);
  //
  // useEffect(() => {
  //     setRandomSortId(Math.floor((Math.random() * 10e12)));
  // }, []);

  /**
   * Trigger after button load more click
   * @returns {Void} - an updated url page
   */
  // useEffect(() => {
  //     setUrlState('page', currentPage === 1 ? '' : currentPage);
  // }, [currentPage]);

  // const removeEmptyFilters = (allFilters, cardsFromJson) => {
  //     const tags = [].concat(...cardsFromJson.map(card => card.tags.map(tag => tag.id)));
  //
  //     return allFilters.map(filter => ({
  //         ...filter,
  //         items: filter.items.filter(item => tags.includes(item.id)),
  //     })).filter(filter => filter.items.length > 0);
  // };

  /**
   * This handles getting Cards, there are some conditions:
   * - If target is not enabled a simple request is made without mods or delay.
   * - If target is enabled & tVisitor API is present add values from Visitor
   * - If target is enabled & the Visitor API is not present setTimeout with
   * counter to recheck for the Visitor API. If 20 attempts are made w/o
   * success fail the request.
   * @returns {Void} - an updated state
   */


  (0, _react.useEffect)(function () {
    // if ((isLazy && visibleStamp) || (isLazy && !hasFetched)) {
    //     return;
    // }
    // const { __satelliteLoadedPromise: visitorPromise } = window;

    // let collectionEndpoint = getConfig('collection', 'endpoint');
    // const fallbackEndpoint = getConfig('collection', 'fallbackEndpoint');
    //
    // const r = new RegExp('^(?:[a-z]+:)?//', 'i');
    // let collectionEndpointURI;
    // if (r.test(collectionEndpoint)) {
    //     collectionEndpointURI = new URL(collectionEndpoint);
    // } else {
    //     collectionEndpointURI = new URL(collectionEndpoint, window.location.origin);
    // }
    //
    // if (!fallbackEndpoint) {
    //     collectionEndpointURI.searchParams.set('flatFile', false);
    //     collectionEndpoint = collectionEndpointURI.toString();
    // }

    // setLoading(true);
  });

  /**
   * @func getCards
   * @desc wraps fetch with function to make it reusable
   *
   * @param {String} endPoint, URL with params for card request
   * @returns {Void} - an updated state
   */
  // function getCards(endPoint = getConfig('collection', 'endpoint')) {
  //     return window.fetch(endPoint, {
  //         credentials: 'include',
  //     })
  //         .then((resp) => {
  //             const {
  //                 ok,
  //                 status,
  //                 statusText,
  //                 url,
  //             } = resp;
  //
  //             if (ok) {
  //                 return resp.json().then((json) => {
  //                      return json;
  //                     // return Promise.reject(new Error('no valid reponse data'));
  //                 });
  //             }
  //
  //             // return Promise.reject(new Error(`${status}: ${statusText}, failure for call to ${url}`));
  //         })
  //         .then((payload) => {
  //             // setLoading(false);
  //             // setIsFirstLoad(true);
  //             // if (!getByPath(payload, 'cards.length')) return;
  //
  //             const processedCards = payload.cards;
  //                 // .removeDuplicateCards()
  //                 // .addCardMetaData(
  //                 //     TRUNCATE_TEXT_QTY,
  //                 //     onlyShowBookmarks,
  //                 //     bookmarkedCardIds,
  //                 //     hideCtaIds,
  //                 // );
  //
  //             // const transitions = getTransitions(processedCards);
  //             // if (sortOption.sort.toLowerCase() === 'eventsort') {
  //             //     while (transitions.size() > 0) {
  //             //         setTimeout(() => {
  //             //             nextTransition();
  //             //         }, transitions.dequeue().priority + ONE_SECOND_DELAY);
  //             //     }
  //             // }
  //
  //             setCards(processedCards);
  //             // if (!showEmptyFilters) {
  //             //     setFilters(prevFilters => removeEmptyFilters(prevFilters, processedCards));
  //             // }
  //             // setTimeout(() => {
  //             //     if (!scrollElementRef.current) return;
  //             //     if (processedCards.length === 0) return;
  //             //     if (currentPage === 1) return;
  //             //     const cardsToshow = processedCards.slice(0, resultsPerPage * currentPage);
  //             //     const getLastPageID = (resultsPerPage * currentPage) - resultsPerPage;
  //             //     if (cardsToshow.length < getLastPageID) return;
  //             //     const lastID = scrollElementRef.current.children[getLastPageID];
  //             //     lastID.scrollIntoView();
  //             // }, 100);
  //         }).catch(() => {
  //             // if (endPoint === collectionEndpoint && fallbackEndpoint) {
  //             //     getCards(fallbackEndpoint);
  //             //     return;
  //             // }
  //             // setLoading(false);
  //             // setApiFailure(true);
  //         });
  // }
  //     /**
  //      * @func getVisitorData
  //      * @desc wraps fetching Visitor API data in a function for reuse, also if
  //      * last used session is checked, update currentEntityId with targetValueRevealID
  //      *
  //      * @param {Promise} visitorApi, window.__satelliteLoadedPromise when accessed
  //      * @returns {Void} - an updated state, thru calling getCards
  //      */
  //     function getVisitorData(visitorApi) {
  //         const collectionURI = new URL(collectionEndpoint);
  //
  //         if (useLastViewedSession) {
  //             const targetRevealId = localStorage.getItem('targetValueRevealID');
  //             if (targetRevealId) {
  //                 collectionURI.searchParams.set('currentEntityId', targetRevealId);
  //             }
  //         }
  //
  //         visitorApi.then((result) => {
  //             if (window.alloy && window.edgeConfigId) {
  //                 window.alloy('getIdentity')
  //                     .then((res) => {
  //                         collectionURI.searchParams.set('mcgvid', res.identity.ECID);
  //                         collectionURI.searchParams.set('mboxMCGLH', res.edge.regionId);
  //                         getCards(collectionURI.toString());
  //                     });
  //             } else {
  //                 const visitor = result.getVisitorId();
  //                 collectionURI.searchParams.set('mcgvid', visitor.getMarketingCloudVisitorID());
  //                 collectionURI.searchParams.set('sdid', visitor.getSupplementalDataID());
  //                 collectionURI.searchParams.set('mboxAAMB', visitor.getAudienceManagerBlob());
  //                 collectionURI.searchParams.set('mboxMCGLH', visitor.getAudienceManagerLocationHint());
  //                 getCards(collectionURI.toString());
  //             }
  //         });
  //     }
  //
  //     /**
  //      * @func visitorRetry
  //      * @desc Visitor API is late loading often, this sets a recursive call
  //      * in a setTimeout to run 20 times, and then fail the request.
  //      *
  //      * @returns {Void} - an updated state, thru calling getVisitorData which
  //      * calls getCards
  //      */
  //     function visitorRetry() {
  //         let retryCount = 0;
  //
  //         const timedRetry = () => {
  //             setTimeout(() => {
  //                 if (retryCount >= 20) {
  //                     setLoading(false);
  //
  //                     setApiFailure(true);
  //
  //                     return;
  //                 }
  //
  //                 const { __satelliteLoadedPromise: visitorPromiseRetry } = window;
  //
  //                 if (visitorPromiseRetry) {
  //                     getVisitorData(visitorPromiseRetry);
  //                 }
  //
  //                 if (!visitorPromiseRetry && retryCount < 20) {
  //                     timedRetry();
  //                 }
  //
  //                 retryCount += 1;
  //             }, 100);
  //         };
  //
  //         timedRetry();
  //     }
  //
  //     if (targetEnabled && visitorPromise) {
  //         getVisitorData(visitorPromise);
  //     }
  //
  //     if (targetEnabled && !visitorPromise) {
  //         visitorRetry();
  //     }
  //
  //     if (!targetEnabled) {
  //         getCards();
  //     }
  // }, [visibleStamp, hasFetched]);

  /**
   * Saves cards to local storage and updates card w/ bookmarked data
   * @returns {Void} - an updated state
   */
  // useEffect(() => {
  //     saveBookmarksToLocalStorage(bookmarkedCardIds);
  //     setCards(getUpdatedCardBookmarkData(cards, bookmarkedCardIds));
  // }, [bookmarkedCardIds]);


  /**
   * Handles clearing state on showBookmarks
   * @returns {Void} - an updated state
   */
  // useEffect(() => {
  //     if (showBookmarks) {
  //         clearAllFilters();
  //         setSearchQuery('');
  //     }
  // }, [showBookmarks]);

  (0, _react.useEffect)(function () {
    //getCards();
  }, []);

  /**
   * Handles focus and escape on mobile filter toggle
   * @returns {Void}
   */
  // useEffect(() => {
  //     if (showMobileFilters) {
  //         if (filterItemRef && filterItemRef.current) {
  //             filterItemRef.current.focusMobTitle();
  //         }
  //         document.addEventListener('keydown', handleMobileFilterEscape);
  //     } else {
  //         if (filterInfoRef && filterInfoRef.current) {
  //             filterInfoRef.current.focus();
  //         }
  //         document.removeEventListener('keydown', handleMobileFilterEscape);
  //     }
  //
  //     return () => {
  //         document.removeEventListener('keydown', handleMobileFilterEscape);
  //     };
  // }, [showMobileFilters]);
  //
  // const box = useRef();
  //
  // useEffect(() => {
  //     if (box && !visibleStamp && isLazy) {
  //         const io = new IntersectionObserver((entries) => {
  //             if (entries[0].intersectionRatio <= 0) return;
  //             setHasFetched(true);
  //             setVisibleStamp(new Date().getTime());
  //         });
  //         io.observe(box.current);
  //     }
  // }, [box]);

  /**
   **** Derived State ****
   */

  /**
   * Array of filters chosen by the user
   * @type {Array}
   */
  // const activeFilterIds = getActiveFilterIds(filters);

  /**
   * Array of filters panels (groupings) created by the author
   * @type {Array}
   */
  // const activePanels = getActivePanels(activeFilterIds) || new Set();

  /**
   * Instance of CardFilterer class that handles returning subset of cards
   * based off user interactions
   *
   * @type {Object}
   */
  /**
   * @type {Function} getFilteredCollection
   * @desc Closure around CardFilterer for reuse within context
   * @returns {Object}
   * */
  // const getFilteredCollection = cards;

  /**
   * @type {Array} filteredCards: Filtered cards based off current state of page
   * @type {Number} nextTransitionMs: Number for timed event sort transition
   */
  /* eslint-disable no-unused-vars */
  // const { filteredCards = [], nextTransitionMs = 0 } = getFilteredCollection();

  /**
   * Subset of cards to show the user
   * @type {Array}
   */
  //const gridCards = cards;

  /**
   * Total pages (used by Paginator Component)
   * @type {Number}
   */
  // const totalPages = getTotalPages(resultsPerPage, gridCards.length);

  /**
   * Number of cards to show (used by Load More component)
   * @type {Number}
   */
  // const numCardsToShow = getNumCardsToShow(resultsPerPage, currentPage, gridCards.length);

  /**
   * How many filters were selected - (used by Left Filter Panel)
   * @type {Number}
   */
  // const selectedFiltersItemsQty = getNumSelectedFilterItems(filters);

  /**
   * Conditions to Display A Form Of Pagination
   * @type {Boolean}
   */
  // const displayPagination = shouldDisplayPaginator(
  //     paginationIsEnabled,
  //     totalCardLimit,
  //     gridCards.length,
  // );
  /**
   * Conditions to display the Load More Button
   * @type {Boolean}
   */
  // const displayLoadMore = displayPagination && paginationType === 'loadMore';

  /**
   * Conditions to display the Paginator Component
   * @type {Boolean}
   */
  // const displayPaginator = displayPagination && paginationType === 'paginator';

  /**
   * Conditions to display the Left Filter Panel Component
   * @type {Boolean}
   */
  // const displayLeftFilterPanel = filterPanelEnabled && filterPanelType === FILTER_PANEL.LEFT;

  /**
   * Whether at lease one card was returned by Card Filterer
   * @type {Boolean}
   */
  // const atLeastOneCard = gridCards.length > 0;

  /**
   * Where to place the Sort Popup (either left or right)
   * @type {String} - Location of Sort Popup in Top Filter Panel View
   */
  // const topPanelSortPopupLocation = filters.length > 0 && windowWidth < TABLET_MIN_WIDTH ?
  //     SORT_POPUP_LOCATION.LEFT : SORT_POPUP_LOCATION.RIGHT;

  /**
   * How Long Paginator Component Should Be
   * @type {Number} - Location of Sort Popup in Top Filter Panel View
   */
  // const paginatorCount = DESKTOP_SCREEN_SIZE ? PAGINATION_COUNT.DESKTOP : PAGINATION_COUNT.MOBILE;

  /**
   * Whether we are using the top filter panel or not
   * @type {Boolean}
   */
  // const isTopFilterPanel = filterPanelType === FILTER_PANEL.TOP;

  /**
   * Whether we are using the top filter panel or not
   * @type {Boolean}
   */
  // const isLeftFilterPanel = filterPanelType === FILTER_PANEL.LEFT;

  /**
   * Ui options that cause grid to rerender necessitate the aria attribute being set
   * @type {Boolean}
   */
  // const isGridAreaLive =
  //     filterPanelEnabled ||
  //     searchEnabled ||
  //     sortEnabled ||
  //     paginationIsEnabled;
  //
  // let filterNames = '';
  // filters.forEach((el) => {
  //     el.items.filter(item => item.selected).forEach((item) => {
  //         filterNames += `${item.label}, `;
  //     });
  // });

  /**
   **** Class names ****
   */

  /**
   * Class name for the authored theme:
   * light, dark, darkest;
   * @type {String}
   */
  // const themeClass = classNames({
  //     'consonant-u-themeLight': authoredMode === THEME_TYPE.LIGHT,
  //     'consonant-u-themeDark': authoredMode === THEME_TYPE.DARK,
  //     'consonant-u-themeDarkest': authoredMode === THEME_TYPE.DARKEST,
  // });


  // const collectionStr = collectionIdentifier ? `${collectionIdentifier} | ` : '';
  // const filterStr = selectedFiltersItemsQty ? filterNames : 'No Filters';
  // const searchQueryStr = searchQuery || 'None';
  // const collectionAnalytics = `${collectionStr}Card Collection | Filters: ${filterStr}| Search Query: ${searchQueryStr}`;
  /**
   * Class name for the consonant wrapper:
   * whether consonant wrapper contains left filter;
   * @type {String}
   */
  // const wrapperClass = classNames({
  //     'consonant-Wrapper': true,
  //     'consonant-Wrapper--32MarginContainer': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_100_VW_32_MARGIN,
  //     'consonant-Wrapper--83PercentContainier': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_83_VW,
  //     'consonant-Wrapper--1200MaxWidth': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_1200_PX,
  //     'consonant-Wrapper--1600MaxWidth': authoredLayoutContainer === LAYOUT_CONTAINER.SIZE_1600_PX,
  //     'consonant-Wrapper--carousel': isCarouselContainer,
  //     'consonant-Wrapper--withLeftFilter': filterPanelEnabled && isLeftFilterPanel,
  // });

  return _react2.default.createElement(
    _react.Fragment,
    null,
    _react2.default.createElement(
      'section',
      {
        role: 'group',
        'aria-label': 'title',
        'daa-lh': 'collectionAnalytics',
        'daa-im': String(''),
        onClick: function onClick() {},
        className: 'a b' },
      _react2.default.createElement(
        'div',
        { className: 'consonant-Wrapper-inner' },
        'Hello',
        true && true && _react2.default.createElement('div', { className: 'consonant-Wrapper-leftFilterWrapper' }),
        _react2.default.createElement(
          'div',
          { className: 'consonant-Wrapper-collection' + (true ? ' is-loading' : '') },
          _react2.default.createElement(
            _react.Fragment,
            null,
            _react2.default.createElement(_Grid2.default, {
              resultsPerPage: 3,
              pages: 1,
              cards: cards,
              forwardedRef: scrollElementRef,
              onCardBookmark: function onCardBookmark() {},
              isAriaLiveActive: false })
          )
        )
      )
    )
  );
};

// Container.propTypes = {
//     config: shape(configType),
// };

Container.defaultProps = {
  config: {}
};

exports.default = Container;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _rendering = __webpack_require__(22);

var _hooks = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var viewType = {
    description: _propTypes.string,
    replaceValue: _propTypes.string,
    title: _propTypes.string.isRequired
};

var defaultProps = {
    description: '',
    replaceValue: ''
};

/**
 * No results message that is shown when search returned 0 results;
 *
 * @component
 * @example
 * const props= {
    title: String
    description: String,
    replaceValue: String,
 * }
 * return (
 *   <NoResultsView {...props}/>
 * )
 */
var View = function View(props) {
    var title = props.title,
        description = props.description,
        replaceValue = props.replaceValue;


    var getConfig = (0, _hooks.useConfig)();

    var displayMsg = (0, _rendering.RenderDisplayMsg)(description, replaceValue);
    var useLightText = getConfig('collection', 'useLightText');

    /**
     * Class name for the NoResultsView:
     * whether we should apply dark or light theme
     * @type {String}
     */
    var noResultsViewClass = (0, _classnames2.default)({
        'consonant-NoResultsView': true,
        'consonant-NoResultsView--withLightText': useLightText
    });

    return _react2.default.createElement(
        'div',
        {
            'data-testid': 'consonant-NoResultsView',
            className: noResultsViewClass },
        _react2.default.createElement(
            'strong',
            {
                className: 'consonant-NoResultsView-title' },
            title
        ),
        description && _react2.default.createElement(
            'div',
            {
                className: 'consonant-NoResultsView-description' },
            displayMsg
        )
    );
};

View.propTypes = viewType;
View.defaultProps = defaultProps;

exports.default = View;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;
exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;exports.isAsyncMode=function(a){return A(a)||z(a)===l};exports.isConcurrentMode=A;exports.isContextConsumer=function(a){return z(a)===k};exports.isContextProvider=function(a){return z(a)===h};exports.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return z(a)===n};exports.isFragment=function(a){return z(a)===e};exports.isLazy=function(a){return z(a)===t};
exports.isMemo=function(a){return z(a)===r};exports.isPortal=function(a){return z(a)===d};exports.isProfiler=function(a){return z(a)===g};exports.isStrictMode=function(a){return z(a)===f};exports.isSuspense=function(a){return z(a)===p};
exports.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};exports.typeOf=z;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (process.env.NODE_ENV !== "production") {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(20);
var assign = __webpack_require__(42);

var ReactPropTypesSecret = __webpack_require__(16);
var has = __webpack_require__(21);
var checkPropTypes = __webpack_require__(43);

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret = __webpack_require__(16);
  var loggedTypeFailures = {};
  var has = __webpack_require__(21);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(16);

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var pad = __webpack_require__(23);

var env = typeof window === 'object' ? window : self;
var globalCount = Object.keys(env).length;
var mimeTypesLength = navigator.mimeTypes ? navigator.mimeTypes.length : 0;
var clientId = pad((mimeTypesLength +
  navigator.userAgent.length).toString(36) +
  globalCount.toString(36), 4);

module.exports = function fingerprint () {
  return clientId;
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {


var getRandomValue;

var crypto = typeof window !== 'undefined' &&
  (window.crypto || window.msCrypto) ||
  typeof self !== 'undefined' &&
  self.crypto;

if (crypto) {
    var lim = Math.pow(2, 32) - 1;
    getRandomValue = function () {
        return Math.abs(crypto.getRandomValues(new Uint32Array(1))[0] / lim);
    };
} else {
    getRandomValue = Math.random;
}

module.exports = getRandomValue;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigContext = exports.ExpandableContext = exports.noOp = undefined;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A funtion-placeholder, used to handle cleanups
 * Defined explicitly so react doesn't re-create during re-renders
 * @returns {undefined} - returns undefined
 */
var noOp = exports.noOp = function noOp() {};

/**
 * Creates context for expandable components
 * @returns {Object} - ExpandableContext context object
 */
var ExpandableContext = exports.ExpandableContext = _react2.default.createContext({ value: null, setValue: noOp });

/**
 * Creates configuration context
 * @returns {Object} - ConfigContext context object
 */
var ConfigContext = exports.ConfigContext = _react2.default.createContext({});

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable */


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _htmlReactParser = __webpack_require__(49);

var _htmlReactParser2 = _interopRequireDefault(_htmlReactParser);

var _Full = __webpack_require__(64);

var _Full2 = _interopRequireDefault(_Full);

var _card = __webpack_require__(5);

var _general = __webpack_require__(2);

var _hooks = __webpack_require__(4);

var _ThreeFourth = __webpack_require__(65);

var _ThreeFourth2 = _interopRequireDefault(_ThreeFourth);

var _OneHalf = __webpack_require__(66);

var _OneHalf2 = _interopRequireDefault(_OneHalf);

var _HalfHeight = __webpack_require__(83);

var _HalfHeight2 = _interopRequireDefault(_HalfHeight);

var _DoubleWide = __webpack_require__(84);

var _DoubleWide2 = _interopRequireDefault(_DoubleWide);

var _Product = __webpack_require__(85);

var _Product2 = _interopRequireDefault(_Product);

var _Text = __webpack_require__(86);

var _Text2 = _interopRequireDefault(_Text);

var _constants = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cardsGridType = {
    pages: _propTypes.number,
    resultsPerPage: _propTypes.number,
    cards: (0, _propTypes.arrayOf)((0, _propTypes.shape)(_card.cardType)),
    onCardBookmark: _propTypes.func.isRequired,
    containerType: _propTypes.string,
    isAriaLiveActive: _propTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    forwardedRef: _propTypes.object
};

var defaultProps = {
    pages: 1,
    cards: [],
    resultsPerPage: _constants.DEFAULT_SHOW_ITEMS_PER_PAGE,
    containerType: 'default',
    isAriaLiveActive: false,
    forwardedRef: null
};

/**
 * Contains a grid of cards (of different styles)
 *
 * @component
 * @example
 * const props= {
    resultPerPage: Int,
    pages: Int,
    onCardBookmark: Boolean,
    cards: [],
 * }
 * return (
 *   <Grid {...props}/>
 * )
 */
var Grid = function Grid(props) {
    var resultsPerPage = props.resultsPerPage,
        pages = props.pages,
        onCardBookmark = props.onCardBookmark,
        cards = props.cards,
        containerType = props.containerType,
        isAriaLiveActive = props.isAriaLiveActive,
        forwardedRef = props.forwardedRef;

    /**
     **** Authored Configs ****
     */

    var getConfig = (0, _hooks.useConfig)();
    var collectionStyleOverride = getConfig('collection', 'cardStyle');
    var cardsGridLayout = getConfig('collection', 'layout.type');
    var cardsGridGutter = getConfig('collection', 'layout.gutter');
    var renderCardsBorders = getConfig('collection', 'setCardBorders');
    var renderCardsOverlay = getConfig('collection', 'useOverlayLinks');
    var dateFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    var locale = getConfig('language', '');
    var paginationType = getConfig('pagination', 'type');
    var collectionButtonStyle = getConfig('collection', 'collectionButtonStyle');

    var customCard = void 0;
    try {
        /* eslint-disable-next-line no-new-func */
        customCard = new Function('card', getConfig('customCard', '')[1]);
    } catch (e) {
        customCard = function customCard() {};
    }

    /**
     * Class name for the cards grid:
     * whether the grid should show 2, 3, 4 or 5 cards in a row;
     * whether the grid should have a gutter of 8px, 16px, 24px or 32px;
     * @type {String}
     */
    var gridClass = (0, _classnames2.default)({
        'consonant-CardsGrid': true,
        'consonant-CardsGrid--2up': cardsGridLayout === _constants.GRID_TYPE.TWO_UP,
        'consonant-CardsGrid--3up': cardsGridLayout === _constants.GRID_TYPE.THREE_UP,
        'consonant-CardsGrid--4up': cardsGridLayout === _constants.GRID_TYPE.FOUR_UP,
        'consonant-CardsGrid--5up': cardsGridLayout === _constants.GRID_TYPE.FIVE_UP,
        'consonant-CardsGrid--with1xGutter': cardsGridGutter === _constants.GUTTER_SIZE.GUTTER_1_X,
        'consonant-CardsGrid--with2xGutter': cardsGridGutter === _constants.GUTTER_SIZE.GUTTER_2_X,
        'consonant-CardsGrid--with3xGutter': cardsGridGutter === _constants.GUTTER_SIZE.GUTTER_3_X,
        'consonant-CardsGrid--with4xGutter': cardsGridGutter === _constants.GUTTER_SIZE.GUTTER_4_X,
        'consonant-CardsGrid--doubleWideCards': collectionStyleOverride === _constants.CARD_STYLES.DOUBLE_WIDE
    });

    var bannerMap = {
        live: {
            description: getConfig('collection', 'banner.live.description'),
            backgroundColor: '#ffffff',
            fontColor: '#d7373f',
            icon: 'https://www.adobe.com/content/dam/cc/icons/live_banner_icon.svg'
        },
        upcoming: {
            description: getConfig('collection', 'banner.upcoming.description'),
            backgroundColor: '#FC6B35',
            fontColor: '#000000',
            icon: ''
        },
        onDemand: {
            description: getConfig('collection', 'banner.onDemand.description'),
            backgroundColor: '#2D9D78',
            fontColor: '#000000',
            icon: ''
        },
        register: {
            description: getConfig('collection', 'banner.register.description'),
            backgroundColor: '#EBC526',
            fontColor: '#323232',
            icon: ''
        }
    };

    /**
     * Whether the paginator component is being used
     * @type {Boolean}
     */
    var isPaginator = paginationType === 'paginator';
    var isLoadMore = paginationType === 'loadMore' || containerType === 'carousel';

    /**
     * Total pages to show (used if paginator component is set)
     * @type {Number}
     */
    var totalPages = resultsPerPage * pages;

    /**
     * The final cards to show in the collection
     * @type {Array}
     */
    var cardsToshow = new Array(3);

    for (var i = 0; i < 3; i++) {
        cardsToshow[i] = cards[i];
    }

    /**
     * Current page (used if paginator component is authored)
     * @type {Number}
     */
    var currentPage = resultsPerPage * (pages - 1);

    if (isPaginator) {}
    //cardsToshow = cards.slice(currentPage, totalPages);


    /**
     * Current page (used if load more button is authored)
     * @type {Number}
     */
    if (isLoadMore) {
        //cardsToshow = cards.slice(0, resultsPerPage * pages);
    }

    var cleanTitle = function cleanTitle(title) {
        return title.toString().replace(/\|/g, '-');
    };

    /**
     * Scrolls a card into view if any of its children is on focus.
     * @param {string} card - ID of the card to display
     */
    var scrollCardIntoView = function scrollCardIntoView(card) {
        if (!card) return;
        var element = document.getElementById(card);
        element.scrollIntoView({ block: 'nearest' });
    };

    /**
     * Determines whether ctas should be hidden on a given card
     * @param {Object} card - object to get value
     * @param {String} style - the collection button style
     * @returns {bool} - whether a cta should be hidden
     */
    var getHideCta = function getHideCta(card, style) {
        if (card.hideCtaId || style === 'hidden') return true;
        return false;
    };

    return cardsToshow.length > 0 && _react2.default.createElement(
        'div',
        {
            ref: forwardedRef,
            'data-testid': 'consonant-CardsGrid',
            className: gridClass,
            'aria-live': isAriaLiveActive ? 'polite' : 'off' },
        cardsToshow.map(function (card, index) {
            var cardStyleOverride = (0, _general.getByPath)(card, 'styles.typeOverride');
            var cardStyle = collectionStyleOverride || cardStyleOverride;
            var _card$contentArea = card.contentArea;
            _card$contentArea = _card$contentArea === undefined ? {} : _card$contentArea;
            var _card$contentArea$tit = _card$contentArea.title,
                title = _card$contentArea$tit === undefined ? '' : _card$contentArea$tit,
                id = card.id;

            var cardNumber = index + 1;
            var hideCTA = getHideCta(card, collectionButtonStyle);

            switch (cardStyle) {
                default:
                    return _react2.default.createElement(_OneHalf2.default, _extends({
                        lh: 'Card ' + cardNumber + ' | ' + cleanTitle(title) + ' | ' + id,
                        key: card.id
                    }, card, {
                        bannerMap: bannerMap,
                        onClick: onCardBookmark,
                        dateFormat: dateFormat,
                        locale: locale,
                        renderBorder: renderCardsBorders,
                        renderOverlay: renderCardsOverlay,
                        hideCTA: hideCTA,
                        onFocus: function onFocus() {
                            return scrollCardIntoView(card.id);
                        } }));
            }
        })
    );
};

Grid.propTypes = cardsGridType;
Grid.defaultProps = defaultProps;

exports.default = Grid;

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "domToReact", function() { return domToReact; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "htmlToDOM", function() { return htmlToDOM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "attributesToProps", function() { return attributesToProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Element", function() { return Element; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_js__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__index_js__);


var domToReact = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.domToReact;
var htmlToDOM = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.htmlToDOM;
var attributesToProps = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.attributesToProps;
var Element = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.Element;

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__index_js___default.a);


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var domToReact = __webpack_require__(51);
var attributesToProps = __webpack_require__(25);
var htmlToDOM = __webpack_require__(58);

// support backwards compatibility for ES Module
htmlToDOM =
  /* istanbul ignore next */
  typeof htmlToDOM.default === 'function' ? htmlToDOM.default : htmlToDOM;

var domParserOptions = { lowerCaseAttributeNames: false };

/**
 * Converts HTML string to React elements.
 *
 * @param {string} html - HTML string.
 * @param {object} [options] - Parser options.
 * @param {object} [options.htmlparser2] - htmlparser2 options.
 * @param {object} [options.library] - Library for React, Preact, etc.
 * @param {Function} [options.replace] - Replace method.
 * @returns {JSX.Element|JSX.Element[]|string} - React element(s), empty array, or string.
 */
function HTMLReactParser(html, options) {
  if (typeof html !== 'string') {
    throw new TypeError('First argument must be a string');
  }
  if (html === '') {
    return [];
  }
  options = options || {};
  return domToReact(
    htmlToDOM(html, options.htmlparser2 || domParserOptions),
    options
  );
}

HTMLReactParser.domToReact = domToReact;
HTMLReactParser.htmlToDOM = htmlToDOM;
HTMLReactParser.attributesToProps = attributesToProps;
HTMLReactParser.Element = __webpack_require__(63).Element;

// support CommonJS and ES Modules
module.exports = HTMLReactParser;
module.exports.default = HTMLReactParser;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(0);
var attributesToProps = __webpack_require__(25);
var utilities = __webpack_require__(26);

var setStyleProp = utilities.setStyleProp;
var canTextBeChildOfNode = utilities.canTextBeChildOfNode;

/**
 * Converts DOM nodes to JSX element(s).
 *
 * @param {DomElement[]} nodes - DOM nodes.
 * @param {object} [options={}] - Options.
 * @param {Function} [options.replace] - Replacer.
 * @param {object} [options.library] - Library (React, Preact, etc.).
 * @returns - String or JSX element(s).
 */
function domToReact(nodes, options) {
  options = options || {};

  var library = options.library || React;
  var cloneElement = library.cloneElement;
  var createElement = library.createElement;
  var isValidElement = library.isValidElement;

  var result = [];
  var node;
  var isWhitespace;
  var hasReplace = typeof options.replace === 'function';
  var replaceElement;
  var props;
  var children;
  var trim = options.trim;

  for (var i = 0, len = nodes.length; i < len; i++) {
    node = nodes[i];

    // replace with custom React element (if present)
    if (hasReplace) {
      replaceElement = options.replace(node);

      if (isValidElement(replaceElement)) {
        // set "key" prop for sibling elements
        // https://fb.me/react-warning-keys
        if (len > 1) {
          replaceElement = cloneElement(replaceElement, {
            key: replaceElement.key || i
          });
        }
        result.push(replaceElement);
        continue;
      }
    }

    if (node.type === 'text') {
      isWhitespace = !node.data.trim().length;

      if (isWhitespace && node.parent && !canTextBeChildOfNode(node.parent)) {
        // We have a whitespace node that can't be nested in its parent
        // so skip it
        continue;
      }

      if (trim && isWhitespace) {
        // Trim is enabled and we have a whitespace node
        // so skip it
        continue;
      }

      // We have a text node that's not whitespace and it can be nested
      // in its parent so add it to the results
      result.push(node.data);
      continue;
    }

    props = node.attribs;
    if (skipAttributesToProps(node)) {
      setStyleProp(props.style, props);
    } else if (props) {
      props = attributesToProps(props);
    }

    children = null;

    switch (node.type) {
      case 'script':
      case 'style':
        // prevent text in <script> or <style> from being escaped
        // https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
        if (node.children[0]) {
          props.dangerouslySetInnerHTML = {
            __html: node.children[0].data
          };
        }
        break;

      case 'tag':
        // setting textarea value in children is an antipattern in React
        // https://reactjs.org/docs/forms.html#the-textarea-tag
        if (node.name === 'textarea' && node.children[0]) {
          props.defaultValue = node.children[0].data;
        } else if (node.children && node.children.length) {
          // continue recursion of creating React elements (if applicable)
          children = domToReact(node.children, options);
        }
        break;

      // skip all other cases (e.g., comment)
      default:
        continue;
    }

    // set "key" prop for sibling elements
    // https://fb.me/react-warning-keys
    if (len > 1) {
      props.key = i;
    }

    result.push(createElement(node.name, props, children));
  }

  return result.length === 1 ? result[0] : result;
}

/**
 * Determines whether DOM element attributes should be transformed to props.
 * Web Components should not have their attributes transformed except for `style`.
 *
 * @param {DomElement} node
 * @returns - Whether node attributes should be converted to props.
 */
function skipAttributesToProps(node) {
  return (
    utilities.PRESERVE_CUSTOM_ATTRIBUTES &&
    node.type === 'tag' &&
    utilities.isCustomComponent(node.name, node.attribs)
  );
}

module.exports = domToReact;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// A reserved attribute.
// It is handled by React separately and shouldn't be written to the DOM.
var RESERVED = 0; // A simple string attribute.
// Attributes that aren't in the filter are presumed to have this type.

var STRING = 1; // A string attribute that accepts booleans in React. In HTML, these are called
// "enumerated" attributes with "true" and "false" as possible values.
// When true, it should be set to a "true" string.
// When false, it should be set to a "false" string.

var BOOLEANISH_STRING = 2; // A real boolean attribute.
// When true, it should be present (set either to an empty string or its name).
// When false, it should be omitted.

var BOOLEAN = 3; // An attribute that can be used as a flag as well as with a value.
// When true, it should be present (set either to an empty string or its name).
// When false, it should be omitted.
// For any other value, should be present with that value.

var OVERLOADED_BOOLEAN = 4; // An attribute that must be numeric or parse as a numeric.
// When falsy, it should be removed.

var NUMERIC = 5; // An attribute that must be positive numeric or parse as a positive numeric.
// When falsy, it should be removed.

var POSITIVE_NUMERIC = 6;
function getPropertyInfo(name) {
  return properties.hasOwnProperty(name) ? properties[name] : null;
}

function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL, removeEmptyString) {
  this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
  this.attributeName = attributeName;
  this.attributeNamespace = attributeNamespace;
  this.mustUseProperty = mustUseProperty;
  this.propertyName = name;
  this.type = type;
  this.sanitizeURL = sanitizeURL;
  this.removeEmptyString = removeEmptyString;
} // When adding attributes to this list, be sure to also add them to
// the `possibleStandardNames` module to ensure casing and incorrect
// name warnings.


var properties = {}; // These props are reserved by React. They shouldn't be written to the DOM.

var reservedProps = ['children', 'dangerouslySetInnerHTML', // TODO: This prevents the assignment of defaultValue to regular
// elements (not just inputs). Now that ReactDOMInput assigns to the
// defaultValue property -- do we need this?
'defaultValue', 'defaultChecked', 'innerHTML', 'suppressContentEditableWarning', 'suppressHydrationWarning', 'style'];
reservedProps.forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, RESERVED, false, // mustUseProperty
  name, // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // A few React string attributes have a different name.
// This is a mapping from React prop names to the attribute names.

[['acceptCharset', 'accept-charset'], ['className', 'class'], ['htmlFor', 'for'], ['httpEquiv', 'http-equiv']].forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      name = _ref2[0],
      attributeName = _ref2[1];

  properties[name] = new PropertyInfoRecord(name, STRING, false, // mustUseProperty
  attributeName, // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are "enumerated" HTML attributes that accept "true" and "false".
// In React, we let users pass `true` and `false` even though technically
// these aren't boolean attributes (they are coerced to strings).

['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, BOOLEANISH_STRING, false, // mustUseProperty
  name.toLowerCase(), // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are "enumerated" SVG attributes that accept "true" and "false".
// In React, we let users pass `true` and `false` even though technically
// these aren't boolean attributes (they are coerced to strings).
// Since these are SVG attributes, their attribute names are case-sensitive.

['autoReverse', 'externalResourcesRequired', 'focusable', 'preserveAlpha'].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, BOOLEANISH_STRING, false, // mustUseProperty
  name, // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are HTML boolean attributes.

['allowFullScreen', 'async', // Note: there is a special case that prevents it from being written to the DOM
// on the client side because the browsers are inconsistent. Instead we call focus().
'autoFocus', 'autoPlay', 'controls', 'default', 'defer', 'disabled', 'disablePictureInPicture', 'disableRemotePlayback', 'formNoValidate', 'hidden', 'loop', 'noModule', 'noValidate', 'open', 'playsInline', 'readOnly', 'required', 'reversed', 'scoped', 'seamless', // Microdata
'itemScope'].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, BOOLEAN, false, // mustUseProperty
  name.toLowerCase(), // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are the few React props that we set as DOM properties
// rather than attributes. These are all booleans.

['checked', // Note: `option.selected` is not updated if `select.multiple` is
// disabled with `removeAttribute`. We have special logic for handling this.
'multiple', 'muted', 'selected' // NOTE: if you add a camelCased prop to this list,
// you'll need to set attributeName to name.toLowerCase()
// instead in the assignment below.
].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, BOOLEAN, true, // mustUseProperty
  name, // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are HTML attributes that are "overloaded booleans": they behave like
// booleans, but can also accept a string value.

['capture', 'download' // NOTE: if you add a camelCased prop to this list,
// you'll need to set attributeName to name.toLowerCase()
// instead in the assignment below.
].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, OVERLOADED_BOOLEAN, false, // mustUseProperty
  name, // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are HTML attributes that must be positive numbers.

['cols', 'rows', 'size', 'span' // NOTE: if you add a camelCased prop to this list,
// you'll need to set attributeName to name.toLowerCase()
// instead in the assignment below.
].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, POSITIVE_NUMERIC, false, // mustUseProperty
  name, // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These are HTML attributes that must be numbers.

['rowSpan', 'start'].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, NUMERIC, false, // mustUseProperty
  name.toLowerCase(), // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
});
var CAMELIZE = /[\-\:]([a-z])/g;

var capitalize = function capitalize(token) {
  return token[1].toUpperCase();
}; // This is a list of all SVG attributes that need special casing, namespacing,
// or boolean value assignment. Regular attributes that just accept strings
// and have the same names are omitted, just like in the HTML attribute filter.
// Some of these attributes can be hard to find. This list was created by
// scraping the MDN documentation.


['accent-height', 'alignment-baseline', 'arabic-form', 'baseline-shift', 'cap-height', 'clip-path', 'clip-rule', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'dominant-baseline', 'enable-background', 'fill-opacity', 'fill-rule', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'glyph-name', 'glyph-orientation-horizontal', 'glyph-orientation-vertical', 'horiz-adv-x', 'horiz-origin-x', 'image-rendering', 'letter-spacing', 'lighting-color', 'marker-end', 'marker-mid', 'marker-start', 'overline-position', 'overline-thickness', 'paint-order', 'panose-1', 'pointer-events', 'rendering-intent', 'shape-rendering', 'stop-color', 'stop-opacity', 'strikethrough-position', 'strikethrough-thickness', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'text-anchor', 'text-decoration', 'text-rendering', 'underline-position', 'underline-thickness', 'unicode-bidi', 'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging', 'v-ideographic', 'v-mathematical', 'vector-effect', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'word-spacing', 'writing-mode', 'xmlns:xlink', 'x-height' // NOTE: if you add a camelCased prop to this list,
// you'll need to set attributeName to name.toLowerCase()
// instead in the assignment below.
].forEach(function (attributeName) {
  var name = attributeName.replace(CAMELIZE, capitalize);
  properties[name] = new PropertyInfoRecord(name, STRING, false, // mustUseProperty
  attributeName, null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // String SVG attributes with the xlink namespace.

['xlink:actuate', 'xlink:arcrole', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type' // NOTE: if you add a camelCased prop to this list,
// you'll need to set attributeName to name.toLowerCase()
// instead in the assignment below.
].forEach(function (attributeName) {
  var name = attributeName.replace(CAMELIZE, capitalize);
  properties[name] = new PropertyInfoRecord(name, STRING, false, // mustUseProperty
  attributeName, 'http://www.w3.org/1999/xlink', false, // sanitizeURL
  false);
}); // String SVG attributes with the xml namespace.

['xml:base', 'xml:lang', 'xml:space' // NOTE: if you add a camelCased prop to this list,
// you'll need to set attributeName to name.toLowerCase()
// instead in the assignment below.
].forEach(function (attributeName) {
  var name = attributeName.replace(CAMELIZE, capitalize);
  properties[name] = new PropertyInfoRecord(name, STRING, false, // mustUseProperty
  attributeName, 'http://www.w3.org/XML/1998/namespace', false, // sanitizeURL
  false);
}); // These attribute exists both in HTML and SVG.
// The attribute name is case-sensitive in SVG so we can't just use
// the React name like we do for attributes that exist only in HTML.

['tabIndex', 'crossOrigin'].forEach(function (attributeName) {
  properties[attributeName] = new PropertyInfoRecord(attributeName, STRING, false, // mustUseProperty
  attributeName.toLowerCase(), // attributeName
  null, // attributeNamespace
  false, // sanitizeURL
  false);
}); // These attributes accept URLs. These must not allow javascript: URLS.
// These will also need to accept Trusted Types object in the future.

var xlinkHref = 'xlinkHref';
properties[xlinkHref] = new PropertyInfoRecord('xlinkHref', STRING, false, // mustUseProperty
'xlink:href', 'http://www.w3.org/1999/xlink', true, // sanitizeURL
false);
['src', 'href', 'action', 'formAction'].forEach(function (attributeName) {
  properties[attributeName] = new PropertyInfoRecord(attributeName, STRING, false, // mustUseProperty
  attributeName.toLowerCase(), // attributeName
  null, // attributeNamespace
  true, // sanitizeURL
  true);
});

var _require = __webpack_require__(53),
    CAMELCASE = _require.CAMELCASE,
    SAME = _require.SAME,
    possibleStandardNamesOptimized = _require.possibleStandardNames;

var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
/**
 * Checks whether a property name is a custom attribute.
 *
 * @see {@link https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/HTMLDOMPropertyConfig.js#L23-L25}
 *
 * @param {string}
 * @return {boolean}
 */

var isCustomAttribute = RegExp.prototype.test.bind( // eslint-disable-next-line no-misleading-character-class
new RegExp('^(data|aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$'));
var possibleStandardNames = Object.keys(possibleStandardNamesOptimized).reduce(function (accumulator, standardName) {
  var propName = possibleStandardNamesOptimized[standardName];

  if (propName === SAME) {
    accumulator[standardName] = standardName;
  } else if (propName === CAMELCASE) {
    accumulator[standardName.toLowerCase()] = standardName;
  } else {
    accumulator[standardName] = propName;
  }

  return accumulator;
}, {});

exports.BOOLEAN = BOOLEAN;
exports.BOOLEANISH_STRING = BOOLEANISH_STRING;
exports.NUMERIC = NUMERIC;
exports.OVERLOADED_BOOLEAN = OVERLOADED_BOOLEAN;
exports.POSITIVE_NUMERIC = POSITIVE_NUMERIC;
exports.RESERVED = RESERVED;
exports.STRING = STRING;
exports.getPropertyInfo = getPropertyInfo;
exports.isCustomAttribute = isCustomAttribute;
exports.possibleStandardNames = possibleStandardNames;


/***/ }),
/* 53 */
/***/ (function(module, exports) {

// An attribute in which the DOM/SVG standard name is the same as the React prop name (e.g., 'accept').
var SAME = 0;
exports.SAME = SAME;

// An attribute in which the React prop name is the camelcased version of the DOM/SVG standard name (e.g., 'acceptCharset').
var CAMELCASE = 1;
exports.CAMELCASE = CAMELCASE;

exports.possibleStandardNames = {
  accept: 0,
  acceptCharset: 1,
  'accept-charset': 'acceptCharset',
  accessKey: 1,
  action: 0,
  allowFullScreen: 1,
  alt: 0,
  as: 0,
  async: 0,
  autoCapitalize: 1,
  autoComplete: 1,
  autoCorrect: 1,
  autoFocus: 1,
  autoPlay: 1,
  autoSave: 1,
  capture: 0,
  cellPadding: 1,
  cellSpacing: 1,
  challenge: 0,
  charSet: 1,
  checked: 0,
  children: 0,
  cite: 0,
  class: 'className',
  classID: 1,
  className: 1,
  cols: 0,
  colSpan: 1,
  content: 0,
  contentEditable: 1,
  contextMenu: 1,
  controls: 0,
  controlsList: 1,
  coords: 0,
  crossOrigin: 1,
  dangerouslySetInnerHTML: 1,
  data: 0,
  dateTime: 1,
  default: 0,
  defaultChecked: 1,
  defaultValue: 1,
  defer: 0,
  dir: 0,
  disabled: 0,
  disablePictureInPicture: 1,
  disableRemotePlayback: 1,
  download: 0,
  draggable: 0,
  encType: 1,
  enterKeyHint: 1,
  for: 'htmlFor',
  form: 0,
  formMethod: 1,
  formAction: 1,
  formEncType: 1,
  formNoValidate: 1,
  formTarget: 1,
  frameBorder: 1,
  headers: 0,
  height: 0,
  hidden: 0,
  high: 0,
  href: 0,
  hrefLang: 1,
  htmlFor: 1,
  httpEquiv: 1,
  'http-equiv': 'httpEquiv',
  icon: 0,
  id: 0,
  innerHTML: 1,
  inputMode: 1,
  integrity: 0,
  is: 0,
  itemID: 1,
  itemProp: 1,
  itemRef: 1,
  itemScope: 1,
  itemType: 1,
  keyParams: 1,
  keyType: 1,
  kind: 0,
  label: 0,
  lang: 0,
  list: 0,
  loop: 0,
  low: 0,
  manifest: 0,
  marginWidth: 1,
  marginHeight: 1,
  max: 0,
  maxLength: 1,
  media: 0,
  mediaGroup: 1,
  method: 0,
  min: 0,
  minLength: 1,
  multiple: 0,
  muted: 0,
  name: 0,
  noModule: 1,
  nonce: 0,
  noValidate: 1,
  open: 0,
  optimum: 0,
  pattern: 0,
  placeholder: 0,
  playsInline: 1,
  poster: 0,
  preload: 0,
  profile: 0,
  radioGroup: 1,
  readOnly: 1,
  referrerPolicy: 1,
  rel: 0,
  required: 0,
  reversed: 0,
  role: 0,
  rows: 0,
  rowSpan: 1,
  sandbox: 0,
  scope: 0,
  scoped: 0,
  scrolling: 0,
  seamless: 0,
  selected: 0,
  shape: 0,
  size: 0,
  sizes: 0,
  span: 0,
  spellCheck: 1,
  src: 0,
  srcDoc: 1,
  srcLang: 1,
  srcSet: 1,
  start: 0,
  step: 0,
  style: 0,
  summary: 0,
  tabIndex: 1,
  target: 0,
  title: 0,
  type: 0,
  useMap: 1,
  value: 0,
  width: 0,
  wmode: 0,
  wrap: 0,
  about: 0,
  accentHeight: 1,
  'accent-height': 'accentHeight',
  accumulate: 0,
  additive: 0,
  alignmentBaseline: 1,
  'alignment-baseline': 'alignmentBaseline',
  allowReorder: 1,
  alphabetic: 0,
  amplitude: 0,
  arabicForm: 1,
  'arabic-form': 'arabicForm',
  ascent: 0,
  attributeName: 1,
  attributeType: 1,
  autoReverse: 1,
  azimuth: 0,
  baseFrequency: 1,
  baselineShift: 1,
  'baseline-shift': 'baselineShift',
  baseProfile: 1,
  bbox: 0,
  begin: 0,
  bias: 0,
  by: 0,
  calcMode: 1,
  capHeight: 1,
  'cap-height': 'capHeight',
  clip: 0,
  clipPath: 1,
  'clip-path': 'clipPath',
  clipPathUnits: 1,
  clipRule: 1,
  'clip-rule': 'clipRule',
  color: 0,
  colorInterpolation: 1,
  'color-interpolation': 'colorInterpolation',
  colorInterpolationFilters: 1,
  'color-interpolation-filters': 'colorInterpolationFilters',
  colorProfile: 1,
  'color-profile': 'colorProfile',
  colorRendering: 1,
  'color-rendering': 'colorRendering',
  contentScriptType: 1,
  contentStyleType: 1,
  cursor: 0,
  cx: 0,
  cy: 0,
  d: 0,
  datatype: 0,
  decelerate: 0,
  descent: 0,
  diffuseConstant: 1,
  direction: 0,
  display: 0,
  divisor: 0,
  dominantBaseline: 1,
  'dominant-baseline': 'dominantBaseline',
  dur: 0,
  dx: 0,
  dy: 0,
  edgeMode: 1,
  elevation: 0,
  enableBackground: 1,
  'enable-background': 'enableBackground',
  end: 0,
  exponent: 0,
  externalResourcesRequired: 1,
  fill: 0,
  fillOpacity: 1,
  'fill-opacity': 'fillOpacity',
  fillRule: 1,
  'fill-rule': 'fillRule',
  filter: 0,
  filterRes: 1,
  filterUnits: 1,
  floodOpacity: 1,
  'flood-opacity': 'floodOpacity',
  floodColor: 1,
  'flood-color': 'floodColor',
  focusable: 0,
  fontFamily: 1,
  'font-family': 'fontFamily',
  fontSize: 1,
  'font-size': 'fontSize',
  fontSizeAdjust: 1,
  'font-size-adjust': 'fontSizeAdjust',
  fontStretch: 1,
  'font-stretch': 'fontStretch',
  fontStyle: 1,
  'font-style': 'fontStyle',
  fontVariant: 1,
  'font-variant': 'fontVariant',
  fontWeight: 1,
  'font-weight': 'fontWeight',
  format: 0,
  from: 0,
  fx: 0,
  fy: 0,
  g1: 0,
  g2: 0,
  glyphName: 1,
  'glyph-name': 'glyphName',
  glyphOrientationHorizontal: 1,
  'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
  glyphOrientationVertical: 1,
  'glyph-orientation-vertical': 'glyphOrientationVertical',
  glyphRef: 1,
  gradientTransform: 1,
  gradientUnits: 1,
  hanging: 0,
  horizAdvX: 1,
  'horiz-adv-x': 'horizAdvX',
  horizOriginX: 1,
  'horiz-origin-x': 'horizOriginX',
  ideographic: 0,
  imageRendering: 1,
  'image-rendering': 'imageRendering',
  in2: 0,
  in: 0,
  inlist: 0,
  intercept: 0,
  k1: 0,
  k2: 0,
  k3: 0,
  k4: 0,
  k: 0,
  kernelMatrix: 1,
  kernelUnitLength: 1,
  kerning: 0,
  keyPoints: 1,
  keySplines: 1,
  keyTimes: 1,
  lengthAdjust: 1,
  letterSpacing: 1,
  'letter-spacing': 'letterSpacing',
  lightingColor: 1,
  'lighting-color': 'lightingColor',
  limitingConeAngle: 1,
  local: 0,
  markerEnd: 1,
  'marker-end': 'markerEnd',
  markerHeight: 1,
  markerMid: 1,
  'marker-mid': 'markerMid',
  markerStart: 1,
  'marker-start': 'markerStart',
  markerUnits: 1,
  markerWidth: 1,
  mask: 0,
  maskContentUnits: 1,
  maskUnits: 1,
  mathematical: 0,
  mode: 0,
  numOctaves: 1,
  offset: 0,
  opacity: 0,
  operator: 0,
  order: 0,
  orient: 0,
  orientation: 0,
  origin: 0,
  overflow: 0,
  overlinePosition: 1,
  'overline-position': 'overlinePosition',
  overlineThickness: 1,
  'overline-thickness': 'overlineThickness',
  paintOrder: 1,
  'paint-order': 'paintOrder',
  panose1: 0,
  'panose-1': 'panose1',
  pathLength: 1,
  patternContentUnits: 1,
  patternTransform: 1,
  patternUnits: 1,
  pointerEvents: 1,
  'pointer-events': 'pointerEvents',
  points: 0,
  pointsAtX: 1,
  pointsAtY: 1,
  pointsAtZ: 1,
  prefix: 0,
  preserveAlpha: 1,
  preserveAspectRatio: 1,
  primitiveUnits: 1,
  property: 0,
  r: 0,
  radius: 0,
  refX: 1,
  refY: 1,
  renderingIntent: 1,
  'rendering-intent': 'renderingIntent',
  repeatCount: 1,
  repeatDur: 1,
  requiredExtensions: 1,
  requiredFeatures: 1,
  resource: 0,
  restart: 0,
  result: 0,
  results: 0,
  rotate: 0,
  rx: 0,
  ry: 0,
  scale: 0,
  security: 0,
  seed: 0,
  shapeRendering: 1,
  'shape-rendering': 'shapeRendering',
  slope: 0,
  spacing: 0,
  specularConstant: 1,
  specularExponent: 1,
  speed: 0,
  spreadMethod: 1,
  startOffset: 1,
  stdDeviation: 1,
  stemh: 0,
  stemv: 0,
  stitchTiles: 1,
  stopColor: 1,
  'stop-color': 'stopColor',
  stopOpacity: 1,
  'stop-opacity': 'stopOpacity',
  strikethroughPosition: 1,
  'strikethrough-position': 'strikethroughPosition',
  strikethroughThickness: 1,
  'strikethrough-thickness': 'strikethroughThickness',
  string: 0,
  stroke: 0,
  strokeDasharray: 1,
  'stroke-dasharray': 'strokeDasharray',
  strokeDashoffset: 1,
  'stroke-dashoffset': 'strokeDashoffset',
  strokeLinecap: 1,
  'stroke-linecap': 'strokeLinecap',
  strokeLinejoin: 1,
  'stroke-linejoin': 'strokeLinejoin',
  strokeMiterlimit: 1,
  'stroke-miterlimit': 'strokeMiterlimit',
  strokeWidth: 1,
  'stroke-width': 'strokeWidth',
  strokeOpacity: 1,
  'stroke-opacity': 'strokeOpacity',
  suppressContentEditableWarning: 1,
  suppressHydrationWarning: 1,
  surfaceScale: 1,
  systemLanguage: 1,
  tableValues: 1,
  targetX: 1,
  targetY: 1,
  textAnchor: 1,
  'text-anchor': 'textAnchor',
  textDecoration: 1,
  'text-decoration': 'textDecoration',
  textLength: 1,
  textRendering: 1,
  'text-rendering': 'textRendering',
  to: 0,
  transform: 0,
  typeof: 0,
  u1: 0,
  u2: 0,
  underlinePosition: 1,
  'underline-position': 'underlinePosition',
  underlineThickness: 1,
  'underline-thickness': 'underlineThickness',
  unicode: 0,
  unicodeBidi: 1,
  'unicode-bidi': 'unicodeBidi',
  unicodeRange: 1,
  'unicode-range': 'unicodeRange',
  unitsPerEm: 1,
  'units-per-em': 'unitsPerEm',
  unselectable: 0,
  vAlphabetic: 1,
  'v-alphabetic': 'vAlphabetic',
  values: 0,
  vectorEffect: 1,
  'vector-effect': 'vectorEffect',
  version: 0,
  vertAdvY: 1,
  'vert-adv-y': 'vertAdvY',
  vertOriginX: 1,
  'vert-origin-x': 'vertOriginX',
  vertOriginY: 1,
  'vert-origin-y': 'vertOriginY',
  vHanging: 1,
  'v-hanging': 'vHanging',
  vIdeographic: 1,
  'v-ideographic': 'vIdeographic',
  viewBox: 1,
  viewTarget: 1,
  visibility: 0,
  vMathematical: 1,
  'v-mathematical': 'vMathematical',
  vocab: 0,
  widths: 0,
  wordSpacing: 1,
  'word-spacing': 'wordSpacing',
  writingMode: 1,
  'writing-mode': 'writingMode',
  x1: 0,
  x2: 0,
  x: 0,
  xChannelSelector: 1,
  xHeight: 1,
  'x-height': 'xHeight',
  xlinkActuate: 1,
  'xlink:actuate': 'xlinkActuate',
  xlinkArcrole: 1,
  'xlink:arcrole': 'xlinkArcrole',
  xlinkHref: 1,
  'xlink:href': 'xlinkHref',
  xlinkRole: 1,
  'xlink:role': 'xlinkRole',
  xlinkShow: 1,
  'xlink:show': 'xlinkShow',
  xlinkTitle: 1,
  'xlink:title': 'xlinkTitle',
  xlinkType: 1,
  'xlink:type': 'xlinkType',
  xmlBase: 1,
  'xml:base': 'xmlBase',
  xmlLang: 1,
  'xml:lang': 'xmlLang',
  xmlns: 0,
  'xml:space': 'xmlSpace',
  xmlnsXlink: 1,
  'xmlns:xlink': 'xmlnsXlink',
  xmlSpace: 1,
  y1: 0,
  y2: 0,
  y: 0,
  yChannelSelector: 1,
  z: 0,
  zoomAndPan: 1
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var style_to_object_1 = __importDefault(__webpack_require__(55));
var utilities_1 = __webpack_require__(57);
function StyleToJS(style, options) {
    var output = {};
    if (!style || typeof style !== 'string') {
        return output;
    }
    (0, style_to_object_1["default"])(style, function (property, value) {
        if (property && value) {
            output[(0, utilities_1.camelCase)(property, options)] = value;
        }
    });
    return output;
}
exports["default"] = StyleToJS;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var parse = __webpack_require__(56);

/**
 * Parses inline style to object.
 *
 * @example
 * // returns { 'line-height': '42' }
 * StyleToObject('line-height: 42;');
 *
 * @param  {String}      style      - The inline style.
 * @param  {Function}    [iterator] - The iterator function.
 * @return {null|Object}
 */
function StyleToObject(style, iterator) {
  var output = null;
  if (!style || typeof style !== 'string') {
    return output;
  }

  var declaration;
  var declarations = parse(style);
  var hasIterator = typeof iterator === 'function';
  var property;
  var value;

  for (var i = 0, len = declarations.length; i < len; i++) {
    declaration = declarations[i];
    property = declaration.property;
    value = declaration.value;

    if (hasIterator) {
      iterator(property, value, declaration);
    } else if (value) {
      output || (output = {});
      output[property] = value;
    }
  }

  return output;
}

module.exports = StyleToObject;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

var NEWLINE_REGEX = /\n/g;
var WHITESPACE_REGEX = /^\s*/;

// declaration
var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
var COLON_REGEX = /^:\s*/;
var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
var SEMICOLON_REGEX = /^[;\s]*/;

// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
var TRIM_REGEX = /^\s+|\s+$/g;

// strings
var NEWLINE = '\n';
var FORWARD_SLASH = '/';
var ASTERISK = '*';
var EMPTY_STRING = '';

// types
var TYPE_COMMENT = 'comment';
var TYPE_DECLARATION = 'declaration';

/**
 * @param {String} style
 * @param {Object} [options]
 * @return {Object[]}
 * @throws {TypeError}
 * @throws {Error}
 */
module.exports = function(style, options) {
  if (typeof style !== 'string') {
    throw new TypeError('First argument must be a string');
  }

  if (!style) return [];

  options = options || {};

  /**
   * Positional.
   */
  var lineno = 1;
  var column = 1;

  /**
   * Update lineno and column based on `str`.
   *
   * @param {String} str
   */
  function updatePosition(str) {
    var lines = str.match(NEWLINE_REGEX);
    if (lines) lineno += lines.length;
    var i = str.lastIndexOf(NEWLINE);
    column = ~i ? str.length - i : column + str.length;
  }

  /**
   * Mark position and patch `node.position`.
   *
   * @return {Function}
   */
  function position() {
    var start = { line: lineno, column: column };
    return function(node) {
      node.position = new Position(start);
      whitespace();
      return node;
    };
  }

  /**
   * Store position information for a node.
   *
   * @constructor
   * @property {Object} start
   * @property {Object} end
   * @property {undefined|String} source
   */
  function Position(start) {
    this.start = start;
    this.end = { line: lineno, column: column };
    this.source = options.source;
  }

  /**
   * Non-enumerable source string.
   */
  Position.prototype.content = style;

  var errorsList = [];

  /**
   * Error `msg`.
   *
   * @param {String} msg
   * @throws {Error}
   */
  function error(msg) {
    var err = new Error(
      options.source + ':' + lineno + ':' + column + ': ' + msg
    );
    err.reason = msg;
    err.filename = options.source;
    err.line = lineno;
    err.column = column;
    err.source = style;

    if (options.silent) {
      errorsList.push(err);
    } else {
      throw err;
    }
  }

  /**
   * Match `re` and return captures.
   *
   * @param {RegExp} re
   * @return {undefined|Array}
   */
  function match(re) {
    var m = re.exec(style);
    if (!m) return;
    var str = m[0];
    updatePosition(str);
    style = style.slice(str.length);
    return m;
  }

  /**
   * Parse whitespace.
   */
  function whitespace() {
    match(WHITESPACE_REGEX);
  }

  /**
   * Parse comments.
   *
   * @param {Object[]} [rules]
   * @return {Object[]}
   */
  function comments(rules) {
    var c;
    rules = rules || [];
    while ((c = comment())) {
      if (c !== false) {
        rules.push(c);
      }
    }
    return rules;
  }

  /**
   * Parse comment.
   *
   * @return {Object}
   * @throws {Error}
   */
  function comment() {
    var pos = position();
    if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;

    var i = 2;
    while (
      EMPTY_STRING != style.charAt(i) &&
      (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))
    ) {
      ++i;
    }
    i += 2;

    if (EMPTY_STRING === style.charAt(i - 1)) {
      return error('End of comment missing');
    }

    var str = style.slice(2, i - 2);
    column += 2;
    updatePosition(str);
    style = style.slice(i);
    column += 2;

    return pos({
      type: TYPE_COMMENT,
      comment: str
    });
  }

  /**
   * Parse declaration.
   *
   * @return {Object}
   * @throws {Error}
   */
  function declaration() {
    var pos = position();

    // prop
    var prop = match(PROPERTY_REGEX);
    if (!prop) return;
    comment();

    // :
    if (!match(COLON_REGEX)) return error("property missing ':'");

    // val
    var val = match(VALUE_REGEX);

    var ret = pos({
      type: TYPE_DECLARATION,
      property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
      value: val
        ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING))
        : EMPTY_STRING
    });

    // ;
    match(SEMICOLON_REGEX);

    return ret;
  }

  /**
   * Parse declarations.
   *
   * @return {Object[]}
   */
  function declarations() {
    var decls = [];

    comments(decls);

    // declarations
    var decl;
    while ((decl = declaration())) {
      if (decl !== false) {
        decls.push(decl);
        comments(decls);
      }
    }

    return decls;
  }

  whitespace();
  return declarations();
};

/**
 * Trim `str`.
 *
 * @param {String} str
 * @return {String}
 */
function trim(str) {
  return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
}


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.camelCase = void 0;
var CUSTOM_PROPERTY_REGEX = /^--[a-zA-Z0-9-]+$/;
var HYPHEN_REGEX = /-([a-z])/g;
var NO_HYPHEN_REGEX = /^[^-]+$/;
var VENDOR_PREFIX_REGEX = /^-(webkit|moz|ms|o|khtml)-/;
var MS_VENDOR_PREFIX_REGEX = /^-(ms)-/;
var skipCamelCase = function (property) {
    return !property ||
        NO_HYPHEN_REGEX.test(property) ||
        CUSTOM_PROPERTY_REGEX.test(property);
};
var capitalize = function (match, character) {
    return character.toUpperCase();
};
var trimHyphen = function (match, prefix) { return "".concat(prefix, "-"); };
var camelCase = function (property, options) {
    if (options === void 0) { options = {}; }
    if (skipCamelCase(property)) {
        return property;
    }
    property = property.toLowerCase();
    if (options.reactCompat) {
        property = property.replace(MS_VENDOR_PREFIX_REGEX, trimHyphen);
    }
    else {
        property = property.replace(VENDOR_PREFIX_REGEX, trimHyphen);
    }
    return property.replace(HYPHEN_REGEX, capitalize);
};
exports.camelCase = camelCase;


/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_js__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__index_js__);


/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__index_js___default.a);


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var domparser = __webpack_require__(60);
var formatDOM = __webpack_require__(27).formatDOM;

var DIRECTIVE_REGEX = /<(![a-zA-Z\s]+)>/; // e.g., <!doctype html>

/**
 * Parses HTML string to DOM nodes in browser.
 *
 * @param  {string} html  - HTML markup.
 * @return {DomElement[]} - DOM elements.
 */
function HTMLDOMParser(html) {
  if (typeof html !== 'string') {
    throw new TypeError('First argument must be a string');
  }

  if (html === '') {
    return [];
  }

  // match directive
  var match = html.match(DIRECTIVE_REGEX);
  var directive;

  if (match && match[1]) {
    directive = match[1];
  }

  return formatDOM(domparser(html), null, directive);
}

module.exports = HTMLDOMParser;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// constants
var HTML = 'html';
var HEAD = 'head';
var BODY = 'body';
var FIRST_TAG_REGEX = /<([a-zA-Z]+[0-9]?)/; // e.g., <h1>
var HEAD_TAG_REGEX = /<head.*>/i;
var BODY_TAG_REGEX = /<body.*>/i;

// falls back to `parseFromString` if `createHTMLDocument` cannot be used
var parseFromDocument = function () {
  throw new Error(
    'This browser does not support `document.implementation.createHTMLDocument`'
  );
};

var parseFromString = function () {
  throw new Error(
    'This browser does not support `DOMParser.prototype.parseFromString`'
  );
};

/**
 * DOMParser (performance: slow).
 *
 * @see https://developer.mozilla.org/docs/Web/API/DOMParser#Parsing_an_SVG_or_HTML_document
 */
if (typeof window.DOMParser === 'function') {
  var domParser = new window.DOMParser();
  var mimeType = 'text/html';

  /**
   * Creates an HTML document using `DOMParser.parseFromString`.
   *
   * @param  {string} html      - The HTML string.
   * @param  {string} [tagName] - The element to render the HTML (with 'body' as fallback).
   * @return {HTMLDocument}
   */
  parseFromString = function (html, tagName) {
    if (tagName) {
      html = '<' + tagName + '>' + html + '</' + tagName + '>';
    }

    return domParser.parseFromString(html, mimeType);
  };

  parseFromDocument = parseFromString;
}

/**
 * DOMImplementation (performance: fair).
 *
 * @see https://developer.mozilla.org/docs/Web/API/DOMImplementation/createHTMLDocument
 */
if (document.implementation) {
  var isIE = __webpack_require__(27).isIE;

  // title parameter is required in IE
  // https://msdn.microsoft.com/en-us/library/ff975457(v=vs.85).aspx
  var doc = document.implementation.createHTMLDocument(
    isIE() ? 'html-dom-parser' : undefined
  );

  /**
   * Use HTML document created by `document.implementation.createHTMLDocument`.
   *
   * @param  {string} html      - The HTML string.
   * @param  {string} [tagName] - The element to render the HTML (with 'body' as fallback).
   * @return {HTMLDocument}
   */
  parseFromDocument = function (html, tagName) {
    if (tagName) {
      doc.documentElement.getElementsByTagName(tagName)[0].innerHTML = html;
      return doc;
    }

    doc.documentElement.innerHTML = html;
    return doc;
  };
}

/**
 * Template (performance: fast).
 *
 * @see https://developer.mozilla.org/docs/Web/HTML/Element/template
 */
var template = document.createElement('template');
var parseFromTemplate;

if (template.content) {
  /**
   * Uses a template element (content fragment) to parse HTML.
   *
   * @param  {string} html - The HTML string.
   * @return {NodeList}
   */
  parseFromTemplate = function (html) {
    template.innerHTML = html;
    return template.content.childNodes;
  };
}

/**
 * Parses HTML string to DOM nodes.
 *
 * @param  {string}   html - HTML markup.
 * @return {NodeList}
 */
function domparser(html) {
  var firstTagName;
  var match = html.match(FIRST_TAG_REGEX);

  if (match && match[1]) {
    firstTagName = match[1].toLowerCase();
  }

  var doc;
  var element;
  var elements;

  switch (firstTagName) {
    case HTML:
      doc = parseFromString(html);

      // the created document may come with filler head/body elements,
      // so make sure to remove them if they don't actually exist
      if (!HEAD_TAG_REGEX.test(html)) {
        element = doc.getElementsByTagName(HEAD)[0];
        if (element) {
          element.parentNode.removeChild(element);
        }
      }

      if (!BODY_TAG_REGEX.test(html)) {
        element = doc.getElementsByTagName(BODY)[0];
        if (element) {
          element.parentNode.removeChild(element);
        }
      }

      return doc.getElementsByTagName(HTML);

    case HEAD:
    case BODY:
      elements = parseFromDocument(html).getElementsByTagName(firstTagName);

      // if there's a sibling element, then return both elements
      if (BODY_TAG_REGEX.test(html) && HEAD_TAG_REGEX.test(html)) {
        return elements[0].parentNode.childNodes;
      }
      return elements;

    // low-level tag or text
    default:
      if (parseFromTemplate) {
        return parseFromTemplate(html);
      }

      return parseFromDocument(html, BODY).getElementsByTagName(BODY)[0]
        .childNodes;
  }
}

module.exports = domparser;


/***/ }),
/* 61 */
/***/ (function(module, exports) {

/**
 * SVG elements are case-sensitive.
 *
 * @see {@link https://developer.mozilla.org/docs/Web/SVG/Element#SVG_elements_A_to_Z}
 */
var CASE_SENSITIVE_TAG_NAMES = [
  'animateMotion',
  'animateTransform',
  'clipPath',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDropShadow',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussainBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'foreignObject',
  'linearGradient',
  'radialGradient',
  'textPath'
];

module.exports = {
  CASE_SENSITIVE_TAG_NAMES: CASE_SENSITIVE_TAG_NAMES
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneNode = exports.hasChildren = exports.isDocument = exports.isDirective = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = exports.Element = exports.Document = exports.NodeWithChildren = exports.ProcessingInstruction = exports.Comment = exports.Text = exports.DataNode = exports.Node = void 0;
var domelementtype_1 = __webpack_require__(17);
var nodeTypes = new Map([
    [domelementtype_1.ElementType.Tag, 1],
    [domelementtype_1.ElementType.Script, 1],
    [domelementtype_1.ElementType.Style, 1],
    [domelementtype_1.ElementType.Directive, 1],
    [domelementtype_1.ElementType.Text, 3],
    [domelementtype_1.ElementType.CDATA, 4],
    [domelementtype_1.ElementType.Comment, 8],
    [domelementtype_1.ElementType.Root, 9],
]);
/**
 * This object will be used as the prototype for Nodes when creating a
 * DOM-Level-1-compliant structure.
 */
var Node = /** @class */ (function () {
    /**
     *
     * @param type The type of the node.
     */
    function Node(type) {
        this.type = type;
        /** Parent of the node */
        this.parent = null;
        /** Previous sibling */
        this.prev = null;
        /** Next sibling */
        this.next = null;
        /** The start index of the node. Requires `withStartIndices` on the handler to be `true. */
        this.startIndex = null;
        /** The end index of the node. Requires `withEndIndices` on the handler to be `true. */
        this.endIndex = null;
    }
    Object.defineProperty(Node.prototype, "nodeType", {
        // Read-only aliases
        /**
         * [DOM spec](https://dom.spec.whatwg.org/#dom-node-nodetype)-compatible
         * node {@link type}.
         */
        get: function () {
            var _a;
            return (_a = nodeTypes.get(this.type)) !== null && _a !== void 0 ? _a : 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "parentNode", {
        // Read-write aliases for properties
        /**
         * Same as {@link parent}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.parent;
        },
        set: function (parent) {
            this.parent = parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "previousSibling", {
        /**
         * Same as {@link prev}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.prev;
        },
        set: function (prev) {
            this.prev = prev;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "nextSibling", {
        /**
         * Same as {@link next}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.next;
        },
        set: function (next) {
            this.next = next;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Clone this node, and optionally its children.
     *
     * @param recursive Clone child nodes as well.
     * @returns A clone of the node.
     */
    Node.prototype.cloneNode = function (recursive) {
        if (recursive === void 0) { recursive = false; }
        return cloneNode(this, recursive);
    };
    return Node;
}());
exports.Node = Node;
/**
 * A node that contains some data.
 */
var DataNode = /** @class */ (function (_super) {
    __extends(DataNode, _super);
    /**
     * @param type The type of the node
     * @param data The content of the data node
     */
    function DataNode(type, data) {
        var _this = _super.call(this, type) || this;
        _this.data = data;
        return _this;
    }
    Object.defineProperty(DataNode.prototype, "nodeValue", {
        /**
         * Same as {@link data}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.data;
        },
        set: function (data) {
            this.data = data;
        },
        enumerable: false,
        configurable: true
    });
    return DataNode;
}(Node));
exports.DataNode = DataNode;
/**
 * Text within the document.
 */
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(data) {
        return _super.call(this, domelementtype_1.ElementType.Text, data) || this;
    }
    return Text;
}(DataNode));
exports.Text = Text;
/**
 * Comments within the document.
 */
var Comment = /** @class */ (function (_super) {
    __extends(Comment, _super);
    function Comment(data) {
        return _super.call(this, domelementtype_1.ElementType.Comment, data) || this;
    }
    return Comment;
}(DataNode));
exports.Comment = Comment;
/**
 * Processing instructions, including doc types.
 */
var ProcessingInstruction = /** @class */ (function (_super) {
    __extends(ProcessingInstruction, _super);
    function ProcessingInstruction(name, data) {
        var _this = _super.call(this, domelementtype_1.ElementType.Directive, data) || this;
        _this.name = name;
        return _this;
    }
    return ProcessingInstruction;
}(DataNode));
exports.ProcessingInstruction = ProcessingInstruction;
/**
 * A `Node` that can have children.
 */
var NodeWithChildren = /** @class */ (function (_super) {
    __extends(NodeWithChildren, _super);
    /**
     * @param type Type of the node.
     * @param children Children of the node. Only certain node types can have children.
     */
    function NodeWithChildren(type, children) {
        var _this = _super.call(this, type) || this;
        _this.children = children;
        return _this;
    }
    Object.defineProperty(NodeWithChildren.prototype, "firstChild", {
        // Aliases
        /** First child of the node. */
        get: function () {
            var _a;
            return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeWithChildren.prototype, "lastChild", {
        /** Last child of the node. */
        get: function () {
            return this.children.length > 0
                ? this.children[this.children.length - 1]
                : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeWithChildren.prototype, "childNodes", {
        /**
         * Same as {@link children}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.children;
        },
        set: function (children) {
            this.children = children;
        },
        enumerable: false,
        configurable: true
    });
    return NodeWithChildren;
}(Node));
exports.NodeWithChildren = NodeWithChildren;
/**
 * The root node of the document.
 */
var Document = /** @class */ (function (_super) {
    __extends(Document, _super);
    function Document(children) {
        return _super.call(this, domelementtype_1.ElementType.Root, children) || this;
    }
    return Document;
}(NodeWithChildren));
exports.Document = Document;
/**
 * An element within the DOM.
 */
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    /**
     * @param name Name of the tag, eg. `div`, `span`.
     * @param attribs Object mapping attribute names to attribute values.
     * @param children Children of the node.
     */
    function Element(name, attribs, children, type) {
        if (children === void 0) { children = []; }
        if (type === void 0) { type = name === "script"
            ? domelementtype_1.ElementType.Script
            : name === "style"
                ? domelementtype_1.ElementType.Style
                : domelementtype_1.ElementType.Tag; }
        var _this = _super.call(this, type, children) || this;
        _this.name = name;
        _this.attribs = attribs;
        return _this;
    }
    Object.defineProperty(Element.prototype, "tagName", {
        // DOM Level 1 aliases
        /**
         * Same as {@link name}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.name;
        },
        set: function (name) {
            this.name = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "attributes", {
        get: function () {
            var _this = this;
            return Object.keys(this.attribs).map(function (name) {
                var _a, _b;
                return ({
                    name: name,
                    value: _this.attribs[name],
                    namespace: (_a = _this["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
                    prefix: (_b = _this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name],
                });
            });
        },
        enumerable: false,
        configurable: true
    });
    return Element;
}(NodeWithChildren));
exports.Element = Element;
/**
 * @param node Node to check.
 * @returns `true` if the node is a `Element`, `false` otherwise.
 */
function isTag(node) {
    return (0, domelementtype_1.isTag)(node);
}
exports.isTag = isTag;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `CDATA`, `false` otherwise.
 */
function isCDATA(node) {
    return node.type === domelementtype_1.ElementType.CDATA;
}
exports.isCDATA = isCDATA;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Text`, `false` otherwise.
 */
function isText(node) {
    return node.type === domelementtype_1.ElementType.Text;
}
exports.isText = isText;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Comment`, `false` otherwise.
 */
function isComment(node) {
    return node.type === domelementtype_1.ElementType.Comment;
}
exports.isComment = isComment;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */
function isDirective(node) {
    return node.type === domelementtype_1.ElementType.Directive;
}
exports.isDirective = isDirective;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */
function isDocument(node) {
    return node.type === domelementtype_1.ElementType.Root;
}
exports.isDocument = isDocument;
/**
 * @param node Node to check.
 * @returns `true` if the node is a `NodeWithChildren` (has children), `false` otherwise.
 */
function hasChildren(node) {
    return Object.prototype.hasOwnProperty.call(node, "children");
}
exports.hasChildren = hasChildren;
/**
 * Clone a node, and optionally its children.
 *
 * @param recursive Clone child nodes as well.
 * @returns A clone of the node.
 */
function cloneNode(node, recursive) {
    if (recursive === void 0) { recursive = false; }
    var result;
    if (isText(node)) {
        result = new Text(node.data);
    }
    else if (isComment(node)) {
        result = new Comment(node.data);
    }
    else if (isTag(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_1 = new Element(node.name, __assign({}, node.attribs), children);
        children.forEach(function (child) { return (child.parent = clone_1); });
        if (node.namespace != null) {
            clone_1.namespace = node.namespace;
        }
        if (node["x-attribsNamespace"]) {
            clone_1["x-attribsNamespace"] = __assign({}, node["x-attribsNamespace"]);
        }
        if (node["x-attribsPrefix"]) {
            clone_1["x-attribsPrefix"] = __assign({}, node["x-attribsPrefix"]);
        }
        result = clone_1;
    }
    else if (isCDATA(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_2 = new NodeWithChildren(domelementtype_1.ElementType.CDATA, children);
        children.forEach(function (child) { return (child.parent = clone_2); });
        result = clone_2;
    }
    else if (isDocument(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_3 = new Document(children);
        children.forEach(function (child) { return (child.parent = clone_3); });
        if (node["x-mode"]) {
            clone_3["x-mode"] = node["x-mode"];
        }
        result = clone_3;
    }
    else if (isDirective(node)) {
        var instruction = new ProcessingInstruction(node.name, node.data);
        if (node["x-name"] != null) {
            instruction["x-name"] = node["x-name"];
            instruction["x-publicId"] = node["x-publicId"];
            instruction["x-systemId"] = node["x-systemId"];
        }
        result = instruction;
    }
    else {
        throw new Error("Not implemented yet: ".concat(node.type));
    }
    result.startIndex = node.startIndex;
    result.endIndex = node.endIndex;
    if (node.sourceCodeLocation != null) {
        result.sourceCodeLocation = node.sourceCodeLocation;
    }
    return result;
}
exports.cloneNode = cloneNode;
function cloneChildren(childs) {
    var children = childs.map(function (child) { return cloneNode(child, true); });
    for (var i = 1; i < children.length; i++) {
        children[i].prev = children[i - 1];
        children[i - 1].next = children[i];
    }
    return children;
}


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomHandler = void 0;
var domelementtype_1 = __webpack_require__(17);
var node_1 = __webpack_require__(28);
__exportStar(__webpack_require__(28), exports);
var reWhitespace = /\s+/g;
// Default options
var defaultOpts = {
    normalizeWhitespace: false,
    withStartIndices: false,
    withEndIndices: false,
    xmlMode: false,
};
var DomHandler = /** @class */ (function () {
    /**
     * @param callback Called once parsing has completed.
     * @param options Settings for the handler.
     * @param elementCB Callback whenever a tag is closed.
     */
    function DomHandler(callback, options, elementCB) {
        /** The elements of the DOM */
        this.dom = [];
        /** The root element for the DOM */
        this.root = new node_1.Document(this.dom);
        /** Indicated whether parsing has been completed. */
        this.done = false;
        /** Stack of open tags. */
        this.tagStack = [this.root];
        /** A data node that is still being written to. */
        this.lastNode = null;
        /** Reference to the parser instance. Used for location information. */
        this.parser = null;
        // Make it possible to skip arguments, for backwards-compatibility
        if (typeof options === "function") {
            elementCB = options;
            options = defaultOpts;
        }
        if (typeof callback === "object") {
            options = callback;
            callback = undefined;
        }
        this.callback = callback !== null && callback !== void 0 ? callback : null;
        this.options = options !== null && options !== void 0 ? options : defaultOpts;
        this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
    }
    DomHandler.prototype.onparserinit = function (parser) {
        this.parser = parser;
    };
    // Resets the handler back to starting state
    DomHandler.prototype.onreset = function () {
        this.dom = [];
        this.root = new node_1.Document(this.dom);
        this.done = false;
        this.tagStack = [this.root];
        this.lastNode = null;
        this.parser = null;
    };
    // Signals the handler that parsing is done
    DomHandler.prototype.onend = function () {
        if (this.done)
            return;
        this.done = true;
        this.parser = null;
        this.handleCallback(null);
    };
    DomHandler.prototype.onerror = function (error) {
        this.handleCallback(error);
    };
    DomHandler.prototype.onclosetag = function () {
        this.lastNode = null;
        var elem = this.tagStack.pop();
        if (this.options.withEndIndices) {
            elem.endIndex = this.parser.endIndex;
        }
        if (this.elementCB)
            this.elementCB(elem);
    };
    DomHandler.prototype.onopentag = function (name, attribs) {
        var type = this.options.xmlMode ? domelementtype_1.ElementType.Tag : undefined;
        var element = new node_1.Element(name, attribs, undefined, type);
        this.addNode(element);
        this.tagStack.push(element);
    };
    DomHandler.prototype.ontext = function (data) {
        var normalizeWhitespace = this.options.normalizeWhitespace;
        var lastNode = this.lastNode;
        if (lastNode && lastNode.type === domelementtype_1.ElementType.Text) {
            if (normalizeWhitespace) {
                lastNode.data = (lastNode.data + data).replace(reWhitespace, " ");
            }
            else {
                lastNode.data += data;
            }
            if (this.options.withEndIndices) {
                lastNode.endIndex = this.parser.endIndex;
            }
        }
        else {
            if (normalizeWhitespace) {
                data = data.replace(reWhitespace, " ");
            }
            var node = new node_1.Text(data);
            this.addNode(node);
            this.lastNode = node;
        }
    };
    DomHandler.prototype.oncomment = function (data) {
        if (this.lastNode && this.lastNode.type === domelementtype_1.ElementType.Comment) {
            this.lastNode.data += data;
            return;
        }
        var node = new node_1.Comment(data);
        this.addNode(node);
        this.lastNode = node;
    };
    DomHandler.prototype.oncommentend = function () {
        this.lastNode = null;
    };
    DomHandler.prototype.oncdatastart = function () {
        var text = new node_1.Text("");
        var node = new node_1.NodeWithChildren(domelementtype_1.ElementType.CDATA, [text]);
        this.addNode(node);
        text.parent = node;
        this.lastNode = text;
    };
    DomHandler.prototype.oncdataend = function () {
        this.lastNode = null;
    };
    DomHandler.prototype.onprocessinginstruction = function (name, data) {
        var node = new node_1.ProcessingInstruction(name, data);
        this.addNode(node);
    };
    DomHandler.prototype.handleCallback = function (error) {
        if (typeof this.callback === "function") {
            this.callback(error, this.dom);
        }
        else if (error) {
            throw error;
        }
    };
    DomHandler.prototype.addNode = function (node) {
        var parent = this.tagStack[this.tagStack.length - 1];
        var previousSibling = parent.children[parent.children.length - 1];
        if (this.options.withStartIndices) {
            node.startIndex = this.parser.startIndex;
        }
        if (this.options.withEndIndices) {
            node.endIndex = this.parser.endIndex;
        }
        parent.children.push(node);
        if (previousSibling) {
            node.prev = previousSibling;
            previousSibling.next = node;
        }
        node.parent = parent;
        this.lastNode = null;
    };
    return DomHandler;
}());
exports.DomHandler = DomHandler;
exports.default = DomHandler;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _hooks = __webpack_require__(4);

var _general = __webpack_require__(2);

var _card = __webpack_require__(5);

var _LinkBlocker = __webpack_require__(7);

var _LinkBlocker2 = _interopRequireDefault(_LinkBlocker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fullCardType = {
    ctaLink: _propTypes.string,
    id: _propTypes.string.isRequired,
    lh: _propTypes.string,
    styles: (0, _propTypes.shape)(_card.stylesType),
    overlays: (0, _propTypes.shape)(_card.overlaysType),
    contentArea: (0, _propTypes.shape)(_card.contentAreaType),
    renderBorder: _propTypes.bool,
    renderOverlay: _propTypes.bool,
    overlayLink: _propTypes.string,
    startDate: _propTypes.string,
    endDate: _propTypes.string,
    modifiedDate: _propTypes.string,
    bannerMap: (0, _propTypes.shape)(Object).isRequired,
    onFocus: _propTypes.func.isRequired
};

var defaultProps = {
    styles: {},
    lh: '',
    ctaLink: '',
    overlays: {},
    contentArea: {},
    renderBorder: true,
    renderOverlay: false,
    overlayLink: '',
    startDate: '',
    modifiedDate: '',
    endDate: ''
};

/**
 * Full card
 *
 * @component
 * @example
 * const props= {
    id: String,
    ctaLink: String,
    styles: Object,
    contentArea: Object,
    overlays: Object,
    renderBorder: Boolean,
    renderOverlay: Boolean,
    overlayLink: String,
 * }
 * return (
 *   <FullCard {...props}/>
 * )
 */
var FullCard = function FullCard(props) {
    var id = props.id,
        lh = props.lh,
        ctaLink = props.ctaLink,
        _props$styles = props.styles,
        image = _props$styles.backgroundImage,
        altText = _props$styles.backgroundAltText,
        _props$contentArea = props.contentArea,
        title = _props$contentArea.title,
        label = _props$contentArea.detailText,
        _props$overlays = props.overlays,
        _props$overlays$banne = _props$overlays.banner,
        bannerDescription = _props$overlays$banne.description,
        bannerFontColor = _props$overlays$banne.fontColor,
        bannerBackgroundColor = _props$overlays$banne.backgroundColor,
        bannerIcon = _props$overlays$banne.icon,
        videoURL = _props$overlays.videoButton.url,
        _props$overlays$logo = _props$overlays.logo,
        logoSrc = _props$overlays$logo.src,
        logoAlt = _props$overlays$logo.alt,
        logoBg = _props$overlays$logo.backgroundColor,
        logoBorderBg = _props$overlays$logo.borderColor,
        badgeText = _props$overlays.label.description,
        renderBorder = props.renderBorder,
        renderOverlay = props.renderOverlay,
        overlayLink = props.overlayLink,
        startDate = props.startDate,
        endDate = props.endDate,
        modifiedDate = props.modifiedDate,
        bannerMap = props.bannerMap,
        onFocus = props.onFocus;


    var bannerBackgroundColorToUse = bannerBackgroundColor;
    var bannerIconToUse = bannerIcon;
    var bannerFontColorToUse = bannerFontColor;
    var bannerDescriptionToUse = bannerDescription;

    var getConfig = (0, _hooks.useConfig)();

    /**
     **** Authored Configs ****
     */
    var disableBanners = getConfig('collection', 'disableBanners');
    var ctaAction = getConfig('collection', 'ctaAction');
    var additionalParams = getConfig('collection', 'additionalRequestParams');
    var headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel');
    var detailsTextOption = getConfig('collection', 'detailsTextOption');
    var lastModified = getConfig('collection', 'i18n.lastModified');

    /**
     * Detail text
     * @type {String}
     */
    var detailText = label;
    if (modifiedDate && detailsTextOption === 'modifiedDate') {
        var localModifiedDate = new Date(modifiedDate);
        detailText = lastModified.replace('{date}', localModifiedDate.toLocaleDateString());
    }

    /**
     * Class name for the card:
     * whether card border should be rendered or no;
     * @type {String}
     */
    var cardClassName = (0, _classnames2.default)({
        'consonant-Card': true,
        'consonant-FullCard': true,
        'consonant-u-noBorders': !renderBorder
    });

    /**
     * Creates a card image DOM reference
     * @returns {Object} - card image DOM reference
     */
    var imageRef = _react2.default.useRef();

    /**
     * @typedef {Image} LazyLoadedImageState
     * @description — Has image as state after image is lazy loaded
     *
     * @typedef {Function} LazyLoadedImageStateSetter
     * @description - Sets state once image is lazy loaded
     *
     * @type {[Image]} lazyLoadedImage
     */

    var _useLazyLoading = (0, _hooks.useLazyLoading)(imageRef, image),
        _useLazyLoading2 = _slicedToArray(_useLazyLoading, 1),
        lazyLoadedImage = _useLazyLoading2[0];

    if (startDate && endDate) {
        var eventBanner = (0, _general.getEventBanner)(startDate, endDate, bannerMap);
        bannerBackgroundColorToUse = eventBanner.backgroundColor;
        bannerDescriptionToUse = eventBanner.description;
        bannerFontColorToUse = eventBanner.fontColor;
        bannerIconToUse = eventBanner.icon;
    }

    var target = (0, _general.getLinkTarget)(ctaLink, ctaAction);
    var linkBlockerTarget = (0, _general.getLinkTarget)(overlayLink);
    var addParams = new URLSearchParams(additionalParams);
    var cardLink = additionalParams && addParams.keys().next().value ? ctaLink + '?' + addParams.toString() : ctaLink;
    var overlay = additionalParams && addParams.keys().next().value ? overlayLink + '?' + addParams.toString() : overlayLink;

    var ariaText = title;
    var hasBanner = bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse;
    if (hasBanner) {
        ariaText = bannerDescriptionToUse + ' | ' + ariaText;
    }

    var headingAria = videoURL || logoSrc || badgeText || hasBanner && !disableBanners || label ? '' : title;

    return _react2.default.createElement(
        'div',
        {
            className: cardClassName,
            'data-testid': 'consonant-FullCard',
            'daa-lh': lh,
            id: id },
        renderOverlay && _react2.default.createElement(_LinkBlocker2.default, { target: linkBlockerTarget, link: overlay }),
        _react2.default.createElement(
            'div',
            {
                'data-testid': 'consonant-FullCard-img',
                className: 'consonant-FullCard-img',
                ref: imageRef,
                style: { backgroundImage: lazyLoadedImage && 'url("' + lazyLoadedImage + '")' },
                role: altText && 'img',
                'aria-label': altText },
            hasBanner && !disableBanners && _react2.default.createElement(
                'span',
                {
                    'data-testid': 'consonant-FullCard-banner',
                    className: 'consonant-FullCard-banner',
                    style: {
                        backgroundColor: bannerBackgroundColorToUse,
                        color: bannerFontColorToUse
                    } },
                bannerIconToUse && _react2.default.createElement(
                    'div',
                    {
                        className: 'consonant-FullCard-bannerIconWrapper' },
                    _react2.default.createElement('img', {
                        alt: '',
                        loading: 'lazy',
                        'data-testid': 'consonant-Card-bannerImg',
                        src: bannerIconToUse })
                ),
                _react2.default.createElement(
                    'span',
                    null,
                    bannerDescriptionToUse
                )
            ),
            badgeText && _react2.default.createElement(
                'span',
                {
                    className: 'consonant-FullCard-badge' },
                badgeText
            ),
            videoURL && true,
            logoSrc && _react2.default.createElement(
                'div',
                {
                    style: {
                        backgroundColor: logoBg,
                        borderColor: logoBorderBg
                    },
                    className: 'consonant-FullCard-logo' },
                _react2.default.createElement('img', {
                    src: logoSrc,
                    alt: logoAlt,
                    loading: 'lazy',
                    width: '32' })
            )
        ),
        _react2.default.createElement(
            'a',
            {
                href: cardLink,
                target: target,
                'daa-ll': 'Card CTA',
                'aria-label': ariaText,
                rel: 'noopener noreferrer',
                title: '',
                className: 'consonant-FullCard-inner',
                tabIndex: '0',
                onFocus: onFocus },
            detailText && _react2.default.createElement(
                'span',
                {
                    className: 'consonant-FullCard-label' },
                detailText
            ),
            _react2.default.createElement(
                'p',
                {
                    role: 'heading',
                    'aria-label': headingAria,
                    'aria-level': headingLevel,
                    className: 'consonant-FullCard-title' },
                title
            )
        )
    );
};

FullCard.propTypes = fullCardType;
FullCard.defaultProps = defaultProps;

exports.default = FullCard;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint-disable */

//import VideoButton from '../Modal/videoButton';


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _prettyFormat = __webpack_require__(10);

var _prettyFormat2 = _interopRequireDefault(_prettyFormat);

var _hooks = __webpack_require__(4);

var _card = __webpack_require__(5);

var _LinkBlocker = __webpack_require__(7);

var _LinkBlocker2 = _interopRequireDefault(_LinkBlocker);

var _general = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var threeFourthCardType = {
    ctaLink: _propTypes.string,
    id: _propTypes.string.isRequired,
    lh: _propTypes.string,
    styles: (0, _propTypes.shape)(_card.stylesType),
    overlays: (0, _propTypes.shape)(_card.overlaysType),
    contentArea: (0, _propTypes.shape)(_card.contentAreaType),
    renderBorder: _propTypes.bool,
    renderOverlay: _propTypes.bool,
    overlayLink: _propTypes.string,
    startDate: _propTypes.string,
    endDate: _propTypes.string,
    modifiedDate: _propTypes.string,
    bannerMap: (0, _propTypes.shape)(Object).isRequired,
    onFocus: _propTypes.func.isRequired
};

var defaultProps = {
    styles: {},
    ctaLink: '',
    overlays: {},
    contentArea: {},
    lh: '',
    renderBorder: true,
    renderOverlay: false,
    overlayLink: '',
    startDate: '',
    modifiedDate: '',
    endDate: ''
};

/**
 * 3/4 image aspect ratio card
 *
 * @component
 * @example
 * const props= {
    id: String,
    ctaLink: String,
    styles: Object,
    contentArea: Object,
    overlays: Object,
    renderBorder: Boolean,
    renderOverlay: Boolean,
    overlayLink: String,
 * }
 * return (
 *   <ThreeFourthCard {...props}/>
 * )
 */
var ThreeFourthCard = function ThreeFourthCard(props) {
    var id = props.id,
        ctaLink = props.ctaLink,
        lh = props.lh,
        modifiedDate = props.modifiedDate,
        _props$styles = props.styles,
        image = _props$styles.backgroundImage,
        altText = _props$styles.backgroundAltText,
        _props$contentArea = props.contentArea,
        title = _props$contentArea.title,
        description = _props$contentArea.description,
        label = _props$contentArea.detailText,
        _props$contentArea$da = _props$contentArea.dateDetailText,
        startTime = _props$contentArea$da.startTime,
        endTime = _props$contentArea$da.endTime,
        _props$overlays = props.overlays,
        _props$overlays$banne = _props$overlays.banner,
        bannerDescription = _props$overlays$banne.description,
        bannerFontColor = _props$overlays$banne.fontColor,
        bannerBackgroundColor = _props$overlays$banne.backgroundColor,
        bannerIcon = _props$overlays$banne.icon,
        videoURL = _props$overlays.videoButton.url,
        _props$overlays$logo = _props$overlays.logo,
        logoSrc = _props$overlays$logo.src,
        logoAlt = _props$overlays$logo.alt,
        logoBg = _props$overlays$logo.backgroundColor,
        logoBorderBg = _props$overlays$logo.borderColor,
        badgeText = _props$overlays.label.description,
        renderBorder = props.renderBorder,
        renderOverlay = props.renderOverlay,
        overlayLink = props.overlayLink,
        startDate = props.startDate,
        endDate = props.endDate,
        bannerMap = props.bannerMap,
        onFocus = props.onFocus;


    var bannerBackgroundColorToUse = bannerBackgroundColor;
    var bannerIconToUse = bannerIcon;
    var bannerFontColorToUse = bannerFontColor;
    var bannerDescriptionToUse = bannerDescription;

    var getConfig = (0, _hooks.useConfig)();
    /**
     **** Authored Configs ****
     */
    var i18nFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    var locale = getConfig('language', '');
    var disableBanners = getConfig('collection', 'disableBanners');
    var ctaAction = getConfig('collection', 'ctaAction');
    var additionalParams = getConfig('collection', 'additionalRequestParams');
    var headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel');
    var detailsTextOption = getConfig('collection', 'detailsTextOption');
    var lastModified = getConfig('collection', 'i18n.lastModified');

    /**
     * Class name for the card:
     * whether card border should be rendered or no;
     * @type {String}
     */
    var cardClassName = (0, _classnames2.default)({
        'consonant-Card': true,
        'consonant-ThreeFourthCard': true,
        'consonant-u-noBorders': !renderBorder
    });

    /**
     * Creates a card image DOM reference
     * @returns {Object} - card image DOM reference
     */
    var imageRef = _react2.default.useRef();

    /**
     * @typedef {Image} LazyLoadedImageState
     * @description — Has image as state after image is lazy loaded
     *
     * @typedef {Function} LazyLoadedImageStateSetter
     * @description - Sets state once image is lazy loaded
     *
     * @type {[Image]} lazyLoadedImage
     */

    var _useLazyLoading = (0, _hooks.useLazyLoading)(imageRef, image),
        _useLazyLoading2 = _slicedToArray(_useLazyLoading, 1),
        lazyLoadedImage = _useLazyLoading2[0];

    /**
     * Formatted date string
     * @type {String}
     */


    var prettyDate = startTime ? (0, _prettyFormat2.default)(startTime, endTime, locale, i18nFormat) : '';

    /**
     * Detail text
     * @type {String}
     */
    var detailText = prettyDate || label;
    if (modifiedDate && detailsTextOption === 'modifiedDate') {
        var localModifiedDate = new Date(modifiedDate);
        detailText = lastModified.replace('{date}', localModifiedDate.toLocaleDateString());
    }

    if (startDate && endDate) {
        var eventBanner = (0, _general.getEventBanner)(startDate, endDate, bannerMap);
        bannerBackgroundColorToUse = eventBanner.backgroundColor;
        bannerDescriptionToUse = eventBanner.description;
        bannerFontColorToUse = eventBanner.fontColor;
        bannerIconToUse = eventBanner.icon;
    }

    var target = (0, _general.getLinkTarget)(ctaLink, ctaAction);
    var linkBlockerTarget = (0, _general.getLinkTarget)(overlayLink);
    var addParams = new URLSearchParams(additionalParams);
    var cardLink = additionalParams && addParams.keys().next().value ? ctaLink + '?' + addParams.toString() : ctaLink;
    var overlay = additionalParams && addParams.keys().next().value ? overlayLink + '?' + addParams.toString() : overlayLink;
    var hasBanner = bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse;
    var headingAria = videoURL || label || detailText || badgeText || logoSrc || description || hasBanner && !disableBanners ? '' : title;

    var ariaText = title;
    if (hasBanner && !disableBanners) {
        ariaText = bannerDescriptionToUse + ' | ' + ariaText;
    }

    return _react2.default.createElement(
        'div',
        {
            className: cardClassName,
            'daa-lh': lh,
            'data-testid': 'consonant-ThreeFourthCard',
            id: id },
        renderOverlay && _react2.default.createElement(_LinkBlocker2.default, { target: linkBlockerTarget, link: overlay }),
        _react2.default.createElement(
            'div',
            {
                'data-testid': 'consonant-ThreeFourthCard-img',
                className: 'consonant-ThreeFourthCard-img',
                ref: imageRef,
                style: { backgroundImage: lazyLoadedImage && 'url("' + lazyLoadedImage + '")' },
                role: altText && 'img',
                'aria-label': altText },
            hasBanner && !disableBanners && _react2.default.createElement(
                'span',
                {
                    'data-testid': 'consonant-ThreeFourthCard-banner',
                    className: 'consonant-ThreeFourthCard-banner',
                    style: {
                        backgroundColor: bannerBackgroundColorToUse,
                        color: bannerFontColorToUse
                    } },
                bannerIconToUse && _react2.default.createElement(
                    'div',
                    {
                        className: 'consonant-ThreeFourthCard-bannerIconWrapper' },
                    _react2.default.createElement('img', {
                        alt: '',
                        loading: 'lazy',
                        src: bannerIconToUse,
                        'data-testid': 'consonant-Card-bannerImg' })
                ),
                _react2.default.createElement(
                    'span',
                    null,
                    bannerDescriptionToUse
                )
            ),
            badgeText && _react2.default.createElement(
                'span',
                {
                    className: 'consonant-ThreeFourthCard-badge' },
                badgeText
            ),
            logoSrc && _react2.default.createElement(
                'div',
                {
                    style: {
                        backgroundColor: logoBg,
                        borderColor: logoBorderBg
                    },
                    className: 'consonant-ThreeFourthCard-logo' },
                _react2.default.createElement('img', {
                    src: logoSrc,
                    alt: logoAlt,
                    loading: 'lazy',
                    width: '32' })
            )
        ),
        _react2.default.createElement(
            'a',
            {
                href: cardLink,
                target: target,
                'daa-ll': 'Card CTA',
                'aria-label': ariaText,
                rel: 'noopener noreferrer',
                title: 'Click to open in a new tab',
                className: 'consonant-ThreeFourthCard-inner',
                tabIndex: '0',
                onFocus: onFocus },
            detailText && _react2.default.createElement(
                'span',
                {
                    'data-testid': 'consonant-ThreeFourthCard-label',
                    className: 'consonant-ThreeFourthCard-label' },
                detailText
            ),
            title && _react2.default.createElement(
                'p',
                {
                    role: 'heading',
                    'aria-label': headingAria,
                    'aria-level': headingLevel,
                    className: 'consonant-ThreeFourthCard-title' },
                title
            ),
            description && _react2.default.createElement(
                'p',
                {
                    className: 'consonant-ThreeFourthCard-text' },
                description
            )
        )
    );
};

ThreeFourthCard.propTypes = threeFourthCardType;
ThreeFourthCard.defaultProps = defaultProps;

exports.default = ThreeFourthCard;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint-disable */


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _cuid = __webpack_require__(9);

var _cuid2 = _interopRequireDefault(_cuid);

var _propTypes = __webpack_require__(1);

var _CardFooter = __webpack_require__(18);

var _CardFooter2 = _interopRequireDefault(_CardFooter);

var _prettyFormat = __webpack_require__(10);

var _prettyFormat2 = _interopRequireDefault(_prettyFormat);

var _constants = __webpack_require__(6);

var _Helpers = __webpack_require__(11);

var _general = __webpack_require__(2);

var _hooks = __webpack_require__(4);

var _card = __webpack_require__(5);

var _LinkBlocker = __webpack_require__(7);

var _LinkBlocker2 = _interopRequireDefault(_LinkBlocker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oneHalfCardType = {
    isBookmarked: _propTypes.bool,
    dateFormat: _propTypes.string,
    id: _propTypes.string.isRequired,
    lh: _propTypes.string,
    styles: (0, _propTypes.shape)(_card.stylesType),
    disableBookmarkIco: _propTypes.bool,
    onClick: _propTypes.func.isRequired,
    overlays: (0, _propTypes.shape)(_card.overlaysType),
    footer: (0, _propTypes.arrayOf)((0, _propTypes.shape)(_card.footerType)),
    contentArea: (0, _propTypes.shape)(_card.contentAreaType),
    renderBorder: _propTypes.bool,
    renderOverlay: _propTypes.bool,
    overlayLink: _propTypes.string,
    hideCTA: _propTypes.bool,
    startDate: _propTypes.string,
    endDate: _propTypes.string,
    modifiedDate: _propTypes.string,
    bannerMap: (0, _propTypes.shape)(Object).isRequired,
    tags: (0, _propTypes.arrayOf)((0, _propTypes.shape)(_card.tagsType)),
    onFocus: _propTypes.func.isRequired
};

var defaultProps = {
    footer: [],
    styles: {},
    overlays: {},
    dateFormat: '',
    contentArea: {},
    lh: '',
    isBookmarked: false,
    disableBookmarkIco: false,
    renderBorder: true,
    renderOverlay: false,
    overlayLink: '',
    hideCTA: false,
    startDate: '',
    endDate: '',
    modifiedDate: '',
    tags: []
};

/**
 * 1/2 image aspect ratio card
 *
 * @component
 * @example
 * const props= {
    id: String,
    styles: Object,
    contentArea: Object,
    overlays: Object,
    renderBorder: Boolean,
    renderOverlay: Boolean,
    overlayLink: String,
 * }
 * return (
 *   <OneHalfCard {...props}/>
 * )
 */
var OneHalfCard = function OneHalfCard(props) {
    var id = props.id,
        footer = props.footer,
        lh = props.lh,
        tags = props.tags,
        disableBookmarkIco = props.disableBookmarkIco,
        isBookmarked = props.isBookmarked,
        onClick = props.onClick,
        dateFormat = props.dateFormat,
        modifiedDate = props.modifiedDate,
        _props$styles = props.styles,
        image = _props$styles.backgroundImage,
        altText = _props$styles.backgroundAltText,
        _props$contentArea = props.contentArea,
        title = _props$contentArea.title,
        label = _props$contentArea.detailText,
        description = _props$contentArea.description,
        _props$contentArea$da = _props$contentArea.dateDetailText,
        startTime = _props$contentArea$da.startTime,
        endTime = _props$contentArea$da.endTime,
        _props$overlays = props.overlays,
        _props$overlays$banne = _props$overlays.banner,
        bannerDescription = _props$overlays$banne.description,
        bannerFontColor = _props$overlays$banne.fontColor,
        bannerBackgroundColor = _props$overlays$banne.backgroundColor,
        bannerIcon = _props$overlays$banne.icon,
        videoURL = _props$overlays.videoButton.url,
        _props$overlays$logo = _props$overlays.logo,
        logoSrc = _props$overlays$logo.src,
        logoAlt = _props$overlays$logo.alt,
        logoBg = _props$overlays$logo.backgroundColor,
        logoBorderBg = _props$overlays$logo.borderColor,
        badgeText = _props$overlays.label.description,
        renderBorder = props.renderBorder,
        renderOverlay = props.renderOverlay,
        overlayLink = props.overlayLink,
        hideCTA = props.hideCTA,
        startDate = props.startDate,
        endDate = props.endDate,
        bannerMap = props.bannerMap,
        onFocus = props.onFocus;


    var bannerBackgroundColorToUse = bannerBackgroundColor;
    var bannerIconToUse = bannerIcon;
    var bannerFontColorToUse = bannerFontColor;
    var bannerDescriptionToUse = bannerDescription;
    //
    var getConfig = (0, _hooks.useConfig)();
    //
    // /**
    //  **** Authored Configs ****
    //  */
    var i18nFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    var locale = getConfig('language', '');
    var disableBanners = getConfig('collection', 'disableBanners');
    var cardButtonStyle = getConfig('collection', 'button.style');
    var headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel');
    var additionalParams = getConfig('collection', 'additionalRequestParams');
    var detailsTextOption = getConfig('collection', 'detailsTextOption');
    var lastModified = getConfig('collection', 'i18n.lastModified');
    //
    // /**
    //  * Class name for the card:
    //  * whether card border should be rendered or no;
    //  * @type {String}
    //  */
    var cardClassName = (0, _classnames2.default)({
        'consonant-Card': true,
        'consonant-OneHalfCard': true,
        'consonant-u-noBorders': !renderBorder,
        'consonant-hide-cta': hideCTA
    });
    //
    // /**
    //  * Creates a card image DOM reference
    //  * @returns {Object} - card image DOM reference
    //  */
    var imageRef = _react2.default.useRef();

    /**
     * @typedef {Image} LazyLoadedImageState
     * @description — Has image as state after image is lazy loaded
     *
     * @typedef {Function} LazyLoadedImageStateSetter
     * @description - Sets state once image is lazy loaded
     *
     * @type {[Image]} lazyLoadedImage
     */

    var _useLazyLoading = (0, _hooks.useLazyLoading)(imageRef, image),
        _useLazyLoading2 = _slicedToArray(_useLazyLoading, 1),
        lazyLoadedImage = _useLazyLoading2[0];
    //
    // /**
    //  * Formatted date string
    //  * @type {String}
    //  */


    var prettyDate = startTime ? (0, _prettyFormat2.default)(startTime, endTime, locale, i18nFormat) : '';
    //
    // /**
    //  * Detail text
    //  * @type {String}
    //  */
    var detailText = label;
    if (modifiedDate && detailsTextOption === 'modifiedDate') {
        var localModifiedDate = new Date(modifiedDate);
        detailText = lastModified.replace('{date}', localModifiedDate.toLocaleDateString());
    }
    //
    // /**
    //  * isGated
    //  * @type {Boolean}
    //  */
    var isGated = false;
    //
    // /**
    //  * Extends infobits with the configuration data
    //  * @param {Array} data - Array of the infobits
    //  * @return {Array} - Array of the infobits with the configuration data added
    //  */
    function extendFooterData(data) {
        if (!data) return [];

        return data.map(function (infobit) {
            // MWPW-129085: Compiler wrongly compiles this object to private, read-only,
            // Created copy so object instance has public methods and properties.
            var copy = _extends({}, infobit);
            if (copy.type === _constants.INFOBIT_TYPE.BOOKMARK) {
                if (isGated) {
                    copy.type = _constants.INFOBIT_TYPE.GATED;
                }
                return _extends({}, infobit, {
                    cardId: id,
                    disableBookmarkIco: disableBookmarkIco,
                    isBookmarked: isBookmarked,
                    onClick: onClick
                });
            } else if (copy.type === _constants.INFOBIT_TYPE.DATE) {
                return _extends({}, copy, {
                    dateFormat: dateFormat,
                    locale: locale
                });
            } else if (cardButtonStyle === 'link') {
                copy.type = _constants.INFOBIT_TYPE.LINK;
            }
            return _extends({}, copy, {
                isCta: true
            });
        });
    }

    if (startDate && endDate) {
        var eventBanner = (0, _general.getEventBanner)(startDate, endDate, bannerMap);
        bannerBackgroundColorToUse = eventBanner.backgroundColor;
        bannerDescriptionToUse = eventBanner.description;
        bannerFontColorToUse = eventBanner.fontColor;
        bannerIconToUse = eventBanner.icon;
    }
    var hasBanner = bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse;
    var headingAria = '';

    var ariaText = title;
    if (hasBanner && !disableBanners) {
        ariaText = bannerDescriptionToUse + ' | ' + ariaText;
    }

    var linkBlockerTarget = (0, _general.getLinkTarget)(overlayLink);
    var addParams = new URLSearchParams(additionalParams);
    var overlay = additionalParams && addParams.keys().next().value ? overlayLink + '?' + addParams.toString() : overlayLink;

    return _react2.default.createElement(
        'div',
        {
            'daa-lh': 'lh',
            className: "cardClassName",
            'aria-label': 'ariaText',
            'data-testid': 'consonant-OneHalfCard',
            id: id },
        'hello 2',
        _react2.default.createElement(
            'div',
            {
                'data-testid': 'consonant-OneHalfCard-img',
                className: 'consonant-OneHalfCard-img',
                ref: imageRef,
                style: '',
                role: altText && 'img',
                'aria-label': altText },
            badgeText && _react2.default.createElement(
                'span',
                {
                    className: 'consonant-OneHalfCard-badge' },
                badgeText
            ),
            logoSrc && _react2.default.createElement(
                'div',
                {
                    style: {
                        backgroundColor: logoBg,
                        borderColor: logoBorderBg
                    },
                    className: 'consonant-OneHalfCard-logo' },
                _react2.default.createElement('img', {
                    src: logoSrc,
                    alt: logoAlt,
                    loading: 'lazy',
                    width: '32' })
            )
        ),
        _react2.default.createElement(
            'div',
            {
                className: 'consonant-OneHalfCard-inner' },
            detailText && _react2.default.createElement(
                'span',
                {
                    'data-testid': 'consonant-OneHalfCard-label',
                    className: 'consonant-OneHalfCard-label' },
                detailText
            ),
            _react2.default.createElement(
                'p',
                {
                    role: 'heading',
                    'aria-label': headingAria,
                    'aria-level': headingLevel,
                    className: 'consonant-OneHalfCard-title' },
                title
            ),
            description && _react2.default.createElement(
                'p',
                {
                    className: 'consonant-OneHalfCard-text' },
                description
            ),
            !hideCTA && footer.map(function (footerItem) {
                return _react2.default.createElement(_CardFooter2.default, {
                    divider: footerItem.divider,
                    isFluid: footerItem.isFluid,
                    key: (0, _cuid2.default)(),
                    left: extendFooterData(footerItem.left),
                    center: extendFooterData(footerItem.center),
                    right: extendFooterData(footerItem.right),
                    onFocus: onFocus });
            })
        ),
        (renderOverlay || hideCTA) && _react2.default.createElement(_LinkBlocker2.default, { target: linkBlockerTarget, link: overlay })
    );
};

OneHalfCard.propTypes = oneHalfCardType;
OneHalfCard.defaultProps = defaultProps;

exports.default = OneHalfCard;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _cuid = __webpack_require__(9);

var _cuid2 = _interopRequireDefault(_cuid);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _Icon = __webpack_require__(68);

var _Icon2 = _interopRequireDefault(_Icon);

var _Text = __webpack_require__(69);

var _Text2 = _interopRequireDefault(_Text);

var _Price = __webpack_require__(70);

var _Price2 = _interopRequireDefault(_Price);

var _Button = __webpack_require__(71);

var _Button2 = _interopRequireDefault(_Button);

var _Link = __webpack_require__(72);

var _Link2 = _interopRequireDefault(_Link);

var _Rating = __webpack_require__(73);

var _Rating2 = _interopRequireDefault(_Rating);

var _Progress = __webpack_require__(74);

var _Progress2 = _interopRequireDefault(_Progress);

var _IconWithText = __webpack_require__(75);

var _IconWithText2 = _interopRequireDefault(_IconWithText);

var _LinkWithIcon = __webpack_require__(76);

var _LinkWithIcon2 = _interopRequireDefault(_LinkWithIcon);

var _DateInterval = __webpack_require__(77);

var _DateInterval2 = _interopRequireDefault(_DateInterval);

var _Bookmark = __webpack_require__(78);

var _Bookmark2 = _interopRequireDefault(_Bookmark);

var _Gated = __webpack_require__(80);

var _Gated2 = _interopRequireDefault(_Gated);

var _constants = __webpack_require__(6);

var _general = __webpack_require__(2);

var _card = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var groupType = {
    renderList: (0, _propTypes.arrayOf)((0, _propTypes.oneOfType)([(0, _propTypes.shape)(_card.footerLeftType), (0, _propTypes.shape)(_card.footerRightType), (0, _propTypes.shape)(_card.footerCenterType)])),
    onFocus: _propTypes.func
};

var defaultProps = {
    renderList: [],
    onFocus: function onFocus() {}
};

/**
 * Group of Infobits (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    renderList: Array,
 * }
 * return (
 *   <Group {...props}/>
 * )
 */
var Group = function Group(props) {
    var renderList = props.renderList,
        onFocus = props.onFocus;


    return _react2.default.createElement(
        _react.Fragment,
        null,
        renderList.map(function (infobit) {
            switch (infobit.type) {
                case _constants.INFOBIT_TYPE.PRICE:
                    return _react2.default.createElement(_Price2.default, _extends({}, infobit, {
                        key: (0, _cuid2.default)() }));

                case _constants.INFOBIT_TYPE.BUTTON:
                    return _react2.default.createElement(_Button2.default, _extends({}, infobit, {
                        key: (0, _cuid2.default)(),
                        onFocus: onFocus }));

                case _constants.INFOBIT_TYPE.ICON_TEXT:
                    return _react2.default.createElement(_IconWithText2.default, _extends({}, infobit, {
                        key: (0, _cuid2.default)() }));

                case _constants.INFOBIT_TYPE.LINK_ICON:
                    return _react2.default.createElement(_LinkWithIcon2.default, _extends({}, infobit, {
                        key: (0, _cuid2.default)() }));

                case _constants.INFOBIT_TYPE.TEXT:
                    return _react2.default.createElement(_Text2.default, _extends({}, infobit, {
                        key: (0, _cuid2.default)() }));

                case _constants.INFOBIT_TYPE.ICON:
                    return _react2.default.createElement(_Icon2.default, _extends({}, infobit, {
                        key: (0, _cuid2.default)() }));

                case _constants.INFOBIT_TYPE.LINK:
                    return _react2.default.createElement(_Link2.default, _extends({}, infobit, {
                        key: (0, _cuid2.default)() }));

                case _constants.INFOBIT_TYPE.PROGRESS:
                    return _react2.default.createElement(_Progress2.default, _extends({}, infobit, {
                        key: (0, _cuid2.default)() }));

                case _constants.INFOBIT_TYPE.RATING:
                    return _react2.default.createElement(_Rating2.default, {
                        key: (0, _cuid2.default)(),
                        label: infobit.label,
                        totalStars: (0, _general.parseToPrimitive)(infobit.totalStars),
                        starsFilled: (0, _general.parseToPrimitive)(infobit.starsFilled) });

                case _constants.INFOBIT_TYPE.BOOKMARK:
                    return _react2.default.createElement(_Bookmark2.default, _extends({}, infobit, {
                        key: (0, _cuid2.default)() }));

                case _constants.INFOBIT_TYPE.DATE:
                    return _react2.default.createElement(_DateInterval2.default, _extends({}, infobit, {
                        key: (0, _cuid2.default)() }));

                case _constants.INFOBIT_TYPE.GATED:
                    return _react2.default.createElement(_Gated2.default, _extends({}, infobit, {
                        key: (0, _cuid2.default)() }));

                default:
                    return null;
            }
        })
    );
};

Group.propTypes = groupType;
Group.defaultProps = defaultProps;

exports.default = Group;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iconType = {
    alt: _propTypes.string,
    src: _propTypes.string.isRequired
};

var defaultProps = {
    alt: ''
};

/**
 * Icon With Text Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    src: String,
    srcAltText: String,
    text: String,
 * }
 * return (
 *   <IconWithText {...props}/>
 * )
 */
var Icon = function Icon(_ref) {
    var src = _ref.src,
        alt = _ref.alt;
    return _react2.default.createElement('img', {
        className: 'consonant-IconInfobit',
        width: '28',
        src: src,
        alt: alt,
        loading: 'lazy' });
};

Icon.propTypes = iconType;
Icon.defaultProps = defaultProps;

exports.default = Icon;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var textType = {
  text: _propTypes.string.isRequired
};

/**
 * Text infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    text: String,
 * }
 * return (
 *   <Text {...props}/>
 * )
 */
var Text = function Text(_ref) {
  var text = _ref.text;
  return _react2.default.createElement(
    'p',
    { className: 'consonant-TextInfobit' },
    text
  );
};

Text.propTypes = textType;

exports.default = Text;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var priceType = {
    term: _propTypes.string,
    price: _propTypes.string.isRequired
};

var defaultProps = {
    term: ''
};

/**
 * Price Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    price: String,
    term: String,
 * }
 * return (
 *   <Price {...props}/>
 * )
 */
var Price = function Price(_ref) {
    var price = _ref.price,
        term = _ref.term;
    return _react2.default.createElement(
        'span',
        {
            className: 'consonant-PriceInfobit' },
        _react2.default.createElement(
            'strong',
            {
                className: 'consonant-PriceInfobit-price' },
            price
        ),
        _react2.default.createElement(
            'span',
            {
                className: 'consonant-PriceInfobit-term' },
            term
        )
    );
};

Price.propTypes = priceType;
Price.defaultProps = defaultProps;

exports.default = Price;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _hooks = __webpack_require__(4);

var _general = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BUTTON_STYLE = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    CTA: 'call-to-action'
};

var buttonType = {
    text: _propTypes.string,
    href: _propTypes.string,
    style: _propTypes.string,
    iconSrc: _propTypes.string,
    iconAlt: _propTypes.string,
    iconPos: _propTypes.string,
    isCta: _propTypes.bool,
    onFocus: _propTypes.func
};

var defaultProps = {
    href: '',
    text: '',
    iconSrc: '',
    iconAlt: '',
    iconPos: '',
    isCta: false,
    style: BUTTON_STYLE.CTA,
    onFocus: function onFocus() {}
};

/**
 * Button Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    style: String,
    href: String,
    text: String,
 * }
 * return (
 *   <Button {...props}/>
 * )
 */
var Button = function Button(_ref) {
    var style = _ref.style,
        text = _ref.text,
        href = _ref.href,
        iconSrc = _ref.iconSrc,
        iconAlt = _ref.iconAlt,
        iconPos = _ref.iconPos,
        isCta = _ref.isCta,
        onFocus = _ref.onFocus;

    /**
     **** Authored Configs ****
     */
    var getConfig = (0, _hooks.useConfig)();
    var cardButtonStyle = getConfig('collection', 'button.style');
    var additionalParams = getConfig('collection', 'additionalRequestParams');

    var ctaAction = '';

    /**
     * Whether we should render cta button or not
     * cardButtonStyle has higher priority than style
     * @type {Boolean}
     */
    var isCtaButton = style === BUTTON_STYLE.CTA && cardButtonStyle !== BUTTON_STYLE.PRIMARY || cardButtonStyle === BUTTON_STYLE.CTA && style !== BUTTON_STYLE.SECONDARY;

    if (isCta) {
        ctaAction = getConfig('collection', 'ctaAction');
    }

    /**
     * Class name for button:
     * Whether we should render cta button or not
     * @type {String}
     */
    var buttonClass = (0, _classnames2.default)({
        'consonant-BtnInfobit': true,
        'consonant-BtnInfobit--cta': isCtaButton
    });

    /**
     * Class name for button icon:
     * Whether icon should be placed before or after the text
     * @type {String}
     */
    var iconClass = (0, _classnames2.default)({
        'consonant-BtnInfobit-ico': true,
        'consonant-BtnInfobit-ico--last': iconPos.toLowerCase() === 'aftertext'
    });

    var target = (0, _general.getLinkTarget)(href, ctaAction);
    var addParams = new URLSearchParams(additionalParams);
    var buttonLink = additionalParams && addParams.keys().next().value ? href + '?' + addParams.toString() : href;

    return _react2.default.createElement(
        'a',
        {
            className: buttonClass,
            'daa-ll': text,
            'data-testid': 'consonant-BtnInfobit',
            tabIndex: '0',
            rel: 'noopener noreferrer',
            target: target,
            href: buttonLink,
            onFocus: onFocus },
        iconSrc && _react2.default.createElement('img', {
            'data-testid': 'consonant-BtnInfobit-ico',
            src: iconSrc,
            width: '20',
            height: '20',
            className: iconClass,
            alt: iconAlt,
            loading: 'lazy' }),
        _react2.default.createElement(
            'span',
            null,
            text
        )
    );
};

Button.propTypes = buttonType;
Button.defaultProps = defaultProps;

exports.default = Button;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _hooks = __webpack_require__(4);

var _general = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var linkType = {
    linkHint: _propTypes.string,
    href: _propTypes.string.isRequired,
    text: _propTypes.string.isRequired
};

var defaultProps = {
    linkHint: ''
};

/**
 * Link Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    href: String,
    linkHint: String,
    text: String,
 * }
 * return (
 *   <Link {...props}/>
 * )
 */
var Link = function Link(_ref) {
    var href = _ref.href,
        linkHint = _ref.linkHint,
        text = _ref.text;

    /**
     **** Authored Configs ****
     */
    var getConfig = (0, _hooks.useConfig)();
    var ctaAction = getConfig('collection', 'ctaAction');

    var target = (0, _general.getLinkTarget)(href, ctaAction);
    return _react2.default.createElement(
        'a',
        {
            className: 'consonant-LinkInfobit',
            'data-testid': 'consonant-LinkInfobit',
            'daa-ll': text,
            href: href,
            target: target,
            title: linkHint,
            rel: 'noopener noreferrer',
            tabIndex: '0' },
        text
    );
};

Link.propTypes = linkType;
Link.defaultProps = defaultProps;

exports.default = Link;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var maxAllowedStars = 5;
var defaultFilledStars = 0;

var ratingType = {
    label: _propTypes.string,
    totalStars: _propTypes.number,
    starsFilled: _propTypes.number
};

var defaultProps = {
    label: '',
    totalStars: maxAllowedStars,
    starsFilled: defaultFilledStars
};

/**
 * Will calculate the rating (percentage) that is shown
 * @param {Number} id - How many stars should be filled
 * @param {Number} id - Total amount of stars to display
 * @returns {Number} - Rating Percentage
 */
var getRating = function getRating(starsFilled, totalStars) {
    var starsFilledNotValid = starsFilled < 0 || starsFilled > totalStars;
    var totalStarsNotValid = totalStars <= 0 || totalStars > maxAllowedStars;

    if (starsFilledNotValid) {
        /* eslint-disable-next-line no-param-reassign */
        starsFilled = defaultFilledStars;
    }

    if (totalStarsNotValid) {
        /* eslint-disable-next-line no-param-reassign */
        totalStars = Number.MAX_SAFE_INTEGER;
    }

    var scalingFactor = 100;
    var ratingPercentage = starsFilled / totalStars;
    var rating = Math.round(ratingPercentage * scalingFactor);
    return rating;
};

/**
 * Rating Infobit (shown in 3:2 Card Footer)
 *
 * Displays how many stars should be shown for a giving rating
 *
 * @component
 * @example
 * const props= {
    totalStars: Int,
    starsFilled: Int,
    label: String,
 * }
 * return (
 *   <Rating {...props}/>
 * )
 */
var Rating = function Rating(_ref) {
    var label = _ref.label,
        totalStars = _ref.totalStars,
        starsFilled = _ref.starsFilled;

    var className = (0, _classnames2.default)({
        'consonant-RatingInfobit': true,
        'consonant-RatingInfobit--negMargin': !label
    });

    var ratingToDisplay = getRating(starsFilled, totalStars);

    return _react2.default.createElement(
        'div',
        {
            className: className,
            'data-stars': totalStars },
        _react2.default.createElement('span', {
            'data-testid': 'consonant-RatingInfobit-stars',
            className: 'consonant-RatingInfobit-stars',
            'data-rating': ratingToDisplay }),
        label && _react2.default.createElement(
            'span',
            {
                className: 'consonant-RatingInfobit-text' },
            label
        )
    );
};

Rating.propTypes = ratingType;
Rating.defaultProps = defaultProps;

exports.default = Rating;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var progressType = {
    label: _propTypes.string,
    color: _propTypes.string,
    percentage: _propTypes.string,
    completionText: _propTypes.string
};

var defaultProps = {
    label: '',
    percentage: '0',
    color: '#1473E6',
    completionText: ''
};

/**
 * Progress Bar infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    label: String,
    completionText: String,
    percentage: String,
    color: String
 * }
 * return (
 *   <Progress {...props}/>
 * )
 */
var Progress = function Progress(_ref) {
    var label = _ref.label,
        completionText = _ref.completionText,
        percentage = _ref.percentage,
        color = _ref.color;

    var valueStyles = {
        width: 'calc(' + percentage + ' + 2px)',
        backgroundColor: color
    };

    var BASE_10 = 10;
    /**
     * Percentage as int to be used in Aria Label
     *
     * This is different than Percentage prop @type {String} which is diplayed
     * to user
     * @type {Number}
     */
    var percentageInt = parseInt(percentage, BASE_10);

    return _react2.default.createElement(
        'div',
        {
            className: 'consonant-ProgressInfobit' },
        _react2.default.createElement(
            'div',
            {
                className: 'consonant-ProgressInfobit-wrapper' },
            _react2.default.createElement(
                'span',
                {
                    className: 'consonant-ProgressInfobit-text',
                    title: label },
                label
            ),
            _react2.default.createElement(
                'span',
                {
                    className: 'consonant-ProgressInfobit-text consonant-ProgressInfobit-text--italic',
                    title: completionText },
                completionText
            )
        ),
        _react2.default.createElement(
            'div',
            {
                className: 'consonant-ProgressInfobit-el' },
            _react2.default.createElement(
                'span',
                {
                    className: 'consonant-ProgressInfobit-val',
                    style: valueStyles,
                    role: 'progressbar',
                    'aria-valuenow': percentageInt,
                    'aria-valuemin': '0',
                    'aria-valuemax': '100' },
                percentage
            )
        )
    );
};

Progress.propTypes = progressType;
Progress.defaultProps = defaultProps;

exports.default = Progress;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iconWithTextType = {
    src: _propTypes.string,
    srcAltText: _propTypes.string,
    text: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.number])
};

var defaultProps = {
    src: '',
    text: '',
    srcAltText: ''
};

/**
 * Icon With Text Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    src: String,
    srcAltText: String,
    text: String,
 * }
 * return (
 *   <IconWithText {...props}/>
 * )
 */
var IconWithText = function IconWithText(_ref) {
    var src = _ref.src,
        srcAltText = _ref.srcAltText,
        text = _ref.text;
    return _react2.default.createElement(
        'div',
        {
            className: 'consonant-IconWithTextInfobit' },
        src && _react2.default.createElement('img', {
            src: src,
            height: '22',
            alt: srcAltText,
            loading: 'lazy' }),
        _react2.default.createElement(
            'span',
            {
                className: 'consonant-IconWithTextInfobit-text' },
            text
        )
    );
};

IconWithText.propTypes = iconWithTextType;
IconWithText.defaultProps = defaultProps;

exports.default = IconWithText;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var linkWithIconType = {
    src: _propTypes.string,
    href: _propTypes.string,
    text: _propTypes.string,
    linkHint: _propTypes.string,
    srcAltText: _propTypes.string,
    openInNewTab: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.bool])
};

var defaultProps = {
    src: '',
    href: '',
    text: '',
    linkHint: '',
    srcAltText: '',
    openInNewTab: true
};

/**
 * LinkWithIcon Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    href: String,
    openInNewTab: Boolean,
    linkHint: String,
    text: String,
    src: String,
    srcAltText: String,
 * }
 * return (
 *   <LinkWithIcon {...props}/>
 * )
 */
var LinkWithIcon = function LinkWithIcon(_ref) {
    var href = _ref.href,
        openInNewTab = _ref.openInNewTab,
        linkHint = _ref.linkHint,
        text = _ref.text,
        src = _ref.src,
        srcAltText = _ref.srcAltText;
    return _react2.default.createElement(
        'a',
        {
            'daa-ll': text,
            href: href,
            'data-testid': 'consonant-LinkWithIcoInfobit',
            target: openInNewTab ? '_blank' : '_self',
            className: 'consonant-LinkWithIcoInfobit',
            title: linkHint,
            rel: 'noopener noreferrer',
            tabIndex: '0' },
        src && _react2.default.createElement('img', { src: src, alt: srcAltText, loading: 'lazy', height: '18' }),
        _react2.default.createElement(
            'span',
            null,
            text
        )
    );
};

LinkWithIcon.propTypes = linkWithIconType;
LinkWithIcon.defaultProps = defaultProps;

exports.default = LinkWithIcon;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _prettyFormat = __webpack_require__(10);

var _prettyFormat2 = _interopRequireDefault(_prettyFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dateIntervalType = {
    locale: _propTypes.string.isRequired,
    endTime: _propTypes.string.isRequired,
    startTime: _propTypes.string.isRequired,
    dateFormat: _propTypes.string.isRequired
};

/**
 * Date Interval Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    startTime: String,
    endTime: String,
    locale: String,
    dateFormat: String,
 * }
 * return (
 *   <DateInterval {...props}/>
 * )
 */
var DateInterval = function DateInterval(_ref) {
    var startTime = _ref.startTime,
        endTime = _ref.endTime,
        locale = _ref.locale,
        dateFormat = _ref.dateFormat;

    var prettyDateInterval = (0, _prettyFormat2.default)(startTime, endTime, locale, dateFormat);
    return _react2.default.createElement(
        'span',
        {
            title: prettyDateInterval,
            className: 'consonant-DateIntervalInfobit' },
        prettyDateInterval
    );
};

DateInterval.propTypes = dateIntervalType;

exports.default = DateInterval;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _Tooltip = __webpack_require__(79);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _hooks = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bookmarkType = {
    isBookmarked: _propTypes.bool,
    saveCardIcon: _propTypes.string,
    unsaveCardIcon: _propTypes.string,
    onClick: _propTypes.func.isRequired,
    cardId: _propTypes.string.isRequired,
    disableBookmarkIco: _propTypes.bool.isRequired,
    isProductCard: _propTypes.bool
};

var defaultProps = {
    saveCardIcon: '',
    unsaveCardIcon: '',
    isBookmarked: false,
    isProductCard: false
};

/**
 * Bookmark Infobit (shown in 3:2 Card Footer)
 * Used to save/unsave a card to local storage
 *
 * @component
 * @example
 * const props= {
    cardId: String,
    isBookmarked: String,
    saveCardIcon: String,
    unsaveCardIcon: String,
    cardSaveText: String,
    cardUnsaveText: String,
    onClick: Function,
    disableBookmarkIco: Boolean,
 * }
 * return (
 *   <Bookmark {...props}/>
 * )
 */
var Bookmark = function Bookmark(_ref) {
    var cardId = _ref.cardId,
        isBookmarked = _ref.isBookmarked,
        saveCardIcon = _ref.saveCardIcon,
        unsaveCardIcon = _ref.unsaveCardIcon,
        onClick = _ref.onClick,
        disableBookmarkIco = _ref.disableBookmarkIco,
        isProductCard = _ref.isProductCard;

    var getConfig = (0, _hooks.useConfig)();
    var showOnCards = getConfig('bookmarks', 'showOnCards');

    /**
     **** Authored Configs ****
     */
    var saveCardText = getConfig('bookmarks', 'i18n.card.saveText');
    var unsaveCardText = getConfig('bookmarks', 'i18n.card.unsaveText');

    var bookmarkInfobitClass = (0, _classnames2.default)({
        'consonant-BookmarkInfobit': true,
        'is-active': isBookmarked,
        'is-disabled': disableBookmarkIco
    });

    var bookmarkIcon = function bookmarkIcon() {
        var cardIcon = isBookmarked ? saveCardIcon : unsaveCardIcon;
        return _react2.default.createElement('span', {
            'data-testid': 'consonant-BookmarkInfobit-ico',
            className: 'consonant-BookmarkInfobit-ico',
            'daa-ll': 'bookmark',
            style: { backgroundImage: cardIcon ? 'url(' + cardIcon + ')' : '' } });
    };

    var handleClick = function handleClick(clickEvt) {
        clickEvt.stopPropagation();
        onClick(cardId);
    };

    var tooltipText = isBookmarked ? unsaveCardText : saveCardText;

    return !isProductCard && showOnCards && _react2.default.createElement(
        'button',
        {
            'data-testid': 'consonant-BookmarkInfobit',
            'data-tooltip-wrapper': true,
            type: 'button',
            className: bookmarkInfobitClass,
            onClick: handleClick,
            tabIndex: '0' },
        showOnCards && bookmarkIcon(),
        showOnCards && _react2.default.createElement(_Tooltip2.default, {
            'data-testid': 'consonant-Tooltip',
            text: tooltipText })
    );
};

Bookmark.propTypes = bookmarkType;
Bookmark.defaultProps = defaultProps;

exports.default = Bookmark;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tooltipType = { text: _propTypes.string };
var defaultProps = { text: '' };

/**
 * Tooltip (shown in 3:2 Card Footer -- primarily used with bookmark infobit)
 * Used on hover to indicate to users that they do or not do an actino
 *
 * @component
 * @example
 * const props= {
    text: String,
 * }
 * return (
 *   <Tooltip {...props}/>
 * )
 */
var Tooltip = function Tooltip(_ref) {
    var text = _ref.text;
    return _react2.default.createElement(
        'span',
        {
            className: 'consonant-Tooltip' },
        text
    );
};

Tooltip.propTypes = tooltipType;
Tooltip.defaultProps = defaultProps;

exports.default = Tooltip;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gated Icon svg
 */
var Gated = function Gated() {
    return _react2.default.createElement(
        "span",
        { className: "consonant-GatedInfobit" },
        _react2.default.createElement(
            "svg",
            { xmlns: "http://www.w3.org/2000/svg", height: "20", viewBox: "0 0 15 20", width: "15" },
            _react2.default.createElement("path", {
                fill: "#747474",
                d: "M14.38,8.66h-0.62v-2.3c0.06-3.45-2.69-6.3-6.14-6.36c-3.45-0.06-6.3,2.69-6.36,6.14 c0,0.07,0,0.15,0,0.22v2.3H0.63C0.28,8.66,0,8.95,0,9.29c0,0,0,0,0,0v10.07C0,19.71,0.28,20,0.62,20c0,0,0,0,0,0h13.75 c0.35,0,0.63-0.29,0.62-0.63c0,0,0,0,0,0V9.29C15,8.95,14.72,8.66,14.38,8.66C14.38,8.66,14.38,8.66,14.38,8.66z M3.75,6.36 c0-2.07,1.68-3.75,3.75-3.75s3.75,1.68,3.75,3.75v2.3h-7.5V6.36z M8.75,15.09v1.76c0,0.35-0.28,0.63-0.62,0.63c0,0,0,0,0,0H6.88 c-0.35,0-0.63-0.29-0.62-0.63c0,0,0,0,0,0v-1.76c-0.58-0.53-0.78-1.36-0.5-2.09c0.36-0.97,1.43-1.46,2.4-1.1 c0.51,0.19,0.91,0.59,1.1,1.1C9.53,13.73,9.33,14.56,8.75,15.09z" })
        )
    );
};

exports.default = Gated;

/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Immer", function() { return on; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyPatches", function() { return vn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "castDraft", function() { return K; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "castImmutable", function() { return $; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDraft", function() { return pn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "current", function() { return D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enableAllPlugins", function() { return J; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enableES5", function() { return T; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enableMapSet", function() { return C; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enablePatches", function() { return F; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "finishDraft", function() { return ln; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "immerable", function() { return L; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDraft", function() { return t; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDraftable", function() { return r; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nothing", function() { return H; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "original", function() { return e; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "produce", function() { return an; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "produceWithPatches", function() { return fn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setAutoFreeze", function() { return cn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setUseProxies", function() { return sn; });
function n(n){for(var t=arguments.length,r=Array(t>1?t-1:0),e=1;e<t;e++)r[e-1]=arguments[e];if("production"!==process.env.NODE_ENV){var i=Y[n],o=i?"function"==typeof i?i.apply(null,r):i:"unknown error nr: "+n;throw Error("[Immer] "+o)}throw Error("[Immer] minified error nr: "+n+(r.length?" "+r.map((function(n){return"'"+n+"'"})).join(","):"")+". Find the full error at: https://bit.ly/3cXEKWf")}function t(n){return!!n&&!!n[Q]}function r(n){return!!n&&(function(n){if(!n||"object"!=typeof n)return!1;var t=Object.getPrototypeOf(n);return!t||t===Object.prototype}(n)||Array.isArray(n)||!!n[L]||!!n.constructor[L]||s(n)||v(n))}function e(r){return t(r)||n(23,r),r[Q].t}function i(n,t,r){void 0===r&&(r=!1),0===o(n)?(r?Object.keys:Z)(n).forEach((function(e){r&&"symbol"==typeof e||t(e,n[e],n)})):n.forEach((function(r,e){return t(e,r,n)}))}function o(n){var t=n[Q];return t?t.i>3?t.i-4:t.i:Array.isArray(n)?1:s(n)?2:v(n)?3:0}function u(n,t){return 2===o(n)?n.has(t):Object.prototype.hasOwnProperty.call(n,t)}function a(n,t){return 2===o(n)?n.get(t):n[t]}function f(n,t,r){var e=o(n);2===e?n.set(t,r):3===e?(n.delete(t),n.add(r)):n[t]=r}function c(n,t){return n===t?0!==n||1/n==1/t:n!=n&&t!=t}function s(n){return X&&n instanceof Map}function v(n){return q&&n instanceof Set}function p(n){return n.o||n.t}function l(n){if(Array.isArray(n))return Array.prototype.slice.call(n);var t=nn(n);delete t[Q];for(var r=Z(t),e=0;e<r.length;e++){var i=r[e],o=t[i];!1===o.writable&&(o.writable=!0,o.configurable=!0),(o.get||o.set)&&(t[i]={configurable:!0,writable:!0,enumerable:o.enumerable,value:n[i]})}return Object.create(Object.getPrototypeOf(n),t)}function d(n,e){y(n)||t(n)||!r(n)||(o(n)>1&&(n.set=n.add=n.clear=n.delete=h),Object.freeze(n),e&&i(n,(function(n,t){return d(t,!0)}),!0))}function h(){n(2)}function y(n){return null==n||"object"!=typeof n||Object.isFrozen(n)}function b(t){var r=tn[t];return r||n(18,t),r}function m(n,t){tn[n]||(tn[n]=t)}function _(){return"production"===process.env.NODE_ENV||U||n(0),U}function j(n,t){t&&(b("Patches"),n.u=[],n.s=[],n.v=t)}function g(n){O(n),n.p.forEach(S),n.p=null}function O(n){n===U&&(U=n.l)}function w(n){return U={p:[],l:U,h:n,m:!0,_:0}}function S(n){var t=n[Q];0===t.i||1===t.i?t.j():t.g=!0}function P(t,e){e._=e.p.length;var i=e.p[0],o=void 0!==t&&t!==i;return e.h.O||b("ES5").S(e,t,o),o?(i[Q].P&&(g(e),n(4)),r(t)&&(t=M(e,t),e.l||x(e,t)),e.u&&b("Patches").M(i[Q],t,e.u,e.s)):t=M(e,i,[]),g(e),e.u&&e.v(e.u,e.s),t!==H?t:void 0}function M(n,t,r){if(y(t))return t;var e=t[Q];if(!e)return i(t,(function(i,o){return A(n,e,t,i,o,r)}),!0),t;if(e.A!==n)return t;if(!e.P)return x(n,e.t,!0),e.t;if(!e.I){e.I=!0,e.A._--;var o=4===e.i||5===e.i?e.o=l(e.k):e.o;i(3===e.i?new Set(o):o,(function(t,i){return A(n,e,o,t,i,r)})),x(n,o,!1),r&&n.u&&b("Patches").R(e,r,n.u,n.s)}return e.o}function A(e,i,o,a,c,s){if("production"!==process.env.NODE_ENV&&c===o&&n(5),t(c)){var v=M(e,c,s&&i&&3!==i.i&&!u(i.D,a)?s.concat(a):void 0);if(f(o,a,v),!t(v))return;e.m=!1}if(r(c)&&!y(c)){if(!e.h.N&&e._<1)return;M(e,c),i&&i.A.l||x(e,c)}}function x(n,t,r){void 0===r&&(r=!1),n.h.N&&n.m&&d(t,r)}function z(n,t){var r=n[Q];return(r?p(r):n)[t]}function I(n,t){if(t in n)for(var r=Object.getPrototypeOf(n);r;){var e=Object.getOwnPropertyDescriptor(r,t);if(e)return e;r=Object.getPrototypeOf(r)}}function E(n){n.P||(n.P=!0,n.l&&E(n.l))}function k(n){n.o||(n.o=l(n.t))}function R(n,t,r){var e=s(t)?b("MapSet").T(t,r):v(t)?b("MapSet").F(t,r):n.O?function(n,t){var r=Array.isArray(n),e={i:r?1:0,A:t?t.A:_(),P:!1,I:!1,D:{},l:t,t:n,k:null,o:null,j:null,C:!1},i=e,o=rn;r&&(i=[e],o=en);var u=Proxy.revocable(i,o),a=u.revoke,f=u.proxy;return e.k=f,e.j=a,f}(t,r):b("ES5").J(t,r);return(r?r.A:_()).p.push(e),e}function D(e){return t(e)||n(22,e),function n(t){if(!r(t))return t;var e,u=t[Q],c=o(t);if(u){if(!u.P&&(u.i<4||!b("ES5").K(u)))return u.t;u.I=!0,e=N(t,c),u.I=!1}else e=N(t,c);return i(e,(function(t,r){u&&a(u.t,t)===r||f(e,t,n(r))})),3===c?new Set(e):e}(e)}function N(n,t){switch(t){case 2:return new Map(n);case 3:return Array.from(n)}return l(n)}function T(){function r(n,t){var r=s[n];return r?r.enumerable=t:s[n]=r={configurable:!0,enumerable:t,get:function(){var t=this[Q];return"production"!==process.env.NODE_ENV&&f(t),rn.get(t,n)},set:function(t){var r=this[Q];"production"!==process.env.NODE_ENV&&f(r),rn.set(r,n,t)}},r}function e(n){for(var t=n.length-1;t>=0;t--){var r=n[t][Q];if(!r.P)switch(r.i){case 5:a(r)&&E(r);break;case 4:o(r)&&E(r)}}}function o(n){for(var t=n.t,r=n.k,e=Z(r),i=e.length-1;i>=0;i--){var o=e[i];if(o!==Q){var a=t[o];if(void 0===a&&!u(t,o))return!0;var f=r[o],s=f&&f[Q];if(s?s.t!==a:!c(f,a))return!0}}var v=!!t[Q];return e.length!==Z(t).length+(v?0:1)}function a(n){var t=n.k;if(t.length!==n.t.length)return!0;var r=Object.getOwnPropertyDescriptor(t,t.length-1);return!(!r||r.get)}function f(t){t.g&&n(3,JSON.stringify(p(t)))}var s={};m("ES5",{J:function(n,t){var e=Array.isArray(n),i=function(n,t){if(n){for(var e=Array(t.length),i=0;i<t.length;i++)Object.defineProperty(e,""+i,r(i,!0));return e}var o=nn(t);delete o[Q];for(var u=Z(o),a=0;a<u.length;a++){var f=u[a];o[f]=r(f,n||!!o[f].enumerable)}return Object.create(Object.getPrototypeOf(t),o)}(e,n),o={i:e?5:4,A:t?t.A:_(),P:!1,I:!1,D:{},l:t,t:n,k:i,o:null,g:!1,C:!1};return Object.defineProperty(i,Q,{value:o,writable:!0}),i},S:function(n,r,o){o?t(r)&&r[Q].A===n&&e(n.p):(n.u&&function n(t){if(t&&"object"==typeof t){var r=t[Q];if(r){var e=r.t,o=r.k,f=r.D,c=r.i;if(4===c)i(o,(function(t){t!==Q&&(void 0!==e[t]||u(e,t)?f[t]||n(o[t]):(f[t]=!0,E(r)))})),i(e,(function(n){void 0!==o[n]||u(o,n)||(f[n]=!1,E(r))}));else if(5===c){if(a(r)&&(E(r),f.length=!0),o.length<e.length)for(var s=o.length;s<e.length;s++)f[s]=!1;else for(var v=e.length;v<o.length;v++)f[v]=!0;for(var p=Math.min(o.length,e.length),l=0;l<p;l++)void 0===f[l]&&n(o[l])}}}}(n.p[0]),e(n.p))},K:function(n){return 4===n.i?o(n):a(n)}})}function F(){function e(n){if(!r(n))return n;if(Array.isArray(n))return n.map(e);if(s(n))return new Map(Array.from(n.entries()).map((function(n){return[n[0],e(n[1])]})));if(v(n))return new Set(Array.from(n).map(e));var t=Object.create(Object.getPrototypeOf(n));for(var i in n)t[i]=e(n[i]);return t}function f(n){return t(n)?e(n):n}var c="add";m("Patches",{$:function(t,r){return r.forEach((function(r){for(var i=r.path,u=r.op,f=t,s=0;s<i.length-1;s++)"object"!=typeof(f=a(f,i[s]))&&n(15,i.join("/"));var v=o(f),p=e(r.value),l=i[i.length-1];switch(u){case"replace":switch(v){case 2:return f.set(l,p);case 3:n(16);default:return f[l]=p}case c:switch(v){case 1:return f.splice(l,0,p);case 2:return f.set(l,p);case 3:return f.add(p);default:return f[l]=p}case"remove":switch(v){case 1:return f.splice(l,1);case 2:return f.delete(l);case 3:return f.delete(r.value);default:return delete f[l]}default:n(17,u)}})),t},R:function(n,t,r,e){switch(n.i){case 0:case 4:case 2:return function(n,t,r,e){var o=n.t,s=n.o;i(n.D,(function(n,i){var v=a(o,n),p=a(s,n),l=i?u(o,n)?"replace":c:"remove";if(v!==p||"replace"!==l){var d=t.concat(n);r.push("remove"===l?{op:l,path:d}:{op:l,path:d,value:p}),e.push(l===c?{op:"remove",path:d}:"remove"===l?{op:c,path:d,value:f(v)}:{op:"replace",path:d,value:f(v)})}}))}(n,t,r,e);case 5:case 1:return function(n,t,r,e){var i=n.t,o=n.D,u=n.o;if(u.length<i.length){var a=[u,i];i=a[0],u=a[1];var s=[e,r];r=s[0],e=s[1]}for(var v=0;v<i.length;v++)if(o[v]&&u[v]!==i[v]){var p=t.concat([v]);r.push({op:"replace",path:p,value:f(u[v])}),e.push({op:"replace",path:p,value:f(i[v])})}for(var l=i.length;l<u.length;l++){var d=t.concat([l]);r.push({op:c,path:d,value:f(u[l])})}i.length<u.length&&e.push({op:"replace",path:t.concat(["length"]),value:i.length})}(n,t,r,e);case 3:return function(n,t,r,e){var i=n.t,o=n.o,u=0;i.forEach((function(n){if(!o.has(n)){var i=t.concat([u]);r.push({op:"remove",path:i,value:n}),e.unshift({op:c,path:i,value:n})}u++})),u=0,o.forEach((function(n){if(!i.has(n)){var o=t.concat([u]);r.push({op:c,path:o,value:n}),e.unshift({op:"remove",path:o,value:n})}u++}))}(n,t,r,e)}},M:function(n,t,r,e){r.push({op:"replace",path:[],value:t}),e.push({op:"replace",path:[],value:n.t})}})}function C(){function t(n,t){function r(){this.constructor=n}a(n,t),n.prototype=(r.prototype=t.prototype,new r)}function e(n){n.o||(n.D=new Map,n.o=new Map(n.t))}function o(n){n.o||(n.o=new Set,n.t.forEach((function(t){if(r(t)){var e=R(n.A.h,t,n);n.p.set(t,e),n.o.add(e)}else n.o.add(t)})))}function u(t){t.g&&n(3,JSON.stringify(p(t)))}var a=function(n,t){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var r in t)t.hasOwnProperty(r)&&(n[r]=t[r])})(n,t)},f=function(){function n(n,t){return this[Q]={i:2,l:t,A:t?t.A:_(),P:!1,I:!1,o:void 0,D:void 0,t:n,k:this,C:!1,g:!1},this}t(n,Map);var o=n.prototype;return Object.defineProperty(o,"size",{get:function(){return p(this[Q]).size}}),o.has=function(n){return p(this[Q]).has(n)},o.set=function(n,t){var r=this[Q];return u(r),p(r).has(n)&&p(r).get(n)===t||(e(r),E(r),r.D.set(n,!0),r.o.set(n,t),r.D.set(n,!0)),this},o.delete=function(n){if(!this.has(n))return!1;var t=this[Q];return u(t),e(t),E(t),t.D.set(n,!1),t.o.delete(n),!0},o.clear=function(){var n=this[Q];u(n),p(n).size&&(e(n),E(n),n.D=new Map,i(n.t,(function(t){n.D.set(t,!1)})),n.o.clear())},o.forEach=function(n,t){var r=this;p(this[Q]).forEach((function(e,i){n.call(t,r.get(i),i,r)}))},o.get=function(n){var t=this[Q];u(t);var i=p(t).get(n);if(t.I||!r(i))return i;if(i!==t.t.get(n))return i;var o=R(t.A.h,i,t);return e(t),t.o.set(n,o),o},o.keys=function(){return p(this[Q]).keys()},o.values=function(){var n,t=this,r=this.keys();return(n={})[V]=function(){return t.values()},n.next=function(){var n=r.next();return n.done?n:{done:!1,value:t.get(n.value)}},n},o.entries=function(){var n,t=this,r=this.keys();return(n={})[V]=function(){return t.entries()},n.next=function(){var n=r.next();if(n.done)return n;var e=t.get(n.value);return{done:!1,value:[n.value,e]}},n},o[V]=function(){return this.entries()},n}(),c=function(){function n(n,t){return this[Q]={i:3,l:t,A:t?t.A:_(),P:!1,I:!1,o:void 0,t:n,k:this,p:new Map,g:!1,C:!1},this}t(n,Set);var r=n.prototype;return Object.defineProperty(r,"size",{get:function(){return p(this[Q]).size}}),r.has=function(n){var t=this[Q];return u(t),t.o?!!t.o.has(n)||!(!t.p.has(n)||!t.o.has(t.p.get(n))):t.t.has(n)},r.add=function(n){var t=this[Q];return u(t),this.has(n)||(o(t),E(t),t.o.add(n)),this},r.delete=function(n){if(!this.has(n))return!1;var t=this[Q];return u(t),o(t),E(t),t.o.delete(n)||!!t.p.has(n)&&t.o.delete(t.p.get(n))},r.clear=function(){var n=this[Q];u(n),p(n).size&&(o(n),E(n),n.o.clear())},r.values=function(){var n=this[Q];return u(n),o(n),n.o.values()},r.entries=function(){var n=this[Q];return u(n),o(n),n.o.entries()},r.keys=function(){return this.values()},r[V]=function(){return this.values()},r.forEach=function(n,t){for(var r=this.values(),e=r.next();!e.done;)n.call(t,e.value,e.value,this),e=r.next()},n}();m("MapSet",{T:function(n,t){return new f(n,t)},F:function(n,t){return new c(n,t)}})}function J(){T(),C(),F()}function K(n){return n}function $(n){return n}var G,U,W="undefined"!=typeof Symbol&&"symbol"==typeof Symbol("x"),X="undefined"!=typeof Map,q="undefined"!=typeof Set,B="undefined"!=typeof Proxy&&void 0!==Proxy.revocable&&"undefined"!=typeof Reflect,H=W?Symbol.for("immer-nothing"):((G={})["immer-nothing"]=!0,G),L=W?Symbol.for("immer-draftable"):"__$immer_draftable",Q=W?Symbol.for("immer-state"):"__$immer_state",V="undefined"!=typeof Symbol&&Symbol.iterator||"@@iterator",Y={0:"Illegal state",1:"Immer drafts cannot have computed properties",2:"This object has been frozen and should not be mutated",3:function(n){return"Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+n},4:"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",5:"Immer forbids circular references",6:"The first or second argument to `produce` must be a function",7:"The third argument to `produce` must be a function or undefined",8:"First argument to `createDraft` must be a plain object, an array, or an immerable object",9:"First argument to `finishDraft` must be a draft returned by `createDraft`",10:"The given draft is already finalized",11:"Object.defineProperty() cannot be used on an Immer draft",12:"Object.setPrototypeOf() cannot be used on an Immer draft",13:"Immer only supports deleting array indices",14:"Immer only supports setting array indices and the 'length' property",15:function(n){return"Cannot apply patch, path doesn't resolve: "+n},16:'Sets cannot have "replace" patches.',17:function(n){return"Unsupported patch operation: "+n},18:function(n){return"The plugin for '"+n+"' has not been loaded into Immer. To enable the plugin, import and call `enable"+n+"()` when initializing your application."},20:"Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available",21:function(n){return"produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '"+n+"'"},22:function(n){return"'current' expects a draft, got: "+n},23:function(n){return"'original' expects a draft, got: "+n}},Z="undefined"!=typeof Reflect&&Reflect.ownKeys?Reflect.ownKeys:void 0!==Object.getOwnPropertySymbols?function(n){return Object.getOwnPropertyNames(n).concat(Object.getOwnPropertySymbols(n))}:Object.getOwnPropertyNames,nn=Object.getOwnPropertyDescriptors||function(n){var t={};return Z(n).forEach((function(r){t[r]=Object.getOwnPropertyDescriptor(n,r)})),t},tn={},rn={get:function(n,t){if(t===Q)return n;var e=p(n);if(!u(e,t))return function(n,t,r){var e,i=I(t,r);return i?"value"in i?i.value:null===(e=i.get)||void 0===e?void 0:e.call(n.k):void 0}(n,e,t);var i=e[t];return n.I||!r(i)?i:i===z(n.t,t)?(k(n),n.o[t]=R(n.A.h,i,n)):i},has:function(n,t){return t in p(n)},ownKeys:function(n){return Reflect.ownKeys(p(n))},set:function(n,t,r){var e=I(p(n),t);if(null==e?void 0:e.set)return e.set.call(n.k,r),!0;if(!n.P){var i=z(p(n),t),o=null==i?void 0:i[Q];if(o&&o.t===r)return n.o[t]=r,n.D[t]=!1,!0;if(c(r,i)&&(void 0!==r||u(n.t,t)))return!0;k(n),E(n)}return n.o[t]=r,n.D[t]=!0,!0},deleteProperty:function(n,t){return void 0!==z(n.t,t)||t in n.t?(n.D[t]=!1,k(n),E(n)):delete n.D[t],n.o&&delete n.o[t],!0},getOwnPropertyDescriptor:function(n,t){var r=p(n),e=Reflect.getOwnPropertyDescriptor(r,t);return e?{writable:!0,configurable:1!==n.i||"length"!==t,enumerable:e.enumerable,value:r[t]}:e},defineProperty:function(){n(11)},getPrototypeOf:function(n){return Object.getPrototypeOf(n.t)},setPrototypeOf:function(){n(12)}},en={};i(rn,(function(n,t){en[n]=function(){return arguments[0]=arguments[0][0],t.apply(this,arguments)}})),en.deleteProperty=function(t,r){return"production"!==process.env.NODE_ENV&&isNaN(parseInt(r))&&n(13),rn.deleteProperty.call(this,t[0],r)},en.set=function(t,r,e){return"production"!==process.env.NODE_ENV&&"length"!==r&&isNaN(parseInt(r))&&n(14),rn.set.call(this,t[0],r,e,t[0])};var on=function(){function e(n){this.O=B,this.N="production"!==process.env.NODE_ENV,"boolean"==typeof(null==n?void 0:n.useProxies)&&this.setUseProxies(n.useProxies),"boolean"==typeof(null==n?void 0:n.autoFreeze)&&this.setAutoFreeze(n.autoFreeze),this.produce=this.produce.bind(this),this.produceWithPatches=this.produceWithPatches.bind(this)}var i=e.prototype;return i.produce=function(t,e,i){if("function"==typeof t&&"function"!=typeof e){var o=e;e=t;var u=this;return function(n){var t=this;void 0===n&&(n=o);for(var r=arguments.length,i=Array(r>1?r-1:0),a=1;a<r;a++)i[a-1]=arguments[a];return u.produce(n,(function(n){var r;return(r=e).call.apply(r,[t,n].concat(i))}))}}var a;if("function"!=typeof e&&n(6),void 0!==i&&"function"!=typeof i&&n(7),r(t)){var f=w(this),c=R(this,t,void 0),s=!0;try{a=e(c),s=!1}finally{s?g(f):O(f)}return"undefined"!=typeof Promise&&a instanceof Promise?a.then((function(n){return j(f,i),P(n,f)}),(function(n){throw g(f),n})):(j(f,i),P(a,f))}if(!t||"object"!=typeof t){if((a=e(t))===H)return;return void 0===a&&(a=t),this.N&&d(a,!0),a}n(21,t)},i.produceWithPatches=function(n,t){var r,e,i=this;return"function"==typeof n?function(t){for(var r=arguments.length,e=Array(r>1?r-1:0),o=1;o<r;o++)e[o-1]=arguments[o];return i.produceWithPatches(t,(function(t){return n.apply(void 0,[t].concat(e))}))}:[this.produce(n,t,(function(n,t){r=n,e=t})),r,e]},i.createDraft=function(e){r(e)||n(8),t(e)&&(e=D(e));var i=w(this),o=R(this,e,void 0);return o[Q].C=!0,O(i),o},i.finishDraft=function(t,r){var e=t&&t[Q];"production"!==process.env.NODE_ENV&&(e&&e.C||n(9),e.I&&n(10));var i=e.A;return j(i,r),P(void 0,i)},i.setAutoFreeze=function(n){this.N=n},i.setUseProxies=function(t){t&&!B&&n(20),this.O=t},i.applyPatches=function(n,r){var e;for(e=r.length-1;e>=0;e--){var i=r[e];if(0===i.path.length&&"replace"===i.op){n=i.value;break}}var o=b("Patches").$;return t(n)?o(n,r):this.produce(n,(function(n){return o(n,r.slice(e+1))}))},e}(),un=new on,an=un.produce,fn=un.produceWithPatches.bind(un),cn=un.setAutoFreeze.bind(un),sn=un.setUseProxies.bind(un),vn=un.applyPatches.bind(un),pn=un.createDraft.bind(un),ln=un.finishDraft.bind(un);/* harmony default export */ __webpack_exports__["default"] = (an);
//# sourceMappingURL=immer.esm.js.map

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(8)))

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defineIsUpcoming = exports.defineIsOnDemandScheduled = exports.defineIsOnDemand = exports.defineIsLiveExpired = exports.convertDateStrToMs = exports.eventTiming = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Helpers = __webpack_require__(11);

var _general = __webpack_require__(2);

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
var convertDateStrToMs = function convertDateStrToMs() {
    var dateStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

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
var timeOverride = function timeOverride() {
    var _window = window,
        _window$location = _window.location;
    _window$location = _window$location === undefined ? {} : _window$location;
    var _window$location$sear = _window$location.search,
        search = _window$location$sear === undefined ? '' : _window$location$sear;

    var _qs$parse = _general.qs.parse(search),
        _qs$parse$servertime = _qs$parse.servertime,
        servertime = _qs$parse$servertime === undefined ? '' : _qs$parse$servertime;

    return servertime ? parseInt(servertime, 10) : undefined;
};
/**
 * @func updateTimeOverride
 * @desc SIDE EFFECT: If timeOverride is used this increments it for next pass
 *
 * @effect overrides URL "timeOverride" param with incremented time
 */
/* eslint-disable no-unused-vars */
var updateTimeOverride = function updateTimeOverride(base, increment) {
    var _window2 = window,
        _window2$location = _window2.location;
    _window2$location = _window2$location === undefined ? {} : _window2$location;
    var _window2$location$ori = _window2$location.origin,
        origin = _window2$location$ori === undefined ? '' : _window2$location$ori,
        _window2$location$pat = _window2$location.pathname,
        pathname = _window2$location$pat === undefined ? '' : _window2$location$pat;

    var currentSearchParams = new URL(window.location).searchParams;

    currentSearchParams.delete('servertime');

    var editedSearch = currentSearchParams.toString();
    var basePath = '' + origin + pathname;
    var newSeverTime = '' + _general.qs.stringify({ servertime: base + increment });
    var newSearch = '' + editedSearch + (editedSearch && '&') + newSeverTime;
    var urlString = basePath + '?' + newSearch;

    window.history.replaceState(null, '', urlString);
};
// Definitions
/* eslint-disable no-useless-escape */
var liveExpiredRegEx = /[a-zA-Z0-9-]+:[a-zA-Z0-9-\/]+live-expired/;
var isOnDemandScheduledRegEx = /[a-zA-Z0-9-]+:[a-zA-Z0-9-\/]+on-demand-scheduled/;
/* eslint-enable no-useless-escape */
/**
 * @func defineIsLiveExpired
 * @desc Specific "Session (Card)" has "live expired" tag
 *
 * @param {Array} tags current session tags to seach for "live expired" tag
 * @returns {Boolean} isLiveExpired
 */
var defineIsLiveExpired = function defineIsLiveExpired(tags) {
    return (0, _Helpers.hasTag)(liveExpiredRegEx, tags);
};
/**
 * @func defineIsOnDemand
 * @desc Current Time is Greater than EndTime
 *
 * @param {Number} currentTime representation of current time in MS
 * @param {Number} endTime representation of session EndTime in MS
 * @returns {Boolean} isOnDemand
 */
var defineIsOnDemand = function defineIsOnDemand(currentTime, endTimeMls) {
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
var defineIsOnDemandScheduled = function defineIsOnDemandScheduled(tags) {
    return (0, _Helpers.hasTag)(isOnDemandScheduledRegEx, tags);
};
/**
 * @func defineIsUpcoming
 * @desc Current Time is Less than startTime
 *
 * @param {Number} currentTime representation of current time in MS
 * @param {Number} startTime representation of session StartTime in MS
 * @returns {Boolean} isOnDemand
 */
var defineIsUpcoming = function defineIsUpcoming(currentTime, startTimeMls) {
    if (startTimeMls) {
        return startTimeMls >= currentTime;
    }

    return false;
};

var differential = 0;
function incrementDifferential() {
    differential += 1000;
}
setInterval(incrementDifferential, 1000);

/**
 * @func eventTiming
 * @desc First Sorts sessions by startDate, and then partitions them by category
 *
 * @param {Array} sessions sessions to be sorted
 * @returns {Object} nextTransitionMs, value for setTimeout.
 * visibleSessions, sorted cards/sessions to be rendered.
 */
function eventTiming() {
    var sessions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var eventFilter = arguments[1];

    if (!sessions.length) return [];

    var overrideTime = timeOverride();

    var nextTransitionMs = void 0;

    function setNextTransitionMs(compareTime, curMs) {
        if (compareTime < curMs) return nextTransitionMs;
        // Therefore current time should be less than transTimeMs
        var countDownMs = compareTime - curMs;
        /* if the countdown > 1 day (86400000ms) do not set a timer
         * The max number of MS a timer can have is 2147483647ms
         * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
         */
        if (countDownMs > 86400000) return nextTransitionMs;

        return !nextTransitionMs && countDownMs > 0 || countDownMs < nextTransitionMs ? countDownMs : nextTransitionMs;
    }
    /*
        If msAsNumber from urlState.servertime use this value, otherwise epoch
        from Date.now(). This is mainly an override for QA purposes.
    */
    var curMs = overrideTime + differential || Date.now();
    // Stack per category
    var live = [];
    var notTimed = [];
    var onDemand = [];
    var upComing = [];
    /*
        The data has no default order, therefore have to sort according to
        session data before partitioning by category
    */
    sessions.sort(function () {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            aStart = _ref.startDate;

        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            bStart = _ref2.startDate;

        // "a" is what sort uses for the first item
        // converting the value to MS, therefore aMs
        var aMs = convertDateStrToMs(aStart);
        // "b" is what sort uses for the second item
        // converting the value to MS, therefore aMs
        var bMs = convertDateStrToMs(bStart);

        if (aMs === 0) return 1;

        if (bMs === 0) return -1;

        if (aMs < bMs) return -1;

        if (aMs > bMs) return 1;

        return 0;
    }).forEach(function () {
        var session = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var endDate = session.endDate,
            startDate = session.startDate,
            _session$tags = session.tags,
            tags = _session$tags === undefined ? [] : _session$tags;
        // Session Times in milliseconds

        var endMs = convertDateStrToMs(endDate);
        var startMs = convertDateStrToMs(startDate);
        // Timed categories
        var isTimed = !!(endMs && startMs);
        var isUpComing = isTimed ? defineIsUpcoming(curMs, startMs) : false;
        var isOnDemand = isTimed && !isUpComing ? defineIsOnDemand(curMs, endMs) : false;
        var isLive = !!(isTimed && !isUpComing && !isOnDemand && startMs);
        // Tagged Exceptions
        var isOnDemandScheduled = defineIsOnDemandScheduled(tags);
        var isLiveExpired = defineIsLiveExpired(tags);

        // Cards with no Date information, pushed to back of stack
        if (!isTimed) {
            notTimed.push(session);
        }

        // Upcoming and not tagged with On Demand Scheduled tag
        if (isUpComing && isTimed && !isOnDemandScheduled) {
            var upComingTransition = setNextTransitionMs(startMs, curMs);

            upComing.push(session);
            // GET Upcoming Badge here
            nextTransitionMs = upComingTransition && upComingTransition > 0 ? upComingTransition : nextTransitionMs;
        }
        // On demand and not tagged with Live Expired tag
        if (isOnDemand && isTimed && !isLiveExpired) {
            // Get OnDemand Badge here
            onDemand.push(session);
        }
        // Currently Live
        if (isLive && isTimed) {
            var liveTransition = setNextTransitionMs(startMs, curMs);

            live.push(session);
            // GET Live Badge here
            nextTransitionMs = liveTransition && liveTransition > 0 ? liveTransition : nextTransitionMs;
        }

        if (isUpComing && isOnDemandScheduled && isTimed) {
            var odTransition = setNextTransitionMs(startMs, curMs);

            nextTransitionMs = odTransition && odTransition > 0 ? odTransition : nextTransitionMs;
        }
    });
    // If no transitions are needed zero out transition time
    if (!live.length && !upComing.length || !nextTransitionMs) {
        nextTransitionMs = 0;
    }

    if (overrideTime && nextTransitionMs) {
        // TO BE REFACTORED AFTER MAX -- commented out for now:
        // This line of code causes the following bugs:
        // 1. It always updates the query param (time) to be ahead of what should be shown
        // 2. It triggers additional time transitions on  load more clicks, pagination, etc.
        // updateTimeOverride(curMs, nextTransitionMs);
    }

    var cards = [].concat(live, upComing, onDemand, notTimed);
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
    return _extends({}, nextTransitionMs && { nextTransitionMs: nextTransitionMs }, {
        visibleSessions: cards
    });
}

exports.eventTiming = eventTiming;
exports.convertDateStrToMs = convertDateStrToMs;
exports.defineIsLiveExpired = defineIsLiveExpired;
exports.defineIsOnDemand = defineIsOnDemand;
exports.defineIsOnDemandScheduled = defineIsOnDemandScheduled;
exports.defineIsUpcoming = defineIsUpcoming;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint-disable */


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _hooks = __webpack_require__(4);

var _Helpers = __webpack_require__(11);

var _general = __webpack_require__(2);

var _card = __webpack_require__(5);

var _LinkBlocker = __webpack_require__(7);

var _LinkBlocker2 = _interopRequireDefault(_LinkBlocker);

var _prettyFormat = __webpack_require__(10);

var _prettyFormat2 = _interopRequireDefault(_prettyFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var halfHeightCardType = {
    ctaLink: _propTypes.string,
    id: _propTypes.string.isRequired,
    lh: _propTypes.string,
    styles: (0, _propTypes.shape)(_card.stylesType),
    overlays: (0, _propTypes.shape)(_card.overlaysType),
    contentArea: (0, _propTypes.shape)(_card.contentAreaType),
    renderBorder: _propTypes.bool,
    renderOverlay: _propTypes.bool,
    overlayLink: _propTypes.string,
    startDate: _propTypes.string,
    endDate: _propTypes.string,
    modifiedDate: _propTypes.string,
    bannerMap: (0, _propTypes.shape)(Object).isRequired,
    tags: (0, _propTypes.arrayOf)((0, _propTypes.shape)(_card.tagsType)),
    onFocus: _propTypes.func.isRequired
};

var defaultProps = {
    styles: {},
    lh: '',
    ctaLink: '',
    overlays: {},
    contentArea: {},
    renderBorder: true,
    renderOverlay: false,
    overlayLink: '',
    startDate: '',
    endDate: '',
    modifiedDate: '',
    tags: []
};

/**
 * Half height card
 *
 * @component
 * @example
 * const props= {
    id: String,
    ctaLink: String,
    styles: Object,
    contentArea: Object,
    overlays: Object,
    renderBorder: Boolean,
    renderOverlay: Boolean,
    overlayLink: String,
 * }
 * return (
 *   <HalfHeightCard {...props}/>
 * )
 */
var HalfHeightCard = function HalfHeightCard(props) {
    var id = props.id,
        lh = props.lh,
        ctaLink = props.ctaLink,
        _props$styles = props.styles,
        image = _props$styles.backgroundImage,
        altText = _props$styles.backgroundAltText,
        tags = props.tags,
        _props$contentArea = props.contentArea,
        title = _props$contentArea.title,
        label = _props$contentArea.detailText,
        _props$overlays = props.overlays,
        _props$overlays$banne = _props$overlays.banner,
        bannerDescription = _props$overlays$banne.description,
        bannerFontColor = _props$overlays$banne.fontColor,
        bannerBackgroundColor = _props$overlays$banne.backgroundColor,
        bannerIcon = _props$overlays$banne.icon,
        videoURL = _props$overlays.videoButton.url,
        renderBorder = props.renderBorder,
        renderOverlay = props.renderOverlay,
        overlayLink = props.overlayLink,
        startDate = props.startDate,
        endDate = props.endDate,
        modifiedDate = props.modifiedDate,
        bannerMap = props.bannerMap,
        onFocus = props.onFocus;


    var bannerBackgroundColorToUse = bannerBackgroundColor;
    var bannerIconToUse = bannerIcon;
    var bannerFontColorToUse = bannerFontColor;
    var bannerDescriptionToUse = bannerDescription;
    var videoURLToUse = videoURL;
    var gateVideo = false;
    var labelToUse = label;

    var getConfig = (0, _hooks.useConfig)();

    /**
     **** Authored Configs ****
     */
    var registrationUrl = getConfig('collection', 'banner.register.url');
    var i18nFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    var locale = getConfig('language', '');
    var disableBanners = getConfig('collection', 'disableBanners');
    var ctaAction = getConfig('collection', 'ctaAction');
    var additionalParams = getConfig('collection', 'additionalRequestParams');
    var headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel');
    var detailsTextOption = getConfig('collection', 'detailsTextOption');
    var lastModified = getConfig('collection', 'i18n.lastModified');

    /**
     * Detail text
     * @type {String}
     */
    if (modifiedDate && detailsTextOption === 'modifiedDate') {
        var localModifiedDate = new Date(modifiedDate);
        labelToUse = lastModified.replace('{date}', localModifiedDate.toLocaleDateString());
    }

    /**
     * Class name for the card:
     * whether card border should be rendered or no;
     * @type {String}
     */
    var cardClassName = (0, _classnames2.default)({
        'consonant-Card': true,
        'consonant-HalfHeightCard': true,
        'consonant-u-noBorders': !renderBorder
    });

    /**
     * Creates a card image DOM reference
     * @returns {Object} - card image DOM reference
     */
    var imageRef = _react2.default.useRef();

    /**
     * @typedef {Image} LazyLoadedImageState
     * @description — Has image as state after image is lazy loaded
     *
     * @typedef {Function} LazyLoadedImageStateSetter
     * @description - Sets state once image is lazy loaded
     *
     * @type {[Image]} lazyLoadedImage
     */

    var _useLazyLoading = (0, _hooks.useLazyLoading)(imageRef, image),
        _useLazyLoading2 = _slicedToArray(_useLazyLoading, 1),
        lazyLoadedImage = _useLazyLoading2[0];

    var isRegistered = (0, _hooks.useRegistered)(false);
    var isGated = (0, _Helpers.hasTag)(/caas:gated/, tags) || (0, _Helpers.hasTag)(/caas:card-style\/half-height-featured/, tags);

    if (isGated && !isRegistered) {
        bannerDescriptionToUse = bannerMap.register.description;
        bannerIconToUse = '';
        bannerBackgroundColorToUse = bannerMap.register.backgroundColor;
        bannerFontColorToUse = bannerMap.register.fontColor;
        videoURLToUse = registrationUrl;
        gateVideo = true;
    } else if (startDate && endDate) {
        var eventBanner = (0, _general.getEventBanner)(startDate, endDate, bannerMap);
        bannerBackgroundColorToUse = eventBanner.backgroundColor;
        bannerDescriptionToUse = eventBanner.description;
        bannerFontColorToUse = eventBanner.fontColor;
        bannerIconToUse = eventBanner.icon;
        var now = (0, _general.getCurrentDate)();
        if ((0, _general.isDateBeforeInterval)(now, startDate)) {
            labelToUse = (0, _prettyFormat2.default)(startDate, endDate, locale, i18nFormat);
        }
    }

    var target = (0, _general.getLinkTarget)(ctaLink, ctaAction);
    var linkBlockerTarget = (0, _general.getLinkTarget)(overlayLink);
    var ariaText = lh.split(' | ').slice(1, -1).join(' | ');

    if (bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse && (!isGated || !isRegistered) && (!disableBanners || isGated)) {
        ariaText = bannerDescriptionToUse + ' | ' + ariaText;
    }

    var addParams = new URLSearchParams(additionalParams);
    var cardLink = additionalParams && addParams.keys().next().value ? ctaLink + '?' + addParams.toString() : ctaLink;
    var overlay = additionalParams && addParams.keys().next().value ? overlayLink + '?' + addParams.toString() : overlayLink;
    var hasBanner = bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse;
    var headingAria = videoURL || label || hasBanner && !disableBanners ? '' : title;

    /**
     * Inner HTML of the card, which will be included into either div or a tag;
     */
    var renderCardContent = function renderCardContent() {
        return _react2.default.createElement(
            _react.Fragment,
            null,
            hasBanner && (!isGated || !isRegistered) && (!disableBanners || isGated) && _react2.default.createElement(
                'span',
                {
                    className: 'consonant-HalfHeightCard-banner',
                    style: {
                        backgroundColor: bannerBackgroundColorToUse,
                        color: bannerFontColorToUse
                    } },
                bannerIconToUse && _react2.default.createElement(
                    'div',
                    {
                        className: 'consonant-HalfHeightCard-bannerIconWrapper' },
                    _react2.default.createElement('img', {
                        alt: '',
                        loading: 'lazy',
                        src: bannerIconToUse })
                ),
                _react2.default.createElement(
                    'span',
                    null,
                    bannerDescriptionToUse
                )
            ),
            _react2.default.createElement('div', {
                className: 'consonant-HalfHeightCard-img',
                ref: imageRef,
                style: { backgroundImage: lazyLoadedImage && 'url("' + lazyLoadedImage + '")' },
                role: altText && 'img',
                'aria-label': altText }),
            _react2.default.createElement(
                'div',
                { className: 'consonant-HalfHeightCard-inner' },
                title && _react2.default.createElement(
                    'p',
                    {
                        role: 'heading',
                        'aria-label': headingAria,
                        'aria-level': headingLevel,
                        className: 'consonant-HalfHeightCard-title',
                        'daa-ll': 'Card CTA' },
                    title
                ),
                labelToUse && _react2.default.createElement(
                    'span',
                    { className: 'consonant-HalfHeightCard-label' },
                    labelToUse
                )
            )
        );
    };

    return videoURLToUse ? _react2.default.createElement(
        'div',
        {
            className: cardClassName,
            'daa-lh': lh,
            'aria-label': ariaText,
            id: id },
        'onFocus=',
        onFocus,
        renderOverlay && _react2.default.createElement(_LinkBlocker2.default, { target: linkBlockerTarget, link: overlay }),
        renderCardContent()
    ) : _react2.default.createElement(
        'a',
        {
            href: cardLink,
            target: target,
            'aria-label': ariaText,
            rel: 'noopener noreferrer',
            className: cardClassName,
            title: '',
            'daa-lh': lh,
            tabIndex: '0',
            onFocus: onFocus,
            id: id },
        renderOverlay && _react2.default.createElement(_LinkBlocker2.default, { target: linkBlockerTarget, link: overlay }),
        renderCardContent()
    );
};

HalfHeightCard.propTypes = halfHeightCardType;
HalfHeightCard.defaultProps = defaultProps;

exports.default = HalfHeightCard;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _hooks = __webpack_require__(4);

var _card = __webpack_require__(5);

var _LinkBlocker = __webpack_require__(7);

var _LinkBlocker2 = _interopRequireDefault(_LinkBlocker);

var _general = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var doubleWideCardType = {
    ctaLink: _propTypes.string,
    id: _propTypes.string.isRequired,
    lh: _propTypes.string,
    styles: (0, _propTypes.shape)(_card.stylesType),
    contentArea: (0, _propTypes.shape)(_card.contentAreaType),
    overlays: (0, _propTypes.shape)(_card.overlaysType),
    renderBorder: _propTypes.bool,
    renderOverlay: _propTypes.bool,
    overlayLink: _propTypes.string,
    startDate: _propTypes.string,
    endDate: _propTypes.string,
    modifiedDate: _propTypes.string,
    bannerMap: (0, _propTypes.shape)(Object).isRequired,
    onFocus: _propTypes.func.isRequired
};

var defaultProps = {
    styles: {},
    lh: '',
    ctaLink: '',
    contentArea: {},
    overlays: {},
    renderBorder: true,
    renderOverlay: false,
    overlayLink: '',
    startDate: '',
    modifiedDate: '',
    endDate: ''
};

/**
 * Double wide card
 *
 * @component
 * @example
 * const props= {
    id: String,
    ctaLink: String,
    styles: Object,
    contentArea: Object,
    overlays: Object,
    renderBorder: Boolean,
    renderOverlay: Boolean,
    overlayLink: String,
 * }
 * return (
 *   <DoubleWideCard {...props}/>
 * )
 */
var DoubleWideCard = function DoubleWideCard(props) {
    var id = props.id,
        lh = props.lh,
        ctaLink = props.ctaLink,
        _props$styles = props.styles,
        image = _props$styles.backgroundImage,
        altText = _props$styles.backgroundAltText,
        _props$contentArea = props.contentArea,
        title = _props$contentArea.title,
        description = _props$contentArea.description,
        label = _props$contentArea.detailText,
        _props$overlays = props.overlays,
        videoURL = _props$overlays.videoButton.url,
        _props$overlays$banne = _props$overlays.banner,
        bannerDescription = _props$overlays$banne.description,
        bannerFontColor = _props$overlays$banne.fontColor,
        bannerBackgroundColor = _props$overlays$banne.backgroundColor,
        bannerIcon = _props$overlays$banne.icon,
        renderBorder = props.renderBorder,
        renderOverlay = props.renderOverlay,
        overlayLink = props.overlayLink,
        startDate = props.startDate,
        endDate = props.endDate,
        modifiedDate = props.modifiedDate,
        bannerMap = props.bannerMap,
        onFocus = props.onFocus;


    var bannerBackgroundColorToUse = bannerBackgroundColor;
    var bannerIconToUse = bannerIcon;
    var bannerFontColorToUse = bannerFontColor;
    var bannerDescriptionToUse = bannerDescription;

    var getConfig = (0, _hooks.useConfig)();

    /**
     **** Authored Configs ****
     */
    var ctaAction = getConfig('collection', 'ctaAction');
    var additionalParams = getConfig('collection', 'additionalRequestParams');
    var headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel');
    var detailsTextOption = getConfig('collection', 'detailsTextOption');
    var lastModified = getConfig('collection', 'i18n.lastModified');

    /**
     * Detail text
     * @type {String}
     */
    var detailText = label;
    if (modifiedDate && detailsTextOption === 'modifiedDate') {
        var localModifiedDate = new Date(modifiedDate);
        detailText = lastModified.replace('{date}', localModifiedDate.toLocaleDateString());
    }

    /**
     * Class name for the card:
     * whether card text content should be rendered or no;
     * whether card border should be rendered or no;
     * @type {String}
     */
    var cardClassName = (0, _classnames2.default)({
        'consonant-Card': true,
        'consonant-DoubleWideCard': true,
        'consonant-DoubleWideCard--noTextInfo': !title && !description && !label,
        'consonant-u-noBorders': !renderBorder
    });

    /**
     * Creates a card image DOM reference
     * @returns {Object} - card image DOM reference
     */
    var imageRef = _react2.default.useRef();

    /**
     * @typedef {Image} LazyLoadedImageState
     * @description — Has image as state after image is lazy loaded
     *
     * @typedef {Function} LazyLoadedImageStateSetter
     * @description - Sets state once image is lazy loaded
     *
     * @type {[Image]} lazyLoadedImage
     */

    var _useLazyLoading = (0, _hooks.useLazyLoading)(imageRef, image),
        _useLazyLoading2 = _slicedToArray(_useLazyLoading, 1),
        lazyLoadedImage = _useLazyLoading2[0];

    if (startDate && endDate) {
        var eventBanner = (0, _general.getEventBanner)(startDate, endDate, bannerMap);
        bannerBackgroundColorToUse = eventBanner.backgroundColor;
        bannerDescriptionToUse = eventBanner.description;
        bannerFontColorToUse = eventBanner.fontColor;
        bannerIconToUse = eventBanner.icon;
    }

    var target = (0, _general.getLinkTarget)(ctaLink, ctaAction);
    var linkBlockerTarget = (0, _general.getLinkTarget)(overlayLink);
    var addParams = new URLSearchParams(additionalParams);
    var cardLink = additionalParams && addParams.keys().next().value ? ctaLink + '?' + addParams.toString() : ctaLink;
    var overlay = additionalParams && addParams.keys().next().value ? overlayLink + '?' + addParams.toString() : overlayLink;
    var hasBanner = bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse;
    var headingAria = videoURL || hasBanner || label || description ? '' : title;

    var ariaText = title;
    if (hasBanner) {
        ariaText = bannerDescriptionToUse + ' | ' + ariaText;
    }

    return _react2.default.createElement(
        'div',
        {
            className: cardClassName,
            'daa-lh': lh,
            id: id },
        renderOverlay && _react2.default.createElement(_LinkBlocker2.default, { target: linkBlockerTarget, link: overlay }),
        bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse && _react2.default.createElement(
            'span',
            {
                'data-testid': 'consonant-OneHalfCard-banner',
                className: 'consonant-OneHalfCard-banner',
                style: {
                    backgroundColor: bannerBackgroundColorToUse,
                    color: bannerFontColorToUse
                } },
            bannerIconToUse && _react2.default.createElement(
                'div',
                {
                    className: 'consonant-OneHalfCard-bannerIconWrapper' },
                _react2.default.createElement('img', {
                    alt: '',
                    loading: 'lazy',
                    src: bannerIconToUse,
                    'data-testid': 'consonant-Card-bannerImg' })
            ),
            _react2.default.createElement(
                'span',
                null,
                bannerDescriptionToUse
            )
        ),
        _react2.default.createElement(
            'div',
            {
                className: 'consonant-DoubleWideCard-img',
                ref: imageRef,
                style: { backgroundImage: lazyLoadedImage && 'url("' + lazyLoadedImage + '")' },
                role: altText && 'img',
                'aria-label': altText },
            videoURL && true
        ),
        _react2.default.createElement(
            'a',
            {
                href: cardLink,
                target: target,
                'aria-label': ariaText,
                'daa-ll': 'Card CTA',
                rel: 'noopener noreferrer',
                tabIndex: '0',
                className: 'consonant-DoubleWideCard-inner',
                onFocus: onFocus },
            detailText && _react2.default.createElement(
                'span',
                { className: 'consonant-DoubleWideCard-label' },
                detailText
            ),
            title && _react2.default.createElement(
                'p',
                {
                    role: 'heading',
                    'aria-label': headingAria,
                    'aria-level': headingLevel,
                    className: 'consonant-DoubleWideCard-title' },
                title
            ),
            description && _react2.default.createElement(
                'p',
                { className: 'consonant-DoubleWideCard-text' },
                description
            )
        )
    );
};

DoubleWideCard.propTypes = doubleWideCardType;
DoubleWideCard.defaultProps = defaultProps;

exports.default = DoubleWideCard;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _cuid = __webpack_require__(9);

var _cuid2 = _interopRequireDefault(_cuid);

var _constants = __webpack_require__(6);

var _CardFooter = __webpack_require__(18);

var _CardFooter2 = _interopRequireDefault(_CardFooter);

var _hooks = __webpack_require__(4);

var _card = __webpack_require__(5);

var _LinkBlocker = __webpack_require__(7);

var _LinkBlocker2 = _interopRequireDefault(_LinkBlocker);

var _general = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProductCardType = {
    footer: (0, _propTypes.arrayOf)((0, _propTypes.shape)(_card.footerType)),
    ctaLink: _propTypes.string,
    id: _propTypes.string.isRequired,
    lh: _propTypes.string,
    styles: (0, _propTypes.shape)(_card.stylesType),
    contentArea: (0, _propTypes.shape)(_card.contentAreaType),
    renderBorder: _propTypes.bool,
    renderOverlay: _propTypes.bool,
    overlayLink: _propTypes.string,
    hideCTA: _propTypes.bool,
    disableBookmarkIco: _propTypes.bool,
    isBookmarked: _propTypes.bool,
    onClick: _propTypes.func,
    dateFormat: _propTypes.string,
    onFocus: _propTypes.func.isRequired
};

var defaultProps = {
    footer: [],
    styles: {},
    ctaLink: '',
    contentArea: {},
    lh: '',
    renderBorder: true,
    renderOverlay: false,
    overlayLink: '',
    hideCTA: false,
    disableBookmarkIco: false,
    isBookmarked: false,
    dateFormat: '',
    onClick: function onClick() {}
};

/**
 * 3/4 image aspect ratio card
 *
 * @component
 * @example
 * const props= {
    id: String,
    ctaLink: String,
    styles: Object,
    contentArea: Object,
    overlays: Object,
    renderBorder: Boolean,
    renderOverlay: Boolean,
    overlayLink: String,
 * }
 * return (
 *   <ProductCard {...props}/>
 * )
 */
var ProductCard = function ProductCard(props) {
    var id = props.id,
        footer = props.footer,
        ctaLink = props.ctaLink,
        lh = props.lh,
        mnemonic = props.styles.mnemonic,
        _props$contentArea = props.contentArea,
        title = _props$contentArea.title,
        description = _props$contentArea.description,
        renderBorder = props.renderBorder,
        renderOverlay = props.renderOverlay,
        overlayLink = props.overlayLink,
        hideCTA = props.hideCTA,
        disableBookmarkIco = props.disableBookmarkIco,
        isBookmarked = props.isBookmarked,
        onClick = props.onClick,
        dateFormat = props.dateFormat,
        onFocus = props.onFocus;

    /**
     **** Authored Configs ****
     */

    var getConfig = (0, _hooks.useConfig)();
    var locale = getConfig('language', '');
    var ctaAction = getConfig('collection', 'ctaAction');
    var cardButtonStyle = getConfig('collection', 'button.style');
    var additionalParams = getConfig('collection', 'additionalRequestParams');
    var headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel');

    /**
     * Class name for the card:
     * whether card border should be rendered or no;
     * @type {String}
     */
    var cardClassName = (0, _classnames2.default)({
        'consonant-Card': true,
        'consonant-ProductCard': true,
        'consonant-u-noBorders': !renderBorder,
        'consonant-hide-cta': hideCTA
    });

    var mnemonicClassName = (0, _classnames2.default)({
        'consonant-ProductCard-img': true,
        'consonant-ProductCard-img--missing': mnemonic === ''
    });

    /**
     * Creates a card image DOM reference
     * @returns {Object} - card image DOM reference
     */
    var imageRef = _react2.default.useRef();

    /**
     * @typedef {Image} LazyLoadedImageState
     * @description — Has image as state after image is lazy loaded
     *
     * @typedef {Function} LazyLoadedImageStateSetter
     * @description - Sets state once image is lazy loaded
     *
     * @type {[Image]} lazyLoadedImage
     */

    var _useLazyLoading = (0, _hooks.useLazyLoading)(imageRef, mnemonic),
        _useLazyLoading2 = _slicedToArray(_useLazyLoading, 1),
        lazyLoadedImage = _useLazyLoading2[0];

    /**
     * Extends infobits with the configuration data
     * @param {Array} data - Array of the infobits
     * @return {Array} - Array of the infobits with the configuration data added
     */


    function extendFooterData(data) {
        if (!data) return [];

        return data.map(function (infobit) {
            // MWPW-129085: Compiler wrongly compiles this object to private, read-only,
            // Created copy so object instance has public methods and properties.
            var copy = _extends({}, infobit);
            if (copy.type === _constants.INFOBIT_TYPE.BOOKMARK) {
                return _extends({}, copy, {
                    cardId: id,
                    disableBookmarkIco: disableBookmarkIco,
                    isBookmarked: isBookmarked,
                    onClick: onClick,
                    isProductCard: true
                });
            } else if (copy.type === _constants.INFOBIT_TYPE.DATE) {
                return _extends({}, copy, {
                    dateFormat: dateFormat,
                    locale: locale
                });
            } else if (cardButtonStyle === 'link') {
                copy.type = _constants.INFOBIT_TYPE.LINK;
            }
            return copy;
        });
    }

    var target = (0, _general.getLinkTarget)(ctaLink, ctaAction);
    var linkBlockerTarget = (0, _general.getLinkTarget)(overlayLink);
    var addParams = new URLSearchParams(additionalParams);
    var overlay = additionalParams && addParams.keys().next().value ? overlayLink + '?' + addParams.toString() : overlayLink;
    var headingAria = description ? '' : title;

    return _react2.default.createElement(
        'div',
        {
            'daa-lh': lh,
            className: cardClassName,
            'data-testid': 'consonant-ProductCard',
            'aria-label': title,
            id: id },
        (renderOverlay || hideCTA) && _react2.default.createElement(_LinkBlocker2.default, { target: linkBlockerTarget, link: overlay }),
        _react2.default.createElement(
            'div',
            {
                target: target,
                className: 'consonant-ProductCard-inner' },
            title && _react2.default.createElement(
                'div',
                { className: 'consonant-ProductCard-row' },
                _react2.default.createElement('div', {
                    'data-testid': mnemonicClassName,
                    className: mnemonicClassName,
                    ref: imageRef,
                    style: { backgroundImage: lazyLoadedImage && 'url("' + lazyLoadedImage + '")' } }),
                _react2.default.createElement(
                    'p',
                    {
                        role: 'heading',
                        'aria-label': headingAria,
                        'aria-level': headingLevel,
                        className: 'consonant-ProductCard-title' },
                    title
                )
            ),
            description && _react2.default.createElement(
                'p',
                {
                    className: 'consonant-ProductCard-text' },
                description
            ),
            !hideCTA && footer.map(function (footerItem) {
                return _react2.default.createElement(_CardFooter2.default, {
                    divider: footerItem.divider,
                    isFluid: footerItem.isFluid,
                    key: (0, _cuid2.default)(),
                    left: extendFooterData(footerItem.left),
                    center: extendFooterData(footerItem.center),
                    right: extendFooterData(footerItem.right),
                    onFocus: onFocus });
            })
        )
    );
};

ProductCard.propTypes = ProductCardType;
ProductCard.defaultProps = defaultProps;

exports.default = ProductCard;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(3);

var _classnames2 = _interopRequireDefault(_classnames);

var _cuid = __webpack_require__(9);

var _cuid2 = _interopRequireDefault(_cuid);

var _propTypes = __webpack_require__(1);

var _CardFooter = __webpack_require__(18);

var _CardFooter2 = _interopRequireDefault(_CardFooter);

var _prettyFormat = __webpack_require__(10);

var _prettyFormat2 = _interopRequireDefault(_prettyFormat);

var _constants = __webpack_require__(6);

var _Helpers = __webpack_require__(11);

var _general = __webpack_require__(2);

var _hooks = __webpack_require__(4);

var _card = __webpack_require__(5);

var _LinkBlocker = __webpack_require__(7);

var _LinkBlocker2 = _interopRequireDefault(_LinkBlocker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var textCardType = {
    isBookmarked: _propTypes.bool,
    dateFormat: _propTypes.string,
    id: _propTypes.string.isRequired,
    lh: _propTypes.string,
    styles: (0, _propTypes.shape)(_card.stylesType),
    disableBookmarkIco: _propTypes.bool,
    onClick: _propTypes.func.isRequired,
    overlays: (0, _propTypes.shape)(_card.overlaysType),
    footer: (0, _propTypes.arrayOf)((0, _propTypes.shape)(_card.footerType)),
    contentArea: (0, _propTypes.shape)(_card.contentAreaType),
    renderBorder: _propTypes.bool,
    renderOverlay: _propTypes.bool,
    overlayLink: _propTypes.string,
    hideCTA: _propTypes.bool,
    startDate: _propTypes.string,
    endDate: _propTypes.string,
    bannerMap: (0, _propTypes.shape)(Object).isRequired,
    tags: (0, _propTypes.arrayOf)((0, _propTypes.shape)(_card.tagsType)),
    onFocus: _propTypes.func.isRequired
};

var defaultProps = {
    footer: [],
    styles: {},
    overlays: {},
    dateFormat: '',
    contentArea: {},
    lh: '',
    isBookmarked: false,
    disableBookmarkIco: false,
    renderBorder: true,
    renderOverlay: false,
    overlayLink: '',
    hideCTA: false,
    startDate: '',
    endDate: '',
    tags: []
};

/**
 * TextCard design card
 *
 * @component
 * @example
 * const props= {
    id: String,
    styles: Object,
    contentArea: Object,
    overlays: Object,
    renderBorder: Boolean,
    renderOverlay: Boolean,
    overlayLink: String,
 * }
 * return (
 *   <TextCard {...props}/>
 * )
 */
var TextCard = function TextCard(props) {
    var id = props.id,
        footer = props.footer,
        lh = props.lh,
        tags = props.tags,
        disableBookmarkIco = props.disableBookmarkIco,
        isBookmarked = props.isBookmarked,
        onClick = props.onClick,
        dateFormat = props.dateFormat,
        _props$styles = props.styles,
        image = _props$styles.backgroundImage,
        altText = _props$styles.backgroundAltText,
        _props$contentArea = props.contentArea,
        title = _props$contentArea.title,
        label = _props$contentArea.detailText,
        description = _props$contentArea.description,
        _props$contentArea$da = _props$contentArea.dateDetailText,
        startTime = _props$contentArea$da.startTime,
        endTime = _props$contentArea$da.endTime,
        _props$overlays$banne = props.overlays.banner,
        bannerDescription = _props$overlays$banne.description,
        bannerFontColor = _props$overlays$banne.fontColor,
        bannerBackgroundColor = _props$overlays$banne.backgroundColor,
        bannerIcon = _props$overlays$banne.icon,
        renderBorder = props.renderBorder,
        renderOverlay = props.renderOverlay,
        overlayLink = props.overlayLink,
        hideCTA = props.hideCTA,
        startDate = props.startDate,
        endDate = props.endDate,
        bannerMap = props.bannerMap,
        onFocus = props.onFocus;


    var bannerBackgroundColorToUse = bannerBackgroundColor;
    var bannerIconToUse = bannerIcon;
    var bannerFontColorToUse = bannerFontColor;
    var bannerDescriptionToUse = bannerDescription;

    var getConfig = (0, _hooks.useConfig)();

    /**
     **** Authored Configs ****
     */
    var i18nFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    var locale = getConfig('language', '');
    var disableBanners = getConfig('collection', 'disableBanners');
    var cardButtonStyle = getConfig('collection', 'button.style');
    var headingLevel = getConfig('collection.i18n', 'cardTitleAccessibilityLevel');
    var additionalParams = getConfig('collection', 'additionalRequestParams');

    /**
     * Class name for the card:
     * whether card border should be rendered or no;
     * @type {String}
     */
    var cardClassName = (0, _classnames2.default)({
        'consonant-Card': true,
        'consonant-TextCard': true,
        'consonant-u-noBorders': !renderBorder,
        'consonant-hide-cta': hideCTA
    });

    /**
     * Creates a card image DOM reference
     * @returns {Object} - card image DOM reference
     */
    var imageRef = _react2.default.useRef();

    /**
     * @typedef {Image} LazyLoadedImageState
     * @description — Has image as state after image is lazy loaded
     *
     * @typedef {Function} LazyLoadedImageStateSetter
     * @description - Sets state once image is lazy loaded
     *
     * @type {[Image]} lazyLoadedImage
     */

    var _useLazyLoading = (0, _hooks.useLazyLoading)(imageRef, image),
        _useLazyLoading2 = _slicedToArray(_useLazyLoading, 1),
        lazyLoadedImage = _useLazyLoading2[0];

    /**
     * Formatted date string
     * @type {String}
     */


    var prettyDate = startTime ? (0, _prettyFormat2.default)(startTime, endTime, locale, i18nFormat) : '';

    /**
     * Detail text
     * @type {String}
     */
    var detailText = prettyDate || label;

    /**
     * isGated
     * @type {Boolean}
     */
    var isGated = (0, _Helpers.hasTag)(/caas:gated/, tags);

    /**
     * Extends infobits with the configuration data
     * @param {Array} data - Array of the infobits
     * @return {Array} - Array of the infobits with the configuration data added
     */
    function extendFooterData(data) {
        if (!data) return [];

        return data.map(function (infobit) {
            // MWPW-129085: Compiler wrongly compiles this object to private, read-only,
            // Created copy so object instance has public methods and properties.
            var copy = _extends({}, infobit);
            if (copy.type === _constants.INFOBIT_TYPE.BOOKMARK) {
                if (isGated) {
                    copy.type = _constants.INFOBIT_TYPE.GATED;
                }
                return _extends({}, copy, {
                    cardId: id,
                    disableBookmarkIco: disableBookmarkIco,
                    isBookmarked: isBookmarked,
                    onClick: onClick
                });
            } else if (copy.type === _constants.INFOBIT_TYPE.DATE) {
                return _extends({}, copy, {
                    dateFormat: dateFormat,
                    locale: locale
                });
            } else if (cardButtonStyle === 'link') {
                copy.type = _constants.INFOBIT_TYPE.LINK;
            }
            return _extends({}, copy, {
                isCta: true
            });
        });
    }

    if (startDate && endDate) {
        var eventBanner = (0, _general.getEventBanner)(startDate, endDate, bannerMap);
        bannerBackgroundColorToUse = eventBanner.backgroundColor;
        bannerDescriptionToUse = eventBanner.description;
        bannerFontColorToUse = eventBanner.fontColor;
        bannerIconToUse = eventBanner.icon;
    }

    var hasBanner = bannerDescriptionToUse && bannerFontColorToUse && bannerBackgroundColorToUse;
    var headingAria = label || detailText || description || hasBanner && !disableBanners ? '' : title;

    var ariaText = title;
    if (hasBanner && !disableBanners) {
        ariaText = bannerDescriptionToUse + ' | ' + ariaText;
    }

    var linkBlockerTarget = (0, _general.getLinkTarget)(overlayLink);
    var addParams = new URLSearchParams(additionalParams);
    var overlay = additionalParams && addParams.keys().next().value ? overlayLink + '?' + addParams.toString() : overlayLink;

    return _react2.default.createElement(
        'div',
        {
            'daa-lh': lh,
            className: cardClassName,
            'aria-label': ariaText,
            'data-testid': 'consonant-TextCard',
            id: id },
        (renderOverlay || hideCTA) && _react2.default.createElement(_LinkBlocker2.default, { target: linkBlockerTarget, link: overlay }),
        _react2.default.createElement(
            'div',
            {
                'data-testid': 'consonant-TextCard-header',
                className: 'consonant-TextCard-header',
                ref: imageRef,
                'aria-label': altText },
            _react2.default.createElement('div', {
                style: {
                    backgroundImage: lazyLoadedImage && 'url(' + lazyLoadedImage + ')'
                },
                className: 'consonant-TextCard-logo' }),
            hasBanner && !disableBanners && _react2.default.createElement(
                'span',
                {
                    'data-testid': 'consonant-TextCard-banner',
                    className: 'consonant-TextCard-banner',
                    style: {
                        backgroundColor: bannerBackgroundColorToUse,
                        color: bannerFontColorToUse
                    } },
                bannerIconToUse && _react2.default.createElement(
                    'div',
                    {
                        className: 'consonant-TextCard-bannerIconWrapper' },
                    _react2.default.createElement('img', {
                        alt: '',
                        loading: 'lazy',
                        src: bannerIconToUse,
                        'data-testid': 'consonant-Card-bannerImg' })
                ),
                _react2.default.createElement(
                    'span',
                    null,
                    bannerDescriptionToUse
                )
            )
        ),
        _react2.default.createElement(
            'div',
            {
                className: 'consonant-TextCard-inner' },
            detailText && _react2.default.createElement(
                'span',
                {
                    'data-testid': 'consonant-TextCard-label',
                    className: 'consonant-TextCard-label' },
                detailText
            ),
            _react2.default.createElement(
                'p',
                {
                    role: 'heading',
                    'aria-label': headingAria,
                    'aria-level': headingLevel,
                    className: 'consonant-TextCard-title',
                    'data-testid': 'consonant-TextCard-title' },
                title
            ),
            description && _react2.default.createElement(
                'p',
                {
                    className: 'consonant-TextCard-text',
                    'data-testid': 'consonant-TextCard-text' },
                description
            ),
            !hideCTA && footer.map(function (footerItem) {
                return _react2.default.createElement(_CardFooter2.default, {
                    divider: footerItem.divider,
                    isFluid: footerItem.isFluid,
                    key: (0, _cuid2.default)(),
                    left: extendFooterData(footerItem.left),
                    right: extendFooterData(footerItem.right),
                    onFocus: onFocus });
            })
        )
    );
};

TextCard.propTypes = textCardType;
TextCard.defaultProps = defaultProps;

exports.default = TextCard;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Helpers = __webpack_require__(11);

var _constants = __webpack_require__(6);

var _cards = __webpack_require__(88);

var _general = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class that will constrain result set based on current state of the component
 *
 * @export
 * @class CardFilterer
 */
var CardFilterer = function () {
    /**
     * Creates an instance of a CardFilterer
     *
     * @param {*} cardsToFilter
     * @param {*} randomSortId
     * @param {*} reservoirSize
     * @memberof CardFilterer
     */
    function CardFilterer(cardsToFilter, randomSortId, sampleSize, reservoirSize) {
        var ids = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

        _classCallCheck(this, CardFilterer);

        this.sampleSize = sampleSize;
        this.filteredCards = cardsToFilter;
        this.randomSortId = randomSortId;
        this.reservoirSize = reservoirSize;
        this.featuredCards = (0, _Helpers.getFeaturedCards)(ids, this.filteredCards);
    }

    /**
     * Given a set of filters a user selected, this method will return all cards that contain
     * those filtlers
     *
     * @param {*} activeFilters
     * @param {*} activePanels
     * @param {*} filterType
     * @param {*} filterTypes
     * @return {*} Chainable
     * @memberof CardFilterer
     */


    _createClass(CardFilterer, [{
        key: 'filterCards',
        value: function filterCards(activeFilters, activePanels, filterType, filterTypes) {
            this.filteredCards = (0, _Helpers.getFilteredCards)(this.filteredCards, activeFilters, activePanels, filterType, filterTypes);
            return this;
        }

        /**
         * Given a user search query and the fields to search, this method will return all cards that
         * match that query.
         *
         * @param {*} searchQuery
         * @param {*} searchFields
         * @return {*} Chainable
         * @memberof CardFilterer
         */

    }, {
        key: 'searchCards',
        value: function searchCards(searchQuery, searchFields) {
            var query = searchQuery.trim().toLowerCase();
            var cardsMatchingSearch = (0, _Helpers.getCardsMatchingSearch)(searchQuery, this.filteredCards, searchFields);

            if (query.length >= 3) {
                this.filteredCards = cardsMatchingSearch.map(function (card) {
                    return searchFields.reduce(function (baseCard, searchField) {
                        return (0, _Helpers.highlightCard)(baseCard, searchField, query);
                    }, card);
                });
            } else {
                this.filteredCards = cardsMatchingSearch;
            }

            return this;
        }

        /**
         * This method will return a chainable of all cards sorted by a given sort option
         *
         * @param {*} sortOption
         * @return {*} Chainable
         * @memberof CardFilterer
         */

    }, {
        key: 'sortCards',
        value: function sortCards(sortOption, eventFilter, featuredCardIds, hideCtaIds, isFirstLoad) {
            if (!this.filteredCards.length) return this;

            var sortType = sortOption ? sortOption.sort.toLowerCase() : null;

            switch (sortType) {
                case _constants.SORT_TYPES.DATEASC:
                    this.filteredCards = (0, _Helpers.getDateAscSort)(this.filteredCards);
                    break;
                case _constants.SORT_TYPES.DATEDESC:
                    this.filteredCards = (0, _Helpers.getDateDescSort)(this.filteredCards);
                    break;
                case _constants.SORT_TYPES.MODIFIEDDESC:
                    this.filteredCards = (0, _Helpers.getModifiedDescSort)(this.filteredCards);
                    break;
                case _constants.SORT_TYPES.MODIFIEDASC:
                    this.filteredCards = (0, _Helpers.getModifiedAscSort)(this.filteredCards);
                    break;
                case _constants.SORT_TYPES.EVENTSORT:
                    {
                        var _getEventSort = (0, _Helpers.getEventSort)(this.filteredCards, eventFilter),
                            nextTransitionMs = _getEventSort.nextTransitionMs,
                            _getEventSort$visible = _getEventSort.visibleSessions,
                            visibleSessions = _getEventSort$visible === undefined ? [] : _getEventSort$visible;

                        this.filteredCards = visibleSessions;

                        if (nextTransitionMs > 0) {
                            this.nextTransitionMs = nextTransitionMs;
                        }

                        break;
                    }
                case _constants.SORT_TYPES.FEATURED:
                    this.filteredCards = (0, _Helpers.getFeaturedSort)(this.filteredCards);
                    break;
                case _constants.SORT_TYPES.TITLEASC:
                    this.filteredCards = (0, _Helpers.getTitleAscSort)(this.filteredCards);
                    break;
                case _constants.SORT_TYPES.TITLEDESC:
                    this.filteredCards = (0, _Helpers.getTitleDescSort)(this.filteredCards);
                    break;
                case _constants.SORT_TYPES.RANDOM:
                    this.filteredCards = (0, _Helpers.getRandomSort)(this.filteredCards, this.randomSortId, this.sampleSize, this.reservoirSize);
                    break;
                default:
                    break;
            }
            if (isFirstLoad || sortType === _constants.SORT_TYPES.FEATURED) {
                this.filteredCards = (0, _general.removeDuplicatesByKey)(this.featuredCards.concat(this.filteredCards), 'id');
            }
            return this;
        }
        /**
         * If cards were authored to be shown or hidden based off a given date range, this method
         * constrains the result set to only cards that should be shown within that date interval.
         *
         * @return {*} Chainable
         * @memberof CardFilterer
         */

    }, {
        key: 'keepCardsWithinDateRange',
        value: function keepCardsWithinDateRange() {
            if (!this.filteredCards.length) return this;

            this.filteredCards = (0, _cards.filterCardsByDateRange)(this.filteredCards);

            return this;
        }
        /**
         * If a bookmark only collection is authored, this method will constrain result set to only
         * cards that were saved.
         *
         * @param {*} onlyShowBookmarks
         * @param {*} bookmarkedCardIds
         * @param {*} showBookmarks
         * @return {*} Chainable
         * @memberof CardFilterer
         */

    }, {
        key: 'keepBookmarkedCardsOnly',
        value: function keepBookmarkedCardsOnly(onlyShowBookmarks, bookmarkedCardIds, showBookmarks) {
            if (onlyShowBookmarks || showBookmarks) {
                this.filteredCards = this.filteredCards.filter(function (card) {
                    return bookmarkedCardIds.includes(card.id);
                });
            }
            return this;
        }
    }, {
        key: 'removeCards',
        value: function removeCards(ids) {
            this.filteredCards = this.filteredCards.filter(function (card) {
                return !ids.has(card.id);
            });
            return this;
        }

        /**
         * If a total card limit is authored, this method will truncate returned cards to adhere to
         * that limit.
         *
         * @param {*} totalCardLimit
         * @return {*} Chainable
         * @memberof CardFilterer
         */

    }, {
        key: 'truncateList',
        value: function truncateList(totalCardLimit) {
            if (!this.filteredCards.length) return this;

            this.filteredCards = (0, _general.truncateList)(totalCardLimit, this.filteredCards);

            return this;
        }
    }]);

    return CardFilterer;
}();

exports.default = CardFilterer;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterCardsByDateRange = exports.getCardDate = undefined;

var _general = __webpack_require__(2);

/**
 * Converts date to milliseconds
 * @param {String} date - date as a string
 * @returns {Number} - a number representing the milliseconds elapsed between
 * 1 January 1970 00:00:00 UTC and the given date
 */
var getCardDate = exports.getCardDate = function getCardDate(date) {
  return new Date(date).getTime();
};

/**
 * Removes cards that are outside the show card date window set in the card
 * @param {Array} cards - cards array
 * @returns {Array} - All cards that are inside the show card date window
 */
var filterCardsByDateRange = exports.filterCardsByDateRange = function filterCardsByDateRange() {
  var cards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var currentDate = new Date().getTime();

  return cards.filter(function (card) {
    var showCardFromField = (0, _general.getByPath)(card, 'showCard.from', '');
    var showCardUntilField = (0, _general.getByPath)(card, 'showCard.until', '');

    if (!showCardFromField || !showCardUntilField) return true;

    var showCardFromDate = getCardDate(showCardFromField);
    var showCardUntilDate = getCardDate(showCardUntilField);

    return currentDate >= showCardFromDate && currentDate <= showCardUntilDate;
  });
};

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _general = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class that handles parsing raw JSON data and returning a set of processed cards
 * that can be used within a card collection.
 *
 * @export
 * @class JsonProcessor
 */
var JsonProcessor = function () {
    /**
     * Creates an instance of JsonProcessor.
     * @param {*} cardsToProcess
     * @memberof JsonProcessor
     */
    function JsonProcessor(cardsToProcess) {
        _classCallCheck(this, JsonProcessor);

        this.processedCards = cardsToProcess;
    }
    /**
     * This method handles removing duplicate cards for the following cases:
     *
     * (1) API Repsonse contains duplicate cards
     * (2) Authored Featured Cards contains duplicate cards
     * (3) Duplicates between API responese and authored feature cards
     *
     * @return {*}
     * @memberof JsonProcessor
     */


    _createClass(JsonProcessor, [{
        key: 'removeDuplicateCards',
        value: function removeDuplicateCards() {
            this.processedCards = (0, _general.removeDuplicatesByKey)(this.processedCards, 'id');
            return this;
        }

        /**
         * This method joins authored featured caards with cards returned from API responsee
         *
         * @param {*} featuredCards
         * @return {*}
         * @memberof JsonProcessor
         */

    }, {
        key: 'addFeaturedCards',
        value: function addFeaturedCards(featuredCards) {
            var someFeaturedCards = featuredCards.map(function (card) {
                return _extends({}, card, {
                    isFeatured: true
                });
            });
            this.processedCards = someFeaturedCards.concat(this.processedCards);
            return this;
        }
        /**
         * This method adds necessary card metadata to cards such as:
         * (1) Whether a card should be bookmarked or not
         * (2) Initial Fields Before Pre-Processing occurs
         * (3) Whether cards should behave as if they are in a Bookmark Only Collection
         *
         * @param {*} truncateTextQty
         * @param {*} onlyShowBookmarks
         * @param {*} bookmarkedCardIds
         * @param {*} hideCtaIds
         * @return {*}
         * @memberof JsonProcessor
         */

    }, {
        key: 'addCardMetaData',
        value: function addCardMetaData(truncateTextQty, onlyShowBookmarks, bookmarkedCardIds, hideCtaIds) {
            this.processedCards = this.processedCards.map(function (card) {
                return _extends({}, card, {
                    description: (0, _general.truncateString)((0, _general.getByPath)(card, 'contentArea.description', ''), truncateTextQty),
                    isBookmarked: bookmarkedCardIds.some(function (i) {
                        return i === card.id;
                    }),
                    disableBookmarkIco: onlyShowBookmarks,
                    hideCtaId: hideCtaIds.some(function (i) {
                        return i === card.id;
                    }),
                    initial: {
                        title: (0, _general.getByPath)(card, 'contentArea.title', ''),
                        description: (0, _general.getByPath)(card, 'contentArea.description', ''),
                        bannerText: (0, _general.getByPath)(card, 'overlays.banner.description', ''),
                        dateDetailText: (0, _general.getByPath)(card, 'contentArea.dateTetailText', ''),
                        detailText: (0, _general.getByPath)(card, 'contentArea.detailText', '')
                    }
                });
            });
            return this;
        }
    }]);

    return JsonProcessor;
}();

exports.default = JsonProcessor;

/***/ }),
/* 90 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);