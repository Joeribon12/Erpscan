// ──────────────────────────────────────────────────────────────────────────
// RUNTIME CONFIG — globale instellingen die voor ALLE scans gelden.
// (Per-scan inhoud staat in /scans/<scan_id>.js — niet hier.)
// ──────────────────────────────────────────────────────────────────────────

export const RUNTIME = {
  // Endpoint dat leads ontvangt. De lead-API zit IN de site-Worker zelf
  // (src/worker.js), dus dit is een relatief pad op hetzelfde domein —
  // geen aparte URL en geen CORS nodig.
  WORKER_ENDPOINT: "/api/lead",

  // Standaardscan als er geen pad/queryparam is opgegeven (de root "/").
  DEFAULT_SCAN: "algemeen",

  // Drempels voor het adviesniveau PER DIMENSIE (op een schaal van 0–100%).
  //   < LOW           -> "low"  (zwak  -> meest urgente advies)
  //   LOW .. MID       -> "mid"  (gemiddeld)
  //   >= MID          -> "high" (sterk -> verfijnend advies)
  DIMENSION_LEVELS: { low: 40, mid: 70 },

  // Telt de score-animatie omhoog bij de onthulling (ms voor de volledige telling).
  REVEAL_DURATION_MS: 1100,
};

// Vaste fallback-link voor het privacybeleid wanneer een scan er zelf geen opgeeft.
export const DEFAULT_PRIVACY_URL = "/info/privacy"; // privacyverklaring (zie public/pages/privacy.js)

// ──────────────────────────────────────────────────────────────────────────
// PROFIELVRAGEN — verschijnen in ELKE scan (stap 1, vóór de scanvragen).
// Tellen NIET mee in de score; dienen om de lead te kwalificeren. Pas je ze
// hier aan, dan veranderen ze meteen in alle scans.
//   type "select" -> keuzelijst   |   type "slider" -> schuifbalk (steps[])
// ──────────────────────────────────────────────────────────────────────────
export const PROFILE = {
  heading: "Over je organisatie",
  sub: "Drie korte vragen zodat we je advies op jouw situatie kunnen afstemmen.",
  fields: [
    {
      id: "erp",
      type: "select",
      label: "Welk ERP gebruik je momenteel?",
      required: true,
      options: [
        "SAP S/4HANA", "SAP ECC", "Microsoft Dynamics 365", "Oracle (NetSuite / Fusion)",
        "Exact", "AFAS", "Unit4", "Infor", "Anders", "Geen / weet ik niet",
      ],
    },
    {
      id: "omzet",
      type: "slider",
      label: "Jaaromzet",
      steps: ["< €1 mln", "€1–10 mln", "€10–50 mln", "€50–250 mln", "€250 mln – €1 mld", "> €1 mld"],
      default: 2,
    },
    {
      id: "fte",
      type: "slider",
      label: "Aantal werknemers / gebruikers",
      steps: ["1–50", "50–250", "250–1.000", "1.000–5.000", "> 5.000"],
      default: 1,
    },
  ],
};
