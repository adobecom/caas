// Aggregate test setup for older Jest versions that only accept a single setup file
// Import Enzyme config and jest-axe setup
/* eslint-disable import/no-unresolved */
require('./enzyme.config.js');
try {
  require('./jest-axe-setup.js');
} catch (e) {
  // Optional in some environments
}

// Minimal MutationObserver polyfill for JSDOM used in this project
if (typeof window !== 'undefined' && typeof window.MutationObserver === 'undefined') {
  class MockMutationObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() { return []; }
  }
  // eslint-disable-next-line no-undef
  global.MutationObserver = MockMutationObserver;
  window.MutationObserver = MockMutationObserver;
}

// Optional: guard common browser APIs
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {} });
}
if (typeof window !== 'undefined' && !window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
}
