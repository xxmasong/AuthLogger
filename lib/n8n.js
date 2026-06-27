// Push the active Google OAuth tokens into an n8n credential so n8n's native
// Google nodes always use the currently-active account. Uses n8n's public REST API.
//
// Env:
//   N8N_API_URL   e.g. http://10.10.2.12:5678/api/v1
//   N8N_API_KEY   an n8n API key (Settings > API)
//   N8N_CRED_ID   optional id of an existing "Google OAuth2 API" credential
//   N8N_CRED_TYPE defaults to googleOAuth2Api
//
// If URL/key are unset, the push is skipped (the /token endpoint still works for
// HTTP-Request-node based flows). If N8N_CRED_ID is unset, the app creates a
// credential once and stores its id with the active account record.
import { writeActive } from "./store.js";

function apiBase() {
  return process.env.N8N_API_URL?.replace(/\/+$/, "");
}

function authHeaders() {
  return {
    "X-N8N-API-KEY": process.env.N8N_API_KEY,
    "Content-Type": "application/json",
  };
}

function credentialBody(record) {
  const t = record.tokens || {};
  return {
    name: `Google (active: ${record.email})`,
    type: process.env.N8N_CRED_TYPE || "googleOAuth2Api",
    data: {
      serverUrl: "https://oauth2.googleapis.com/token",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: t.scope,
      sendAdditionalBodyProperties: false,
      additionalBodyProperties: "{}",
      allowedHttpRequestDomains: "all",
      oauthTokenData: JSON.stringify({
        access_token: t.access_token,
        refresh_token: t.refresh_token,
        scope: t.scope,
        token_type: t.token_type || "Bearer",
        expiry_date: t.expiry_date,
      }),
    },
  };
}

async function n8nFetch(path, options) {
  const res = await fetch(`${apiBase()}${path}`, {
    ...options,
    headers: authHeaders(),
  });
  const text = await res.text();
  if (res.ok) {
    try {
      return { ok: true, status: res.status, data: text ? JSON.parse(text) : null };
    } catch {
      return { ok: true, status: res.status, data: null };
    }
  }
  return { ok: false, status: res.status, error: text.slice(0, 300) };
}

async function createCredential(record) {
  const result = await n8nFetch("/credentials", {
    method: "POST",
    body: JSON.stringify(credentialBody(record)),
  });
  if (!result.ok) return result;

  const id = result.data?.id;
  if (!id) {
    return { ok: false, status: result.status, error: "n8n did not return a credential id" };
  }

  record.n8nCredentialId = String(id);
  await writeActive(record);
  return { ok: true, status: result.status, created: true, credentialId: record.n8nCredentialId };
}

async function updateCredential(credentialId, record) {
  const result = await n8nFetch(`/credentials/${encodeURIComponent(credentialId)}`, {
    method: "PATCH",
    body: JSON.stringify(credentialBody(record)),
  });
  if (!result.ok) return result;
  return { ok: true, status: result.status, updated: true, credentialId: String(credentialId) };
}

export async function pushToN8n(record) {
  const configuredCredentialId = process.env.N8N_CRED_ID;
  const credentialId = configuredCredentialId || record.n8nCredentialId;

  if (!apiBase() || !process.env.N8N_API_KEY) {
    return { skipped: true, reason: "n8n env not configured" };
  }

  if (!credentialId) {
    return { skipped: false, ...(await createCredential(record)) };
  }

  const update = await updateCredential(credentialId, record);
  if (update.ok || configuredCredentialId || update.status !== 404) {
    return { skipped: false, ...update };
  }

  return { skipped: false, ...(await createCredential(record)) };
}
