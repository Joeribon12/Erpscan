// ══════════════════════════════════════════════════════════════════════════
// SITE-WORKER — serveert de statische site én handelt lead-submissions af.
//
// Deze Worker wordt automatisch door Cloudflare gedeployd bij elke git push
// (geen lokale tooling nodig). Hij doet twee dingen:
//   1. POST /api/lead   -> valideert de lead en stuurt 'm per e-mail door
//   2. al het andere    -> serveert statische bestanden uit /public (met
//                          SPA-fallback naar index.html voor /maakindustrie etc.)
//
// 🔒 Het ontvangende e-mailadres staat NERGENS in code/frontend/repo, maar
//    uitsluitend als SECRET (LEAD_FORWARD_EMAIL) in het Cloudflare-dashboard.
//    Niemand die de site of repo bekijkt, kan zien waar de leads heen gaan.
//
// Secrets/vars (Cloudflare-dashboard → Worker → Settings → Variables and Secrets):
//   RESEND_API_KEY       Resend API-sleutel                 (SECRET)
//   LEAD_FORWARD_EMAIL   ontvangend adres                   (SECRET)
//   LEAD_FROM_EMAIL      afzender (geverifieerd domein)     (var, optioneel)
//   GOOGLE_*             optioneel, voor schrijven naar Google Sheets
// ══════════════════════════════════════════════════════════════════════════

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── Lead-API ──────────────────────────────────────────────────────────
    if (url.pathname === "/api/lead") {
      if (request.method === "OPTIONS") return new Response(null, { status: 204 });
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
      return handleLead(request, env);
    }

    // ── Statische site + SPA-fallback ──────────────────────────────────────
    const res = await env.ASSETS.fetch(request);
    if (res.status !== 404) return res;
    // Onbekend pad (bv. /maakindustrie, /info/erp-feiten) -> index.html (SPA).
    return env.ASSETS.fetch(new Request(new URL("/index.html", url.origin), { method: "GET" }));
  },
};

// ── Lead-afhandeling ──────────────────────────────────────────────────────
async function handleLead(request, env) {
  let body;
  try { body = await request.json(); }
  catch { return json({ error: "Ongeldige JSON" }, 400); }

  const errors = validate(body);
  if (errors.length) return json({ error: "Validatie mislukt", details: errors }, 422);

  const tasks = [];
  if (env.RESEND_API_KEY && env.LEAD_FORWARD_EMAIL) tasks.push(["email", sendLeadEmail(env, body)]);
  if (env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_PRIVATE_KEY && env.GOOGLE_SHEET_ID) {
    tasks.push(["sheet", appendToSheet(env, toRow(body))]);
  }
  if (!tasks.length) {
    console.error("Geen afleverkanaal geconfigureerd (e-mail of Sheets).");
    return json({ error: "Server niet geconfigureerd" }, 500);
  }

  const results = await Promise.allSettled(tasks.map((t) => t[1]));
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`Kanaal '${tasks[i][0]}' faalde:`, r.reason && r.reason.stack ? r.reason.stack : r.reason);
  });
  if (results.every((r) => r.status === "rejected")) return json({ error: "Afleveren mislukte" }, 502);

  return json({ ok: true }, 200);
}

// ── Validatie ──────────────────────────────────────────────────────────────
function validate(b) {
  const e = [];
  if (!b || typeof b !== "object") return ["payload ontbreekt"];
  if (!b.scan_id) e.push("scan_id ontbreekt");
  const lead = b.lead || {};
  if (!lead.name || String(lead.name).trim().length < 2) e.push("naam ongeldig");
  if (!lead.organisation || String(lead.organisation).trim().length < 2) e.push("organisatie ongeldig");
  if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(lead.email))) e.push("e-mail ongeldig");
  if (lead.consent !== true) e.push("consent verplicht");
  return e;
}

