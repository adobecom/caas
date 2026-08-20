import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

/**
 * Tests multiple configurations of a component for accessibility violations
 *
 * @param {Function} renderFn - The setup function from Settings.jsx that renders the component
 * @param {Array} testCases - Array of test case objects with { name, props }
 *
 * @example
 * testA11yForConfigs(renderCard, [
 *     { name: 'Default card', props: { cardStyle: 'blade-card' } },
 *     { name: 'Card with video', props: { cardStyle: 'blade-card', overlays: { videoButton: { url: 'video.mp4' } } } }
 * ]);
 */
export const testA11yForConfigs = (renderFn, testCases) => {
    describe('Accessibility', () => {
        testCases.forEach(({ name, props }) => {
            test(`${name} should have no a11y violations`, async () => {
                const { wrapper } = renderFn(props);
                const results = await axe(wrapper.container);
                expect(results).toHaveNoViolations();
            });
        });
    });
};

/**
 * Simple one-off a11y test for a component
 *
 * @param {Function} renderFn - The setup function from Settings.jsx
 * @param {Object} props - Props to pass to the component
 * @param {String} componentName - Name for the test description
 *
 * @example
 * testAccessibility(renderCard, { cardStyle: 'blade-card' }, 'Blade Card');
 */
export const testAccessibility = (renderFn, props = {}, componentName = 'Component') => {
    test(`${componentName} should have no accessibility violations`, async () => {
        const { wrapper } = renderFn(props);
        const results = await axe(wrapper.container);
        expect(results).toHaveNoViolations();
    });
};

export default testA11yForConfigs;
