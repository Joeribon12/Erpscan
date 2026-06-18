// ARTIKEL: clean-core — "Wat is clean core?"
// Layout: prose → facts → quote → checklist → related → cta
export default {
  page_id: "clean-core",
  title: "Wat is clean core (en waarom telt het voor je ERP-systeem)?",
  eyebrow: "Kennisbank · Techniek",
  backHref: "/info", backLabel: "← Kennisbank",
  intro: "Wat is clean core? Het is misschien wel de belangrijkste term in het moderne ERP-landschap. Het bepaalt of je ERP-systeem wendbaar blijft of juist vastloopt bij elke upgrade. We leggen het uit.",

  sections: [
    {
      type: "prose",
      heading: "De kern van clean core",
      body: [
        "Clean core betekent: houd de kern van je ERP-systeem zo standaard mogelijk, en bouw uitbreidingen los daarvan (side-by-side), in plaats van diep in de kern. Zo blijft je systeem upgradebaar en wendbaar. Wie clean core in SAP toepast, voegt maatwerk dus bewust buiten de standaard toe.",
        "Het tegenovergestelde — zwaar maatwerk in de kern — maakt elke upgrade duur, traag en risicovol. Veel organisaties zitten daardoor vast op een verouderde versie.",
      ],
    },
    {
      type: "facts",
      heading: "Waarom clean core loont",
      items: [
        { title: "Snellere upgrades", body: "Een schone kern update je met een vast ritme in plaats van met een pijnlijk project." },
        { title: "Snellere innovatie", body: "Nieuwe functionaliteit, zoals AI, adopteer je sneller als je kern niet vol zit met maatwerk." },
        { title: "Lagere beheerlast", body: "Minder maatwerk betekent minder dingen die kapot kunnen en onderhouden moeten worden." },
      ],
    },
    {
      type: "quote",
      body: "Elk stuk maatwerk in de kern is een lening die je met rente terugbetaalt bij elke volgende upgrade.",
    },
    {
      type: "checklist",
      heading: "Op weg naar het clean core-principe in S/4HANA",
      items: [
        "Breng je huidige maatwerk volledig in kaart",
        "Bepaal wat écht onderscheidend is — en wat niet",
        "Verplaats niet-onderscheidend maatwerk naar de standaard",
        "Bouw de rest side-by-side, losgekoppeld van de kern",
        "Maak clean core een expliciet architectuurprincipe",
      ],
    },
    {
      type: "related",
      heading: "Verder lezen",
      items: [
        { label: "SAP ECC naar S/4HANA", href: "/info/s4hana" },
        { label: "ERP in de cloud of on-premise?", href: "/info/cloud-of-onpremise" },
        { label: "ERP-scan voor de maakindustrie", href: "/erp-scan-maakindustrie" },
      ],
    },
  ],

  cta: {
    heading: "Hoe schoon is jouw ERP-kern?",
    body: "Clean core & techniek is een aparte as in de gratis ERP-scan. Ontdek hoe wendbaar je systeem is.",
    label: "Doe de ERP-scan", href: "/erp-systeem-scan",
  },
  sources: ["Algemene uitleg van het clean core-principe."],
};
