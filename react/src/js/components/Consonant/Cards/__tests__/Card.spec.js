import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Card from '../Card';
import setup from '../../Testing/Utils/Settings';
import prettyFormatDate from '../../Helpers/prettyFormat';

// Setup function to render the Card component with default props
const renderCard = setup(Card, {});

describe('Card Component - Specific Conditions', () => {
    beforeEach(() => {
        // No mocks, use actual implementations
    });

    test('should set banner properties for gated half-height card when not registered', () => {
        // Destructure the props to get bannerMap properties
        const {
            props: {
                bannerMap: {
                    register: {
                        description: bannerDescription,
                        backgroundColor: bannerBackgroundColor,
                        fontColor: bannerFontColor,
                    },
                },
            },
        } = renderCard({
            cardStyle: 'half-height', // Set card style to half-height
            tags: [{ id: '/caas:gated' }], // Add gated tag
            isRegistered: false, // Explicitly set to false to test not registered condition
            bannerMap: {
                register: {
                    description: 'Register Now',
                    backgroundColor: '#000',
                    fontColor: '#fff',
                },
            },
            startDate: '', // No start date
            endDate: '', // No end date
        });

        // Check if the banner element has the correct styles and text content
        const bannerElement = screen.getByTestId('consonant-Card-banner');
        expect(bannerElement).toHaveStyle({
            color: bannerFontColor,
            backgroundColor: bannerBackgroundColor,
        });
        expect(bannerElement).toHaveTextContent(bannerDescription);
    });

    test('should set event banner properties for cards with start and end dates', () => {
        const startDate = '2023-01-02';
        const endDate = '2023-01-03';
        const {
            props: {
                bannerMap: {
                    register: {
                        description: bannerDescription,
                        backgroundColor: bannerBackgroundColor,
                        fontColor: bannerFontColor,
                    },
                },
            },
        } = renderCard({
            cardStyle: 'half-height', // Set card style to half-height
            tags: [{ id: '/caas:gated' }], // Add gated tag
            isRegistered: true, // Explicitly set to true to test registered condition
            bannerMap: {
                register: {
                    description: 'Register Now',
                    backgroundColor: '#000',
                    fontColor: '#fff',
                },
            },
            startDate, // start date
            endDate, // end date
        });

        // Check if the banner element has the correct styles and text content
        const bannerElement = screen.getByTestId('consonant-Card-banner');
        expect(bannerElement).toHaveStyle({
            color: bannerFontColor,
            backgroundColor: bannerBackgroundColor,
        });
        expect(bannerElement).toHaveTextContent(bannerDescription);
    });

    test('should hide banner for in-person events card with on-demand banner', () => {
        // Render the card with in-person event tag to test banner hiding
        renderCard({
            cardStyle: 'one-half', // Set card style to one-half
            tags: [{ id: '/events/session-format/in-person' }], // Add in-person event tag
            bannerMap: {
                onDemand: {
                    description: 'On Demand',
                    backgroundColor: '#abcdef',
                    fontColor: '#123456',
                    icon: 'on-demand-icon.png',
                },
            },
        });

        // Check if the banner element is not present
        const bannerElement = screen.queryByTestId('consonant-Card-banner');
        expect(bannerElement).toBeNull();
    });

    test('should set ariaText correctly when hasBanner is true and disableBanners is false', () => {
        const bannerDescription = 'Register Now';
        const bannerBackgroundColor = '#000';
        const bannerFontColor = '#fff';
        const title = 'Card Title';

        // Render the card with the necessary props to trigger the condition
        renderCard({
            cardStyle: 'half-height', // Set card style to half-height
            tags: [{ id: '/caas:gated' }], // Add gated tag
            isRegistered: false, // Explicitly set to false to test not registered condition
            bannerMap: {
                register: {
                    description: bannerDescription,
                    backgroundColor: bannerBackgroundColor,
                    fontColor: bannerFontColor,
                },
            },
            contentArea: {
                title, // Provide title
            },
            hasBanner: true,
            disableBanners: false, // Ensure disableBanners is false
        });

        // Check if the ariaText is set correctly
        const cardElement = screen.getByTestId('consonant-Card');
        const ariaText = `${bannerDescription} | ${title}`;
        expect(cardElement).toHaveAttribute('aria-label', ariaText);
    });

    // Other Test Cases
    test('should set detail text for half-height card if current date is before start date', () => {
        const currentDate = new Date();
        const nextYearDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)).toISOString().split('T')[0];
        renderCard({
            cardStyle: 'half-height',
            startDate: nextYearDate,
            endDate: '2023-01-03',
            bannerMap: {
                event: {
                    backgroundColor: '#000',
                    description: 'Event Description',
                    fontColor: '#fff',
                    icon: 'event-icon.png',
                },
            },
        });

        const detailTextElement = screen.getByTestId('consonant-Card-label');
        const expectedText = prettyFormatDate(nextYearDate, '2023-01-03', 'en-US', '{LLL} {dd} | {timeRange} {timeZone}');
        expect(detailTextElement).toBeInTheDocument();
        expect(detailTextElement).toHaveTextContent(expectedText);
    });
});
