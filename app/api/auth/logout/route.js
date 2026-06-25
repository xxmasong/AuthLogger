import { NextResponse } from "next/server";
import { clearActive } from "../../../../lib/store.js";

export const dynamic = "force-dynamic";

export async function GET(req) {
  await clearActive();
  const base = process.env.APP_BASE_URL || new URL(req.url).origin;
  return NextResponse.redirect(`${base}/`);
}
