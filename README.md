# gauth — Google Account Switcher

A small Next.js app that lets you **log in / log out / switch the active Google
account** used by your n8n automations. One account is active at a time. On each
switch the app stores the account's tokens and (optionally) pushes them into an
n8n Google credential so n8n's native Google nodes always use the current account.

Backends Claude/Codex are fixed subscriptions and are **not** managed here — this
app is only the flexible **Google** identity layer.

## Architecture

```
Browser ──► gauth (tailnet-only)
   "Login with Google" → Google OAuth (offline + consent → refresh token)
   stores ACTIVE account at /data/active-account.json (Docker volume)
   on switch → PATCH n8n credential via n8n REST API
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
| `GET /api/token` | JSON: fresh access token (Bearer `TOKEN_API_SECRET`) |
| `GET /api/health` | Health check |

## Config

Copy `.env.example` → set in Coolify's environment. Key vars:
`GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI`, `APP_BASE_URL`, `TOKEN_API_SECRET`,
and optionally `N8N_API_URL/API_KEY/CRED_ID` to auto-update the n8n credential.

## Deploy (Coolify + GitHub)

1. Push this repo to GitHub.
2. In Coolify (tailnet-only UI): new project → resource from this repo (Dockerfile build).
3. Set env vars from `.env.example`. Add a persistent volume mounted at `/data`.
4. Connect the GitHub App; expose only the deploy webhook publicly for push-to-deploy.
5. Serve over Tailscale (`gauth.<tailnet>.ts.net`) — no public exposure.

The Google OAuth client's **Authorized redirect URI** must equal
`${APP_BASE_URL}/api/auth/callback`.
