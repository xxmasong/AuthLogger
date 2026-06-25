import { readActive } from "../lib/store.js";

export const dynamic = "force-dynamic";

export default async function Home() {
  const active = await readActive();

  const card = {
    width: "min(440px, 92vw)",
    background: "#121a2e",
    border: "1px solid #233152",
    borderRadius: 16,
    padding: 32,
    boxShadow: "0 10px 40px rgba(0,0,0,.4)",
  };
  const btn = {
    display: "inline-block",
    padding: "12px 20px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  };

  return (
    <main style={card}>
      <h1 style={{ fontSize: 22, marginTop: 0 }}>Google Account</h1>
      <p style={{ color: "#9fb0cc", marginTop: 4 }}>
        Active account used by n8n automations (Drive, Sheets, Docs, Calendar, Gmail…).
      </p>

      {active ? (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#0e1626",
              border: "1px solid #233152",
              borderRadius: 12,
              padding: 16,
              margin: "18px 0",
            }}
          >
            {active.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={active.picture} alt="" width={44} height={44} style={{ borderRadius: "50%" }} />
            ) : null}
            <div>
              <div style={{ fontWeight: 700 }}>{active.name || active.email}</div>
              <div style={{ color: "#9fb0cc", fontSize: 14 }}>{active.email}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/api/auth/login" style={{ ...btn, background: "#2d6cdf", color: "#fff" }}>
              Switch account
            </a>
            <a href="/api/auth/logout" style={{ ...btn, background: "#33415c", color: "#fff" }}>
              Logout
            </a>
          </div>
          <p style={{ color: "#6f7f9e", fontSize: 12, marginTop: 16 }}>
            Connected {new Date(active.connectedAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <p style={{ color: "#9fb0cc" }}>No account connected.</p>
          <a href="/api/auth/login" style={{ ...btn, background: "#2d6cdf", color: "#fff" }}>
            Login with Google
          </a>
        </div>
      )}
    </main>
  );
}
