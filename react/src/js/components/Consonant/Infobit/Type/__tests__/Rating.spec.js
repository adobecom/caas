import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    render,
    screen,
} from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Rating from '../Rating';

expect.extend(toHaveNoViolations);

describe('Consonant/Infobits/Type/Rating', () => {
    test('If invalid ratings are authored, do not show any filled stars', async () => {
        const props = {
            totalStars: -1,
            starsFilled: 3,
            label: '',
        };
        render(<Rating {...props} />);

        const [stars] = screen.getAllByTestId('consonant-RatingInfobit-stars');

        expect(stars.dataset.rating).toBe('0');
    });

    test('If more stars are authored then possible, do not show any filled stars', async () => {
        const props = {
            totalStars: 100,
            starsFilled: 3,
            label: '',
        };
        render(<Rating {...props} />);

        const [stars] = screen.getAllByTestId('consonant-RatingInfobit-stars');

        expect(stars.dataset.rating).toBe('0');
    });

    test('If a negative amount is authored for filled stars, do not show any filled stars', async () => {
        const props = {
            totalStars: 5,
            starsFilled: -10,
            label: '',
        };
        render(<Rating {...props} />);

        const [stars] = screen.getAllByTestId('consonant-RatingInfobit-stars');

        expect(stars.dataset.rating).toBe('0');
    });

    // Accessibility test with jest-axe
    describe('Accessibility', () => {
        test('Rating should have no accessibility violations', async () => {
            const props = {
                totalStars: 5,
                starsFilled: 3,
                label: 'Product Rating',
            };
            const { container } = render(<Rating {...props} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
