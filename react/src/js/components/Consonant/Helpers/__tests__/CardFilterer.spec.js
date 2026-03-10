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

        // Additional test cases for full coverage
        test('Date Ascending Sort', () => {
            const cards = [{ id: 1, cardDate: '2021-01-01' }, { id: 2, cardDate: '2020-01-01' }];
            const expectedValue = [{ id: 2, cardDate: '2020-01-01' }, { id: 1, cardDate: '2021-01-01' }];
            const cardFilterer = new CardFilterer(cards);
            const { filteredCards } = cardFilterer.sortCards({ sort: 'dateasc' });
            expect(filteredCards).toEqual(expectedValue);
        });

        test('Date Descending Sort', () => {
            const cards = [{ id: 1, cardDate: '2021-01-01' }, { id: 2, cardDate: '2020-01-01' }];
            const expectedValue = [{ id: 1, cardDate: '2021-01-01' }, { id: 2, cardDate: '2020-01-01' }];
            const cardFilterer = new CardFilterer(cards);
            const { filteredCards } = cardFilterer.sortCards({ sort: 'datedesc' });
            expect(filteredCards).toEqual(expectedValue);
        });

        test('Modified Descending Sort', () => {
            const cards = [{ id: 1, modified: '2021-01-01' }, { id: 2, modified: '2020-01-01' }];
            const expectedValue = [{ id: 1, modified: '2021-01-01' }, { id: 2, modified: '2020-01-01' }];
            const cardFilterer = new CardFilterer(cards);
            const { filteredCards } = cardFilterer.sortCards({ sort: 'modifieddesc' });
            expect(filteredCards).toEqual(expectedValue);
        });

        test('Modified Ascending Sort', () => {
            const cards = [{ id: 1, modified: '2021-01-01' }, { id: 2, modified: '2020-01-01' }];
            const expectedValue = [{ id: 2, modified: '2020-01-01' }, { id: 1, modified: '2021-01-01' }];
            const cardFilterer = new CardFilterer(cards);
            const { filteredCards } = cardFilterer.sortCards({ sort: 'modifiedasc' });
            expect(filteredCards).toEqual(expectedValue);
        });

        test('Event Sort', () => {
            const cards = [
                { id: 1, contentArea: { dateDetailText: { startTime: '2021-01-01', endTime: '2021-01-02' } }, tags: ['event1'], footer: [{ left: []}] },
                { id: 2, contentArea: { dateDetailText: { startTime: '2021-01-03', endTime: '2029-01-04' } }, tags: ['event2'], footer: [{ left: []}] },
            ];
            const expectedValue = [
                { id: 1,
contentArea: { dateDetailText: { startTime: '2021-01-01', endTime: '2021-01-02' } },
                    createdDate: '',
ctaLink: '',
description: '',
endDate: '2021-01-02',
footer: [{ left: [] }],
initial: {},
isBookmarked: false,
                    modifiedDate: '',
overlayLink: '',
overlays: {},
search: {},
showCard: {},
startDate: '2021-01-01',
styles: {},
                    cardDate: '',
tags: ['event1'] },
            ];
            const cardFilterer = new CardFilterer(cards);
            const { filteredCards } = cardFilterer.sortCards({ sort: 'eventsort' }, 'on-demand');
            expect(filteredCards).toEqual(expectedValue);
        });

        test('Event Sort with nextTransitionMs', () => {
            const cards = [
                { id: 1, contentArea: { dateDetailText: { startTime: '2021-01-01', endTime: '2021-01-02' } }, tags: ['event1'], footer: [{ left: []}] },
                { id: 2, contentArea: { dateDetailText: { startTime: '2021-01-03', endTime: '2129-01-04' } }, tags: ['event2'], footer: [{ left: []}] },
            ];
            const expectedValue = [
                { id: 1,
contentArea: { dateDetailText: { startTime: '2021-01-01', endTime: '2021-01-02' } },
                    createdDate: '',
ctaLink: '',
description: '',
endDate: '2021-01-02',
footer: [{ left: [] }],
initial: {},
isBookmarked: false,
                    modifiedDate: '',
overlayLink: '',
overlays: {},
search: {},
showCard: {},
startDate: '2021-01-01',
styles: {},
                    cardDate: '',
tags: ['event1'] },
            ];
            const cardFilterer = new CardFilterer(cards);
            cardFilterer.sortCards({ sort: 'eventsort' }, ['on-demand']);
            expect(cardFilterer.filteredCards).toEqual(expectedValue);
            expect(cardFilterer.nextTransitionMs).toBeGreaterThan(-1);
        });
        test('Event Sort with a string (legacy event sort)', () => {
            const cards = [
                { id: 1, contentArea: { dateDetailText: { startTime: '2021-01-01', endTime: '2021-01-02' } }, tags: ['event1'], footer: [{ left: []}] },
                { id: 2, contentArea: { dateDetailText: { startTime: '2021-01-03', endTime: '2129-01-04' } }, tags: ['event2'], footer: [{ left: []}] },
            ];
            const expectedValue = [
                { id: 1,
contentArea: { dateDetailText: { startTime: '2021-01-01', endTime: '2021-01-02' } },
                    createdDate: '',
ctaLink: '',
description: '',
endDate: '2021-01-02',
footer: [{ left: [] }],
initial: {},
isBookmarked: false,
                    modifiedDate: '',
overlayLink: '',
overlays: {},
search: {},
showCard: {},
startDate: '2021-01-01',
styles: {},
                    cardDate: '',
tags: ['event1'] },
            ];
            const cardFilterer = new CardFilterer(cards);
            cardFilterer.sortCards({ sort: 'eventsort' }, 'on-demand');
            expect(cardFilterer.filteredCards).toEqual(expectedValue);
            expect(cardFilterer.nextTransitionMs).toBeGreaterThan(-1);
        });

        test('Title Ascending Sort', () => {
            const cards = [{ id: 1, contentArea: { title: 'B' } }, { id: 2, contentArea: { title: 'A' } }];
            const expectedValue = [{ id: 2, contentArea: { title: 'A' } }, { id: 1, contentArea: { title: 'B' } }];
            const cardFilterer = new CardFilterer(cards);
            const { filteredCards } = cardFilterer.sortCards({ sort: 'titleasc' });
            expect(filteredCards).toEqual(expectedValue);
        });

        test('Title Descending Sort', () => {
            const cards = [{ id: 1, contentArea: { title: 'B' } }, { id: 2, contentArea: { title: 'A' } }];
            const expectedValue = [{ id: 1, contentArea: { title: 'B' } }, { id: 2, contentArea: { title: 'A' } }];
            const cardFilterer = new CardFilterer(cards);
            const { filteredCards } = cardFilterer.sortCards({ sort: 'titledesc' });
            expect(filteredCards).toEqual(expectedValue);
        });

        test('Random Sort', () => {
            const cards = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const cardFilterer = new CardFilterer(cards, 1, 2, 3);
            const { filteredCards } = cardFilterer.sortCards({ sort: 'random' });
            expect(filteredCards).toHaveLength(2); // Assuming sampleSize is 2
        });

        test('Local First Sort – sorts by country ascending', () => {
            const cards = [
                { id: 1, country: 'US' },
                { id: 2, country: 'DE' },
                { id: 3, country: 'FR' },
            ];
            const cardFilterer = new CardFilterer(cards);
            const { filteredCards } = cardFilterer.sortCards({ sort: 'localfirst' });
            const countryOrder = filteredCards.map(c => c.country);
            expect(countryOrder).toEqual(['DE', 'FR', 'US']);
        });

        test('Local First Sort – all same country preserves cards', () => {
            const cards = [
                { id: 1, country: 'US' },
                { id: 2, country: 'US' },
                { id: 3, country: 'US' },
            ];
            const cardFilterer = new CardFilterer(cards);
            const { filteredCards } = cardFilterer.sortCards({ sort: 'localfirst' });
            expect(filteredCards).toHaveLength(3);
            expect(filteredCards.map(c => c.id)).toEqual(expect.arrayContaining([1, 2, 3]));
        });

        test('Local Last Sort – sorts by country descending', () => {
            const cards = [
                { id: 1, country: 'US' },
                { id: 2, country: 'DE' },
                { id: 3, country: 'FR' },
            ];
            const cardFilterer = new CardFilterer(cards);
            const { filteredCards } = cardFilterer.sortCards({ sort: 'locallast' });
            const countryOrder = filteredCards.map(c => c.country);
            expect(countryOrder).toEqual(['US', 'FR', 'DE']);
        });

        test('Local First / Local Last – single card unchanged', () => {
            const cards = [{ id: 1, country: 'US' }];
            const cardFiltererFirst = new CardFilterer([...cards]);
            const cardFiltererLast = new CardFilterer([...cards]);
            const { filteredCards: first } = cardFiltererFirst.sortCards({ sort: 'localfirst' });
            const { filteredCards: last } = cardFiltererLast.sortCards({ sort: 'locallast' });
            expect(first).toHaveLength(1);
            expect(last).toHaveLength(1);
            expect(first[0].id).toBe(1);
            expect(last[0].id).toBe(1);
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
