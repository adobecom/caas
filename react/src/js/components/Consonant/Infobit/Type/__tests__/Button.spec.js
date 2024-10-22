import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    render,
    screen,
} from '@testing-library/react';
import { ConfigContext } from '../../../Helpers/contexts'; // Adjust the import path as necessary

import Button from '../Button';

describe('Consonant/Infobits/Type/Button', () => {
    test('Buttons should be able to render when the cta style is authored', async () => {
        render(<Button {...{ style: 'call-to-action' }} />);

        const buttonElement = screen.getByTestId('consonant-BtnInfobit');

        expect(buttonElement).toHaveClass('consonant-BtnInfobit--cta');
    });
    test('If no style is authored, render with the cta style', async () => {
        render(<Button {...{ style: '' }} />);

        const buttonElement = screen.getByTestId('consonant-BtnInfobit');

        expect(buttonElement).toHaveClass('consonant-BtnInfobit--cta');
    });
    test('If an icon src is authored, render ite', async () => {
        render(<Button {...{ iconSrc: 'some-icon.svg' }} />);
        expect(screen.queryByTestId('consonant-BtnInfobit-ico')).not.toBeNull();
    });
    test('Should construct button link with additional params when present', () => {
        const href = 'https://example.com';
        const additionalParams = 'param1=value1&param2=value2';

        const config = {
            collection: {
                additionalRequestParams: additionalParams,
            },
        };

        /* eslint-disable */
            render(
            <ConfigContext.Provider value={config}>
                <Button
                href={href}
                isCta
                text="Click me" />
            </ConfigContext.Provider>);
        /* eslint-enable */

        const buttonLink = screen.getByTestId('consonant-BtnInfobit');
        expect(buttonLink).toHaveAttribute('href', `${href}?${additionalParams}`);
    });
    test('Should not render an icon when iconSrc is not provided', async () => {
        render(<Button {...{ iconSrc: '' }} />);
        const iconElement = screen.queryByTestId('consonant-BtnInfobit-ico');
        expect(iconElement).toBeNull();
    });
    test('Should call onFocus when button is focused', async () => {
        const onFocusMock = jest.fn();
        render(<Button {...{ onFocus: onFocusMock }} />);
        const buttonElement = screen.getByTestId('consonant-BtnInfobit');
        buttonElement.focus();
        expect(onFocusMock).toHaveBeenCalled();
    });
    test('Should construct button link without additional params', () => {
        const href = 'https://example.com';

        render(<Button href={href} text="Click me" />);

        const buttonLink = screen.getByTestId('consonant-BtnInfobit');
        expect(buttonLink).toHaveAttribute('href', href);
    });
    test('Icon should render before the text when iconPos is not "aftertext"', async () => {
        render(<Button {...{ iconSrc: 'some-icon.svg', iconPos: 'beforetext' }} />);

        const iconElement = screen.getByTestId('consonant-BtnInfobit-ico');
        expect(iconElement).toBeInTheDocument();
        expect(iconElement).toHaveClass('consonant-BtnInfobit-ico');
    });

    test('Icon should render after the text when iconPos is "aftertext"', async () => {
        render(<Button {...{ iconSrc: 'some-icon.svg', iconPos: 'aftertext' }} />);

        const iconElement = screen.getByTestId('consonant-BtnInfobit-ico');
        expect(iconElement).toBeInTheDocument();
        expect(iconElement).toHaveClass('consonant-BtnInfobit-ico--last');
    });
    test('Button should render correctly when href is missing', async () => {
        render(<Button text="No Link" />);

        const buttonElement = screen.getByTestId('consonant-BtnInfobit');
        expect(buttonElement).toBeInTheDocument();
    });
});
