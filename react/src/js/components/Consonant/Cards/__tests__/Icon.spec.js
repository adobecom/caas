import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_ICON } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';

const renderCard = setup(Card, DEFAULT_PROPS_ICON);

const cardStyle = 'icon-card';

describe(`Consonant/Card/${cardStyle}`, () => {
    test('should be able to render a card header', () => {
        renderCard({
            cardStyle,
        });
        const labelElement = screen.queryByTestId('consonant-Card-title');
        expect(labelElement).not.toBeNull();
    });
    test('should be able to render an icon', () => {
        const {
            props: {
                styles: {
                    icon: iconSrc,
                },
            },
        } = renderCard({
            cardStyle,
        });
        const iconElement = screen.getByTestId('consonant-Card-logo');
        const iconImgElement = screen.getByTestId('consonant-Card-logoImg');
        expect(iconElement).not.toBeNull();
        expect(iconImgElement).toHaveAttribute('src', iconSrc);
        expect(iconImgElement).toHaveAttribute('alt', '');
    });
});
