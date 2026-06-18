// ══════════════════════════════════════════════════════════════════════════
// ARTIKEL: s4hana — "SAP ECC → S/4HANA: alles wat je moet weten"
// Zelfde schema/engine als de overige kennisbank-pagina's.
// CTA verwijst naar de maakindustrie-scan (S/4HANA-gereedheid).
// ══════════════════════════════════════════════════════════════════════════

export default {
  page_id: "s4hana",
  title: "SAP ECC → S/4HANA: alles wat je moet weten",
  eyebrow: "Kennisbank · S/4HANA",
  intro: "De SAP ECC naar S/4HANA migratie is voor veel organisaties de grootste ERP-beslissing van het decennium. Met de S/4HANA 2027-deadline in zicht is de SAP S/4HANA overstap geen vraag van óf, maar van wanneer. Hier de feiten, de routes en hoe je je voorbereidt — zonder de hype.",

  sections: [
    {
      type: "stats",
      heading: "De feiten op een rij",
      items: [
        { value: "2027", label: "Einde mainstream-onderhoud SAP ECC", note: "Extended maintenance mogelijk tot 2030" },
        { value: "2", label: "hoofdroutes: greenfield (opnieuw) of brownfield (conversie)", note: "" },
        { value: "12–24 mnd", label: "typische doorlooptijd van een S/4HANA-programma", note: "Indicatief — sterk afhankelijk van scope" },
      ],
    },
    {
      type: "facts",
      heading: "Greenfield vs. brownfield (of bluefield)?",
      items: [
        { title: "Greenfield — opnieuw inrichten", body: "Je bouwt S/4HANA fris op volgens best practices. In de afweging greenfield vs. brownfield staat dit voor maximale procesvernieuwing en een schone start, maar een grotere verandering voor de organisatie. Ideaal als je huidige inrichting zwaar vervuild is." },
        { title: "Brownfield — technische conversie", body: "Je zet je bestaande ECC-systeem technisch om naar S/4HANA. Sneller en goedkoper, met behoud van historie en processen — maar je neemt ook bestaande ballast mee. Ideaal als je inrichting nog gezond is." },
        { title: "Bluefield — selectieve aanpak", body: "Een hybride: je migreert selectief data en processen en herontwerpt waar het loont. Combineert het beste van beide, maar vraagt meer regie en partnerexpertise." },
      ],
    },
    {
      type: "facts",
      heading: "Zo bereid je je voor",
      items: [
        { title: "Analyseer je custom code", body: "Onbekend en omvangrijk maatwerk is dé valkuil. Een readiness- en custom-code-analyse laat zien wat mee moet, wat kan vervallen en wat geremedieerd moet worden." },
        { title: "Schoon je stamdata op", body: "Vervuilde materialen, stuklijsten en debiteuren migreren niet vanzelf schoon. Datahygiëne vooraf is de stilste, maar grootste succesfactor." },
        { title: "Kies clean core als principe", body: "Houd de S/4HANA-kern standaard en bouw uitbreidingen los op de SAP BTP. Zo blijft je nieuwe platform wendbaar en upgradebaar." },
      ],
    },
    {
      type: "prose",
      heading: "Wachten is het grootste risico",
      body: "Hoe dichter je bij de einddatum komt, hoe schaarser de capaciteit en hoe groter de druk. Wie vroeg een koers bepaalt, houdt ruimte voor een beheerste transitie in plaats van een gedwongen sprint.",
    },
  ],

  cta: {
    heading: "Hoe S/4HANA-ready ben jij?",
    body: "De maakindustrie-scan meet in tien vragen je gereedheid — van migratiestrategie tot clean core, data en productieprocessen.",
    label: "Doe de S/4HANA-scan",
    href: "/erp-scan-maakindustrie",
  },

  sources: [
    "Doorlooptijden en routes zijn indicatief; de werkelijke aanpak hangt af van je situatie. Verifieer details en de SAP-onderhoudsdata via de officiële SAP-bronnen vóór publicatie.",
  ],
};
