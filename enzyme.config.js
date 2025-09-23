/** Used in jest.config.js */
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

// Override window.scrollTo in jsdom environment to prevent not-implemented errors in tests
if (typeof window !== 'undefined') {
    window.scrollTo = () => {};
}
