import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import makeSetup from '../Testing/Utils/Settings';
import Group from './Group';
import config from '../Testing/Mocks/config.json';

// Use comprehensive renderList covering all INFOBIT_TYPE variants
import { INFOBIT_TYPE } from '../Helpers/constants';
// Build a renderList with minimal props for each infobit type
const renderList = [
  { type: INFOBIT_TYPE.PRICE, price: '$100', term: 'USD' },
  { type: INFOBIT_TYPE.BUTTON, text: 'Click', href: '#', style: 'cta', iconSrc: '', iconAlt: '', iconPos: 'beforetext', isCta: false, onFocus: () => {}, title: 'Btn', tabIndex: 0, renderOverlay: false },
  { type: INFOBIT_TYPE.ICON_TEXT, src: '/icon.png', srcAltText: 'icon', text: 'WithIcon' },
  { type: INFOBIT_TYPE.LINK_ICON, href: '#', openInNewTab: false, linkHint: 'hint', text: 'LinkIcon', src: '/icon.png', srcAltText: 'icon' },
  { type: INFOBIT_TYPE.TEXT, text: 'Sample Info' },
  { type: INFOBIT_TYPE.ICON, src: '/icon.png', alt: 'icon' },
  { type: INFOBIT_TYPE.LINK, href: '#', linkHint: 'hint', text: 'JustLink', title: 'LinkTitle', tabIndex: 0 },
  { type: INFOBIT_TYPE.PROGRESS, label: 'Progress', completionText: 'Done', percentage: '50', color: '#000' },
  { type: INFOBIT_TYPE.RATING, label: 'Rated', totalStars: 5, starsFilled: 3 },
  { type: INFOBIT_TYPE.BOOKMARK, cardId: '1', isBookmarked: true, saveCardIcon: '', unsaveCardIcon: '', onClick: () => {}, disableBookmarkIco: false, isProductCard: false },
  { type: INFOBIT_TYPE.DATE, startTime: '2021-01-01T00:00', endTime: '2021-01-02T00:00', locale: 'en', dateFormat: 'LLL' },
  { type: INFOBIT_TYPE.GATED },
];
// Wraps Group with ConfigContext
const setup = makeSetup(Group, { renderList, onFocus: () => {}, title: 'TestGroup', tabIndex: 0, renderOverlay: false });

describe('Infobit Group accessibility', () => {
  it('renders without accessibility violations', async () => {
    const { wrapper } = setup();
    const { container } = wrapper;
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is keyboard accessible and has no violations after interacting with button infobit', async () => {
    const { wrapper } = setup();
    const { container, getByTestId } = wrapper;
    // Text infobit renders a paragraph
    expect(screen.getByText('Sample Info')).toBeInTheDocument();
    // Button infobit renders an anchor with test id
    const btn = getByTestId('consonant-BtnInfobit');
    btn.focus();
    expect(document.activeElement).toBe(btn);
    fireEvent.click(btn);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});