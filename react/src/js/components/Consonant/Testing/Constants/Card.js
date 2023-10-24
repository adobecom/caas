import { bookmarks, collection } from '../Mocks/config.json';

import cardList from '../Mocks/cards.json';

const { i18n: { prettyDateIntervalFormat } } = collection;
const {
    leftFilterPanel: {
        bookmarkOnlyCollection,
    },
} = bookmarks;
const [{
    id,
    badgeText,
    footer,
    styles,
    contentArea,
    overlays,
    ctaLink,
}] = cardList;

const CARD_PROPS = {
    id,
    styles,
    overlays,
    badgeText,
    contentArea,
    ctaLink,
};

export const DEFAULT_PROPS_ONE_HALF = {
    ...CARD_PROPS,
    bannerMap: {},
    footer,
    isBookmarked: false,
    dateFormat: prettyDateIntervalFormat,
    disableBookmarkIco: Boolean(bookmarkOnlyCollection),

    onClick: jest.fn(),
};

export const DEFAULT_PROPS_THREE_FOURTHS = {
    ...CARD_PROPS,
    bannerMap: {},
};

export const DEFAULT_PROPS_HALF_HEIGHT = {
    ...CARD_PROPS,
    bannerMap: {},
};

export const DEFAULT_PROPS_FULL = {
    ...CARD_PROPS,
    bannerMap: {},
};

export const DEFAULT_PROPS_DOUBLE_WIDE = {
    ...CARD_PROPS,
    bannerMap: {},
};

export const DEFAULT_PROPS_PRODUCT = {
    ...CARD_PROPS,
    footer,
};

export const DEFAULT_PROPS_TEXT = {
    ...CARD_PROPS,
    footer,
};
