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

// Dynamische import met herkansing: een enkele netwerk-/cache-hapering bij het
// laden van een module mag de pagina niet blanco laten. We proberen het een
// paar keer met korte pauze; pas daarna geven we de fout door.
async function importWithRetry(path, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try { return await import(path); }
    catch (e) {
      lastErr = e;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, 250 * (i + 1)));
    }
  }
  throw lastErr;
}

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
let GUESS = null;          // zelfvoorspelling (0-100) van de intro, voor de kloof-reveal op het resultaat

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
      ${CFG.predict ? `<div class="predict">
        <label for="predict-slider">${esc(CFG.predict.question || "Gok eens: hoe futureproof zijn jullie?")}</label>
        <div class="predict-row">
          <span class="predict-min">${esc(CFG.predict.min_label || "0")}</span>
          <input type="range" id="predict-slider" min="0" max="100" step="1" value="50" aria-label="${esc(CFG.predict.question || "Je inschatting")}" />
          <span class="predict-max">${esc(CFG.predict.max_label || "100")}</span>
          <output id="predict-out">50</output>
        </div>
      </div>` : ""}
      <div class="actions" style="margin-top:26px">
        <button class="btn btn-primary" id="start">Start de scan <span class="arrow">→</span></button>
      </div>
    </section>`);
  app.replaceChildren(node);
  // Zelfvoorspelling (optioneel): sla de gok op voor de kloof-reveal op het resultaat.
  if (CFG.predict) {
    const sl = $("#predict-slider", node), out = $("#predict-out", node);
    GUESS = 50;
    sl.addEventListener("input", () => { GUESS = +sl.value; out.textContent = sl.value; });
  } else {
    GUESS = null;
  }
  // Profielvragen (omzet/omvang) overgeslagen: meteen naar de scanvragen.
  $("#start").addEventListener("click", renderQuestions);
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
  const isLast = Q_INDEX >= total - 1;
  const proceed = () => {
    if (!isLast) { Q_INDEX++; paintQuestion(); }
    else { renderResult(computeScores(CFG, ANSWERS)); }
  };
  setTimeout(() => {
    // Is dit de laatste vraag van zijn as? Zo ja (en niet de allerlaatste vraag),
    // toon een korte "aha"-flits met de tussenstand op die as vóór we doorgaan.
    const nextQ = CFG.questions[Q_INDEX + 1];
    const axisEnded = !isLast && nextQ && nextQ.dimension !== q.dimension;
    const dim = CFG.dimensions.find((d) => d.id === q.dimension);
    if (axisEnded && dim && dim.insight) showInterstitial(dim, proceed);
    else proceed();
  }, 300);
}

// Tussenstand op één as (0-100) op basis van de tot nu toe gegeven antwoorden.
function axisScore(dimId) {
  const qs = CFG.questions.filter((q) => q.dimension === dimId);
  let raw = 0, max = 0;
  qs.forEach((q) => {
    max += Math.max(...q.options.map((o) => o.score));
    const idx = ANSWERS[q.id];
    if (idx != null && q.options[idx]) raw += q.options[idx].score;
  });
  return max ? Math.round((raw / max) * 100) : 0;
}

// "Aha"-flits tussen twee assen: toont de tussenstand + een insight-regel.
// Gaat vanzelf door na een korte pauze; "Verder" slaat de pauze over.
function showInterstitial(dim, done) {
  const pct = axisScore(dim.id);
  const L = RUNTIME.DIMENSION_LEVELS;
  const level = pct < L.low ? "low" : pct < L.mid ? "mid" : "high";
  const text = dim.insight[level] || dim.insight.mid || "";
  const nav = $(".qnav");
  if (nav) nav.style.display = "none";
  const card = el(`<article class="interstitial lvl-${level}">
    <span class="int-eyebrow">${esc(dim.label)} · tussenstand</span>
    <div class="int-score"><b>${pct}</b><small>/ 100</small></div>
    <p class="int-text">${esc(text)}</p>
    <button class="btn btn-primary" id="int-next" type="button">Verder <span class="arrow">→</span></button>
    <div class="int-bar"><i></i></div>
  </article>`);
  $("#qstage").replaceChildren(card);
  requestAnimationFrame(() => { const b = $("i", card); if (b) b.style.width = "100%"; });
  let advanced = false;
  const go = () => { if (advanced) return; advanced = true; clearTimeout(timer); if (nav) nav.style.display = ""; done(); };
  const timer = setTimeout(go, 2600);
  $("#int-next", card).addEventListener("click", go);
}

function updateProgress() {
  const done = CFG.questions.filter((q) => ANSWERS[q.id] != null).length;
  const total = CFG.questions.length;
  const pct = Math.round((done / total) * 100);
  const pf = $("#prog-fill"); if (pf) pf.style.width = pct + "%";
  const pt = $("#prog-text"); if (pt) pt.textContent = `${done} / ${total} beantwoord`;
  const pp = $("#prog-pct"); if (pp) pp.textContent = pct + "%";
}

// Kiest een archetype op basis van het scorepatroon: alles sterk -> allStrong,
// anders het archetype dat bij de zwakste as hoort. Config-driven (cfg.archetypes).
function pickArchetype(result) {
  const arr = CFG.archetypes;
  if (!Array.isArray(arr) || !arr.length) return null;
  const ranked = [...result.dimensions].sort((a, b) => a.pct - b.pct);
  if (ranked.every((d) => d.level === "high")) {
    const a = arr.find((x) => x.allStrong);
    if (a) return a;
  }
  const weakest = ranked[0];
  return arr.find((x) => x.weakest === weakest.id)
    || arr.find((x) => !x.weakest && !x.allStrong)
    || arr[0];
}

function renderResult(result) {
  setHeaderMeta(CFG.title);
  const R = 70, C = 2 * Math.PI * R;
  const arch = pickArchetype(result);
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
          ${arch ? `<div class="archetype"><span class="arch-badge">${esc(arch.label)}</span>${arch.tagline ? `<span class="arch-tag">${esc(arch.tagline)}</span>` : ""}</div>` : ""}
          <div class="verdict-label">${esc(result.verdict.label)}</div>
          <p class="verdict-summary">${esc(result.verdict.summary)}</p>
        </div>
      </div>
      ${GUESS != null ? `<p class="gap-reveal" id="gap-reveal"></p>` : ""}
    </div>

    <section class="diagnosis card" id="diagnosis">
      <span class="eyebrow">Fit-to-standard diagnose</span>
      <div class="diag-body" id="diag-body">
        <div class="diag-loading">
          <span class="diag-spinner" aria-hidden="true"></span>
          <p>Een onafhankelijk adviseur stelt je fit-to-standard diagnose op…<br><small>Dit duurt een paar seconden.</small></p>
        </div>
      </div>
    </section>

    <div class="plan-head" style="margin-top:36px">
      <h2 id="plan-title"></h2>
      <p class="lede" id="plan-intro"></p>
    </div>
    <div class="dims" id="dims"></div>

    <section class="lead card" id="fb"></section>
  </section>`);

  // Dimensies als geprioriteerd actieplan: laagste score eerst, want daar zit
  // de meeste winst. Het niveau is monotoon met de score (zelfde drempels),
  // dus oplopend sorteren zet vanzelf low → mid → high op volgorde.
  const dimsWrap = $("#dims", node);
  const ranked = [...result.dimensions].sort((a, b) => a.pct - b.pct);
  const allStrong = ranked.every((d) => d.level === "high");
  // Per vraag: het gekozen antwoord en de trede erboven (= concrete volgende stap).
  const detailById = Object.fromEntries((result.detail || []).map((x) => [x.question_id, x]));

  $("#plan-title", node).textContent = allStrong
    ? "Je actieplan — verfijnen en verzilveren"
    : "Je actieplan — op volgorde van impact";
  $("#plan-intro", node).textContent = allStrong
    ? "Je staat er sterk voor. Hieronder je assen op volgorde; bovenaan zit de meeste resterende winst."
    : "We hebben je assen gesorteerd op waar de meeste winst zit. Begin bovenaan — dat is je grootste hefboom.";

  ranked.forEach((d, i) => {
    const adv = CFG.advice[d.id][d.level];
    const lvlText = { low: "Prioriteit", mid: "Aandacht", high: "Sterk" }[d.level];
    const isPriority = i === 0 && !allStrong;

    // Concrete vervolgstappen per vraag op deze as: toon wat je koos en de
    // eerstvolgende, hoger scorende trede als doel. Bij een topantwoord: bevestig.
    const steps = CFG.questions.filter((q) => q.dimension === d.id).map((q) => {
      const det = detailById[q.id];
      if (!det || det.chosen_index == null) return null;
      const chosen = q.options[det.chosen_index];
      if (!chosen) return null;
      const next = q.options
        .filter((o) => o.score > chosen.score)
        .sort((a, b) => a.score - b.score)[0];
      return { topic: q.text, now: chosen.label, next: next ? next.label : null };
    }).filter(Boolean);

    const stepsHtml = steps.length ? `
      <p class="ns-label">Concrete vervolgstappen</p>
      <ul class="next-steps">${steps.map((s) => `
        <li>
          <span class="ns-q">${esc(s.topic)}</span>
          ${s.next
            ? `<span class="ns-now">Nu: ${esc(s.now)}</span>
               <span class="ns-next"><b>Volgende stap →</b> ${esc(s.next)}</span>`
            : `<span class="ns-done">✓ Al op best-practice niveau — ${esc(s.now)}</span>`}
        </li>`).join("")}</ul>` : "";

    const row = el(`<div class="dim lvl-${d.level}${isPriority ? " priority" : ""}">
      ${isPriority ? `<span class="begin-here">↓ Begin hier · je grootste kans</span>` : ""}
      <div class="dim-head">
        <span class="dim-rank">${i + 1}</span>
        <span class="dim-name">${esc(d.label)}</span>
        <span class="dim-bar"><i style="width:0"></i></span>
        <span class="dim-pct">${d.pct}%</span>
      </div>
      <div class="dim-advice">
        <h4><span class="tag ${d.level}">${lvlText}</span> &nbsp; ${esc(adv.title)}</h4>
        <p>${esc(adv.body)}</p>
        ${stepsHtml}
      </div>
    </div>`);
    dimsWrap.appendChild(row);
    requestAnimationFrame(() => setTimeout(() => { $("i", row).style.width = d.pct + "%"; }, 120));
  });

  app.replaceChildren(node);
  window.scrollTo({ top: 0, behavior: "auto" });

  // Animaties: ring + cijfer tellen omhoog
  animateReveal(result.total, C);

  // Kloof-reveal: hoe verhoudt de echte score zich tot de zelf-inschatting?
  if (GUESS != null) {
    const g = $("#gap-reveal", node);
    if (g) {
      const diff = result.total - GUESS;
      g.textContent = diff <= -10
        ? `Je schatte jezelf op ${GUESS} — je scoort ${result.total}. Die ${Math.abs(diff)} punten overschatting is precies waar een frisse blik het meest oplevert.`
        : diff >= 10
        ? `Je schatte jezelf op ${GUESS} — je scoort hoger: ${result.total}. Mooi, en er is nog ruimte om te verzilveren.`
        : `Je schatte jezelf op ${GUESS} — je scoort ${result.total}. Scherp ingeschat.`;
    }
  }

  // Direct de leadvraag tonen (geen feedback-tussenstap meer): meteen na de
  // diagnose vragen we om gegevens voor persoonlijk advies.
  renderSoftLead(node, result);
  runDiagnosis(node, result);
  // Bewaar voor de submit-payload
  LAST_RESULT = result;
}

