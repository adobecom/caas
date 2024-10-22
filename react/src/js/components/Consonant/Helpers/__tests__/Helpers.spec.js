import { render, queryByTestId } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import PROPS from '../TestingConstants/Helpers';

import {
    processCards,
    getTotalPages,
    highlightCard,
    getDateAscSort,
    getDateDescSort,
    getFeaturedSort,
    getTitleAscSort,
    getFilteredCards,
    getTitleDescSort,
    getNumCardsToShow,
    getCollectionCards,
    getBookmarkedCards,
    getActiveFilterIds,
    getCardsMatchingQuery,
    shouldDisplayPaginator,
    getCardsMatchingSearch,
    getUpdatedCardBookmarkData,
    hasTag,
    getModifiedDescSort,
    getModifiedAscSort,
    // getEventSort,
    joinCardSets,
    getRandomSort,
    getFeaturedCards,
    sanitizeStr,
    getActivePanels,
} from '../Helpers';

describe('utils/Helpers', () => {
    describe('shouldDisplayPaginator', () => {
        PROPS.shouldDisplayPaginator.forEach(({
            enabled, resultsPerPage, totalResults, expectedValue,
        }) => {
            test(`should return ${expectedValue} value`, () => {
                const value = shouldDisplayPaginator(enabled, resultsPerPage, totalResults);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getNumCardsToShow', () => {
        PROPS.getNumCardsToShow.forEach(({
            resultsPerPage, currentPage, totalResults, expectedValue,
        }) => {
            test(`should return ${expectedValue} value`, () => {
                const value = getNumCardsToShow(resultsPerPage, currentPage, totalResults);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getTotalPages', () => {
        PROPS.getTotalPages.forEach(({
            resultsPerPage, totalResults, expectedValue,
        }) => {
            test(`should return ${expectedValue} value`, () => {
                const value = getTotalPages(resultsPerPage, totalResults);

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getCollectionCards', () => {
        PROPS.getCollectionCards.forEach(({
            showBookmarksOnly, bookmarkedCards, collectionCards, expectedValue,
        }) => {
            test(`should return ${expectedValue} value`, () => {
                const value = getCollectionCards(
                    showBookmarksOnly,
                    bookmarkedCards,
                    collectionCards,
                );

                expect(value).toEqual(expectedValue);
            });
        });
    });
    describe('getBookmarkedCards', () => {
        PROPS.getBookmarkedCards.forEach(({
            cards, expectedValue,
        }) => {
            test(`should return array length === ${expectedValue}`, () => {
                const value = getBookmarkedCards(cards);

                expect(value).toHaveLength(expectedValue);
            });
        });
    });
    describe('getActiveFilterIds', () => {
        PROPS.getActiveFilterIds.forEach(({
            filters, expectedValue,
        }) => {
            test('should return active filter Ids', () => {
                const idList = getActiveFilterIds(filters);

                expect(idList).toEqual(expectedValue);
            });
        });
    });
    describe('getFilteredCards', () => {
        PROPS.getFilteredCards.forEach(({
            cards, activeFilters, activePanels, filterType, filterTypes, categories, expectedValue,
        }) => {
            test('should return filtered cards', () => {
                const filteredCards = getFilteredCards(
                    cards,
                    activeFilters,
                    activePanels,
                    filterType,
                    filterTypes,
                    categories,
                );

                expect(filteredCards).toEqual(expectedValue);
            });
        });

        test('should return throw error when invalid filterType', () => {
            const {
                cards,
                activeFilters,
                activePanels,
                filterType,
                filterTypes,
                expectedValue,
            } = PROPS.getFilteredCardsThrowError;

            function throwError() {
                getFilteredCards(
                    cards,
                    activeFilters,
                    activePanels,
                    filterType,
                    filterTypes,
                );
            }

            expect(throwError).toThrowError(new Error(expectedValue));
        });

        // Additional test cases for full coverage
        test('should return cards when activeFiltersSet is empty and usingTimingFilter is false', () => {
            const cards = [{ id: 1, tags: [] }];
            const activeFilters = [];
            const activePanels = new Set();
            const filterTypes = { TIMING: 'TIMING' };
            const filterType = filterTypes.TIMING;
            const categories = null;
            const result = getFilteredCards(
                cards,
                activeFilters,
                activePanels,
                filterType,
                filterTypes,
                categories,
            );
            expect(result).toEqual(cards);
        });

        test('should filter cards based on categories', () => {
            const cards = [
                { id: 1, tags: [{ id: 'category1' }] },
                { id: 2, tags: [{ id: 'category2' }] },
            ];
            const activeFilters = [];
            const activePanels = new Set();
            const filterTypes = { TIMING: 'TIMING' };
            const filterType = filterTypes.TIMING;
            const categories = ['category1'];

            const expectedValue = [{ id: 1, tags: [{ id: 'category1' }] }];
            const result = getFilteredCards(
                cards,
                activeFilters,
                activePanels,
                filterType,
                filterTypes,
                categories,
            );
            expect(result).toEqual(expectedValue);
        });

        test('should filter cards based on XOR and filter', () => {
            const cards = [
                { id: 1, tags: [{ id: 'filter1' }, { id: 'filter2' }] },
                { id: 2, tags: [{ id: 'filter1' }] },
            ];
            const activeFilters = ['filter1', 'filter2'];
            const activePanels = new Set();
            const filterTypes = { XOR: 'XOR' };
            const filterType = filterTypes.XOR;
            const categories = null;

            const expectedValue = [{ id: 1, tags: [{ id: 'filter1' }, { id: 'filter2' }] }];
            const result = getFilteredCards(
                cards,
                activeFilters,
                activePanels,
                filterType,
                filterTypes,
                categories,
            );
            expect(result).toEqual(expectedValue);
        });

        test('should filter cards based on OR filter with single panel', () => {
            const cards = [
                { id: 1, tags: [{ id: 'filter1' }] },
                { id: 2, tags: [{ id: 'filter2' }] },
            ];
            const activeFilters = ['filter1'];
            const activePanels = new Set(['panel1']);
            const filterTypes = { OR: 'OR' };
            const filterType = filterTypes.OR;
            const categories = null;

            const expectedValue = [{ id: 1, tags: [{ id: 'filter1' }] }];
            const result = getFilteredCards(
                cards,
                activeFilters,
                activePanels,
                filterType,
                filterTypes,
                categories,
            );
            expect(result).toEqual(expectedValue);
        });

        test('should filter cards based on OR filter with multiple panels', () => {
            const cards = [
                { id: 1, tags: [{ id: 'panel1/filter1' }, { id: 'panel2/filter2' }] },
                { id: 2, tags: [{ id: 'panel1/filter1' }] },
            ];
            const activeFilters = ['panel1/filter1', 'panel2/filter2'];
            const activePanels = new Set(['panel1', 'panel2']);
            const filterTypes = { OR: 'OR' };
            const filterType = filterTypes.OR;
            const categories = null;

            const expectedValue = [{ id: 1, tags: [{ id: 'panel1/filter1' }, { id: 'panel2/filter2' }] }];
            const result = getFilteredCards(
                cards,
                activeFilters,
                activePanels,
                filterType,
                filterTypes,
                categories,
            );
            expect(result).toEqual(expectedValue);
        });
    });
    describe('highlightCard', () => {
        test('should highlight searched field correctly', () => {
            const baseCard = { title: 'title name' };
            const searchField = 'title';
            const query = 'name';

            const { title } = highlightCard(
                baseCard,
                searchField,
                query,
            );

            const { container } = render(title);

            const highlightElement = queryByTestId(container, 'consonant-SearchResult');

            expect(highlightElement).not.toBeNull();
            expect(highlightElement).toHaveTextContent('name');
        });
        test('shouldn`t highlight search field', () => {
            const baseCard = { description: 'title name' };
            const searchField = 'title';
            const query = 'name';

            const { title } = highlightCard(
                baseCard,
                searchField,
                query,
            );

            const { container } = render(title);

            const highlightElement = queryByTestId(container, 'consonant-SearchResult');

            expect(highlightElement).toBeNull();
        });
    });
    describe('getCardsMatchingQuery', () => {
        PROPS.getCardsMatchingQuery.forEach(({
            cards, searchFields, query, expectedValue,
        }) => {
            test('should return filtered cards', () => {
                const filteredCards = getCardsMatchingQuery(
                    cards,
                    searchFields,
                    query,
                );

                expect(filteredCards).toEqual(expectedValue);
            });
        });
    });
    describe('getTitleAscSort', () => {
        PROPS.getTitleAscSort.forEach(({
            cards, expectedValue,
        }) => {
            test('should return ASC sorted cards by title', () => {
                const sortedCards = getTitleAscSort(cards);

                expect(sortedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getTitleDescSort', () => {
        PROPS.getTitleDescSort.forEach(({
            cards, expectedValue,
        }) => {
            test('should return DESC sorted cards by title', () => {
                const sortedCards = getTitleDescSort(cards);

                expect(sortedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getFeaturedSort', () => {
        PROPS.getFeaturedSort.forEach(({
            cards, expectedValue,
        }) => {
            test('should return featured sorted cards', () => {
                const sortedCards = getFeaturedSort(cards);

                expect(sortedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getDateAscSort', () => {
        PROPS.getDateAscSort.forEach(({
            cards, expectedValue,
        }) => {
            test('should return ASC sorted cards by title', () => {
                const sortedCards = getDateAscSort(cards);

                expect(sortedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getDateDescSort', () => {
        PROPS.getDateDescSort.forEach(({
            cards, expectedValue,
        }) => {
            test('should return DESC sorted cards by title', () => {
                const sortedCards = getDateDescSort(cards);

                expect(sortedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getCardsMatchingSearch', () => {
        PROPS.getCardsMatchingSearch.forEach(({
            cards, searchFields, query, expectedValue,
        }) => {
            test('should return searched cards', () => {
                const filteredCards = getCardsMatchingSearch(
                    query,
                    cards,
                    searchFields,
                );

                expect(filteredCards).toEqual(expectedValue);
            });
        });
    });
    describe('processCards', () => {
        PROPS.processCards.forEach(({
            featuredCards, rawCards, expectedValue,
        }) => {
            test('should return merged cards', () => {
                const mergedCards = processCards(featuredCards, rawCards);

                expect(mergedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getUpdatedCardBookmarkData', () => {
        PROPS.getUpdatedCardBookmarkData.forEach(({
            cards, bookmarkedCardIds, expectedValue,
        }) => {
            test('should return cards with isBookmarked value', () => {
                const updatedCards = getUpdatedCardBookmarkData(cards, bookmarkedCardIds);

                expect(updatedCards).toEqual(expectedValue);
            });
        });
    });
    describe('hasTag', () => {
        test('has Live Expired tag', () => {
            const hasLiveExpired = hasTag(PROPS.hasTag.compareRegExp1, PROPS.hasTag.passedTags1);

            expect(hasLiveExpired).toBe(true);
        });

        test('has On Demand Schedules tag', () => {
            const hasLiveExpired = hasTag(PROPS.hasTag.compareRegExp2, PROPS.hasTag.passedTags2);

            expect(hasLiveExpired).toBe(true);
        });

        test('does not have DrSuess tag', () => {
            const hasLiveExpired = hasTag(PROPS.hasTag.compareRegExp3, PROPS.hasTag.passedTags3);

            expect(hasLiveExpired).toBe(false);
        });
    });
    describe('getModifiedDescSort', () => {
        PROPS.getModifiedDescSort.forEach(({
            cards, expectedValue,
        }) => {
            test('should return DESC sorted cards by modified date', () => {
                const sortedCards = getModifiedDescSort(cards);

                expect(sortedCards).toEqual(expectedValue);
            });
        });
    });
    describe('getModifiedAscSort', () => {
        PROPS.getModifiedAscSort.forEach(({
            cards, expectedValue,
        }) => {
            test('should return ASC sorted cards by modified date', () => {
                const sortedCards = getModifiedAscSort(cards);

                expect(sortedCards).toEqual(expectedValue);
            });
        });
    });

    // describe('getEventSort', () => {
    //     PROPS.getEventSort.forEach(({ cards, eventFilter, expectedValue }) => {
    //         test(`should return sorted cards by event filter: ${eventFilter}`, () => {
    //             const sortedCards = getEventSort(cards, eventFilter).visibleSessions;
    //             expect(sortedCards).toEqual(expectedValue);
    //         });
    //     });
    // });
    describe('joinCardSets', () => {
        PROPS.joinCardSets.forEach(({ cardSetOne, cardSetTwo, expectedValue }) => {
            test('should concatenate two card sets', () => {
                const result = joinCardSets(cardSetOne, cardSetTwo);
                expect(result).toEqual(expectedValue);
            });
            test('should return the first set if the second set is empty', () => {
                const result = joinCardSets(cardSetOne, []);
                expect(result).toEqual(cardSetOne);
            });
            //
            test('should return the second set if the first set is empty', () => {
                const result = joinCardSets([], cardSetTwo);
                expect(result).toEqual(cardSetTwo);
            });
            //
            test('should return an empty array if both sets are empty', () => {
                const result = joinCardSets([], []);
                expect(result).toEqual([]);
            });
        });
    });

    describe('getRandomSort', () => {
        PROPS.getRandomSort.forEach(({
            cards, id, sampleSize, reservoirSize, expectedValue,
        }) => {
            test(`should return a random sample of cards for id: ${id}`, () => {
                const result = getRandomSort(cards, id, sampleSize, reservoirSize);
                result.forEach((card) => {
                    expect(expectedValue).toContainEqual(card);
                });
            });
        });
    });
    describe('getFeaturedCards', () => {
        PROPS.getFeaturedCards.forEach(({ ids, cards, expectedValue }) => {
            test('should return featured cards with isFeatured set to true', () => {
                const result = getFeaturedCards(ids, cards);
                expect(result).toEqual(expectedValue);
            });
        });
    });
    describe('Sanitize', () => {
        test('should return sanitized string', () => {
            const input = 'Hello &amp; World &lt;3 &gt;2';
            const expectedValue = 'Hello & World <3 >2';
            const result = sanitizeStr(input);
            expect(result).toEqual(expectedValue);
        });
    });
    describe('getActivePanels', () => {
        test('should return a set of filter panels with filters checked on the page', () => {
            const activeFilters = [
                'panel1/filter1',
                'panel1/filter2',
                'panel2/filter1',
                'panel3/filter1',
            ];
            const expectedValue = new Set(['panel1', 'panel2', 'panel3']);
            const result = getActivePanels(activeFilters);
            expect(result).toEqual(expectedValue);
        });
    });
});
