import { NextResponse } from "next/server";
import { getFreshTokens } from "../../../lib/google.js";

export const dynamic = "force-dynamic";

// Returns a guaranteed-fresh access token for the ACTIVE account, for n8n
// HTTP-Request-node based flows. Protect with a shared secret: callers must send
// `Authorization: Bearer <TOKEN_API_SECRET>` if that env is set.
export async function GET(req) {
  const secret = process.env.TOKEN_API_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") || "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
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
