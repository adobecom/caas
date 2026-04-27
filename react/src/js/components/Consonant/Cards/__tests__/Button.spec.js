import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_BUTTON } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';
import { testA11yForConfigs } from '../../Testing/Utils/a11yTest';

const renderCard = setup(Card, DEFAULT_PROPS_BUTTON, { wrapInList: true });

const cardStyle = 'button-card';

describe(`Consonant/Card/${cardStyle}`, () => {
    test('should be able to render the card CTA link text', () => {
        renderCard({
            cardStyle,
        });

        const ctaElement = screen.getByText('Learn more');
        expect(ctaElement).toBeInTheDocument();
        expect(ctaElement).toHaveAttribute('href', 'https://www.some-url.com');
    });

    test('should render a link blocker with the overlay link', () => {
        const { wrapper } = renderCard({
            cardStyle,
        });

        const blocker = wrapper.container.querySelector('.consonant-LinkBlocker');
        expect(blocker).not.toBeNull();
        expect(blocker).toHaveAttribute('href', 'https://www.some-url.com');
    });

    test('should apply the no-borders class when renderBorder is false', () => {
        renderCard({
            cardStyle,
            renderBorder: false,
        });

        const cardElement = screen.getByTestId('consonant-Card');
        expect(cardElement).toHaveClass('consonant-u-noBorders');
    });

    // Accessibility tests with jest-axe
    testA11yForConfigs(renderCard, [
        {
            name: 'Default button card',
            props: { cardStyle }
        },
        {
            name: 'Button card without borders',
            props: {
                cardStyle,
                renderBorder: false
            }
        }
    ]);
});
