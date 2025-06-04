import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import Container from '../Container/Container';
import config from '../Testing/Mocks/config.json';
import cards from '../Testing/Mocks/cards.json';

// Mock fetch to return cards data for pagination tests
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve({ cards }),
    })
  );
});
afterAll(() => {
  delete global.fetch;
});

describe('Paginator accessibility', () => {
  it('renders without accessibility violations', async () => {
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.pagination.type = 'paginator';
    cfg.pagination.enabled = true;
    // reduce items per page to ensure multiple pages
    cfg.collection.resultsPerPage = 5;
    const { container } = render(<Container config={cfg} />);
    // Wait for summary element to appear
    await waitFor(() => screen.getByTestId('consonant-Pagination-summary'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is keyboard accessible and no violations after interacting with paginator', async () => {
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.pagination.type = 'paginator';
    cfg.pagination.enabled = true;
    cfg.collection.resultsPerPage = 5;
    const { container } = render(<Container config={cfg} />);
    await waitFor(() => screen.getByTestId('consonant-Pagination-summary'));
    // Locate navigation buttons and page items
    const prevBtn = screen.getByTestId('consonant-Pagination-btn--prev');
    const nextBtn = screen.getByTestId('consonant-Pagination-btn--next');
    const pageItems = screen.getAllByTestId('consonant-Pagination-itemBtn');
    expect(prevBtn).toBeTruthy();
    expect(nextBtn).toBeTruthy();
    expect(pageItems.length).toBeGreaterThan(0);
    // Initial accessibility check
    let results = await axe(container);
    expect(results).toHaveNoViolations();
    // Keyboard focus and activate next
    nextBtn.focus();
    expect(document.activeElement).toBe(nextBtn);
    fireEvent.click(nextBtn);
    // Keyboard focus and activate prev
    prevBtn.focus();
    expect(document.activeElement).toBe(prevBtn);
    fireEvent.click(prevBtn);
    // Final accessibility check
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});