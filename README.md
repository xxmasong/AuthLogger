# gauth — Google Account Switcher

A small Next.js app that lets you **log in / log out / switch the active Google
account** used by your n8n automations. One account is active at a time. On each
switch the app stores the account's tokens and (optionally) pushes them into an
n8n Google credential so n8n's native Google nodes always use the current account.

Other service credentials are out of scope: gauth is only the switchable
**Google** identity layer.

## Architecture

```
Browser ──► gauth (private network only)
   "Login with Google" → Google OAuth (offline + consent → refresh token)
   stores ACTIVE account at /data/active-account.json (Docker volume)
   on switch → create/update n8n credential via n8n REST API
        │
        ▼
   n8n native Google nodes  ──► Drive / Sheets / Docs / Calendar / Gmail …
   (or HTTP Request nodes via GET /api/token)
```

## Endpoints

| Route | Purpose |
|---|---|
| `GET /` | UI: shows active account, Login / Switch / Logout |
| `GET /api/auth/login` | Start Google OAuth |
| `GET /api/auth/callback` | OAuth callback → store + push to n8n |
| `GET /api/auth/logout` | Clear the active account |
| `GET /api/status` | JSON: who is active (no tokens) |
| `GET /api/token` | JSON: fresh access token. Requires `Authorization: Bearer <TOKEN_API_SECRET>`; disabled (503) if the secret is unset |
| `GET /api/health` | Health check |

## Config

Copy `.env.example` and set the values in your deployment environment. Key vars:
`GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI`, `APP_BASE_URL`, `TOKEN_API_SECRET`,
and optionally `N8N_API_URL/API_KEY` to auto-update the n8n credential. If
`N8N_CRED_ID` is blank, gauth creates the Google OAuth2 credential on the first
successful Google login and stores the created id in the persistent token store.

## Run locally

```bash
cp .env.example .env.local   # fill in the Google OAuth client and secrets
npm install
npm run dev                  # http://localhost:8090
```

## Deploy

The app ships as a Docker image (`Dockerfile`, Next.js standalone output).

1. Build and run the image with the variables from `.env.example`, and mount a
   persistent volume at `/data` for the token store.
2. Keep it on a private network (for example behind Tailscale or a VPN). It holds
   live Google tokens and is not meant to be exposed publicly.
3. CI (`.github/workflows/ci.yml`) lints, builds and smoke-tests the Docker image
   on every push. On `main` it can call a deploy webhook (set `COOLIFY_WEBHOOK`
   and `COOLIFY_TOKEN` as repository secrets) for push-to-deploy.

## Security notes

- Refresh tokens are stored only in the `/data` volume, never in the repo or logs.
- `/api/status` reports which account is active without returning tokens.
- `/api/token` is closed unless `TOKEN_API_SECRET` is set, and compares the
  bearer token in constant time.

The Google OAuth client's **Authorized redirect URI** must equal
`${APP_BASE_URL}/api/auth/callback`.
