/**
 * E2E tests for the milo bulk publisher → milo-caas → Chimera publish flow.
 *
 * Prerequisites:
 *   - IMS_CLIENT_SECRET env var set (GitHub secret: IMS_CLIENT_SECRET)
 *
 * Flow:
 *   1. Fetch fresh IMS service account token (client_credentials, no SSO needed)
 *   2. Navigate to bulk publisher
 *   3. Inject token into window.adobeIMS
 *   4. Intercept window.fetch to redirect postXDM calls → dev endpoint with caas-env: dev
 *   5. Submit publish and assert success in the summary modal
 */

const getAutomationToken = require('../helpers/getAutomationToken');

const DEV_POSTXDM_URL = 'https://14257-milocaasproxy-dev.adobeio-static.net/api/v1/web/milocaas/postXDM';
const CLIENT_ID = 'b04b4dc3c96f4a2082f57237d84547a4';

const ENVIRONMENTS = [
  {
    name: 'prod',
    bulkPublisherUrl: 'https://milo.adobe.com/tools/send-to-caas/bulkpublisher.html',
    testPageUrl: 'https://milo.adobe.com/drafts/jmichnow/cards/document113',
  },
  {
    name: 'stage',
    bulkPublisherUrl: 'https://stage--milo--adobecom.aem.live/tools/send-to-caas/bulkpublisher.html',
    testPageUrl: 'https://stage--milo--adobecom.aem.live/drafts/jmichnow/cards/document113',
  },
];

const SEL = {
  urlInput:      '#urls',
  caasEnvSelect: '#caasEnv',
  publishButton: '#bulkpublish',
  progressModal: '.tingle-modal',
  modalContent:  '.tingle-modal-box__content',
  tingleBtn:     '.tingle-btn',
  successRowOk:  'table.success-table td.ok',
};

ENVIRONMENTS.forEach(({ name, bulkPublisherUrl, testPageUrl }) => {
  describe(`Bulk Publisher [${name}] — Send to CaaS (dev)`, () => {
    let accessToken;

    before(async () => {
      accessToken = await getAutomationToken();
    });

    beforeEach(async () => {
      await browser.url(bulkPublisherUrl);

      // Wait for page to fully load first
      await browser.waitUntil(
        () => browser.execute(() => document.readyState === 'complete'),
        { timeout: 30000, timeoutMsg: 'Page did not finish loading' },
      );

      // Wait for IMS library to be available (increased timeout for CI network variability)
      try {
        await browser.waitUntil(
          () => browser.execute(() => typeof window.adobeImsFactory !== 'undefined'),
          {
            timeout: 30000,
            timeoutMsg: 'adobeImsFactory did not load after 30s. Check network/CDN availability.',
            interval: 500,
          },
        );
      } catch (error) {
        // Capture diagnostic info on failure
        const diagnostics = await browser.execute(() => {
          const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src);
          return {
            readyState: document.readyState,
            scriptsLoaded: scripts,
            imsFactory: typeof window.adobeImsFactory,
            locationHref: window.location.href,
          };
        });
        console.error('IMS load failure diagnostics:', JSON.stringify(diagnostics, null, 2));
        throw error;
      }

      // Create adobeIMS instance with our client_id + standalone token
      await browser.execute((token, clientId) => {
        const instance = window.adobeImsFactory.createIMSLib({
          client_id: clientId,
          scope: 'AdobeID,openid',
          standalone: { token, expirems: 86399000 },
          onAccessToken: () => {},
          onReady: () => {},
          onError: () => {},
        }, 'adobeIMS');
        window.adobeIMS = instance;
        instance.initialize();
      }, accessToken, CLIENT_ID);

      // Wait for initialize to settle, then force token in via setStandAloneToken
      await browser.pause(2000);
      await browser.execute((token) => {
        window.adobeIMS.setStandAloneToken({ token, expirems: 86399000 });
      }, accessToken);

      // Confirm getAccessToken() has our token
      await browser.waitUntil(
        () => browser.execute(() => !!window.adobeIMS.getAccessToken()),
        { timeout: 10000, timeoutMsg: 'adobeIMS.getAccessToken() did not return a token' },
      );

      // Intercept window.fetch: redirect any postXDM call to the dev endpoint
      // and ensure caas-env is set to dev with our service account token
      await browser.execute((devUrl, token) => {
        const origFetch = window.fetch;
        window.fetch = (url, opts = {}) => {
          if (typeof url === 'string' && url.includes('postXDM')) {
            const headers = { ...(opts.headers || {}), 'caas-env': 'dev', 'Authorization': `Bearer ${token}` };
            return origFetch(devUrl, { ...opts, headers });
          }
          return origFetch(url, opts);
        };
      }, DEV_POSTXDM_URL, accessToken);

      // Select the "milo" preset (host=milo.adobe.com, repo=milo) to pass validation
      await browser.execute(() => {
        const preset = document.querySelector('#presetSelector');
        preset.value = 'milo';
        preset.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await browser.pause(500);
      await browser.execute(() => {
        const env = document.querySelector('#caasEnv');
        if (env) { env.value = 'dev'; env.dispatchEvent(new Event('change', { bubbles: true })); }
      });
    });

    it('should successfully publish a page to CaaS dev', async () => {
      const urlInput = await $(SEL.urlInput);
      await urlInput.clearValue();
      await urlInput.setValue(testPageUrl);

      await $(SEL.publishButton).click();

      // Wait for progress modal to appear
      await $(SEL.progressModal).waitForDisplayed({ timeout: 10000 });

      // Wait for summary text in modal (appears after publish completes)
      await browser.waitUntil(
        () => browser.execute(() => {
          const el = document.querySelector('.tingle-modal-box__content');
          const text = el?.textContent || '';
          return text.includes('Successfully published') || text.includes('Failed to publish');
        }),
        { timeout: 60000, timeoutMsg: 'Publish summary did not appear' },
      );

      const summaryText = await browser.execute(
        () => document.querySelector('.tingle-modal-box__content')?.textContent || '',
      );

      // Dismiss summary modal
      const tingleBtn = await $(SEL.tingleBtn);
      if (await tingleBtn.isDisplayed()) await tingleBtn.click();

      expect(summaryText).toMatch(/Successfully published [1-9]/);
    });

    it('should publish as draft when draftOnly is checked', async () => {
      // Check draft-only via JS (avoids any visibility issues)
      await browser.execute(() => {
        const cb = document.querySelector('#draftOnly');
        if (!cb.checked) cb.click();
      });

      const urlInput = await $(SEL.urlInput);
      await urlInput.clearValue();
      await urlInput.setValue(testPageUrl);

      await $(SEL.publishButton).click();

      await $(SEL.progressModal).waitForDisplayed({ timeout: 10000 });

      await browser.waitUntil(
        () => browser.execute(() => {
          const el = document.querySelector('.tingle-modal-box__content');
          const text = el?.textContent || '';
          return text.includes('Successfully published') || text.includes('Failed to publish');
        }),
        { timeout: 60000, timeoutMsg: 'Publish summary did not appear' },
      );

      const summaryText = await browser.execute(
        () => document.querySelector('.tingle-modal-box__content')?.textContent || '',
      );

      const tingleBtn = await $(SEL.tingleBtn);
      if (await tingleBtn.isDisplayed()) await tingleBtn.click();

      expect(summaryText).toMatch(/Successfully published [1-9]/);
    });
  });
});
