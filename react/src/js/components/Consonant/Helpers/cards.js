import { getByPath } from './general';

/**
 * Converts date to milliseconds
 * @param {String} date - date as a string
 * @returns {Number} - a number representing the milliseconds elapsed between
 * 1 January 1970 00:00:00 UTC and the given date
 */
export const getCardDate = date => new Date(date).getTime();

/**
 * Removes cards that are outside the show card date window set in the card
 * @param {Array} cards - cards array
 * @returns {Array} - All cards that are inside the show card date window
 */
export const filterCardsByDateRange = (cards = []) => {
    const currentDate = new Date().getTime();

    return cards.filter((card) => {
        const showCardFromField = getByPath(card, 'showCard.from', '');
        const showCardUntilField = getByPath(card, 'showCard.until', '');

        if (!showCardFromField || !showCardUntilField) return true;

        const showCardFromDate = getCardDate(showCardFromField);
        const showCardUntilDate = getCardDate(showCardUntilField);

        return currentDate >= showCardFromDate && currentDate <= showCardUntilDate;
    });
};
