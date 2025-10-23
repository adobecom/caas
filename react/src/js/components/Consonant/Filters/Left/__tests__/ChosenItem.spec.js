import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ChosenItem from '../Desktop-Only/ChosenItem';
import makeSetup from '../../../Testing/Utils/Settings';
import { DEFAULT_PROPS } from '../../../Testing/Constants/SelectedFilter';

const setup = makeSetup(ChosenItem, DEFAULT_PROPS);

describe('Consonant/Filters/Left/Chosen Item', () => {
    describe('Interaction with UI', () => {
        test('should call onOpen', () => {
            const {
                props: {
                    id,
                    name,
                    onClick,
                    parentId,
                },
            } = setup();

            const buttonElement = screen.getByText(name);

            fireEvent.click(buttonElement);

            expect(onClick).toHaveBeenCalled();
            expect(onClick).toHaveBeenCalledWith(parentId, id, false);
        });
    });

    // Accessibility test with jest-axe
    describe('Accessibility', () => {
        const { testAccessibility } = require('../../../Testing/Utils/a11yTest');
        testAccessibility(setup, {}, 'Chosen Filter Item');
    });
});
