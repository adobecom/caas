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

const BULK_PUBLISHER_URL = 'https://milo.adobe.com/tools/send-to-caas/bulkpublisher.html';
const DEV_POSTXDM_URL = 'https://14257-milocaasproxy-dev.adobeio-static.net/api/v1/web/milocaas/postXDM';
const CLIENT_ID = 'b04b4dc3c96f4a2082f57237d84547a4';
const pageUrls = [
  { url: 'https://milo.adobe.com/drafts/jmichnow/cards/document113', expected: 'success' },
  { url: 'https://milo.adobe.com/fr/drafts/gayane/bulkpublishcontent/bpcontent1', expected: 'success' },
  { url: 'https://milo.adobe.com/fr/drafts/gayane/bulkpublishcontent/bpcontent2', expected: 'success' },
  { url: 'https://milo.adobe.com/fr/drafts/gayane/bulkpublishcontent/bpcontent3', expected: 'success' },
  { url: 'https://milo.adobe.com/fr/drafts/gayane/bulkpublishcontent/fake', expected: 'failure' },
]

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

const publishUrlHelper = async (urls = [pageUrls[0]]) => {
  const successUrlsLength = urls.filter(u => u.expected === 'success').length;
  const failedUrlsLength = urls.filter(u => u.expected === 'failure').length;
  if (Array.isArray(urls)) urls = urls.join('\n');
  const urlInput = await $(SEL.urlInput);
  await urlInput.clearValue();
  await urlInput.setValue(urls);

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

  expect(summaryText).toBe(`Successfully published ${successUrlsLength} pages. Failed to publish ${failedUrlsLength} pages.`);
}

describe('Bulk Publisher — Send to CaaS (dev)', () => {
  let accessToken;

  before(async () => {
    accessToken = await getAutomationToken();
  });

  beforeEach(async () => {
    await browser.url(BULK_PUBLISHER_URL);

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
    await publishUrlHelper();
  });

  it('should publish as draft when draftOnly is checked', async () => {
    // Check draft-only via JS (avoids any visibility issues)
    await browser.execute(() => {
      const cb = document.querySelector('#draftOnly');
      if (!cb.checked) cb.click();
    });

    await publishUrlHelper();
  });

  it('should return correct feature card data when Language First Localization is checked', async () => {
    // Check Language First Localization via JS (avoids any visibility issues)
    await browser.execute(() => {
      const cb = document.querySelector('#languageFirstLocalization');
      if (!cb.checked) cb.click();
    });

    await publishUrlHelper();

    // check that the entity id a is present 
    const entityIdLink = await $(SEL.entityId);
    expect(await entityIdLink.isDisplayed()).toBe(true);

    // check that the href contains /dev/ which indicates it was published to the dev environment
    const href = await entityIdLink.getAttribute('href');
    expect(href).toContain('-chimera-dev');

    // call get on the href and check the response.cards[0].country == 'xx'
    const response = await fetch(href)
      .then(res => res.json())
      .catch(err => {
        throw new Error(`Failed to fetch published entity: ${err.message}`);
      });

    expect(response.cards[0].country).toBe('xx');
    expect(response.cards?.length).toBeGreaterThan(0);
  });

  it('should successfully publish multiple pages in one go', async () => {
    await publishUrlHelper(pageUrls.slice(0, 2));
  });

  it('should show failures in the summary modal when an invalid URL is included', async () => {
     // Using the fake URL from the array
    await publishUrlHelper(pageUrls[4]);
  });
});
