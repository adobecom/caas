import '@testing-library/jest-dom/extend-expect';
import {
    screen,
    fireEvent,
    getNodeText,
} from '@testing-library/react';

import { getItemsRange } from '../../Testing/Utils/Pagination';
import config from '../../Testing/Mocks/config.json';
import Paginator from '../Paginator';
import setup from '../../Testing/Utils/Settings';
import { testAccessibility } from '../../Testing/Utils/a11yTest';

import {
    PAGE_LIST,
    DEFAULT_PROPS,
} from '../../Testing/Constants/Pagination';

const renderComponent = setup(Paginator, DEFAULT_PROPS);

const { pagination: { i18n: { paginator: { resultsQuantityText } } } } = config;

describe('Consonant/Pagination/Paginator', () => {
    test('Pagination summary should work for different page ranges', () => {
        PAGE_LIST.forEach((page) => {
            const { props: { showItemsPerPage, totalResults }, wrapper } =
                renderComponent({ currentPageNumber: page });

            const { start, end } = getItemsRange({
                page, totalResults, itemsPerPage: showItemsPerPage,
            });

            const itemsToDisplay = {
                start, end, total: totalResults,
            };

            const summary = resultsQuantityText
                .replace(/\{(\w*)}/gi, (_, matchedKey) => itemsToDisplay[matchedKey]);

            const paginationSummaryElement = screen.getByTestId('consonant-Pagination-summary');
            expect(paginationSummaryElement).toHaveTextContent(summary);

            wrapper.unmount();
        });
    });
    test('Should be able to go navigate and forward', () => {
        const { props: { onClick } } = renderComponent();

        const prevButton = screen.getByTestId('consonant-Pagination-btn--prev');
        const nextButton = screen.getByTestId('consonant-Pagination-btn--next');
        const pageButton = screen.queryAllByTestId('consonant-Pagination-itemBtn')[0];

        fireEvent.click(nextButton);
        expect(onClick).toHaveBeenCalledWith(2);

        fireEvent.click(prevButton);
        expect(onClick).toHaveBeenCalledWith(1);

        fireEvent.click(pageButton);
        const buttonText = getNodeText(pageButton);
        expect(onClick).toHaveBeenCalledWith(Number(buttonText));
    });
    test('Should be able to handle invalid current page and reset back to a valid page', () => {
        const { props: { onClick } } = renderComponent({ currentPageNumber: 0 });
        const prevButton = screen.getByTestId('consonant-Pagination-btn--prev');

        fireEvent.click(prevButton);
        expect(onClick).toHaveBeenCalledWith(1);
    });
    test('Should be able to go one page forward', () => {
        const { props: { onClick } } = renderComponent({ currentPageNumber: 2, totalPages: 1 });
        const nextButton = screen.getByTestId('consonant-Pagination-btn--next');

        fireEvent.click(nextButton);
        expect(onClick).toHaveBeenCalledWith(1);
    });
    test('Should be able to go back a page', () => {
        const { props: { onClick } } = renderComponent({ currentPageNumber: 5 });
        const prevButton = screen.getByTestId('consonant-Pagination-btn--prev');

        fireEvent.click(prevButton);
        expect(onClick).toHaveBeenCalledWith(4);
    });
    test('If on page one and previous is clicked, we should not go to page 0', () => {
        const { props: { onClick } } = renderComponent({ currentPageNumber: 1 });
        const prevButton = screen.getByTestId('consonant-Pagination-btn--prev');

        fireEvent.click(prevButton);
        expect(onClick).toHaveBeenCalledWith(1);
    });

    // Accessibility test with jest-axe
    describe('Accessibility', () => {
        testAccessibility(renderComponent, {}, 'Paginator');
    });
});
