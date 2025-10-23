import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Item from '../Item';

import {
    DEFAULT_PROPS,
    selectedAllItems,
    ANALYTICS_ITEMS,
} from '../../../Testing/Constants/FilterItem';

import setup from '../../../Testing/Utils/Settings';

const renderItemComponent = setup(Item, DEFAULT_PROPS);

describe('Consonant/Filters/Left/Item', () => {
    test('should be able to render without an item count badge', () => {
        renderItemComponent();

        const badgeElement = screen.queryByTestId('consonant-LeftFilter-itemBadge');

        expect(badgeElement).toBeNull();
    });

    test('should be able to render with an item count badge', () => {
        renderItemComponent(selectedAllItems);

        const badgeElement = screen.queryByTestId('consonant-LeftFilter-itemBadge');

        expect(badgeElement).not.toBeNull();

        expect(badgeElement).toHaveTextContent(String(selectedAllItems.numItemsSelected));
    });

    test('should be able to render all list items', () => {
        const { props: { items } } = renderItemComponent();

        const filterItemElement = screen.queryAllByTestId('consonant-LeftFilter-itemsItem');

        expect(filterItemElement).toHaveLength(items.length);
    });

    test('Checking a checkbox for a filter item should work', () => {
        const { props: { onCheck } } = renderItemComponent();

        const [checkboxElement] = screen.queryAllByTestId('consonant-LeftFilter-itemsItemCheckbox');

        expect(checkboxElement).toBeDefined();

        fireEvent.click(checkboxElement);

        expect(onCheck).toHaveBeenCalled();
    });

    test('Clicking a filter item should work', () => {
        const { props: { onClick, name } } = renderItemComponent();

        const itemLinkElement = screen.getByText(name);

        expect(itemLinkElement).not.toBeNull();

        fireEvent.click(itemLinkElement);

        expect(onClick).toHaveBeenCalled();
    });

    test('Should be able to clear all filters', () => {
        const { props: { onClearAll } } = renderItemComponent(selectedAllItems);

        const badgeElement = screen.queryByTestId('consonant-LeftFilter-itemBadge');

        expect(badgeElement).not.toBeNull();

        fireEvent.click(badgeElement);

        expect(onClearAll).toHaveBeenCalled();
    });

    test('should load analytics for filter items', () => {
        renderItemComponent();

        const leftFilterElement = screen.queryAllByTestId('consonant-LeftFilter');
        leftFilterElement.forEach((itemElement, index) => {
            expect(itemElement).toHaveAttribute('daa-lh', ANALYTICS_ITEMS.leftFilter[index]);
        });

        const leftFilterName = screen.queryAllByTestId('consonant-LeftFilter-name');
        leftFilterName.forEach((itemElement, index) => {
            expect(itemElement).toHaveAttribute('daa-ll', ANALYTICS_ITEMS['leftFilter-name'][index]);
        });

        const itemItemElement = screen.queryAllByTestId('consonant-LeftFilter-itemsItem');
        itemItemElement.forEach((itemElement, index) => {
            expect(itemElement).toHaveAttribute('daa-ll', ANALYTICS_ITEMS.itemsItem[index]);
        });
    });

    test('should not have is-opened class and set aria-expanded to false by default', () => {
        renderItemComponent();

        const leftFilterElement = screen.queryByTestId('consonant-LeftFilter');
        const leftFilterLink = screen.queryByTestId('consonant-LeftFilter-link');

        expect(leftFilterElement).not.toHaveClass('is-opened');
        expect(leftFilterLink).toHaveAttribute('aria-expanded', 'false');
    });

    test('should add is-opened class and set aria-expanded to true with isOpened prop set to true', () => {
        renderItemComponent({ isOpened: true });

        const leftFilterElement = screen.queryByTestId('consonant-LeftFilter');
        const leftFilterLink = screen.queryByTestId('consonant-LeftFilter-link');

        expect(leftFilterElement).toHaveClass('is-opened');
        expect(leftFilterLink).toHaveAttribute('aria-expanded', 'true');
    });

    // Accessibility test with jest-axe
    describe('Accessibility', () => {
        const { testAccessibility } = require('../../../Testing/Utils/a11yTest');
        testAccessibility(renderItemComponent, {}, 'Left Filter Item');
    });
});
