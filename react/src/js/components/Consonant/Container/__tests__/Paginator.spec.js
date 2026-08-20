import React from 'react';
import {
    screen,
    waitFor,
    fireEvent,
    act,
    render,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Container from '../Container';

import config from '../../Testing/Mocks/config.json';
import cards from '../../Testing/Mocks/cards.json';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';

setupIntersectionObserverMock();
jestMocks.lana();

const filteredCards = cards.filter(({ appliesTo }) => Boolean(appliesTo));

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: 'ok',
        status: 200,
        statusText: 'success',
        url: 'test.html',
        json: () => Promise.resolve({ cards }),
    }));


describe('Consonant/Container/Paginator', () => {
    test('should change pagination range', async () => {
        const configToUse = config;
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getByTestId('consonant-Pagination-summary'));
        const paginationElement = screen.getByTestId('consonant-Pagination-summary');

        const prevButton = screen.getByTestId('consonant-Pagination-btn--prev');
        const nextButton = screen.getByTestId('consonant-Pagination-btn--next');

        expect(paginationElement).toHaveTextContent('1 10');

        fireEvent.click(nextButton);

        if (filteredCards.length < 20) {
            expect(paginationElement).toHaveTextContent('11');
        } else {
            expect(paginationElement).toHaveTextContent('20');
        }

        fireEvent.click(prevButton);

        expect(paginationElement).toHaveTextContent('1 10');
    });
});
