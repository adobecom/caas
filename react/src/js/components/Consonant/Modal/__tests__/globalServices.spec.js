/* eslint-disable no-underscore-dangle -- Adobe analytics service names are part of the contract. */
import SendLink from '../SendLink';
import { focusActiveModal } from '../modalFocus';

describe('page-provided modal services', () => {
    const names = ['branch', 'adobePrivacy', 'digitalData', '_satellite', 'dexter'];
    const saved = {};
    let link;

    beforeEach(() => {
        names.forEach((name) => {
            saved[name] = Object.getOwnPropertyDescriptor(window, name);
            delete window[name];
        });
        link = new SendLink();
        link.branchKey = 'test-key';
        link.bindEvents = jest.fn();
    });

    afterEach(() => {
        names.forEach((name) => {
            if (saved[name]) Object.defineProperty(window, name, saved[name]);
            else delete window[name];
        });
        jest.restoreAllMocks();
    });

    test.each([true, false])('preserves the privacy consent setting (%s)', (consent) => {
        window.adobePrivacy = { hasUserProvidedConsent: jest.fn(() => consent) };
        window.branch = { init: jest.fn((key, options, ready) => ready()) };
        link.initBranch();
        expect(window.branch.init).toHaveBeenCalledWith('test-key', { tracking_disabled: !consent }, expect.any(Function));
        expect(link.bindEvents).toHaveBeenCalledTimes(1);
    });

    test('disables tracking when the privacy service is absent', () => {
        window.branch = { init: jest.fn() };
        link.initBranch();
        expect(window.branch.init).toHaveBeenCalledWith('test-key', { tracking_disabled: true }, expect.any(Function));
    });

    test('passes the same analytics payload to the page services', () => {
        const snapshot = { event: 'test' };
        window.digitalData = { _set: jest.fn(), _snapshot: jest.fn(() => snapshot) };
        window._satellite = { track: jest.fn() };
        link.analyticsLink = 'creative-cloud';
        link.sendCustomAnalytics('success');
        expect(window.digitalData._set.mock.calls).toEqual([
            ['primaryEvent.eventInfo.eventName', 'branch:creative-cloud:text_app_link:success'],
            ['primaryEvent.eventInfo.interaction.click', 'branch:creative-cloud:text_app_link:success'],
        ]);
        expect(window._satellite.track).toHaveBeenCalledWith('event', { digitalData: snapshot });
    });

    test('reuses the focus trap installed by the consuming page', () => {
        const trap = { deactivate: jest.fn(), updateContainerElements: jest.fn(), activate: jest.fn() };
        window.dexter = { utils: { modalFocusTrap: trap } };
        const original = Object.getOwnPropertyDescriptor(document, 'elementFromPoint');
        Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => null });
        try {
            focusActiveModal();
            expect(trap.deactivate).toHaveBeenCalledTimes(1);
            expect(trap.activate).not.toHaveBeenCalled();
            expect(window.dexter.utils.modalFocusTrap).toBe(trap);
        } finally {
            if (original) Object.defineProperty(document, 'elementFromPoint', original);
            else delete document.elementFromPoint;
        }
    });
});
