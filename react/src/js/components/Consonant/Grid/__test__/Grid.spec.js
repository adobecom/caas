import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Grid from '../Grid';

import { DEFAULT_PROPS, GRID_ANALYTICS } from '../../Testing/Constants/Grid';

import setup from '../../Testing/Utils/Settings';

const renderCardsGrid = setup(Grid, DEFAULT_PROPS);

describe('Consonant/Grid', () => {
    test('should render 1 card if on page 1 and 1 card rendered per page', () => {
        renderCardsGrid({ page: 1 });

        const cardElementList = screen.queryAllByTestId('consonant-Card');

        expect(cardElementList).toHaveLength(1);
    });
    test('should be able to render all cards', () => {
        const {
            props: { cards },
        } = renderCardsGrid({ resultsPerPage: Number.MAX_SAFE_INTEGER }, { pagination: { type: 'loadMore' } });

        const threeByTwoCards = screen.queryAllByTestId('consonant-Card');
        const oneByOneCards = screen.queryAllByTestId('consonant-ThreeFourthCard');
        const fullCards = screen.queryAllByTestId('consonant-FullCard');

        const totalCards = threeByTwoCards.length + oneByOneCards.length + fullCards.length;
        expect(totalCards).toEqual(cards.length);
    });
    test('should load analytics onto cards', () => {
        renderCardsGrid({ resultsPerPage: Number.MAX_SAFE_INTEGER }, { pagination: { type: 'loadMore' } });
        const fullCards = screen.queryAllByTestId('consonant-Card');
        fullCards.forEach((card, index) => {
            expect(card).toHaveAttribute('daa-lh', GRID_ANALYTICS[index]);
        });
    });
    test('should set aria-live to off by default', () => {
        renderCardsGrid();

        const cardContainer = screen.getByTestId('consonant-CardsGrid');
        expect(cardContainer).toHaveAttribute('aria-live', 'off');
    });
    test('should set aria-live to polite with ariaLive prop set to true', () => {
        renderCardsGrid({ isAriaLiveActive: true });

        const cardContainer = screen.getByTestId('consonant-CardsGrid');
        expect(cardContainer).toHaveAttribute('aria-live', 'polite');
    });

    test('should render a different number of cards per page', () => {
        renderCardsGrid({ resultsPerPage: 2 });
        const cardElementList = screen.queryAllByTestId('consonant-Card');
        expect(cardElementList).toHaveLength(2);
    });
   
    // New tests below to increase coverage
    test('should apply correct class for 2-up grid layout', () => {
        renderCardsGrid({}, { collection: { layout: { type: '2up' } } });
        const gridElement = screen.getByTestId('consonant-CardsGrid');
        expect(gridElement).toHaveClass('consonant-CardsGrid--2up');
    });
    
    test('should apply correct class for 3-up grid layout', () => {
        renderCardsGrid({}, { collection: { layout: { type: '3up' } } });
        const gridElement = screen.getByTestId('consonant-CardsGrid');
        expect(gridElement).toHaveClass('consonant-CardsGrid--3up');
    });
    
    test('should apply correct class for 4-up grid layout', () => {
        renderCardsGrid({}, { collection: { layout: { type: '4up' } } });
        const gridElement = screen.getByTestId('consonant-CardsGrid');
        expect(gridElement).toHaveClass('consonant-CardsGrid--4up');
    });
    
    test('should apply correct class for 5-up grid layout', () => {
        renderCardsGrid({}, { collection: { layout: { type: '5up' } } });
        const gridElement = screen.getByTestId('consonant-CardsGrid');
        expect(gridElement).toHaveClass('consonant-CardsGrid--5up');
    });
    
    test('should apply correct gutter classes for 1x', () => {
        renderCardsGrid({}, { collection: { layout: { gutter: '1x' } } });
        let gridElement = screen.getByTestId('consonant-CardsGrid');
        expect(gridElement).toHaveClass('consonant-CardsGrid--with1xGutter');
    });

    test('should apply correct gutter classes for 2x', () => {
        renderCardsGrid({}, { collection: { layout: { gutter: '2x' } } });
        let gridElement = screen.getByTestId('consonant-CardsGrid');
        expect(gridElement).toHaveClass('consonant-CardsGrid--with2xGutter');
    });

    test('should apply correct gutter classes for 3x', () => {
        renderCardsGrid({}, { collection: { layout: { gutter: '3x' } } });
        let gridElement = screen.getByTestId('consonant-CardsGrid');
        expect(gridElement).toHaveClass('consonant-CardsGrid--with3xGutter');
    });

    test('should apply correct gutter classes for 4x', () => {
        renderCardsGrid({}, { collection: { layout: { gutter: '4x' } } });
        let gridElement = screen.getByTestId('consonant-CardsGrid');
        expect(gridElement).toHaveClass('consonant-CardsGrid--with4xGutter');
    });    
    
    test('should apply one-half card style class when specified', () => {
        renderCardsGrid({}, { collection: { cardStyle: '1:2' } });
        const cardElement = screen.getByTestId('consonant-Card');
        expect(cardElement).toHaveClass('one-half');
    });

    test('should apply three-fourths card style class when specified', () => {
        renderCardsGrid({}, { collection: { cardStyle: '3:4' } });
        const cardElement = screen.getByTestId('consonant-Card');
        expect(cardElement).toHaveClass('three-fourths');
    });

    test('should apply full card style class when specified', () => {
        renderCardsGrid({}, { collection: { cardStyle: 'full' } });
        const cardElement = screen.getByTestId('consonant-Card');
        expect(cardElement).toHaveClass('full');
    });

    test('should apply half-height card style class when specified', () => {
        renderCardsGrid({}, { collection: { cardStyle: 'half-height' } });
        const cardElement = screen.getByTestId('consonant-Card');
        expect(cardElement).toHaveClass('half-height');
    });
    
    test('should apply product card style class when specified', () => {
        renderCardsGrid({}, { collection: { cardStyle: 'product' } });
        const cardElement = screen.getByTestId('consonant-Card');
        expect(cardElement).toHaveClass('product');
    });

    test('should apply text card style class when specified', () => {
        renderCardsGrid({}, { collection: { cardStyle: 'text' } });
        const cardElement = screen.getByTestId('consonant-Card');
        expect(cardElement).toHaveClass('text');
    });

    test('should apply icon card style class when specified', () => {
        renderCardsGrid({}, { collection: { cardStyle: 'icon' } });
        const cardElement = screen.getByTestId('consonant-Card');
        expect(cardElement).toHaveClass('icon');
    });

    test('should apply news card style class when specified', () => {
        renderCardsGrid({}, { collection: { cardStyle: 'news' } });
        const cardElement = screen.getByTestId('consonant-Card');
        expect(cardElement).toHaveClass('news');
    });

    test('should apply card hover grow effect when specified', () => {
        renderCardsGrid({}, { collection: { cardHoverEffect: 'grow' } });
        const gridElement = screen.getByTestId('consonant-CardsGrid');
        expect(gridElement).toHaveClass('card-hover-grow');
    });
    
    test('should correctly handle paginator type pagination', () => {
        const {} = renderCardsGrid(
            { resultsPerPage: 2, pages: 1 },
            { pagination: { type: 'paginator' } }
        );
        
        const cardElements = screen.queryAllByTestId('consonant-Card');
        expect(cardElements).toHaveLength(2);
    });
    
    test('should set data-card-style attribute correctly', () => {
        renderCardsGrid({}, { collection: { cardStyle: 'one-half' } });
        const gridElement = screen.getByTestId('consonant-CardsGrid');
        expect(gridElement).toHaveAttribute('data-card-style', 'one-half');
    });
      
    test('should handle empty cards array', () => {
        renderCardsGrid({ cards: [] });
        
        const gridElement = screen.queryByTestId('consonant-CardsGrid');
        expect(gridElement).not.toBeInTheDocument();
    });
       
    test('should handle malformed custom card function gracefully', () => {
        // Test with a broken customCard function
        renderCardsGrid({}, { 
            customCard: ['', 'this is not a valid function'],
            collection: { cardStyle: 'custom' } 
        });
        
        // The component should not crash
        const gridElement = screen.queryByTestId('consonant-CardsGrid');
        expect(gridElement).toBeInTheDocument();
    });

    test('should not show CTA button when showCTA prop is false', () => {
        renderCardsGrid({}, { collection: { button: {style: 'hidden' } } });
        const ctaButton = screen.queryByTestId('consonant-BtnInfobit');
        expect(ctaButton).not.toBeInTheDocument();
    });
});
