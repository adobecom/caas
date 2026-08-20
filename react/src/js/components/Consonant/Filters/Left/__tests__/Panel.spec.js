import '@testing-library/jest-dom/extend-expect';
import {
    screen,
    fireEvent,
} from '@testing-library/react';

import Panel from '../Panel';
import setup from '../../../Testing/Utils/Settings';
import { testAccessibility } from '../../../Testing/Utils/a11yTest';
import {
    DEFAULT_PROPS,
    NON_DESKTOP_WIDTH,
    selectedAllFilters,
} from '../../../Testing/Constants/FilterPanelLeft';

const renderFilterPanel = setup(Panel, DEFAULT_PROPS);

describe('Consonant/Left/Panel', () => {
    test('should be able to render all filters', () => {
        const { props: { filters } } = renderFilterPanel();

        const filterGroupElements = screen.queryAllByTestId('consonant-LeftFilter-items');

        expect(filterGroupElements).toHaveLength(filters.length);
    });
    test('should render total results', () => {
        renderFilterPanel({
            showTotalResults: true,
            windowWidth: NON_DESKTOP_WIDTH,
        });

        const footerTotalResElement = screen.queryByTestId('consonant-LeftFilters-mobileFooterTotalResQty');
        expect(footerTotalResElement).not.toBeNull();
    });

    test('should be able to render mobile/tablet elements when filters selected', () => {
        const {
            config: {
                filterPanel: { i18n: { leftPanel: { mobile: { panel: { applyBtnText } } } } },
            },
        } = renderFilterPanel({
            filters: selectedAllFilters,
            windowWidth: NON_DESKTOP_WIDTH,
        });

        const mobileFooterClearElement = screen.queryByTestId('consonant-LeftFilters-mobileFooterClearBtn');
        expect(mobileFooterClearElement).not.toBeNull();

        const mobileFooterBtnElement = screen.queryByTestId('consonant-LeftFilters-mobileFooterBtn');
        expect(mobileFooterBtnElement).toHaveTextContent(applyBtnText);
    });

    test('Should be able to select a filter', () => {
        const { props: { onFilterClick } } = renderFilterPanel();

        const [filterItemElement] = screen.queryAllByTestId('consonant-LeftFilter-link');
        expect(filterItemElement).toBeDefined();

        fireEvent.click(filterItemElement);
        expect(onFilterClick).toHaveBeenCalled();
    });
    test('Should be able to clear all filters', () => {
        const { props: { onClearAllFilters } } = renderFilterPanel();

        const clearButtonElement = screen.queryByTestId('consonant-LeftFilters-clearLink');
        expect(clearButtonElement).not.toBeNull();

        fireEvent.click(clearButtonElement);
        expect(onClearAllFilters).toHaveBeenCalled();

        onClearAllFilters.mockClear();
    });
    test('Should be able to clear all filters using a mobile footer', () => {
        const { props: { onClearAllFilters } } = renderFilterPanel({
            filters: selectedAllFilters,
            windowWidth: NON_DESKTOP_WIDTH,
        });

        const mobileFooterClearElement = screen.queryByTestId('consonant-LeftFilters-mobileFooterClearBtn');
        expect(mobileFooterClearElement).not.toBeNull();

        fireEvent.click(mobileFooterClearElement);
        expect(onClearAllFilters).toHaveBeenCalled();

        onClearAllFilters.mockClear();
    });
    test('should be able to toggle on mobile', () => {
        const { props: { onMobileFiltersToggleClick } } = renderFilterPanel({
            windowWidth: NON_DESKTOP_WIDTH,
        });

        const mobileButtonBackElement = screen.queryByTestId('consonant-LeftFilters-mobBack');
        expect(mobileButtonBackElement).not.toBeNull();

        fireEvent.click(mobileButtonBackElement);
        expect(onMobileFiltersToggleClick).toHaveBeenCalledTimes(1);

        const mobileFooterBtnElement = screen.queryByTestId('consonant-LeftFilters-mobileFooterBtn');
        expect(mobileFooterBtnElement).not.toBeNull();

        fireEvent.click(mobileFooterBtnElement);
        expect(onMobileFiltersToggleClick).toHaveBeenCalledTimes(2);
    });

    test('should load analytics for panel', () => {
        renderFilterPanel();
        const leftFilterPanel = screen.queryByTestId('consonant-LeftFilters');
        expect(leftFilterPanel).toHaveAttribute('daa-lh', 'Filters');
    });

    // Accessibility test with jest-axe
    describe('Accessibility', () => {
        testAccessibility(renderFilterPanel, {}, 'Left Filter Panel');
    });
});
