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
    getEventSort,
    joinCardSets,
    getRandomSort,
    getFeaturedCards,
    sanitizeStr,
    getActivePanels,
    expandGroupFiltersToChildren,
    getGroupedFilterSelections,
    transformFiltersWithCategories,
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

            expect(throwError).toThrow(new Error(expectedValue));
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

    describe('getEventSort', () => {
         PROPS.getEventSort.forEach(({ cards, eventFilter, expectedValue }) => {
             test(`should return sorted cards by event filter: ${eventFilter}`, () => {
                 const sortedCards = getEventSort(cards, eventFilter).visibleSessions;
                 expect(sortedCards).toEqual(expectedValue);
             });
         });
    });
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
    describe('expandGroupFiltersToChildren', () => {
        test('should return same filters when no categoryMappings provided', () => {
            const activeFilterIds = ['caas:products/photoshop', 'caas:products/illustrator'];
            const result = expandGroupFiltersToChildren(activeFilterIds);
            expect(result).toEqual(['caas:products/photoshop', 'caas:products/illustrator']);
        });

        test('should return same filters when categoryMappings is empty', () => {
            const activeFilterIds = ['caas:products/photoshop'];
            const categoryMappings = {};
            const result = expandGroupFiltersToChildren(activeFilterIds, categoryMappings);
            expect(result).toEqual(['caas:products/photoshop']);
        });

        test('should expand group filter to child filters', () => {
            const activeFilterIds = ['caas:products/creative-cloud'];
            const categoryMappings = {
                'caas:products/creative-cloud': {
                    label: 'Creative Cloud',
                    items: ['caas:products/photoshop', 'caas:products/illustrator', 'caas:products/indesign'],
                },
            };
            const result = expandGroupFiltersToChildren(activeFilterIds, categoryMappings);
            expect(result).toEqual(['caas:products/photoshop', 'caas:products/illustrator', 'caas:products/indesign']);
        });

        test('should expand multiple group filters', () => {
            const activeFilterIds = ['caas:products/creative-cloud', 'caas:products/document-cloud'];
            const categoryMappings = {
                'caas:products/creative-cloud': {
                    label: 'Creative Cloud',
                    items: ['caas:products/photoshop', 'caas:products/illustrator'],
                },
                'caas:products/document-cloud': {
                    label: 'Document Cloud',
                    items: ['caas:products/acrobat', 'caas:products/sign'],
                },
            };
            const result = expandGroupFiltersToChildren(activeFilterIds, categoryMappings);
            expect(result).toEqual([
                'caas:products/photoshop',
                'caas:products/illustrator',
                'caas:products/acrobat',
                'caas:products/sign',
            ]);
        });

        test('should keep non-group filters unchanged', () => {
            const activeFilterIds = ['caas:products/photoshop', 'caas:products/creative-cloud'];
            const categoryMappings = {
                'caas:products/creative-cloud': {
                    label: 'Creative Cloud',
                    items: ['caas:products/illustrator', 'caas:products/indesign'],
                },
            };
            const result = expandGroupFiltersToChildren(activeFilterIds, categoryMappings);
            expect(result).toEqual([
                'caas:products/photoshop',
                'caas:products/illustrator',
                'caas:products/indesign',
            ]);
        });

        test('should handle mix of group and non-group filters', () => {
            const activeFilterIds = [
                'adobe-com-enterprise:topic/digital-trends',
                'caas:products/creative-cloud',
                'caas:products/workfront',
            ];
            const categoryMappings = {
                'caas:products/creative-cloud': {
                    label: 'Creative Cloud',
                    items: ['caas:products/photoshop', 'caas:products/illustrator'],
                },
            };
            const result = expandGroupFiltersToChildren(activeFilterIds, categoryMappings);
            expect(result).toEqual([
                'adobe-com-enterprise:topic/digital-trends',
                'caas:products/photoshop',
                'caas:products/illustrator',
                'caas:products/workfront',
            ]);
        });
    });
    describe('transformFiltersWithCategories', () => {
        test('should return unchanged filters when no categoryMappings provided', () => {
            const authoredFilters = [
                {
                    id: 'caas:products',
                    group: 'Products',
                    items: [
                        { id: 'caas:products/photoshop', label: 'Photoshop' },
                        { id: 'caas:products/illustrator', label: 'Illustrator' },
                    ],
                },
            ];
            const result = transformFiltersWithCategories(authoredFilters);
            expect(result).toEqual(authoredFilters);
        });

        test('should return unchanged filters when categoryMappings is empty', () => {
            const authoredFilters = [
                {
                    id: 'caas:products',
                    group: 'Products',
                    items: [
                        { id: 'caas:products/photoshop', label: 'Photoshop' },
                    ],
                },
            ];
            const result = transformFiltersWithCategories(authoredFilters, {});
            expect(result).toEqual(authoredFilters);
        });

        test('should group items into categories', () => {
            const authoredFilters = [
                {
                    id: 'caas:products',
                    group: 'Products',
                    items: [
                        { id: 'caas:products/photoshop', label: 'Photoshop' },
                        { id: 'caas:products/illustrator', label: 'Illustrator' },
                    ],
                },
            ];
            const categoryMappings = {
                'caas:products/creative-cloud': {
                    label: 'Creative Cloud',
                    items: ['caas:products/photoshop', 'caas:products/illustrator'],
                },
            };
            const result = transformFiltersWithCategories(authoredFilters, categoryMappings);

            expect(result).toHaveLength(1);
            expect(result[0].items).toHaveLength(1);
            expect(result[0].items[0]).toMatchObject({
                id: 'caas:products/creative-cloud',
                label: 'Creative Cloud',
                isCategory: true,
                opened: false,
            });
            expect(result[0].items[0].items).toHaveLength(2);
        });

        test('should handle mix of categorized and uncategorized items', () => {
            const authoredFilters = [
                {
                    id: 'caas:products',
                    group: 'Products',
                    items: [
                        { id: 'caas:products/photoshop', label: 'Photoshop' },
                        { id: 'caas:products/illustrator', label: 'Illustrator' },
                        { id: 'caas:products/workfront', label: 'Workfront' },
                    ],
                },
            ];
            const categoryMappings = {
                'caas:products/creative-cloud': {
                    label: 'Creative Cloud',
                    items: ['caas:products/photoshop', 'caas:products/illustrator'],
                },
            };
            const result = transformFiltersWithCategories(authoredFilters, categoryMappings);

            expect(result[0].items).toHaveLength(2);
            expect(result[0].items[0].isCategory).toBe(true);
            expect(result[0].items[1].id).toBe('caas:products/workfront');
        });

        test('should handle multiple categories', () => {
            const authoredFilters = [
                {
                    id: 'caas:products',
                    group: 'Products',
                    items: [
                        { id: 'caas:products/photoshop', label: 'Photoshop' },
                        { id: 'caas:products/acrobat', label: 'Acrobat' },
                    ],
                },
            ];
            const categoryMappings = {
                'caas:products/creative-cloud': {
                    label: 'Creative Cloud',
                    items: ['caas:products/photoshop'],
                },
                'caas:products/document-cloud': {
                    label: 'Document Cloud',
                    items: ['caas:products/acrobat'],
                },
            };
            const result = transformFiltersWithCategories(authoredFilters, categoryMappings);

            expect(result[0].items).toHaveLength(2);
            expect(result[0].items[0].label).toBe('Creative Cloud');
            expect(result[0].items[1].label).toBe('Document Cloud');
        });

        test('should preserve filter properties', () => {
            const authoredFilters = [
                {
                    id: 'caas:products',
                    group: 'Products',
                    icon: 'some-icon',
                    items: [
                        { id: 'caas:products/photoshop', label: 'Photoshop' },
                    ],
                },
            ];
            const categoryMappings = {
                'caas:products/creative-cloud': {
                    label: 'Creative Cloud',
                    items: ['caas:products/photoshop'],
                },
            };
            const result = transformFiltersWithCategories(authoredFilters, categoryMappings);

            expect(result[0].id).toBe('caas:products');
            expect(result[0].group).toBe('Products');
            expect(result[0].icon).toBe('some-icon');
        });
    });

    describe('transformFiltersWithCategories with hashed IDs (post-hash scenario)', () => {
        test('should group items when both filter IDs and categoryMappings are hashed', () => {
            // Simulates what Container does AFTER hashing:
            // Filter item IDs are hashed AND categoryMappings keys/items are hashed
            // Pre-computed hashes: caas:products -> 4x24, photoshop -> l1s1, illustrator -> l3zk,
            // creative-cloud -> egtb, acrobat -> 82so
            const hashedFilters = [
                {
                    group: 'Products',
                    id: '4x24',
                    items: [
                        { label: 'Photoshop', id: '4x24/l1s1' },
                        { label: 'Illustrator', id: '4x24/l3zk' },
                        { label: 'Acrobat', id: '4x24/82so' },
                    ],
                },
            ];
            const hashedCategoryMappings = {
                '4x24/egtb': {
                    label: 'Creative Cloud',
                    items: ['4x24/l1s1', '4x24/l3zk'],
                },
            };
            const result = transformFiltersWithCategories(hashedFilters, hashedCategoryMappings);
            // Creative Cloud category should be created with Photoshop and Illustrator nested
            expect(result[0].items[0].isCategory).toBe(true);
            expect(result[0].items[0].label).toBe('Creative Cloud');
            expect(result[0].items[0].id).toBe('4x24/egtb');
            expect(result[0].items[0].items).toHaveLength(2);
            expect(result[0].items[0].items[0].label).toBe('Photoshop');
            expect(result[0].items[0].items[1].label).toBe('Illustrator');
            // Acrobat should remain flat
            expect(result[0].items[1].label).toBe('Acrobat');
            expect(result[0].items[1].isCategory).toBeUndefined();
        });

        test('should fail to group when filter IDs are hashed but categoryMappings are raw (the bug)', () => {
            // This test documents what happens WITHOUT the fix:
            // Filter IDs are hashed but categoryMappings remain raw → no grouping
            const hashedFilters = [
                {
                    group: 'Products',
                    id: '4x24',
                    items: [
                        { label: 'Photoshop', id: '4x24/l1s1' },
                        { label: 'Illustrator', id: '4x24/l3zk' },
                        { label: 'Acrobat', id: '4x24/82so' },
                    ],
                },
            ];
            const rawCategoryMappings = {
                'caas:products/creative-cloud': {
                    label: 'Creative Cloud',
                    items: ['caas:products/photoshop', 'caas:products/illustrator'],
                },
            };
            const result = transformFiltersWithCategories(hashedFilters, rawCategoryMappings);
            // With raw mappings + hashed IDs, no items match → all remain flat (the bug)
            expect(result[0].items.every(i => !i.isCategory)).toBe(true);
            expect(result[0].items).toHaveLength(3);
        });
    });

    describe('getActiveFilterIds with nested category items', () => {
        test('should return category ID when category is selected (not its children)', () => {
            const filters = [
                {
                    id: 'caas:products',
                    items: [
                        {
                            id: 'caas:products/creative-cloud',
                            isCategory: true,
                            selected: true,
                            items: [
                                { id: 'caas:products/photoshop', selected: false },
                                { id: 'caas:products/illustrator', selected: false },
                            ],
                        },
                    ],
                },
            ];
            const result = getActiveFilterIds(filters);
            expect(result).toEqual(['caas:products/creative-cloud']);
        });

        test('should return nested child IDs when children are selected but category is not', () => {
            const filters = [
                {
                    id: 'caas:products',
                    items: [
                        {
                            id: 'caas:products/creative-cloud',
                            isCategory: true,
                            selected: false,
                            items: [
                                { id: 'caas:products/photoshop', selected: true },
                                { id: 'caas:products/illustrator', selected: false },
                            ],
                        },
                    ],
                },
            ];
            const result = getActiveFilterIds(filters);
            expect(result).toEqual(['caas:products/photoshop']);
        });

        test('should return mixed results from categories and flat items', () => {
            const filters = [
                {
                    id: 'caas:products',
                    items: [
                        {
                            id: 'caas:products/creative-cloud',
                            isCategory: true,
                            selected: false,
                            items: [
                                { id: 'caas:products/photoshop', selected: true },
                                { id: 'caas:products/illustrator', selected: true },
                            ],
                        },
                        {
                            id: 'caas:products/workfront',
                            selected: true,
                        },
                    ],
                },
            ];
            const result = getActiveFilterIds(filters);
            expect(result).toEqual([
                'caas:products/photoshop',
                'caas:products/illustrator',
                'caas:products/workfront',
            ]);
        });

        test('should return empty array when no items are selected (nested or flat)', () => {
            const filters = [
                {
                    id: 'caas:products',
                    items: [
                        {
                            id: 'caas:products/creative-cloud',
                            isCategory: true,
                            selected: false,
                            items: [
                                { id: 'caas:products/photoshop', selected: false },
                            ],
                        },
                        {
                            id: 'caas:products/acrobat',
                            selected: false,
                        },
                    ],
                },
            ];
            const result = getActiveFilterIds(filters);
            expect(result).toEqual([]);
        });
    });
    describe('getGroupedFilterSelections', () => {
        test('should return single-element arrays when no categoryMappings', () => {
            const activeFilterIds = ['caas:products/photoshop', 'caas:products/illustrator'];
            const result = getGroupedFilterSelections(activeFilterIds);
            expect(result).toEqual([
                ['caas:products/photoshop'],
                ['caas:products/illustrator'],
            ]);
        });

        test('should return single-element arrays when categoryMappings is empty', () => {
            const activeFilterIds = ['caas:products/photoshop'];
            const result = getGroupedFilterSelections(activeFilterIds, {});
            expect(result).toEqual([['caas:products/photoshop']]);
        });

        test('should expand category to group of children', () => {
            const activeFilterIds = ['caas:products/creative-cloud'];
            const categoryMappings = {
                'caas:products/creative-cloud': {
                    label: 'Creative Cloud',
                    items: ['caas:products/photoshop', 'caas:products/illustrator'],
                },
            };
            const result = getGroupedFilterSelections(activeFilterIds, categoryMappings);
            expect(result).toEqual([
                ['caas:products/photoshop', 'caas:products/illustrator'],
            ]);
        });

        test('should keep non-category items as single-element groups', () => {
            const activeFilterIds = ['caas:products/photoshop', 'caas:products/creative-cloud'];
            const categoryMappings = {
                'caas:products/creative-cloud': {
                    label: 'Creative Cloud',
                    items: ['caas:products/illustrator', 'caas:products/indesign'],
                },
            };
            const result = getGroupedFilterSelections(activeFilterIds, categoryMappings);
            expect(result).toEqual([
                ['caas:products/photoshop'],
                ['caas:products/illustrator', 'caas:products/indesign'],
            ]);
        });

        test('should handle multiple categories', () => {
            const activeFilterIds = ['caas:products/creative-cloud', 'caas:products/document-cloud'];
            const categoryMappings = {
                'caas:products/creative-cloud': {
                    label: 'Creative Cloud',
                    items: ['caas:products/photoshop', 'caas:products/illustrator'],
                },
                'caas:products/document-cloud': {
                    label: 'Document Cloud',
                    items: ['caas:products/acrobat', 'caas:products/sign'],
                },
            };
            const result = getGroupedFilterSelections(activeFilterIds, categoryMappings);
            expect(result).toEqual([
                ['caas:products/photoshop', 'caas:products/illustrator'],
                ['caas:products/acrobat', 'caas:products/sign'],
            ]);
        });
    });
    describe('getFilteredCards with filterGroups (AND + categories)', () => {
        const FILTER_TYPES = { AND: 'and', OR: 'or', XOR: 'xor' };

        test('AND + category expansion: should match cards with ANY child in the group', () => {
            const cards = [
                { id: 1, tags: [{ id: 'caas:products/photoshop' }] },
                { id: 2, tags: [{ id: 'caas:products/illustrator' }] },
                { id: 3, tags: [{ id: 'caas:products/acrobat' }] },
            ];
            const activeFilters = ['caas:products/photoshop', 'caas:products/illustrator'];
            const activePanels = new Set(['caas:products']);
            const filterGroups = [
                ['caas:products/photoshop', 'caas:products/illustrator'],
            ];

            const result = getFilteredCards(
                cards, activeFilters, activePanels, 'and', FILTER_TYPES, null, filterGroups,
            );
            // Both PS and AI cards match because the group uses OR within
            expect(result).toEqual([
                { id: 1, tags: [{ id: 'caas:products/photoshop' }] },
                { id: 2, tags: [{ id: 'caas:products/illustrator' }] },
            ]);
        });

        test('AND + category expansion: without filterGroups falls back to isSuperset', () => {
            const cards = [
                { id: 1, tags: [{ id: 'caas:products/photoshop' }, { id: 'caas:products/illustrator' }] },
                { id: 2, tags: [{ id: 'caas:products/photoshop' }] },
            ];
            const activeFilters = ['caas:products/photoshop', 'caas:products/illustrator'];
            const activePanels = new Set(['caas:products']);

            const result = getFilteredCards(
                cards, activeFilters, activePanels, 'and', FILTER_TYPES, null,
            );
            // Without filterGroups, AND requires ALL (isSuperset) - only card 1 has both
            expect(result).toEqual([
                { id: 1, tags: [{ id: 'caas:products/photoshop' }, { id: 'caas:products/illustrator' }] },
            ]);
        });

        test('AND + two categories: card must match at least one from EACH group', () => {
            const cards = [
                { id: 1, tags: [{ id: 'caas:products/photoshop' }, { id: 'caas:products/acrobat' }] },
                { id: 2, tags: [{ id: 'caas:products/photoshop' }] },
                { id: 3, tags: [{ id: 'caas:products/acrobat' }] },
            ];
            const activeFilters = [
                'caas:products/photoshop', 'caas:products/illustrator',
                'caas:products/acrobat', 'caas:products/sign',
            ];
            const activePanels = new Set(['caas:products']);
            // Two groups: Creative Cloud [PS, AI] and Document Cloud [Acrobat, Sign]
            const filterGroups = [
                ['caas:products/photoshop', 'caas:products/illustrator'],
                ['caas:products/acrobat', 'caas:products/sign'],
            ];

            const result = getFilteredCards(
                cards, activeFilters, activePanels, 'and', FILTER_TYPES, null, filterGroups,
            );
            // Only card 1 matches both groups (PS from CC, Acrobat from DC)
            expect(result).toEqual([
                { id: 1, tags: [{ id: 'caas:products/photoshop' }, { id: 'caas:products/acrobat' }] },
            ]);
        });

        test('AND + category + individual: card must match group AND individual item', () => {
            const cards = [
                { id: 1, tags: [{ id: 'caas:products/photoshop' }, { id: 'caas:products/workfront' }] },
                { id: 2, tags: [{ id: 'caas:products/photoshop' }] },
                { id: 3, tags: [{ id: 'caas:products/workfront' }] },
            ];
            const activeFilters = [
                'caas:products/photoshop', 'caas:products/illustrator',
                'caas:products/workfront',
            ];
            const activePanels = new Set(['caas:products']);
            // CC category group + individual Workfront selection
            const filterGroups = [
                ['caas:products/photoshop', 'caas:products/illustrator'],
                ['caas:products/workfront'],
            ];

            const result = getFilteredCards(
                cards, activeFilters, activePanels, 'and', FILTER_TYPES, null, filterGroups,
            );
            // Only card 1 matches CC (has PS) AND Workfront
            expect(result).toEqual([
                { id: 1, tags: [{ id: 'caas:products/photoshop' }, { id: 'caas:products/workfront' }] },
            ]);
        });

        test('XOR + category expansion: should also use group-aware logic', () => {
            const cards = [
                { id: 1, tags: [{ id: 'caas:products/photoshop' }] },
                { id: 2, tags: [{ id: 'caas:products/acrobat' }] },
            ];
            const activeFilters = ['caas:products/photoshop', 'caas:products/illustrator'];
            const activePanels = new Set(['caas:products']);
            const filterGroups = [
                ['caas:products/photoshop', 'caas:products/illustrator'],
            ];

            const result = getFilteredCards(
                cards, activeFilters, activePanels, 'xor', FILTER_TYPES, null, filterGroups,
            );
            expect(result).toEqual([
                { id: 1, tags: [{ id: 'caas:products/photoshop' }] },
            ]);
        });
    });
});
