import { NextResponse } from "next/server";
import { exchangeAndStore } from "../../../../lib/google.js";
import { pushToN8n } from "../../../../lib/n8n.js";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = req.cookies.get("oauth_state")?.value;

  if (!code) {
    return NextResponse.json({ error: "missing code" }, { status: 400 });
  }
  if (!state || !cookieState || state !== cookieState) {
    return NextResponse.json({ error: "state mismatch" }, { status: 400 });
  }

  try {
    const record = await exchangeAndStore(code);
    const n8nResult = await pushToN8n(record);
    const base = process.env.APP_BASE_URL || url.origin;
    const res = NextResponse.redirect(`${base}/?connected=${encodeURIComponent(record.email)}`);
    res.cookies.delete("oauth_state");
    // surface n8n push outcome in a header for debugging (not user-facing)
    res.headers.set("x-n8n-push", JSON.stringify(n8nResult));
    return res;
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
