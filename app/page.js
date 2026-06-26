import { readActive } from "../lib/store.js";

export const dynamic = "force-dynamic";

const SCOPE_TAGS = ["Drive", "Sheets", "Docs", "Slides", "Calendar", "Forms", "Gmail", "Contacts", "Tasks"];

function GoogleG({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default async function Home() {
  const active = await readActive();

  const card = {
    width: "min(460px, 94vw)",
    background: "rgba(18, 26, 46, 0.72)",
    border: "1px solid rgba(120, 150, 210, 0.16)",
    borderRadius: 24,
    padding: "34px 32px",
    boxShadow: "0 24px 70px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.05)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  };
  const btnBase = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "13px 20px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 15,
    border: "none",
    cursor: "pointer",
    transition: "transform .12s ease, filter .12s ease",
  };
  const primary = {
    ...btnBase,
    background: "linear-gradient(135deg, #2f7cff 0%, #4f6bff 100%)",
    color: "#fff",
    boxShadow: "0 8px 24px rgba(47,124,255,.35)",
    flex: 1,
  };
  const ghost = {
    ...btnBase,
    background: "rgba(255,255,255,.06)",
    color: "#dfe6f5",
    border: "1px solid rgba(255,255,255,.10)",
  };
  const googleBtn = {
    ...btnBase,
    width: "100%",
    background: "#ffffff",
    color: "#1f2430",
    fontWeight: 600,
    padding: "14px 20px",
    boxShadow: "0 8px 24px rgba(0,0,0,.35)",
  };

  return (
    <main style={card}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div
          style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg, #2f7cff, #7b5cff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 18px rgba(80,90,255,.4)",
          }}
        >
          <GoogleG size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: 19, margin: 0, fontWeight: 800, letterSpacing: -0.3 }}>
            Google Account
          </h1>
          <div style={{ fontSize: 12.5, color: "#8a9bbd", marginTop: 2 }}>
            Active identity for your automations
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600,
              padding: "5px 10px", borderRadius: 999,
              background: active ? "rgba(52,211,153,.14)" : "rgba(148,163,184,.14)",
              color: active ? "#34d399" : "#94a3b8",
              border: `1px solid ${active ? "rgba(52,211,153,.3)" : "rgba(148,163,184,.25)"}`,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: 999, background: active ? "#34d399" : "#94a3b8" }} />
            {active ? "Connected" : "Not connected"}
          </span>
        </div>
      </div>

      <p style={{ color: "#9fb0cc", fontSize: 13.5, lineHeight: 1.5, margin: "14px 0 22px" }}>
        This account is used by n8n &amp; AI automations across Drive, Sheets, Docs, Calendar, Gmail and more.
      </p>

      {active ? (
        <>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 14,
              background: "rgba(8,14,26,.6)",
              border: "1px solid rgba(120,150,210,.14)",
              borderRadius: 16, padding: 16, marginBottom: 18,
            }}
          >
            {active.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.picture}
                alt=""
                width={48}
                height={48}
                style={{ borderRadius: "50%", border: "2px solid rgba(255,255,255,.12)" }}
              />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#2a3550" }} />
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15.5 }}>{active.name || active.email}</div>
              <div style={{ color: "#8a9bbd", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis" }}>
                {active.email}
              </div>
            </div>
          </div>

          {/* scope chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 22 }}>
            {SCOPE_TAGS.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 11.5, fontWeight: 500, color: "#aebbd6",
                  padding: "4px 10px", borderRadius: 999,
                  background: "rgba(120,150,210,.10)",
                  border: "1px solid rgba(120,150,210,.16)",
                }}
              >
                {s}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <a href="/api/auth/login" style={primary}>Switch account</a>
            <a href="/api/auth/logout" style={ghost}>Logout</a>
          </div>

          <p style={{ color: "#5f6f8e", fontSize: 11.5, marginTop: 18, marginBottom: 0, textAlign: "center" }}>
            Connected {new Date(active.connectedAt).toLocaleString()}
          </p>
        </>
      ) : (
        <>
          <a href="/api/auth/login" style={googleBtn}>
            <GoogleG size={18} />
            Sign in with Google
          </a>
          <p style={{ color: "#5f6f8e", fontSize: 11.5, marginTop: 16, marginBottom: 0, textAlign: "center" }}>
            You&apos;ll be asked to grant access to your Workspace apps.
          </p>
        </>
      )}
    </main>
  );
}
