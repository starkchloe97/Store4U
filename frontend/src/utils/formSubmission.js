const configuredEndpoint = (import.meta.env.VITE_FORM_ENDPOINT || '').trim();
// In local Vite development, post to Apache's localhost document root by default.
// Production remains same-origin unless VITE_FORM_ENDPOINT is explicitly configured.
const FORM_ENDPOINT = configuredEndpoint || (import.meta.env.DEV
  ? 'http://localhost/api/submit.php'
  : '/api/submit.php');

export function collectTracking() {
  const query = new URLSearchParams(window.location.search);
  const utmSource = (query.get('utm_source') || '').trim();
  const referrer = document.referrer || '';
  return {
    utm_source: utmSource,
    referrer,
    gclid: (query.get('gclid') || '').trim(),
    msclkid: (query.get('msclkid') || '').trim(),
    url_source: window.location.href,
    source: utmSource || referrer || 'direct'
  };
}

export async function submitSiteForm(payload) {
  let response;
  try {
    response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    throw new Error(
      `Cannot reach the PHP form endpoint at ${FORM_ENDPOINT}. Make sure Apache is running and submit.php is in the web root's /api directory.`
    );
  }

  const contentType = response.headers.get('content-type') || '';
  let result = null;
  if (contentType.toLowerCase().includes('application/json')) {
    try {
      result = await response.json();
    } catch {
      result = null;
    }
  }

  if (!response.ok || result?.ok !== true) {
    if (typeof result?.error === 'string' && result.error.trim()) {
      throw new Error(result.error);
    }
    if (response.status === 404) {
      throw new Error(
        `PHP endpoint not found (404): ${FORM_ENDPOINT}. Check the file is at <Apache document root>/api/submit.php.`
      );
    }
    if (!contentType.toLowerCase().includes('application/json')) {
      throw new Error(
        `The form server returned a non-JSON response (HTTP ${response.status}). Check the endpoint URL and PHP/Apache configuration: ${FORM_ENDPOINT}.`
      );
    }
    throw new Error(`The form server returned an unexpected response (HTTP ${response.status}). Please check the PHP error log.`);
  }

  return result;
}
