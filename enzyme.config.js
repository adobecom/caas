/** Used in jest.config.js */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
// Override window.scrollTo in jsdom environment to prevent not-implemented errors in tests
if (typeof window !== 'undefined') {
    window.scrollTo = () => {};
}