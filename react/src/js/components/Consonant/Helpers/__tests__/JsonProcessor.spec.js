import PROPS from '../TestingConstants/JsonProcessor';

import JsonProcessor from '../JsonProcessor';

describe('utils/JsonProcessor', () => {
    describe('addCardMetaData', () => {
        PROPS.addCardMetaData.forEach(({
            cards, truncateTextQty, onlyShowBookmarks, bookmarkedCardIds, hideCtaIds, expectedValue,
        }) => {
            test('should add card metadata', () => {
                const jsonProcessor = new JsonProcessor(cards);

                const { processedCards } = jsonProcessor.addCardMetaData(
                    truncateTextQty,
                    onlyShowBookmarks,
                    bookmarkedCardIds,
                    hideCtaIds,
                );

                expect(processedCards).toEqual(expectedValue);
            });
        });
    });
    describe('addFeaturedCards', () => {
        PROPS.addFeaturedCards.forEach(({ cards, featuredCards, expectedValue }) => {
            test('should merge processed cards and featured cards', () => {
                const jsonProcessor = new JsonProcessor(cards);

                const { processedCards } = jsonProcessor.addFeaturedCards(featuredCards);

                expect(processedCards).toEqual(expectedValue);
            });
        });
    });
    describe('removeDuplicateCards', () => {
        PROPS.removeDuplicateCards.forEach(({ cards, expectedValue }) => {
            test('should return array with unique elements', () => {
                const jsonProcessor = new JsonProcessor(cards);

                const { processedCards } = jsonProcessor.removeDuplicateCards();

                expect(processedCards).toEqual(expectedValue);
            });
        });
    });
});
