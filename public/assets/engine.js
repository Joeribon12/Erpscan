// ══════════════════════════════════════════════════════════════════════════
// ENGINE — render + scoring. Kent GEEN scan-inhoud, alleen het configschema.
// Eén engine bedient alle scans; een nieuwe doelgroep = alleen een nieuw
// configbestand in /scans/.  Zie CONTENT-GUIDE.md voor het schema.
// ══════════════════════════════════════════════════════════════════════════

import { RUNTIME, DEFAULT_PRIVACY_URL } from "./config.js";

// ── Mini-helpers ──────────────────────────────────────────────────────────
const $ = (sel, root = document) => root.querySelector(sel);
const app = $("#app");

// Veilige HTML-escape voor alle configtekst die we in de DOM zetten.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Bouw een element uit een HTML-string.
const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

// ── 1. Welke scan? ─────────────────────────────────────────────────────────
// Volgorde: ?scan=… (handig lokaal)  >  eerste padsegment (/maakindustrie)  >  default.
function resolveScanId() {
  const q = new URLSearchParams(location.search).get("scan");
  if (q) return q.trim().toLowerCase();
  const seg = location.pathname.split("/").filter(Boolean)[0];
  if (seg) return decodeURIComponent(seg).toLowerCase();
  return null; // -> landing
}

// ── 2. Config valideren ─────────────────────────────────────────────────────
// Faalt luid en duidelijk, zodat een fout in een nieuwe config meteen zichtbaar is.
function validateConfig(c) {
  const errs = [];
  if (!c.scan_id) errs.push("scan_id ontbreekt");
  if (!Array.isArray(c.dimensions) || !c.dimensions.length) errs.push("dimensions ontbreekt");
  if (!Array.isArray(c.questions)) errs.push("questions ontbreekt");
  const dimIds = new Set((c.dimensions || []).map((d) => d.id));
  (c.questions || []).forEach((q, i) => {
    if (!q.dimension || !dimIds.has(q.dimension)) errs.push(`vraag ${i + 1}: onbekende dimension "${q.dimension}"`);
    if (!Array.isArray(q.options) || q.options.length !== 4) errs.push(`vraag ${i + 1}: precies 4 opties vereist`);
    (q.options || []).forEach((o, j) => {
      if (typeof o.score !== "number") errs.push(`vraag ${i + 1} optie ${j + 1}: score moet een getal zijn`);
    });
  });
  (c.dimensions || []).forEach((d) => {
    if (!c.advice || !c.advice[d.id]) errs.push(`advies ontbreekt voor dimensie "${d.id}"`);
    else ["low", "mid", "high"].forEach((lvl) => {
      if (!c.advice[d.id][lvl]) errs.push(`advies "${d.id}.${lvl}" ontbreekt`);
    });
  });
  if (!Array.isArray(c.verdicts) || !c.verdicts.length) errs.push("verdicts ontbreekt");
  return errs;
}

// ── 3. Scoring ──────────────────────────────────────────────────────────────
// answers = { [questionId]: optionIndex }
function computeScores(cfg, answers) {
  const perDim = {}; // id -> { raw, max }
  cfg.dimensions.forEach((d) => (perDim[d.id] = { raw: 0, max: 0 }));

  let raw = 0, max = 0;
  const detail = [];
  cfg.questions.forEach((q) => {
    const optMax = Math.max(...q.options.map((o) => o.score));
    max += optMax; perDim[q.dimension].max += optMax;
    const idx = answers[q.id];
    const chosen = q.options[idx];
    const sc = chosen ? chosen.score : 0;
    raw += sc; perDim[q.dimension].raw += sc;
    detail.push({ question_id: q.id, dimension: q.dimension, text: q.text, chosen_index: idx, score: sc, label: chosen ? chosen.label : null });
  });

  const total = max ? Math.round((raw / max) * 100) : 0;

  const dimensions = cfg.dimensions.map((d) => {
    const { raw: r, max: m } = perDim[d.id];
    const pct = m ? Math.round((r / m) * 100) : 0;
    const level = pct < RUNTIME.DIMENSION_LEVELS.low ? "low" : pct < RUNTIME.DIMENSION_LEVELS.mid ? "mid" : "high";
    return { id: d.id, label: d.label, pct, level };
  });

  // Hoogste verdict waarvan min <= total.
  const sorted = [...cfg.verdicts].sort((a, b) => a.min - b.min);
  let verdict = sorted[0];
  for (const v of sorted) if (total >= v.min) verdict = v;

  return { total, dimensions, verdict, detail };
}

