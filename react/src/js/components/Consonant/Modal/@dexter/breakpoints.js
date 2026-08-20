/**
 * @desc This is an object contains the breakpoints and MatchMedia expressions
 * for all the supported breakpoints.
 */
const unit = 'rem';
const phoneOnly = 37.4375; // 599px
const tabletPortraitUp = phoneOnly + 0.0625; // 600px
const tabletPortraitMax = 56.1875; // 899px
const tabletLandscapeUp = tabletPortraitMax + 0.0625; // 900px
const tabletLandscapeMax = 74.9375; // 1199px
const desktop = tabletLandscapeMax + 0.0625; // 1200px

const mediaExpression = {
    mobile: `(max-width: ${phoneOnly}${unit})`,
    tabletPortrait: `(min-width: ${tabletPortraitUp}${unit}) and (max-width: ${tabletPortraitMax}${unit})`,
    tabletLandscape: `(min-width: ${tabletLandscapeUp}${unit}) and (max-width: ${tabletLandscapeMax}${unit})`,
    desktop: `(min-width: ${desktop}${unit})`,
};

export default {
    phoneOnly,
    tabletPortraitUp,
    tabletPortraitMax,
    tabletLandscapeUp,
    tabletLandscapeMax,
    desktop,
    mediaExpression,
};
