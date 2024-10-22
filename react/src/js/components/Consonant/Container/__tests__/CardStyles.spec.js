import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    screen,
    act,
    render,
} from '@testing-library/react';

import Container from '../Container';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';
import config from '../../Testing/Mocks/config.json';
import cards from '../../Testing/Mocks/cards.json';


global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: 'ok',
        status: 200,
        statusText: 'success',
        url: 'test.html',
        json: () => Promise.resolve({ cards }),
    }));

setupIntersectionObserverMock();
jestMocks.lana();

describe('Consonant/Container/Card Styles', () => {
    test('can render the full-card style', async () => {
        const configToUse = config;
        configToUse.collection.cardStyle = 'full-card';
        await act(async () => render(<Container config={configToUse} />));
        const fullCards = screen.queryAllByTestId('consonant-FullCard');
        expect(fullCards).not.toBeNull();
    });

    test('can render the 1:1 card style', async () => {
        const configToUse = config;
        configToUse.collection.cardStyle = 'three-fourth';
        await act(async () => render(<Container config={configToUse} />));
        const oneByOneCards = screen.queryAllByTestId('consonant-ThreeFourthCard');
        expect(oneByOneCards).not.toBeNull();
    });

    test('should show all cards in case an invalid pagination type is authored', async () => {
        const configToUse = config;
        configToUse.pagination.type = 'not-valid';
        config.collection.cardStyle = 'one-half';
        await act(async () => render(<Container config={configToUse} />));
        const totalCards = cards.length;
        expect(screen.queryAllByTestId('consonant-Card-bannerImg')).toHaveLength(totalCards);
    });

    test('can render a mixed card collection', async () => {
        const configToUse = config;
        configToUse.totalCardsToShow = Number.MAX_SAFE_INTEGER;

        // this config render a mixed card collection
        config.collection.cardStyle = '';

        await act(async () => render(<Container config={configToUse} />));
        const totalCards = cards.length;
        expect(screen.queryAllByTestId('consonant-Card-bannerImg')).toHaveLength(totalCards);
    });
});

describe('Container Component - Intersection Observer', () => {
    beforeEach(() => {
        setupIntersectionObserverMock();
    });
    test('should set hasFetched and visibleStamp when box is in view', () => {
        const configToUse = { ...config, collection: { ...config.collection, lazyLoad: true } };
        const { container } = render(<Container config={configToUse} />);

        const box = container.querySelector('.box-class'); // Replace with the actual class or test ID
        const observerCallback = jest.fn();

        const observer = new IntersectionObserver(observerCallback);
        observer.observe(box);

        observerCallback([{ intersectionRatio: 1 }]);
        expect(observerCallback).toHaveBeenCalled();
    });
});
