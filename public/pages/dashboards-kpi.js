// ARTIKEL: dashboards-kpi — "Realtime inzicht: dashboards & KPI's"
// Layout: stats → facts → prose → checklist → related → cta
export default {
  page_id: "dashboards-kpi",
  title: "Realtime inzicht: dashboards en KPI's die echt sturen",
  eyebrow: "Kennisbank · Inzicht & sturing",
  backHref: "/info", backLabel: "← Kennisbank",
  intro: "Je kunt niet verbeteren wat je niet ziet. Toch sturen veel organisaties nog op rapportages van vorige maand. Met realtime dashboards en de juiste KPI's stuur je vooruit in plaats van achteruit — en met process mining zie je bovendien hoe je processen écht lopen.",

  sections: [
    {
      type: "stats",
      heading: "Van achteraf naar realtime",
      items: [
        { value: "realtime", label: "sturen verslaat sturen op de maandafsluiting", note: "" },
        { value: "1 waarheid", label: "dashboards werken alleen op betrouwbare, eenduidige data", note: "" },
        { value: "< 7", label: "richtgetal: focus op een handvol KPI's, niet op honderd", note: "indicatief" },
      ],
    },
    {
      type: "facts",
      heading: "Wat maakt een KPI-dashboard bruikbaar?",
      items: [
        { title: "Gekoppeld aan een doel", body: "Een KPI zonder doel is een getal zonder richting. Verbind elke KPI aan een concreet bedrijfsdoel." },
        { title: "Beïnvloedbaar", body: "Meet iets waar je daadwerkelijk op kunt sturen, niet alleen iets dat leuk is om te weten." },
        { title: "Tijdig", body: "Hoe verser de data, hoe eerder je kunt bijsturen. Realtime verslaat retrospectief." },
      ],
    },
    {
      type: "prose",
      heading: "De rol van process mining",
      body: "Waar realtime dashboards laten zien wát er gebeurt, laat process mining zien hóé je processen echt verlopen — inclusief de omwegen en knelpunten die niemand had bedacht. Samen geven een KPI-dashboard en process mining een datagedreven basis om continu te verbeteren.",
    },
    {
      type: "checklist",
      heading: "Naar betere sturing",
      items: [
        "Kies een klein aantal KPI's die er echt toe doen",
        "Zorg eerst voor één betrouwbare databron",
        "Maak dashboards realtime in plaats van maandelijks",
        "Koppel inzicht aan actie: wie doet wat bij afwijking?",
      ],
    },
    {
      type: "related",
      heading: "Verder lezen",
      items: [
        { label: "Datakwaliteit verbeteren", href: "/info/datakwaliteit" },
        { label: "ERP-scan finance & control", href: "/erp-scan-finance" },
        { label: "ERP-systeem optimaliseren", href: "/info/optimaliseren" },
      ],
    },
  ],

  cta: {
    heading: "Hoeveel realtime inzicht heb jij?",
    body: "De gratis ERP-scan meet onder meer hoe goed jij stuurt op data. Ontdek je blinde vlekken.",
    label: "Doe de ERP-scan", href: "/erp-systeem-scan",
  },
  sources: ["Richtgetallen zijn indicatief."],
};
