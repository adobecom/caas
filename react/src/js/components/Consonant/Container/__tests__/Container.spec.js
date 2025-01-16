import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import jest-dom for additional matchers
import Container from '../Container';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import { SORT_TYPES } from '../../Helpers/constants';
import jestMocks from '../../Testing/Utils/JestMocks';
import cards from '../../Testing/Mocks/cards.json';

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
    test('should set totalCardLimit to sampleSize when sort option is RANDOM', () => {
        const customConfig = {
            collection: {
                totalCardsToShow: 50,
                reservoir: {
                    sample: 10,
                    pool: 100,
                },
                lazyLoad: false,
                resultsPerPage: 10,
                endpoint: 'https://www.somedomain.com/some-test-api.json',
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
            },
            sort: {
                options: [
                    { label: 'Random', sort: SORT_TYPES.RANDOM },
                ],
                defaultSort: SORT_TYPES.RANDOM,
            },
        };

        render(<Container config={customConfig} />);

        // Check the totalCardLimit element
        const totalCardLimitElement = screen.getByTestId('consonant-Select-btn');
        expect(totalCardLimitElement).toHaveTextContent('Random');
    });
    // MODIFIEDDESC: 'modifieddesc',
    test('should set totalCardLimit to sampleSize when sort option is ModifiedDesc', () => {
        const customConfig = {
            collection: {
                totalCardsToShow: 50,
                reservoir: {
                    sample: 10,
                    pool: 100,
                },
                lazyLoad: false,
                resultsPerPage: 10,
                endpoint: 'https://www.somedomain.com/some-test-api.json',
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
            },
            sort: {
                options: [
                    { label: 'Modifieddesc', sort: SORT_TYPES.MODIFIEDDESC },
                ],
                defaultSort: SORT_TYPES.MODIFIEDDESC,
            },
        };

        render(<Container config={customConfig} />);

        // Check the totalCardLimit element
        const totalCardLimitElement = screen.getByTestId('consonant-Select-btn');
        expect(totalCardLimitElement).toHaveTextContent('Modifieddesc');
    });
    // MODIFIEDASC: 'modifiedasc',
    test('should set totalCardLimit to sampleSize when sort option is MODIFIEDASC', () => {
        const customConfig = {
            collection: {
                totalCardsToShow: 50,
                reservoir: {
                    sample: 10,
                    pool: 100,
                },
                lazyLoad: false,
                resultsPerPage: 10,
                endpoint: 'https://www.somedomain.com/some-test-api.json',
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
            },
            sort: {
                options: [
                    { label: 'Modifiedasc', sort: SORT_TYPES.MODIFIEDASC },
                ],
                defaultSort: SORT_TYPES.MODIFIEDASC,
            },
        };

        render(<Container config={customConfig} />);

        // Check the totalCardLimit element
        const totalCardLimitElement = screen.getByTestId('consonant-Select-btn');
        expect(totalCardLimitElement).toHaveTextContent('Modifiedasc');
    });
    // EVENTSORT: 'eventsort',
    test('should set totalCardLimit to sampleSize when sort option is EVENTSORT', () => {
        const customConfig = {
            collection: {
                totalCardsToShow: 50,
                reservoir: {
                    sample: 10,
                    pool: 100,
                },
                lazyLoad: false,
                resultsPerPage: 10,
                endpoint: 'https://www.somedomain.com/some-test-api.json',
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
            },
            sort: {
                options: [
                    { label: 'eventsort', sort: SORT_TYPES.EVENTSORT },
                ],
                defaultSort: SORT_TYPES.EVENTSORT,
            },
        };

        render(<Container config={customConfig} />);

        // Check the totalCardLimit element
        const totalCardLimitElement = screen.getByTestId('consonant-Select-btn');
        expect(totalCardLimitElement).toHaveTextContent('eventsort');
    });
    // FEATURED: 'featured',
    test('should set totalCardLimit to sampleSize when sort option is FEATURED', () => {
        const customConfig = {
            collection: {
                totalCardsToShow: 50,
                reservoir: {
                    sample: 10,
                    pool: 100,
                },
                lazyLoad: false,
                resultsPerPage: 10,
                endpoint: 'https://www.somedomain.com/some-test-api.json',
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
                enabled: false,
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
            },
            sort: {
                options: [
                    { label: 'Featured', sort: SORT_TYPES.FEATURED },
                ],
                defaultSort: SORT_TYPES.FEATURED,
            },
        };

        render(<Container config={customConfig} />);

        // Check the totalCardLimit element
        const totalCardLimitElement = screen.getByTestId('consonant-Select-btn');
        expect(totalCardLimitElement).toHaveTextContent('Featured');
    });
    // TITLEASC: 'titleasc',
    test('should set totalCardLimit to sampleSize when sort option is TITLEASC', () => {
        const customConfig = {
            collection: {
                totalCardsToShow: 50,
                reservoir: {
                    sample: 10,
                    pool: 100,
                },
                lazyLoad: false,
                resultsPerPage: 10,
                endpoint: 'https://www.somedomain.com/some-test-api.json',
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
            },
            sort: {
                options: [
                    { label: 'Titleasc', sort: SORT_TYPES.TITLEASC },
                ],
                defaultSort: SORT_TYPES.TITLEASC,
            },
        };

        render(<Container config={customConfig} />);

        // Check the totalCardLimit element
        const totalCardLimitElement = screen.getByTestId('consonant-Select-btn');
        expect(totalCardLimitElement).toHaveTextContent('Titleasc');
    });
    // TITLEDESC: 'titledesc',
    test('should set totalCardLimit to sampleSize when sort option is TITLEDESC', () => {
        const customConfig = {
            collection: {
                totalCardsToShow: 50,
                reservoir: {
                    sample: 10,
                    pool: 100,
                },
                lazyLoad: false,
                resultsPerPage: 10,
                endpoint: 'https://www.somedomain.com/some-test-api.json',
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
            },
            sort: {
                options: [
                    { label: 'Titledesc', sort: SORT_TYPES.TITLEDESC },
                ],
                defaultSort: SORT_TYPES.TITLEDESC,
            },
        };

        render(<Container config={customConfig} />);

        // Check the totalCardLimit element
        const totalCardLimitElement = screen.getByTestId('consonant-Select-btn');
        expect(totalCardLimitElement).toHaveTextContent('Titledesc');
    });
});
