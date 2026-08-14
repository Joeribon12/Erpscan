// ══════════════════════════════════════════════════════════════════════════
// ARTIKEL (pillar): dashboards-kpi — "ERP met KPI-dashboards"
// Omgebouwd van kort artikel naar pillar (2026-08-14) na GSC-data: "erp met
// kpi dashboards" staat als dichtstbijzijnde pagina-1-kans (30 impr, pos ~21)
// — dichterbij dan groothandel/automatiseren stonden toen die pillar werden.
// Zelfde config-driven engine (toc, table, steps, faq, leadForm) als de
// andere pillars.
//
// Doelzoektermen (uit Search Console): "erp met kpi dashboards".
// Overige indicatieve cijfers/richtgetallen expliciet gemarkeerd.
// ══════════════════════════════════════════════════════════════════════════

export default {
  page_id: "dashboards-kpi",
  title: "ERP met KPI-dashboards: realtime sturen op de juiste cijfers",
  eyebrow: "Kennisbank · Inzicht & sturing",
  readingTime: "7 min leestijd",
  date: "Laatst bijgewerkt: augustus 2026",
  toc: true,
  backHref: "/info", backLabel: "← Kennisbank",

  intro: "Je kunt niet verbeteren wat je niet ziet. Toch sturen veel organisaties nog op rapportages van vorige maand, terwijl hun ERP-systeem de cijfers allang realtime in huis heeft. Een ERP met KPI-dashboards verandert dat: je stuurt vooruit in plaats van achteruit. Deze gids laat zien wat een goed dashboard onderscheidt van een kleurrijk overzicht, welke KPI's er echt toe doen per functiegebied, en hoe process mining laat zien hoe je processen écht lopen.",

  sections: [
    {
      type: "callout",
      variant: "answer",
      title: "Kort antwoord",
      body: "Een ERP met KPI-dashboards toont de belangrijkste stuurgetallen — voorraad, marge, doorlooptijd, leverbetrouwbaarheid — realtime in plaats van pas na de maandafsluiting. De meeste ERP-systemen kunnen dit al vanuit hun eigen data, zonder aparte BI-tool. De grootste hindernis is zelden techniek: het is één betrouwbare databron en een handvol KPI's die daadwerkelijk aan een beslissing gekoppeld zijn. Richtgetal: minder dan tien KPI's per rol werkt beter dan een dashboard met honderd cijfers waar niemand meer naar kijkt.",
    },
    {
      type: "prose",
      heading: "Van achteraf sturen naar realtime sturen",
      body: "In veel organisaties is het dashboard een export uit het ERP-systeem die iemand handmatig ververst, of een rapport dat pas na de maandafsluiting compleet is. Tegen de tijd dat een probleem zichtbaar wordt, is het al een week of maand oud — en de kans om bij te sturen is voorbij. Een ERP met ingebouwde KPI-dashboards draait die volgorde om: de data komt rechtstreeks uit de transacties die het systeem toch al vastlegt, dus het dashboard is nooit ouder dan de laatste boeking. Dat is geen extra project bovenop je ERP, maar het beter benutten van wat er al in staat.",
    },
    {
      type: "facts",
      heading: "Wat maakt een KPI-dashboard bruikbaar?",
      items: [
        { title: "Gekoppeld aan een beslissing", body: "Een KPI zonder beslissing eraan vast is een getal zonder richting. Vraag bij elke KPI: wie doet er iets anders van zodra dit cijfer verandert?" },
        { title: "Beïnvloedbaar door de kijker", body: "Meet iets waar de gebruiker van het dashboard ook daadwerkelijk invloed op heeft — niet alleen iets dat leuk is om te weten." },
        { title: "Eén bron, geen twee waarheden", body: "Zodra twee dashboards een ander getal tonen voor dezelfde KPI, verschuift de discussie van 'wat doen we eraan' naar 'welk cijfer klopt'. Dat kost meer tijd dan het dashboard oplevert." },
        { title: "Tijdig", body: "Hoe verser de data, hoe eerder je kunt bijsturen. Niet elke KPI hoeft realtime — voorraad en levertijd meestal wel, een kwartaaltrend niet." },
      ],
    },
    {
      type: "table",
      heading: "Voorbeeld-KPI's per functiegebied",
      headers: ["Functiegebied", "Veelgebruikte KPI's", "Waarom realtime helpt"],
      rows: [
        ["Voorraad & inkoop", "Voorraadrotatie, nee-verkoop, openstaande inkooporders", "Te laat besteld of te veel op voorraad kost direct marge"],
        ["Verkoop & marge", "Brutomarge per order/klant, orderdoorlooptijd, offerte-conversie", "Marge-erosie is pas te stoppen zodra je 'm ziet ontstaan, niet achteraf"],
        ["Productie", "OEE (beschikbaarheid × prestatie × kwaliteit), uitval, planning-adherentie", "Verstoringen op de vloer vragen om bijsturen binnen uren, niet weken"],
        ["Logistiek & magazijn", "Leverbetrouwbaarheid, pickfouten, doorlooptijd order-tot-verzending", "Klantbeloftes staan of vallen bij wat er nú in het magazijn gebeurt"],
        ["Finance", "DSO (debiteurentermijn), openstaande facturen, cash conversion cycle", "Vroege signalen voorkomen dat cashflow een verrassing wordt"],
      ],
    },
    {
      type: "steps",
      heading: "Stappenplan: van rapport naar realtime sturing",
      items: [
        { title: "1. Kies per rol een handvol KPI's", body: "Niet één dashboard voor iedereen, maar een klein, gericht setje per rol: inkoper, planner, magazijnchef, directie. Richtgetal: minder dan tien per rol." },
        { title: "2. Wijs één bron per KPI aan", body: "Bepaal welk systeem — meestal je ERP — de waarheid bevat voor elk cijfer. Zodra dat vaststaat, verdwijnt de discussie over welk getal klopt." },
        { title: "3. Koppel elke KPI aan een actie", body: "Schrijf bij elke KPI op: wat doen we als dit cijfer een grens overschrijdt, en wie is daarvoor verantwoordelijk? Zonder die koppeling blijft het een sierlijk plaatje." },
        { title: "4. Begin met wat je systeem al kan", body: "De meeste ERP-systemen hebben ingebouwde rapportage- of dashboardfunctionaliteit die nooit is ingericht. Kijk daar eerst voordat je een aparte BI-laag aanschaft." },
        { title: "5. Maak het realtime waar het telt", body: "Niet alles hoeft live te zijn. Voorraad en levertijd wel, een kwartaaltrend niet. Zet de investering in actualiteit waar de beslissing ook echt op wacht." },
        { title: "6. Herzie periodiek", body: "KPI's verouderen met je strategie. Een dashboard dat nooit wordt opgeschoond, groeit dicht met cijfers die niemand meer gebruikt — en verdringt zo de KPI's die er wél toe doen." },
      ],
    },
    {
      type: "prose",
      heading: "De rol van process mining",
      body: "Waar een KPI-dashboard laat zien wát er gebeurt — de uitkomst — laat process mining zien hóé je processen daar daadwerkelijk komen, op basis van de logdata die je ERP-systeem toch al vastlegt. Dat legt vaak omwegen en knelpunten bloot die niemand had bedacht: orders die telkens via een uitzonderingsroute lopen, goedkeuringen die blijven liggen, of een stap die op papier verplicht is maar in de praktijk wordt overgeslagen. Een dashboard vertelt je dát de doorlooptijd te lang is; process mining laat zien wáár in het proces die tijd precies weglekt. Samen vormen ze een datagedreven basis om processen niet incidenteel, maar continu te verbeteren.",
    },
    {
      type: "checklist",
      heading: "Naar betere sturing",
      items: [
        "Kies per rol een klein aantal KPI's die er echt toe doen",
        "Zorg eerst voor één betrouwbare databron per KPI",
        "Koppel elke KPI expliciet aan een beslissing en een eigenaar",
        "Maak dashboards realtime waar het verschil maakt, niet overal",
        "Benut eerst wat je ERP al aan rapportage in huis heeft",
        "Zet process mining in om te zien hóé processen echt lopen, niet alleen wát ze opleveren",
      ],
    },
    {
      type: "faq",
      heading: "Veelgestelde vragen over ERP met KPI-dashboards",
      items: [
        { q: "Wat is een ERP met KPI-dashboards?", a: "Een ERP-systeem dat de belangrijkste stuurgetallen — zoals voorraad, marge, doorlooptijd of leverbetrouwbaarheid — realtime toont op basis van de eigen transactiedata, in plaats van achteraf via een los rapport of export." },
        { q: "Heb ik een aparte BI-tool nodig voor KPI-dashboards?", a: "Niet per se. De meeste moderne ERP-systemen hebben ingebouwde dashboard- of rapportagefunctionaliteit die vaak nog niet volledig is ingericht. Een externe BI-laag wordt vooral zinvol bij data uit meerdere systemen tegelijk of geavanceerdere analyses." },
        { q: "Hoeveel KPI's hoort een dashboard te tonen?", a: "Minder dan je denkt. Een richtgetal dat vaak wordt gehanteerd is minder dan tien KPI's per rol. Meer cijfers verdrukken elkaar en maken het lastiger om te zien waar écht op gestuurd moet worden." },
        { q: "Wat is het verschil tussen een dashboard en process mining?", a: "Een dashboard toont uitkomsten: wát een KPI op dit moment is. Process mining reconstrueert uit logdata hóé een proces daadwerkelijk verloopt, inclusief omwegen en uitzonderingen. Ze vullen elkaar aan: het dashboard signaleert, process mining verklaart." },
        { q: "Waarom lopen dashboards vaak achter, ook al is de data er wel?", a: "Meestal niet door een technische beperking, maar omdat rapportage is ingericht als periodieke export in plaats van een live koppeling met de brondata. Vaak is de eerste stap simpelweg het herinrichten van bestaande rapportage, niet nieuwe software." },
      ],
    },
    {
      type: "related",
      heading: "Verder lezen",
      items: [
        { label: "Datakwaliteit verbeteren: master data als fundament", href: "/info/datakwaliteit" },
        { label: "ERP koppelen: de complete gids", href: "/info/systeemintegratie" },
        { label: "ERP-scan groothandel & distributie", href: "/erp-scan-groothandel" },
        { label: "7 hefbomen om je ERP te optimaliseren", href: "/info/optimaliseren" },
      ],
    },
  ],

  leadForm: {
    eyebrow: "Vraag een specialist",
    heading: "Hoeveel realtime inzicht heb jij eigenlijk?",
    sub: "Beschrijf in een paar zinnen op welke cijfers je nu te laat stuurt. Een onafhankelijke specialist reageert binnen één werkdag met een eerste inschatting — geen verkoopgesprek, geen verplichting.",
    question_label: "Waar loop je tegenaan?",
    question_placeholder: "Bijv. we zien voorraadproblemen pas bij de maandafsluiting, of ons dashboard toont andere cijfers dan de boekhouding.",
    button: "Stuur mijn vraag",
    note: "Geen nieuwsbrief, geen automatische follow-ups.",
    privacy_url: "/info/privacy",
    thanks_heading: "Bedankt — je vraag is verstuurd",
    thanks_sub: "Een specialist neemt binnen één werkdag contact met je op met een eerste inschatting.",
  },

  sources: ["Richtgetallen (aantal KPI's per rol, e.d.) zijn indicatief en bedoeld als vuistregel, geen harde norm."],
};