// ── 4. Rendering ────────────────────────────────────────────────────────────
let CFG = null;            // actieve config
const ANSWERS = {};        // questionId -> optionIndex

function setHeaderMeta(text) { $("#header-meta").textContent = text || ""; }

function renderIntro() {
  const tags = [
    CFG.audience && `◇ ${CFG.audience}`,
    `◷ ~3 min`,
    `${CFG.questions.length} vragen · ${CFG.dimensions.length} assen`,
  ].filter(Boolean);

  const node = el(`
    <section class="intro card">
      <span class="eyebrow">${esc(CFG.eyebrow || "ERP Growth Hack Scan")}</span>
      <h1>${esc(CFG.title)}</h1>
      <p class="lede">${esc(CFG.intro?.sub || "")}</p>
      <div class="meta-row">${tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      ${Array.isArray(CFG.intro?.bullets) && CFG.intro.bullets.length
        ? `<ul class="bullets">${CFG.intro.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
      <div class="actions" style="margin-top:26px">
        <button class="btn btn-primary" id="start">Start de scan <span class="arrow">→</span></button>
      </div>
    </section>`);
  app.replaceChildren(node);
  $("#start").addEventListener("click", renderQuestions);
}

function renderQuestions() {
  setHeaderMeta(CFG.title);
  const wrap = el(`<section class="scan-run">
    <div class="progress">
      <div class="progress-head"><span id="prog-text">0 / ${CFG.questions.length} beantwoord</span><span id="prog-pct">0%</span></div>
      <div class="progress-track"><div class="progress-fill" id="prog-fill"></div></div>
    </div>
    <div class="questions" id="questions"></div>
    <div class="submit-row">
      <button class="btn btn-primary" id="submit" disabled>Toon mijn diagnose <span class="arrow">→</span></button>
      <span class="submit-hint" id="submit-hint">Beantwoord alle vragen om verder te gaan</span>
    </div>
  </section>`);

  const dimLabel = Object.fromEntries(CFG.dimensions.map((d) => [d.id, d.label]));
  const qWrap = $(".questions", wrap);
  CFG.questions.forEach((q, i) => {
    const card = el(`<article class="q" id="q-${esc(q.id)}" data-answered="false">
      <div class="q-top">
        <span class="q-index">Vraag ${i + 1}</span>
        <span class="q-dim">${esc(dimLabel[q.dimension] || q.dimension)}</span>
      </div>
      <div class="q-text">${esc(q.text)}</div>
      <div class="options"></div>
    </article>`);
    const opts = $(".options", card);
    q.options.forEach((o, j) => {
      const opt = el(`<label class="opt">
        <input type="radio" name="${esc(q.id)}" value="${j}" />
        <span class="dot" aria-hidden="true"></span>
        <span class="opt-label">${esc(o.label)}</span>
      </label>`);
      $("input", opt).addEventListener("change", () => { ANSWERS[q.id] = j; card.dataset.answered = "true"; updateProgress(wrap); });
      opts.appendChild(opt);
    });
    qWrap.appendChild(card);
  });

  app.replaceChildren(wrap);
  $("#submit", wrap).addEventListener("click", () => {
    const result = computeScores(CFG, ANSWERS);
    renderResult(result);
  });
  updateProgress(wrap);
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function updateProgress(root) {
  const done = CFG.questions.filter((q) => ANSWERS[q.id] != null).length;
  const total = CFG.questions.length;
  const pct = Math.round((done / total) * 100);
  $("#prog-fill", root).style.width = pct + "%";
  $("#prog-text", root).textContent = `${done} / ${total} beantwoord`;
  $("#prog-pct", root).textContent = pct + "%";
  const submit = $("#submit", root);
  const ready = done === total;
  submit.disabled = !ready;
  $("#submit-hint", root).textContent = ready ? "Klaar — bekijk je resultaat" : `Nog ${total - done} te gaan`;
}

function renderResult(result) {
  setHeaderMeta(CFG.title);
  const R = 70, C = 2 * Math.PI * R;
  const node = el(`<section class="result">
    <span class="eyebrow">Jouw diagnose</span>
    <div class="card">
      <div class="score-hero">
        <div class="gauge" style="--circ:${C}">
          <svg viewBox="0 0 168 168" aria-hidden="true">
            <circle class="track" cx="84" cy="84" r="${R}"></circle>
            <circle class="ring" id="ring" cx="84" cy="84" r="${R}"></circle>
          </svg>
          <div class="num"><b id="score-num">0</b><small>/ 100</small></div>
        </div>
        <div>
          <div class="verdict-label">${esc(result.verdict.label)}</div>
          <p class="verdict-summary">${esc(result.verdict.summary)}</p>
        </div>
      </div>
    </div>

    <h2 style="margin-top:36px">Per as: waar zit je winst?</h2>
    <div class="dims" id="dims"></div>

    <div class="result-cta">
      <button class="btn btn-primary" id="to-lead">Ontvang het volledige advies <span class="arrow">→</span></button>
      <span class="submit-hint">Inclusief concrete next steps per as</span>
    </div>
  </section>`);

  // Dimensies + meebewegend advies
  const dimsWrap = $("#dims", node);
  result.dimensions.forEach((d) => {
    const adv = CFG.advice[d.id][d.level];
    const lvlText = { low: "Prioriteit", mid: "Aandacht", high: "Sterk" }[d.level];
    const row = el(`<div class="dim lvl-${d.level}">
      <div class="dim-head">
        <span class="dim-name">${esc(d.label)}</span>
        <span class="dim-bar"><i style="width:0"></i></span>
        <span class="dim-pct">${d.pct}%</span>
      </div>
      <div class="dim-advice">
        <h4><span class="tag ${d.level}">${lvlText}</span> &nbsp; ${esc(adv.title)}</h4>
        <p>${esc(adv.body)}</p>
      </div>
    </div>`);
    dimsWrap.appendChild(row);
    requestAnimationFrame(() => setTimeout(() => { $("i", row).style.width = d.pct + "%"; }, 120));
  });

  app.replaceChildren(node);
  window.scrollTo({ top: 0, behavior: "auto" });

  // Animaties: ring + cijfer tellen omhoog
  animateReveal(result.total, C);

  $("#to-lead", node).addEventListener("click", () => renderLead(result));
  // Bewaar voor de submit-payload
  LAST_RESULT = result;
}

function animateReveal(total, circ) {
  const ring = $("#ring"), num = $("#score-num");
  requestAnimationFrame(() => { ring.style.strokeDashoffset = String(circ * (1 - total / 100)); });
  const dur = RUNTIME.REVEAL_DURATION_MS, t0 = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    num.textContent = Math.round(eased * total);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

let LAST_RESULT = null;

// ── 5. Lead-formulier ───────────────────────────────────────────────────────
function renderLead(result) {
  const privacy = CFG.lead?.privacy_url || DEFAULT_PRIVACY_URL;
  const node = el(`<section class="lead card" id="lead">
    <span class="eyebrow">${esc(CFG.lead?.eyebrow || "Laatste stap")}</span>
    <h2>${esc(CFG.lead?.heading || "Ontvang je persoonlijke ERP-advies")}</h2>
    <p class="lede">${esc(CFG.lead?.sub || "We sturen je diagnose en een concreet verbeterplan toe. Geen spam.")}</p>

    <form id="lead-form" novalidate>
      <div class="form-grid">
        <div class="field" data-error="false">
          <label for="lf-name">Naam <span class="req">*</span></label>
          <input id="lf-name" name="name" type="text" autocomplete="name" placeholder="Voor- en achternaam" />
          <span class="err" data-for="name"></span>
        </div>
        <div class="field" data-error="false">
          <label for="lf-org">Organisatie <span class="req">*</span></label>
          <input id="lf-org" name="organisation" type="text" autocomplete="organization" placeholder="Bedrijfsnaam" />
          <span class="err" data-for="organisation"></span>
        </div>
        <div class="field" data-error="false">
          <label for="lf-email">Zakelijk e-mailadres <span class="req">*</span></label>
          <input id="lf-email" name="email" type="email" autocomplete="email" placeholder="naam@bedrijf.nl" />
          <span class="err" data-for="email"></span>
        </div>
        <div class="field" data-error="false">
          <label for="lf-phone">Telefoon <span style="color:var(--muted)">(optioneel)</span></label>
          <input id="lf-phone" name="phone" type="tel" autocomplete="tel" placeholder="+31 …" />
          <span class="err" data-for="phone"></span>
        </div>
        <div class="consent" data-error="false">
          <input id="lf-consent" name="consent" type="checkbox" />
          <label for="lf-consent">Ik ga akkoord dat mijn gegevens worden gebruikt om contact met me op te nemen over deze scan, conform het <a href="${esc(privacy)}" target="_blank" rel="noopener">privacybeleid</a>. <span class="req">*</span></label>
        </div>
      </div>
      <div class="form-foot">
        <button class="btn btn-primary" type="submit" id="lead-submit">Verstuur &amp; ontvang advies <span class="arrow">→</span></button>
        <span class="form-status" id="lead-status"></span>
      </div>
    </form>
  </section>`);

  app.replaceChildren(node);
  $("#lead").scrollIntoView({ behavior: "auto", block: "start" });
  $("#lead-form", node).addEventListener("submit", (e) => onLeadSubmit(e, result));
}

// Client-side validatie: naam, organisatie, geldig e-mail en consent verplicht.
function validateLead(data) {
  const errs = {};
  if (!data.name || data.name.trim().length < 2) errs.name = "Vul je naam in.";
  if (!data.organisation || data.organisation.trim().length < 2) errs.organisation = "Vul je organisatie in.";
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Vul een geldig e-mailadres in.";
  if (!data.consent) errs.consent = "Akkoord is verplicht.";
  return errs;
}

async function onLeadSubmit(e, result) {
  e.preventDefault();
  const form = e.currentTarget;
  const status = $("#lead-status");
  const data = {
    name: form.name.value, organisation: form.organisation.value,
    email: form.email.value, phone: form.phone.value, consent: form.consent.checked,
  };

  // Reset fouten
  form.querySelectorAll("[data-error]").forEach((f) => (f.dataset.error = "false"));
  form.querySelectorAll(".err").forEach((s) => (s.textContent = ""));
  status.className = "form-status"; status.textContent = "";

  const errs = validateLead(data);
  if (Object.keys(errs).length) {
    Object.entries(errs).forEach(([k, msg]) => {
      const span = form.querySelector(`.err[data-for="${k}"]`);
      if (span) span.textContent = msg;
      const field = (k === "consent") ? form.querySelector(".consent") : span?.closest(".field");
      if (field) field.dataset.error = "true";
    });
    status.classList.add("error"); status.textContent = "Controleer de gemarkeerde velden.";
    return;
  }

  // Volledige payload: lead + scores + antwoorden => meteen gekwalificeerd.
  const payload = {
    scan_id: CFG.scan_id,
    scan_title: CFG.title,
    audience: CFG.audience || null,
    total_score: result.total,
    verdict_label: result.verdict.label,
    dimensions: result.dimensions,
    answers: result.detail,
    lead: data,
    meta: { url: location.href, referrer: document.referrer || null, user_agent: navigator.userAgent, submitted_at_client: new Date().toISOString() },
  };

  const btn = $("#lead-submit"); btn.disabled = true;
  status.textContent = "Versturen…";
  try {
    const res = await fetch(RUNTIME.WORKER_ENDPOINT, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    renderThanks(result);
  } catch (err) {
    btn.disabled = false;
    status.classList.add("error");
    status.textContent = "Versturen mislukte. Probeer het zo nog eens of mail ons direct.";
    console.error("Lead submit error:", err);
  }
}

function renderThanks(result) {
  setHeaderMeta("");
  const node = el(`<section class="thanks">
    <div class="check" aria-hidden="true">✓</div>
    <h1>${esc(CFG.lead?.thanks_heading || "Bedankt — je advies is onderweg")}</h1>
    <p class="lede" style="margin-inline:auto">${esc(CFG.lead?.thanks_sub || "Een adviseur neemt binnen één werkdag contact op met je persoonlijke ERP-verbeterplan.")}</p>
    <p style="margin-top:18px;color:var(--muted);font-family:var(--font-mono);font-size:.85rem">Jouw score: ${result.total}/100 — ${esc(result.verdict.label)}</p>
  </section>`);
  app.replaceChildren(node);
  window.scrollTo({ top: 0, behavior: "auto" });
}

// ── 6. Landing (geen scan gekozen) ──────────────────────────────────────────
async function renderLanding() {
  let registry = [];
  try { registry = (await import("../scans/registry.js")).SCANS; } catch { /* registry optioneel */ }
  const tiles = registry.map((s) => `
    <a class="scan-tile" href="${esc(s.path || "/?scan=" + s.id)}">
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.audience || "")}</p>
      <span class="go">Start scan →</span>
    </a>`).join("");

  app.replaceChildren(el(`<section>
    <span class="eyebrow">ERP Growth Hack Scan</span>
    <h1>Hoe futureproof is jouw ERP-landschap?</h1>
    <p class="lede">Kies de scan die bij jouw situatie past. In ~3 minuten krijg je een concrete diagnose met verbeterpunten per as.</p>
    ${registry.length ? `<div class="scan-list">${tiles}</div>` : `<p class="fatal">Nog geen scans geregistreerd in <code>/scans/registry.js</code>.</p>`}
  </section>`));
}

function renderFatal(scanId, errs) {
  app.replaceChildren(el(`<section class="fatal">
    <span class="eyebrow">Scan niet beschikbaar</span>
    <h1>Deze scan konden we niet laden</h1>
    <p>Gevraagde scan: <code>${esc(scanId)}</code></p>
    ${errs?.length ? `<p style="color:var(--bad)">${errs.map(esc).join("<br>")}</p>` : ""}
    <p><a href="/">← Naar het overzicht</a></p>
  </section>`));
}

// ── 7. Bootstrap ────────────────────────────────────────────────────────────
async function boot() {
  $("#year").textContent = new Date().getFullYear();
  $("#footer-privacy").href = DEFAULT_PRIVACY_URL;

  const scanId = resolveScanId();
  if (!scanId) return renderLanding();

  let mod;
  try {
    mod = await import(`../scans/${scanId}.js`);
  } catch (e) {
    console.error(e);
    return renderFatal(scanId);
  }
  const cfg = mod.default || mod.config;
  const errs = validateConfig(cfg);
  if (errs.length) { console.error("Config-fouten:", errs); return renderFatal(scanId, errs); }

  CFG = cfg;
  document.title = `${cfg.title} — ERP Scan`;
  if (cfg.lead?.privacy_url) $("#footer-privacy").href = cfg.lead.privacy_url;
  renderIntro();
}

boot();
