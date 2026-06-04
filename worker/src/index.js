// ══════════════════════════════════════════════════════════════════════════
// Cloudflare Worker — lead-capture endpoint voor de ERP Growth Hack Scan.
//
// Ontvangt JSON van élke scan (scan_id zit in de payload), valideert, en stuurt
// de lead per E-MAIL door naar een vast adres. Optioneel óók naar Google Sheets.
//
// BELANGRIJK — privacy van het doel-adres:
//   Het ontvangende e-mailadres staat NERGENS in de code of de frontend, maar
//   uitsluitend als SECRET (env-variabele LEAD_FORWARD_EMAIL). Zo kan niemand
//   die de site of de repo bekijkt zien waar de leads heen gaan.
//
// Env-variabelen (zie /worker/README.md):
//   E-mail (primair):
//     RESEND_API_KEY        API-sleutel van Resend            (SECRET)
//     LEAD_FORWARD_EMAIL    ontvangend adres                  (SECRET)
//     LEAD_FROM_EMAIL       afzender, geverifieerd domein     (var of secret)
//   Google Sheets (optioneel — alleen als ingesteld):
//     GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY (SECRET), GOOGLE_SHEET_ID, SHEET_TAB
//   Algemeen:
//     ALLOWED_ORIGIN        toegestane origin voor CORS (default "*")
// ══════════════════════════════════════════════════════════════════════════

export default {
  async fetch(request, env) {
    const cors = corsHeaders(env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, cors);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: "Ongeldige JSON" }, 400, cors); }

    const errors = validate(body);
    if (errors.length) return json({ error: "Validatie mislukt", details: errors }, 422, cors);

    // Verzamel de afleverkanalen die zijn geconfigureerd.
    const tasks = [];
    if (env.RESEND_API_KEY && env.LEAD_FORWARD_EMAIL) tasks.push(["email", sendLeadEmail(env, body)]);
    if (env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_PRIVATE_KEY && env.GOOGLE_SHEET_ID) {
      tasks.push(["sheet", appendToSheet(env, toRow(body))]);
    }

    if (!tasks.length) {
      console.error("Geen afleverkanaal geconfigureerd (e-mail of Sheets).");
      return json({ error: "Server niet geconfigureerd" }, 500, cors);
    }

    const results = await Promise.allSettled(tasks.map((t) => t[1]));
    const failed = results
      .map((r, i) => ({ name: tasks[i][0], r }))
      .filter((x) => x.r.status === "rejected");

    failed.forEach((f) => console.error(`Kanaal '${f.name}' faalde:`, f.r.reason && f.r.reason.stack ? f.r.reason.stack : f.r.reason));

    // Geslaagd zolang minstens één kanaal de lead heeft afgeleverd.
    if (failed.length === results.length) return json({ error: "Afleveren mislukte" }, 502, cors);

    return json({ ok: true }, 200, cors);
  },
};

// ── Validatie ───────────────────────────────────────────────────────────────
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
  const to = env.LEAD_FORWARD_EMAIL;
  const from = env.LEAD_FROM_EMAIL || "ERP Scan <onboarding@resend.dev>";
  const subject = `Nieuwe lead — ${b.scan_title || b.scan_id} (${b.total_score ?? "?"}/100)`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      // Antwoorden gaat direct naar de prospect:
      reply_to: b.lead?.email || undefined,
      subject,
      html: buildEmailHtml(b),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

function buildEmailHtml(b) {
  const lead = b.lead || {};
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const dims = Array.isArray(b.dimensions) ? b.dimensions : [];
  const dimRows = dims.map((d) =>
    `<tr><td style="padding:4px 10px;border-bottom:1px solid #eee">${esc(d.label)}</td>
         <td style="padding:4px 10px;border-bottom:1px solid #eee;text-align:right">${esc(d.pct)}%</td>
         <td style="padding:4px 10px;border-bottom:1px solid #eee">${esc(d.level)}</td></tr>`).join("");
  const answers = Array.isArray(b.answers) ? b.answers : [];
  const answerRows = answers.map((a) =>
    `<tr><td style="padding:3px 10px;border-bottom:1px solid #f3f3f3;color:#555">${esc(a.text || a.question_id)}</td>
         <td style="padding:3px 10px;border-bottom:1px solid #f3f3f3">${esc(a.label || "")} (${esc(a.score)})</td></tr>`).join("");

  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:640px">
    <h2 style="margin:0 0 4px">Nieuwe lead via de ERP-scan</h2>
    <p style="margin:0 0 16px;color:#666">${esc(b.scan_title || b.scan_id)} — score ${esc(b.total_score)}/100 — <b>${esc(b.verdict_label || "")}</b></p>

    <h3 style="margin:18px 0 6px">Contact</h3>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:3px 10px;color:#666">Naam</td><td style="padding:3px 10px"><b>${esc(lead.name)}</b></td></tr>
      <tr><td style="padding:3px 10px;color:#666">Organisatie</td><td style="padding:3px 10px">${esc(lead.organisation)}</td></tr>
      <tr><td style="padding:3px 10px;color:#666">E-mail</td><td style="padding:3px 10px"><a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a></td></tr>
      <tr><td style="padding:3px 10px;color:#666">Telefoon</td><td style="padding:3px 10px">${esc(lead.phone || "—")}</td></tr>
    </table>

    <h3 style="margin:20px 0 6px">Score per as</h3>
    <table style="border-collapse:collapse;font-size:14px;width:100%">${dimRows}</table>

    <h3 style="margin:20px 0 6px">Antwoorden</h3>
    <table style="border-collapse:collapse;font-size:13px;width:100%">${answerRows}</table>

    <p style="margin:18px 0 0;color:#999;font-size:12px">Bron: ${esc(b.meta?.url || "")}</p>
  </div>`;
}

// ── Google Sheets (optioneel): rij toevoegen ─────────────────────────────────
function toRow(b) {
  const lead = b.lead || {};
  const dims = Array.isArray(b.dimensions) ? b.dimensions : [];
  const dimStr = dims.map((d) => `${d.label}: ${d.pct}% (${d.level})`).join(" | ");
  const answers = Array.isArray(b.answers) ? b.answers.map((a) => `${a.question_id}=${a.score}`).join(",") : "";
  return [
    new Date().toISOString(), b.scan_id || "", b.scan_title || "", b.audience || "",
    String(b.total_score ?? ""), b.verdict_label || "",
    lead.name || "", lead.organisation || "", lead.email || "", lead.phone || "",
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
  const clean = pem
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const der = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("pkcs8", der.buffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function b64url(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...headers } });
}
