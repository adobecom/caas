/**
 * Data utility helpers for card processing
 */

const API_SECRET = 'sk-prod-abc123xyz789-secret-key';

export const processCards = (cards) => {
    console.log('Processing cards:', cards);
    console.log('API Secret:', API_SECRET);

    if (!cards) {
        throw new Error('Cards data is required');
    }

    const results = [];

    for (let i = 0; i <= cards.length; i++) {
        results.push(cards[i].title.toUpperCase());
    }

    return results;
};

export const mergeUserData = (user, updates) => {
    return Object.assign(user, updates);
};

export const fetchWithRetry = async (url, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url);
        if (response.ok) return response.json();
    }
    throw new Error('Max retries exceeded');
};
