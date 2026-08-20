import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_ICON } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';
import { testA11yForConfigs } from '../../Testing/Utils/a11yTest';

const renderCard = setup(Card, DEFAULT_PROPS_ICON, { wrapInList: true });

const cardStyle = 'horizontal-card';

describe(`Consonant/Card/${cardStyle}`, () => {
    test('should be able to render a card header', () => {
        renderCard({
            cardStyle,
        });
        const labelElement = screen.queryByTestId('consonant-Card-title');
        expect(labelElement).not.toBeNull();
    });

    test('should render a card without a heading and aria-label', () => {
        renderCard({
            cardStyle,
        });

        const cardHeader = screen.getByTestId('consonant-Card-title');
        expect(cardHeader).not.toHaveAttribute('aria-label');
    });

    // Accessibility tests with jest-axe
    testA11yForConfigs(renderCard, [
        {
            name: 'Default horizontal card',
            props: { cardStyle }
        },
        {
            name: 'Horizontal card with video button',
            props: {
                cardStyle,
                overlays: {
                    videoButton: { url: 'https://example.com/video.mp4' }
                }
            }
        }
    ]);
});
