// Simple file-backed token store for the single ACTIVE Google account.
// One account active at a time: login overwrites, logout clears.
// Persisted to a Docker volume path (TOKEN_STORE_PATH) so it survives redeploys.
import { promises as fs } from "fs";
import path from "path";

const STORE_PATH = process.env.TOKEN_STORE_PATH || "/data/active-account.json";

export async function readActive() {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function writeActive(record) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(record, null, 2), { mode: 0o600 });
}

export async function clearActive() {
  try {
    await fs.unlink(STORE_PATH);
  } catch {
    /* already absent */
  }
}
