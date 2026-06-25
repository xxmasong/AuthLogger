import { NextResponse } from "next/server";
import crypto from "crypto";
import { authUrl } from "../../../../lib/google.js";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");
  const res = NextResponse.redirect(authUrl(state));
  // CSRF: stash state in a short-lived cookie, verified in the callback.
  res.cookies.set("oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 600,
    path: "/",
  });
  return res;
}
