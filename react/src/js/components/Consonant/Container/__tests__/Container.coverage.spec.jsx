import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Container from '../Container';

// Mock child components that may require complex context/props
jest.mock('../../Filters/Top/Panel', () => () => null);
jest.mock('../../Filters/Left/Info', () => {
  const React = require('react');
  return {
    Info: React.forwardRef((props, ref) => React.createElement('div', { ref })),
  };
});
jest.mock('../../Filters/Left/Panel', () => {
  const React = require('react');
  return React.forwardRef((props, ref) => React.createElement('div', { ref }));
});
jest.mock('../../Sort/Popup', () => () => null);
jest.mock('../../Search/Search', () => () => null);
jest.mock('../../Loader/Loader', () => () => null);
jest.mock('../../Grid/Grid', () => () => null);
jest.mock('../../CardsCarousel/CardsCarousel', () => () => null);
jest.mock('../../Pagination/LoadMore', () => () => null);
jest.mock('../../Pagination/Paginator', () => () => null);
jest.mock('../../NoResults/View', () => () => {
  const React = require('react');
  return React.createElement('div', null, 'NoResults');
});
jest.mock('../../Bookmarks/Bookmarks', () => () => null);

describe('Container coverage boosts', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
    global.fetch = originalFetch;
  });

  const baseConfig = {
    collection: {
      endpoint: 'https://example.test/api',
      fallbackEndpoint: '',
      resultsPerPage: 5,
      totalCardsToShow: '10',
      reservoir: { sample: 0, pool: 0 },
      lazyload: false,
      useOverlayLinks: false,
      i18n: {
        title: 'Title',
        onErrorTitle: 'Error Title',
        onErrorDescription: 'Error Description',
      },
      layout: { container: 'grid' },
      partialLoadWithBackgroundFetch: { enabled: false, partialLoadCount: 0 },
      cardStyle: '1:2',
    },
    sort: { enabled: false, options: [], defaultSort: '' },
    filterPanel: {
      enabled: false,
      type: 'left',
      filters: [],
      filterLogic: 'and',
      showEmptyFilters: false,
      eventFilter: 'all',
      categories: [],
    },
    pagination: { type: 'paginator', enabled: false },
    bookmarks: { leftFilterPanel: { bookmarkOnlyCollection: false } },
    search: {
      enabled: false,
      searchFields: [],
      i18n: {
        leftFilterPanel: { searchPlaceholderText: '' },
        topFilterPanel: { searchPlaceholderText: '' },
        filterInfo: { searchPlaceholderText: '' },
        noResultsTitle: 'No results',
        noResultsDescription: 'Try another query',
      },
    },
    headers: {},
    analytics: { trackImpressions: false, collectionIdentifier: '' },
    target: { enabled: false, lastViewedSession: false },
    language: 'en-US',
    featuredCards: [],
    hideCtaIds: [],
    hideCtaTags: [],
  };

  it('renders API error view when fetch fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network fail'));
    render(<Container config={baseConfig} />);
    await waitFor(() => {
      expect(screen.getByText('NoResults')).toBeInTheDocument();
    });
  });
});
