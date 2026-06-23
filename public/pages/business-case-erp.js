// ARTIKEL: business-case-erp — "De business case voor een nieuw ERP-systeem"
// Layout: stats → facts → checklist → quote → related → cta
export default {
  page_id: "business-case-erp",
  title: "De business case voor een nieuw ERP-systeem",
  eyebrow: "Kennisbank · Strategie",
  backHref: "/info", backLabel: "← Kennisbank",
  intro: "Een nieuw ERP-systeem is een forse investering. Een sterke business case voor ERP maakt het verschil tussen een gedragen besluit en een eindeloze discussie. Zo bouw je 'm op — met baten die verder gaan dan kostenbesparing.",

  sections: [
    {
      type: "stats",
      heading: "Waar zit de waarde?",
      items: [
        { value: "tijd", label: "minder handwerk door automatisering en standaardisatie", note: "" },
        { value: "marge", label: "betere sturing op kosten, voorraad en processen", note: "" },
        { value: "risico", label: "lagere kans op uitval, fouten en compliance-issues", note: "" },
        { value: "groei", label: "schaalbaarheid om sneller op te schalen", note: "" },
      ],
    },
    {
      type: "facts",
      heading: "Kosten én baten in beeld",
      items: [
        { title: "Kijk verder dan licentiekosten", body: "De kosten van een nieuw ERP-systeem zijn meer dan licenties: reken implementatie, migratie, training en beheer mee — én de kosten van níéts doen (verouderd systeem, end-of-maintenance)." },
        { title: "Kwantificeer de baten", body: "Vertaal tijdwinst, foutreductie en betere sturing naar euro's; zo maak je de ROI van ERP concreet. Ook zachte baten (wendbaarheid) horen erbij." },
        { title: "Denk in scenario's", body: "Vergelijk vernieuwen met de standaard volgen versus blijven en het risico dragen." },
      ],
    },
    {
      type: "checklist",
      heading: "Onderdelen van een sterke business case",
      items: [
        "Heldere koppeling aan bedrijfsdoelen en KPI's",
        "Totale kosten (TCO), inclusief de kosten van niets doen",
        "Gekwantificeerde baten, hard én zacht",
        "Risico's en afhankelijkheden benoemd",
        "Een gefaseerd plan met meetbare mijlpalen",
      ],
    },
    {
      type: "quote",
      body: "De duurste optie is vaak niet investeren — een verouderd ERP-systeem rekent stilletjes elke dag af.",
    },
    {
      type: "related",
      heading: "Verder lezen",
      items: [
        { label: "ERP-implementatie: succesfactoren", href: "/info/erp-implementatie" },
        { label: "ERP in cijfers", href: "/info/erp-feiten" },
        { label: "SAP ECC naar S/4HANA", href: "/info/s4hana" },
      ],
    },
  ],

  cta: {
    heading: "Bouw je business case op feiten",
    body: "De gratis ERP-scan geeft een onafhankelijke nulmeting per as — een sterk startpunt voor je business case.",
    label: "Doe de ERP-scan", href: "/",
  },
  sources: ["Algemene uitleg; baten zijn situatieafhankelijk en indicatief."],
};
