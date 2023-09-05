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
});
