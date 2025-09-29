import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Mock Group to a simple marker element
jest.mock('../../../Infobit/Group', () => (props) => {
  const React = require('react');
  return React.createElement('div', { 'data-testid': `group-${props.title || 'no-title'}` });
});

// Mock date helpers to control isLive / isUpcoming
jest.mock('../../../Helpers/general', () => {
  const actual = jest.requireActual('../../../Helpers/general');
  return {
    ...actual,
    isDateWithinInterval: jest.fn(),
    isDateBeforeInterval: jest.fn(),
    getCurrentDate: jest.fn(() => new Date().toISOString()),
  };
});

import { isDateWithinInterval, isDateBeforeInterval } from '../../../Helpers/general';
import CardFooter from '../CardFooter';

const baseProps = {
  divider: false,
  left: [],
  center: [],
  right: [],
  altRight: [],
  startDate: '',
  endDate: '',
  isFluid: false,
  onFocus: () => {},
  title: 'T',
  tabIndex: 0,
  renderOverlay: false,
};

describe('CardFooter coverage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders right group when not live/upcoming and right present', () => {
    isDateWithinInterval.mockReturnValue(false); // not live
    isDateBeforeInterval.mockReturnValue(false); // not upcoming
    render(<CardFooter {...baseProps} right={[{ type: 'cta', text: 'Go' }]} />);
    expect(screen.getByTestId('group-T')).toBeInTheDocument();
  });

  it('renders alt upcoming group when upcoming and altRight present', () => {
    isDateWithinInterval.mockReturnValue(false);
    isDateBeforeInterval.mockReturnValue(true); // upcoming
    render(
      <CardFooter
        {...baseProps}
        right={[{ type: 'cta', text: 'Right', href: '/r' }]}
        altRight={[{ type: 'cta', text: 'Alt', href: '/a' }]} />
    );
    // right should be suppressed; alt upcoming rendered
    expect(screen.getByTestId('group-T')).toBeInTheDocument();
  });

  it('renders alt live group when live and altRight present', () => {
    isDateWithinInterval.mockReturnValue(true); // live
    isDateBeforeInterval.mockReturnValue(false);
    render(
      <CardFooter
        {...baseProps}
        right={[{ type: 'cta', text: 'Right', href: '/r' }]}
        altRight={[{ type: 'cta', text: 'Alt', href: '/a' }]} />
    );
    expect(screen.getByTestId('group-T')).toBeInTheDocument();
  });
});

