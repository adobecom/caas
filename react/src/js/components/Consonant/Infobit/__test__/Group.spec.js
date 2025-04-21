import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { INFOBIT_TYPE } from '../../Helpers/constants';

import Group from '../Group';

describe('Consonant/Infobits/Group', () => {
  const mockOnFocus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should render Button infobit correctly and pass props', () => {
    const title = 'Button Title';
    const tabIndex = '0';
    const renderOverlay = true;
    
    const renderList = [
      {
        type: INFOBIT_TYPE.BUTTON,
        text: 'Click Me',
        href: 'https://example.com'
      }
    ];

    render(
      <Group 
        renderList={renderList}
        onFocus={mockOnFocus}
        title={title}
        tabIndex={tabIndex}
        renderOverlay={renderOverlay}
      />
    );

    const buttonElement = screen.getByTestId('consonant-BtnInfobit');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('tabIndex', '-1'); // Should be -1 because renderOverlay is true
    expect(buttonElement).toHaveAttribute('href', 'https://example.com');
    expect(buttonElement.textContent).toBe('Click Me');
  });

  test('Should render Text infobit correctly', () => {
    const renderList = [
      {
        type: INFOBIT_TYPE.TEXT,
        text: 'Sample Text'
      }
    ];

    render(<Group renderList={renderList} />);
    const textElement = document.querySelector('.consonant-TextInfobit');
    expect(textElement).toBeInTheDocument();
    expect(textElement.textContent).toBe('Sample Text');
  });

  test('Should render Icon infobit correctly', () => {
    const renderList = [
      {
        type: INFOBIT_TYPE.ICON,
        src: 'icon.svg',
        alt: 'Icon Alt Text'
      }
    ];

    render(<Group renderList={renderList} />);
    expect(document.querySelector('.consonant-IconInfobit')).toBeInTheDocument();
  });

  test('Should render Link infobit correctly', () => {
    const title = 'Link Title';
    const renderList = [
      {
        type: INFOBIT_TYPE.LINK,
        href: 'https://example.com',
        text: 'Link Text'
      }
    ];

    render(<Group renderList={renderList} title={title} />);
    const linkElement = document.querySelector('.consonant-LinkInfobit');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://example.com');
  });

  test('Should render Gated infobit correctly', () => {
    const renderList = [
      {
        type: INFOBIT_TYPE.GATED,
        text: 'Gated Content'
      }
    ];

    render(<Group renderList={renderList} />);
    expect(document.querySelector('.consonant-GatedInfobit')).toBeInTheDocument();
  });

  test('Should render IconWithText infobit correctly', () => {
    const renderList = [
      {
        type: INFOBIT_TYPE.ICON_TEXT,
        text: 'Icon With Text',
        iconSrc: 'icon.svg'
      }
    ];

    render(<Group renderList={renderList} />);
    expect(document.querySelector('.consonant-IconWithTextInfobit')).toBeInTheDocument();
  });

  test('Should render multiple infobits correctly', () => {
    const renderList = [
      {
        type: INFOBIT_TYPE.TEXT,
        text: 'Text Item'
      },
      {
        type: INFOBIT_TYPE.BUTTON,
        text: 'Button Item',
        href: '#'
      },
      {
        type: INFOBIT_TYPE.ICON,
        src: 'icon.svg',
        alt: 'Icon Alt'
      }
    ];

    render(<Group renderList={renderList} />);
    
    expect(document.querySelector('.consonant-TextInfobit')).toBeInTheDocument();
    expect(document.querySelector('.consonant-BtnInfobit')).toBeInTheDocument();
    expect(document.querySelector('.consonant-IconInfobit')).toBeInTheDocument();
  });
});
