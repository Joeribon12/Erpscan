// ──────────────────────────────────────────────────────────────────────────
// KENNISBANK-REGISTRY — voor de index op /info.
// De engine importeert een artikel direct op id (/pages/<id>.js); deze lijst
// is alleen voor de overzichtspagina.
//
// Nieuw artikel toevoegen: maak /pages/<id>.js én voeg hier één regel toe.
// ──────────────────────────────────────────────────────────────────────────

export const PAGES = [
  // De twee pillars bovenaan: hier zit de meeste organische vraag (koppelen
  // en automatiseren), dus krijgen ze de prominentste plek in de kennisbank.
  {
    id: "systeemintegratie",
    title: "ERP koppelen: de complete gids",
    teaser: "Vier koppelmanieren vergeleken, het juiste patroon per situatie, een stappenplan in 7 stappen en wat het realistisch kost.",
    path: "/info/systeemintegratie",
  },
  {
    id: "processen-automatiseren",
    title: "Bedrijfsprocessen automatiseren: het stappenplan",
    teaser: "Welke processen zich lenen voor automatisering (en welke niet), de drie niveaus, en de vijf fouten die het vaakst worden gemaakt.",
    path: "/info/processen-automatiseren",
  },
  {
    id: "productieproces-automatiseren",
    title: "Productieproces automatiseren: waar begin je op de werkvloer?",
    teaser: "Order-naar-planning, shopfloor-terugmelding, kwaliteitscontrole en voorraadtriggers — en waarom de productievloer weerbarstiger is dan kantoor.",
    path: "/info/productieproces-automatiseren",
  },
  {
    id: "inkoopproces-automatiseren",
    title: "Inkoopproces automatiseren: van aanvraag tot betaling",
    teaser: "Het volledige purchase-to-pay-traject, de 3-way match, en de vijf valkuilen die het resultaat opeten bij half automatiseren.",
    path: "/info/inkoopproces-automatiseren",
  },
  {
    id: "werkprocessen-automatiseren",
    title: "Werkprocessen automatiseren: ook zonder IT-afdeling",
    teaser: "Herken welk dagelijks werkproces kansrijk is, wat je met bestaande software al kunt, en hoe je met beperkt budget begint.",
    path: "/info/werkprocessen-automatiseren",
  },
  {
    id: "dashboards-kpi",
    title: "ERP met KPI-dashboards: realtime sturen",
    teaser: "Welke KPI's tellen per functiegebied, een stappenplan van rapport naar realtime sturing, en de rol van process mining.",
    path: "/info/dashboards-kpi",
  },
  {
    id: "welke-erp-past-bij-productie",
    title: "Welke ERP past bij productie?",
    teaser: "Keuzecriteria, een besliskader in 5 stappen en een eerlijke vergelijking van ERP-systemen voor de maakindustrie.",
    path: "/info/welke-erp-past-bij-productie",
  },
  {
    id: "wat-is-erp",
    title: "Wat is een ERP-systeem?",
    teaser: "ERP-betekenis, uitleg en voorbeelden zoals SAP ERP — in heldere taal.",
    path: "/info/wat-is-erp",
  },
  {
    id: "erp-feiten",
    title: "ERP in cijfers: 10 feiten die je moet kennen",
    teaser: "Van migratiedeadlines tot benutte functionaliteit — de stand van zaken op een rij.",
    path: "/info/erp-feiten",
  },
  {
    id: "optimaliseren",
    title: "7 hefbomen om je ERP te optimaliseren",
    teaser: "Waar zit de grootste winst? De zeven knoppen waaraan je echt kunt draaien.",
    path: "/info/optimaliseren",
  },
  {
    id: "s4hana",
    title: "SAP ECC → S/4HANA: de complete migratiegids",
    teaser: "De 2027-deadline, migratieroutes, RISE vs. GROW, kosten en een roadmap richting go-live.",
    path: "/info/s4hana",
  },
  {
    id: "ai-erp",
    title: "AI in je ERP: van hype naar waarde",
    teaser: "Welke use-cases leveren echt iets op — en wat heb je ervoor nodig?",
    path: "/info/ai-erp",
  },
  {
    id: "ai-in-je-bedrijf",
    title: "Hoe pas ik AI toe in mijn bedrijf?",
    teaser: "Een praktisch stappenplan: van één use-case naar structurele waarde.",
    path: "/info/ai-in-je-bedrijf",
  },
  {
    id: "schalen-zonder-chaos",
    title: "Hoe schaal ik makkelijker (zonder chaos)?",
    teaser: "Standaardiseren en automatiseren vóórdat het volume toeneemt.",
    path: "/info/schalen-zonder-chaos",
  },
  {
    id: "cloud-of-onpremise",
    title: "ERP in de cloud of on-premise?",
    teaser: "De verschillen op een rij, zodat je een onderbouwde keuze maakt.",
    path: "/info/cloud-of-onpremise",
  },
  {
    id: "datakwaliteit",
    title: "Datakwaliteit verbeteren",
    teaser: "Het stille fundament onder groei, rapportage en AI.",
    path: "/info/datakwaliteit",
  },
  {
    id: "clean-core",
    title: "Wat is clean core?",
    teaser: "Waarom een schone ERP-kern je wendbaar houdt bij elke upgrade.",
    path: "/info/clean-core",
  },
  {
    id: "erp-implementatie",
    title: "ERP-implementatie: succesfactoren & valkuilen",
    teaser: "De factoren die het verschil maken — techniek is zelden de bottleneck.",
    path: "/info/erp-implementatie",
  },
  {
    id: "business-case-erp",
    title: "De business case voor een nieuw ERP-systeem",
    teaser: "Bouw een sterke business case met baten verder dan kostenbesparing.",
    path: "/info/business-case-erp",
  },
];
