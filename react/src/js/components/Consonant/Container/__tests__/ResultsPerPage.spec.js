import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    screen,
    waitFor,
    act,
    render,
} from '@testing-library/react';

import Container from '../Container';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import config from '../../Testing/Mocks/config.json';
import cards from '../../Testing/Mocks/cards.json';

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: 'ok',
        status: 200,
        statusText: 'success',
        url: 'test.html',
        json: () => Promise.resolve({ cards }),
    }));

setupIntersectionObserverMock();

describe('Consonant/Container/Results Per Page', () => {
    test('should render default count of cards if incorrectly authored', async () => {
        const configToUse = config;
        configToUse.collection.resultsPerPage = null;

        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        expect(screen.queryAllByTestId('consonant-Card')).toHaveLength(9);
    });

    test('should render 1 card if authored to do so', async () => {
        const configToUse = config;
        configToUse.collection.resultsPerPage = 1;

        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        expect(screen.queryAllByTestId('consonant-Card')).toHaveLength(1);
    });

    test('should render all cards if limit > total cards count', async () => {
        const configToUse = config;
        configToUse.collection.resultsPerPage = 100;

        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        const allCards = cards.length;
        expect(screen.queryAllByTestId('consonant-Card')).toHaveLength(allCards);
    });
});
