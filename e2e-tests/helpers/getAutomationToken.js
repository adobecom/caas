/**
 * Fetches a fresh IMS access token using client_credentials grant.
 * client_id is safe to hardcode (public identifier).
 * client_secret must be set as IMS_CLIENT_SECRET environment variable.
 * In GitHub Actions: store as a repo secret named IMS_CLIENT_SECRET.
 */
async function getAutomationToken() {
  const clientId = 'b04b4dc3c96f4a2082f57237d84547a4';
  const clientSecret = process.env.IMS_CLIENT_SECRET;

  if (!clientSecret) {
    throw new Error('IMS_CLIENT_SECRET environment variable is not set');
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'AdobeID,openid',
  });

  const res = await fetch('https://ims-na1.adobelogin.com/ims/token/v3', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IMS token fetch failed: ${res.status} ${text}`);
  }

  const { access_token } = await res.json();
  return access_token;
}

module.exports = getAutomationToken;