// ── LLM fit-to-standard diagnose ─────────────────────────────────────────────
// Additief: haalt een scherpe, sectorspecifieke diagnose op bij de Worker.
// Faalt de call (of is de service niet geconfigureerd), dan verdwijnt de kaart
// geruisloos — het sjabloon-actieplan eronder blijft de volwaardige uitkomst.
async function runDiagnosis(node, result) {
  const card = $("#diagnosis", node);
  const bodyEl = $("#diag-body", node);
  if (!card || !bodyEl) return;

  const payload = {
    scan_id: CFG.scan_id,
    total_score: result.total,
    verdict_label: result.verdict.label,
    dimensions: result.dimensions,
    answers: result.detail,
  };

  try {
    const res = await fetch(RUNTIME.DIAGNOSE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data.diagnosis) throw new Error("lege diagnose");
    bodyEl.innerHTML = renderMarkdown(data.diagnosis);
    bodyEl.classList.add("diag-ready");
  } catch (err) {
    console.warn("Diagnose niet beschikbaar:", err);
    card.remove(); // stil degraderen naar het sjabloon-advies
  }
}

// Kleine, veilige Markdown→HTML voor de diagnosetekst: escapet alles en laat
// alleen kopjes (## ), opsommingen (- ) en **vet** door. Geen ruwe HTML.
function renderMarkdown(md) {
  const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const lines = String(md).replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let list = null, para = [];
  const flushList = () => { if (list) { out.push(`<ul>${list.join("")}</ul>`); list = null; } };
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushList(); flushPara(); continue; }
    const h = line.match(/^#{1,4}\s+(.*)$/);
    if (h) { flushList(); flushPara(); out.push(`<h3>${inline(h[1])}</h3>`); continue; }
    const li = line.match(/^[-*]\s+(.*)$/);
    if (li) { flushPara(); (list = list || []).push(`<li>${inline(li[1])}</li>`); continue; }
    flushList(); para.push(line);
  }
  flushList(); flushPara();
  return out.join("");
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

