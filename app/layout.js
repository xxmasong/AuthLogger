export const metadata = {
  title: "Google Account Switcher",
  description: "Login / logout / switch the active Google account for n8n automations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          fontFamily: "'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          margin: 0,
          minHeight: "100vh",
          color: "#e8edf7",
          background:
            "radial-gradient(1200px 600px at 15% -10%, #1b3a6b55 0%, transparent 60%)," +
            "radial-gradient(1000px 700px at 110% 10%, #5a2a8a44 0%, transparent 55%)," +
            "linear-gradient(160deg, #070b16 0%, #0b1224 55%, #0a0f1e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {children}
      </body>
    </html>
  );
}
