import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import setupIntersectionObserverMock from '../Testing/Mocks/intersectionObserver';
import jestMocks from '../Testing/Utils/JestMocks';
import Container from '../Container/Container';
import config from '../Testing/Mocks/config.json';
import cards from '../Testing/Mocks/cards.json';

// Mock fetch and setup environment for carousel tests
beforeAll(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'OK',
            json: () => Promise.resolve({ cards }),
        })
    );
    setupIntersectionObserverMock();
    jestMocks.lana();
});
afterAll(() => {
    delete global.fetch;
});

describe('CardsCarousel accessibility', () => {
    it('renders without accessibility violations', async () => {
        const cfg = JSON.parse(JSON.stringify(config));
        cfg.collection.layout.container = 'carousel';
        const { container } = render(<Container config={cfg} />);
        // Wait for carousel info title to ensure render
        await waitFor(() =>
            screen.getByTestId('consonant-CarouselInfo-collectionTitle')
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('is keyboard accessible and has no violations after interacting with nav buttons', async () => {
        const cfg = JSON.parse(JSON.stringify(config));
        cfg.collection.layout.container = 'carousel';
        const { container } = render(<Container config={cfg} />);
        await waitFor(() =>
            screen.getByTestId('consonant-CarouselInfo-collectionTitle')
        );
        const nextBtn = container.querySelector('[name="next"]');
        const prevBtn = container.querySelector('[name="previous"]');
        expect(nextBtn).toBeTruthy();
        expect(prevBtn).toBeTruthy();
        // Focus and activate next button
        nextBtn.focus();
        expect(document.activeElement).toBe(nextBtn);
        fireEvent.click(nextBtn);
        // Focus and activate previous button
        prevBtn.focus();
        expect(document.activeElement).toBe(prevBtn);
        fireEvent.click(prevBtn);
        // Final accessibility check
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});