import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    screen,
    waitFor,
    fireEvent,
    queryAllByTestId,
    act,
    render,
} from '@testing-library/react';

import Container from '../Container';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';
import config from '../../Testing/Mocks/config.json';
import cards from '../../Testing/Mocks/cards.json';

const DESKTOP_WIDTH = 1800;
const TABLET_MIN_WIDTH = 768;

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


window.scrollTo = () => { };
jest.setTimeout(30000);


setupIntersectionObserverMock();
jestMocks.lana();

beforeEach(() => {
    window.history.replaceState(null, '', window.location.pathname);
});
describe('Consonant/Container/Left Filter', () => {
    test('Should be able to render the left filter', async () => {
        const configToUse = config;
        configToUse.filterPanel.type = 'left';

        await act(async () => render(<Container config={configToUse} />));

        // Top Filter Panel Should NOT Exist
        const filtersTopElement = screen.queryByTestId('consonant-TopFilters');
        expect(filtersTopElement).toBeNull();

        // Grab thee Left Filter Panel and Info Bar
        const filtersLeftElement = screen.queryByTestId('consonant-LeftFilters');
        const filtersInfoElement = screen.queryByTestId('consonant-FiltersInfo');

        expect(filtersLeftElement).not.toBeNull();
        expect(filtersInfoElement).not.toBeNull();
    });

    test('Should be able to render the card collection', async () => {
        const configToUse = config;

        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        expect(screen.getByTestId('consonant-CardsGrid')).not.toBeNull();
    });

    test('Should allow users to check filter checkboxes', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'xor';

        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getAllByTestId('consonant-LeftFilter-itemsItemCheckbox'));

        const filtersLeftElement = screen.getByTestId('consonant-LeftFilters');
        const [firstCheckbox] = queryAllByTestId(filtersLeftElement, 'consonant-LeftFilter-itemsItemCheckbox');

        expect(firstCheckbox.checked).toBeFalsy();

        fireEvent.click(firstCheckbox);

        expect(firstCheckbox.checked).toBeTruthy();

        fireEvent.click(firstCheckbox);

        expect(firstCheckbox.checked).toBeFalsy();
    });

    test('Should be able to show mobile views', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'xor';

        await act(async () => render(<Container config={configToUse} />));
        global.innerWidth = TABLET_MIN_WIDTH;

        const mobileFooterButton = screen.getByTestId('consonant-LeftFilters-mobileFooterBtn');
        const filtersLeftElement = screen.getByTestId('consonant-LeftFilters');

        expect(filtersLeftElement).not.toHaveClass('is-opened');

        fireEvent.click(mobileFooterButton);

        expect(filtersLeftElement).toHaveClass('is-opened');
    });


    test('should be able to search and filter', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'xor';
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        const searchInput = screen.getByTestId('consonant-Search-input');

        fireEvent.change(searchInput, { target: { value: 'Some Title 5' } });

        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        expect(screen.queryAllByTestId('consonant-Card')).toHaveLength(1);

        const [firstFilter] = screen.queryAllByTestId('consonant-LeftFilter');

        const [firstFilterCheckbox] = queryAllByTestId(firstFilter, 'consonant-LeftFilter-itemsItemCheckbox');

        fireEvent.click(firstFilterCheckbox);

        expect(firstFilterCheckbox.checked).toBeTruthy();
        expect(screen.queryAllByTestId('consonant-card')).toHaveLength(0);
    });

    test('should be able to open groups of filters', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'xor';
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getAllByTestId('consonant-LeftFilter'));

        const [firstFilterGroup, secondFilterGroup] = screen.queryAllByTestId('consonant-LeftFilter');
        const [firstFilterItem, secondFilterItem] = screen.queryAllByTestId('consonant-LeftFilter-link');

        fireEvent.click(firstFilterItem);

        expect(firstFilterGroup).toHaveClass('is-opened');

        fireEvent.click(secondFilterItem);

        expect(firstFilterGroup).toHaveClass('is-opened');
        expect(secondFilterGroup).toHaveClass('is-opened');
    });

    test('Should trap tabbing in filters on mobile', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'xor';

        await act(async () => render(<Container config={configToUse} />));
        global.innerWidth = TABLET_MIN_WIDTH;

        const mobileFooterBtnElement = screen.queryByTestId('consonant-LeftFilters-mobileFooterBtn');
        const mobileButtonBackElement = screen.queryByTestId('consonant-LeftFilters-mobBack');

        expect(mobileFooterBtnElement).toBeTruthy();
        expect(mobileButtonBackElement).toBeTruthy();

        fireEvent.keyDown(mobileFooterBtnElement, { key: 'Tab' });
        expect(mobileButtonBackElement).toHaveFocus();

        fireEvent.keyDown(mobileButtonBackElement, { key: 'Tab', shiftKey: true });
        expect(mobileFooterBtnElement).toHaveFocus();
    });

    test('Should close filters with Escape key on mobile', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'xor';

        await act(async () => render(<Container config={configToUse} />));
        global.innerWidth = TABLET_MIN_WIDTH;

        const filtersInfoButton = screen.getByTestId('consonant-FiltersInfo-btn');
        const filtersLeftElement = screen.getByTestId('consonant-LeftFilters');

        fireEvent.click(filtersInfoButton);
        expect(filtersLeftElement).toHaveClass('is-opened');

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(filtersLeftElement).not.toHaveClass('is-opened');
    });
});

describe('Consonant/Left Filter/Selected Filter Pills', () => {
    test('testing multiple clicks -- so selected filter pills show', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'or';
        configToUse.filterPanel.type = 'left';
        global.innerWidth = DESKTOP_WIDTH;

        await act(async () => render(<Container config={configToUse} />));
        // Need to wait for all checkboxes to render
        await waitFor(() => screen.getAllByTestId('consonant-LeftFilter-itemsItemCheckbox'));

        const filterElements = screen.getAllByTestId('consonant-LeftFilter');
        const firstFilterElement = filterElements[0];

        const [firstCheckbox] = queryAllByTestId(firstFilterElement, 'consonant-LeftFilter-itemsItemCheckbox');

        fireEvent.click(firstCheckbox);

        await waitFor(() => screen.getAllByTestId('consonant-ChosenFilter'));
        const [selectedFilter] = screen.getAllByTestId('consonant-ChosenFilter');

        expect(selectedFilter).not.toBeNull();
    });
    test('Should allow users to check filter checkboxes', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'and';
        configToUse.filterPanel.type = 'left';


        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getAllByTestId('consonant-LeftFilter-itemsItemCheckbox'));

        const filtersLeftElement = screen.getByTestId('consonant-LeftFilters');
        const [firstCheckbox] = queryAllByTestId(filtersLeftElement, 'consonant-LeftFilter-itemsItemCheckbox');

        expect(firstCheckbox.checked).toBeFalsy();

        fireEvent.click(firstCheckbox);

        expect(firstCheckbox.checked).toBeTruthy();

        fireEvent.click(firstCheckbox);

        expect(firstCheckbox.checked).toBeFalsy();
    });
});
