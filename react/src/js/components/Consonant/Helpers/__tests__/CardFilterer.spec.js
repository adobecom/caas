import { render, queryByTestId } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import PROPS from '../TestingConstants/CardFilterer';

import CardFilterer from '../CardFilterer';

global.structuredClone = val => JSON.parse(JSON.stringify(val));

describe('utils/CardFilterer', () => {
    describe('filterCards', () => {
        PROPS.filterCards.forEach(({
            cards, activeFilters, activePanels, filterType, filterTypes, expectedValue,
        }) => {
            test('should return filtered cards', () => {
                const cardFilterer = new CardFilterer(cards);

                const { filteredCards } = cardFilterer.filterCards(
                    activeFilters,
                    activePanels,
                    filterType,
                    filterTypes,
                );

                expect(filteredCards).toEqual(expectedValue);
            });
        });
    });
    describe('sortCards', () => {
        PROPS.sortCards.forEach(({ cards, sortOption, expectedValue }) => {
            test('should return sorted cards', () => {
                const cardFilterer = new CardFilterer(cards);

                const { filteredCards } = cardFilterer.sortCards(sortOption);

                expect(filteredCards).toEqual(expectedValue);
            });
        });
        test('Featured Sort', () => {
            const cards = [{ id: 1 }, { id: 2 }];
            const expectedValue = [{ id: 2, isFeatured: true }, { id: 1 }];
            const cardFilterer = new CardFilterer(cards, 0, 0, 0, [2]);
            const { filteredCards } = cardFilterer.sortCards({ sort: 'featured' }, '', [], true);
            expect(filteredCards).toEqual(expectedValue);
        });
    });
    describe('keepCardsWithinDateRange', () => {
        PROPS.keepCardsWithinDateRange.forEach(({ cards, expectedValue }) => {
            test(`shouldn't return ${expectedValue} value`, () => {
                const cardFilterer = new CardFilterer(cards);

                const { filteredCards } = cardFilterer.keepCardsWithinDateRange();

                expect(filteredCards).toEqual(expectedValue);
            });
        });
    });
    describe('keepBookmarkedCardsOnly', () => {
        PROPS.keepBookmarkedCardsOnly.forEach(({
            cards,
            onlyShowBookmarks,
            bookmarkedCardIds,
            showBookmarks,
            expectedValue,
        }) => {
            test('should return only bookmarked cards', () => {
                const cardFilterer = new CardFilterer(cards);

                const { filteredCards } = cardFilterer.keepBookmarkedCardsOnly(
                    onlyShowBookmarks,
                    bookmarkedCardIds,
                    showBookmarks,
                );

                expect(filteredCards).toEqual(expectedValue);
            });
        });
    });
    describe('truncateList', () => {
        PROPS.truncateList.forEach(({ cards, totalCardLimit, expectedValue }) => {
            test('should return truncated array', () => {
                const cardFilterer = new CardFilterer(cards);

                const { filteredCards } = cardFilterer.truncateList(totalCardLimit);

                expect(filteredCards).toEqual(expectedValue);
            });
        });
    });
    describe('searchCards', () => {
        test('should highlight searched field correctly', () => {
            const query = 'name';
            const searchFields = ['title'];
            const cards = [{ title: 'title name' }, { description: 'description' }, { title: 'some string' }];

            const cardFilterer = new CardFilterer(cards);

            const { filteredCards } = cardFilterer.searchCards(query, searchFields);

            const { container } = render(filteredCards.map(({ title }) => title || null));

            const highlightElement = queryByTestId(container, 'consonant-SearchResult');

            expect(highlightElement).not.toBeNull();
            expect(highlightElement).toHaveTextContent('name');
        });
        test('shouldn`t highlight searched field when query.length < 3', () => {
            const query = '12';
            const searchFields = ['title'];
            const cards = [{ title: 'title name' }, { description: 'description' }, { title: 'some string' }];

            const cardFilterer = new CardFilterer(cards);

            const { filteredCards } = cardFilterer.searchCards(query, searchFields);

            expect(filteredCards).toEqual([]);
        });
    });
});
