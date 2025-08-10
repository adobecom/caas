import React, { createRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { axe } from 'jest-axe';
import VideoModal from './videoModal';

describe('VideoModal accessibility', () => {
  const defaultProps = {
    name: 'test',
    videoURL: 'https://example.com/video.mp4',
    videoPolicy: 'autoplay; fullscreen',
    innerRef: createRef(),
  };

  it('renders without accessibility violations', async () => {
    const { container } = render(<VideoModal {...defaultProps} />);
    // Wait for dialog role element
    await waitFor(() => screen.getByRole('dialog'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is keyboard accessible and no violations after interacting with close button', async () => {
    const { container } = render(<VideoModal {...defaultProps} />);
    const dialog = await screen.findByRole('dialog');
    // Check iframe inside dialog
    const iframe = screen.getByTitle('Featured Video');
    expect(iframe).toHaveAttribute('src', defaultProps.videoURL);
    // Locate close button
    const closeBtn = screen.getByRole('button', { name: /close/i });
    // Focus and activate close button
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);
    fireEvent.click(closeBtn);
    // Re-run accessibility check
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});