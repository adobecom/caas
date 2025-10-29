import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_THREE_FOURTHS } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';
import { testA11yForConfigs } from '../../Testing/Utils/a11yTest';

const renderCard = setup(Card, DEFAULT_PROPS_THREE_FOURTHS, { wrapInList: true });

const cardStyle = 'three-fourths';

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

    test('should be able to render a overlay badge', () => {
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

    test('should be able to render a overlay logo', () => {
        renderCard({
            cardStyle,
        });
        const cardLogo = screen.getByTestId('consonant-Card-logo');
        expect(cardLogo).not.toBeNull();
    });

    test('should be able to render a logo alt-text', () => {
        renderCard({
            cardStyle,
        });
        const logoAltText = screen.getByAltText('logo-alt-text');
        expect(logoAltText).not.toBeNull();
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

    test('should be able to render a card text', () => {
        renderCard({
            cardStyle,
        });

        const textElement = screen.queryByTestId('consonant-Card-text');
        expect(textElement).not.toBeNull();
    });

    test('should not render a card footer', () => {
        renderCard({
            cardStyle,
        });

        const cardFooter = screen.queryByTestId('consonant-Card-footer');
        expect(cardFooter).toBeNull();
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
            name: 'Default three-fourths card',
            props: { cardStyle }
        },
        {
            name: 'Three-fourths card with video button',
            props: {
                cardStyle,
                overlays: {
                    videoButton: { url: 'https://example.com/video.mp4' }
                }
            }
        }
    ]);
});
