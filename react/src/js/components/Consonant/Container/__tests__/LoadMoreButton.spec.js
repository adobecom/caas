import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    screen,
    waitFor,
    fireEvent,
    getByText,
    getByTestId,
    act,
    render,
} from '@testing-library/react';

import Container from '../Container';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';
import config from '../../Testing/Mocks/config.json';
import cards from '../../Testing/Mocks/cards.json';

window.scrollTo = () => { };


global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: 'ok',
        status: 200,
        statusText: 'success',
        url: 'test.html',
        json: () => Promise.resolve({ cards }),
    }));

setupIntersectionObserverMock();
jestMocks.lana();

describe('Consonant/Container/Load More Button', () => {
    test('should be able to render the load more button', async () => {
        const configToUse = config;
        config.pagination.type = 'loadMore';
        await act(async () => render(<Container config={configToUse} />));

        // Need wait for api response and state updating
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        // find the LoadMore button
        const loadMoreElement = screen.queryByTestId('consonant-LoadMore');

        expect(loadMoreElement).not.toBeNull();
    });

    test('should be able to show all cards', async () => {
        const configToUse = config;
        window.digitalData = {};
        config.pagination.type = 'loadMore';
        await act(async () => render(<Container config={configToUse} />));

        const { btnText } = config.pagination.i18n.loadMore;
        const { resultsPerPage } = config.collection;

        const allCardsCount = cards.length;

        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        const loadMoreElement = screen.queryByTestId('consonant-LoadMore');

        const loadMoreButton = getByText(loadMoreElement, btnText);
        const loadMoreText = getByTestId(loadMoreElement, 'consonant-LoadMore-text');

        expect(loadMoreText).toHaveTextContent(`${resultsPerPage} ${allCardsCount}`);

        fireEvent.click(loadMoreButton);
        fireEvent.click(loadMoreButton);

        expect(loadMoreText).toHaveTextContent(`${allCardsCount} ${allCardsCount}`);
    });
});
