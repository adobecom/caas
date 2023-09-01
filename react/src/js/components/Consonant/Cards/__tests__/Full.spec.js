import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_FULL } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';

const renderCard = setup(Card, DEFAULT_PROPS_FULL);

const cardStyle = 'full-card';

describe('Consonant/Card/Full-Card', () => {
    test('should be able to render a banner overlay', () => {
        const {
            props: {
                overlays: {
                    banner: {
                        description: bannerDescription,
                        fontColor: bannerFontColor,
                        backgroundColor: bannerBackgroundColor,
                        icon: bannerIcon,
                    },
                },
            },
        } = renderCard({
            cardStyle,
        });

        const bannerElement = screen.getByTestId('consonant-Card-banner');
        const bannerIconElement = screen.getByTestId('consonant-Card-bannerImg');

        expect(bannerElement).toHaveStyle({
            color: bannerFontColor,
            backgroundColor: bannerBackgroundColor,
        });
        expect(bannerElement).toHaveTextContent(bannerDescription);
        expect(bannerIconElement).toHaveAttribute('src', bannerIcon);
    });

    test('should be able to render a badge overlay', () => {
        const {
            props: {
                overlays: {
                    label: {
                        description: someBadgeText,
                    },
                },
            },
        } = renderCard({
            cardStyle,
        });

        const badgeElement = screen.queryByText(someBadgeText);
        expect(badgeElement).not.toBeNull();
    });

    test('should be able to render a logo overlay', () => {
        renderCard({
            cardStyle,
        });
        const logoAltText = screen.getByAltText('logo-alt-text');
        expect(logoAltText).not.toBeNull();
    });

    test('should be able to render a detail text', () => {
        renderCard({
            cardStyle,
            contentArea: {
                detailText: 'detail label',
                dateDetailText: {
                    startTime: undefined,
                },
            },
        });

        const labelElement = screen.queryByText('detail label');
        expect(labelElement).not.toBeNull();
    });

    test('should be able to render a card title', () => {
        renderCard({
            cardStyle,
        });

        const labelElement = screen.queryByTestId('consonant-Card-title');
        expect(labelElement).not.toBeNull();
    });
});
