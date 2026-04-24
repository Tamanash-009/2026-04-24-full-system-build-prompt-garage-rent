import fs from "node:fs";
import path from "node:path";

const shellDir = path.join(process.cwd(), "native-shell");
fs.mkdirSync(shellDir, { recursive: true });

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GarageFlow Android Shell</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #020617;
        --panel: rgba(15, 23, 42, 0.82);
        --line: rgba(103, 232, 249, 0.18);
        --accent: #67e8f9;
        --text: #e2e8f0;
        --muted: #94a3b8;
        --warn: #fbbf24;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at top left, rgba(103, 232, 249, 0.18), transparent 28%),
          radial-gradient(circle at bottom right, rgba(251, 191, 36, 0.14), transparent 24%),
          linear-gradient(180deg, #020617, #0f172a 58%, #111827);
        color: var(--text);
        font-family: Inter, Segoe UI, sans-serif;
        padding: 24px;
      }

      .card {
        width: min(100%, 520px);
        border: 1px solid var(--line);
        background: var(--panel);
        border-radius: 28px;
        backdrop-filter: blur(18px);
        box-shadow: 0 24px 80px rgba(2, 6, 23, 0.45);
        padding: 28px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 22px;
      }

      .brand img {
        width: 56px;
        height: 56px;
        border-radius: 18px;
      }

      h1 {
        margin: 0 0 6px;
        font-size: 1.65rem;
      }

      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .stack {
        display: grid;
        gap: 14px;
        margin-top: 20px;
      }

      .panel {
        border: 1px solid rgba(148, 163, 184, 0.16);
        border-radius: 20px;
        padding: 16px;
        background: rgba(15, 23, 42, 0.74);
      }

      .panel strong {
        display: block;
        margin-bottom: 6px;
        color: #f8fafc;
      }

      code {
        color: var(--accent);
        font-family: Consolas, monospace;
        word-break: break-word;
      }

      .warning {
        color: var(--warn);
      }
    </style>
  </head>
  <body>
    <main class="card">
      <div class="brand">
        <img src="../public/logo-mark.svg" alt="GarageFlow" />
        <div>
          <h1>GarageFlow Android Shell</h1>
          <p>Native wrapper support is configured for the live GarageFlow deployment.</p>
        </div>
      </div>

      <div class="stack">
        <section class="panel">
          <strong>Next step</strong>
          <p>Set <code>CAPACITOR_ANDROID_SERVER_URL</code> to your deployed HTTPS URL before running <code>npm run android:sync</code> or <code>npm run android:apk</code>.</p>
        </section>
        <section class="panel">
          <strong>Why this shell exists</strong>
          <p>This GarageFlow app uses Next.js server features and Supabase auth flows, so the Android build is configured to wrap the deployed app instead of a static export.</p>
        </section>
        <section class="panel">
          <strong class="warning">Current fallback</strong>
          <p>If no deployment URL is configured yet, Capacitor will load this local shell until the live URL is provided.</p>
        </section>
      </div>
    </main>
  </body>
</html>
`;

fs.writeFileSync(path.join(shellDir, "index.html"), html);
