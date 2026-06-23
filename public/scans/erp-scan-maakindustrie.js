// ══════════════════════════════════════════════════════════════════════════
// SCAN: maakindustrie — "Van SAP ECC naar S/4HANA"
// Doelgroep: IT- & operations-leiders in de maakindustrie die nog op SAP ECC
// draaien en voor de end-of-maintenance / S/4HANA-migratie staan.
//
// Zelfde schema en engine als de andere scans — alleen de INHOUD verschilt.
// Dit is precies de kernbelofte: nieuwe doelgroep = nieuwe config, geen code.
// ══════════════════════════════════════════════════════════════════════════

export default {
  scan_id: "erp-scan-maakindustrie",
  title: "Klaar voor de stap van SAP ECC naar S/4HANA?",
  eyebrow: "Maakindustrie · SAP ECC → S/4HANA",
  audience: "Voor IT- & operations-leiders in de maakindustrie",

  intro: {
    sub: "SAP's mainstream maintenance op ECC eindigt in 2027. Deze scan voor het ERP-systeem in de maakindustrie meet in tien vragen hoe klaar jouw productiebedrijf is voor de overstap van SAP ECC naar S/4HANA — van migratiestrategie tot clean core, data en productieprocessen. Je krijgt direct een diagnose met prioriteiten.",
    bullets: [
      "Concrete nulmeting van je S/4HANA-gereedheid",
      "Zicht op je grootste migratierisico's — vóórdat het 2027 is",
      "Toegespitst op ERP-software voor de maakindustrie, met een verbeterpunt per as",
    ],
  },

  dimensions: [
    { id: "strategie",  label: "Strategie & migratiekoers" },
    { id: "ai",         label: "AI-readiness" },
    { id: "cleancore",  label: "Clean core & techniek" },
    { id: "data",       label: "Data & integratie" },
    { id: "schaal",     label: "Schaalbaarheid & productieprocessen" },
  ],

  questions: [
    // Strategie & migratiekoers
    {
      id: "q1", dimension: "strategie",
      text: "Hoe concreet is jullie plan voor de overstap van ECC naar S/4HANA?",
      options: [
        { label: "We hebben nog geen plan en geen einddatum in beeld", score: 0 },
        { label: "We weten dat het moet, maar er ligt nog geen aanpak", score: 1 },
        { label: "Er ligt een businesscase en een gekozen scenario (greenfield/brownfield)", score: 2 },
        { label: "Gevalideerd programma met planning, budget en go-live richting 2027", score: 3 },
      ],
    },
    {
      id: "q2", dimension: "strategie",
      text: "Zien jullie de migratie als technische upgrade of als kans om processen te vernieuwen?",
      options: [
        { label: "Puur als verplichte technische upgrade", score: 0 },
        { label: "Vooral technisch, met wat procesverbetering als bijvangst", score: 1 },
        { label: "Bewuste mix: standaardiseren waar het kan, vernieuwen waar het loont", score: 2 },
        { label: "Als strategische transformatie van het operating model", score: 3 },
      ],
    },

    // AI-readiness
    {
      id: "q3", dimension: "ai",
      text: "Benutten jullie AI/voorspellende analyses in productie of supply chain?",
      options: [
        { label: "Nee, nog niet aan de orde", score: 0 },
        { label: "Losse pilots (bv. vraagvoorspelling), niet in productie", score: 1 },
        { label: "Live use-cases zoals predictive maintenance of forecasting", score: 2 },
        { label: "AI is verweven in planning, onderhoud en kwaliteit met meetbare waarde", score: 3 },
      ],
    },
    {
      id: "q4", dimension: "ai",
      text: "Is jullie productie- en stamdata geschikt om AI betrouwbaar te voeden?",
      options: [
        { label: "Data zit verspreid over ECC, MES en Excel; kwaliteit wisselt sterk", score: 0 },
        { label: "Kerndata bestaat, maar stuklijsten/routings zijn niet altijd actueel", score: 1 },
        { label: "Gecureerde stam- en productiedata met governance op kerndomeinen", score: 2 },
        { label: "Eén betrouwbare databron die productie-AI direct kan benutten", score: 3 },
      ],
    },

    // Clean core & techniek
    {
      id: "q5", dimension: "cleancore",
      text: "Hoeveel Z-maatwerk (custom ABAP) zit er in jullie ECC-kern?",
      options: [
        { label: "Zeer veel, deels ongedocumenteerd en bedrijfskritisch", score: 0 },
        { label: "Flink wat maatwerk; niemand kent meer de volledige omvang", score: 1 },
        { label: "In kaart gebracht; we weten wat mee moet en wat kan vervallen", score: 2 },
        { label: "Bewust afgebouwd richting clean core met side-by-side extensies", score: 3 },
      ],
    },
    {
      id: "q6", dimension: "cleancore",
      text: "Hoe goed kennen jullie de impact van de migratie op custom code en add-ons?",
      options: [
        { label: "Geen beeld; readiness-check is nog niet gedaan", score: 0 },
        { label: "Globaal idee, maar geen formele analyse", score: 1 },
        { label: "Readiness Check / custom code-analyse uitgevoerd", score: 2 },
        { label: "Volledige impactanalyse incl. remediatieplan per object", score: 3 },
      ],
    },

    // Data & integratie
    {
      id: "q7", dimension: "data",
      text: "Hoe is ECC gekoppeld aan jullie productievloer (MES/SCADA) en logistiek?",
      options: [
        { label: "Vooral handmatig en via fragiele point-to-point koppelingen", score: 0 },
        { label: "Diverse koppelingen, weinig overzicht of monitoring", score: 1 },
        { label: "Gestandaardiseerd via een integratielaag/API's", score: 2 },
        { label: "Event-driven en gemonitord; shopfloor en ERP realtime verbonden", score: 3 },
      ],
    },
    {
      id: "q8", dimension: "data",
      text: "Hoe schoon is jullie stamdata (materialen, stuklijsten, leveranciers) voor de migratie?",
      options: [
        { label: "Veel dubbele en verouderde records; geen opschoning gepland", score: 0 },
        { label: "We weten dat het moet, maar zijn nog niet begonnen", score: 1 },
        { label: "Opschoning en eigenaarschap op de belangrijkste domeinen geregeld", score: 2 },
        { label: "Actief MDM met kwaliteitsmonitoring; migratie-ready", score: 3 },
      ],
    },

    // Schaalbaarheid & productieprocessen
    {
      id: "q9", dimension: "schaal",
      text: "Hoeveel van jullie productie- en logistieke processen draaien op de SAP-standaard?",
      options: [
        { label: "Grotendeels op maatwerk en werkarounds buiten het systeem", score: 0 },
        { label: "Mix van standaard en veel uitzonderingen", score: 1 },
        { label: "Overwegend standaard, met bewuste uitzonderingen", score: 2 },
        { label: "Gestandaardiseerd en geautomatiseerd, klaar voor best practices in S/4", score: 3 },
      ],
    },
    {
      id: "q10", dimension: "schaal",
      text: "Hoeveel realtime inzicht hebben jullie in productieprestaties (OEE, doorlooptijd, voorraad)?",
      options: [
        { label: "Nauwelijks; sturen gebeurt achteraf op buikgevoel en Excel", score: 0 },
        { label: "Losse rapportages, geen actueel end-to-end beeld", score: 1 },
        { label: "Dashboards op de belangrijkste productie-KPI's", score: 2 },
        { label: "Realtime inzicht en process mining sturen continue verbetering", score: 3 },
      ],
    },
  ],

  advice: {
    strategie: {
      low:  { title: "Zet nu een migratiekoers uit", body: "Met de end-of-maintenance van ECC in 2027 is wachten het grootste risico. Start met een businesscase en kies bewust tussen greenfield (opnieuw inrichten) en brownfield (technische conversie). Hoe eerder de koers vaststaat, hoe meer ruimte je houdt voor een beheerste transitie in plaats van een gedwongen sprint." },
      mid:  { title: "Vertaal de koers naar een hard programma", body: "De richting is helder; nu telt de uitvoering. Maak van de businesscase een programma met planning, budget en eigenaarschap, en benut de migratie meteen om processen te standaardiseren — niet alleen om techniek te verversen." },
      high: { title: "Benut de migratie als transformatie", body: "Je staat er strategisch goed voor. Gebruik S/4HANA als hefboom voor je operating model: koppel de migratiedoelen aan groei- en margeverbetering en stuur er op board-niveau op." },
    },
    ai: {
      low:  { title: "Leg de basis voor productie-AI", body: "AI in productie begint bij betrouwbare data en één afgebakende use-case. Denk aan predictive maintenance op kritische machines of vraagvoorspelling. S/4HANA en embedded analytics maken dit straks veel toegankelijker — bereid de eerste use-case nu voor." },
      mid:  { title: "Breng pilots naar de werkvloer", body: "Er is beweging, maar de stap naar productie ontbreekt. Schaal een bewezen use-case op met eigenaarschap en monitoring, zodat AI structureel bijdraagt aan uptime, planning of kwaliteit." },
      high: { title: "Verweef AI in de keten", body: "AI levert al waarde op de vloer. Versterk governance en herbruikbaarheid en benut de embedded AI-capaciteiten van S/4HANA om planning, onderhoud en kwaliteit verder te verbinden." },
    },
    cleancore: {
      low:  { title: "Breng je Z-maatwerk in kaart", body: "Onbekend en omvangrijk maatwerk is dé valkuil van elke ECC-migratie. Voer een custom code-analyse uit, bepaal wat echt onderscheidend is, en plan de rest weg richting standaard of side-by-side extensies. Dit verlaagt je migratierisico én je toekomstige beheerlast drastisch." },
      mid:  { title: "Stuur bewust naar clean core", body: "Je kent je maatwerk — goede basis. Maak clean core nu leidend in het migratieontwerp: kern standaard, uitbreidingen losgekoppeld op de SAP BTP. Zo blijft S/4HANA wendbaar en upgradebaar." },
      high: { title: "Borg de clean core in S/4", body: "Je kern is al schoon. Houd dit vast met architectuurgovernance en een vast updateritme, zodat je na go-live wendbaar blijft en innovaties snel kunt adopteren." },
    },
    data: {
      low:  { title: "Begin nu met datamigratie-hygiëne", body: "Fragiele shopfloor-koppelingen en vervuilde stamdata maken een migratie duur en risicovol. Start met opschonen van materialen, stuklijsten en routings, en standaardiseer je integraties richting MES/WMS. Schone data is de stilste, maar grootste succesfactor van je S/4-project." },
      mid:  { title: "Standaardiseer koppelingen en ownership", body: "De richting klopt. Versterk de integratielaag richting de productievloer en leg eigenaarschap op stamdata vast, zodat data betrouwbaar de migratie in gaat en daarna herbruikbaar blijft." },
      high: { title: "Maak data realtime en betrouwbaar", body: "Je datafundament is sterk. Zet de stap naar event-driven, gemonitorde integratie tussen shopfloor en ERP, zodat productie en planning realtime op dezelfde waarheid sturen." },
    },
    schaal: {
      low:  { title: "Standaardiseer vóór de conversie", body: "Werkarounds buiten het systeem migreren niet mee — en groeien niet mee. Standaardiseer en automatiseer je productie- en logistieke kernprocessen, het liefst richting SAP best practices, zodat S/4HANA een schone start krijgt in plaats van oude problemen erft." },
      mid:  { title: "Ruim de uitzonderingen op", body: "De kern draait op standaard, maar uitzonderingen remmen. Pak de handmatige stappen en workarounds aan en maak processen meetbaar, zodat opschalen en de migratie beheersbaar blijven." },
      high: { title: "Stuur productie datagedreven", body: "Je processen zijn schaalbaar. Benut realtime inzicht en process mining om OEE en doorlooptijd continu te verbeteren en de best practices van S/4HANA maximaal te benutten." },
    },
  },

  verdicts: [
    { min: 0,  label: "Migratierisico: hoog",      summary: "De klok tikt richting 2027 en op meerdere assen ontbreekt nog een fundament. Juist hier zit de snelste winst: begin met koers, custom code en stamdata. Een gerichte readiness-sessie helpt prioriteren." },
    { min: 40, label: "Op weg, maar maak tempo",   summary: "De basis komt op gang, maar het migratiepotentieel is nog niet benut. Gerichte stappen op je zwakste assen verlagen het risico en maken de overstap naar S/4HANA beheersbaar." },
    { min: 70, label: "Goed op koers voor S/4HANA", summary: "Je staat er sterk voor. De winst zit nu in verfijning — clean core borgen, data realtime maken en AI-use-cases verzilveren bovenop een solide fundament." },
    { min: 85, label: "S/4HANA-ready koploper",    summary: "Je behoort tot de voorhoede van de maakindustrie en hebt ERP voor productiebedrijven echt op orde. Je fundament is schoon en schaalbaar; de focus verschuift naar transformatie en het uitnutten van data en AI op de werkvloer." },
  ],

  lead: {
    eyebrow: "Laatste stap",
    heading: "Ontvang je S/4HANA-gereedheidsrapport",
    sub: "We sturen je je diagnose plus concrete prioriteiten richting 2027. Een adviseur met maakindustrie-ervaring kijkt vrijblijvend mee.",
    privacy_url: "/info/privacy", // placeholder — vervang door de echte privacy-URL

    // ── Zachte lead na de feedback: vrijblijvend sparringsgesprek ──────────────
    // De engine toont dit aanbod (CFG.lead.soft_*) en benoemt automatisch de
    // zwakste as als gespreksaanleiding.
    soft_tag: "(vrijblijvend · 30 min)",
    soft_heading: "Spar 30 minuten met een S/4HANA-specialist uit de maakindustrie",
    soft_sub: "Geen verkooppraatje — een onafhankelijke blik op je grootste migratierisico richting 2027 en de eerste concrete stap die je kunt zetten. Laat je e-mail achter, dan plannen we een moment dat jou uitkomt.",
    soft_button: "Plan mijn sparringsgesprek",

    thanks_heading: "Bedankt — we nemen contact op om te plannen",
    thanks_sub: "Een specialist met maakindustrie-ervaring neemt binnen één werkdag contact op om je sparringsgesprek in te plannen.",
  },
};
