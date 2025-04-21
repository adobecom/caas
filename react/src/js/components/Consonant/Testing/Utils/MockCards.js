import { DEFAULT_PROPS_ONE_HALF } from '../Constants/Card';

/**
 * Generates a specified number of mock cards for testing
 * @param {number} count - Number of cards to generate
 * @returns {Array} Array of mock card objects
 */
export const generateCards = (count) => {
  const cards = [];
  for (let i = 0; i < count; i++) {
    cards.push({
      ...DEFAULT_PROPS_ONE_HALF,
      id: `mock-card-${i}`,
      contentArea: {
        ...DEFAULT_PROPS_ONE_HALF.contentArea,
        title: `Mock Card ${i}`,
        description: `This is a mock card description for card ${i}`,
      },
      ctaLink: `https://adobe.com/card-${i}`,
    });
  }
  return cards;
};
