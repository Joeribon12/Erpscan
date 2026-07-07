// ══════════════════════════════════════════════════════════════════════════
// ARTIKEL: welke-erp-past-bij-productie — DE pijler-gids voor de zoekvraag
// "welke ERP past bij productie / de maakindustrie".
//
// Doel: de meest complete, eerlijke Nederlandse pagina die die vraag beantwoordt,
// zodat hij bovenaan Google komt en de lezer daarna naar de maakindustrie-scan
// leidt. Zelfde schema/engine als de overige kennisbank-pagina's.
//
// Cijfers zijn INDICATIEF gemarkeerd — verifieer/brond vóór definitieve publicatie.
// ══════════════════════════════════════════════════════════════════════════

export default {
  page_id: "welke-erp-past-bij-productie",
  title: "Welke ERP past bij productie? Zo kies je het juiste ERP-systeem",
  eyebrow: "Kennisbank · ERP kiezen",
  intro:
    "Welke ERP past bij productie? Het eerlijke antwoord: dat hangt af van jouw productietype, omvang en groeiambitie — niet van welk merk het luidst roept. In deze gids lopen we langs de keuzecriteria die er in de maakindustrie écht toe doen (van MRP en planning tot stuklijsten, MES-koppeling en traceerbaarheid), een besliskader in vijf stappen en een eerlijke vergelijking van de bekendste ERP-systemen voor productiebedrijven. Aan het eind weet je waar jouw keuze op moet vallen.",

  sections: [
    {
      type: "prose",
      heading: "Kort antwoord: er is geen universeel 'beste' ERP voor productie",
      body: [
        "De ERP die perfect past bij een machinebouwer die op order engineert, is zelden dezelfde als die van een levensmiddelenproducent die in continue batches draait. De belangrijkste vraag is daarom niet \"welk ERP-systeem is het beste?\", maar \"welk ERP-systeem past bij mijn type productie?\".",
        "Bepaal eerst je productietype: discrete productie (assemblage van telbare producten zoals machines, apparaten of onderdelen) of procesindustrie (chemie, food, farma — waar je met recepten, batches en houdbaarheid werkt). En bepaal je ordervorm: make-to-stock, make-to-order, assemble-to-order of engineer-to-order. Die twee assen bepalen al 80% van je shortlist.",
      ],
    },
    {
      type: "facts",
      heading: "Wat maakt een ERP voor productie anders?",
      items: [
        { title: "MRP & productieplanning", body: "Een productie-ERP rekent materiaalbehoefte (MRP) en capaciteit door: wat moet ik wanneer inkopen en produceren om levertijden te halen? Dit is de motor van elk maakbedrijf — een generiek ERP zonder sterke planning valt hier al af." },
        { title: "Stuklijsten & routings (BOM)", body: "Meerlaagse stuklijsten, varianten en bewerkingsroutings zijn de kern van je product. Het systeem moet versiebeheer, revisies en configureerbare producten aankunnen zonder dat het in Excel-workarounds ontaardt." },
        { title: "Shopfloor- & MES-integratie", body: "De ERP moet betrouwbaar koppelen met de werkvloer (MES/SCADA, machines, PLC's) zodat terugmeldingen, uren en voorraad realtime kloppen — niet pas de dag erna." },
        { title: "Traceerbaarheid & kwaliteit", body: "Batch- en serienummers, lot-tracking en kwaliteitscontroles zijn in food, farma en high-tech geen luxe maar wettelijke eis. Toets of dit standaard in het systeem zit." },
        { title: "Kostprijs & marge per order", body: "Goede productie-ERP laat zien wat een order écht kost (materiaal, uren, machinetijd, uitval), zodat je op marge kunt sturen in plaats van op onderbuikgevoel." },
        { title: "Voorraad & supply chain", body: "Van grondstof tot gereed product: meerdere magazijnen, consignatie, EDI met leveranciers en inzicht in doorlooptijden horen erbij als je keten complexer wordt." },
      ],
    },
    {
      type: "steps",
      heading: "In 5 stappen naar de ERP die bij jouw productie past",
      items: [
        { title: "Breng je productietype en processen in kaart", body: "Discreet of proces? Make-to-stock of engineer-to-order? Beschrijf je waardestroom van offerte tot levering. Dit is de meetlat waar elk systeem langs moet." },
        { title: "Maak een must-have vs. nice-to-have lijst", body: "Onderscheid keihard wat je nodig hebt (bv. lot-tracking, variantconfiguratie, MES-koppeling) van wat prettig is. Zo voorkom je dat een demo je verblindt met functies die je nooit gebruikt." },
        { title: "Kies bewust cloud of on-premise", body: "Cloud-ERP geeft snellere updates en minder beheer; on-premise geeft meer controle. Voor de meeste productiebedrijven is de richting inmiddels cloud — maar weeg het af tegen je IT-capaciteit en integraties." },
        { title: "Bepaal je houding over standaard vs. maatwerk", body: "Maatwerk lost vandaag een probleem op en maakt elke toekomstige upgrade duur. Kies zoveel mogelijk voor de standaard (het clean core-principe) en houd uitbreidingen losgekoppeld." },
        { title: "Toets de leverancier én de implementatiepartner", body: "Het systeem is de helft; de partner die het invoert bepaalt of het slaagt. Vraag naar referenties in jóuw sector, niet naar algemene klantlogo's." },
      ],
    },
    {
      type: "table",
      heading: "ERP-systemen voor productie, eerlijk vergeleken",
      headers: ["ERP-systeem", "Past goed bij", "Sterk in", "Aandachtspunt"],
      rows: [
        ["SAP S/4HANA", "Middelgrote tot grote productiebedrijven, internationaal", "Diepe productie- en supply-chainfunctionaliteit, schaalbaarheid, ecosysteem", "Vraagt discipline (clean core) en een goede partner; overkill voor het kleine mkb"],
        ["Microsoft Dynamics 365", "Mkb tot middelgroot, sterke Microsoft-omgeving", "Integratie met Office/Power Platform, gebruiksgemak, flexibiliteit", "Diepe productieplanning soms via add-ons; functionaliteit kan versnipperen"],
        ["Infor CloudSuite Industrial", "Specifieke maakindustrie (machinebouw, discrete productie)", "Branchespecifieke functies out-of-the-box, sterk in complexe productie", "Kleiner ecosysteem en partnernetwerk in Nederland"],
        ["Oracle NetSuite", "Groeiend mkb en scale-ups, cloud-first", "Snel live, sterk financieel en internationaal, echte cloud", "Zware, diepe maakprocessen kunnen tegen grenzen aanlopen"],
        ["Exact / AFAS / Ridder", "Nederlands mkb met overzichtelijke productie", "Lage drempel, Nederlandse support, goede prijs-kwaliteit", "Minder geschikt naarmate productie en internationale keten complexer worden"],
      ],
    },
    {
      type: "callout",
      title: "Draai je al op SAP ECC? Dan is 'welke ERP' vooral een migratievraag",
      body: "Voor veel productiebedrijven is de echte keuze niet een compleet nieuw merk, maar de overstap van SAP ECC naar S/4HANA vóór het einde van het mainstream-onderhoud in 2027. Dan gaat het om greenfield vs. brownfield, je custom code en je stamdata — geen leverancierskeuze maar een migratiestrategie.",
    },
    {
      type: "checklist",
      heading: "Checklist: must-haves voor een productie-ERP",
      items: [
        "Sterke MRP- en capaciteitsplanning die jouw ordervorm ondersteunt",
        "Meerlaagse stuklijsten, routings en (indien nodig) variantconfiguratie",
        "Betrouwbare koppeling met de werkvloer (MES/SCADA) en machines",
        "Batch- en serienummer-traceerbaarheid en kwaliteitscontrole",
        "Realtime kostprijs- en margeberekening per order",
        "Schaalbaarheid naar meerdere vestigingen, talen en valuta",
        "Zoveel mogelijk standaardfunctionaliteit, zo min mogelijk maatwerk",
        "Een implementatiepartner met aantoonbare ervaring in jouw sector",
      ],
    },
    {
      type: "prose",
      heading: "De grootste valkuil: kiezen op functielijstje in plaats van op fit",
      body: [
        "Bijna elk modern ERP-systeem kan op papier alles. Het verschil zit in hoe goed het past bij jóuw manier van produceren, hoeveel maatwerk je nodig denkt te hebben, en of de partner je proces begrijpt. Een systeem dat 90% standaard past, wint het bijna altijd van een systeem dat 100% kan maar dat je met maatwerk moet dwingen.",
        "Begin daarom niet bij de leverancier, maar bij je eigen processen en data. Weet je waar je nu staat — welke processen op de standaard draaien, hoe schoon je stamdata is en hoe klaar je bent voor de cloud — dan wordt de ERP-keuze een logische uitkomst in plaats van een gok.",
      ],
    },
    {
      type: "related",
      heading: "Verder lezen",
      items: [
        { label: "SAP ECC → S/4HANA: alles wat je moet weten", href: "/info/s4hana" },
        { label: "Cloud-ERP of on-premise: voordelen en nadelen", href: "/info/cloud-of-onpremise" },
        { label: "Wat is clean core? Maatwerk afbouwen in SAP & S/4HANA", href: "/info/clean-core" },
        { label: "De business case voor een nieuw ERP-systeem", href: "/info/business-case-erp" },
        { label: "ERP-implementatie: succesfactoren en valkuilen", href: "/info/erp-implementatie" },
      ],
    },
  ],

  cta: {
    heading: "Welke ERP-keuze past bij jóuw productie?",
    body: "Doe de gratis ERP-scan voor de maakindustrie. In tien vragen zie je hoe klaar je processen, data en systeem zijn — en waar je grootste keuze of risico ligt.",
    label: "Doe de ERP-scan voor productie",
    href: "/erp-scan-maakindustrie",
  },

  sources: [
    "Deze gids beschrijft algemene selectiecriteria en marktposities; de juiste keuze hangt altijd af van je eigen situatie.",
    "De vergelijking van ERP-systemen is een indicatieve momentopname en geen advies of rangorde. Verifieer functionaliteit, prijzen en geschiktheid rechtstreeks bij de leveranciers vóór een beslissing.",
  ],
};
