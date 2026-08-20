import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_ICON } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';
import { testA11yForConfigs } from '../../Testing/Utils/a11yTest';

const renderCard = setup(Card, DEFAULT_PROPS_ICON, { wrapInList: true });

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
        expect(iconImgElement).toHaveAttribute('alt'); // Now has proper alt text
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
            name: 'Default icon-card',
            props: { cardStyle }
        },
        {
            name: 'Icon-card with video button',
            props: {
                cardStyle,
                overlays: {
                    videoButton: { url: 'https://example.com/video.mp4' }
                }
            }
        }
    ]);
});
