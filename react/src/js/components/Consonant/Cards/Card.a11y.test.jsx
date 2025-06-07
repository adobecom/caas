import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import makeSetup from '../Testing/Utils/Settings';
import Card from './Card';

// Minimal props needed to instantiate Card
const defaultProps = {
    id: 'a11y-test-card',
    onClick: jest.fn(),
    styles: {
        backgroundImage: 'https://example.com/img.png',
        backgroundAltText: 'Test image alt',
    },
    contentArea: {
        title: 'Test Card Title',
        detailText: 'Detail text',
        description: 'Description text',
        dateDetailText: {},
    },
};

const setup = makeSetup(Card, defaultProps);

describe('Card accessibility (one-half)', () => {
    it('renders one-half card without accessibility violations', async () => {
        const { wrapper } = setup({ cardStyle: 'one-half' });
        const { container } = wrapper;
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});

describe('Card accessibility (half-height)', () => {
    it('renders half-height card without accessibility violations', async () => {
        const { wrapper } = setup({ cardStyle: 'half-height' });
        const { container } = wrapper;
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('is keyboard accessible via the overlay link and stays a11y-clean', async () => {
        // half-height always renders a <LinkBlocker>
        const overlayLink = 'https://example.com';
        const { wrapper } = setup({
            cardStyle: 'half-height',
            overlayLink,
        });
        const { container } = wrapper;

        // find the overlay link
        const link = screen.getByRole('link');
        link.focus();
        expect(document.activeElement).toBe(link);

        fireEvent.click(link);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
