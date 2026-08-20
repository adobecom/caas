import React from 'react';
import { filterPanel } from '../Mocks/config.json';

const {
    clearFilterText,
    clearAllFiltersText,
    filters,
} = filterPanel;

export const TABLET_MIN_WIDTH = 768;
export const MOBILE_MIN_WIDTH = 384;

export const DEFAULT_PROPS = {
    filters,
    clearFilterText,
    clearAllFiltersText,

    resQty: 0, // total result
    displayTotalResults: false,
    showMobileFilters: false,
    filterPanelEnabled: false,

    onFilterClick: jest.fn(),
    onCheckboxClick: jest.fn(),
    onClearAllFilters: jest.fn(),
    onClearFilterItems: jest.fn(),
    onMobileFiltersToggleClick: jest.fn(),
    onShowAllClick: jest.fn(),

    windowWidth: TABLET_MIN_WIDTH,

    searchComponent: <React.Fragment />,
    sortComponent: <React.Fragment />,
};

export const selectedAllFilters = filters.map(({ items, ...filter }) => ({
    ...filter,
    items: items.map(item => ({ ...item, selected: true })),
}));
