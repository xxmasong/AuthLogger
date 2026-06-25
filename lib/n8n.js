// Push the active Google OAuth tokens into an n8n credential so n8n's native
// Google nodes always use the currently-active account. Uses n8n's public REST API.
//
// Env:
//   N8N_API_URL   e.g. http://10.10.2.12:5678/api/v1
//   N8N_API_KEY   an n8n API key (Settings > API)
//   N8N_CRED_ID   id of an existing "Google OAuth2 API" credential to update
//   N8N_CRED_TYPE defaults to googleOAuth2Api
//
// If these are unset, the push is skipped (the /token endpoint still works for
// HTTP-Request-node based flows).
export async function pushToN8n(record) {
  const { N8N_API_URL, N8N_API_KEY, N8N_CRED_ID } = process.env;
  const credType = process.env.N8N_CRED_TYPE || "googleOAuth2Api";
  if (!N8N_API_URL || !N8N_API_KEY || !N8N_CRED_ID) {
    return { skipped: true, reason: "n8n env not configured" };
  }
  const t = record.tokens;
  // n8n's googleOAuth2Api credential stores the oauthTokenData blob.
  const body = {
    name: `Google (active: ${record.email})`,
    type: credType,
    data: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      oauthTokenData: {
        access_token: t.access_token,
        refresh_token: t.refresh_token,
        scope: t.scope,
        token_type: t.token_type || "Bearer",
        expiry_date: t.expiry_date,
      },
    },
  };
  const res = await fetch(`${N8N_API_URL}/credentials/${N8N_CRED_ID}`, {
    method: "PATCH",
    headers: { "X-N8N-API-KEY": N8N_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    return { skipped: false, ok: false, status: res.status, error: text.slice(0, 300) };
  }
  return { skipped: false, ok: true };
}
