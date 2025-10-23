import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    render,
    screen,
} from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import LinkWithIcon from '../LinkWithIcon';

expect.extend(toHaveNoViolations);

const props = {
    href: 'https://www.someTestUrl.com/',
    openInNewTab: false,
    linkHint: 'Some Link Hint',
    text: 'Click Here',
    src: 'Some Src',
    srcAltText: 'Some Src Alt Txt',
};

describe('Consoonant/Infobits/Type/Link With Icon', () => {
    test('Loads with default props', async () => {
        const propsToUse = props;
        const { getByText } = render(<LinkWithIcon {...propsToUse} />);

        const linkWithIcon = screen.getByTestId('consonant-LinkWithIcoInfobit');
        expect(linkWithIcon).not.toBeNull();
        expect(linkWithIcon.target).toBe('_self');
        expect(getByText('Click Here').innerHTML).toContain('Click Here');
    });

    test('Can be authored to open in a new tab', async () => {
        const propsToUse = props;
        propsToUse.openInNewTab = true;
        render(<LinkWithIcon {...propsToUse} />);

        const linkWithIcon = screen.getByTestId('consonant-LinkWithIcoInfobit');

        expect(linkWithIcon.target).toBe('_blank');
    });

    // Accessibility test with jest-axe
    describe('Accessibility', () => {
        test('LinkWithIcon should have no accessibility violations', async () => {
            const { container } = render(<LinkWithIcon {...props} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
