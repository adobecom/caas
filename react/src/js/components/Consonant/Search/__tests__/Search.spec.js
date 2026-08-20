import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Search from '../Search';
import setup from '../../Testing/Utils/Settings';
import { DEFAULT_PROPS } from '../../Testing/Constants/Search';
import { testA11yForConfigs } from '../../Testing/Utils/a11yTest';

const renderSearch = setup(Search, DEFAULT_PROPS);

describe('Consonant/Search', () => {
    test('Should be able to handle focus and blur events', () => {
        renderSearch({ onBlur: null });

        const inputElement = screen.getByTestId('consonant-Search-input');

        fireEvent.focus(inputElement);
        fireEvent.blur(inputElement);
    });
    test('Should be able to handle searches', () => {
        const { props: { onSearch } } = renderSearch({ value: 'First Search Query' });

        const inputElement = screen.getByTestId('consonant-Search-input');

        expect(inputElement.value).toBe('First Search Query');

        fireEvent.change(inputElement, { target: { value: 'Second Search Query' } });

        expect(onSearch).toHaveBeenCalled();
        expect(onSearch).toHaveBeenCalledWith('Second Search Query');

        onSearch.mockClear();
    });
    test('Should be able to clear search values', () => {
        const { props: { onSearch } } = renderSearch();

        const buttonElement = screen.queryByTestId('consonant-Search-inputClear');

        fireEvent.click(buttonElement);

        expect(onSearch).toHaveBeenCalled();
        expect(onSearch).toHaveBeenCalledWith('');
    });

    // Accessibility tests with jest-axe
    testA11yForConfigs(renderSearch, [
        {
            name: 'Search with empty value',
            props: { value: '' }
        },
        {
            name: 'Search with populated value',
            props: { value: 'Test search query' }
        }
    ]);
});
