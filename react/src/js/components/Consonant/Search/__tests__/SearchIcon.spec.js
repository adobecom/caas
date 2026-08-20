import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import SearchIcon from '../SearchIcon';

import makeSetup from '../../Testing/Utils/Settings';

const setup = makeSetup(SearchIcon, {
    onClick: jest.fn(),
});

describe('Consonant/SearchIcon', () => {
    describe('Interaction with UI', () => {
        test('should call onClick', () => {
            const { props: { onClick } } = setup();

            const iconElement = screen.queryByTestId('search-icon');

            fireEvent.click(iconElement);

            expect(onClick).toHaveBeenCalled();
        });
    });
});
