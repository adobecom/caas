import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import Container from '../Container/Container';
import config from '../Testing/Mocks/config.json';
import cards from '../Testing/Mocks/cards.json';

// Mock fetch to return cards data for load more tests
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

describe('LoadMore accessibility', () => {
  it('renders without accessibility violations', async () => {
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.pagination.type = 'loadMore';
    cfg.pagination.enabled = true;
    cfg.collection.resultsPerPage = 5;
    const { container } = render(<Container config={cfg} />);
    await waitFor(() => screen.getByTestId('consonant-LoadMore'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is keyboard accessible and no violations after interacting with load more button', async () => {
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.pagination.type = 'loadMore';
    cfg.pagination.enabled = true;
    cfg.collection.resultsPerPage = 5;
    const { container } = render(<Container config={cfg} />);
    const loadMore = await screen.findByTestId('consonant-LoadMore');
    const btn = screen.getByTestId('consonant-LoadMore-btn');
    // Keyboard focus on button
    btn.focus();
    expect(document.activeElement).toBe(btn);
    // Activate button
    fireEvent.click(btn);
    // Accessibility check after interaction
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});