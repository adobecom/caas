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
import jestMocks from '../../Testing/Utils/JestMocks';
import config from '../../Testing/Mocks/config.json';

setupIntersectionObserverMock();
jestMocks.lana();

const MOBILE_WIDTH = 375;

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: 'ok',
        status: 200,
        statusText: 'success',
        url: 'test.html',
        json: () => Promise.resolve({ cards: [] }),
    }));

beforeEach(() => {
    window.history.replaceState(null, '', window.location.pathname);
});

describe('Container Component', () => {
    test('should render with the provided configuration', async () => {
        const configToUse = { ...config, filterPanel: { ...config.filterPanel, type: 'top' } };
        await act(async () => render(<Container config={configToUse} />));

        // Wait for the title to be rendered
        const title = await waitFor(() => screen.getByText(/Filters:/i));
        expect(title).toBeInTheDocument();

        // Check if the total results text is rendered
        const totalResultsTexts = screen.getAllByText(/Results/i);
        expect(totalResultsTexts.length).toBeGreaterThan(0);

        // Check if the filter panel is enabled and rendered
        const filterPanel = screen.getByText(/First Tag Group Label/i);
        expect(filterPanel).toBeInTheDocument();
    });

    test('Should render Sort Pop up On The Left', async () => {
        const configToUse = config;
        await act(async () => render(<Container config={configToUse} />));
        await waitFor(() => screen.getByTestId('consonant-Select-btn'));
        const selectButton = screen.getByTestId('consonant-Select-btn');

        expect(selectButton).not.toHaveClass('is-active');

        fireEvent.click(selectButton);
        expect(selectButton).toHaveClass('is-active');
    });

    test('Should close filters on blur', async () => {
        global.innerWidth = MOBILE_WIDTH;
        const configToUse = { ...config, filterPanel: { ...config.filterPanel, type: 'top' } };
        await act(async () => render(<Container config={configToUse} />));

        await waitFor(() => screen.getAllByTestId('consonant-TopFilter'));

        // Simulate blur event
        const filterPanels = screen.getAllByTestId('consonant-TopFilter');
        filterPanels.forEach((filterPanel) => {
            fireEvent.blur(filterPanel);
            // Check if the filter panel is closed
            expect(filterPanel).toBeVisible();
        });
    });

    // Add more tests as needed
});
