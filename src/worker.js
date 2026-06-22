// ══════════════════════════════════════════════════════════════════════════
// SITE-WORKER — serveert de statische site én handelt lead-submissions af.
//
// Deze Worker wordt automatisch door Cloudflare gedeployd bij elke git push
// (geen lokale tooling nodig). Hij doet twee dingen:
//   1. POST /api/lead   -> valideert de lead en stuurt 'm per e-mail door
//   2. al het andere    -> serveert statische bestanden uit /public (met
//                          SPA-fallback naar index.html voor /erp-scan-maakindustrie etc.)
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

import { renderRouteContent } from "./seo-content.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── 301-redirects: oude scan-URL's -> nieuwe keyword-slugs ─────────────
    const redirectTo = REDIRECTS[url.pathname];
    if (redirectTo) return Response.redirect(SITE_ORIGIN + redirectTo, 301);

    // ── Lead-API ──────────────────────────────────────────────────────────
    if (url.pathname === "/api/lead") {
      if (request.method === "OPTIONS") return new Response(null, { status: 204 });
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
      return handleLead(request, env);
    }

    // ── Feedback-API ("Was deze scan behulpzaam?") — geen persoonsgegevens ──
    if (url.pathname === "/api/feedback") {
      if (request.method === "OPTIONS") return new Response(null, { status: 204 });
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
      return handleFeedback(request, env);
    }

    // ── Statische assets (js/css/img/xml/...): direct serveren ─────────────
    const res = await env.ASSETS.fetch(request);
    const ct = res.headers.get("content-type") || "";
    // 304 Not Modified: de browser revalideert een gecachete asset (engine.js,
    // config.js, styles.css, scan-modules ...). Dit MOET rechtstreeks terug —
    // anders valt het door naar servePage en krijgt de browser index.html (HTML)
    // terug op een verzoek om JavaScript, faalt de module en blijft de pagina
    // blanco (zichtbaar als "soms meerdere keren refreshen vóór de pagina laadt").
    if (res.status === 304) return res;
    if (res.status === 200 && !ct.includes("text/html")) return res;

    // ── HTML-paginaroute: index.html met per-route SEO-meta (titel,
    //    description, canonical, og + optionele FAQ-structured-data) ────────
    return servePage(env, url, res);
  },
};

