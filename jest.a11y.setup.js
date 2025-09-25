// Jest a11y setup: RTL matchers and jest-axe matcher
require('@testing-library/jest-dom');
const { toHaveNoViolations } = require('jest-axe');

expect.extend(toHaveNoViolations);

