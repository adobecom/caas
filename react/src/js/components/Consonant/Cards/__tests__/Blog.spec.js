import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Card from '../Card';

import { DEFAULT_PROPS_BLOG } from '../../Testing/Constants/Card';

import setup from '../../Testing/Utils/Settings';
import { testA11yForConfigs } from '../../Testing/Utils/a11yTest';

const renderCard = setup(Card, DEFAULT_PROPS_BLOG, { wrapInList: true });

const cardStyle = 'blog-card';

describe(`Consonant/Card/${cardStyle}`, () => {
    test('should be able to render a card header', () => {
        renderCard({
            cardStyle,
        });

        const headerElement = screen.queryByTestId('consonant-Card-header');
        expect(headerElement).not.toBeNull();
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

        const titleElement = screen.queryByTestId('consonant-Card-title');
        expect(titleElement).not.toBeNull();
    });

    test('should be able to render a card text', () => {
        renderCard({
            cardStyle,
        });

        const textElement = screen.queryByTestId('consonant-Card-text');
        expect(textElement).not.toBeNull();
    });

    test('should be able to render a card footer', () => {
        renderCard({
            cardStyle,
        });

        const footerElement = screen.queryByTestId('consonant-Card-footer');
        expect(footerElement).not.toBeNull();
    });

    test('should render the formatted blog date in the footer', () => {
        renderCard({
            cardStyle,
            cardDate: '2020-10-19T12:00:00.000Z',
        });

        const dateElement = screen.getByText('10-19-2020');
        expect(dateElement).toBeInTheDocument();
    });

    test('should keep the footer rendered when CTA is hidden', () => {
        renderCard({
            cardStyle,
            hideCTA: true,
            cardDate: '2020-10-19T12:00:00.000Z',
        });

        const footerElement = screen.getByTestId('consonant-Card-footer');
        expect(footerElement).toBeInTheDocument();
        expect(screen.getByText('10-19-2020')).toBeInTheDocument();
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
            name: 'Default blog card',
            props: { cardStyle }
        },
        {
            name: 'Blog card with video button',
            props: {
                cardStyle,
                overlays: {
                    videoButton: { url: 'https://example.com/video.mp4' }
                }
            }
        }
    ]);
});
