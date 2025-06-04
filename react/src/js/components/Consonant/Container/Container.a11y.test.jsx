import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
        // Render with real config and mocked cards
        const { container } = render(<Container config={config} />);
        // Wait until the grid of cards is rendered
        await waitFor(() => screen.getByTestId('consonant-CardsGrid'));
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});