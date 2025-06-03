import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import Container from './Container';

// Mock fetch to return an empty cards array by default
beforeAll(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ cards: [] }),
        })
    );
});
afterAll(() => {
    delete global.fetch;
});

describe('Container accessibility', () => {
    it('renders without accessibility violations', async () => {
        const { container } = render(<Container config={{}} />);
        // Wait for the fetch effect to be called
        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});