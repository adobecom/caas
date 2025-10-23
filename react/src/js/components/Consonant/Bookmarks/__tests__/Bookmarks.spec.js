import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Bookmarks from '../Bookmarks';

import {
    COUNT_LIST,
    DEFAULT_PROPS,
    WITHOUT_ICONS,
} from '../../Testing/Constants/Bookmarks';

import makeSetup from '../../Testing/Utils/Settings';

const setup = makeSetup(Bookmarks, DEFAULT_PROPS);

describe('Consonant/Bookmarks', () => {
    test('should renders correctly different bookmarks count', () => {
        COUNT_LIST.forEach((count) => {
            const { wrapper } = setup({ savedCardsCount: count });

            const badgeElement = screen.getByTestId('consonant-Bookmarks-itemBadge');

            expect(badgeElement).toHaveTextContent(count);
            wrapper.unmount();
        });
    });

    test('should render unselectedIco', async () => {
        const {
            config: {
                bookmarks: {
                    leftFilterPanel: {
                        unselectBookmarksIcon,
                    },
                },
            },
        } = setup();

        const iconElement = screen.getByTestId('consonant-Bookmarks-ico');

        expect(iconElement).toHaveStyle(`background-image: url(${unselectBookmarksIcon})`);
    });
    test('should render selectedIco', () => {
        const {
            config: {
                bookmarks: {
                    leftFilterPanel: {
                        selectBookmarksIcon,
                    },
                },
            },
        } = setup({ showBookmarks: true });

        const iconElement = screen.getByTestId('consonant-Bookmarks-ico');

        expect(iconElement).toHaveStyle(`background-image: url(${selectBookmarksIcon})`);
    });
    test('shouldn`t have style object when selected === true && selectedIco didnt exists', async () => {
        setup({ selected: true }, { bookmarks: WITHOUT_ICONS });

        const iconElement = await waitFor(() => screen.getByTestId('consonant-Bookmarks-ico'));

        expect(iconElement).not.toHaveStyle({ backgroundImage: "url('')" });
    });
    test('shouldn`t have style object when selected === false && unselectedIco didnt exists', async () => {
        setup({}, { bookmarks: WITHOUT_ICONS });

        const iconElement = await waitFor(() => screen.getByTestId('consonant-Bookmarks-ico'));

        expect(iconElement).not.toHaveStyle({ backgroundImage: "url('')" });
    });

    describe('Interaction with UI', () => {
        test('should call onChange', () => {
            const { props: { onClick } } = setup();

            const boorkmarksElement = screen.getByTestId('consonant-Bookmarks');

            fireEvent.click(boorkmarksElement);

            expect(onClick).toHaveBeenCalled();
        });
    });

    // Accessibility test with jest-axe
    describe('Accessibility', () => {
        const { testAccessibility } = require('../../Testing/Utils/a11yTest');
        testAccessibility(setup, {}, 'Bookmarks');
    });
});
