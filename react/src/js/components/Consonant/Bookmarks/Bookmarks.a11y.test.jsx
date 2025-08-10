import React from 'react';
import { fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import makeSetup from '../Testing/Utils/Settings';
import Bookmarks from './Bookmarks';
import { DEFAULT_PROPS } from '../Testing/Constants/Bookmarks';

const setup = makeSetup(Bookmarks, DEFAULT_PROPS);

describe('Bookmarks accessibility', () => {
  it('renders without accessibility violations', async () => {
    const { wrapper } = setup();
    const { container } = wrapper;
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is keyboard accessible and has no violations after interaction', async () => {
    const { wrapper } = setup();
    const { getByTestId, container } = wrapper;
    const btn = getByTestId('consonant-Bookmarks');
    // Focus via keyboard
    btn.focus();
    expect(document.activeElement).toBe(btn);
    // Click to toggle bookmarks
    fireEvent.click(btn);
    // Re-run a11y check
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});