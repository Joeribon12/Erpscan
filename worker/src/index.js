// ══════════════════════════════════════════════════════════════════════════
// Cloudflare Worker — lead-capture endpoint voor de ERP Growth Hack Scan.
//
// Ontvangt JSON van élke scan (scan_id zit in de payload), valideert, en schrijft
// één regel naar een Google Sheet via de Sheets API met een service account.
//
// Benodigde env-variabelen (zie /worker/README of de hoofd-README):
//   GOOGLE_SERVICE_ACCOUNT_EMAIL  service-account e-mail
//   GOOGLE_PRIVATE_KEY            private key (PEM, met \n of echte newlines) — als SECRET
//   GOOGLE_SHEET_ID              de id uit de Sheet-URL
//   SHEET_TAB                    (optioneel) tabblad-naam, default "Leads"
//   ALLOWED_ORIGIN               (optioneel) toegestane origin voor CORS, default "*"
// ══════════════════════════════════════════════════════════════════════════

export default {
  async fetch(request, env) {
    const cors = corsHeaders(env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, cors);

    // 1. JSON parsen
    let body;
    try { body = await request.json(); }
    catch { return json({ error: "Ongeldige JSON" }, 400, cors); }

    // 2. Valideren (zelfde regels als client-side, server is de waarheid)
    const errors = validate(body);
    if (errors.length) return json({ error: "Validatie mislukt", details: errors }, 422, cors);

    // 3. Naar Google Sheet schrijven
    try {
      await appendToSheet(env, toRow(body));
    } catch (err) {
      console.error("Sheet append faalde:", err && err.stack ? err.stack : err);
      return json({ error: "Opslaan mislukte" }, 502, cors);
    }

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

// ── Payload -> platte rij voor de Sheet ─────────────────────────────────────
function toRow(b) {
  const lead = b.lead || {};
  const dims = Array.isArray(b.dimensions) ? b.dimensions : [];
  const dimStr = dims.map((d) => `${d.label}: ${d.pct}% (${d.level})`).join(" | ");
  const answers = Array.isArray(b.answers)
    ? b.answers.map((a) => `${a.question_id}=${a.score}`).join(",")
    : "";

  // Kolomvolgorde — pas desgewenst aan; houd de Sheet-header gelijk (zie README).
  return [
    new Date().toISOString(),       // Tijdstip (server)
    b.scan_id || "",                // Scan
    b.scan_title || "",             // Scan-titel
    b.audience || "",               // Doelgroep
    String(b.total_score ?? ""),    // Totaalscore
    b.verdict_label || "",          // Verdict
    lead.name || "",                // Naam
    lead.organisation || "",        // Organisatie
    lead.email || "",               // E-mail
    lead.phone || "",               // Telefoon
    dimStr,                         // Scores per as
    answers,                        // Antwoorden (q=score)
    b.meta?.url || "",              // Bron-URL
    b.meta?.referrer || "",         // Referrer
  ];
}

// ── Google Sheets: rij toevoegen ────────────────────────────────────────────
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

// ── OAuth2: service-account JWT -> access token ─────────────────────────────
async function getAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const enc = (obj) => b64url(new TextEncoder().encode(JSON.stringify(obj)));
  const header = enc({ alg: "RS256", typ: "JWT" });
  const payload = enc(claim);
  const signingInput = `${header}.${payload}`;

  const key = await importPrivateKey(env.GOOGLE_PRIVATE_KEY);
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signingInput)
  );
  const jwt = `${signingInput}.${b64url(new Uint8Array(sig))}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`Token endpoint ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token;
}

// PEM (PKCS#8) private key -> CryptoKey
async function importPrivateKey(pem) {
  const clean = pem
    .replace(/\\n/g, "\n")                       // toestaan dat de key met \n is opgeslagen
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const der = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8", der.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false, ["sign"]
  );
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
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}
