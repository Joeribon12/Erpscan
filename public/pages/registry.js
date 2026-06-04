// ──────────────────────────────────────────────────────────────────────────
// KENNISBANK-REGISTRY — voor de index op /info.
// De engine importeert een artikel direct op id (/pages/<id>.js); deze lijst
// is alleen voor de overzichtspagina.
//
// Nieuw artikel toevoegen: maak /pages/<id>.js én voeg hier één regel toe.
// ──────────────────────────────────────────────────────────────────────────

export const PAGES = [
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
    title: "SAP ECC → S/4HANA: alles wat je moet weten",
    teaser: "De 2027-deadline, greenfield vs. brownfield en hoe je je voorbereidt.",
    path: "/info/s4hana",
  },
  {
    id: "ai-erp",
    title: "AI in je ERP: van hype naar waarde",
    teaser: "Welke use-cases leveren echt iets op — en wat heb je ervoor nodig?",
    path: "/info/ai-erp",
  },
];
