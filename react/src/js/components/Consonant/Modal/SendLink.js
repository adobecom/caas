import { isEditor } from './@dexter/environment';

const BUTTON_CLASS = '.sl-cta';
const TEXT_FIELD = '.phone_number';
const SENDLINK_WRAPPER = '.sendLink-wrapper';
const DATA_ANDROID_REDIRECT = 'data-android-redirect';
const DATA_IOS_REDIRECT = 'data-ios-redirect';
const DATA_CUSTOM_TEXT = 'data-custom-text';
const PRODUCT_BRANCH_KEY = 'data-branch-key';
const SENDLINK_FORM = '.sendlinkform';
const SENDLINK_SUCCESS = '.success';
const ERROR_TOOLTIP = '.spectrum-Tooltip';
const HIDDEN_CLASS = 'hidden';
const INVALID_CLASS = 'is-invalid';
const TOOLTIP_CLASS = 'is-open';
const CLOSE_CTA = '.close-cta';
const ANALYTICS_ATTB = 'data-product-name';
const EVENT_SEND = 'send';
const EVENT_SUCCESS = 'success';
const EVENT_ERROR = 'error';
const CHANNEL = 'Adobe.com';
const BRANCH_FEATURE = 'Text-Me-The-App';

export default class SendLink {
    constructor(element) {
        if (element) {
            this.element = element;
            this.button = this.element.querySelector(BUTTON_CLASS);
            this.phone = this.element.querySelector(TEXT_FIELD);
            this.wrapper = this.element.querySelector(SENDLINK_WRAPPER);
            this.branchKey = this.wrapper.getAttribute(PRODUCT_BRANCH_KEY);
            this.sendLinkForm = this.element.querySelector(SENDLINK_FORM);
            this.sendLinkSuccess = this.element.querySelector(SENDLINK_SUCCESS);
            this.tooltip = this.element.querySelector(ERROR_TOOLTIP);
            this.closeCta = this.element.querySelector(CLOSE_CTA);
            this.linkData = {
                $android_url: this.wrapper.getAttribute(DATA_ANDROID_REDIRECT),
                $custom_sms_text: this.wrapper.getAttribute(DATA_CUSTOM_TEXT) !== null ? this.wrapper.getAttribute(DATA_CUSTOM_TEXT).concat('{{link}}') : '',
                $ios_url: this.wrapper.getAttribute(DATA_IOS_REDIRECT),
            };
            this.analyticsLink = this.wrapper.getAttribute(ANALYTICS_ATTB);
            this.setUpBranchAndBind();
            if (isEditor()) {
                this.element.parentElement.classList.add('sendlink-desktop-auto');
            }
        }
    }


    openView() {
        // Always show send-a-link form when modal is opened.
        this.sendLinkForm.classList.remove(HIDDEN_CLASS);
        this.sendLinkSuccess.classList.add(HIDDEN_CLASS);
        // Clear form whenever modal is opened.
        this.phone.value = '';
        this.phone.classList.remove(INVALID_CLASS);
        this.tooltip.classList.remove(TOOLTIP_CLASS);
    }

    bindEvents() {
        this.button.addEventListener('click', () => {
            this.sendCustomAnalytics(EVENT_SEND);
            this.sendSMS();
        });
        this.phone.addEventListener('click', () => {
            this.phone.classList.remove(INVALID_CLASS);
            this.tooltip.classList.remove(TOOLTIP_CLASS);
        });
        this.closeCta.addEventListener('click', () => {
            const parentModal = this.wrapper.closest('.dexter-Modal');
            if (parentModal && parentModal.querySelector('.dexter-CloseButton')) {
                parentModal.querySelector('.dexter-CloseButton').click();
            }
        });
    }

    defBranch() {
        /*
        snippet picked from: https://help.branch.io/developers-hub/docs/web-basic-integration
        */
        // eslint-disable-next-line
        (function(b,r,a,n,c,h,_,s,d,k) {if(!b[n]||!b[n]._q) {for(;s<_.length;)c(h,_[s++]);d=r.createElement(a);d.async=1;d.src="https://cdn.branch.io/branch-latest.min.js";k=r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d,k);b[n]=h}})(window,document,"script","branch",function(b,r) {b[r]=function() {b._q.push([r,arguments])}},{_q:[],_v:1},"addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent logEvent disableTracking".split(" "), 0);
    }

    setUpBranchAndBind() {
        if (this.branchKey && !window.branchPromise) {
            this.defBranch();
            this.initBranch();
        }
        if (window.branchPromise) {
            window.branchPromise.catch(() => {
                this.initBranch({ doBind: false });
            }).finally(() => {
                this.bindEvents();
            });
        }
    }

    initBranch({ doBind = true } = {}) {
        const privacyConsent = !!window.adobePrivacy
                                    && window.adobePrivacy.hasUserProvidedConsent();
        window.branch.init(this.branchKey, { tracking_disabled: !privacyConsent }, () => {
            if (doBind) {
                this.bindEvents();
            }
        });
    }

    populateMessage(err) {
        if (err) {
            this.phone.classList.add(INVALID_CLASS);
            this.tooltip.classList.add(TOOLTIP_CLASS);
            this.sendCustomAnalytics(EVENT_ERROR);
        } else {
            this.sendLinkForm.classList.add(HIDDEN_CLASS);
            this.sendLinkSuccess.classList.remove(HIDDEN_CLASS);
            this.sendCustomAnalytics(EVENT_SUCCESS);
        }
    }

    sendSMS() {
        if (typeof window.branch !== 'undefined') {
            window.branch.sendSMS(
                this.phone.value,
                { channel: CHANNEL, feature: BRANCH_FEATURE, data: this.linkData },
                { make_new_link: false },
                this.populateMessage.bind(this),
            );
        } else {
            this.phone.classList.add(INVALID_CLASS);
            this.tooltip.classList.add(TOOLTIP_CLASS);
            this.sendCustomAnalytics(EVENT_ERROR);
        }
    }

    sendCustomAnalytics(event) {
        /* eslint-disable no-underscore-dangle */
        if (window.digitalData && window._satellite && this.analyticsLink !== null) {
            window.digitalData._set('primaryEvent.eventInfo.eventName', `branch:${this.analyticsLink}:text_app_link:${event}`);
            window.digitalData._set('primaryEvent.eventInfo.interaction.click', `branch:${this.analyticsLink}:text_app_link:${event}`);
            window._satellite.track('event', {
                digitalData: window.digitalData._snapshot(),
            });
        }
        /* eslint-enable no-underscore-dangle */
    }
}
