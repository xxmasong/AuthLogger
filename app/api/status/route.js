import { NextResponse } from "next/server";
import { readActive } from "../../../lib/store.js";

export const dynamic = "force-dynamic";

// Non-sensitive status: who is the active account (no tokens).
export async function GET() {
  const a = await readActive();
  if (!a) return NextResponse.json({ connected: false });
  return NextResponse.json({
    connected: true,
    email: a.email,
    name: a.name,
    connectedAt: a.connectedAt,
    scopes: (a.tokens?.scope || "").split(" ").filter(Boolean),
  });
}
