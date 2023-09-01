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

export const DEFAULT_PROPS_3_2 = {
    ...CARD_PROPS,
    bannerMap: {},
    footer,
    isBookmarked: false,
    dateFormat: prettyDateIntervalFormat,
    disableBookmarkIco: Boolean(bookmarkOnlyCollection),

    onClick: jest.fn(),
};

export const DEFAULT_PROPS_1_1 = {
    ...CARD_PROPS,
    bannerMap: {},
};

export const DEFAULT_PROPS_FULL = {
    ...CARD_PROPS,
    bannerMap: {},
};

export const DEFAULT_PROPS_DW = {
    ...CARD_PROPS,
    bannerMap: {},
};
