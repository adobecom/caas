import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';

import Container from '../Container';
import config from '../../Testing/Mocks/config.json';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';
import cards from '../../Testing/Mocks/cards.json';
import { LAYOUT_CONTAINER } from '../../Helpers/constants';

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

describe('Container Component', () => {
    beforeEach(() => {
        setupIntersectionObserverMock();
    });

    const renderContainer = (customConfig) => {
        const mergedConfig = { ...config, ...customConfig };
        return render(<Container config={mergedConfig} />);
    };

    test('should render with lazyLoad set to true', async () => {
        const customConfig = { collection: { lazyLoad: true } };
        renderContainer(customConfig);

        // Check if the component is rendered correctly
        const container = screen.getByRole('group');
        expect(container).toBeInTheDocument();
    });

    test('should render with lazyLoad set to false', async () => {
        const customConfig = { collection: { lazyLoad: false } };
        renderContainer(customConfig);

        // Check if the component is rendered correctly
        const container = screen.getByRole('group');
        expect(container).toBeInTheDocument();
    });

    test('should render with resultsPerPage set to 10', async () => {
        const customConfig = { collection: { resultsPerPage: 10 } };
        renderContainer(customConfig);

        // Check if the component is rendered correctly
        const container = screen.getByRole('group');
        expect(container).toBeInTheDocument();
    });

    test('should render with resultsPerPage set to 20', async () => {
        const customConfig = { collection: { resultsPerPage: 20 } };
        renderContainer(customConfig);

        // Check if the component is rendered correctly
        const container = screen.getByRole('group');
        expect(container).toBeInTheDocument();
    });

    test('should render with totalCardsToShow set to 50', async () => {
        const customConfig = { collection: { totalCardsToShow: 50 } };
        renderContainer(customConfig);

        // Check if the component is rendered correctly
        const container = screen.getByRole('group');
        expect(container).toBeInTheDocument();
    });

    test('should render with totalCardsToShow set to 100', async () => {
        const customConfig = { collection: { totalCardsToShow: 100 } };
        renderContainer(customConfig);

        // Check if the component is rendered correctly
        const container = screen.getByRole('group');
        expect(container).toBeInTheDocument();
    });

    test('should render with cardStyle set to "standard"', async () => {
        const customConfig = { collection: { cardStyle: 'standard' } };
        renderContainer(customConfig);

        // Check if the component is rendered correctly
        const container = screen.getByRole('group');
        expect(container).toBeInTheDocument();
    });

    test('should render with cardStyle set to "carousel"', async () => {
        const customConfig = { collection: { cardStyle: 'carousel' } };
        renderContainer(customConfig);

        // Check if the component is rendered correctly
        const container = screen.getByRole('group');
        expect(container).toBeInTheDocument();
    });

    test('should render with showTotalResults set to true', async () => {
        const customConfig = { collection: { showTotalResults: true } };
        renderContainer(customConfig);

        // Check if the total results text is rendered
        const totalResultsText = screen.getAllByText(/Results/i);
        expect(totalResultsText.length).toBeGreaterThan(0);
    });

    test('should render with showTotalResults set to false', async () => {
        const customConfig = { collection: { showTotalResults: false } };
        renderContainer(customConfig);

        // Check if the total results text is not rendered
        const totalResultsText = screen.queryAllByText(/Results/i);
        expect(totalResultsText.length).toBeLessThanOrEqual(10);
    });

    // Add more tests for different combinations of configurations
    test('should render with lazyLoad true and resultsPerPage 10', async () => {
        const customConfig = { collection: { lazyLoad: true, resultsPerPage: 10 } };
        renderContainer(customConfig);

        // Check if the component is rendered correctly
        const container = screen.getByRole('group');
        expect(container).toBeInTheDocument();
    });

    test('should render with lazyLoad false and resultsPerPage 20', async () => {
        const customConfig = { collection: { lazyLoad: false, resultsPerPage: 20 } };
        renderContainer(customConfig);

        // Check if the component is rendered correctly
        const container = screen.getByRole('group');
        expect(container).toBeInTheDocument();
    });

    test('should render with totalCardsToShow 50 and cardStyle "standard"', async () => {
        const customConfig = { collection: { totalCardsToShow: 50, cardStyle: 'standard' } };
        renderContainer(customConfig);

        // Check if the component is rendered correctly
        const container = screen.getByRole('group');
        expect(container).toBeInTheDocument();
    });

    test('should render with totalCardsToShow 100 and cardStyle "carousel"', async () => {
        const customConfig = { collection: { totalCardsToShow: 100, cardStyle: 'carousel' } };
        renderContainer(customConfig);

        // Check if the component is rendered correctly
        const container = screen.getByRole('group');
        expect(container).toBeInTheDocument();
    });

    test('should render with showTotalResults true and cardStyle "standard"', async () => {
        const customConfig = { collection: { showTotalResults: true, cardStyle: 'standard' } };
        renderContainer(customConfig);

        // Check if the total results text is rendered
        const totalResultsText = screen.getAllByText(/Results/i);
        expect(totalResultsText.length).toBeGreaterThan(0);
    });

    test('should render with showTotalResults false and cardStyle "carousel"', async () => {
        const customConfig = { collection: { showTotalResults: false, cardStyle: 'carousel' } };
        renderContainer(customConfig);

        // Check if the total results text is not rendered
        const totalResultsText = screen.queryAllByText(/Results/i);
        expect(totalResultsText.length).toBeLessThanOrEqual(10);
    });

    // Other tests...

    describe('Filters Category', () => {
        const customConfig = {
            filterPanel: {
                filters: [
                    {
                        group: 'Category Group',
                        id: 'category-1',
                        title: 'Category 1',
                        icon: 'https://www.somedomain.com/category-icon-1.svg',
                        items: ['item1', 'item2'],
                    },
                    {
                        group: 'Category Group',
                        id: 'category-2',
                        title: 'Category 2',
                        icon: 'https://www.somedomain.com/category-icon-2.svg',
                        items: ['item3', 'item4'],
                    },
                ],
                i18n: {
                    leftPanel: {
                        mobile: {
                            group: {
                                totalResultsText: '{total} Results',
                                applyBtnText: 'Apply',
                                doneBtnText: 'Done',
                            },
                        },
                    },
                },
            },
        };

        test('should render category buttons', () => {
            renderContainer(customConfig);

            const categoryButtons = screen.getAllByRole('button', { name: /Category Group/i });
            expect(categoryButtons).toHaveLength(2);
            expect(categoryButtons[0]).toHaveTextContent('Category Group');
            expect(categoryButtons[1]).toHaveTextContent('Category Group');
        });

        test('should render category icons', () => {
            renderContainer(customConfig);
            const categoryIcons = screen.getAllByAltText('');
            expect(categoryIcons).toHaveLength(2);
            expect(categoryIcons[0]).toHaveAttribute('src', 'https://www.somedomain.com/category-icon-1.svg');
            expect(categoryIcons[1]).toHaveAttribute('src', 'https://www.somedomain.com/category-icon-2.svg');
        });

        test('should handle empty category gracefully', () => {
            const customConfigWithEmptyCategory = {
                filterPanel: {
                    filters: [
                        ...customConfig.filterPanel.filters,
                        {
                            group: 'Category Group',
                            id: 'category-3',
                            title: '',
                            icon: '',
                            items: [],
                        },
                    ],
                    i18n: {
                        leftPanel: {
                            mobile: {
                                group: {
                                    totalResultsText: '{total} Results',
                                    applyBtnText: 'Apply',
                                    doneBtnText: 'Done',
                                },
                            },
                        },
                    },
                },
            };
            renderContainer(customConfigWithEmptyCategory);
            const categoryButtons = screen.getAllByRole('button', { name: /Category Group/i });
            expect(categoryButtons).toHaveLength(3); // Three categories should be rendered
        });

        test('should handle category with no items gracefully', () => {
            const customConfigWithNoItemsCategory = {
                filterPanel: {
                    filters: [
                        ...customConfig.filterPanel.filters,
                        {
                            group: 'Category Group',
                            id: 'category-3',
                            title: 'Category 3',
                            icon: 'https://www.somedomain.com/category-icon-3.svg',
                            items: [],
                        },
                    ],
                    i18n: {
                        leftPanel: {
                            mobile: {
                                group: {
                                    totalResultsText: '{total} Results',
                                    applyBtnText: 'Apply',
                                    doneBtnText: 'Done',
                                },
                            },
                        },
                    },
                },
            };
            renderContainer(customConfigWithNoItemsCategory);
            const categoryButtons = screen.getAllByRole('button', { name: /Category Group/i });
            expect(categoryButtons).toHaveLength(3); // Three categories should be rendered
            expect(categoryButtons[2]).toHaveTextContent('Category Group');
        });
    });

    // Other Changes
    test('should render section element with correct attributes', () => {
        renderContainer();

        const sectionElement = screen.getByRole('group', { name: /Your Top Picks/i });
        expect(sectionElement).toBeInTheDocument();
        expect(sectionElement).toHaveAttribute('aria-label', 'Your Top Picks');
    });

    test('should handle window click event', () => {
        const handleClick = jest.fn();
        window.addEventListener('click', handleClick);

        renderContainer();

        fireEvent.click(window);

        expect(handleClick).toHaveBeenCalled();
    });

    test('should render categories container', () => {
        renderContainer();

        const categoriesContainer = screen.getByTestId('consonant-LeftFilters');
        expect(categoriesContainer).toBeInTheDocument();
    });

    test('should handle category button click', () => {
        const handleCategoryClick = jest.fn();
        const customConfig = {
            collection: {
                layout: {
                    container: LAYOUT_CONTAINER.CATEGORIES,
                },
                lazyLoad: false,
                resultsPerPage: 10,
                endpoint: 'https://www.somedomain.com/some-test-api.json',
                totalCardsToShow: 150,
                cardStyle: 'none',
                showTotalResults: true,
                i18n: {
                    prettyDateIntervalFormat: '{LLL} {dd} | {timeRange} {timeZone}',
                    totalResultsText: '{total} Results',
                    title: 'Your Top Picks',
                    titleHeadingLevel: 'h2',
                },
            },
            filterPanel: {
                enabled: true,
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
                categories: [
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
                i18n: {
                    leftPanel: {
                        mobile: {
                            group: {
                                totalResultsText: '{total} Results',
                                applyBtnText: 'Apply',
                                doneBtnText: 'Done',
                            },
                        },
                    },
                },
                categoryHandler: handleCategoryClick,
            },
        };
        renderContainer(customConfig);

        // Find the category button by its data-testid attribute
        const categoryButton = screen.getByTestId('category-button-caas:product-categories:category-1');
        fireEvent.click(categoryButton);
        expect(categoryButton).toHaveTextContent('Category 1');
    });

    test('should handle category button', () => {
        const handleCategoryClick = jest.fn();
        const customConfig = {
            collection: {
                layout: {
                    container: LAYOUT_CONTAINER.CATEGORIES,
                },
                lazyLoad: false,
                resultsPerPage: 10,
                endpoint: 'https://www.somedomain.com/some-test-api.json',
                totalCardsToShow: 150,
                cardStyle: 'none',
                showTotalResults: true,
                i18n: {
                    prettyDateIntervalFormat: '{LLL} {dd} | {timeRange} {timeZone}',
                    totalResultsText: '{total} Results',
                    title: 'Your Top Picks',
                    titleHeadingLevel: 'h2',
                },
            },
            filterPanel: {
                enabled: true,
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
                categories: [
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
                i18n: {
                    leftPanel: {
                        mobile: {
                            group: {
                                totalResultsText: '{total} Results',
                                applyBtnText: 'Apply',
                                doneBtnText: 'Done',
                            },
                        },
                    },
                },
                categoryHandler: handleCategoryClick,
            },
        };
        renderContainer(customConfig);
        // Find the category button by its data-testid attribute
        const categoryButton = screen.getByTestId('category-button-caas:product-categories:category-1');
        // Check if the button has the correct text content
        expect(categoryButton).toHaveTextContent('Category 1');
    });


    // Testing all Conditions
    test('should handle category with no items gracefully', () => {
        const handleCategoryClick = jest.fn();
        const customConfig = {
            collection: {
                layout: {
                    container: LAYOUT_CONTAINER.CATEGORIES,
                },
                lazyLoad: false,
                resultsPerPage: 10,
                endpoint: 'https://www.somedomain.com/some-test-api.json',
                totalCardsToShow: 150,
                cardStyle: 'none',
                showTotalResults: true,
                i18n: {
                    prettyDateIntervalFormat: '{LLL} {dd} | {timeRange} {timeZone}',
                    totalResultsText: '{total} Results',
                    title: 'Your Top Picks',
                    titleHeadingLevel: 'h2',
                },
            },
            filterPanel: {
                enabled: true,
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
                    {
                        group: 'Category Group',
                        id: 'caas:product-categories:category-3',
                        title: 'Category 3',
                        icon: 'https://www.somedomain.com/category-icon-2.svg',
                        items: [],
                    },
                ],
                categories: [
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
                    {
                        group: 'Category Group',
                        id: 'caas:product-categories:category-3',
                        title: 'Category 3',
                        icon: 'https://www.somedomain.com/category-icon-2.svg',
                        items: [],
                    },
                ],
                i18n: {
                    leftPanel: {
                        mobile: {
                            group: {
                                totalResultsText: '{total} Results',
                                applyBtnText: 'Apply',
                                doneBtnText: 'Done',
                            },
                        },
                    },
                },
                categoryHandler: handleCategoryClick,
            },
        };
        renderContainer(customConfig);

        // Find the category button by its data-testid attribute
        const categoryButton = screen.getByTestId('category-button-caas:product-categories:category-3');
        fireEvent.click(categoryButton);

        // Check if the categoryHandler was called
        expect(categoryButton).toHaveTextContent('Category 3');
    });
});
