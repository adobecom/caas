import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    screen,
    fireEvent,
} from '@testing-library/react';

import FilterPanelTop from '../Panel';
import Popup from '../../../Sort/Popup';
import Search from '../../../Search/Search';
import setup from '../../../Testing/Utils/Settings';
import { DEFAULT_PROPS as SEARCH_DEFAULT_PROPS } from '../../../Testing/Constants/Search';
import { DEFAULT_PROPS as SELECT_DEFAULT_PROPS } from '../../../Testing/Constants/Select';
import { ANALYTICS_ITEMS } from '../../../Testing/Constants/Panel';
import {
    DEFAULT_PROPS,
    TABLET_MIN_WIDTH,
    selectedAllFilters,
    MOBILE_MIN_WIDTH,
} from '../../../Testing/Constants/FilterPanelTop';

const renderTopFilterPanel = setup(FilterPanelTop, DEFAULT_PROPS);

const multipleFilters = [...DEFAULT_PROPS.filters, ...DEFAULT_PROPS.filters]
    .map((item, index) => ({ ...item, id: `${item}_${index}` }));

const CHILD_COMPONENTS = {
    search: <Search {...SEARCH_DEFAULT_PROPS} />,
    select: <Popup {...SELECT_DEFAULT_PROPS} />,
};

describe('Consonant/Filters/Top/Panel', () => {
    beforeEach(() => {
        global.innerWidth = TABLET_MIN_WIDTH;
    });

    test('Should be able to render all groups of filters', () => {
        const { props: { filters } } = renderTopFilterPanel({
            filterPanelEnabled: true,
            filters: selectedAllFilters,
        });

        const filterGroupElements = screen.queryAllByTestId('consonant-TopFilter-items');
        expect(filterGroupElements).toHaveLength(filters.length);
    });

    test('Should be able to display total results if authored', () => {
        renderTopFilterPanel({ displayTotalResults: true });

        const footerTotalResElement = screen.queryByTestId('consonant-TopFilters-results');
        expect(footerTotalResElement).not.toBeNull();
    });

    test('Should be able to render a search box on mobile', () => {
        renderTopFilterPanel({
            windowWidth: MOBILE_MIN_WIDTH,
            searchComponent: CHILD_COMPONENTS.search,
        });

        const footerTotalResElement = screen.queryByTestId('consonant-TopFilters-searchWrapper');
        expect(footerTotalResElement).not.toBeNull();
    });

    test('Should be able to render correctly without search', () => {
        renderTopFilterPanel({ searchComponent: CHILD_COMPONENTS.search });

        const footerTotalResElement = screen.queryByTestId('consonant-TopFilters-searchWrapper');
        expect(footerTotalResElement).toBeNull();
    });

    test('Should be able to show the Sort Popup', () => {
        renderTopFilterPanel({ sortComponent: CHILD_COMPONENTS.select });

        const footerTotalResElement = screen.queryByTestId('consonant-TopFilters-selectWrapper');
        expect(footerTotalResElement).not.toBeNull();
    });

    test('Should be able to render the more button with correct text', () => {
        const {
            config: {
                filterPanel: {
                    i18n: {
                        topPanel: {
                            moreFiltersBtnText,
                        },
                    },
                },
            },
        } = renderTopFilterPanel({
            filterPanelEnabled: true,
            filters: multipleFilters,
            showLimitedFiltersQty: true,
        });

        const footerTotalResElement = screen.queryByTestId('consonant-TopFilters-moreBtn');
        expect(footerTotalResElement).toHaveTextContent(moreFiltersBtnText);
    });

    test('Should be able to show the Filter Group Button', () => {
        renderTopFilterPanel({ filterPanelEnabled: true });

        const [filterGroupBtn] = screen.queryAllByTestId('consonant-TopFilter-link');
        expect(filterGroupBtn).toBeDefined();
    });

    test('Should show the clear all filters text', () => {
        renderTopFilterPanel({
            filterPanelEnabled: true,
            filters: selectedAllFilters,
            showLimitedFiltersQty: true,
        });

        const clearButtonElement = screen.queryByTestId('consonant-TopFilters-clearBtn');
        expect(clearButtonElement).not.toBeNull();
    });

    test('The clear all filters button should work', () => {
        const {
            props: {
                onClearAllFilters,
            },
        } = renderTopFilterPanel({
            filterPanelEnabled: true,
            filters: selectedAllFilters,
            showLimitedFiltersQty: true,
        });

        const clearButtonElement = screen.queryByTestId('consonant-TopFilters-clearBtn');

        fireEvent.click(clearButtonElement);
        expect(onClearAllFilters).toBeCalled();
    });

    test('should load analytics onto the filter panel', () => {
        renderTopFilterPanel({
            filterPanelEnabled: true,
            filters: selectedAllFilters,
        });
        const topFilterPanel = screen.queryByTestId('consonant-TopFilters');
        expect(topFilterPanel).toHaveAttribute('daa-lh', 'Filters');

        const topFilterItem = screen.queryAllByTestId('consonant-TopFilter');
        topFilterItem.forEach((filterItem, index) => {
            expect(filterItem).toHaveAttribute('daa-lh', ANALYTICS_ITEMS[index]);
        });
    });

    // Additional Tests for 100% Coverage

    test('Should display search bar on mobile', () => {
        renderTopFilterPanel({
            windowWidth: MOBILE_MIN_WIDTH,
            searchComponent: CHILD_COMPONENTS.search,
        });

        const searchWrapper = screen.queryByTestId('consonant-TopFilters-searchWrapper');
        expect(searchWrapper).not.toBeNull();
    });

    test('Should display filters when filters are provided and panel is enabled', () => {
        renderTopFilterPanel({
            filterPanelEnabled: true,
            filters: selectedAllFilters,
        });

        const filtersWrapper = screen.queryByTestId('consonant-TopFilters-filters');
        expect(filtersWrapper).not.toBeNull();
    });

    test('Should display "Show all filters" button when conditions are met', () => {
        renderTopFilterPanel({
            filterPanelEnabled: true,
            filters: multipleFilters,
            showLimitedFiltersQty: true,
            windowWidth: TABLET_MIN_WIDTH,
        });

        const moreFiltersBtn = screen.queryByTestId('consonant-TopFilters-moreBtn');
        expect(moreFiltersBtn).not.toBeNull();
    });

    test('Should display collection info when title or total results are provided', () => {
        renderTopFilterPanel({
            filterPanelEnabled: true,
            filters: selectedAllFilters,
            title: 'Test Collection',
            showTotalResults: true,
        });

        const collectionTitle = screen.queryByTestId('consonant-TopFilters-collectionTitle');
        const totalResults = screen.queryByTestId('consonant-TopFilters-results');
        expect(collectionTitle).not.toBeNull();
        expect(totalResults).not.toBeNull();
    });

    test('Should show clear button wrapper when at least one filter is selected', () => {
        renderTopFilterPanel({
            filterPanelEnabled: true,
            filters: selectedAllFilters,
        });

        const clearBtnWrapper = screen.queryByTestId('consonant-TopFilters-clearBtnWrapper');
        expect(clearBtnWrapper).not.toBeNull();
    });
    test('Should render Group components for each filter', () => {
        const { props: { filters } } = renderTopFilterPanel({
            filterPanelEnabled: true,
            filters: selectedAllFilters,
        });

        const filterGroupElements = screen.queryAllByTestId('consonant-TopFilter-items');
        expect(filterGroupElements).toHaveLength(filters.length);
    });
});
