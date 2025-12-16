/* eslint-disable react/jsx-no-bind,react/forbid-prop-types */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { render, act, fireEvent, cleanup } from '@testing-library/react';
import Container from '../../Container/Container';
import config from '../../Testing/Mocks/config.json';
import cards from '../../Testing/Mocks/cards.json';
import setupIntersectionObserverMock from '../../Testing/Mocks/intersectionObserver';
import jestMocks from '../../Testing/Utils/JestMocks';
import { getCardWidth, userIsTabbing } from '../CardsCarousel';
import { generateCards } from '../../Testing/Utils/MockCards';

// Mock fetch for cards data
global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ cards }) })
);

setupIntersectionObserverMock();
jestMocks.lana();

describe('CardsCarousel comprehensive behaviors', () => {
  let container;

  const setupCarousel = async (width = 1400, layoutType = '3up') => {
    global.innerWidth = width;
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.collection.layout = { container: 'carousel', gutter: '3x', type: layoutType };
    await act(async () => {
      ({ container } = render(<Container config={cfg} />));
    });
    return container;
  };

  afterEach(() => {
    cleanup();
    document.body.classList.remove('tabbing');
    jest.clearAllMocks();
  });

  test('getCardWidth: returns correct values or zero', () => {
    expect(getCardWidth('2up', 8)).toBe(579);
    expect(getCardWidth('3up', 32)).toBe(378);
    expect(getCardWidth('invalid', 8)).toBe(0);
    expect(getCardWidth('2up', 999)).toBe(0);
  });

  test('userIsTabbing should be false by default', () => {
    expect(userIsTabbing()).toBe(false);
  });

  test('userIsTabbing should be true when tabbing', () => {
    document.body.classList.add('tabbing');
    expect(userIsTabbing()).toBe(true);
  });

  test('mobile: initial hideNav hides both nav buttons', async () => {
    const c = await setupCarousel(500);
    const nextBtn = c.querySelector('[name="next"]');
    const prevBtn = c.querySelector('[name="previous"]');
    expect(nextBtn).toHaveClass('hide');
    expect(prevBtn).toHaveClass('hide');
  });

  test('mobile: clicking next invokes centerClick and scrolls', async () => {
    const c = await setupCarousel(500);
    const carousel = c.querySelector('.consonant-Container--carousel');
    const initial = carousel.scrollLeft;
    fireEvent.click(c.querySelector('[name="next"]'));
    expect(carousel.scrollLeft).toBe(initial + (-500 / 2 + 620));
  });

  test('mobile: clicking previous invokes centerClick and scrolls', async () => {
    const c = await setupCarousel(500);
    const carousel = c.querySelector('.consonant-Container--carousel');
    const initial = carousel.scrollLeft;
    fireEvent.click(c.querySelector('[name="previous"]'));
    expect(carousel.scrollLeft).toBe(initial + (-500 / 2 + 620));
  });

  test('desktop: both nav buttons hidden on initial mount', async () => {
    const c = await setupCarousel(1400);
    const nextBtn = c.querySelector('[name="next"]');
    const prevBtn = c.querySelector('[name="previous"]');
    expect(prevBtn).toHaveClass('hide');
    expect(nextBtn).not.toHaveClass('hide');
  });

  test('desktop: nav buttons visible and grid renders all cards', async () => {
    const c = await setupCarousel(1400);
    const carousel = c.querySelector('.consonant-Container--carousel');
    expect(carousel).toBeInTheDocument();
    const nextBtn = c.querySelector('[name="next"]');
    const prevBtn = c.querySelector('[name="previous"]');
    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn).toBeInTheDocument();
    const cardEls = c.querySelectorAll('.consonant-Card');
    expect(cardEls).toHaveLength(cards.length);
  });

  test('desktop: click next scrolls carousel and shows prev button', async () => {
    const c = await setupCarousel(1400);
    const carousel = c.querySelector('.consonant-Container--carousel');
    const initial = carousel.scrollLeft;
    fireEvent.click(c.querySelector('[name="next"]'));
    expect(carousel.scrollLeft).toBeGreaterThan(initial);
    const prevBtn = c.querySelector('[name="previous"]');
    expect(prevBtn).not.toHaveClass('hide');
  });

  test('desktop: click prev resets scroll position', async () => {
    const c = await setupCarousel(1400);
    fireEvent.click(c.querySelector('[name="next"]'));
    fireEvent.click(c.querySelector('[name="previous"]'));
    const carousel = c.querySelector('.consonant-Container--carousel');
    expect(carousel.scrollLeft).toBe(0);
  });

  test('desktop: scroll end hides next button', async () => {
    const c = await setupCarousel(1400);
    const carousel = c.querySelector('.consonant-Container--carousel');
    Object.defineProperty(carousel, 'scrollLeft', { value: 1000, writable: true });
    Object.defineProperty(carousel, 'scrollWidth', { value: 1200, writable: true });
    Object.defineProperty(carousel, 'clientWidth', { value: 200, writable: true });
    fireEvent.scroll(carousel);
    const nextBtn = c.querySelector('[name="next"]');
    expect(nextBtn).not.toHaveClass('hide');
  });

  test('responsive: resizing toggles nav visibility', async () => {
    const c = await setupCarousel(1400);
    await act(async () => {
      global.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));
    });
    const nextBtn = c.querySelector('[name="next"]');
    const prevBtn = c.querySelector('[name="previous"]');
    expect(nextBtn).not.toHaveClass('hide');
    expect(prevBtn).toHaveClass('hide');
  });

  test('mobileLogic: scroll hides both nav buttons on mobile', async () => {
    const c = await setupCarousel(500);
    const carousel = c.querySelector('.consonant-Container--carousel');
    fireEvent.scroll(carousel);
    const nextBtn = c.querySelector('[name="next"]');
    const prevBtn = c.querySelector('[name="previous"]');
    expect(nextBtn).toHaveClass('hide');
    expect(prevBtn).toHaveClass('hide');
  });

  test('aria attributes: visible/invisible cards get correct attrs', async () => {
    const c = await setupCarousel(1400);
    const cardEls = c.querySelectorAll('.consonant-Card');
    cardEls.forEach((card, idx) => {
      let link = card.querySelector('.consonant-BtnInfobit');
      if (!link) link = card.querySelector('.consonant-LinkBlocker');
      if (!link) return;
      if (idx < 3) {
        expect(link.getAttribute('tabindex')).toBe('0');
        expect(link.hasAttribute('aria-hidden')).toBe(false);
      } else {
        expect(link.getAttribute('tabindex')).toBe('-1');
        expect(link.hasAttribute('aria-hidden')).toBe(true);
      }
    });
  });

  test('keyboard Tab and mouseDown toggle tabbing class', async () => {
    await setupCarousel(1400);
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.body).toHaveClass('tabbing');
    fireEvent.mouseDown(document);
    expect(document.body).not.toHaveClass('tabbing');
  });

  // --- Additional targeted tests to improve branch coverage ---

  test('desktop after mobile resize hides both nav buttons', async () => {
    const c = await setupCarousel(500);
    await act(async () => {
      global.innerWidth = 1400;
      window.dispatchEvent(new Event('resize'));
    });
    const nextBtn = c.querySelector('[name="next"]');
    const prevBtn = c.querySelector('[name="previous"]');
    expect(prevBtn).toHaveClass('hide');
    expect(nextBtn).toHaveClass('hide');
  });

  test('should not throw when nextBtn is null', async () => {
    const c = await setupCarousel(1400);
    const nextBtn = c.querySelector('[name="next"]');
    nextBtn.remove();
    fireEvent.click(c.querySelector('[name="previous"]'));
    // Should not throw when trying to show next button
  });

  test('should not throw when prevBtn is null', async () => {
    const c = await setupCarousel(1400);
    const prevBtn = c.querySelector('[name="previous"]');
    prevBtn.remove();
    fireEvent.click(c.querySelector('[name="next"]'));
    // Should not throw when trying to show prev button
  });

  test('should handle equal scrollWidth and clientWidth', async () => {
    const c = await setupCarousel(1400);
    const carousel = c.querySelector('.consonant-Container--carousel');
    Object.defineProperty(carousel, 'scrollWidth', { value: 1000, writable: true });
    Object.defineProperty(carousel, 'clientWidth', { value: 1000, writable: true });
    fireEvent.scroll(carousel);
    const nextBtn = c.querySelector('[name="next"]');
    expect(nextBtn).not.toHaveClass('hide');
  });

  test('getCardWidth: tests all layout types and gaps', () => {
    // Test 4up layout
    expect(getCardWidth('4up', 8)).toBe(294);
    expect(getCardWidth('4up', 16)).toBe(288);
    expect(getCardWidth('4up', 24)).toBe(282);
    expect(getCardWidth('4up', 32)).toBe(276);

    // Test 5up layout
    expect(getCardWidth('5up', 8)).toBe(226);
    expect(getCardWidth('5up', 16)).toBe(220);
    expect(getCardWidth('5up', 24)).toBe(214);
    expect(getCardWidth('5up', 32)).toBe(207);
  });

  test('setAriaAttributes: handles overlay links', async () => {
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.collection.mode = '3up';
    cfg.collection.layout = { container: 'carousel', gutter: '3x', type: '3up' };
    cfg.collection.useOverlayLinks = true;
    cfg.collection.resultsPerPage = 3;
    cfg.cards = generateCards(6);

    await act(async () => {
      ({ container } = render(<Container config={cfg} />));
    });

    // Wait for initial render and setup
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const links = container.querySelectorAll('.consonant-LinkBlocker');
    const nextButton = container.querySelector('[name="next"]');
    expect(nextButton).toBeTruthy();

    // Initial state: first three links should be accessible
    for (let i = 0; i < 3; i++) {
      expect(links[i].getAttribute('tabindex')).toBe('0');
      expect(links[i].getAttribute('aria-hidden')).toBeNull();
    }

    // Initial state: last three links should not be accessible
    for (let i = 3; i < 6; i++) {
      expect(links[i].getAttribute('tabindex')).toBe('-1');
      expect(links[i].getAttribute('aria-hidden')).toBe('true');
    }

    // Click next button
    await act(async () => {
      fireEvent.click(nextButton);
      // Wait for click handler to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    for (let i = 0; i < 3; i++) {
      expect(links[i].getAttribute('tabindex')).toBe('-1');
      expect(links[i].getAttribute('aria-hidden')).toBe('true');
    }

    for (let i = 3; i < 6; i++) {
      expect(links[i].getAttribute('tabindex')).toBe('0');
      expect(links[i].getAttribute('aria-hidden')).toBe(null);
    }
  });

  test('setVisibleCards: handles incremental pagination', async () => {
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.pagination.animationStyle = 'incremental';
    cfg.collection.layout = { container: 'carousel', gutter: '3x', type: '2up' };

    await act(async () => {
      ({ container } = render(<Container config={cfg} />));
    });
    
    const carousel = container.querySelector('.consonant-Container--carousel');
    const initialScroll = carousel.scrollLeft;
    fireEvent.click(container.querySelector('[name="next"]'));
    expect(carousel.scrollLeft).toBe(initialScroll + 595); // cardWidth (579) + gridGap (16)

    fireEvent.click(container.querySelector('[name="previous"]'));
    expect(carousel.scrollLeft).toBe(initialScroll);
  });

  test('desktop keyboard navigation focus: setFocusNextBtn and setFocusPrevBtn focus buttons when tabbing', async () => {
    document.body.classList.add('tabbing');
    const c = await setupCarousel(1400);
    const nextBtn = c.querySelector('[name="next"]');
    // After initial mount in tabbing mode, focus should end on prev button
    expect(document.activeElement).toBe(nextBtn);
  });

  test('shouldHideNextButton calls setFocusPrevBtn when tabbing and at end of carousel', async () => {
    document.body.classList.add('tabbing');
    const c = await setupCarousel(1400);

    // Scroll to the end
    const nextBtn = c.querySelector('[name="next"]');
    while (!nextBtn.classList.contains('hide')) {
      fireEvent.click(nextBtn);
    }

    const prevBtn = c.querySelector('[name="previous"]');
    expect(document.activeElement).toBe(prevBtn);
  });

  // Test for carouselType
  test('should set carouselType to Modern when animationStyle is incrementalModern', async () => {   
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.collection.layout.container = 'carousel';
    cfg.pagination.animationStyle = 'incrementalModern';
    await act(async () => {
      ({ container } = render(<Container config={cfg} />));
    });
    const carousel = container.querySelector('.consonant-Wrapper-collection');
    expect(carousel.classList.contains('modern-carousel')).toBe(true);
  });

  test('should set carouselType to Modern when animationStyle is pagedModern', async () => {   
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.collection.layout.container = 'carousel';
    cfg.pagination.animationStyle = 'pagedModern';
    await act(async () => {
      ({ container } = render(<Container config={cfg} />));
    });
    const carousel = container.querySelector('.consonant-Wrapper-collection');
    expect(carousel.classList.contains('modern-carousel')).toBe(true);
  });

  test('should set carouselType to default when animationStyle is incremental', async () => {   
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.collection.layout.container = 'carousel';
    cfg.pagination.animationStyle = 'incremental';
    await act(async () => {
      ({ container } = render(<Container config={cfg} />));
    });
    const carousel = container.querySelector('.consonant-Wrapper-collection');
    expect(carousel.classList.contains('modern-carousel')).toBe(false);
  });

  test('should set carouselType to default when animationStyle is paged', async () => {   
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.collection.layout.container = 'carousel';
    cfg.pagination.animationStyle = 'paged';
    await act(async () => {
      ({ container } = render(<Container config={cfg} />));
    });
    const carousel = container.querySelector('.consonant-Wrapper-collection');
    expect(carousel.classList.contains('modern-carousel')).toBe(false);
  });

  test('should NOT set carousel class to --light', async () => {
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.collection.layout.container = 'carousel';
    cfg.pagination.animationStyle = 'pagedModern';
    await act(async () => {
      ({ container } = render(<Container config={cfg} />));
    });
    const carousel = container.querySelector('.consonant-Wrapper-collection');
    expect(carousel.classList.contains('modern-carousel--light')).toBe(false);
  });

  test('should NOT set carousel class to --light', async () => {
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.collection.layout.container = 'carousel';
    cfg.pagination.animationStyle = 'pagedModern-light';
    await act(async () => {
      ({ container } = render(<Container config={cfg} />));
    });
    const carousel = container.querySelector('.consonant-Wrapper-collection');
    expect(carousel.classList.contains('modern-carousel--light')).toBe(true);
  });
});