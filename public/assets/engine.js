// ══════════════════════════════════════════════════════════════════════════
// ENGINE — render + scoring. Kent GEEN scan-inhoud, alleen het configschema.
// Eén engine bedient alle scans; een nieuwe doelgroep = alleen een nieuw
// configbestand in /scans/.  Zie CONTENT-GUIDE.md voor het schema.
// ══════════════════════════════════════════════════════════════════════════

import { RUNTIME, DEFAULT_PRIVACY_URL, PROFILE } from "./config.js";

// ── Mini-helpers ──────────────────────────────────────────────────────────
const $ = (sel, root = document) => root.querySelector(sel);
const app = $("#app");

// Veilige HTML-escape voor alle configtekst die we in de DOM zetten.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Bouw een element uit een HTML-string.
const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

// ── 1. Welke route? ─────────────────────────────────────────────────────────
// Bepaalt wat we renderen op basis van pad of queryparam.
//   ""                -> landing (scan-keuze)
//   /info             -> kennisbank-index
//   /info/<slug>      -> artikel uit /pages/<slug>.js
//   /<scan_id>        -> scan uit /scans/<scan_id>.js
// Lokaal werkt ook ?scan=<id> en ?page=<id>.
function resolveRoute() {
  const params = new URLSearchParams(location.search);
  if (params.get("page")) return { kind: "article", id: params.get("page").trim().toLowerCase() };
  if (params.get("scan")) return { kind: "scan", id: params.get("scan").trim().toLowerCase() };
  const segs = location.pathname.split("/").filter(Boolean).map((s) => decodeURIComponent(s).toLowerCase());
  if (!segs.length) return { kind: "landing" };
  if (segs[0] === "info") return segs[1] ? { kind: "article", id: segs[1] } : { kind: "info-index" };
  return { kind: "scan", id: segs[0] };
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
const PROFILE_ANSWERS = {}; // profielveld-id -> { label, value }  (telt niet mee in de score)

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
  $("#start").addEventListener("click", renderProfile);
}

