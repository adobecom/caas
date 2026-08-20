const today = new Date();
const tomorrow = new Date(today);
const yesterday = new Date(today);

tomorrow.setDate(tomorrow.getDate() + 1);
yesterday.setDate(yesterday.getDate() - 1);

const card1 = {
    id: 1,
    showCard: { from: yesterday, until: tomorrow },
};
const card2 = {
    id: 2,
    showCard: { from: tomorrow, until: yesterday },
};
const card3 = {
    id: 3,
    showCard: { from: yesterday, until: tomorrow },
};
const card4 = {
    id: 4,
    showCard: { from: tomorrow, until: yesterday },
};
const card5 = {
    id: 5,
    showCard: { from: tomorrow },
};
const card6 = {
    id: 6,
    showCard: { until: yesterday },
};

const cards = [card1, card2, card3, card4, card5, card6];

const getCardDate = [
    {
        date: today,
        expectedValue: today.getTime(),
    },
];

const filterCardsByDateRange = [
    {
        cards,
        expectedValue: [card1, card3, card5, card6],
    },
];

export default {
    getCardDate,
    filterCardsByDateRange,
};
