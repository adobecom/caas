import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Card from '../Card';
import setup from '../../Testing/Utils/Settings';

const renderCard = setup(Card, { onClick: jest.fn(), onFocus: jest.fn() }, { wrapInList: true });

const footerWithBothCtas = [{
    left: [],
    right: [{ type: 'link', href: 'http://example1.com', text: 'Link 1 label' }],
    center: [{ type: 'link', href: 'http://example2.com', text: 'Link 2 label' }],
}];

const getDescriptionNode = () => screen.getByTestId('consonant-Card-text');

describe('Card description links and line breaks', () => {
    test('resolves {link:cta1} and {link:cta2} to anchors using the footer CTAs', () => {
        renderCard({
            cardStyle: 'one-half',
            contentArea: {
                description: 'See {link:cta1} and {link:cta2} today.',
            },
            footer: footerWithBothCtas,
        });

        const descriptionNode = getDescriptionNode();
        const anchors = descriptionNode.querySelectorAll('a');

        expect(anchors).toHaveLength(2);
        expect(anchors[0]).toHaveAttribute('href', 'http://example1.com');
        expect(anchors[0]).toHaveTextContent('Link 1 label');
        expect(anchors[1]).toHaveAttribute('href', 'http://example2.com');
        expect(anchors[1]).toHaveTextContent('Link 2 label');
        expect(descriptionNode.textContent).not.toContain('{link:');
    });

    test('renders one <br> per author line break', () => {
        renderCard({
            cardStyle: 'one-half',
            contentArea: {
                description: 'Line one\nLine two\nLine three',
            },
        });

        const descriptionNode = getDescriptionNode();
        const breaks = descriptionNode.querySelectorAll('br');

        expect(breaks).toHaveLength(2);
        expect(descriptionNode.textContent).toBe('Line oneLine twoLine three');
    });

    test('normalizes CRLF line endings to a single <br> per line', () => {
        renderCard({
            cardStyle: 'one-half',
            contentArea: {
                description: 'Line one\r\nLine two\r\nLine three',
            },
        });

        const descriptionNode = getDescriptionNode();
        const breaks = descriptionNode.querySelectorAll('br');

        expect(breaks).toHaveLength(2);
        expect(descriptionNode.textContent).not.toContain('\r');
        expect(descriptionNode.textContent).toBe('Line oneLine twoLine three');
    });

    test('renders a plain description with no links or newlines unchanged', () => {
        renderCard({
            cardStyle: 'one-half',
            contentArea: {
                description: 'Plain description with no links.',
            },
        });

        const descriptionNode = getDescriptionNode();

        expect(descriptionNode.textContent).toBe('Plain description with no links.');
        expect(descriptionNode.querySelectorAll('a')).toHaveLength(0);
        expect(descriptionNode.querySelectorAll('br')).toHaveLength(0);
    });

    test('drops an unresolved placeholder instead of leaving an empty anchor or literal token', () => {
        renderCard({
            cardStyle: 'one-half',
            contentArea: {
                description: 'See {link:cta1} today.',
            },
            footer: [],
        });

        const descriptionNode = getDescriptionNode();

        expect(descriptionNode.querySelectorAll('a')).toHaveLength(0);
        expect(descriptionNode.textContent).not.toContain('{link:cta');
    });

    test('drops a placeholder when the footer CTA is ambiguous (two right entries)', () => {
        renderCard({
            cardStyle: 'one-half',
            contentArea: {
                description: 'See {link:cta1} today.',
            },
            footer: [{
                left: [],
                right: [
                    { type: 'link', href: 'http://example1.com', text: 'Link 1 label' },
                    { type: 'link', href: 'http://example2.com', text: 'Link 2 label' },
                ],
                center: [],
            }],
        });

        const descriptionNode = getDescriptionNode();

        expect(descriptionNode.querySelectorAll('a')).toHaveLength(0);
        expect(descriptionNode.textContent).not.toContain('{link:cta');
    });

    test('escapes malicious CTA text so no extra element is injected', () => {
        renderCard({
            cardStyle: 'one-half',
            contentArea: {
                description: 'See {link:cta1} today.',
            },
            footer: [{
                left: [],
                right: [{ type: 'link', href: 'http://example1.com', text: '<img src=x onerror=1>' }],
                center: [],
            }],
        });

        const descriptionNode = getDescriptionNode();

        expect(descriptionNode.querySelectorAll('img')).toHaveLength(0);
        expect(descriptionNode.querySelectorAll('a')).toHaveLength(1);
        expect(descriptionNode.querySelectorAll('a')[0]).toHaveTextContent('<img src=x onerror=1>');
    });

    test('escapes a quoted CTA href so no extra attribute can be injected, while preserving query strings', () => {
        renderCard({
            cardStyle: 'one-half',
            contentArea: {
                description: 'See {link:cta1} today.',
            },
            footer: [{
                left: [],
                right: [{
                    type: 'link',
                    href: 'http://example.com/?a=1&b=2" onmouseover="alert(1)',
                    text: 'Link label',
                }],
                center: [],
            }],
        });

        const descriptionNode = getDescriptionNode();
        const anchor = descriptionNode.querySelector('a');

        expect(anchor).not.toBeNull();
        expect(anchor).not.toHaveAttribute('onmouseover');
        expect(anchor.getAttribute('href')).toBe('http://example.com/?a=1&b=2" onmouseover="alert(1)');
    });
});
