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
import { buildDiagnoseRequest } from "./diagnose.js";

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
      if (!(await allowRequest(request, "lead", 10, 3600))) return tooMany(3600);
      return handleLead(request, env);
    }

    // ── Feedback-API ("Was deze scan behulpzaam?") — geen persoonsgegevens ──
    if (url.pathname === "/api/feedback") {
      if (request.method === "OPTIONS") return new Response(null, { status: 204 });
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
      return handleFeedback(request, env);
    }

    // ── Diagnose-API (LLM fit-to-standard) ─────────────────────────────────
    if (url.pathname === "/api/diagnose") {
      if (request.method === "OPTIONS") return new Response(null, { status: 204 });
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
      // Betaalde LLM-call achter een publiek endpoint: eerst door de limiter.
      if (!(await allowRequest(request, "diagnose", 5, 3600))) return tooMany(3600);
      return handleDiagnose(request, env);
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
  let out = injectSEO(html, m, SITE_ORIGIN + url.pathname, url.pathname);

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

// Structured data veilig in een <script>-blok zetten: "<" escapen zodat een
// "</script>" in de tekst het blok niet voortijdig kan afsluiten.
function ldScript(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
}

function injectSEO(html, m, canonical, pathname) {
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
    head += ldScript({
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: m.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }

  // Breadcrumbs: geeft Google het kruimelpad in plaats van een kale URL onder
  // de titel, wat de weergave in de resultaten herkenbaarder maakt.
  if (pathname && pathname !== "/") {
    const crumbs = [{ name: "Home", url: SITE_ORIGIN + "/" }];
    if (pathname.startsWith("/info/")) crumbs.push({ name: "Kennisbank", url: SITE_ORIGIN + "/info" });
    crumbs.push({ name: m.t, url: canonical });
    head += ldScript({
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
    });
  }

  // Article-schema op de kennisbankartikelen (niet op de kennisbank-index of
  // de privacyverklaring): maakt expliciet dat dit redactionele inhoud is.
  if (pathname && pathname.startsWith("/info/") && pathname !== "/info/privacy") {
    head += ldScript({
      "@context": "https://schema.org", "@type": "Article",
      headline: m.t, description: m.d, url: canonical, inLanguage: "nl-NL",
      isAccessibleForFree: true,
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      publisher: { "@type": "Organization", name: "ERP-scan", url: SITE_ORIGIN + "/" },
    });
  }

  return html.replace("</head>", head + "</head>");
}

// Vaste canonieke origin (zo wijzen canonical/og:url altijd naar het hoofddomein).
const SITE_ORIGIN = "https://erp-scan.net";

// Redirects (301). De site heeft nog maar drie scans: maakindustrie, retail en
// groothandel. Oude keyword-slugs blijven werken; alle ingetrokken scans (de
// algemene scan + de niet langer aangeboden sectoren) wijzen naar de homepage,
// zodat eerder geïndexeerde URL's hun linkwaarde behouden i.p.v. te breken.
const REDIRECTS = {
  // Oude korte slugs -> behouden scans
  "/maakindustrie": "/erp-scan-maakindustrie",
  "/retail": "/erp-scan-retail",
  "/groothandel": "/erp-scan-groothandel",
  // Ingetrokken scans (oude korte slugs) -> homepage
  "/algemeen": "/",
  "/food": "/",
  "/finance": "/",
  "/logistiek": "/",
  "/bouw": "/",
  "/utilities": "/",
  "/dienstverlening": "/",
  // Ingetrokken scans (keyword-slugs die al live/geïndexeerd waren) -> homepage
  "/erp-systeem-scan": "/",
  "/erp-scan-food": "/",
  "/erp-scan-finance": "/",
  "/erp-scan-logistiek": "/",
  "/erp-scan-bouw": "/",
  "/erp-scan-energie": "/",
  "/erp-scan-dienstverlening": "/",
};

const SEO = {
  "/": { t: "Gratis ERP-scan: hoe futureproof is jouw ERP-systeem?", d: "Doe de gratis ERP-scan voor de groothandel, retail of maakindustrie. Zie in 3 minuten waar je ERP-systeem je remt, welke processen je kunt automatiseren en waar je marge laat liggen — met een concreet actieplan op volgorde van impact." },
  "/erp-scan-maakindustrie": { t: "ERP-scan maakindustrie: SAP ECC naar S/4HANA testen", d: "Hoe klaar is je ERP-systeem voor de maakindustrie en S/4HANA? Gratis ERP-scan voor productiebedrijven op SAP ECC, met advies richting de 2027-deadline." },
  "/erp-scan-retail": { t: "ERP-scan retail: futureproof ERP-systeem voor e-commerce", d: "Hoe futureproof is je ERP-systeem voor omnichannel retail en e-commerce? Doe de gratis ERP-scan en zie waar voorraad, data of marges je remmen." },
  "/erp-scan-groothandel": { t: "ERP-software voor de groothandel: gratis scan in 3 minuten", d: "Hoe futureproof is je ERP voor groothandel en distributie? 11 vragen, direct je score per as en een actieplan op volgorde van impact. Zie waar marge, voorraad of EDI-koppelingen je remmen — gratis, zonder inloggen." },
  "/info": { t: "ERP kennisbank: wat is ERP & je ERP-systeem optimaliseren", d: "Wat is ERP en hoe optimaliseer je je ERP-systeem? Korte, scherpe artikelen over ERP, SAP ERP, S/4HANA, AI en ERP-implementatie." },
  "/info/welke-erp-past-bij-productie": {
    t: "Welke ERP past bij productie? ERP-systemen voor de maakindustrie vergeleken",
    d: "Welke ERP past bij productie? Keuzecriteria, een besliskader in 5 stappen en een eerlijke vergelijking van ERP-systemen voor productiebedrijven en de maakindustrie.",
    faq: [
      { q: "Welke ERP past bij productie?", a: "Dat hangt af van je productietype (discreet of proces), je ordervorm (make-to-stock tot engineer-to-order), je omvang en je groeiambitie. Begin bij je eigen processen en must-haves — zoals MRP-planning, stuklijsten, MES-koppeling en traceerbaarheid — en kies het systeem dat daar het beste standaard bij past." },
      { q: "Wat is de beste ERP voor de maakindustrie?", a: "Er is geen universeel beste ERP. Voor middelgrote en grote, internationale productiebedrijven is SAP S/4HANA marktleider; Microsoft Dynamics 365 en Oracle NetSuite passen vaak goed bij het mkb en scale-ups; Infor CloudSuite Industrial is sterk in specifieke discrete productie; Exact, AFAS en Ridder zijn populair in het Nederlandse mkb." },
      { q: "Waar moet je op letten bij het kiezen van een ERP voor productie?", a: "Op sterke MRP- en capaciteitsplanning, meerlaagse stuklijsten en routings, een betrouwbare koppeling met de werkvloer (MES), batch- en serienummer-traceerbaarheid, realtime kostprijs per order, schaalbaarheid en zo min mogelijk maatwerk. En minstens zo belangrijk: een implementatiepartner met ervaring in jouw sector." },
      { q: "Welk ERP-systeem gebruiken de meeste productiebedrijven?", a: "In de grotere maakindustrie is SAP het meest gebruikt, met de overgang van SAP ECC naar SAP S/4HANA als grote thema richting het einde van het mainstream-onderhoud in 2027. In het mkb zie je vaker Microsoft Dynamics 365, Exact, AFAS en Infor." },
    ],
  },
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
  "/info/s4hana": {
    t: "SAP ECC naar S/4HANA: routes, kosten en de 2027-deadline",
    d: "Complete gids voor de migratie van SAP ECC naar S/4HANA: de 2027-deadline, greenfield vs. brownfield vs. bluefield, RISE en GROW, een realistisch kostenbeeld en een roadmap richting go-live.",
    faq: [
      { q: "Wat gebeurt er als ik na 2030 nog op SAP ECC draai?", a: "Reguliere support en beveiligingsupdates vervallen. Er blijven risico's op het gebied van compliance en kwetsbaarheden die zich opstapelen. Voor regelgevingsgevoelige sectoren is dat op termijn niet houdbaar." },
      { q: "Is brownfield altijd goedkoper dan greenfield?", a: "Niet automatisch. Brownfield is initieel goedkoper, maar als verouderde processen en maatwerk niet vooraf worden opgelost, lopen de kosten tijdens de uitvoering alsnog op. Bij veel achterstallige processen kan greenfield uiteindelijk voordeliger zijn." },
      { q: "Draait S/4HANA op een andere database dan HANA?", a: "Nee. S/4HANA draait uitsluitend op SAP HANA. Dat is een wezenlijk verschil met ECC, dat ook op andere databases kon draaien, en het heeft gevolgen voor je licentie- en infrastructuurkeuzes." },
      { q: "Wat is het verschil tussen RISE with SAP en GROW with SAP?", a: "RISE richt zich vooral op bestaande klanten die naar een private cloud willen met behoud van vrijheid in maatwerk. GROW is bedoeld voor nieuwe klanten in de public cloud, met grotendeels standaard processen en een vaste updatecyclus." },
      { q: "Hoe lang duurt een S/4HANA-migratie?", a: "Voor een middelgrote organisatie is 18 tot 36 maanden een realistische indicatie, afhankelijk van scope, hoeveelheid maatwerk en gekozen route. Grote, internationale landschappen lopen langer door." },
    ],
  },
  "/info/ai-erp": { t: "AI in je ERP-systeem: use-cases en voorbeelden", d: "Welke AI-use-cases en voorbeelden in je ERP-systeem leveren echt iets op? Van factuurherkenning tot predictive maintenance, en wat je nodig hebt." },
  "/info/ai-in-je-bedrijf": { t: "AI toepassen in je bedrijf: praktisch stappenplan", d: "Hoe pas je AI toe in je bedrijf? Praktisch stappenplan om AI te implementeren: van één use-case naar structurele waarde, bovenop een gezond ERP-systeem." },
  "/info/schalen-zonder-chaos": { t: "Bedrijfsprocessen schalen zonder chaos (en zonder automatiseringsplatform)", d: "Lastig om bedrijfsprocessen te schalen zonder automatiseringsplatform? Standaardiseer en automatiseer je processen vóór het volume groeit. De hefbomen voor schaalbaar groeien zonder chaos." },
  "/info/processen-automatiseren": {
    t: "Bedrijfsprocessen automatiseren: stappenplan in 7 stappen",
    d: "Welke bedrijfsprocessen kun je het best automatiseren en hoe begin je? Selectiecriteria, de 3 niveaus van automatisering, een stappenplan in 7 stappen en de 5 fouten die het vaakst worden gemaakt.",
    faq: [
      { q: "Hoe automatiseer ik bedrijfsprocessen?", a: "In grote lijnen in zeven stappen: breng in kaart waar tijd weglekt, meet het huidige proces, standaardiseer het, kies het laagste passende niveau van automatisering, bouw één proces volledig af tot in productie, regel de uitzonderingen expliciet, en meet opnieuw voordat je opschaalt." },
      { q: "Welke processen kun je het beste als eerste automatiseren?", a: "Processen die repetitief zijn, duidelijke regels volgen, veel voorkomen en nu foutgevoelig zijn. In de praktijk komen inkoopfacturen verwerken, orderinvoer, voorraad bijbestellen en goedkeuringsstromen er het vaakst als eerste uit." },
      { q: "Heb ik daar speciale software voor nodig?", a: "Vaak niet meteen. Veel organisaties hebben workflows, goedkeuringen en signaleringen in hun ERP-systeem zitten die nooit zijn ingericht. Kijk eerst wat je bestaande systeem al kan voordat je extra tooling aanschaft." },
      { q: "Wat is het verschil tussen automatiseren en digitaliseren?", a: "Digitaliseren is een papieren stap vervangen door een digitale, bijvoorbeeld een formulier dat een PDF wordt. Automatiseren betekent dat de stap zelf — en de overdracht naar de volgende stap — zonder handwerk verloopt." },
      { q: "Waar gaat het meestal mis?", a: "Bij de uitzonderingen en bij het eigenaarschap. Automatisering die alleen het standaardgeval aankan, verplaatst werk naar een handmatige bak die niemand bijhoudt. En zonder duidelijke eigenaar verzandt de automatisering zodra het onderliggende proces verandert." },
    ],
  },
  "/info/cloud-of-onpremise": { t: "Cloud-ERP of on-premise: voordelen en nadelen vergeleken", d: "Cloud-ERP of on-premise ERP? De voordelen en nadelen in beheer, kosten, schaalbaarheid en innovatie vergeleken, zodat je onderbouwd kiest." },
  "/info/datakwaliteit": { t: "Datakwaliteit verbeteren: master data als fundament voor AI", d: "Hoe verbeter je datakwaliteit? Master data management is het fundament onder rapportage, AI en een betrouwbaar ERP-systeem. Zo pak je het aan." },
  "/info/clean-core": { t: "Wat is clean core? Clean core in SAP & S/4HANA uitgelegd", d: "Wat is clean core en waarom telt het voor je ERP? Uitleg van het clean core-principe in SAP en S/4HANA, en hoe je maatwerk afbouwt." },
  "/info/erp-implementatie": { t: "ERP-implementatie: succesfactoren en valkuilen", d: "Een succesvolle ERP-implementatie draait om proces, data en mensen — niet om techniek. De belangrijkste succesfactoren en valkuilen op een rij." },
  "/info/dashboards-kpi": { t: "Realtime dashboards & KPI's: sturen met process mining", d: "Stuur vooruit met realtime dashboards en de juiste KPI's. Wat maakt een KPI bruikbaar, en de rol van process mining in je ERP-systeem." },
  "/info/systeemintegratie": {
    t: "ERP koppelen: 4 manieren vergeleken + stappenplan",
    d: "Je ERP koppelen aan je webshop, WMS of EDI? Vergelijk de 4 koppelmanieren, kies het juiste patroon en volg het stappenplan in 7 stappen — inclusief kosten en de 5 fouten die het vaakst worden gemaakt.",
    faq: [
      { q: "Wat betekent het om systemen te koppelen?", a: "Systemen koppelen betekent dat twee of meer applicaties automatisch gegevens uitwisselen, zodat een gegeven maar één keer hoeft te worden vastgelegd. Denk aan een webshoporder die vanzelf als verkooporder in je ERP verschijnt, inclusief klantgegevens en voorraadmutatie." },
      { q: "Kan ik mijn ERP koppelen aan mijn webshop?", a: "Vrijwel altijd. Veel ERP- en webshopplatformen bieden standaardconnectoren voor de meestvoorkomende combinaties. Zijn je processen afwijkend, dan is een koppeling via API's of een integratielaag doorgaans de betere route." },
      { q: "Wat is het verschil tussen een API en EDI?", a: "Een API is een technische interface waarmee systemen elkaar direct bevragen of berichten sturen, meestal realtime. EDI is een gestandaardiseerd berichtformaat dat vooral in ketensamenwerking wordt gebruikt voor orders, pakbonnen en facturen, vaak in batches." },
      { q: "Hoe lang duurt het om een koppeling te bouwen?", a: "Dat loopt sterk uiteen. Een standaardconnector configureren is indicatief een kwestie van dagen; een maatwerkkoppeling met testen en acceptatie eerder weken. Bepalend is zelden het programmeerwerk, maar de afspraak welk systeem eigenaar is van welk gegeven." },
      { q: "Wanneer heb ik een integratieplatform nodig?", a: "Zodra je meerdere koppelingen hebt die bedrijfskritisch zijn, of wanneer elke nieuwe klant of kanaal opnieuw maatwerk vraagt. Een veelgebruikte vuistregel: vanaf ongeveer vijf koppelingen wegen hergebruik, centrale monitoring en uniforme foutafhandeling op tegen de investering." },
    ],
  },
  "/info/business-case-erp": { t: "Business case voor een nieuw ERP-systeem: kosten en baten", d: "Bouw een sterke business case voor een nieuw ERP-systeem: kosten, baten, ROI en de kosten van niets doen. Verder dan kostenbesparing." },
  "/info/privacy": { t: "Privacyverklaring | ERP-scan", d: "Privacyverklaring van de ERP-scan: welke gegevens we verwerken, waarom, met welke partijen en wat jouw rechten zijn." },
};

// ── Rate limiting ─────────────────────────────────────────────────────────
// Eenvoudige IP-limiter op de Cache API, zodat er géén KV- of Durable-Object-
// binding (en dus geen extra kosten of dashboard-config) nodig is. De teller
// wordt per Cloudflare-locatie bijgehouden en is eventual consistent: dit is
// een drempel tegen misbruik en weglopende LLM-kosten, geen harde quota.
//
// Faalt de cache om welke reden dan ook, dan laten we het verzoek DOOR — een
// kapotte limiter mag nooit de lead- of diagnosepijplijn platleggen.
async function allowRequest(request, bucket, limit, windowSec) {
  try {
    const ip = request.headers.get("cf-connecting-ip") || "onbekend";
    const window = Math.floor(Date.now() / 1000 / windowSec);
    const key = new Request(`https://ratelimit.invalid/${bucket}/${window}/${encodeURIComponent(ip)}`);
    const cache = caches.default;

    const hit = await cache.match(key);
    const count = hit ? Number(await hit.text()) || 0 : 0;
    if (count >= limit) return false;

    await cache.put(key, new Response(String(count + 1), {
      headers: { "cache-control": `max-age=${windowSec}` },
    }));
    return true;
  } catch (err) {
    console.error("Rate limiter faalde (verzoek doorgelaten):", err && err.stack ? err.stack : err);
    return true;
  }
}

function tooMany(retryAfter) {
  return new Response(JSON.stringify({ error: "Te veel verzoeken. Probeer het later opnieuw." }), {
    status: 429,
    headers: { "content-type": "application/json; charset=utf-8", "retry-after": String(retryAfter) },
  });
}

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

// ── Diagnose-afhandeling (LLM fit-to-standard) ───────────────────────────────
// Roept de Anthropic Messages-API aan met de persona uit src/diagnose.js.
// De API-key staat uitsluitend als SECRET (ANTHROPIC_API_KEY) in Cloudflare.
// Faalt de call of ontbreekt de key, dan degradeert de frontend naar het
// bestaande sjabloon-advies (deze diagnose is additief, geen kritiek pad).
async function handleDiagnose(request, env) {
  if (!env.ANTHROPIC_API_KEY) return json({ error: "Diagnose niet geconfigureerd" }, 503);

  let body;
  try { body = await request.json(); }
  catch { return json({ error: "Ongeldige JSON" }, 400); }

  // Lichte payload-validatie (tevens misbruik-drempel): scan_id + minimaal
  // enkele antwoorden. Zonder echte scan-uitkomst geen (betaalde) LLM-call.
  if (!body || !body.scan_id) return json({ error: "scan_id ontbreekt" }, 400);
  if (!Array.isArray(body.answers) || body.answers.length < 3) {
    return json({ error: "Onvoldoende antwoorden" }, 422);
  }

  const built = buildDiagnoseRequest(body);
  if (!built) return json({ error: "Onbekende sector" }, 422);

  const model = env.DIAGNOSE_MODEL || "claude-sonnet-5";
  let res;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1200,
        system: built.system,
        messages: built.messages,
      }),
    });
  } catch (err) {
    console.error("Diagnose fetch error:", err && err.stack ? err.stack : err);
    return json({ error: "Diagnose-service onbereikbaar" }, 502);
  }

  if (!res.ok) {
    console.error("Anthropic API", res.status, await res.text());
    return json({ error: "Diagnose mislukte" }, 502);
  }

  const data = await res.json();
  const text = Array.isArray(data.content)
    ? data.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim()
    : "";
  if (!text) return json({ error: "Lege diagnose" }, 502);

  return json({ diagnosis: text }, 200);
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
    ${lead.question ? `<h3 style="margin:20px 0 6px">Vraag / situatie</h3><p style="margin:0;padding:12px 14px;background:#f5f7fb;border-left:3px solid #1d4ed8;border-radius:0 8px 8px 0;white-space:pre-wrap;color:#1a1a1a">${e(lead.question)}</p>` : ""}
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
    dimStr, answers, b.meta?.url || "", b.meta?.referrer || "", lead.question || "",
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