// ── SEO: per-route titel/description (+ optionele FAQ) ───────────────────────
async function servePage(env, url, matched) {
  let html;
  if (matched && matched.status === 200) html = await matched.text();
  else {
    const idx = await env.ASSETS.fetch(new Request(new URL("/index.html", url.origin), { method: "GET" }));
    html = await idx.text();
  }
  const m = SEO[url.pathname] || SEO["/"];
  let out = injectSEO(html, m, SITE_ORIGIN + url.pathname);

  // Server-side body-content: echte, unieke tekst per route binnen <main id="app">,
  // zodat zoekmachines elke pagina als "vol" en uniek zien (ook zonder JS).
  // De engine vervangt #app bij het laden, dus bezoekers krijgen de echte app.
  const content = renderRouteContent(url.pathname);
  if (content) out = out.replace("</main>", `<div id="ssr-content">${content}</div></main>`);

  return new Response(out, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function injectSEO(html, m, canonical) {
  const e = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const t = e(m.t), d = e(m.d), u = e(canonical);
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${u}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`);
  let head = `<link rel="canonical" href="${u}"/>`;
  if (m.faq) {
    const ld = {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: m.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    };
    head += `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
  }
  return html.replace("</head>", head + "</head>");
}

// Vaste canonieke origin (zo wijzen canonical/og:url altijd naar het hoofddomein).
const SITE_ORIGIN = "https://erp-scan.net";

// Oude scan-paden -> nieuwe keyword-slugs (301).
const REDIRECTS = {
  "/algemeen": "/erp-systeem-scan",
  "/maakindustrie": "/erp-scan-maakindustrie",
  "/retail": "/erp-scan-retail",
  "/groothandel": "/erp-scan-groothandel",
  "/food": "/erp-scan-food",
  "/finance": "/erp-scan-finance",
  "/logistiek": "/erp-scan-logistiek",
  "/bouw": "/erp-scan-bouw",
  "/utilities": "/erp-scan-energie",
  "/dienstverlening": "/erp-scan-dienstverlening",
};

const SEO = {
  "/": { t: "Gratis ERP-scan maakindustrie: klaar voor SAP S/4HANA?", d: "SAP ECC loopt af in 2027. Doe de gratis ERP-scan voor de maakindustrie en ontdek in 3 minuten hoe klaar je productiebedrijf is voor de overstap naar S/4HANA." },
  "/erp-systeem-scan": { t: "Gratis ERP-scan: test of je ERP-systeem futureproof is", d: "Hoe futureproof is jouw ERP-systeem? Doe de gratis ERP-scan: een erp-assessment in 3 minuten met diagnose op strategie, AI, clean core, data en schaalbaarheid." },
  "/erp-scan-maakindustrie": { t: "ERP-scan maakindustrie: SAP ECC naar S/4HANA testen", d: "Hoe klaar is je ERP-systeem voor de maakindustrie en S/4HANA? Gratis ERP-scan voor productiebedrijven op SAP ECC, met advies richting de 2027-deadline." },
  "/erp-scan-retail": { t: "ERP-scan retail: futureproof ERP-systeem voor e-commerce", d: "Hoe futureproof is je ERP-systeem voor omnichannel retail en e-commerce? Doe de gratis ERP-scan en zie waar voorraad, data of marges je remmen." },
  "/erp-scan-groothandel": { t: "ERP-scan groothandel & distributie: test je ERP-systeem", d: "Hoe sterk staat je ERP-systeem in de groothandel en distributie? Gratis ERP-scan met advies over marge, voorraad, EDI en schaalbaarheid." },
  "/erp-scan-food": { t: "ERP-scan food: traceability in je ERP-systeem", d: "Hoe food-proof is je ERP-systeem? Gratis ERP-scan voor de voedingsindustrie over batchtracering, compliance, kwaliteit, data en schaalbaarheid." },
  "/erp-scan-finance": { t: "ERP-scan finance: futureproof ERP-systeem voor de CFO", d: "Hoe futureproof is je financiële ERP-systeem? Gratis ERP-scan voor finance & control over afsluiting, consolidatie, data en S/4HANA Finance." },
  "/erp-scan-logistiek": { t: "ERP-scan transport & logistiek: test je supply chain-ERP", d: "Hoe sterk is je ERP-systeem in transport en logistiek? Gratis ERP-scan over planning, WMS/TMS-integratie, data en de schaalbaarheid van je supply chain." },
  "/erp-scan-bouw": { t: "ERP-scan bouw & installatie: grip op onderhanden werk", d: "Grip op je projecten en onderhanden werk? Gratis ERP-scan voor bouw en installatietechniek over marge, projectadministratie en schaalbaarheid." },
  "/erp-scan-energie": { t: "ERP-scan energie & nutsbedrijven: asset management testen", d: "Is je ERP-systeem klaar voor de energietransitie? Gratis ERP-scan voor nutsbedrijven over asset management, meter-to-cash, data en schaalbaarheid." },
  "/erp-scan-dienstverlening": { t: "ERP-scan zakelijke dienstverlening & projectorganisaties", d: "Declarabel en schaalbaar? Gratis ERP-scan voor zakelijke dienstverlening en projectorganisaties over bezetting, marge en je ERP-systeem." },
  "/info": { t: "ERP kennisbank: wat is ERP & je ERP-systeem optimaliseren", d: "Wat is ERP en hoe optimaliseer je je ERP-systeem? Korte, scherpe artikelen over ERP, SAP ERP, S/4HANA, AI en ERP-implementatie." },
  "/info/wat-is-erp": {
    t: "Wat is ERP? Betekenis van een ERP-systeem uitgelegd",
    d: "Wat is ERP en wat is een ERP-systeem? Heldere uitleg van de ERP-betekenis, voorbeelden zoals SAP ERP, en wat een ERP-systeem doet.",
    faq: [
      { q: "Wat is ERP?", a: "ERP staat voor Enterprise Resource Planning. Het is software waarmee een organisatie kernprocessen zoals financiën, inkoop, voorraad, productie en HR in één centraal systeem beheert." },
      { q: "Wat is een ERP-systeem?", a: "Een ERP-systeem is het centrale softwaresysteem dat bedrijfsprocessen en data samenbrengt, zodat afdelingen op dezelfde, actuele informatie werken." },
      { q: "Wat betekent ERP?", a: "ERP is de afkorting van Enterprise Resource Planning: het plannen en beheren van de middelen en processen van een onderneming." },
      { q: "Wat is SAP ERP?", a: "SAP ERP is het ERP-systeem van marktleider SAP. De bekende versies zijn SAP ECC en het modernere SAP S/4HANA." },
    ],
  },
  "/info/erp-feiten": { t: "ERP in cijfers: 10 feiten over ERP-systemen", d: "Tien feiten en cijfers over ERP-systemen die je moet kennen: van migratiedeadlines tot benutte functionaliteit en de rol van SAP ERP." },
  "/info/optimaliseren": { t: "ERP-systeem optimaliseren: 7 hefbomen voor rendement", d: "Hoe optimaliseer je je ERP-systeem en haal je er meer uit? De 7 grootste hefbomen, van clean core en data tot AI, met de meeste impact eerst." },
  "/info/s4hana": { t: "SAP ECC naar S/4HANA migratie: de 2027-deadline uitgelegd", d: "Alles over de migratie van SAP ECC (SAP ERP) naar S/4HANA: de 2027-deadline, greenfield vs. brownfield en hoe je je overstap voorbereidt." },
  "/info/ai-erp": { t: "AI in je ERP-systeem: use-cases en voorbeelden", d: "Welke AI-use-cases en voorbeelden in je ERP-systeem leveren echt iets op? Van factuurherkenning tot predictive maintenance, en wat je nodig hebt." },
  "/info/ai-in-je-bedrijf": { t: "AI toepassen in je bedrijf: praktisch stappenplan", d: "Hoe pas je AI toe in je bedrijf? Praktisch stappenplan om AI te implementeren: van één use-case naar structurele waarde, bovenop een gezond ERP-systeem." },
  "/info/schalen-zonder-chaos": { t: "Schaalbaar groeien zonder chaos: zo schaal je je bedrijf", d: "Hoe schaal je je bedrijf zonder chaos? Standaardiseer en automatiseer je processen vóór het volume groeit. De hefbomen voor schaalbaar groeien." },
  "/info/processen-automatiseren": { t: "Bedrijfsprocessen automatiseren: waar begin je?", d: "Welke bedrijfsprocessen kun je het best automatiseren en hoe pak je het aan? Van workflows in je ERP-systeem tot AI en integratie." },
  "/info/cloud-of-onpremise": { t: "Cloud-ERP of on-premise: voordelen en nadelen vergeleken", d: "Cloud-ERP of on-premise ERP? De voordelen en nadelen in beheer, kosten, schaalbaarheid en innovatie vergeleken, zodat je onderbouwd kiest." },
  "/info/datakwaliteit": { t: "Datakwaliteit verbeteren: master data als fundament voor AI", d: "Hoe verbeter je datakwaliteit? Master data management is het fundament onder rapportage, AI en een betrouwbaar ERP-systeem. Zo pak je het aan." },
  "/info/clean-core": { t: "Wat is clean core? Clean core in SAP & S/4HANA uitgelegd", d: "Wat is clean core en waarom telt het voor je ERP? Uitleg van het clean core-principe in SAP en S/4HANA, en hoe je maatwerk afbouwt." },
  "/info/erp-implementatie": { t: "ERP-implementatie: succesfactoren en valkuilen", d: "Een succesvolle ERP-implementatie draait om proces, data en mensen — niet om techniek. De belangrijkste succesfactoren en valkuilen op een rij." },
  "/info/dashboards-kpi": { t: "Realtime dashboards & KPI's: sturen met process mining", d: "Stuur vooruit met realtime dashboards en de juiste KPI's. Wat maakt een KPI bruikbaar, en de rol van process mining in je ERP-systeem." },
  "/info/systeemintegratie": { t: "Systemen koppelen met API's: slimme systeemintegratie", d: "Hoe koppel je systemen slim? Goede systeemintegratie laat data automatisch doorstromen tussen je ERP-systeem, webshop en WMS — van point-to-point naar API's." },
  "/info/business-case-erp": { t: "Business case voor een nieuw ERP-systeem: kosten en baten", d: "Bouw een sterke business case voor een nieuw ERP-systeem: kosten, baten, ROI en de kosten van niets doen. Verder dan kostenbesparing." },
  "/info/privacy": { t: "Privacyverklaring | ERP-scan", d: "Privacyverklaring van de ERP-scan: welke gegevens we verwerken, waarom, met welke partijen en wat jouw rechten zijn." },
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
  // Slank: alleen geldig e-mail + consent verplicht (naam/organisatie optioneel).
  if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(lead.email))) e.push("e-mail ongeldig");
  if (lead.consent !== true) e.push("consent verplicht");
  return e;
}

