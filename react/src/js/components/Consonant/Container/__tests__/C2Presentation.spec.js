import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Container from '../Container';
import { isC2Presentation, getC2Presentation } from '../../Helpers/presentation';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';
import baseConfig from '../../Testing/Mocks/config.json';
import fixture from '../../../../../../../html/c2-poc/cards.json';

setupIntersectionObserverMock();
jestMocks.lana();

const configFor = overrides => ({
    ...baseConfig,
    collection: {
        ...baseConfig.collection,
        presentation: 'c2',
        cardStyle: '1:2',
        mode: 'light',
        showCardBadges: true,
        ...overrides,
    },
    filterPanel: { ...baseConfig.filterPanel, enabled: false },
});

beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(fixture),
    }));
});

test.each([
    { presentation: undefined },
    { presentation: 'legacy' },
    { presentation: 'unknown' },
    { presentation: true },
    { cardStyle: 'text-card' },
    { cardStyle: '' },
    { mode: 'dark' },
    { mode: 'darkest' },
    { layout: { type: '4up' } },
    { layout: { type: '3up', container: 'carousel' } },
])('unsupported collection retains legacy presentation: %j', (overrides) => {
    expect(isC2Presentation(configFor(overrides).collection)).toBe(false);
});

test.each(['1:2', 'one-half'])('supports the existing one-half identifier %s', (cardStyle) => {
    expect(getC2Presentation(configFor({ cardStyle }).collection)).toEqual({
        name: 'media',
        mediaAspectRatio: '16:9',
    });
});

test('scopes C2 per collection and switches markup back without losing the badge or CTA', async () => {
    let view;
    await act(async () => {
        view = render(<Container config={configFor({})} />);
    });
    expect(view.container.querySelector('.consonant-Wrapper')).toHaveClass('caas-c2');
    expect(view.container.querySelector('.consonant-Wrapper')).toHaveAttribute('data-c2-card', 'media');
    expect(view.container.querySelector('.consonant-Wrapper')).toHaveAttribute('data-c2-media-ratio', '16:9');
    expect(view.container.querySelectorAll('.caas-c2-mnemonic')).toHaveLength(2);
    expect(screen.getAllByText('eBook')).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: /^Read more / })).toHaveLength(3);
    expect(view.container.querySelector('.caas-c2-mnemonic')).toHaveAttribute('src', fixture.cards[0].styles.mnemonic);

    await act(async () => {
        view.rerender(<Container config={configFor({ presentation: 'legacy' })} />);
    });
    expect(view.container.querySelector('.consonant-Wrapper')).not.toHaveClass('caas-c2');
    expect(view.container.querySelectorAll('.caas-c2-mnemonic')).toHaveLength(0);
    expect(screen.getAllByText('eBook')).toHaveLength(3);
});

test('a C2 collection does not opt an adjacent legacy collection in', async () => {
    let view;
    await act(async () => {
        view = render(
            <div>
                <Container config={configFor({})} />
                <Container config={configFor({ presentation: undefined })} />
            </div>,
        );
    });
    const wrappers = view.container.querySelectorAll('.consonant-Wrapper');
    expect(wrappers).toHaveLength(2);
    expect(wrappers[0]).toHaveClass('caas-c2');
    expect(wrappers[1]).not.toHaveClass('caas-c2');
    expect(wrappers[1].querySelector('.caas-c2-mnemonic')).toBeNull();
});
