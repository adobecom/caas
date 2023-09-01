import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_DW } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';

const renderCard = setup(Card, DEFAULT_PROPS_DW);

const cardStyle = 'double-wide';

describe('Consonant/Card/3:2', () => {
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

    test('should be able to render a label overlay', () => {
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
