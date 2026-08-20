import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { axe, toHaveNoViolations } from 'jest-axe';

import Loader from '../Loader';
import { LOADER_SIZE } from '../../Helpers/constants';

expect.extend(toHaveNoViolations);

describe('Consonant/Loader', () => {
    test('Loader renders correctly', async () => {
        const props = {
            size: LOADER_SIZE.BIG,
            hidden: false,
            absolute: false,
        };
        render(<Loader {...props} />);

        const loader = screen.queryByTestId('consonant-Loader');

        expect(loader).not.toBeNull();
    });

    // Accessibility test with jest-axe
    describe('Accessibility', () => {
        test('Loader should have no accessibility violations', async () => {
            const props = {
                size: LOADER_SIZE.BIG,
                hidden: false,
                absolute: false,
            };
            const { container } = render(<Loader {...props} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