// ── 4b. Profielstap (kwalificatie) — verschijnt in elke scan ────────────────
function renderProfile() {
  setHeaderMeta(CFG.title);
  const fields = PROFILE.fields.map((f) => {
    if (f.type === "select") {
      const opts = ['<option value="" disabled selected>Kies…</option>']
        .concat(f.options.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`)).join("");
      return `<div class="profile-field">
        <label for="pf-${esc(f.id)}">${esc(f.label)}${f.required ? ' <span class="req">*</span>' : ""}</label>
        <select id="pf-${esc(f.id)}">${opts}</select>
      </div>`;
    }
    if (f.type === "slider") {
      const def = Number.isInteger(f.default) ? f.default : Math.floor((f.steps.length - 1) / 2);
      return `<div class="profile-field">
        <div class="slider-head"><label for="pf-${esc(f.id)}">${esc(f.label)}</label><output id="po-${esc(f.id)}">${esc(f.steps[def])}</output></div>
        <input type="range" id="pf-${esc(f.id)}" min="0" max="${f.steps.length - 1}" step="1" value="${def}" />
      </div>`;
    }
    return "";
  }).join("");

  const hasRequired = PROFILE.fields.some((f) => f.required);
  const node = el(`<section class="profile card">
    <span class="eyebrow">Stap 1 · Over je organisatie</span>
    <h1>${esc(PROFILE.heading)}</h1>
    <p class="lede">${esc(PROFILE.sub)}</p>
    <div class="profile-fields">${fields}</div>
    <div class="actions" style="margin-top:28px">
      <button class="btn btn-primary" id="profile-next" ${hasRequired ? "disabled" : ""}>Naar de scan <span class="arrow">→</span></button>
    </div>
  </section>`);
  app.replaceChildren(node);

  PROFILE.fields.forEach((f) => {
    const input = $(`#pf-${f.id}`, node);
    if (f.type === "slider") {
      const out = $(`#po-${f.id}`, node);
      const set = () => { PROFILE_ANSWERS[f.id] = { label: f.label, value: f.steps[+input.value] }; out.textContent = f.steps[+input.value]; };
      input.addEventListener("input", set);
      set(); // zet de standaardwaarde meteen
    } else if (f.type === "select") {
      input.addEventListener("change", () => {
        PROFILE_ANSWERS[f.id] = { label: f.label, value: input.value };
        checkProfileReady(node);
      });
    }
  });
  $("#profile-next", node).addEventListener("click", renderQuestions);
  window.scrollTo({ top: 0, behavior: "auto" });
}

function checkProfileReady(root) {
  const ok = PROFILE.fields.filter((f) => f.required).every((f) => PROFILE_ANSWERS[f.id]?.value);
  $("#profile-next", root).disabled = !ok;
}

let Q_INDEX = 0; // huidige vraag in de wizard

function renderQuestions() {
  Q_INDEX = 0;
  setHeaderMeta(CFG.title);
  const wrap = el(`<section class="scan-run">
    <div class="progress">
      <div class="progress-head"><span id="prog-text"></span><span id="prog-pct"></span></div>
      <div class="progress-track"><div class="progress-fill" id="prog-fill"></div></div>
    </div>
    <div class="qstage" id="qstage" aria-live="polite"></div>
    <div class="qnav">
      <button class="btn btn-ghost" id="q-prev" type="button">← Vorige</button>
      <span class="submit-hint" id="q-hint"></span>
    </div>
  </section>`);
  app.replaceChildren(wrap);
  $("#q-prev", wrap).addEventListener("click", () => { if (Q_INDEX > 0) { Q_INDEX--; paintQuestion(); } });
  paintQuestion();
  window.scrollTo({ top: 0, behavior: "auto" });
}

// Toont één vraag. Bij het kiezen van een antwoord springt de wizard automatisch
// door naar de volgende vraag (of naar het resultaat na de laatste). Geen scrollen.
function paintQuestion() {
  const total = CFG.questions.length;
  const q = CFG.questions[Q_INDEX];
  const dimLabel = Object.fromEntries(CFG.dimensions.map((d) => [d.id, d.label]));
  const card = el(`<article class="q qcard">
    <div class="q-top">
      <span class="q-index">Vraag ${Q_INDEX + 1} / ${total}</span>
      <span class="q-dim">${esc(dimLabel[q.dimension] || q.dimension)}</span>
    </div>
    <div class="q-text">${esc(q.text)}</div>
    <div class="options"></div>
  </article>`);
  const opts = $(".options", card);
  q.options.forEach((o, j) => {
    const sel = ANSWERS[q.id] === j ? " selected" : "";
    const b = el(`<button type="button" class="opt${sel}">
      <span class="dot" aria-hidden="true"></span>
      <span class="opt-label">${esc(o.label)}</span>
    </button>`);
    b.addEventListener("click", () => chooseOption(q, j, b));
    opts.appendChild(b);
  });
  $("#qstage").replaceChildren(card);
  $("#q-prev").disabled = Q_INDEX === 0;
  $("#q-hint").textContent = (Q_INDEX === total - 1) ? "Laatste vraag — je krijgt direct je diagnose" : "Kies een antwoord om door te gaan";
  updateProgress();
}

function chooseOption(q, j, btn) {
  ANSWERS[q.id] = j;
  const group = btn.parentElement;
  group.querySelectorAll(".opt").forEach((b) => { b.classList.remove("selected"); b.disabled = true; });
  btn.classList.add("selected");
  updateProgress();
  const total = CFG.questions.length;
  setTimeout(() => {
    if (Q_INDEX < total - 1) { Q_INDEX++; paintQuestion(); }
    else { renderResult(computeScores(CFG, ANSWERS)); }
  }, 300);
}

function updateProgress() {
  const done = CFG.questions.filter((q) => ANSWERS[q.id] != null).length;
  const total = CFG.questions.length;
  const pct = Math.round((done / total) * 100);
  const pf = $("#prog-fill"); if (pf) pf.style.width = pct + "%";
  const pt = $("#prog-text"); if (pt) pt.textContent = `${done} / ${total} beantwoord`;
  const pp = $("#prog-pct"); if (pp) pp.textContent = pct + "%";
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
    profile: { ...PROFILE_ANSWERS },
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
  setHeaderMeta("");
  let registry = [];
  try { registry = (await import("../scans/registry.js")).SCANS; } catch { /* registry optioneel */ }
  const tiles = registry.map((s) => `
    <a class="scan-tile" href="${esc(s.path || "/?scan=" + s.id)}">
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.audience || "")}</p>
      <span class="go">Start scan →</span>
    </a>`).join("");

  app.replaceChildren(el(`<div class="landing">
    <section class="hero">
      <span class="eyebrow">ERP Growth Hack Scan</span>
      <h1 class="hero-title">Je ERP bepaalt je toekomst.<br>Hoe futureproof is die van jou?</h1>
      <p class="lede hero-lede">AI, S/4HANA, clean core en realtime data: het ERP-landschap verandert sneller dan ooit. Doe de gratis scan en weet binnen 3 minuten waar jij staat — én waar je grootste winst ligt.</p>
      <div class="hero-cta">
        <a class="btn btn-primary" href="/algemeen">Start de gratis scan <span class="arrow">→</span></a>
        <a class="btn btn-ghost" href="#scans">Of kies je branche ↓</a>
      </div>
      <div class="hero-stats">
        <div><b>${registry.length || 10}</b><span>branchespecifieke scans</span></div>
        <div><b>5</b><span>assen: strategie, AI, clean core, data &amp; schaalbaarheid</span></div>
        <div><b>~3 min</b><span>tot je persoonlijke diagnose</span></div>
      </div>
    </section>

    <section id="scans" class="scan-choose">
      <h2>Kies de scan die bij je past</h2>
      <p class="lede">Elke scan is toegespitst op een branche of rol, met scherpe vragen en concreet advies per as.</p>
      ${registry.length ? `<div class="scan-list">${tiles}</div>` : `<p class="fatal">Nog geen scans geregistreerd in <code>/scans/registry.js</code>.</p>`}
    </section>

    <p class="kennis-cta">Liever eerst inlezen? Bekijk de <a href="/info">kennisbank met feiten &amp; inzichten over ERP →</a></p>
  </div>`));
}

// ── 6b. Kennisbank: index + artikelen ───────────────────────────────────────
async function renderInfoIndex() {
  setHeaderMeta("");
  document.title = "Kennisbank — ERP Scan";
  let registry = [];
  try { registry = (await import("../pages/registry.js")).PAGES; } catch { /* registry optioneel */ }
  const tiles = registry.map((p) => `
    <a class="scan-tile" href="${esc(p.path || "/info/" + p.id)}">
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.teaser || "")}</p>
      <span class="go">Lees verder →</span>
    </a>`).join("");

  app.replaceChildren(el(`<section>
    <span class="eyebrow">Kennisbank</span>
    <h1>Feiten &amp; inzichten over ERP</h1>
    <p class="lede">Korte, scherpe artikelen over ERP-optimalisatie, S/4HANA en AI — met de feiten op een rij.</p>
    ${registry.length ? `<div class="scan-list">${tiles}</div>` : `<p class="fatal">Nog geen artikelen geregistreerd in <code>/pages/registry.js</code>.</p>`}
    <p style="margin-top:30px"><a href="/">← Naar de scans</a></p>
  </section>`));
}

// Rendert één inhoudsblok van een artikel (data-driven, geen scan-logica).
function renderSection(s) {
  if (s.type === "stats") {
    const items = (s.items || []).map((it) => `
      <div class="stat">
        <b>${esc(it.value)}</b>
        <span>${esc(it.label)}</span>
        ${it.note ? `<small>${esc(it.note)}</small>` : ""}
      </div>`).join("");
    return `<section class="stats-block">${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}<div class="stat-grid">${items}</div></section>`;
  }
  if (s.type === "facts") {
    const items = (s.items || []).map((it, i) => `
      <div class="fact">
        <span class="fact-num">${String(i + 1).padStart(2, "0")}</span>
        <div><h3>${esc(it.title)}</h3><p>${esc(it.body)}</p></div>
      </div>`).join("");
    return `<section class="facts-block">${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}<div class="fact-list">${items}</div></section>`;
  }
  if (s.type === "prose") {
    const body = Array.isArray(s.body) ? s.body : [s.body];
    return `<section class="prose-block">${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}${body.map((p) => `<p>${esc(p)}</p>`).join("")}</section>`;
  }
  return "";
}

function renderArticle(cfg) {
  setHeaderMeta("");
  const sections = (cfg.sections || []).map(renderSection).join("");
  const cta = cfg.cta ? `
    <div class="article-cta card">
      <div>
        <h2>${esc(cfg.cta.heading || "Benieuwd hoe jij ervoor staat?")}</h2>
        <p>${esc(cfg.cta.body || "")}</p>
      </div>
      <a class="btn btn-primary" href="${esc(cfg.cta.href || "/")}">${esc(cfg.cta.label || "Doe de scan")} <span class="arrow">→</span></a>
    </div>` : "";
  const sources = Array.isArray(cfg.sources) && cfg.sources.length
    ? `<aside class="sources"><h3>Bronnen &amp; verantwoording</h3><ul>${cfg.sources.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></aside>` : "";

  app.replaceChildren(el(`<article class="article">
    <a class="back-link" href="${esc(cfg.backHref || "/info")}">${esc(cfg.backLabel || "← Kennisbank")}</a>
    <span class="eyebrow">${esc(cfg.eyebrow || "Kennis")}</span>
    <h1>${esc(cfg.title)}</h1>
    ${cfg.intro ? `<p class="lede">${esc(cfg.intro)}</p>` : ""}
    ${sections}
    ${cta}
    ${sources}
  </article>`));
  window.scrollTo({ top: 0, behavior: "auto" });
}

function renderFatal(id, errs, kind = "scan") {
  const isInfo = kind === "info";
  app.replaceChildren(el(`<section class="fatal">
    <span class="eyebrow">${isInfo ? "Pagina" : "Scan"} niet beschikbaar</span>
    <h1>Dit konden we niet laden</h1>
    <p>Gevraagd: <code>${esc(id)}</code></p>
    ${errs?.length ? `<p style="color:var(--bad)">${errs.map(esc).join("<br>")}</p>` : ""}
    <p><a href="${isInfo ? "/info" : "/"}">← Terug naar ${isInfo ? "de kennisbank" : "het overzicht"}</a></p>
  </section>`));
}

// ── 7. Loaders per type ──────────────────────────────────────────────────────
async function loadScan(scanId) {
  let mod;
  try { mod = await import(`../scans/${scanId}.js`); }
  catch (e) { console.error(e); return renderFatal(scanId); }
  const cfg = mod.default || mod.config;
  const errs = validateConfig(cfg);
  if (errs.length) { console.error("Config-fouten:", errs); return renderFatal(scanId, errs); }

  CFG = cfg;
  document.title = `${cfg.title} — ERP Scan`;
  if (cfg.lead?.privacy_url) $("#footer-privacy").href = cfg.lead.privacy_url;
  renderIntro();
}

async function loadArticle(id) {
  let mod;
  try { mod = await import(`../pages/${id}.js`); }
  catch (e) { console.error(e); return renderFatal(id, null, "info"); }
  const cfg = mod.default || mod.config;
  if (!cfg || !cfg.title) return renderFatal(id, ["title ontbreekt in de pagina-config"], "info");
  document.title = `${cfg.title} — ERP Scan`;
  renderArticle(cfg);
}

// ── 8. Bootstrap ────────────────────────────────────────────────────────────
async function boot() {
  $("#year").textContent = new Date().getFullYear();
  $("#footer-privacy").href = DEFAULT_PRIVACY_URL;

  const route = resolveRoute();
  if (route.kind === "landing") return renderLanding();
  if (route.kind === "info-index") return renderInfoIndex();
  if (route.kind === "article") return loadArticle(route.id);
  return loadScan(route.id);
}

boot();
