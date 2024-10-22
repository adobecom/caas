/* eslint-disable */
import { ConsonantPageModel } from '../ConsonantPageDOM';
describe('ConsonantPageModel', () => {
    let element;

    beforeEach(() => {
        // Create a mock DOM element
        element = document.createElement('div');
        element.setAttribute('id', 'test-id');
        element.setAttribute('data-config', '{"key": "value"}'); // Example JSON data
    });

    test('should initialize ConsonantPageModel with correct attributes', () => {
        const model = new ConsonantPageModel(element);

        expect(model.getAttribute('id')).toBe('test-id');
        expect(model.getAttribute('dataConfig')).toBe('{"key": "value"}'); // Corrected to match the attribute name
    });

    test('should set id and dataConfig attributes correctly', () => {
        const model = new ConsonantPageModel(element);

        expect(model.getAttribute('id')).toEqual('test-id');
        expect(model.getAttribute('dataConfig')).toEqual('{"key": "value"}'); // Corrected to match the attribute name
    });
});