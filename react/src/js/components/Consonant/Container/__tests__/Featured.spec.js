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
import jestMocks from '../../Testing/Utils/JestMocks';
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
jestMocks.lana();

describe('Container Component - Additional Test cases', () => {
    beforeEach(() => {
        setupIntersectionObserverMock();
    });

    test('should render with filterPanelEnabled set to true', async () => {
        const configToUse = { ...config, filterPanel: { ...config.filterPanel, enabled: true } };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    test('should render with filterPanelType set to top', async () => {
        const configToUse = { ...config, filterPanel: { ...config.filterPanel, type: 'top' } };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    test('should render with paginationType set to loadMore', async () => {
        const configToUse = { ...config, pagination: { ...config.pagination, type: 'loadMore' } };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    // test('should render with paginationIsEnabled set to true', async () => {
    //     const configToUse = { ...config, pagination: { ...config.pagination, enabled: true } };
    //     await act(async () => render(<Container config={configToUse} />));
    //     await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    // });

    test('should render with resultsPerPage set to 10', async () => {
        const configToUse = { ...config, collection: { ...config.collection, resultsPerPage: 10 } };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    test('should render with authoredFilters', async () => {
        const configToUse = {
            ...config,
            filterPanel: {
                ...config.filterPanel,
                filters: [
                    {
                        group: 'Category Group',
                        id: 'caas:product-categories:category-1',
                        title: 'Category 1',
                        icon: 'https://www.somedomain.com/category-icon-1.svg',
                        items: [{ name: 'item1' }, { name: 'item2' }],
                    },
                    {
                        group: 'Category Group',
                        id: 'caas:product-categories:category-2',
                        title: 'Category 2',
                        icon: 'https://www.somedomain.com/category-icon-2.svg',
                        items: [{ name: 'item3' }, { name: 'item4' }],
                    },
                ],
            },
        };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    test('should render with filterLogic set to and', async () => {
        const configToUse = { ...config, filterPanel: { ...config.filterPanel, filterLogic: 'and' } };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    test('should render with totalCardLimit set to 50', async () => {
        const configToUse = {
            ...config,
            collection: {
                ...config.collection,
                totalCardsToShow: 50,
            },
        };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    test('should render with sampleSize set to 20', async () => {
        const configToUse = {
            ...config,
            collection: {
                ...config.collection,
                reservoir: {
                    sample: 20,
                },
            },
        };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    test('should render with reservoirSize set to 100', async () => {
        const configToUse = {
            ...config,
            collection: {
                ...config.collection,
                reservoir: {
                    pool: 100,
                },
            },
        };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    test('should render with searchFields', async () => {
        const configToUse = { ...config, search: { ...config.search, searchFields: ['title', 'description'] } };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    test('should render with sortOptions', async () => {
        const configToUse = { ...config, sort: { ...config.sort, options: [{ sort: 'dateasc', label: 'Date Ascending' }] } };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    test('should render with defaultSort set to dateasc', async () => {
        const configToUse = { ...config, sort: { ...config.sort, defaultSort: 'dateasc' } };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    test('should render with featuredCards', async () => {
        const configToUse = { ...config, featuredCards: ['card1', 'card2'] };
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
    });

    test('should handle sort popup open', async () => {
        const configToUse = config;
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-Select-btn'));
        const selectButton = screen.getByTestId('consonant-Select-btn');
        fireEvent.click(selectButton);
    });

    // test('should handle pagination change', async () => {
    //     const configToUse = {
    //         ...config,
    //         pagination: {
    //             ...config.pagination,
    //             type: 'pagination',
    //             enabled: true,
    //         },
    //     };
    //     await act(async () => render(<Container config={configToUse} />));
    //     const nextButton = await screen.findByTestId('consonant-Pagination-btn--next');
    //     expect(nextButton).toBeNull();
    // });
    test('should handle pagination changes', async () => {
        const configToUse = {
            ...config,
            pagination: {
                ...config.pagination,
                enabled: true,
                type: 'paginator',
            },
        };
        await act(async () => render(<Container config={configToUse} />));
        const nextButton = await screen.findByTestId('consonant-Pagination-btn--next');
        fireEvent.click(nextButton);
    });
});
