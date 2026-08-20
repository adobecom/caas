import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { parseDataConfig } from '../decorators';
import { parseToPrimitive } from '../general';
import mockConfig from '../../Testing/Mocks/config.json'; // Import the mock config

// Mock the parseToPrimitive function
jest.mock('../general', () => ({
    parseToPrimitive: jest.fn(),
}));

// Mock component to wrap with the decorator
const MockComponent = ({ config }) => (
    <div data-testid="mock-component">
        {JSON.stringify(config)}
    </div>
);

// Add prop-types validation
MockComponent.propTypes = {
    config: PropTypes.shape({}).isRequired,
};

// Wrap the mock component with the decorator
const WrappedComponent = parseDataConfig(MockComponent);

describe('parseDataConfig Decorator', () => {
    test('should parse dataConfig and pass it to the wrapped component', () => {
        // Mock the return value of parseToPrimitive
        parseToPrimitive.mockReturnValue(mockConfig);

        // Render the wrapped component
        const { getByTestId } = render(<WrappedComponent dataConfig={mockConfig} />);

        // Verify the parsed config is passed to the wrapped component
        const mockComponent = getByTestId('mock-component');
        expect(mockComponent).toHaveTextContent(JSON.stringify(mockConfig));
    });
});
