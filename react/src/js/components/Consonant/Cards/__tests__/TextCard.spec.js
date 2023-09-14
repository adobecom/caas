import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_TEXT } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';

const renderCard = setup(Card, DEFAULT_PROPS_TEXT);

const cardStyle = 'text-card';

describe(`Consonant/Card/${cardStyle}`, () => {
    test('should be able to render a card header', () => {
        renderCard({
            cardStyle,
        });

        const headerElement = screen.queryByTestId('consonant-Card-header');
        expect(headerElement).not.toBeNull();
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
});
