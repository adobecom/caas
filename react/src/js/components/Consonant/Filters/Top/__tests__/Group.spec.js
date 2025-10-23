import '@testing-library/jest-dom/extend-expect';
import {
    fireEvent,
} from '@testing-library/react';

import { Group } from '../Group';
import setup from '../../../Testing/Utils/Settings';
import { testAccessibility } from '../../../Testing/Utils/a11yTest';
import {
    DEFAULT_PROPS,
} from '../../../Testing/Constants/FilterItem';

const renderTopFilterGroup = setup(Group, DEFAULT_PROPS);

describe('Consonant/Filters/Top/Group', () => {
    test('Should set correct analytics attribute with "Open" when filter is closed', () => {
        const { props: { name } } = renderTopFilterGroup();
        
        const filterNameElement = document.querySelector('.consonant-TopFilter-name');
        expect(filterNameElement).toHaveAttribute('daa-ll', `${name} Open`);
    });
    
    test('Should set correct analytics attribute with "Close" when filter is opened', () => {
        // Render with the filter opened
        const { props: { name } } = renderTopFilterGroup();
        
        // Get the filter toggle button and click it to open the filter
        const filterButton = document.querySelector('.consonant-TopFilter-link');
        fireEvent.click(filterButton);
        
        // Check if the analytics attribute is updated with "Close"
        const filterNameElement = document.querySelector('.consonant-TopFilter-name');
        expect(filterNameElement).toHaveAttribute('daa-ll', `${name} Close`);
    });
    
    test('Should toggle analytics attribute between "Open" and "Close" on multiple clicks', () => {
        const { props: { name } } = renderTopFilterGroup();

        const filterButton = document.querySelector('.consonant-TopFilter-link');
        const filterNameElement = document.querySelector('.consonant-TopFilter-name');

        // Initial state - should be "Open"
        expect(filterNameElement).toHaveAttribute('daa-ll', `${name} Open`);

        // First click - should change to "Close"
        fireEvent.click(filterButton);
        expect(filterNameElement).toHaveAttribute('daa-ll', `${name} Close`);

        // Second click - should change back to "Open"
        fireEvent.click(filterButton);
        expect(filterNameElement).toHaveAttribute('daa-ll', `${name} Open`);
    });

    // Accessibility test with jest-axe
    describe('Accessibility', () => {
        testAccessibility(renderTopFilterGroup, {}, 'Top Filter Group');
    });
});
