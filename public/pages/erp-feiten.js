// ══════════════════════════════════════════════════════════════════════════
// ARTIKEL: erp-feiten — "ERP in cijfers"
// Pure data; gerenderd door de engine (renderArticle). Schema:
//   page_id, title, eyebrow, intro
//   sections[] : { type: "stats" | "facts" | "prose", heading?, items?/body }
//     stats item: { value, label, note? }
//     facts item: { title, body }
//     prose body: string | string[]
//   cta  : { heading, body, label, href }
//   sources[] : strings (bronverantwoording / disclaimer)
//
// LET OP: de getallen hieronder zijn INDICATIEF en illustratief bedoeld.
// Vervang ze door geverifieerde, gedateerde bronnen vóór publicatie.
// ══════════════════════════════════════════════════════════════════════════

export default {
  page_id: "erp-feiten",
  title: "ERP in cijfers: 10 feiten die je moet kennen",
  eyebrow: "Kennisbank · ERP-feiten",
  intro: "Je ERP is het kloppend hart van je organisatie — maar hoe staat het er eigenlijk voor in de markt? Een paar cijfers en feiten die laten zien waar de kansen (en risico's) liggen.",

  sections: [
    {
      type: "stats",
      heading: "De stand van zaken",
      items: [
        { value: "2027", label: "Einde mainstream-onderhoud SAP ECC", note: "Extended maintenance mogelijk tot 2030" },
        { value: "~70%", label: "van organisaties draait op of migreert naar cloud-ERP", note: "Indicatief — verifieer de bron" },
        { value: "1 op 2", label: "ERP-trajecten overschrijdt budget of planning", note: "Indicatief — verifieer de bron" },
        { value: "~30%", label: "van de ERP-functionaliteit wordt gemiddeld écht benut", note: "Indicatief — verifieer de bron" },
      ],
    },
    {
      type: "facts",
      heading: "Wat dit betekent",
      items: [
        { title: "Maatwerk is de stille kostenpost", body: "Hoe meer maatwerk in de kern, hoe duurder en risicovoller elke upgrade. 'Clean core' — de kern standaard houden en uitbreidingen loskoppelen — is daarom dé trend om wendbaar te blijven." },
        { title: "Data bepaalt je AI-snelheid", body: "AI-projecten stranden zelden op het model en bijna altijd op de data. Eén betrouwbare, gegovernde databron is de voorwaarde om AI-waarde te verzilveren." },
        { title: "Integratie is het echte werk", body: "De meeste waarde lekt weg tussen systemen, niet erin. Gestandaardiseerde, gemonitorde koppelingen leveren vaak meer op dan een nieuwe module." },
        { title: "Adoptie is geen IT-feestje", body: "De grootste faalfactor van ERP-trajecten is geen techniek maar verandering: processen en mensen die niet meegaan. Reken op net zoveel aandacht voor adoptie als voor implementatie." },
      ],
    },
  ],

  cta: {
    heading: "Benieuwd hoe futureproof jouw ERP is?",
    body: "Doe de gratis scan en krijg in ~3 minuten een concrete diagnose met verbeterpunten per as.",
    label: "Doe de ERP-scan",
    href: "/erp-systeem-scan",
  },

  sources: [
    "De cijfers op deze pagina zijn indicatief en illustratief bedoeld. Vervang ze door geverifieerde, gedateerde bronnen (bijv. SAP, Gartner, Panorama Consulting) vóór publicatie.",
    "SAP end-of-maintenance ECC: zie de officiële SAP-aankondiging.",
  ],
};
