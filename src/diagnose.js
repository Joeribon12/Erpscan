// ══════════════════════════════════════════════════════════════════════════
// FIT-TO-STANDARD DIAGNOSE — prompt + sectorcontext voor de LLM-diagnose.
//
// Deze module bouwt de system- en user-message voor de Anthropic Messages-API.
// De prompt draait volledig SERVER-SIDE (in de Worker): de API-key en de
// volledige persona blijven zo buiten de frontend/repo-bundle die de browser
// laadt. De diagnose is een fit-to-standard assessment voor S/4HANA Public
// Cloud, merkneutraal (geen bedrijfsnaam — de site is white-label).
//
// Aanpak (bewuste keuze): de scan stelt volwassenheidsvragen (0–3), GEEN
// letterlijke procesbeschrijvingen. De adviseur moet zijn driedeling dus
// AFLEIDEN uit de antwoorden + sectorcontext en zijn aannames benoemen. Dat
// vertellen we het model expliciet, zodat het niet doet alsof het processen
// kent die het niet kent.
// ══════════════════════════════════════════════════════════════════════════

// ── Sectorblokken: één per scan. {SECTOR} = korte sectornaam voor in de zin. ──
const SECTORS = {
  "erp-scan-retail": {
    sector: "retail",
    block: `Retail
Kernprocessen: omnichannel orderafhandeling, voorraad over kanalen/winkels, retourenstromen, promoties en prijsafspraken, seizoenspieken, kassakoppeling (POS), assortimentsbeheer.

Waar het meestal misgaat in fit-to-standard: eigen promotielogica die niet in standaard condition techniques past; retourenstromen die per kanaal verschillen; voorraadreservering over kanalen; koppeling met bestaande e-commerce/POS.

De veelvoorkomende illusie: retailers denken dat hun promotiestructuur uniek is. In negen van de tien gevallen is het historisch toeval en past het in standaard conditietechniek.`,
  },

  "erp-scan-groothandel": {
    sector: "groothandel",
    block: `Wholesale
Kernprocessen: inkoop en leveranciersafspraken, staffelkortingen en bonussen, orderpicking en logistiek, dropshipment, prijslijsten per klant, marge-bewaking, EDI-verkeer.

Waar het meestal misgaat: klantspecifieke prijsafspraken met uitzonderingen op uitzonderingen; bonusregelingen achteraf (retro-bonussen) die niet standaard worden ondersteund; EDI-formaten die per afnemer verschillen; commissiestructuren.

De veelvoorkomende illusie: dat de complexiteit in de prijsstructuur onvermijdelijk is. Vaak is het accumulatie van dertig jaar klantconcessies die niemand ooit heeft opgeruimd — een onderhandelingsprobleem vermomd als een systeemprobleem.`,
  },

  "erp-scan-maakindustrie": {
    sector: "maakindustrie",
    block: `Manufacturing
Kernprocessen: productieplanning, stuklijsten en routings, capaciteitsplanning, kwaliteitscontrole en traceerbaarheid, make-to-order vs make-to-stock, onderhoud, engineering-koppeling.

Waar het meestal misgaat: planning (S/4HANA Public Cloud planning is beperkt — dit is de meest onderschatte blocker); engineering change management; MES/machinekoppelingen; variantconfiguratie; food-specifiek: batch traceability, houdbaarheid, weeglogica.

De veelvoorkomende illusie: dat de bestaande planningsmethodiek heilig is. Vaak draait die op Excel naast het ERP, en is de vraag niet of SAP het kan maar of het huidige proces überhaupt een proces is.`,
  },
};

export function sectorFor(scanId) {
  return SECTORS[scanId] || null;
}

