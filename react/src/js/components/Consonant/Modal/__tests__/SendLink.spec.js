import SendLink from '../SendLink';
import { isEditor } from '../@dexter/environment';

// Constants from SendLink.js
const HIDDEN_CLASS = 'hidden';
const INVALID_CLASS = 'is-invalid';
const TOOLTIP_CLASS = 'is-open';

// Mock the environment module
jest.mock('../@dexter/environment', () => ({
    isEditor: jest.fn(),
}));

describe('SendLink Component', () => {
    let mockBranch;
    let originalBranch;
    let originalDigitalData;
    let originalSatellite;

    // Helper function to create test element with proper structure
    const setupTestElement = () => {
        const testEl = document.createElement('div');
        
        // Create required child elements with proper class names
        const button = document.createElement('button');
        button.className = 'sl-cta';
        
        const phone = document.createElement('input');
        phone.className = 'phone_number';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'sendLink-wrapper';
        wrapper.setAttribute('data-branch-key', 'test-branch-key');
        wrapper.setAttribute('data-android-redirect', 'android-url');
        wrapper.setAttribute('data-ios-redirect', 'ios-url');
        wrapper.setAttribute('data-custom-text', 'Download our app: ');
        wrapper.setAttribute('data-product-name', 'TestProduct');
        
        const form = document.createElement('div');
        form.className = 'sendlinkform';
        
        const success = document.createElement('div');
        success.className = 'success';
        
        const tooltip = document.createElement('div');
        tooltip.className = 'spectrum-Tooltip';
        
        const closeCta = document.createElement('button');
        closeCta.className = 'close-cta';
        
        // Append all elements
        testEl.appendChild(button);
        testEl.appendChild(phone);
        testEl.appendChild(wrapper);
        testEl.appendChild(form);
        testEl.appendChild(success);
        testEl.appendChild(tooltip);
        testEl.appendChild(closeCta);
        
        // Create parent element to avoid classList error
        const parent = document.createElement('div');
        parent.appendChild(testEl);
        
        return {
            testEl,
            button,
            phone,
            wrapper,
            form,
            success,
            tooltip,
            closeCta,
            parent
        };
    };

    beforeEach(() => {
        // Mock branch
        mockBranch = {
            init: jest.fn((key, options, callback) => {
                if (callback) callback();
            }),
            sendSMS: jest.fn((phoneNumber, linkData, options, callback) => {
                if (phoneNumber === 'valid') {
                    callback(null);
                } else {
                    callback('error');
                }
            }),
        };
        
        // Save original window values and mock them
        originalBranch = window.branch;
        window.branch = mockBranch;
        
        // Mock branchPromise
        window.branchPromise = Promise.resolve();
        
        // Mock Adobe privacy
        window.adobePrivacy = {
            hasUserProvidedConsent: jest.fn().mockReturnValue(true),
        };
        
        // Mock digitalData and _satellite
        originalDigitalData = window.digitalData;
        // eslint-disable-next-line no-underscore-dangle
        originalSatellite = window._satellite;
        
        window.digitalData = {
            _set: jest.fn(),
            _snapshot: jest.fn().mockReturnValue({}),
        };
        
        // eslint-disable-next-line no-underscore-dangle
        window._satellite = {
            track: jest.fn(),
        };
    });
    
    afterEach(() => {
        // Restore original values
        window.branch = originalBranch;
        window.digitalData = originalDigitalData;
        // eslint-disable-next-line no-underscore-dangle
        window._satellite = originalSatellite;
        delete window.branchPromise;
        delete window.adobePrivacy;
        
        // Clear mocks
        jest.clearAllMocks();
    });
    
    test('should initialize correctly with valid element', () => {
        const { testEl } = setupTestElement();
        const sendLink = new SendLink(testEl);
        
        expect(sendLink.element).toBe(testEl);
        expect(sendLink.button).toBe(testEl.querySelector('.sl-cta'));
        expect(sendLink.phone).toBe(testEl.querySelector('.phone_number'));
        expect(sendLink.wrapper).toBe(testEl.querySelector('.sendLink-wrapper'));
        expect(sendLink.branchKey).toBe('test-branch-key');
        expect(sendLink.linkData.$android_url).toBe('android-url');
        expect(sendLink.linkData.$ios_url).toBe('ios-url');
        expect(sendLink.linkData.$custom_sms_text).toBe('Download our app: {{link}}');
    });
    
    test('should add class in editor mode', () => {
        isEditor.mockReturnValue(true);
        
        const { testEl } = setupTestElement();
        
        // Element now has a parent element before creating SendLink
        // eslint-disable-next-line no-unused-vars
        const sendLink = new SendLink(testEl);
        
        expect(testEl.parentElement.classList.contains('sendlink-desktop-auto')).toBe(true);
    }); 
    
    test('should bind button click event', () => {
        const { testEl } = setupTestElement();
        
        // Create spies first before creating the SendLink instance
        const sendSMSSpy = jest.spyOn(SendLink.prototype, 'sendSMS');
        const analyticsSpy = jest.spyOn(SendLink.prototype, 'sendCustomAnalytics');
        
        // Mock branch
        window.branch = mockBranch;
        
        const sendLink = new SendLink(testEl);
        
        // Manually bind events to ensure they're attached
        sendLink.bindEvents();
        
        // Now click the button
        sendLink.button.click();
        
        expect(sendSMSSpy).toHaveBeenCalled();
        expect(analyticsSpy).toHaveBeenCalledWith('send');
        
        // Clean up spies
        sendSMSSpy.mockRestore();
        analyticsSpy.mockRestore();
    });
    
    test('should handle phone field click', () => {
        const { testEl } = setupTestElement();
        
        // Mock branch
        window.branch = mockBranch;
        
        const sendLink = new SendLink(testEl);
        
        // Manually bind events
        sendLink.bindEvents();
        
        // Add classes to test reset on click
        sendLink.phone.classList.add(INVALID_CLASS);
        sendLink.tooltip.classList.add(TOOLTIP_CLASS);
        
        // Trigger the click event
        sendLink.phone.click();
        
        // Check that classes were removed
        expect(sendLink.phone.classList.contains(INVALID_CLASS)).toBe(false);
        expect(sendLink.tooltip.classList.contains(TOOLTIP_CLASS)).toBe(false);
    });
    
    test('should handle close CTA click', () => {
        const { testEl, wrapper } = setupTestElement();
        
        // Create mock modal structure
        const modal = document.createElement('div');
        modal.className = 'dexter-Modal';
        const closeButton = document.createElement('button');
        closeButton.className = 'dexter-CloseButton';
        const clickSpy = jest.spyOn(closeButton, 'click');
        
        modal.appendChild(closeButton);
        
        // Mock closest method
        wrapper.closest = jest.fn().mockReturnValue(modal);
        
        // Mock branch
        window.branch = mockBranch;
        
        const sendLink = new SendLink(testEl);
        
        // Manually bind events
        sendLink.bindEvents();
        
        // Trigger the click event
        sendLink.closeCta.click();
        
        // Check that the close button was clicked
        expect(clickSpy).toHaveBeenCalled();
    });
    
    test('should populate success message when SMS is sent successfully', () => {
        const { testEl } = setupTestElement();
        
        // Mock branch
        window.branch = mockBranch;
        
        const sendLink = new SendLink(testEl);
        const analyticsSpy = jest.spyOn(sendLink, 'sendCustomAnalytics');
        
        // Call the populateMessage method with null (success case)
        sendLink.populateMessage(null);
        
        // Check that the success UI is shown
        expect(sendLink.sendLinkForm.classList.contains(HIDDEN_CLASS)).toBe(true);
        expect(sendLink.sendLinkSuccess.classList.contains(HIDDEN_CLASS)).toBe(false);
        expect(analyticsSpy).toHaveBeenCalledWith('success');
    });
    
    test('should populate error message when SMS fails', () => {
        const { testEl } = setupTestElement();
        
        // Mock branch
        window.branch = mockBranch;
        
        const sendLink = new SendLink(testEl);
        const analyticsSpy = jest.spyOn(sendLink, 'sendCustomAnalytics');
        
        // Call the populateMessage method with an error
        sendLink.populateMessage('error');
        
        // Check that the error UI is shown
        expect(sendLink.phone.classList.contains(INVALID_CLASS)).toBe(true);
        expect(sendLink.tooltip.classList.contains(TOOLTIP_CLASS)).toBe(true);
        expect(analyticsSpy).toHaveBeenCalledWith('error');
    });
    
    test('should send SMS with correct parameters', () => {
        const { testEl } = setupTestElement();
        
        // Reset and setup mock branch
        jest.clearAllMocks();
        window.branch = mockBranch;
        
        const sendLink = new SendLink(testEl);
        sendLink.phone.value = 'valid';
        
        // Call sendSMS method
        sendLink.sendSMS();
        
        // Verify the branch.sendSMS was called with correct parameters
        expect(mockBranch.sendSMS).toHaveBeenCalledWith(
            'valid',
            {
                channel: 'Adobe.com',
                feature: 'Text-Me-The-App',
                data: sendLink.linkData
            },
            { make_new_link: false },
            expect.any(Function)
        );
    });
    
    test('should handle errors when branch is undefined', () => {
        const { testEl } = setupTestElement();
        
        // Save the original branch value to restore later
        originalBranch = window.branch;
        
        // Set branch to undefined for this test
        window.branch = undefined;
        
        // Create the SendLink instance
        const sendLink = new SendLink(testEl);
        const analyticsSpy = jest.spyOn(sendLink, 'sendCustomAnalytics');
        
        // Call sendSMS method
        sendLink.sendSMS();
        
        // Verify error handling
        expect(sendLink.phone.classList.contains(INVALID_CLASS)).toBe(true);
        expect(sendLink.tooltip.classList.contains(TOOLTIP_CLASS)).toBe(true);
        expect(analyticsSpy).toHaveBeenCalledWith('error');
        
        // Restore branch for other tests
        window.branch = originalBranch;
    });
    
    test('should send custom analytics events', () => {
        const { testEl } = setupTestElement();
        
        // Mock window objects for analytics
        window.digitalData = {
            _set: jest.fn(),
            _snapshot: jest.fn().mockReturnValue({})
        };
        
        // eslint-disable-next-line no-underscore-dangle
        window._satellite = {
            track: jest.fn()
        };
        
        // Mock branch
        window.branch = mockBranch;
        
        const sendLink = new SendLink(testEl);
        
        // Call the analytics method
        sendLink.sendCustomAnalytics('test-event');
        
        // Verify analytics calls
        // eslint-disable-next-line no-underscore-dangle
        expect(window.digitalData._set).toHaveBeenCalledWith(
            'primaryEvent.eventInfo.eventName',
            'branch:TestProduct:text_app_link:test-event'
        );
        // eslint-disable-next-line no-underscore-dangle
        expect(window.digitalData._set).toHaveBeenCalledWith(
            'primaryEvent.eventInfo.interaction.click',
            'branch:TestProduct:text_app_link:test-event'
        );
        // eslint-disable-next-line no-underscore-dangle
        expect(window._satellite.track).toHaveBeenCalledWith('event', {
            digitalData: expect.any(Object)
        });
    });
}); 