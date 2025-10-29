import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_ONE_HALF } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';
import { testA11yForConfigs } from '../../Testing/Utils/a11yTest';

const renderCard = setup(Card, DEFAULT_PROPS_ONE_HALF, { wrapInList: true });

const cardStyle = 'one-half';

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
            contentArea: {
                detailText: 'detailText',
                dateDetailText: {
                    endTime: '2021-10-11T21:00:00.000Z',
                    startTime: '2021-10-11T21:00:00.000Z',
                },
            },
        });

        const labelElement = screen.queryByTestId('consonant-Card-label');
        expect(labelElement).not.toBeNull();
    });

    test('should not render card label if no Detail Text or startTime is authored', () => {
        renderCard({
            cardStyle,
            contentArea: {
                detailText: null,
                dateDetailText: {
                    startTime: null,
                },
            },
        });

        const labelElement = screen.queryByTestId('consonant-Card-label');
        expect(labelElement).toBeNull();
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

        const labelElement = screen.queryByTestId('consonant-Card-text');
        expect(labelElement).not.toBeNull();
    });

    test('should be able to render a card footer', () => {
        renderCard({
            cardStyle,
        });

        const cardFooter = screen.queryByTestId('consonant-Card-footer');
        expect(cardFooter).not.toBeNull();
    });

    test('should be able to render the lock icon on gated cards', () => {
        renderCard({
            cardStyle,
            tags: [
                {
                    id: '/7ed3',
                },
            ],
            bannerMap: {
                register: {
                    description: 'Register',
                },
            },
        });

        const gatedIcon = screen.getByTestId('consonant-GatedInfobit');
        expect(gatedIcon).not.toBeNull();
    });

    test('should be able to render a CTA button', () => {
        renderCard({
            cardStyle,
            footer: [{
                right: [{
                    type: 'button',
                    href: 'https://milo.adobe.com',
                }],
            }],
        });
        const ctaLinkBtn = screen.getByTestId('consonant-BtnInfobit');
        expect(ctaLinkBtn).not.toBeNull();
    });

    test('should be able to render a CTA link', () => {
        renderCard({
            cardStyle,
            footer: [{
                right: [{
                    type: 'link',
                    href: 'https://milo.adobe.com',
                }],
            }],
        });
        const ctaLinkLink = screen.getByTestId('consonant-LinkInfobit');
        expect(ctaLinkLink).not.toBeNull();
    });

    test('should be able to render a Date interval', () => {
        renderCard({
            cardStyle,
            footer: [{
                left: [
                    {},
                    {
                        type: 'date-interval',
                        endTime: '2021-08-19T23:23:00.000-07:00',
                        startTime: '2021-08-19T22:22:00.000-07:00',
                    },
                ],
            }],
        });
        const dateinterval = screen.getByTestId('consonant-DateIntervalInfobit');
        expect(dateinterval).not.toBeNull();
    });
    test('should render a card with a heading and aria-level', () => {
        renderCard({
            cardStyle,
        });

        const cardHeader = screen.getByTestId('consonant-Card-title');
        expect(cardHeader).toHaveAttribute('aria-level');
    });

    // Accessibility tests with jest-axe
    testA11yForConfigs(renderCard, [
        {
            name: 'Default one-half card',
            props: { cardStyle }
        },
        {
            name: 'One-half card with video button',
            props: {
                cardStyle,
                overlays: {
                    videoButton: { url: 'https://example.com/video.mp4' }
                }
            }
        }
    ]);
});
