// jest-axe setup: register the a11y matcher for Jest
const { toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);