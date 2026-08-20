import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    screen,
    waitFor,
    fireEvent,
    getByText,
    act,
    render,
} from '@testing-library/react';


import Container from '../Container';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';
import config from '../../Testing/Mocks/config.json';
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

describe('Consonant/Container/Sort Popup', () => {
    test('should be able to open the sort popup', async () => {
        const configToUse = config;
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-Select-btn'));
        const selectButton = screen.getByTestId('consonant-Select-btn');

        expect(selectButton).not.toHaveClass('is-active');

        fireEvent.click(selectButton);
        expect(selectButton).toHaveClass('is-active');
    });

    test('should be able to feature sort cards', async () => {
        const configToUse = config;
        const { options } = config.sort;
        const { defaultSort } = config.sort;

        await act(async () => render(<Container config={configToUse} />));

        // get labels by sort values
        const {
            featured,
            defaultLabel,
        } = options.reduce((accumulator, { sort, label }) => {
            if (defaultSort && sort === defaultSort) {
                accumulator.defaultLabel = label;
            }
            switch (sort) {
                case 'featured':
                    accumulator.featured = label;
                    break;
                case 'dateAsc':
                    accumulator.dateAscEnding = label;
                    break;
                case 'dateDesc':
                    accumulator.dateDesc = label;
                    break;
                default:
                    break;
            }

            return accumulator;
        }, { defaultLabel: 'Please select' });

        // We need to wait for the api response and state updates
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        // Gets Sort Popup input
        const selectButton = screen.getByTestId('consonant-Select-btn');
        fireEvent.click(selectButton);

        // Gets needed sort options
        const selectOptions = screen.getByTestId('consonant-Select-options');

        const featuredOption = getByText(selectOptions, featured);

        // Checks if the defaultSort was selected
        expect(selectButton).toHaveTextContent(defaultLabel);

        fireEvent.click(featuredOption);

        // checks to see if featured sort was selected
        expect(selectButton).toHaveTextContent(featured);
    });

    test('should be able to use date desc sort', async () => {
        const configToUse = config;
        const { options } = config.sort;
        const { defaultSort } = config.sort;

        await act(async () => render(<Container config={configToUse} />));

        // get labels by sort value
        const {
            dateDesc,
            defaultLabel,
        } = options.reduce((accumulator, { sort, label }) => {
            if (defaultSort && sort === defaultSort) {
                accumulator.defaultLabel = label;
            }
            switch (sort) {
                case 'featured':
                    accumulator.featured = label;
                    break;
                case 'dateAsc':
                    accumulator.dateAscEnding = label;
                    break;
                case 'dateDesc':
                    accumulator.dateDesc = label;
                    break;
                default:
                    break;
            }

            return accumulator;
        }, { defaultLabel: 'Please select' });

        // We need to wait for api response and state updates
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        // Get The Sort Popup Input
        const selectButton = screen.getByTestId('consonant-Select-btn');
        fireEvent.click(selectButton);

        // Gets all sort options
        const selectOptions = screen.getByTestId('consonant-Select-options');

        const descOption = getByText(selectOptions, dateDesc);

        // Checks if the defaultSort was selected
        expect(selectButton).toHaveTextContent(defaultLabel);

        fireEvent.click(descOption);

        // checks if the descending date option was selected
        expect(selectButton).toHaveTextContent(dateDesc);
    });

    test('should be able to sort by date ascending', async () => {
        const configToUse = config;
        const { options } = config.sort;
        const { defaultSort } = config.sort;

        await act(async () => render(<Container config={configToUse} />));

        // get labels by sort value
        const {
            defaultLabel,
            dateAscEnding,
        } = options.reduce((accumulator, { sort, label }) => {
            if (defaultSort && sort === defaultSort) {
                accumulator.defaultLabel = label;
            }
            switch (sort) {
                case 'featured':
                    accumulator.featured = label;
                    break;
                case 'dateAsc':
                    accumulator.dateAscEnding = label;
                    break;
                case 'dateDesc':
                    accumulator.dateDesc = label;
                    break;
                default:
                    break;
            }

            return accumulator;
        }, { defaultLabel: 'Please select' });

        // We need to wait for the api response and state updates
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        // Gets The Sort Popup input
        const selectButton = screen.getByTestId('consonant-Select-btn');
        fireEvent.click(selectButton);

        // Gets the different sort options
        const selectOptions = screen.getByTestId('consonant-Select-options');
        const dateAscEndingOption = getByText(selectOptions, dateAscEnding);

        // Checks if defaultSort was selected
        expect(selectButton).toHaveTextContent(defaultLabel);

        fireEvent.click(dateAscEndingOption);

        // Checks if date ascending was selected
        expect(selectButton).toHaveTextContent(dateAscEnding);
    });

    test('If invalid sort option authored, fallback to use featured sort', async () => {
        const configToUse = config;
        configToUse.sort.defaultSort = 'notPresentSortOption';
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));

        const selectButton = screen.getByTestId('consonant-Select-btn');

        expect(selectButton).toHaveTextContent('Featured');
    });
});
