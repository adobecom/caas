import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { axe } from 'jest-axe';
import { fireEvent, waitFor } from '@testing-library/react';
import makeSetup from '../Testing/Utils/Settings';
import Popup from './Popup';
import config from '../Testing/Mocks/config.json';

// Default props for Popup component
const DEFAULT_PROPS = {
  id: 'sort',
  val: config.sort.options[0],
  values: config.sort.options,
  onSelect: jest.fn(),
  autoWidth: false,
  optionsAlignment: 'left',
};
const setup = makeSetup(Popup, DEFAULT_PROPS);

describe('Sort Popup accessibility', () => {
  it('renders without accessibility violations', async () => {
    const { wrapper } = setup();
    const { container } = wrapper;
    // Button with aria-controls and aria-haspopup
    const btn = wrapper.getByTestId('consonant-Select-btn');
    expect(btn).toHaveAttribute('aria-haspopup', 'menu');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is keyboard accessible and no violations after interacting with popup', async () => {
    const { wrapper, props } = setup();
    const { container, getByTestId, getAllByTestId } = wrapper;
    const btn = getByTestId('consonant-Select-btn');
    // Open popup
    fireEvent.click(btn);
    await waitFor(() => getByTestId('consonant-Select-options'));
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    // Verify options
    const options = getAllByTestId('consonant-Select-option');
    expect(options.length).toBe(props.values.length);
    // Select second option
    fireEvent.click(options[1]);
    expect(props.onSelect).toHaveBeenCalledWith(props.values[1]);
    // Final accessibility check
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});