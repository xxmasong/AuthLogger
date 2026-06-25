import { google } from "googleapis";
import { GOOGLE_SCOPES } from "./scopes.js";
import { readActive, writeActive } from "./store.js";

export function oauthClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error("Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI");
  }
  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
}

export function authUrl(state) {
  return oauthClient().generateAuthUrl({
    access_type: "offline",        // request a refresh token
    prompt: "consent",            // force consent so refresh_token is always returned
    include_granted_scopes: true,
    scope: GOOGLE_SCOPES,
    state,
  });
}

// Exchange the auth code, fetch the profile, persist as the active account.
export async function exchangeAndStore(code) {
  const client = oauthClient();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: "v2", auth: client });
  const { data: me } = await oauth2.userinfo.get();
  const record = {
    email: me.email,
    name: me.name,
    picture: me.picture,
    tokens,                       // access_token, refresh_token, expiry_date, scope
    connectedAt: new Date().toISOString(),
  };
  await writeActive(record);
  return record;
}

// Return a guaranteed-fresh access token for the active account (auto-refresh).
export async function getFreshTokens() {
  const record = await readActive();
  if (!record) return null;
  const client = oauthClient();
  client.setCredentials(record.tokens);
  // Refresh if expired or about to expire (60s buffer).
  const expiry = record.tokens.expiry_date || 0;
  if (Date.now() > expiry - 60_000) {
    const { credentials } = await client.refreshAccessToken();
    record.tokens = { ...record.tokens, ...credentials };
    await writeActive(record);
  }
  return record;
}
