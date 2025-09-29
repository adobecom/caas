import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { getCardWidth, userIsTabbing } from '../CardsCarousel';

jest.mock('../../Helpers/hooks', () => {
  const actual = jest.requireActual('../../Helpers/hooks');
  return { ...actual, useConfig: jest.fn(() => () => '') };
});

describe('CardsCarousel helpers coverage', () => {
  it('getCardWidth returns 0 for invalid size/gap', () => {
    expect(getCardWidth('9up', 16)).toBe(0);
    expect(getCardWidth('3up', 99)).toBe(0);
  });

  it('userIsTabbing reflects body class', () => {
    document.body.classList.add('tabbing');
    expect(userIsTabbing()).toBe(true);
    document.body.classList.remove('tabbing');
    expect(userIsTabbing()).toBe(false);
  });
});

