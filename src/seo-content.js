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
  return `<section class="intro card">
    <span class="eyebrow">${esc(cfg.eyebrow || "ERP Growth Hack Scan")}</span>
    <h1>${esc(cfg.title)}</h1>
    <p class="lede">${esc(cfg.intro?.sub || "")}</p>
    <h2>Wat meet deze ERP-scan?</h2>
    <ul>${dims}</ul>
    ${bullets}
    <p>${esc(cfg.audience || "")}</p>
    <h2>Andere ERP-scans</h2>
    <ul>${others}</ul>
    <p>Liever eerst inlezen? Bekijk de <a href="/info">kennisbank over ERP</a>.</p>
  </section>`;
}

function renderArticle(cfg) {
  const sections = (cfg.sections || []).map(sectionHtml).join("");
  const cta = cfg.cta
    ? `<p><a href="${esc(cfg.cta.href || "/")}">${esc(cfg.cta.label || "Doe de ERP-scan")}</a> — ${esc(cfg.cta.body || "")}</p>`
    : "";
  return `<article class="article">
    <span class="eyebrow">${esc(cfg.eyebrow || "Kennis")}</span>
    <h1>${esc(cfg.title)}</h1>
    ${cfg.intro ? `<p class="lede">${esc(cfg.intro)}</p>` : ""}
    ${sections}
    ${cta}
    <p><a href="/info">← Terug naar de kennisbank</a> · <a href="/">Doe de gratis ERP-scan</a></p>
  </article>`;
}

function renderLanding() {
  const scanLinks = SCANS.filter((s) => s.id !== "erp-scan-maakindustrie").map((s) =>
    `<li><a href="${esc(s.path)}">${esc(s.title)}</a> — ${esc(s.audience)}</li>`).join("");
  return `<div class="landing">
    <section class="hero">
      <span class="eyebrow">Gratis ERP-scan · Maakindustrie</span>
      <h1>SAP ECC loopt af in 2027. Hoe klaar is jouw productiebedrijf voor S/4HANA?</h1>
      <p class="lede">Veel productiebedrijven draaien nog op SAP ECC, met jaren aan opgebouwd maatwerk. Doe de gratis ERP-scan voor de maakindustrie en weet binnen 3 minuten waar je grootste migratierisico's liggen — én waar je winst zit richting 2027.</p>
      <p><a href="/erp-scan-maakindustrie">Start de gratis ERP-scan voor de maakindustrie →</a></p>
    </section>
    <section>
      <h2>Van SAP ECC naar S/4HANA</h2>
      <p>SAP's mainstream maintenance op ECC eindigt in 2027. Voor productiebedrijven betekent dat keuzes over maatwerk, stamdata en productieprocessen. Lees meer over de <a href="/info/s4hana">migratie van SAP ECC naar S/4HANA</a> en de <a href="/info/wat-is-erp">betekenis van een ERP-systeem</a>.</p>
    </section>
    <section>
      <h2>ERP-scans voor andere sectoren</h2>
      <ul>${scanLinks}</ul>
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
