// ══════════════════════════════════════════════════════════════════════════
// ARTIKEL (pillar): s4hana — "SAP ECC naar S/4HANA migreren"
// Diepe gids met inhoudsopgave (toc), kort-antwoord (callout-variant),
// vergelijkingstabellen, roadmap (steps), valkuilen (facts), FAQ en een
// inline lead-formulier (leadForm). Zelfde config-driven engine als de rest.
//
// LET OP: kosten, doorlooptijden en verdelingen zijn INDICATIEF (orde van
// grootte) en de onderhoudsdata moeten via de officiële SAP-bronnen worden
// geverifieerd vóór ze als hard feit worden gepresenteerd.
// ══════════════════════════════════════════════════════════════════════════

export default {
  page_id: "s4hana",
  title: "SAP ECC naar S/4HANA migreren: routes, kosten en roadmap",
  eyebrow: "Kennisbank · S/4HANA",
  readingTime: "8 min leestijd",
  date: "Laatst bijgewerkt: augustus 2026",
  toc: true,

  intro: "De overstap van SAP ECC naar S/4HANA is voor veel organisaties de grootste ERP-beslissing van het decennium. Met het einde van het mainstream-onderhoud op ECC in zicht draait het niet meer om óf je migreert, maar om wanneer en hoe. Deze gids zet de migratieroutes, de deployment-modellen, een realistisch kostenbeeld en een roadmap op een rij — zonder de hype.",

  sections: [
    {
      type: "callout",
      variant: "answer",
      title: "Kort antwoord",
      body: "Het mainstream-onderhoud op SAP ECC 6.0 eindigt eind 2027; tegen een premietoeslag loopt extended maintenance door tot eind 2030. De opvolger is S/4HANA, te draaien als on-premise, RISE with SAP (private cloud) of GROW with SAP (public cloud). Migreren kan via greenfield (opnieuw inrichten), brownfield (technische conversie) of bluefield (selectief). Reken voor een middelgrote organisatie op een traject van indicatief 18 tot 36 maanden. Een besluit in 2026 geeft nog comfortabele projectruimte; wie tot 2027 wacht, komt in de knel.",
    },
    {
      type: "stats",
      heading: "De harde data",
      items: [
        { value: "2027", label: "Einde mainstream-onderhoud SAP ECC 6.0", note: "Verifieer de exacte datum bij SAP" },
        { value: "2030", label: "Einde extended maintenance (premietoeslag)", note: "Daarna geen reguliere support meer" },
        { value: "18–36 mnd", label: "Typische doorlooptijd van een S/4HANA-traject", note: "Indicatief — sterk afhankelijk van scope" },
      ],
    },
    {
      type: "steps",
      heading: "Tijdlijn richting end-of-life",
      items: [
        { title: "2006 — SAP ERP 6.0 (later ECC)", body: "De release die bij veel organisaties nog draait, inmiddels met jaren aan opgebouwd maatwerk." },
        { title: "2015 — introductie S/4HANA", body: "De opvolger op het HANA-platform, met een vereenvoudigd datamodel en nieuwe mogelijkheden." },
        { title: "Eind 2027 — einde mainstream-onderhoud", body: "Vanaf dit punt geen reguliere doorontwikkeling meer op ECC; nieuwe functionaliteit verschijnt alleen op S/4HANA." },
        { title: "Eind 2030 — einde extended maintenance", body: "De uiterste horizon voor wie de premietoeslag betaalt. Daarna stapelen compliance- en beveiligingsrisico's zich op." },
      ],
    },
    {
      type: "table",
      heading: "Drie migratieroutes vergeleken",
      headers: ["Route", "Wat het is", "Wanneer kiezen", "Aandachtspunt"],
      rows: [
        ["Greenfield", "Nieuwe S/4HANA-inrichting; processen opnieuw ontworpen volgens de standaard", "Verouderde inrichting, veel maatwerk, behoefte aan echte procesvernieuwing", "Grootste verandertraject: change management en datamigratie"],
        ["Brownfield", "Technische conversie van je bestaande systeem, met behoud van historie en processen", "Inrichting is nog gezond, minimale verstoring gewenst, tijdsdruk hoog", "Je neemt bestaande technical debt mee naar het nieuwe platform"],
        ["Bluefield", "Selectieve datamigratie; herontwerpen waar het loont, meenemen wat waarde heeft", "Deels moderniseren, complex of multi-systeem-landschap, na een fusie/overname", "Vraagt meer regie en gespecialiseerde tooling of partnerexpertise"],
      ],
    },
    {
      type: "table",
      heading: "RISE, GROW of on-premise?",
      headers: ["Aspect", "On-premise", "RISE with SAP", "GROW with SAP"],
      rows: [
        ["Voor wie", "Bestaande klanten met een complexe stack", "Bestaande klanten die naar private cloud willen", "Nieuwe klanten met grotendeels standaard processen"],
        ["Maatwerk", "Volledig vrij", "Vrij, met eigen verantwoordelijkheid", "Beperkt tot het extensie-framework"],
        ["Updates", "Zelf gepland", "Zelf gepland binnen SAP-kaders", "Vaste cyclus, meermaals per jaar"],
        ["Infrastructuur", "Zelf of eigen hyperscaler-account", "Door SAP beheerd op een hyperscaler", "Door SAP beheerd, multi-tenant"],
        ["Contractvorm", "Licenties + onderhoud", "Abonnement (bundel)", "Abonnement (bundel)"],
      ],
    },
    {
      type: "facts",
      heading: "Waar zit het geld? De kostenopbouw",
      items: [
        { title: "Software of abonnement", body: "Licenties bij on-premise, of een vaste abonnementsprijs bij RISE en GROW. Een substantieel maar relatief voorspelbaar deel van het budget." },
        { title: "Implementatiepartner", body: "Meestal de grootste kostenpost: implementatie, datamigratie en integratie. De omvang hangt vooral af van je hoeveelheid maatwerk en integraties." },
        { title: "Eigen projectteam", body: "Business owners, key-users en change-agents die (deels) worden vrijgesteld. Structureel onderschat in de eerste begroting." },
        { title: "Infrastructuur en hosting", body: "Hoger bij on-premise, lager en meer voorspelbaar bij een cloud-model waar SAP het beheer doet." },
        { title: "Change en training", body: "Vaak te krap begroot, terwijl het een van de grootste oorzaken van moeizame go-lives is." },
        { title: "Nazorg (hypercare)", body: "De eerste maanden na go-live: stabiliseren, bijsturen en de organisatie laten wennen aan de nieuwe processen." },
      ],
    },
    {
      type: "steps",
      heading: "Roadmap richting go-live (indicatief)",
      items: [
        { title: "Fase 1 · Strategie en business case", body: "Readiness- en custom-code-analyse, scope bepalen, deployment-model kiezen en de business case rondmaken. Selecteer je implementatiepartner. Reken indicatief op de eerste zes maanden." },
        { title: "Fase 2 · Build en test", body: "Inrichten en bouwen volgens een gestructureerde methode (zoals SAP Activate), in iteraties met business-validatie. Plan meerdere testcycli, waaronder minimaal één eindgebruikers-acceptatietest." },
        { title: "Fase 3 · Cutover en hypercare", body: "Proefdraaien met mock-cutovers, dan het go-live-moment, gevolgd door een periode van intensieve nazorg. Sluit daarna het oude ECC-systeem af en stabiliseer de nieuwe processen." },
      ],
    },
    {
      type: "facts",
      heading: "Vijf valkuilen bij een S/4HANA-transitie",
      items: [
        { title: "De beslissing uitstellen", body: "Een gedegen traject duurt al gauw twee tot drie jaar. Wie pas laat begint, belandt na 2030 op extended maintenance — met extra kosten en zonder functionele innovatie." },
        { title: "Maatwerk onderschatten", body: "Jaren ECC betekent vaak veel Z-programma's en user-exits. Een custom-code-analyse toont de echte omvang; reken op een serieuze remediatie-inspanning." },
        { title: "Brownfield kiezen puur voor snelheid", body: "Brownfield is technisch sneller, maar lost geen procesproblemen op. Bij veel verouderde processen wordt het alsnog een gefaseerd herontwerp." },
        { title: "RISE als volledige outsourcing zien", body: "RISE is geen managed-services-contract. SAP beheert de infrastructuur en database; de applicatie, het maatwerk en de upgrade-besluiten blijven bij jou of je partner." },
        { title: "Datamigratie te laat plannen", body: "Schone mappings en data-opschoning kosten tijd. Begin er vroeg mee, niet pas halverwege het bouwtraject." },
      ],
    },
    {
      type: "faq",
      heading: "Veelgestelde vragen",
      items: [
        { q: "Wat gebeurt er als ik na 2030 nog op ECC draai?", a: "Reguliere support en beveiligingsupdates vervallen. Er blijven risico's op het gebied van compliance en kwetsbaarheden die zich opstapelen. Voor regelgevingsgevoelige sectoren is dat op termijn niet houdbaar." },
        { q: "Is brownfield altijd goedkoper dan greenfield?", a: "Niet automatisch. Brownfield is initieel goedkoper, maar als verouderde processen en maatwerk niet vooraf worden opgelost, lopen de kosten tijdens de uitvoering alsnog op. Bij veel achterstallige processen kan greenfield uiteindelijk voordeliger zijn." },
        { q: "Draait S/4HANA op een andere database dan HANA?", a: "Nee. S/4HANA draait uitsluitend op SAP HANA. Dat is een wezenlijk verschil met ECC, dat ook op andere databases kon draaien, en het heeft gevolgen voor je licentie- en infrastructuurkeuzes." },
        { q: "Wat is het verschil tussen RISE en GROW?", a: "RISE with SAP richt zich vooral op bestaande klanten die naar een private cloud willen met behoud van vrijheid in maatwerk. GROW with SAP is bedoeld voor nieuwe klanten in de public cloud, met grotendeels standaard processen en een vaste updatecyclus." },
        { q: "Hoe lang duurt een S/4HANA-migratie?", a: "Voor een middelgrote organisatie is 18 tot 36 maanden een realistische indicatie, afhankelijk van scope, hoeveelheid maatwerk en gekozen route. Grote, internationale landschappen lopen langer door." },
      ],
    },
    {
      type: "related",
      heading: "Lees ook",
      items: [
        { label: "Wat is clean core?", href: "/info/clean-core" },
        { label: "Welke ERP past bij productie?", href: "/info/welke-erp-past-bij-productie" },
        { label: "De business case voor een nieuw ERP-systeem", href: "/info/business-case-erp" },
      ],
    },
  ],

  leadForm: {
    eyebrow: "Vraag een specialist",
    heading: "Niet zeker wat dit voor jouw situatie betekent?",
    sub: "Beschrijf je situatie in een paar zinnen. Een onafhankelijke specialist met S/4HANA-ervaring reageert binnen één werkdag met een eerste inschatting — geen verkoopgesprek, geen verplichting.",
    question_label: "Wat speelt er?",
    question_placeholder: "Bijv. middelgroot productiebedrijf op SAP ECC, we twijfelen tussen brownfield en greenfield richting 2027.",
    button: "Stuur mijn vraag",
    note: "Geen nieuwsbrief, geen automatische follow-ups.",
    privacy_url: "/info/privacy",
    thanks_heading: "Bedankt — je vraag is verstuurd",
    thanks_sub: "Een specialist neemt binnen één werkdag contact met je op met een eerste inschatting.",
  },

  sources: [
    "Onderhoudsdata (einde mainstream-onderhoud eind 2027, extended maintenance tot eind 2030) op basis van de door SAP gecommuniceerde onderhoudstermijnen; verifieer de exacte data via de officiële SAP-bronnen vóór definitief gebruik.",
    "Kosten, doorlooptijden en kostenverdelingen zijn indicatief en bedoeld als orde van grootte; de werkelijke aanpak hangt af van scope, omvang en uitgangssituatie.",
  ],
};
