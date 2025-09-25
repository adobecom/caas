const React = require('react');
const { render } = require('@testing-library/react');
const { axe, toHaveNoViolations } = require('jest-axe');

expect.extend(toHaveNoViolations);

describe('a11y sanity (no JSX)', () => {
  it('basic render has no axe violations', async () => {
    const { container } = render(
      React.createElement('div', null, [
        React.createElement('button', { 'aria-label': 'Confirm', key: 'b1' }),
      ]),
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