// Feedback verwerken: stuur 'm per e-mail door (geen persoonsgegevens, faalt nooit hard).
async function handleFeedback(request, env) {
  let b;
  try { b = await request.json(); } catch { return json({ ok: true }, 200); }
  if (env.RESEND_API_KEY && env.LEAD_FORWARD_EMAIL) {
    const e = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const helpful = b.helpful === "up" ? "👍 Ja, nuttig" : b.helpful === "down" ? "👎 Niet echt" : "—";
    const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
      <h2 style="margin:0 0 8px">Scan-feedback</h2>
      <p style="font-size:18px;margin:0 0 12px"><b>${e(helpful)}</b></p>
      <p style="color:#666">Scan: ${e(b.scan_title || b.scan_id)} — score ${e(b.total_score)}/100 (${e(b.verdict_label || "")})</p>
      ${b.comment ? `<p><b>Opmerking:</b><br>${e(b.comment)}</p>` : ""}
      <p style="color:#999;font-size:12px">Bron: ${e(b.meta?.url || "")}</p>
    </div>`;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: env.LEAD_FROM_EMAIL || "ERP Scan <onboarding@resend.dev>",
          to: [env.LEAD_FORWARD_EMAIL],
          subject: `Scan-feedback ${helpful} — ${b.scan_title || b.scan_id}`,
          html,
        }),
      });
      if (!res.ok) console.error("Feedback-mail faalde:", res.status, await res.text());
    } catch (err) { console.error("Feedback-mail error:", err && err.stack ? err.stack : err); }
  }
  return json({ ok: true }, 200);
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
