import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import withLinkTransformer from '../withLinkTransformer';
import { ConfigContext } from '../contexts';
import { logLana } from '../lana';

jest.mock('../lana', () => ({
    logLana: jest.fn(),
}));

// Mock component to test link transformation
// eslint-disable-next-line react/prop-types
const TestComponent = ({ href, text }) => <a href={href}>{text}</a>;
const TransformedComponent = withLinkTransformer(TestComponent);

describe('withLinkTransformer', () => {
    const mockConfig = {
        linkTransformer: {
            enabled: true,
            hostnameTransforms: [
                {
                    from: '(https?:\\/\\/)business\\.adobe\\.com((?!\\/content\\/dam).*)',
                    to: '$1business.stage.adobe.com$2',
                },
                {
                    from: '(https?:\\/\\/)(www\\.adobe\\.com)(\\/max.*)',
                    to: '$1www.stage.adobe.com$3',
                },
            ],
        },
    };

    // eslint-disable-next-line max-len
    const renderWithConfig = (ui, config) => render(<ConfigContext.Provider value={config}>{ui}</ConfigContext.Provider>);

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    test('transforms business.adobe.com links when enabled', () => {
        renderWithConfig(
            <TransformedComponent
                href="https://business.adobe.com/products/magento/magento-commerce.html"
                text="Magento Commerce" />,
            mockConfig,
        );
        const link = screen.getByRole('link', { name: /Magento Commerce/i });
        expect(link).toHaveAttribute('href', 'https://business.stage.adobe.com/products/magento/magento-commerce.html');
    });

    test('transforms www.adobe.com/max links when enabled', () => {
        renderWithConfig(
            <TransformedComponent
                href="https://www.adobe.com/max/2023.html"
                text="Adobe MAX 2023" />,
            mockConfig,
        );
        const link = screen.getByRole('link', { name: /Adobe MAX 2023/i });
        expect(link).toHaveAttribute('href', 'https://www.stage.adobe.com/max/2023.html');
    });

    test('does not transform links when disabled in config', () => {
        const disabledConfig = {
            ...mockConfig,
            linkTransformer: { ...mockConfig.linkTransformer, enabled: false },
        };

        renderWithConfig(
            <TransformedComponent
                href="https://business.adobe.com/products/magento/magento-commerce.html"
                text="Magento Commerce" />,
            disabledConfig,
        );
        const link = screen.getByRole('link', { name: /Magento Commerce/i });
        expect(link).toHaveAttribute('href', 'https://business.adobe.com/products/magento/magento-commerce.html');
    });

    test('uses localStorage settings when available', () => {
        localStorage.setItem('linkTransformerSettings', JSON.stringify({
            enabled: true,
            hostnameTransforms: [
                {
                    from: '(https?:\\/\\/)www\\.adobe\\.com',
                    to: '$1www.test.adobe.com',
                },
            ],
        }));

        renderWithConfig(
            <TransformedComponent
                href="https://www.adobe.com/products/photoshop.html"
                text="Photoshop" />,
            { linkTransformer: { enabled: false } },
        );
        const link = screen.getByRole('link', { name: /Photoshop/i });
        expect(link).toHaveAttribute('href', 'https://www.test.adobe.com/products/photoshop.html');
    });

    test('does not transform non-matching links', () => {
        renderWithConfig(
            <TransformedComponent
                href="https://example.com"
                text="Example" />,
            mockConfig,
        );
        const link = screen.getByRole('link', { name: /Example/i });
        expect(link).toHaveAttribute('href', 'https://example.com');
    });


    test('transforms nested props correctly', () => {
        // eslint-disable-next-line react/prop-types
        const NestedComponent = ({ data }) => (
            <div>
                {/* eslint-disable-next-line react/prop-types */}
                <a href={data.link}>{data.text}</a>
                {/* eslint-disable-next-line react/prop-types */}
                <img src={data.image} alt="Test" />
            </div>
        );
        const TransformedNestedComponent = withLinkTransformer(NestedComponent);

        renderWithConfig(
            <TransformedNestedComponent
                data={{
                    link: 'https://business.adobe.com/products/magento/magento-commerce.html',
                    text: 'Magento Commerce',
                    image: 'https://www.adobe.com/content/dam/cc/us/en/creative-cloud/photography/discover/landscape-photography/CODERED_B1_landscape_P2d_690x455.jpg.img.jpg',
                }} />,
            mockConfig,
        );

        const link = screen.getByRole('link', { name: /Magento Commerce/i });
        expect(link).toHaveAttribute('href', 'https://business.stage.adobe.com/products/magento/magento-commerce.html');

        const image = screen.getByRole('img', { name: /Test/i });
        expect(image).toHaveAttribute('src', 'https://www.adobe.com/content/dam/cc/us/en/creative-cloud/photography/discover/landscape-photography/CODERED_B1_landscape_P2d_690x455.jpg.img.jpg');
    });

    describe('Edge cases and error handling', () => {
        test('handles non-object props correctly', () => {
            const StringComponent = withLinkTransformer(({ value }) => <span>{value}</span>);
            renderWithConfig(<StringComponent value="Just a string" />, mockConfig);
            expect(screen.getByText('Just a string')).toBeInTheDocument();
        });


        test('handles array props correctly', () => {
            const ArrayComponent = withLinkTransformer(({ items }) => (
                <ul>
                    {items.map((item, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <li key={index}><a href={item}>{item}</a></li>
                    ))}
                </ul>
            ));
            renderWithConfig(<ArrayComponent items={['https://business.adobe.com', 'https://www.adobe.com/max']} />, mockConfig);
            const links = screen.getAllByRole('link');
            expect(links[0]).toHaveAttribute('href', 'https://business.stage.adobe.com');
            expect(links[1]).toHaveAttribute('href', 'https://www.stage.adobe.com/max');
        });


        test('handles localStorage errors gracefully', () => {
            const mockGetItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new Error('localStorage error');
            });

            renderWithConfig(
                <TransformedComponent
                    href="https://business.adobe.com/products/magento/magento-commerce.html"
                    text="Magento Commerce" />,
                mockConfig,
            );

            const link = screen.getByRole('link', { name: /Magento Commerce/i });
            expect(link).toHaveAttribute('href', 'https://business.stage.adobe.com/products/magento/magento-commerce.html');
            expect(logLana).toHaveBeenCalledWith({ message: 'Error reading from localStorage:', tags: 'linkTransformer', e: expect.any(Error) });

            mockGetItem.mockRestore();
        });
    });
});

const settings = {
    enabled: true,
    hostnameTransforms: [
        {
            from: '(https?:\\/\\/)business\\.adobe\\.com((?!\\/content\\/dam).*)',
            to: '$1business.stage.adobe.com$2',
        },
        {
            from: '(https?:\\/\\/)(www\\.adobe\\.com)(\\/max.*)',
            to: '$1www.stage.adobe.com$3',
        },
    ],
};
localStorage.setItem('linkTransformerSettings', JSON.stringify(settings));
