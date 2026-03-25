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
    pageUrls: [
      { url: 'https://milo.adobe.com/drafts/jmichnow/cards/document113', expected: 'success' },
      { url: 'https://milo.adobe.com/fr/drafts/gayane/bulkpublishcontent/bpcontent1', expected: 'success' },
      { url: 'https://milo.adobe.com/fr/drafts/gayane/bulkpublishcontent/bpcontent2', expected: 'success' },
      { url: 'https://milo.adobe.com/fr/drafts/gayane/bulkpublishcontent/bpcontent3', expected: 'success' },
      { url: 'https://milo.adobe.com/fr/drafts/gayane/bulkpublishcontent/fake', expected: 'failure' },
    ]
  },
  {
    name: 'stage',
    bulkPublisherUrl: 'https://stage--milo--adobecom.aem.live/tools/send-to-caas/bulkpublisher.html',
    pageUrls: [
      { url: 'https://stage--milo--adobecom.aem.live/drafts/jmichnow/cards/document113', expected: 'success' },
      { url: 'https://milo.stage.adobe.com/fr/drafts/gayane/bulkpublishcontent/bpcontent1', expected: 'success' },
      { url: 'https://milo.stage.adobe.com/fr/drafts/gayane/bulkpublishcontent/bpcontent2', expected: 'success' },
      { url: 'https://milo.stage.adobe.com/fr/drafts/gayane/bulkpublishcontent/bpcontent3', expected: 'success' },
      { url: 'https://milo.stage.adobe.com/fr/drafts/gayane/bulkpublishcontent/fake', expected: 'failure' },
    ]
  },
];

const SEL = {
  urlInput: '#urls',
  caasEnvSelect: '#caasEnv',
  publishButton: '#bulkpublish',
  progressModal: '.tingle-modal',
  modalContent: '.tingle-modal-box__content',
  tingleBtn: '.tingle-btn',
  successRowOk: 'table.success-table td.ok',
  entityId: '.entityid a'
};

const publishUrlHelper = async (input) => {
  const urls = Array.isArray(input) ? input : [input];

  const successUrlsLength = urls.filter(u => u.expected === 'success').length;
  const failedUrlsLength = urls.filter(u => u.expected === 'failure').length;
  const urlString = urls.map(u => u.url).join('\n');
  const urlInput = await $(SEL.urlInput);
  await urlInput.clearValue();
  await urlInput.setValue(urlString);

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

  expect(summaryText).toContain(`Successfully published ${successUrlsLength} pages`);
  expect(summaryText).toContain(`Failed to publish ${failedUrlsLength} pages`);
}

ENVIRONMENTS.forEach(({ name, bulkPublisherUrl, pageUrls }) => {
  describe(`Bulk Publisher [${name}] — Send to CaaS (dev)`, () => {
    let accessToken;

    before(async () => {
      accessToken = await getAutomationToken();
    });

    beforeEach(async () => {
      await browser.url(bulkPublisherUrl);

      // Wait for IMS library to be available
      await browser.waitUntil(
        () => browser.execute(() => typeof window.adobeImsFactory !== 'undefined'),
        { timeout: 15000, timeoutMsg: 'adobeImsFactory did not load' },
      );

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
      await publishUrlHelper(pageUrls[0]);
    });

    it('should publish as draft when draftOnly is checked', async () => {
      // Check draft-only via JS (avoids any visibility issues)
      await browser.execute(() => {
        const cb = document.querySelector('#draftOnly');
        if (!cb.checked) cb.click();
      });

      await publishUrlHelper(pageUrls[0]);
    });

    // TODO look into why lingo doesn't work
    it.skip('should return correct feature card data when Language First Localization is checked', async () => {
      // Check Language First Localization via JS (avoids any visibility issues)
      await browser.execute(() => {
        const cb = document.querySelector('#languageFirst');
        if (!cb.checked) cb.click();
      });

      await publishUrlHelper(pageUrls[0]);

      // check that the entity id a is present 
      const entityIdLink = await $(SEL.entityId);
      expect(await entityIdLink.isDisplayed()).toBe(true);

      // check that the href contains /dev/ which indicates it was published to the dev environment
      const href = await entityIdLink.getAttribute('href');
      expect(href).toContain('-chimera-dev');
      let data = null;
      // remove debug=1& from href
      const hrefNoDebug = href.replace('debug=1&', '');

      while (Date.now() - startTime < 30000) {
        try {
          const response = await fetch(hrefNoDebug);
          const json = await response.json();
          lastCountry = json.cards?.[0]?.country || 'N/A';
          if (lastCountry === 'xx') {
            data = json;
            break;
          }
        } catch (err) {
          // Transient errors -- retry
        }
      }
      if (!data) throw new Error(`Polling timed out. Last country: '${lastCountry}', expected: 'xx'`);
      expect(data.cards[0].country).toBe('xx');
    });

    it('should successfully publish multiple pages in one go', async () => {
      await publishUrlHelper(pageUrls.slice(0, 2));
    });

    it('should show failures in the summary modal when an invalid URL is included', async () => {
      // Using the fake URL from the array
      await publishUrlHelper(pageUrls[4]);
    });
  });
});
