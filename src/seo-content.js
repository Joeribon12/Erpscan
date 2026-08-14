// ══════════════════════════════════════════════════════════════════════════
// SERVER-SIDE SEO-CONTENT — rendert per route échte, unieke tekst die de
// Worker in de HTML meestuurt (binnen <main id="app">). Zo ziet Google elke
// scan- en artikelpagina als "vol" en uniek, ook zonder JavaScript.
//
// Geen cloaking: dit is exact dezelfde inhoud als de engine client-side toont
// (zelfde configbestanden als bron). De engine doet `app.replaceChildren(...)`
// bij het laden, dus voor echte bezoekers wordt dit meteen vervangen door de
// interactieve app — het is puur het vangnet voor crawlers en first paint.
//
// Bron = dezelfde configs als de app (één waarheid). Nieuwe scan/artikel:
//   1. config in /public/scans of /public/pages (zoals altijd)
//   2. import hieronder toevoegen + in SCAN_CFG/ART_CFG zetten
// ══════════════════════════════════════════════════════════════════════════

import { SCANS } from "../public/scans/registry.js";
import { PAGES } from "../public/pages/registry.js";

// ── Scan-configs ────────────────────────────────────────────────────────────
import scanMaakindustrie from "../public/scans/erp-scan-maakindustrie.js";
import scanRetail        from "../public/scans/erp-scan-retail.js";
import scanGroothandel   from "../public/scans/erp-scan-groothandel.js";

// ── Artikel-configs ─────────────────────────────────────────────────────────
import artWelkeErp     from "../public/pages/welke-erp-past-bij-productie.js";
import artWatIsErp     from "../public/pages/wat-is-erp.js";
import artErpFeiten    from "../public/pages/erp-feiten.js";
import artOptimaliseren from "../public/pages/optimaliseren.js";
import artS4hana       from "../public/pages/s4hana.js";
import artAiErp        from "../public/pages/ai-erp.js";
import artAiBedrijf    from "../public/pages/ai-in-je-bedrijf.js";
import artSchalen      from "../public/pages/schalen-zonder-chaos.js";
import artProcessen    from "../public/pages/processen-automatiseren.js";
import artCloud        from "../public/pages/cloud-of-onpremise.js";
import artData         from "../public/pages/datakwaliteit.js";
import artCleanCore    from "../public/pages/clean-core.js";
import artImplementatie from "../public/pages/erp-implementatie.js";
import artDashboards   from "../public/pages/dashboards-kpi.js";
import artIntegratie   from "../public/pages/systeemintegratie.js";
import artBusinessCase from "../public/pages/business-case-erp.js";
import artPrivacy      from "../public/pages/privacy.js";

const SCAN_CFG = {
  "/erp-scan-maakindustrie": scanMaakindustrie,
  "/erp-scan-retail": scanRetail,
  "/erp-scan-groothandel": scanGroothandel,
};

