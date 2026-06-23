// ARTIKEL: datakwaliteit — "Datakwaliteit verbeteren"
// Layout: stats → prose → checklist → callout → related → cta
export default {
  page_id: "datakwaliteit",
  title: "Datakwaliteit verbeteren: het fundament onder groei en AI",
  eyebrow: "Kennisbank · Data",
  backHref: "/info", backLabel: "← Kennisbank",
  intro: "Rapportages die niet kloppen, discussies over 'welk cijfer waar is', AI-projecten die stranden: vaak ligt de oorzaak bij datakwaliteit. Je datakwaliteit verbeteren is het stille fundament onder elke verbetering in je ERP-systeem — en de basis om je data op orde te krijgen voor AI.",

  sections: [
    {
      type: "stats",
      heading: "Waarom data zo bepalend is",
      items: [
        { value: "elke as", label: "rapportage, automatisering én AI leunt op je data", note: "" },
        { value: "1 bron", label: "van waarheid voorkomt eindeloze cijferdiscussies", note: "" },
        { value: "vooraf", label: "datahygiëne is de grootste succesfactor van migraties", note: "" },
      ],
    },
    {
      type: "prose",
      heading: "Wat is master data management?",
      body: "Master data management (MDM) gaat over het centraal en consistent beheren van je kerngegevens: klanten, artikelen, leveranciers, grootboek. Met heldere definities en duidelijk eigenaarschap voorkom je dubbele en tegenstrijdige data — de basis voor betrouwbare informatie en voor data die op orde is voor AI.",
    },
    {
      type: "checklist",
      heading: "Zo ga je je datakwaliteit verbeteren",
      items: [
        "Bepaal per kerndomein één centrale definitie en eigenaar",
        "Ruim dubbele en verouderde records op",
        "Stel validatieregels in bij de bron, niet achteraf",
        "Monitor datakwaliteit structureel, niet eenmalig",
        "Maak datakwaliteit een vaste verantwoordelijkheid, geen project",
      ],
    },
    {
      type: "callout",
      title: "Data is geen IT-feestje",
      body: "Datakwaliteit is een samenspel van business en IT. De business kent de betekenis, IT regelt de borging. Zonder eigenaarschap in de business zakt elke opschoning weer in.",
    },
    {
      type: "related",
      heading: "Lees ook",
      items: [
        { label: "AI toepassen in je bedrijf", href: "/info/ai-in-je-bedrijf" },
        { label: "Realtime inzicht: dashboards & KPI's", href: "/info/dashboards-kpi" },
        { label: "ERP-systeem optimaliseren", href: "/info/optimaliseren" },
      ],
    },
  ],

  cta: {
    heading: "Hoe sterk is jouw datafundament?",
    body: "Data & integratie is een kern-as in de gratis ERP-scan. Ontdek waar je data je nu remt.",
    label: "Doe de ERP-scan", href: "/",
  },
  sources: ["Algemene uitleg; richtcijfers zijn indicatief."],
};
