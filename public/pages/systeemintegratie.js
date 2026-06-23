// ARTIKEL: systeemintegratie — "Systemen koppelen met API's"
// Layout: prose → table → callout → facts → related → cta
export default {
  page_id: "systeemintegratie",
  title: "Systemen koppelen: slim integreren met API's",
  eyebrow: "Kennisbank · Integratie",
  backHref: "/info", backLabel: "← Kennisbank",
  intro: "De meeste waarde lekt niet weg ín je systemen, maar ertússen. Het slim koppelen van systemen zorgt dat data automatisch en betrouwbaar doorstroomt — goede systeemintegratie is de ruggengraat van een modern ERP-landschap.",

  sections: [
    {
      type: "prose",
      heading: "Waarom integratie zo bepalend is",
      body: "Een ERP-systeem staat zelden alleen: er hangen webshops, MES, WMS, CRM en tools van leveranciers en klanten aan. Hoe je deze systemen koppelt, bepaalt of je organisatie soepel draait of vastloopt op handwerk en fouten. Je ERP koppelen met je webshop is bijvoorbeeld een klassieker waar veel waarde — of juist frustratie — zit.",
    },
    {
      type: "table",
      heading: "Drie manieren om te koppelen",
      headers: ["Aanpak", "Kenmerk", "Geschikt voor"],
      rows: [
        ["Point-to-point", "Directe koppeling tussen 2 systemen", "Enkele, simpele verbindingen"],
        ["Handmatig / export", "Overtypen of bestandsuitwisseling", "Tijdelijk — schaalt en faalt slecht"],
        ["Integratielaag / API's", "Herbruikbaar, gemonitord, event-driven", "Een groeiend, betrouwbaar landschap"],
      ],
    },
    {
      type: "callout",
      title: "Van fragiel naar robuust",
      body: "Veel point-to-point koppelingen worden samen een onontwarbare kluwen. ERP-integratie met API's via een integratielaag — herbruikbaar en gemonitord — maakt je landschap onderhoudbaar én uitbreidbaar.",
    },
    {
      type: "facts",
      heading: "Kenmerken van goede integratie",
      items: [
        { title: "Gestandaardiseerd", body: "Herbruikbare API's in plaats van telkens een nieuwe maatwerkkoppeling." },
        { title: "Gemonitord", body: "Je ziet direct wanneer een koppeling stokt, in plaats van pas als de klant belt." },
        { title: "Event-driven", body: "Data stroomt realtime door op het moment dat er iets gebeurt." },
      ],
    },
    {
      type: "related",
      heading: "Lees ook",
      items: [
        { label: "Bedrijfsprocessen automatiseren", href: "/info/processen-automatiseren" },
        { label: "Datakwaliteit verbeteren", href: "/info/datakwaliteit" },
        { label: "ERP-scan groothandel & distributie", href: "/erp-scan-groothandel" },
      ],
    },
  ],

  cta: {
    heading: "Hoe goed zijn jouw systemen gekoppeld?",
    body: "Data & integratie is een kern-as in de gratis ERP-scan. Ontdek waar koppelingen je nu remmen.",
    label: "Doe de ERP-scan", href: "/",
  },
  sources: ["Algemene uitleg van integratiepatronen."],
};