const ART_CFG = {
  "/info/welke-erp-past-bij-productie": artWelkeErp,
  "/info/wat-is-erp": artWatIsErp,
  "/info/erp-feiten": artErpFeiten,
  "/info/optimaliseren": artOptimaliseren,
  "/info/s4hana": artS4hana,
  "/info/ai-erp": artAiErp,
  "/info/ai-in-je-bedrijf": artAiBedrijf,
  "/info/schalen-zonder-chaos": artSchalen,
  "/info/processen-automatiseren": artProcessen,
  "/info/cloud-of-onpremise": artCloud,
  "/info/datakwaliteit": artData,
  "/info/clean-core": artCleanCore,
  "/info/erp-implementatie": artImplementatie,
  "/info/dashboards-kpi": artDashboards,
  "/info/systeemintegratie": artIntegratie,
  "/info/business-case-erp": artBusinessCase,
  "/info/privacy": artPrivacy,
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ── Eén artikel-inhoudsblok als statische HTML (tekstversie van renderSection) ─
function sectionHtml(s) {
  if (!s || !s.type) return "";
  const h = s.heading ? `<h2>${esc(s.heading)}</h2>` : "";
  if (s.type === "prose") {
    const body = Array.isArray(s.body) ? s.body : [s.body];
    return `${h}${body.map((p) => `<p>${esc(p)}</p>`).join("")}`;
  }
  if (s.type === "facts") {
    const items = (s.items || []).map((it) =>
      `<li><strong>${esc(it.title)}</strong> — ${esc(it.body)}</li>`).join("");
    return `${h}<ul>${items}</ul>`;
  }
  if (s.type === "stats") {
    const items = (s.items || []).map((it) =>
      `<li><strong>${esc(it.value)}</strong> ${esc(it.label)}${it.note ? ` (${esc(it.note)})` : ""}</li>`).join("");
    return `${h}<ul>${items}</ul>`;
  }
  if (s.type === "steps") {
    const items = (s.items || []).map((it) =>
      `<li><strong>${esc(it.title)}</strong> — ${esc(it.body)}</li>`).join("");
    return `${h}<ol>${items}</ol>`;
  }
  if (s.type === "checklist") {
    const items = (s.items || []).map((it) =>
      `<li>${esc(typeof it === "string" ? it : (it.body || it.title))}</li>`).join("");
    return `${h}<ul>${items}</ul>`;
  }
  if (s.type === "callout") {
    return `${s.title ? `<h3>${esc(s.title)}</h3>` : ""}<p>${esc(s.body)}</p>`;
  }
  if (s.type === "quote") {
    return `<blockquote>${esc(s.body)}${s.cite ? ` — ${esc(s.cite)}` : ""}</blockquote>`;
  }
  if (s.type === "table") {
    const head = (s.headers || []).map((c) => `<th>${esc(c)}</th>`).join("");
    const rows = (s.rows || []).map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("");
    return `${h}<table>${head ? `<thead><tr>${head}</tr></thead>` : ""}<tbody>${rows}</tbody></table>`;
  }
  if (s.type === "related") {
    const items = (s.items || []).map((it) =>
      `<li><a href="${esc(it.href)}">${esc(it.label)}</a></li>`).join("");
    return `${h}<ul>${items}</ul>`;
  }
  if (s.type === "faq") {
    const items = (s.items || []).map((it) =>
      `<h3>${esc(it.q)}</h3><p>${esc(it.a)}</p>`).join("");
    return `${h}${items}`;
  }
  return "";
}

// ── Per route ────────────────────────────────────────────────────────────────
function renderScan(cfg) {
  const dims = (cfg.dimensions || []).map((d) => `<li>${esc(d.label)}</li>`).join("");
  const bullets = Array.isArray(cfg.intro?.bullets) && cfg.intro.bullets.length
    ? `<ul>${cfg.intro.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : "";
  // Interne links naar een paar andere scans + de kennisbank (helpt crawlen).
  const others = SCANS.filter((s) => "/" + s.id !== "/" + cfg.scan_id)
    .map((s) => `<li><a href="${esc(s.path)}">${esc(s.title)}</a></li>`).join("");

  // Per as een korte sectorobservatie. Deze teksten staan al in de config
  // (dimension.insight) en worden in de app tussen de vragen getoond; hier
  // beschrijven ze waar de scan naar kijkt. Eén waarheid, geen aparte SEO-tekst.
  const perAxis = (cfg.dimensions || [])
    .filter((d) => d.insight && (d.insight.mid || d.insight.low))
    .map((d) => `<h3>${esc(d.label)}</h3><p>${esc(d.insight.mid || d.insight.low)}</p>`)
    .join("");
  const axisBlock = perAxis
    ? `<h2>Waar het in deze sector meestal op vastloopt</h2>${perAxis}` : "";

  // De vragenlijst zelf: dit ís de inhoud van de pagina, dus hoort een
  // bezoeker zonder JavaScript (en een zoekmachine) 'm ook te kunnen lezen.
  const qs = (cfg.questions || []).map((q) => `<li>${esc(q.text)}</li>`).join("");
  const qBlock = qs
    ? `<h2>De vragen in deze scan</h2>
       <p>De scan bestaat uit ${(cfg.questions || []).length} vragen, verdeeld over ${(cfg.dimensions || []).length} assen. Je beantwoordt ze in zo'n drie minuten, zonder inloggen:</p>
       <ol>${qs}</ol>` : "";

  return `<section class="intro card">
    <span class="eyebrow">${esc(cfg.eyebrow || "ERP Growth Hack Scan")}</span>
    <h1>${esc(cfg.title)}</h1>
    <p class="lede">${esc(cfg.intro?.sub || "")}</p>
    <h2>Wat meet deze ERP-scan?</h2>
    <ul>${dims}</ul>
    ${bullets}
    <p>${esc(cfg.audience || "")}</p>
    ${axisBlock}
    ${qBlock}
    <h2>Wat je krijgt</h2>
    <p>Direct na de laatste vraag zie je je totaalscore, een score per as en een actieplan waarin de assen op volgorde van impact staan — je begint dus bij je grootste kans. Je hoeft geen gegevens achter te laten om je uitslag te zien.</p>
    <h2>Andere ERP-scans</h2>
    <ul>${others}</ul>
    <p>Verder lezen? Bekijk hoe je <a href="/info/systeemintegratie">je ERP koppelt aan andere systemen</a>, hoe je <a href="/info/processen-automatiseren">bedrijfsprocessen automatiseert</a>, of de gids <a href="/info/welke-erp-past-bij-productie">welke ERP past bij productie</a>. Alles staat in de <a href="/info">kennisbank over ERP</a>.</p>
  </section>`;
}

function renderArticle(cfg) {
  const sections = (cfg.sections || []).map(sectionHtml).join("");
  const tocItems = (cfg.sections || []).filter((s) => s.heading);
  const toc = (cfg.toc && tocItems.length)
    ? `<nav class="toc"><p>In dit artikel</p><ul>${tocItems.map((s) => `<li>${esc(s.heading)}</li>`).join("")}</ul></nav>`
    : "";
  const meta = (cfg.date || cfg.readingTime)
    ? `<p class="article-meta">${[cfg.date, cfg.readingTime].filter(Boolean).map(esc).join(" · ")}</p>` : "";
  const ending = cfg.leadForm
    ? `<section class="article-lead"><h2>${esc(cfg.leadForm.heading || "Vraag een specialist")}</h2>${cfg.leadForm.sub ? `<p>${esc(cfg.leadForm.sub)}</p>` : ""}</section>`
    : (cfg.cta
      ? `<p><a href="${esc(cfg.cta.href || "/")}">${esc(cfg.cta.label || "Doe de ERP-scan")}</a> — ${esc(cfg.cta.body || "")}</p>` : "");
  return `<article class="article">
    <span class="eyebrow">${esc(cfg.eyebrow || "Kennis")}</span>
    <h1>${esc(cfg.title)}</h1>
    ${meta}
    ${cfg.intro ? `<p class="lede">${esc(cfg.intro)}</p>` : ""}
    ${toc}
    ${sections}
    ${ending}
    <p><a href="/info">← Terug naar de kennisbank</a> · <a href="/">Doe de gratis ERP-scan</a></p>
  </article>`;
}

function renderLanding() {
  // Zelfde demand-led volgorde als de client-render: groothandel en retail eerst.
  const order = ["erp-scan-groothandel", "erp-scan-retail", "erp-scan-maakindustrie"];
  const scanLinks = [...SCANS]
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
    .map((s) => `<li><a href="${esc(s.path)}">${esc(s.title)}</a> — ${esc(s.audience)}</li>`).join("");
  return `<div class="landing">
    <section class="hero">
      <span class="eyebrow">Gratis ERP-scan</span>
      <h1>Hoe futureproof is jouw ERP-systeem?</h1>
      <p class="lede">Groothandel, retail of maakindustrie: je ERP-systeem bepaalt hoeveel marge, tijd en groei je laat liggen. Doe de gratis ERP-scan en zie binnen 3 minuten waar je systeem je remt, welke processen je kunt automatiseren en waar de snelste winst zit.</p>
    </section>
    <section>
      <h2>Doe de scan voor jouw sector</h2>
      <p>Elke scan is toegespitst op de processen, marges en systemen van jouw sector. Kies je sector en start direct:</p>
      <ul>${scanLinks}</ul>
    </section>
    <section>
      <h2>Zo werkt de ERP-scan</h2>
      <ol>
        <li><strong>Beantwoord 11 vragen</strong> over je strategie, techniek, data en processen — in zo'n 3 minuten.</li>
        <li><strong>Krijg direct je diagnose</strong> met een score per as en een totaalbeeld van je ERP-gereedheid.</li>
        <li><strong>Werk je actieplan af</strong> met concrete vervolgstappen op volgorde van impact.</li>
      </ol>
    </section>
    <section>
      <h2>Waar loopt jouw groei vast?</h2>
      <p>Herken je een van deze knelpunten? Lees hoe je ze aanpakt, met je ERP-systeem als motor:</p>
      <ul>
        <li><a href="/info/processen-automatiseren">Bedrijfsprocessen automatiseren: waar begin je?</a></li>
        <li><a href="/info/systeemintegratie">ERP koppelen: systemen slim integreren met API's</a></li>
        <li><a href="/info/dashboards-kpi">ERP met KPI-dashboards: realtime sturen</a></li>
        <li><a href="/info/schalen-zonder-chaos">Bedrijfsprocessen schalen zonder chaos</a></li>
        <li><a href="/info/welke-erp-past-bij-productie">Welke ERP past bij productie?</a></li>
        <li><a href="/info/s4hana">Van SAP ECC naar S/4HANA</a></li>
        <li><a href="/info/wat-is-erp">Wat is een ERP-systeem?</a></li>
      </ul>
    </section>
    <p>Liever eerst inlezen? Bekijk de <a href="/info">kennisbank met feiten &amp; inzichten over ERP</a>.</p>
  </div>`;
}

function renderInfoIndex() {
  const tiles = PAGES.map((p) =>
    `<li><a href="${esc(p.path)}">${esc(p.title)}</a> — ${esc(p.teaser || "")}</li>`).join("");
  return `<section>
    <span class="eyebrow">Kennisbank</span>
    <h1>Feiten &amp; inzichten over ERP</h1>
    <p class="lede">Korte, scherpe artikelen over ERP-optimalisatie, S/4HANA en AI — met de feiten op een rij.</p>
    <ul>${tiles}</ul>
    <p><a href="/">← Naar de ERP-scans</a></p>
  </section>`;
}

// Geeft de server-side HTML voor een route, of "" als de route geen eigen
// pre-render heeft (dan blijft de bestaande <noscript> het vangnet).
export function renderRouteContent(pathname) {
  if (pathname === "/") return renderLanding();
  if (pathname === "/info") return renderInfoIndex();
  if (ART_CFG[pathname]) return renderArticle(ART_CFG[pathname]);
  if (SCAN_CFG[pathname]) return renderScan(SCAN_CFG[pathname]);
  return "";
}
