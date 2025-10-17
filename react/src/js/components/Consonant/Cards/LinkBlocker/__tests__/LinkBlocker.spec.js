import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LinkBlocker from '../LinkBlocker';

describe('LinkBlocker Component', () => {
  test('should set tabIndex to -1 when aria-hidden is true regardless of getsFocus', () => {
    render(
        <LinkBlocker 
            link="https://example.com"
            target="_blank"
            title="Example Link"
            ariaHidden
            getsFocus // This should be overridden by ariaHidden
            daa="test-daa"/>
    );
    
    const linkElement = document.querySelector('.consonant-LinkBlocker');
    expect(linkElement).toHaveAttribute('tabIndex', '-1');
    expect(linkElement).toHaveAttribute('aria-hidden', 'true');
  });

  test('should set tabIndex to -1 when getsFocus is false but not aria-hidden', () => {
    render(
        <LinkBlocker 
            link="https://example.com"
            target="_blank"
            title="Example Link"
            ariaHidden={false}
            getsFocus={false}
            daa="test-daa"/>
    );
    
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('tabIndex', '-1');
    expect(linkElement).not.toHaveAttribute('aria-hidden', 'true');
  });

  test('should set tabIndex to -1 when both ariaHidden and getsFocus are false', () => {
    render(
        <LinkBlocker 
            link="https://example.com"
            target="_blank"
            title="Example Link"
            ariaHidden={false}
            getsFocus={false}
            daa="test-daa"/>
    );
    
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('tabIndex', '-1');
  });

  test('should handle default props correctly with tabIndex -1', () => {
    render(<LinkBlocker />);
    
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('tabIndex', '-1');
    expect(linkElement).toHaveAttribute('href', '');
    expect(linkElement).toHaveAttribute('aria-label', '');
  });

  test('should evaluate expression (!ariaHidden && getsFocus) correctly for various combinations', () => {
    // Case 1: !false && true => true => tabIndex should be 0
    const { rerender } = render(
        <LinkBlocker ariaHidden={false} getsFocus />
    );
    let linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('tabIndex', '0');
    
    // Case 2: !true && true => false => tabIndex should be -1
    rerender(<LinkBlocker ariaHidden getsFocus />);
    linkElement = document.querySelector('.consonant-LinkBlocker');
    expect(linkElement).toHaveAttribute('tabIndex', '-1');
    
    // Case 3: !false && false => false => tabIndex should be -1
    rerender(<LinkBlocker ariaHidden={false} getsFocus={false} />);
    linkElement = document.querySelector('.consonant-LinkBlocker');
    expect(linkElement).toHaveAttribute('tabIndex', '-1');
    
    // Case 4: !true && false => false => tabIndex should be -1
    rerender(<LinkBlocker ariaHidden getsFocus={false} />);
    linkElement = document.querySelector('.consonant-LinkBlocker');
    expect(linkElement).toHaveAttribute('tabIndex', '-1');
  });
}); 