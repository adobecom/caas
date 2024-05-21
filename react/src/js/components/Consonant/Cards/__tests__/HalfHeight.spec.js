import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_HALF_HEIGHT } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';

const renderCard = setup(Card, DEFAULT_PROPS_HALF_HEIGHT);

const cardStyle = 'half-height';

describe(`Consonant/Card/${cardStyle}`, () => {
    test('should be able to render a card header', () => {
        renderCard({
            cardStyle,
        });

        const headerElement = screen.queryByTestId('consonant-Card-header');
        expect(headerElement).not.toBeNull();
    });

    test('should be able to render a card image', () => {
        const {
            props: {
                styles: {
                    backgroundImage: backgroundImageSrc,
                },
            },
        } = renderCard({
            cardStyle,
        });
        const cardHeader = screen.getByTestId('consonant-Card-header');

        expect(cardHeader).toHaveStyle({
            backgroundImage: `url(${backgroundImageSrc})`,
        });
    });

    test('should be able to render a overlay banner', () => {
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

    test('should be able to render a overlay video player button', () => {
        renderCard({
            cardStyle,
        });

        const videoButton = screen.queryByTestId('consonant-Card-videoButton-wrapper');
        expect(videoButton).not.toBeNull();
    });

    test('should be able to render a detail/eyebrow text', () => {
        renderCard({
            cardStyle,
        });

        const labelElement = screen.queryByTestId('consonant-Card-label');
        expect(labelElement).not.toBeNull();
    });

    test('should be able to render a card title', () => {
        renderCard({
            cardStyle,
        });

        const labelElement = screen.queryByTestId('consonant-Card-title');
        expect(labelElement).not.toBeNull();
    });

    test('should not render a overlay badge', () => {
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
        expect(badgeElement).toBeNull();
    });

    test('should not render a overlay logo', () => {
        renderCard({
            cardStyle,
        });

        const cardLogo = screen.queryByTestId('consonant-Card-logo');
        expect(cardLogo).toBeNull();
    });

    test('should not render a card text', () => {
        renderCard({
            cardStyle,
        });

        const textElement = screen.queryByTestId('consonant-Card-text');
        expect(textElement).toBeNull();
    });

    test('should not render a card footer', () => {
        renderCard({
            cardStyle,
        });

        const cardFooter = screen.queryByTestId('consonant-Card-footer');
        expect(cardFooter).toBeNull();
    });
});
