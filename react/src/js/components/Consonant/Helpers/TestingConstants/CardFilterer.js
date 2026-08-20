import helperProps from './Helpers';
import CARDS_PROPS from './cards';
import { SORT_TYPES } from '../constants';

const filterCards = helperProps.getFilteredCards;

const cardsToSort = {
    1: {
        id: '1',
        isFeatured: true,
        initialTitle: 'c title',
        contentArea: { title: 'a title' },
        cardDate: '2021-10-12T21:00:00.000Z',
    },
    2: {
        id: '2',
        isFeatured: true,
        initialTitle: 'c title',
        contentArea: { title: 'b title' },
        cardDate: '2021-10-12T21:00:00.000Z',
    },
    3: {
        id: '3',
        isFeatured: true,
        initialTitle: 'c title',
        contentArea: { title: 'c title' },
        cardDate: null,
    },
    4: {
        id: '4',
        isFeatured: true,
        initialTitle: 'a title',
        contentArea: { title: 'a title' },
        cardDate: '2021-10-12T21:00:00.000Z',
    },
    5: {
        id: '5',
        isFeatured: true,
        initialTitle: 'a title',
        contentArea: { title: 'b title' },
        cardDate: '2021-10-12T21:00:00.000Z',
    },
    6: {
        id: '6',
        isFeatured: true,
        initialTitle: 'a title',
        contentArea: { title: 'c title' },
        cardDate: '2021-10-12T21:00:00.000Z',
    },
    7: {
        id: '7',
        isFeatured: false,
        initialTitle: 'c title',
        contentArea: { title: 'a title' },
        cardDate: '2021-10-10T21:00:00.000Z',
    },
    8: {
        id: '8',
        isFeatured: false,
        initialTitle: 'c title',
        contentArea: { title: 'b title' },
        cardDate: null,
    },
    9: {
        id: '9',
        isFeatured: false,
        initialTitle: 'c title',
        contentArea: { title: 'c title' },
        cardDate: '2021-10-12T21:00:00.000Z',
    },
    10: {
        id: '10',
        isFeatured: true,
        initialTitle: 'b title',
        contentArea: { title: 'a title' },
        cardDate: '2021-10-12T21:00:00.000Z',
    },
    11: {
        id: '11',
        isFeatured: true,
        initialTitle: 'b title',
        contentArea: { title: 'b title' },
        cardDate: '2021-10-12T21:00:00.000Z',
    },
    12: {
        id: '12',
        isFeatured: true,
        initialTitle: 'b title',
        contentArea: { title: 'c title' },
        cardDate: '2021-10-10T21:00:00.000Z',
    },
    13: {
        id: '13',
        isFeatured: false,
        initialTitle: 'a title',
        contentArea: { title: 'a title' },
        cardDate: null,
    },
    14: {
        id: '14',
        isFeatured: false,
        initialTitle: 'a title',
        contentArea: { title: 'b title' },
        cardDate: '2021-10-12T21:00:00.000Z',
    },
    15: {
        id: '15',
        isFeatured: false,
        initialTitle: 'a title',
        contentArea: { title: 'c title' },
        cardDate: '2021-10-12T21:00:00.000Z',
    },
    16: {
        id: '16',
        isFeatured: false,
        initialTitle: 'b title',
        contentArea: { title: 'a title' },
        cardDate: '2021-10-12T21:00:00.000Z',
    },
    17: {
        id: '17',
        isFeatured: false,
        initialTitle: 'b title',
        contentArea: { title: 'b title' },
        cardDate: '2021-10-10T21:00:00.000Z',
    },
    18: {
        id: '18',
        isFeatured: false,
        initialTitle: 'b title',
        contentArea: { title: 'c title' },
        cardDate: null,
    },
};

const getCards = idList => idList.map(id => cardsToSort[id]);

const cardsWithoutSorting = getCards([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
]);

const sortCards = [
    {
        cards: [...cardsWithoutSorting],
        sortOption: { sort: SORT_TYPES.DATEASC },
        expectedValue: getCards([12, 17, 7, 1, 10, 2, 3, 11, 15, 4, 5, 6, 8, 9, 13, 14, 16, 18]),
    },
    {
        cards: [...cardsWithoutSorting],
        sortOption: { sort: SORT_TYPES.DATEDESC },
        // expectedValue: getCards([18, 16, 15, 14, 17, 13, 11, 10, 9, 8, 6, 5, 4, 3, 2, 1, 12, 7]),
        expectedValue: getCards([18, 16, 14, 13, 9, 8, 6, 5, 4, 15, 11, 3, 2, 10, 1, 7, 17, 12]),
    },
    {
        cards: [...cardsWithoutSorting],
        sortOption: { sort: SORT_TYPES.TITLEASC },
        expectedValue: getCards([1, 4, 7, 10, 13, 16, 2, 5, 8, 11, 14, 17, 3, 6, 9, 12, 15, 18]),
    },
    {
        cards: [...cardsWithoutSorting],
        sortOption: { sort: SORT_TYPES.TITLEDESC },
        expectedValue: getCards([18, 15, 12, 9, 6, 3, 17, 14, 11, 8, 5, 2, 16, 13, 10, 7, 4, 1]),
    },
    {
        cards: [...cardsWithoutSorting],
        sortOption: null,
        expectedValue: [...cardsWithoutSorting],
    },
];

const keepCardsWithinDateRange = CARDS_PROPS.filterCardsByDateRange;

const cardsToBookmarked = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

const keepBookmarkedCardsOnly = [
    {
        cards: cardsToBookmarked,
        onlyShowBookmarks: false,
        bookmarkedCardIds: [1, 2],
        showBookmarks: false,
        expectedValue: cardsToBookmarked,
    },
    {
        cards: cardsToBookmarked,
        onlyShowBookmarks: true,
        bookmarkedCardIds: [1, 2],
        showBookmarks: false,
        expectedValue: [{ id: 1 }, { id: 2 }],
    },
    {
        cards: cardsToBookmarked,
        onlyShowBookmarks: false,
        bookmarkedCardIds: [1, 2],
        showBookmarks: true,
        expectedValue: [{ id: 1 }, { id: 2 }],
    },
    {
        cards: cardsToBookmarked,
        onlyShowBookmarks: true,
        bookmarkedCardIds: [1, 2],
        showBookmarks: true,
        expectedValue: [{ id: 1 }, { id: 2 }],
    },
];

const truncateList = [
    {
        cards: [1, 2, 3],
        totalCardLimit: 1,
        expectedValue: [1],
    },
    {
        cards: [1, 2, 3],
        totalCardLimit: 0,
        expectedValue: [],
    },
    {
        cards: [1, 2, 3],
        totalCardLimit: -1,
        expectedValue: [1, 2, 3],
    },
];

export default {
    sortCards,
    filterCards,
    truncateList,
    keepBookmarkedCardsOnly,
    keepCardsWithinDateRange,
};
