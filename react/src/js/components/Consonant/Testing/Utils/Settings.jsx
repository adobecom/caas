import React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';

import setupIntersectionObserverMock from '../Mocks/intersectionObserver';
import ContextProvider from './ContextProvider';
import mockconfig from '../Mocks/config.json';

setupIntersectionObserverMock();

export const createTree = component => renderer
    .create(component)
    .toJSON();

export default (Component, defaultProps, options = {}) => (passedProps, passedConfig) => {
    const props = {
        ...defaultProps,
        ...passedProps,
    };
    const config = {
        ...mockconfig,
        ...passedConfig,
    };

    const { wrapInList = false } = options;

    const WrapperComponent = () => {
        const component = <Component {...props} />;
        
        return (
            <ContextProvider context={config}>
                {wrapInList ? <ul>{component}</ul> : component}
            </ContextProvider>
        );
    };

    const wrapper = render(<WrapperComponent />);
    const tree = createTree(<WrapperComponent />);

    return {
        tree,
        props,
        config,
        wrapper,
    };
};
