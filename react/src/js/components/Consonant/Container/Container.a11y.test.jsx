import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import Container from './Container';
import config from '../Testing/Mocks/config.json';
import cards from '../Testing/Mocks/cards.json';

// Mock fetch to return a valid cards array using fixture
beforeAll(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'OK',
            json: () => Promise.resolve({ cards }),
        })
    );
});
afterAll(() => {
    delete global.fetch;
});

describe('Container accessibility', () => {
    it('renders without accessibility violations', async () => {
        // Non-empty response: render grid with cards
        const { container } = render(<Container config={config} />);
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('renders accessible no-results view when API returns empty array', async () => {
        // Mock fetch to return empty cards
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: () => Promise.resolve({ cards: [] }),
            })
        );
        const { container } = render(<Container config={config} />);
        await waitFor(() => screen.getByTestId('consonant-NoResultsView'));
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('renders accessible error view when API fails', async () => {
        // Mock fetch to simulate network error
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                json: () => Promise.resolve({}),
            })
        );
        const { container } = render(<Container config={config} />);
        await waitFor(() => screen.getByTestId('consonant-NoResultsView'));
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('search box is accessible and interactive', async () => {
        // Render container with search enabled
        const { container } = render(<Container config={config} />);
        // Locate the search input by test ID
        const input = await screen.findByTestId('consonant-Search-input');
        expect(input).toBeTruthy();
        // Type into the search input
        fireEvent.change(input, { target: { value: 'tag' } });
        expect(input.value).toBe('tag');
        // Clear the search via the clear button
        const clearBtn = screen.getByLabelText('Clear Search filter');
        expect(clearBtn).toBeTruthy();
        fireEvent.click(clearBtn);
        expect(input.value).toBe('');
        // Assert no accessibility violations after interaction
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('top filter panel search box is accessible and interactive', async () => {
        // Override config to use top filter panel
        const cfg = JSON.parse(JSON.stringify(config));
        cfg.filterPanel.type = 'top';
        // Simulate mobile viewport to render top panel search bar
        global.innerWidth = 500;
        window.dispatchEvent(new Event('resize'));
        const { container } = render(<Container config={cfg} />);
        // Wait for top filter panel mobile search wrapper
        await waitFor(() => screen.getByTestId('consonant-TopFilters-searchWrapper'));
        // Locate the search input rendered by Search component
        const input = screen.getByTestId('consonant-Search-input');
        expect(input).toBeTruthy();
        fireEvent.change(input, { target: { value: 'test' } });
        expect(input.value).toBe('test');
        const clearBtn = screen.getByLabelText('Clear Search filter');
        expect(clearBtn).toBeTruthy();
        fireEvent.click(clearBtn);
        expect(input.value).toBe('');
        // Check accessibility after interaction
        const results2 = await axe(container);
        expect(results2).toHaveNoViolations();
    });
});