// ── E-mail doorsturen (Resend) ───────────────────────────────────────────────
async function sendLeadEmail(env, b) {
  const from = env.LEAD_FROM_EMAIL || "ERP Scan <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [env.LEAD_FORWARD_EMAIL],
      reply_to: b.lead?.email || undefined,
      subject: `Nieuwe lead — ${b.scan_title || b.scan_id} (${b.total_score ?? "?"}/100)`,
      html: buildEmailHtml(b),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

function buildEmailHtml(b) {
  const lead = b.lead || {};
  const e = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const dims = Array.isArray(b.dimensions) ? b.dimensions : [];
  const dimRows = dims.map((d) =>
    `<tr><td style="padding:4px 10px;border-bottom:1px solid #eee">${e(d.label)}</td>
         <td style="padding:4px 10px;border-bottom:1px solid #eee;text-align:right">${e(d.pct)}%</td>
         <td style="padding:4px 10px;border-bottom:1px solid #eee">${e(d.level)}</td></tr>`).join("");
  const answers = Array.isArray(b.answers) ? b.answers : [];
  const answerRows = answers.map((a) =>
    `<tr><td style="padding:3px 10px;border-bottom:1px solid #f3f3f3;color:#555">${e(a.text || a.question_id)}</td>
         <td style="padding:3px 10px;border-bottom:1px solid #f3f3f3">${e(a.label || "")} (${e(a.score)})</td></tr>`).join("");
  const profile = b.profile || {};
  const profileRows = Object.keys(profile).map((k) =>
    `<tr><td style="padding:3px 10px;color:#666">${e(profile[k].label || k)}</td><td style="padding:3px 10px"><b>${e(profile[k].value)}</b></td></tr>`).join("");

  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:640px">
    <h2 style="margin:0 0 4px">Nieuwe lead via de ERP-scan</h2>
    <p style="margin:0 0 16px;color:#666">${e(b.scan_title || b.scan_id)} — score ${e(b.total_score)}/100 — <b>${e(b.verdict_label || "")}</b></p>
    <h3 style="margin:18px 0 6px">Contact</h3>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:3px 10px;color:#666">Naam</td><td style="padding:3px 10px"><b>${e(lead.name)}</b></td></tr>
      <tr><td style="padding:3px 10px;color:#666">Organisatie</td><td style="padding:3px 10px">${e(lead.organisation)}</td></tr>
      <tr><td style="padding:3px 10px;color:#666">E-mail</td><td style="padding:3px 10px"><a href="mailto:${e(lead.email)}">${e(lead.email)}</a></td></tr>
      <tr><td style="padding:3px 10px;color:#666">Telefoon</td><td style="padding:3px 10px">${e(lead.phone || "—")}</td></tr>
    </table>
    ${profileRows ? `<h3 style="margin:20px 0 6px">Profiel</h3><table style="border-collapse:collapse;font-size:14px">${profileRows}</table>` : ""}
    <h3 style="margin:20px 0 6px">Score per as</h3>
    <table style="border-collapse:collapse;font-size:14px;width:100%">${dimRows}</table>
    <h3 style="margin:20px 0 6px">Antwoorden</h3>
    <table style="border-collapse:collapse;font-size:13px;width:100%">${answerRows}</table>
    <p style="margin:18px 0 0;color:#999;font-size:12px">Bron: ${e(b.meta?.url || "")}</p>
  </div>`;
}

// ── Google Sheets (optioneel) ────────────────────────────────────────────────
function toRow(b) {
  const lead = b.lead || {};
  const dims = Array.isArray(b.dimensions) ? b.dimensions : [];
  const dimStr = dims.map((d) => `${d.label}: ${d.pct}% (${d.level})`).join(" | ");
  const answers = Array.isArray(b.answers) ? b.answers.map((a) => `${a.question_id}=${a.score}`).join(",") : "";
  return [
    new Date().toISOString(), b.scan_id || "", b.scan_title || "", b.audience || "",
    String(b.total_score ?? ""), b.verdict_label || "",
    lead.name || "", lead.organisation || "", lead.email || "", lead.phone || "",
    b.profile?.erp?.value || "", b.profile?.omzet?.value || "", b.profile?.fte?.value || "",
    dimStr, answers, b.meta?.url || "", b.meta?.referrer || "",
  ];
}

async function appendToSheet(env, row) {
  const token = await getAccessToken(env);
  const tab = env.SHEET_TAB || "Leads";
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}` +
    `/values/${encodeURIComponent(tab)}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) throw new Error(`Sheets API ${res.status}: ${await res.text()}`);
}

async function getAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now, exp: now + 3600,
  };
  const enc = (obj) => b64url(new TextEncoder().encode(JSON.stringify(obj)));
  const signingInput = `${enc({ alg: "RS256", typ: "JWT" })}.${enc(claim)}`;
  const key = await importPrivateKey(env.GOOGLE_PRIVATE_KEY);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signingInput));
  const jwt = `${signingInput}.${b64url(new Uint8Array(sig))}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  if (!res.ok) throw new Error(`Token endpoint ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token;
}

async function importPrivateKey(pem) {
  const clean = pem.replace(/\\n/g, "\n").replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("pkcs8", der.buffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function b64url(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
