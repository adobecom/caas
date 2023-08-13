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

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: 'ok',
        status: 200,
        statusText: 'success',
        url: 'test.html',
        json: () => Promise.resolve({ cards }),
    }));

beforeEach(() => {
    window.digitalData = {};
});

setupIntersectionObserverMock();

describe('Consonant/Container/Bookmarks', () => {
    test('should be able to save cards to bookmarks', async () => {
        const { resultsPerPage } = config.collection;
        const configToUse = config;
        configToUse.collection.cardStyle = 'one-half';

        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        const [bookmarkButton] = screen.queryAllByTestId('consonant-BookmarkInfobit');

        expect(screen.queryAllByTestId('consonant-Card')).toHaveLength(resultsPerPage);

        const [saveBookmarkButton] = screen.queryAllByTestId('consonant-BookmarkInfobit');

        expect(saveBookmarkButton).toBeDefined();

        fireEvent.click(saveBookmarkButton);
        fireEvent.click(bookmarkButton);

        expect(screen.queryAllByTestId('consonant-Card')).toHaveLength(10);

        fireEvent.click(bookmarkButton);

        expect(screen.queryAllByTestId('consonant-Card')).toHaveLength(resultsPerPage);

        const [unsaveBookmarkButton] = screen.queryAllByTestId('consonant-BookmarkInfobit');

        expect(unsaveBookmarkButton).toBeDefined();

        fireEvent.click(unsaveBookmarkButton);
        fireEvent.click(bookmarkButton);

        expect(screen.queryAllByTestId('consonant-Card')).toHaveLength(10);

        fireEvent.click(bookmarkButton);

        expect(screen.queryAllByTestId('consonant-Card')).toHaveLength(resultsPerPage);
    });

    test('Should not show bookmarked cards if a user did not save any cards', async () => {
        const configToUse = config;
        configToUse.collection.cardStyle = 'one-half';

        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        const bookmarksItemsBadge = screen.getByTestId('consonant-Bookmarks-itemBadge');
        expect(bookmarksItemsBadge.innerHTML).toEqual('0');

        const [bookmarksFilter] = screen.queryAllByTestId('consonant-Bookmarks');

        fireEvent.click(bookmarksFilter);
        expect(screen.queryAllByTestId('consonant-card')).toHaveLength(0);
    });
});