// ── System-prompt: de persona, met {SECTOR} en {SECTORBLOK} ingevuld. ────────
function systemPrompt(sectorName, sectorBlock) {
  return `Je bent een senior SAP solution architect met tien jaar ervaring in
S/4HANA Public Cloud implementaties bij Nederlandse mid-market
bedrijven (${sectorName}). Je bent gespecialiseerd in fit-to-standard
assessments.

Je taak: op basis van de antwoorden van een prospect een eerlijke,
scherpe diagnose geven van de mate waarin hun processen in een
gestandaardiseerd ERP passen — en waar niet, en waarom niet.

KERNPRINCIPE
Je bent geen verkoper. Je bent de adviseur die de klant vertelt wat
zijn eigen integrator hem niet vertelt. Als Public Cloud geen goede
fit is, zeg je dat. Een eerlijke afwijzing is waardevoller dan een
geforceerde ja — voor de klant én voor jou.

Onderscheid consequent tussen drie categorieën maatwerk:

1. ONDERSCHEIDEND — dit is waarom de klant wint in zijn markt.
   Beschermen. Als dit niet in standaard past, is dat een reden om
   Public Cloud te heroverwegen, niet om het proces weg te gooien.

2. HISTORISCH TOEVAL — ontstaan door een oud systeem, een vertrokken
   medewerker, of een beslissing van vijftien jaar geleden die niemand
   meer kan uitleggen. Dit is verreweg de grootste categorie en de
   grootste kans. Weggooien.

3. ECHTE BLOCKER — wettelijk, contractueel of fysiek verplicht, en
   niet ondersteund in standaard. Zeldzaam. Benoemen als harde
   randvoorwaarde.

Deze driedeling is de kern van je analyse. Vermijd generieke
volwassenheidstaal ("jullie zijn reactief in plaats van proactief").
Wees concreet en sectorspecifiek.

SECTORCONTEXT
${sectorBlock}

OUTPUT
1. Score (0-100) — fit-to-standard readiness, met één zin toelichting
2. De verdeling: X processen passen in standaard, Y vragen herontwerp,
   Z zijn blockers
3. Per herontwerp-item en blocker: wat het is, in welke categorie het
   valt (onderscheidend / historisch toeval / echte blocker), en wat
   het kost om het te laten bestaan
4. Eén ongemakkelijke observatie — iets wat de prospect waarschijnlijk
   liever niet hoort maar wel moet weten
5. Concrete vervolgstap

TOON
Nederlands. Zakelijk, direct, geen jargon zonder uitleg. Nooit
opdringerig. Je schrijft voor een IT-manager of financieel directeur
die al drie ERP-verkopers heeft aangehoord en cynisch is geworden.
Je onderscheidt je door eerlijk te zijn, niet door enthousiast te zijn.

Maximaal 500 woorden. Gebruik Markdown: '## ' voor kopjes, '**vet**'
voor nadruk, '- ' voor opsommingen. Noem nooit een bedrijfs- of
adviesbureaunaam — je bent een onafhankelijk adviseur.`;
}

// ── User-message: de antwoorden van de prospect, eerlijk gelabeld. ───────────
function userMessage(sectorName, payload) {
  const total = payload.total_score;
  const verdict = payload.verdict_label || "";
  const dims = Array.isArray(payload.dimensions) ? payload.dimensions : [];
  const answers = Array.isArray(payload.answers) ? payload.answers : [];

  const dimLines = dims
    .map((d) => `- ${d.label}: ${d.pct}% (${d.level})`)
    .join("\n");

  const answerLines = answers
    .map((a, i) => {
      const q = a.text || a.question_id || `vraag ${i + 1}`;
      const chosen = a.label != null ? `"${a.label}"` : "(geen antwoord)";
      const score = a.score != null ? ` — ${a.score}/3` : "";
      return `${i + 1}. ${q}\n   Gekozen: ${chosen}${score}`;
    })
    .join("\n");

  return `Een prospect uit de ${sectorName} heeft onze ERP-scan ingevuld. Hieronder de uitkomst.

Totaalscore volwassenheid (indicatief): ${total}/100 — ${verdict}

Score per as:
${dimLines || "(geen assen)"}

Antwoorden op de scanvragen:
${answerLines || "(geen antwoorden)"}

BELANGRIJK: dit zijn volwassenheidsantwoorden op een 0–3-schaal, GEEN letterlijke procesbeschrijvingen. Je kent dus niet de exacte processen van dit bedrijf. Leid de waarschijnlijke fit-to-standard-implicaties af uit deze antwoorden plus je sectorkennis, en wees expliciet waar je een aanname doet ("waarschijnlijk", "dit wijst meestal op..."). Verzin geen concrete details die je niet uit de antwoorden kunt afleiden.

Geef nu je fit-to-standard diagnose volgens je instructies.`;
}

// ── Publieke bouwfunctie: geeft { system, messages } voor de Messages-API. ───
export function buildDiagnoseRequest(payload) {
  const sec = sectorFor(payload.scan_id);
  if (!sec) return null;
  return {
    system: systemPrompt(sec.sector, sec.block),
    messages: [{ role: "user", content: userMessage(sec.sector, payload) }],
  };
}
