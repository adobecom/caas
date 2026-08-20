import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    render,
    screen,
} from '@testing-library/react';

import { SelectedItem } from '../Desktop-Only/SelectedItem';

describe('Consonant/Left/Selected Filters', () => {
    test('If no filters are selected, a filter count should not appear ', async () => {
        const props = {
            numItemsSelected: 0,
            handleClear: () => {},
        };

        render(<SelectedItem {...props} />);
        const itemBadge = screen.queryByTestId('consonant-LeftFilter-itemBadge');
        expect(itemBadge.innerHTML).toBe('');
    });
});
