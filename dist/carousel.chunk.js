webpackJsonp([0],{

/***/ 315:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Helpers_hooks__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Grid_Grid__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Helpers_rendering__ = __webpack_require__(40);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/* eslint-disable react/jsx-no-bind,react/forbid-prop-types,react/jsx-no-bind */






var NEXT_BUTTON_NAME = 'next';
var PREV_BUTTON_NAME = 'previous';
var TABLET_BREAKPOINT = 1199;
var cardsShiftedPerClick = null;
var cardWidth = null;
function CardsCarousel() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    cards = _ref.cards,
    onCardBookmark = _ref.onCardBookmark,
    resQty = _ref.resQty;
  var getConfig = Object(__WEBPACK_IMPORTED_MODULE_3__Helpers_hooks__["a" /* useConfig */])();
  var cardsUp = getConfig('collection', 'layout.type');
  var gridGap = parseInt(getConfig('collection', 'layout.gutter'), 10) * 8;
  var title = getConfig('collection', 'i18n.title');
  var showTotalResults = getConfig('collection', 'showTotalResults');
  var showTotalResultsText = getConfig('collection', 'i18n.totalResultsText');
  var useLightText = getConfig('collection', 'useLightText');
  var isIncremental = getConfig('pagination', 'animationStyle') === 'incremental';
  if (cardsUp.includes('2up')) {
    cardWidth = 500;
    cardsShiftedPerClick = isIncremental ? 1 : 2;
  } else if (cardsUp.includes('3up')) {
    cardWidth = 378;
    cardsShiftedPerClick = isIncremental ? 1 : 3;
  } else if (cardsUp.includes('4up')) {
    cardWidth = 276;
    cardsShiftedPerClick = isIncremental ? 1 : 4;
  } else if (cardsUp.includes('5up')) {
    cardWidth = 228;
    cardsShiftedPerClick = isIncremental ? 1 : 5;
  }
  var HeadingLevel = getConfig('collection', 'i18n.titleHeadingLevel');
  var cardsPerPage = parseInt(cardsUp, 10);
  var _useState = Object(__WEBPACK_IMPORTED_MODULE_0_react__["useState"])(Number.POSITIVE_INFINITY),
    _useState2 = _slicedToArray(_useState, 1),
    pages = _useState2[0];
  var carouselRef = Object(__WEBPACK_IMPORTED_MODULE_0_react__["useRef"])(null);
  var prev = Object(__WEBPACK_IMPORTED_MODULE_0_react__["useRef"])(null);
  var next = Object(__WEBPACK_IMPORTED_MODULE_0_react__["useRef"])(null);
  var isDown = null;
  var startX = null;
  /* eslint-disable-next-line no-unused-vars */
  var isMouseMove = false;
  var interactedWith = false;
  function isResponsive() {
    return window.innerWidth < TABLET_BREAKPOINT;
  }
  function hideNextButton() {
    var nextBtn = next.current;
    if (nextBtn) {
      nextBtn.classList.add('hide');
    }
  }
  function hidePrevButton() {
    var prevBtn = prev.current;
    if (prevBtn) prevBtn.classList.add('hide');
  }
  function showNextButton() {
    var nextBtn = next.current;
    if (nextBtn) nextBtn.classList.remove('hide');
  }
  function showPrevButton() {
    var prevBtn = prev.current;
    if (prevBtn) prevBtn.classList.remove('hide');
  }
  function hideNav() {
    hidePrevButton();
    hideNextButton();
  }
  function showNav() {
    showPrevButton();
    showNextButton();
  }
  function shouldHidePrevButton() {
    var carousel = carouselRef.current;
    var atStartOfCarousel = carousel.scrollLeft < cardWidth;
    if (atStartOfCarousel) {
      hidePrevButton();
    }
  }
  function shouldHideNextButton() {
    var carousel = carouselRef.current;
    var atEndOfCarousel = carousel.scrollWidth - carousel.clientWidth < carousel.scrollLeft + cardWidth;
    if (atEndOfCarousel) {
      hideNextButton();
    }
  }
  function responsiveLogic() {
    if (isResponsive() && interactedWith) {
      hideNav();
    } else {
      showNav();
      shouldHidePrevButton();
      shouldHideNextButton();
    }
  }
  function mouseDownHandler(e) {
    e.preventDefault();
    interactedWith = true;
    responsiveLogic();
    isDown = true;
    startX = e.pageX;
  }
  function mouseUpHandler() {
    isDown = false;
    isMouseMove = false;
  }
  function mouseLeaveHandler() {
    isDown = false;
    isMouseMove = false;
  }
  function mouseMoveHandler(e) {
    if (!isDown) return;
    isMouseMove = true;
    var carousel = carouselRef.current;
    var x = e.pageX - carousel.offsetLeft;
    carousel.scrollLeft -= x - startX;
  }
  function scrollHandler() {
    interactedWith = true;
    responsiveLogic();
  }

  /**
   * 620 = (tablet range) + average grid gap
   * 620 = 1200px - 600px + (8 + 32)/2
   */
  function centerClick() {
    var carousel = carouselRef.current;
    /* eslint-disable-next-line no-mixed-operators */
    carousel.scrollLeft += -window.innerWidth / 2 + 620;
  }
  function nextButtonClick() {
    if (isResponsive()) {
      centerClick();
    } else {
      var carousel = carouselRef.current;
      carousel.scrollLeft += (cardWidth + gridGap) * cardsShiftedPerClick;
      shouldHideNextButton();
    }
  }
  function prevButtonClick() {
    if (isResponsive()) {
      centerClick();
    } else {
      var carousel = carouselRef.current;
      carousel.scrollLeft -= (cardWidth + gridGap) * cardsShiftedPerClick;
      shouldHidePrevButton();
    }
  }
  var carouselTitleClass = __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
    'consonant-CarouselInfo-collectionTitle': true,
    'consonant-CarouselInfo-collectionTitle--withLightText': useLightText
  });
  var carouselTotalResultsClass = __WEBPACK_IMPORTED_MODULE_1_classnames___default()({
    'consonant-CarouselInfo-results': true,
    'consonant-CarouselInfo-results--withLightText': useLightText
  });
  var totalResultsHtml = Object(__WEBPACK_IMPORTED_MODULE_5__Helpers_rendering__["c" /* RenderTotalResults */])(showTotalResultsText, resQty);
  Object(__WEBPACK_IMPORTED_MODULE_0_react__["useEffect"])(function () {
    responsiveLogic();
  }, []);
  return /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_0_react__["Fragment"], null, /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div", {
    className: "consonant-Navigation--carousel"
  }, /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("button", {
    "aria-label": "Previous button",
    className: "consonant-Button--previous",
    onClick: prevButtonClick,
    "daa-ll": "Previous",
    "daa-state": "true",
    name: PREV_BUTTON_NAME,
    ref: prev,
    type: "button"
  }), /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("button", {
    "aria-label": "Next button",
    className: "consonant-Button--next",
    "daa-ll": "Next",
    "daa-state": "true",
    onClick: nextButtonClick,
    name: NEXT_BUTTON_NAME,
    ref: next,
    type: "button"
  })), /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div", {
    className: "consonant-CarouselInfo"
  }, title && /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(HeadingLevel, {
    "data-testid": "consonant-CarouselInfo-collectionTitle",
    className: carouselTitleClass
  }, title), showTotalResults && /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div", {
    "data-testid": "consonant-CarouselInfo-results",
    className: carouselTotalResultsClass
  }, totalResultsHtml)), /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div", {
    className: "consonant-Container--carousel",
    onMouseDown: mouseDownHandler,
    onMouseUp: mouseUpHandler,
    onMouseMove: mouseMoveHandler,
    onMouseLeave: mouseLeaveHandler,
    onScroll: scrollHandler,
    ref: carouselRef
  }, /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__Grid_Grid__["a" /* default */], {
    cards: cards,
    containerType: "carousel",
    resultsPerPage: cardsPerPage,
    onCardBookmark: onCardBookmark,
    pages: pages
  })));
}
/* harmony default export */ __webpack_exports__["default"] = (CardsCarousel);
CardsCarousel.propTypes = {
  cards: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.object).isRequired,
  onCardBookmark: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.func.isRequired,
  resQty: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.number.isRequired
};

/***/ })

});