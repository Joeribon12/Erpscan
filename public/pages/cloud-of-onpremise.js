// ARTIKEL: cloud-of-onpremise — "ERP in de cloud of on-premise?"
// Layout: prose → table → facts → callout → related → cta
export default {
  page_id: "cloud-of-onpremise",
  title: "ERP in de cloud of on-premise: wat kies je?",
  eyebrow: "Kennisbank · Cloud",
  backHref: "/info", backLabel: "← Kennisbank",
  intro: "Cloud-ERP of on-premise? Het is een van de belangrijkste keuzes bij een nieuw of vernieuwd ERP-systeem. We zetten de cloud-ERP voordelen en nadelen tegenover die van on-premise ERP, zodat je een onderbouwde keuze maakt.",

  sections: [
    {
      type: "prose",
      heading: "Het korte antwoord",
      body: "De markt beweegt richting cloud-ERP, vanwege lagere beheerlast, continue updates en betere schaalbaarheid. On-premise ERP blijft relevant voor organisaties met zeer specifieke eisen rond maatwerk, data of regelgeving. De afweging cloud-ERP of on-premise hangt uiteindelijk af van jouw situatie.",
    },
    {
      type: "table",
      heading: "Cloud vs. on-premise in één oogopslag",
      headers: ["", "Cloud-ERP", "On-premise"],
      rows: [
        ["Updates", "Automatisch en continu", "Handmatig, per project"],
        ["Beheerlast", "Laag (door leverancier)", "Hoog (eigen team)"],
        ["Opstartkosten", "Lager, abonnementsmodel", "Hoger, eigen hardware"],
        ["Schaalbaarheid", "Direct mee te schalen", "Vereist extra capaciteit"],
        ["Maatwerk", "Bewust beperkt (clean core)", "Maximale vrijheid"],
        ["Innovatie (AI, etc.)", "Snel beschikbaar", "Afhankelijk van upgrades"],
      ],
    },
    {
      type: "facts",
      heading: "Cloud-ERP voordelen en nadelen afwegen",
      items: [
        { title: "Je maatwerkbehoefte", body: "Veel onmisbaar maatwerk? Dan vraagt cloud om een heroverweging richting clean core en side-by-side extensies." },
        { title: "Regelgeving & datalocatie", body: "Strenge eisen rond waar data staat, kunnen de keuze beïnvloeden — al biedt cloud hier steeds meer opties." },
        { title: "Je innovatietempo", body: "Wil je snel AI en nieuwe functionaliteit benutten? Cloud levert dat sneller." },
      ],
    },
    {
      type: "callout",
      title: "Tip",
      body: "De cloud-overstap is hét moment om je maatwerk af te bouwen en je processen te standaardiseren. Neem die kans mee in plaats van oude ballast te verhuizen.",
    },
    {
      type: "related",
      heading: "Verder lezen",
      items: [
        { label: "Wat is clean core?", href: "/info/clean-core" },
        { label: "SAP ECC naar S/4HANA", href: "/info/s4hana" },
        { label: "De business case voor een nieuw ERP-systeem", href: "/info/business-case-erp" },
      ],
    },
  ],

  cta: {
    heading: "Hoe actueel is jouw ERP-platform?",
    body: "Clean core & techniek is één van de assen in de gratis ERP-scan. Ontdek hoe futureproof je platform is.",
    label: "Doe de ERP-scan", href: "/erp-systeem-scan",
  },
  sources: ["Vergelijking is algemeen indicatief; de juiste keuze is situatieafhankelijk."],
};