// ── 5b. Feedback ("Was dit nuttig?") + optionele zachte lead ────────────────
function wireFeedback(root, result) {
  let chosen = null;
  const btns = root.querySelectorAll(".fb-btn");
  const send = $("#fb-send", root);
  btns.forEach((b) => b.addEventListener("click", () => {
    chosen = b.dataset.v;
    btns.forEach((x) => x.classList.toggle("selected", x === b));
    send.disabled = false;
  }));
  send.addEventListener("click", () => sendFeedback(root, result, chosen, $("#fb-comment", root).value));
}

async function sendFeedback(root, result, helpful, comment) {
  const send = $("#fb-send", root), status = $("#fb-status", root);
  send.disabled = true; status.className = "form-status"; status.textContent = "Versturen…";
  const payload = {
    scan_id: CFG.scan_id, scan_title: CFG.title, total_score: result.total,
    verdict_label: result.verdict.label, helpful: helpful || null, comment: (comment || "").trim(),
    meta: { url: location.href, submitted_at_client: new Date().toISOString() },
  };
  try {
    await fetch(RUNTIME.FEEDBACK_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  } catch (err) { console.error("Feedback error:", err); /* feedback is niet kritisch */ }
  renderSoftLead(root, result);
}

// Leadvraag direct na de diagnose (geen feedback-tussenstap meer). Copy is
// config-driven via CFG.lead.soft_* (met fallback naar de generieke tekst,
// zodat scans zonder die velden ongemoeid blijven). De zwakste as wordt
// automatisch als gespreksaanleiding benoemd.
function renderSoftLead(root, result) {
  const privacy = CFG.lead?.privacy_url || DEFAULT_PRIVACY_URL;
  const L = CFG.lead || {};
  const heading = L.soft_heading || "Laat je gegevens achter voor persoonlijk advies";
  const sub = L.soft_sub || "Ontvang je volledige diagnose met concrete verbeterpunten en bespreek vrijblijvend waar voor jou de meeste winst zit. Een onafhankelijke ERP-specialist neemt binnen één werkdag contact op — geen verkooppraatje, geen verplichting.";
  const button = L.soft_button || "Ja, ik wil vrijblijvend advies";
  const tag = L.soft_tag || "(gratis · vrijblijvend)";
  const qLabel = L.soft_question_label || "Je vraag of situatie";
  const qPlaceholder = L.soft_question_placeholder || "Waar wil je het over hebben? Bijv. waar je tegenaan loopt of wat je wilt bereiken.";

  // Personaliseer: benoem de zwakste as als concrete aanleiding voor het gesprek.
  const weakest = [...result.dimensions].sort((a, b) => a.pct - b.pct)[0];
  const focusLine = weakest && weakest.level !== "high"
    ? `<p class="soft-focus">Je grootste kans zit nu in <b>${esc(weakest.label.toLowerCase())}</b> — een logisch startpunt voor het gesprek.</p>`
    : "";

  const fb = $("#fb", root);
  fb.classList.remove("feedback");
  fb.innerHTML = `
    <span class="eyebrow">${esc(L.soft_eyebrow || "Persoonlijk advies")}</span>
    <h2>${esc(heading)} <span class="optional">${esc(tag)}</span></h2>
    <p class="lede">${esc(sub)}</p>
    ${focusLine}
    <form id="lead-form" novalidate>
      <div class="form-grid">
        <div class="field span-2" data-error="false">
          <label for="lf-email">Zakelijk e-mailadres <span class="req">*</span></label>
          <input id="lf-email" name="email" type="email" autocomplete="email" placeholder="naam@bedrijf.nl" />
          <span class="err" data-for="email"></span>
        </div>
        <div class="field" data-error="false">
          <label for="lf-name">Naam <span class="optional">(optioneel)</span></label>
          <input id="lf-name" name="name" type="text" autocomplete="name" placeholder="Voor- en achternaam" />
        </div>
        <div class="field" data-error="false">
          <label for="lf-org">Organisatie <span class="optional">(optioneel)</span></label>
          <input id="lf-org" name="organisation" type="text" autocomplete="organization" placeholder="Bedrijfsnaam" />
        </div>
        <div class="field span-2" data-error="false">
          <label for="lf-question">${esc(qLabel)} <span class="optional">(optioneel)</span></label>
          <textarea id="lf-question" name="question" rows="3" placeholder="${esc(qPlaceholder)}"></textarea>
        </div>
        <div class="consent" data-error="false">
          <input id="lf-consent" name="consent" type="checkbox" />
          <label for="lf-consent">Ik ga akkoord dat mijn gegevens worden gebruikt om over mijn vraag contact met me op te nemen, conform het <a href="${esc(privacy)}" target="_blank" rel="noopener">privacybeleid</a>. <span class="req">*</span></label>
        </div>
      </div>
      <div class="form-foot">
        <button class="btn btn-primary" type="submit" id="lead-submit">${esc(button)} <span class="arrow">→</span></button>
        <span class="form-status" id="lead-status"></span>
      </div>
    </form>`;
  $("#lead-form", fb).addEventListener("submit", (e) => onSoftLeadSubmit(e, result));
}

function onSoftLeadSubmit(e, result) {
  e.preventDefault();
  const form = e.currentTarget;
  const status = $("#lead-status");
  const data = {
    name: ($("#lf-name", form)?.value || "").trim(),
    organisation: ($("#lf-org", form)?.value || "").trim(),
    email: ($("#lf-email", form)?.value || "").trim(),
    question: ($("#lf-question", form)?.value || "").trim(),
    consent: $("#lf-consent", form)?.checked || false,
  };

  form.querySelectorAll("[data-error]").forEach((f) => (f.dataset.error = "false"));
  form.querySelectorAll(".err").forEach((s) => (s.textContent = ""));
  status.className = "form-status"; status.textContent = "";

  const errs = {};
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Vul een geldig e-mailadres in.";
  if (!data.consent) errs.consent = "Even akkoord geven om het advies te ontvangen.";
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

  const payload = {
    scan_id: CFG.scan_id, scan_title: CFG.title, audience: CFG.audience || null,
    total_score: result.total, verdict_label: result.verdict.label,
    dimensions: result.dimensions, answers: result.detail,
    lead: { name: data.name || "", organisation: data.organisation || "", email: data.email, phone: "", question: data.question || "", consent: true },
    meta: { url: location.href, referrer: document.referrer || null, user_agent: navigator.userAgent, submitted_at_client: new Date().toISOString() },
  };
  const btn = $("#lead-submit"); btn.disabled = true;
  status.textContent = "Versturen…";
  fetch(RUNTIME.WORKER_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    .then((res) => { if (!res.ok) throw new Error("HTTP " + res.status); renderThanks(result); })
    .catch((err) => { btn.disabled = false; status.classList.add("error"); status.textContent = "Versturen mislukte. Probeer het zo nog eens."; console.error("Lead submit error:", err); });
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
  try { registry = (await importWithRetry("../scans/registry.js")).SCANS; } catch { /* registry optioneel */ }

  // Demand-led volgorde: de sectoren waar de organische vraag zit (groothandel,
  // retail) staan vooraan; maakindustrie blijft volwaardig aanwezig als scan.
  const order = ["erp-scan-groothandel", "erp-scan-retail", "erp-scan-maakindustrie"];
  const scans = [...registry].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  const sectorCards = scans.map((s) => `
    <a class="scan-tile" href="${esc(s.path || "/?scan=" + s.id)}">
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.audience || "")}</p>
      <span class="go">Start de scan →</span>
    </a>`).join("");

  app.replaceChildren(el(`<div class="landing">
    <section class="hero">
      <div class="hero-inner">
        <span class="eyebrow">Gratis ERP-scan</span>
        <h1 class="hero-title">Hoe futureproof is jouw ERP-systeem?</h1>
        <p class="lede hero-lede">Groothandel, retail of maakindustrie: je ERP-systeem bepaalt hoeveel marge, tijd en groei je laat liggen. Doe de gratis ERP-scan en zie binnen 3 minuten waar je systeem je remt, welke processen je kunt automatiseren en waar de snelste winst zit.</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#kies-scan">Start je ERP-scan <span class="arrow">↓</span></a>
          <a class="btn btn-ghost" href="/info/processen-automatiseren">Processen automatiseren?</a>
        </div>
        <div class="hero-stats">
          <div><b>~3 min</b><span>tot je persoonlijke ERP-diagnose</span></div>
          <div><b>gratis</b><span>direct inzicht, geen verkooppraatje</span></div>
          <div><b>0 drempel</b><span>geen inloggen — meteen starten</span></div>
        </div>
      </div>
    </section>

    <section class="home-steps" id="kies-scan">
      <h2>Doe de scan voor jouw sector</h2>
      <p class="lede">Elke scan is toegespitst op de processen, marges en systemen van jouw sector. Kies je sector en start direct — je krijgt meteen je diagnose.</p>
      <div class="scan-list" style="margin-top:22px">${sectorCards}</div>
    </section>

    <section class="home-steps">
      <h2>Zo werkt de ERP-scan</h2>
      <ol class="step-cards">
        <li class="step-card"><span class="sc-n">1</span><h3>Beantwoord 11 vragen</h3><p>Over je strategie, techniek, data en processen — in zo'n 3 minuten, zonder inloggen.</p></li>
        <li class="step-card"><span class="sc-n">2</span><h3>Krijg direct je diagnose</h3><p>Een score per as en een helder totaalbeeld van hoe futureproof je ERP-systeem is.</p></li>
        <li class="step-card"><span class="sc-n">3</span><h3>Werk je actieplan af</h3><p>Concrete vervolgstappen op volgorde van impact — je begint bij je grootste kans.</p></li>
      </ol>
    </section>

    <section class="home-explainer">
      <h2>Waar loopt jouw groei vast?</h2>
      <p class="lede">Herken je een van deze knelpunten? Lees hoe je ze aanpakt — met je ERP-systeem als motor.</p>
      <div class="related-list" style="margin-top:18px">
        <a class="related-link" href="/info/processen-automatiseren">Bedrijfsprocessen automatiseren <span aria-hidden="true">→</span></a>
        <a class="related-link" href="/info/systeemintegratie">ERP koppelen &amp; systemen integreren <span aria-hidden="true">→</span></a>
        <a class="related-link" href="/info/dashboards-kpi">ERP met KPI-dashboards <span aria-hidden="true">→</span></a>
        <a class="related-link" href="/info/schalen-zonder-chaos">Schalen zonder chaos <span aria-hidden="true">→</span></a>
        <a class="related-link" href="/info/welke-erp-past-bij-productie">Welke ERP past bij productie? <span aria-hidden="true">→</span></a>
        <a class="related-link" href="/info/s4hana">SAP ECC → S/4HANA <span aria-hidden="true">→</span></a>
        <a class="related-link" href="/info/wat-is-erp">Wat is een ERP-systeem? <span aria-hidden="true">→</span></a>
      </div>
    </section>

    <p class="kennis-cta">Liever eerst inlezen? Bekijk de <a href="/info">kennisbank met feiten &amp; inzichten over ERP →</a></p>
  </div>`));
}

// ── 6b. Kennisbank: index + artikelen ───────────────────────────────────────
async function renderInfoIndex() {
  setHeaderMeta("");
  document.title = "Kennisbank — ERP Scan";
  let registry = [];
  try { registry = (await importWithRetry("../pages/registry.js")).PAGES; } catch { /* registry optioneel */ }
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
  if (s.type === "callout") {
    const v = s.variant ? ` callout--${esc(s.variant)}` : "";
    return `<aside class="callout${v}">${s.title ? `<h3>${esc(s.title)}</h3>` : ""}<p>${esc(s.body)}</p></aside>`;
  }
  if (s.type === "quote") {
    return `<figure class="pullquote"><blockquote>${esc(s.body)}</blockquote>${s.cite ? `<figcaption>${esc(s.cite)}</figcaption>` : ""}</figure>`;
  }
  if (s.type === "steps") {
    const items = (s.items || []).map((it, i) =>
      `<li class="step"><span class="step-n">${i + 1}</span><div><h3>${esc(it.title)}</h3><p>${esc(it.body)}</p></div></li>`).join("");
    return `<section class="steps-block">${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}<ol class="steps">${items}</ol></section>`;
  }
  if (s.type === "checklist") {
    const items = (s.items || []).map((it) => `<li>${esc(typeof it === "string" ? it : (it.body || it.title))}</li>`).join("");
    return `<section class="checklist-block">${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}<ul class="checklist">${items}</ul></section>`;
  }
  if (s.type === "table") {
    const head = (s.headers || []).map((h) => `<th>${esc(h)}</th>`).join("");
    const rows = (s.rows || []).map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("");
    return `<section class="table-block">${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}<div class="table-wrap"><table class="cmp">${head ? `<thead><tr>${head}</tr></thead>` : ""}<tbody>${rows}</tbody></table></div></section>`;
  }
  if (s.type === "related") {
    const items = (s.items || []).map((it) => `<a class="related-link" href="${esc(it.href)}">${esc(it.label)} <span aria-hidden="true">→</span></a>`).join("");
    return `<section class="related-block">${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}<div class="related-list">${items}</div></section>`;
  }
  if (s.type === "faq") {
    const items = (s.items || []).map((it) =>
      `<div class="faq-item"><h3>${esc(it.q)}</h3><p>${esc(it.a)}</p></div>`).join("");
    return `<section class="faq-block">${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}<div class="faq-list">${items}</div></section>`;
  }
  return "";
}

function renderArticle(cfg) {
  setHeaderMeta("");
  // Elke sectie krijgt een anker-id, zodat de inhoudsopgave ernaar kan linken.
  const sections = (cfg.sections || []).map((s, i) =>
    `<div class="sec-anchor" id="sec-${i}">${renderSection(s)}</div>`).join("");

  // Optionele inhoudsopgave, opgebouwd uit de sectiekoppen (cfg.toc === true).
  const tocItems = (cfg.sections || []).map((s, i) => (s.heading ? { i, label: s.heading } : null)).filter(Boolean);
  const toc = (cfg.toc && tocItems.length)
    ? `<nav class="toc" aria-label="In dit artikel"><p class="toc-title">In dit artikel</p>
        <ol>${tocItems.map((t) => `<li><a href="#sec-${t.i}">${esc(t.label)}</a></li>`).join("")}</ol></nav>`
    : "";

  const meta = (cfg.date || cfg.readingTime)
    ? `<p class="article-meta">${[cfg.date, cfg.readingTime].filter(Boolean).map(esc).join(" · ")}</p>` : "";

  // Afsluiting: inline lead-formulier (cfg.leadForm) of anders de klassieke CTA-knop.
  const ending = cfg.leadForm
    ? articleLeadFormHtml(cfg)
    : (cfg.cta ? `
    <div class="article-cta card">
      <div>
        <h2>${esc(cfg.cta.heading || "Benieuwd hoe jij ervoor staat?")}</h2>
        <p>${esc(cfg.cta.body || "")}</p>
      </div>
      <a class="btn btn-primary" href="${esc(cfg.cta.href || "/")}">${esc(cfg.cta.label || "Doe de scan")} <span class="arrow">→</span></a>
    </div>` : "");

  const sources = Array.isArray(cfg.sources) && cfg.sources.length
    ? `<aside class="sources"><h3>Bronnen &amp; verantwoording</h3><ul>${cfg.sources.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></aside>` : "";

  app.replaceChildren(el(`<article class="article">
    <a class="back-link" href="${esc(cfg.backHref || "/info")}">${esc(cfg.backLabel || "← Kennisbank")}</a>
    <span class="eyebrow">${esc(cfg.eyebrow || "Kennis")}</span>
    <h1>${esc(cfg.title)}</h1>
    ${meta}
    ${cfg.intro ? `<p class="lede">${esc(cfg.intro)}</p>` : ""}
    ${toc}
    ${sections}
    ${ending}
    ${sources}
  </article>`));
  if (cfg.leadForm) wireArticleLead(cfg);
  window.scrollTo({ top: 0, behavior: "auto" });
}

// ── Inline lead-formulier onderaan een artikel ("Vraag een specialist") ──────
// Additief: stuurt naar dezelfde lead-pijplijn (/api/lead) als de scan, maar
// zonder scan-uitslag. Alleen actief als het artikel een cfg.leadForm heeft.
function articleLeadFormHtml(cfg) {
  const L = cfg.leadForm || {};
  const privacy = L.privacy_url || DEFAULT_PRIVACY_URL;
  return `<section class="lead card article-lead" id="article-lead">
    <span class="eyebrow">${esc(L.eyebrow || "Persoonlijk advies")}</span>
    <h2>${esc(L.heading || "Vraag een specialist")}</h2>
    ${L.sub ? `<p class="lede">${esc(L.sub)}</p>` : ""}
    <form id="article-lead-form" novalidate>
      <div class="form-grid">
        <div class="field" data-error="false">
          <label for="al-name">Naam <span class="req">*</span></label>
          <input id="al-name" name="name" type="text" autocomplete="name" placeholder="Voor- en achternaam" />
          <span class="err" data-for="name"></span>
        </div>
        <div class="field" data-error="false">
          <label for="al-email">Zakelijk e-mailadres <span class="req">*</span></label>
          <input id="al-email" name="email" type="email" autocomplete="email" placeholder="naam@bedrijf.nl" />
          <span class="err" data-for="email"></span>
        </div>
        <div class="field span-2" data-error="false">
          <label for="al-phone">Telefoon <span class="optional">(optioneel)</span></label>
          <input id="al-phone" name="phone" type="tel" autocomplete="tel" placeholder="+31 …" />
        </div>
        <div class="field span-2" data-error="false">
          <label for="al-question">${esc(L.question_label || "Wat speelt er?")} <span class="req">*</span></label>
          <textarea id="al-question" name="question" rows="3" placeholder="${esc(L.question_placeholder || "Beschrijf je situatie in een paar zinnen.")}"></textarea>
          <span class="err" data-for="question"></span>
        </div>
        <div class="consent" data-error="false">
          <input id="al-consent" name="consent" type="checkbox" />
          <label for="al-consent">Ik ga akkoord dat mijn gegevens worden gebruikt om over mijn vraag contact met me op te nemen, conform het <a href="${esc(privacy)}" target="_blank" rel="noopener">privacybeleid</a>. <span class="req">*</span></label>
        </div>
      </div>
      <div class="form-foot">
        <button class="btn btn-primary" type="submit" id="al-submit">${esc(L.button || "Stuur mijn vraag")} <span class="arrow">→</span></button>
        <span class="form-status" id="al-status"></span>
      </div>
      ${L.note ? `<p class="lead-note">${esc(L.note)}</p>` : ""}
    </form>
  </section>`;
}

function wireArticleLead(cfg) {
  const form = $("#article-lead-form");
  if (form) form.addEventListener("submit", (e) => onArticleLeadSubmit(e, cfg));
}

async function onArticleLeadSubmit(e, cfg) {
  e.preventDefault();
  const form = e.currentTarget;
  const status = $("#al-status");
  const data = {
    name: ($("#al-name", form)?.value || "").trim(),
    email: ($("#al-email", form)?.value || "").trim(),
    phone: ($("#al-phone", form)?.value || "").trim(),
    question: ($("#al-question", form)?.value || "").trim(),
    consent: $("#al-consent", form)?.checked || false,
  };

  form.querySelectorAll("[data-error]").forEach((f) => (f.dataset.error = "false"));
  form.querySelectorAll(".err").forEach((s) => (s.textContent = ""));
  status.className = "form-status"; status.textContent = "";

  const errs = {};
  if (!data.name || data.name.length < 2) errs.name = "Vul je naam in.";
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Vul een geldig e-mailadres in.";
  if (!data.question || data.question.length < 5) errs.question = "Beschrijf kort je vraag of situatie.";
  if (!data.consent) errs.consent = "Akkoord is verplicht.";
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

  const L = cfg.leadForm || {};
  const payload = {
    scan_id: `artikel:${cfg.page_id || "onbekend"}`,
    scan_title: `Gids: ${cfg.title}`,
    lead: { name: data.name, organisation: "", email: data.email, phone: data.phone, question: data.question, consent: true },
    meta: { url: location.href, referrer: document.referrer || null, user_agent: navigator.userAgent, submitted_at_client: new Date().toISOString() },
  };

  const btn = $("#al-submit"); btn.disabled = true;
  status.textContent = "Versturen…";
  try {
    const res = await fetch(RUNTIME.WORKER_ENDPOINT, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const sec = $("#article-lead");
    if (sec) sec.innerHTML = `<div class="thanks" style="padding:22px 0">
      <div class="check" aria-hidden="true">✓</div>
      <h2>${esc(L.thanks_heading || "Bedankt — je vraag is verstuurd")}</h2>
      <p class="lede" style="margin-inline:auto">${esc(L.thanks_sub || "Een specialist neemt binnen één werkdag contact met je op.")}</p>
    </div>`;
  } catch (err) {
    btn.disabled = false;
    status.classList.add("error");
    status.textContent = "Versturen mislukte. Probeer het zo nog eens of mail ons direct.";
    console.error("Article lead submit error:", err);
  }
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
  try { mod = await importWithRetry(`../scans/${scanId}.js`); }
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
  try { mod = await importWithRetry(`../pages/${id}.js`); }
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

// Markeer een geslaagde start zodat het vangnet in index.html weet dat de app
// daadwerkelijk iets heeft gerenderd (en dus niet hoeft te herladen).
boot()
  .then(() => { window.__APP_OK__ = true; })
  .catch((err) => {
    console.error("Boot mislukte:", err);
    window.__APP_OK__ = true; // laat het vangnet niet eindeloos herladen
    app.replaceChildren(el(`<section class="fatal" style="text-align:center">
      <h1>De pagina kon niet laden</h1>
      <p>Er ging iets mis bij het opstarten. Ververs de pagina om het opnieuw te proberen.</p>
      <p><button class="btn btn-primary" onclick="location.reload()">Opnieuw laden <span class="arrow">→</span></button></p>
    </section>`));
  });
