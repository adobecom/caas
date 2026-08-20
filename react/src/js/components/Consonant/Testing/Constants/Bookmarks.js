import { bookmarks } from '../Mocks/config.json';

export const COUNT_LIST = [0, 5, 10, 15, 20];
export const DEFAULT_PROPS = {
    selectedIco: bookmarks.selectBookmarksIcon,
    unselectedIco: bookmarks.unselectBookmarksIcon,
    selected: false, // if true - render selectedIco, if false - render unselectedIco
    onClick: jest.fn(), // handler to switch selected prop
    qty: 0, // bookmarked cards count
};

export const WITHOUT_ICONS = {
    ...bookmarks,
    leftFilterPanel: {
        ...bookmarks.leftFilterPanel,
        selectBookmarksIcon: undefined,
        unselectBookmarksIcon: undefined,
    },
};
