import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    screen,
    waitFor,
    fireEvent,
    act,
    render,
} from '@testing-library/react';


import Container from '../Container';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import config from '../../Testing/Mocks/config.json';
import cards from '../../Testing/Mocks/cards.json';

setupIntersectionObserverMock();

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


describe('Consonant/Container/Search', () => {
    test('Should be able to clear search box', async () => {
        const configToUse = config;
        configToUse.filterPanel.enabled = true;
        configToUse.filterPanel.filterLogic = 'xor';
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getByTestId('consonant-Search-input'));

        const searchInput = screen.getByTestId('consonant-Search-input');

        expect(searchInput.value).toEqual('');

        fireEvent.change(searchInput, { target: { value: 'Search string' } });

        expect(searchInput.value).toEqual('Search string');
    });
    test('Should be able to change search values', async () => {
        const configToUse = config;
        configToUse.filterPanel.enabled = true;
        configToUse.filterPanel.filterLogic = 'or';
        await act(async () => render(<Container config={configToUse} />));


        await waitFor(() => screen.getByTestId('consonant-Search-input'));

        const searchInput = screen.getByTestId('consonant-Search-input');

        expect(searchInput.value).toEqual('Search string');

        fireEvent.change(searchInput, { target: { value: 'Search string new' } });

        expect(searchInput.value).toEqual('Search string new');
    });
    test('Should be able to change search values without sorting', async () => {
        const configToUse = config;
        configToUse.sort = null;
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getByTestId('consonant-Search-input'));

        const searchInput = screen.getByTestId('consonant-Search-input');

        expect(searchInput.value).toEqual('Search string new');

        fireEvent.change(searchInput, { target: { value: 'Search string newer' } });

        expect(searchInput.value).toEqual('Search string newer');
    });
    test('Clicking the search input should not change the typed search value', async () => {
        const configToUse = config;
        configToUse.filterPanel.enabled = true;
        configToUse.filterPanel.filterLogic = 'or';
        await act(async () => render(<Container config={configToUse} />));


        await waitFor(() => screen.getByTestId('consonant-Search-input'));

        const searchInput = screen.getByTestId('consonant-Search-input');

        expect(searchInput.value).toEqual('Search string newer');

        fireEvent.click(searchInput);

        expect(searchInput.value).toEqual('Search string newer');
    });
    test('Should be able to search through cards', async () => {
        const configToUse = config;
        configToUse.filterPanel.filterLogic = 'xor';
        await act(async () => render(<Container config={configToUse} />));

        const searchInput = screen.getByTestId('consonant-Search-input');
        
        fireEvent.change(searchInput, { target: { value: '' } });

        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        fireEvent.change(searchInput, { target: { value: 'Some Title 5' } });

        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        expect(screen.queryAllByTestId('consonant-Card')).toHaveLength(1);
    });
});
