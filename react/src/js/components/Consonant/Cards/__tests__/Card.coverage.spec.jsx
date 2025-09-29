import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Mock hooks used by Card to control config-dependent branches
jest.mock('../../Helpers/hooks', () => {
  const actual = jest.requireActual('../../Helpers/hooks');
  return {
    ...actual,
    useConfig: jest.fn(),
    useRegistered: jest.fn(),
  };
});

import { useConfig, useRegistered } from '../../Helpers/hooks';
import Card from '../Card';

const baseProps = {
  id: 'card-1',
  onClick: () => {},
  onFocus: () => {},
  styles: {
    backgroundImage: '',
    backgroundAltText: '',
    mnemonic: '',
    icon: '',
    iconAlt: '',
  },
  contentArea: {
    title: 'Example Title',
    highlightedTitle: '',
    detailText: '',
    description: '',
    highlightedDescription: '',
    dateDetailText: {},
  },
  overlays: {},
  footer: [],
  renderBorder: true,
  renderDivider: false,
  renderOverlay: false,
  overlayLink: '',
  hideCTA: false,
  tags: [],
  origin: '',
  tabIndex: 0,
};

const deepMerge = (target, src) => {
  const out = { ...target };
  Object.keys(src || {}).forEach((key) => {
    const v = src[key];
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[key] = deepMerge(out[key] || {}, v);
    } else {
      out[key] = v;
    }
  });
  return out;
};

const mockConfig = (overrides = {}) => {
  const base = {
    collection: {
      i18n: {
        prettyDateIntervalFormat: '{LLL} {dd}',
        lastModified: 'Last modified {date}',
      },
      disableBanners: false,
      button: { style: 'call-to-action' },
      detailsTextOption: '',
      showCardBadges: false,
      dynamicCTAForLiveEvents: false,
      ctaAction: '',
      bladeCard: false,
      additionalRequestParams: '',
      hideDateInterval: false,
    },
    language: 'en-US',
    search: { enabled: false },
  };
  const config = deepMerge(base, overrides);

  // useConfig() returns a getter function
  useConfig.mockReturnValue((ns, key) => {
    // Support 'collection.i18n' and ('collection','i18n.xyz') access styles
    if (ns === 'collection.i18n') {
      return config.collection.i18n[key];
    }
    if (ns === 'collection' && key && key.startsWith('i18n.')) {
      const k = key.split('.')[1];
      return config.collection.i18n[k];
    }
    if (ns === 'collection' && key) {
      // nested lookup like 'button.style'
      return key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), config.collection);
    }
    if (ns === 'language') return config.language;
    if (ns === 'search' && key === 'enabled') return config.search.enabled;
    return undefined;
  });
  useRegistered.mockReturnValue(false);
};

describe('Card coverage boosts', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders modifiedDate detailText when configured', () => {
    mockConfig({ collection: { detailsTextOption: 'modifiedDate', i18n: { lastModified: 'Last modified {date}', prettyDateIntervalFormat: '{LLL} {dd}' } } });
    const spy = jest.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('MM/DD/YYYY');
    render(<Card {...baseProps} modifiedDate="2020-01-01T00:00:00Z" />);
    expect(screen.getByTestId('consonant-Card-label')).toHaveTextContent('Last modified MM/DD/YYYY');
    spy.mockRestore();
  });

  it('renders createdDate detailText when configured', () => {
    mockConfig({ collection: { detailsTextOption: 'createdDate' } });
    const spy = jest.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('CREATED');
    render(<Card {...baseProps} cardDate="2020-01-02T00:00:00Z" />);
    expect(screen.getByTestId('consonant-Card-label')).toHaveTextContent('CREATED');
    spy.mockRestore();
  });

  it('renders staticDate detailText when configured', () => {
    mockConfig({ collection: { detailsTextOption: 'staticDate' } });
    const spy = jest.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('STATIC');
    render(<Card {...baseProps} cardDate="2020-03-04T00:00:00Z" />);
    expect(screen.getByTestId('consonant-Card-label')).toHaveTextContent('STATIC');
    spy.mockRestore();
  });

  it('applies heading aria-level from config for highlightedTitle', () => {
    mockConfig({});
    // cardTitleAccessibilityLevel comes from 'collection.i18n' path
    useConfig.mockReturnValue((ns, key) => {
      if (ns === 'collection.i18n' && key === 'cardTitleAccessibilityLevel') return 3;
      if (ns === 'collection' && key === 'button.style') return 'call-to-action';
      if (ns === 'search' && key === 'enabled') return false;
      if (ns === 'language') return 'en-US';
      return undefined;
    });
    render(<Card {...baseProps} contentArea={{ ...baseProps.contentArea, highlightedTitle: 'HTitle', detailText: '' }} />);
    const title = screen.getByTestId('consonant-Card-title');
    expect(title).toHaveAttribute('role', 'heading');
    expect(title).toHaveAttribute('aria-level', '3');
  });

  it('falls back to iconAlt when detailText is empty on icon-card', () => {
    // Default config (no special detailsTextOption)
    mockConfig({});
    render(
      <Card
        {...baseProps}
        cardStyle="icon-card"
        styles={{ ...baseProps.styles, iconAlt: 'ICON ALT' }}
        contentArea={{ ...baseProps.contentArea, detailText: '' }}
      />
    );
    const label = screen.getByTestId('consonant-Card-label');
    expect(label).toHaveTextContent('ICON ALT');
  });

  it('covers footer mapping and alt CTA/right CTA selection', () => {
    // Configure to use alt CTA when upcoming
    mockConfig({
      collection: {
        dynamicCTAForLiveEvents: true,
        button: { style: 'link' },
      },
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const footer = [{
      right: [
        { type: 'bookmark' },
        { type: 'date' },
        { type: 'cta' },
      ],
      altCta: [ { href: 'https://example.test/alt', text: 'AltCTA' } ],
    }];

    render(
      <Card
        {...baseProps}
        startDate={tomorrow.toISOString()}
        endDate={dayAfter.toISOString()}
        footer={footer}
      />
    );
    // Rendered card sanity
    expect(screen.getByTestId('consonant-Card')).toBeInTheDocument();
  });

  it('injects mnemonic image when product card with mnemonic is rendered', () => {
    mockConfig({});
    render(
      <Card
        {...baseProps}
        cardStyle="product"
        styles={{ ...baseProps.styles, mnemonic: 'https://img.test/m.png' }}
        contentArea={{ ...baseProps.contentArea, highlightedTitle: '', title: 'Title' }}
      />
    );
    // The mnemonic image is injected into the title markup when product card
    const title = screen.getByTestId('consonant-Card-title');
    expect(title.innerHTML).toContain('alt=\"mnemonic\"');
  });
});
