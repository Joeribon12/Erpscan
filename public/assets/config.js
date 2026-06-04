// ──────────────────────────────────────────────────────────────────────────
// RUNTIME CONFIG — globale instellingen die voor ALLE scans gelden.
// (Per-scan inhoud staat in /scans/<scan_id>.js — niet hier.)
// ──────────────────────────────────────────────────────────────────────────

export const RUNTIME = {
  // Endpoint van de Cloudflare Worker die leads ontvangt.
  // Na het deployen van de worker (zie /worker/README of de hoofd-README)
  // zet je hier de definitieve URL neer, bv.:
  //   "https://lead-capture.<jouw-subdomein>.workers.dev"
  WORKER_ENDPOINT: "https://lead-capture.example.workers.dev",

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
export const DEFAULT_PRIVACY_URL = "#privacy"; // placeholder — vervang door de echte privacy-URL
