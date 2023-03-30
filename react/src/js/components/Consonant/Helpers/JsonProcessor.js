import {
    getByPath,
    truncateString,
    removeDuplicatesByKey,
} from './general';

/**
 * Class that handles parsing raw JSON data and returning a set of processed cards
 * that can be used within a card collection.
 *
 * @export
 * @class JsonProcessor
 */
export default class JsonProcessor {
    /**
     * Creates an instance of JsonProcessor.
     * @param {*} cardsToProcess
     * @memberof JsonProcessor
     */
    constructor(cardsToProcess) {
        this.processedCards = cardsToProcess;
    }
    /**
     * This method handles removing duplicate cards for the following cases:
     *
     * (1) API Repsonse contains duplicate cards
     * (2) Authored Featured Cards contains duplicate cards
     * (3) Duplicates between API responese and authored feature cards
     *
     * @return {*}
     * @memberof JsonProcessor
     */
    removeDuplicateCards() {
        this.processedCards = removeDuplicatesByKey(this.processedCards, 'id');
        return this;
    }

    /**
     * This method joins authored featured caards with cards returned from API responsee
     *
     * @param {*} featuredCards
     * @return {*}
     * @memberof JsonProcessor
     */
    addFeaturedCards(featuredCards) {
        const someFeaturedCards = featuredCards.map(card => ({
            ...card,
            isFeatured: true,
        }));
        this.processedCards = someFeaturedCards.concat(this.processedCards);
        return this;
    }
    /**
     * This method adds necessary card metadata to cards such as:
     * (1) Whether a card should be bookmarked or not
     * (2) Initial Fields Before Pre-Processing occurs
     * (3) Whether cards should behave as if they are in a Bookmark Only Collection
     *
     * @param {*} truncateTextQty
     * @param {*} onlyShowBookmarks
     * @param {*} bookmarkedCardIds
     * @param {*} hideCtaIds
     * @return {*}
     * @memberof JsonProcessor
     */
    addCardMetaData(truncateTextQty, onlyShowBookmarks, bookmarkedCardIds, hideCtaIds) {
        this.processedCards = this.processedCards.map(card => ({
            ...card,
            description: truncateString(getByPath(card, 'contentArea.description', ''), truncateTextQty),
            isBookmarked: bookmarkedCardIds.some(i => i === card.id),
            disableBookmarkIco: onlyShowBookmarks,
            hideCtaId: hideCtaIds.some(i => i === card.id),
            initial: {
                title: getByPath(card, 'contentArea.title', ''),
                description: getByPath(card, 'contentArea.description', ''),
                bannerText: getByPath(card, 'overlays.banner.description', ''),
                dateDetailText: getByPath(card, 'contentArea.dateTetailText', ''),
                detailText: getByPath(card, 'contentArea.detailText', ''),
            },
        }));
        return this;
    }
}
