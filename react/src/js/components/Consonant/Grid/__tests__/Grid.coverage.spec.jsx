import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Grid from '../Grid';

// Minimal props to render Grid and exercise conditional code paths
describe('Grid coverage', () => {
  it('renders with minimal props', () => {
    render(
      <Grid
        cards={[]}
        resultsPerPage={0}
        pages={1}
        onCardBookmark={() => {}}
        isAriaLiveActive={false}
        renderOverlay={false}
      />
    );
  });
});

