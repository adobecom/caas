import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_1_1 } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';

const renderCard = setup(Card, DEFAULT_PROPS_1_1);

describe('Consonant/Card/1:1', () => {
    test('should renders banner correctly', () => {
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
            cardStyle: 'three-fourths',
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

    test('should renders with badge', () => {
        const {
            props: {
                overlays: {
                    label: {
                        description: someBadgeText,
                    },
                },
            },
        } = renderCard({
            cardStyle: 'three-fourths',
        });

        const badgeElement = screen.queryByText(someBadgeText);

        expect(badgeElement).not.toBeNull();
    });

    test('should renders with label', () => {
        renderCard({
            contentArea: {
                dateDetailText: {
                    endTime: '2021-10-11T21:00:00.000Z',
                    startTime: '2021-10-11T21:00:00.000Z',
                },
            },
        });

        const labelElement = screen.queryByTestId('consonant-Card-label');

        expect(labelElement).not.toBeNull();
    });

    test('should renders with detail text in label ', () => {
        renderCard({
            cardStyle: 'three-fourths',
            contentArea: {
                detailText: 'datail label',
                dateDetailText: {
                    startTime: undefined,
                },
            },
        });

        const labelElement = screen.queryByText('datail label');

        expect(labelElement).not.toBeNull();
    });

    test('If No Detail Text or startTime is authored, then card label should not appear ', () => {
        renderCard({
            cardStyle: 'three-fourths',
            contentArea: {
                detailText: null,
                dateDetailText: {
                    startTime: null,
                },
            },
        });

        const labelElement = screen.queryByTestId('consonant-Card-label');

        expect(labelElement)
            .toBeNull();
    });
});
