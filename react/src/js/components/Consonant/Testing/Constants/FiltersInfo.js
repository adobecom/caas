import React from 'react';
import { filterPanel } from '../Mocks/config.json';

const { enabled } = filterPanel;

export const DESKTOP_WIDTH = 1900;
export const NON_DESKTOP_WIDTH = 800;

export const DEFAULT_PROPS = {
    enabled,

    filtersQty: 0,
    cardsQty: 0,
    selectedFiltersQty: 0,
    windowWidth: DESKTOP_WIDTH,

    onMobileFiltersToggleClick: jest.fn(),

    searchComponent: <div data-testid="consonant-FiltersInfo-search" />,
    sortComponent: <div data-testid="consonant-Select" />,
    sortOptions: [],
};
