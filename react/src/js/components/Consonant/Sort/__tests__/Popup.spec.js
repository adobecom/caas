import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { DEFAULT_PROPS } from '../../Testing/Constants/Select';
import Popup from '../Popup';
import setup from '../../Testing/Utils/Settings';

const renderSortPopup = setup(Popup, DEFAULT_PROPS);

describe('Consonant/Sort/Popup', () => {
    test('Should show all sort options', async () => {
        const { props: { values } } = renderSortPopup();
        const sortPopup = screen.getByTestId('consonant-Select-btn');

        fireEvent.click(sortPopup);

        const optionElements = screen.getAllByTestId('consonant-Select-option');
        expect(optionElements).toHaveLength(values.length);
    });

    test('Click handler should work', () => {
        const { props: { onSelect } } = renderSortPopup();
        const sortPopup = screen.getByTestId('consonant-Select-btn');

        fireEvent.click(sortPopup);
        const [optionElement] = screen.getAllByTestId('consonant-Select-option');
        fireEvent.click(optionElement);

        expect(onSelect).toHaveBeenCalled();
    });

    // Accessibility test with jest-axe
    describe('Accessibility', () => {
        const { testAccessibility } = require('../../Testing/Utils/a11yTest');
        testAccessibility(renderSortPopup, {}, 'Sort Popup');
    });
});
