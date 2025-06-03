import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import View from './View';

describe('NoResults View accessibility', () => {
    it('should have no accessibility violations', async () => {
        const { container } = render(
            <View title="No Results" description="No results found." replaceValue="N/A" />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});