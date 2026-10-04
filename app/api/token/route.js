import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getFreshTokens } from "../../../lib/google.js";

export const dynamic = "force-dynamic";

// Constant-time comparison so the secret can't be recovered from response timing.
function matches(given, expected) {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Returns a guaranteed-fresh access token for the ACTIVE account, for n8n
// HTTP-Request-node based flows. Callers must send
// `Authorization: Bearer <TOKEN_API_SECRET>`. The endpoint stays closed when
// the secret is not configured, so a missing env var never exposes tokens.
export async function GET(req) {
  const secret = process.env.TOKEN_API_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "token endpoint disabled: TOKEN_API_SECRET is not set" }, { status: 503 });
  }
  const auth = req.headers.get("authorization") || "";
  if (!matches(auth, `Bearer ${secret}`)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const record = await getFreshTokens();
  if (!record) return NextResponse.json({ error: "no active account" }, { status: 404 });
  return NextResponse.json({
    email: record.email,
    access_token: record.tokens.access_token,
    expiry_date: record.tokens.expiry_date,
    token_type: record.tokens.token_type || "Bearer",
  });
}
