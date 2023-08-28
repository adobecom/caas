import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_3_2 } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';

const renderCard = setup(Card, DEFAULT_PROPS_3_2);

const cardStyle = 'text-card';

describe('Consonant/Card/Text', () => {
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
        } = renderCard();

        const bannerElement = screen.getByTestId('consonant-Card-banner');
        const bannerIconElement = screen.getByTestId('consonant-Card-bannerImg');

        expect(bannerElement).toHaveStyle({
            color: bannerFontColor,
            backgroundColor: bannerBackgroundColor,
        });
        expect(bannerElement).toHaveTextContent(bannerDescription);
        expect(bannerIconElement).toHaveAttribute('src', bannerIcon);
    });

    test('should be able to render a label overlay', () => {
        renderCard({
            cardStyle,
            contentArea: {
                dateDetailText: {
                    endTime: '2021-10-11T21:00:00.000Z',
                    startTime: '2021-10-11T21:00:00.000Z',
                },
            },
        });

        const labelElement = screen.queryByTestId('consonant-Card-label');
        expect(labelElement).toBeNull();
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
        expect(labelElement).toBeNull();
    });

    test('should be able to render a logo image', () => {
        renderCard();
        const logoAltText = screen.queryByTestId('consonant-Card-logo');
        expect(logoAltText).not.toBeNull();
    });

    test('should be able to render the card title', () => {
        renderCard({
            cardStyle,
            contentArea: {
                title: 'Card title',
                detailText: 'detail label',
                dateDetailText: {
                    startTime: undefined,
                },
            },
        });

        const cardTitle = screen.getByTestId('consonant-Card-title');
        expect(cardTitle).toHaveTextContent('Card title');
    });

    test('should be able to render the card description text', () => {
        renderCard({
            cardStyle,
            contentArea: {
                title: 'Card title',
                description: 'Card description text',
                detailText: 'detail label',
                dateDetailText: {
                    startTime: undefined,
                },
            },
        });

        const cardText = screen.getByTestId('consonant-Card-text');
        expect(cardText).toHaveTextContent('Card description text');
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
});
