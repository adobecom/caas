import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_PRODUCT } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';

const renderCard = setup(Card, DEFAULT_PROPS_PRODUCT);

const cardStyle = 'product';

describe(`Consonant/Card/${cardStyle}`, () => {
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

    test('should not render a card header', () => {
        renderCard({
            cardStyle,
        });

        const headerElement = screen.queryByTestId('consonant-Card-header');
        expect(headerElement).toBeNull();
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

    test('should not render a overlay banner', () => {
        const {
            props: {
                overlays: {
                    banner: {
                        description: bannerDescription,
                    },
                },
            },
        } = renderCard({
            cardStyle,
        });

        const bannerElement = screen.queryByText(bannerDescription);
        expect(bannerElement).toBeNull();
    });

    test('should not render a detail/eyebrow text', () => {
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
        expect(labelElement).toBeNull();
    });

    test('should not render a overlay video player button', () => {
        renderCard({
            cardStyle,
        });

        const videoButton = screen.queryByTestId('consonant-Card-videoButton-wrapper');
        expect(videoButton).toBeNull();
    });

    test('should not render the lock icon on gated cards', () => {
        renderCard({
            cardStyle,
            tags: [
                {
                    id: '/7ed3',
                },
            ],
        });

        const gatedIcon = screen.queryByTestId('consonant-GatedInfobit');
        expect(gatedIcon).toBeNull();
    });
    test('should render a card with a heading and aria-label', () => {
        renderCard({
            cardStyle,
        });

        const cardHeader = screen.getByTestId('consonant-Card-title');
        expect(cardHeader).toHaveAttribute('aria-label');
    });
});
