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
    sub: "Vraag je je af welke ERP bij jouw productie past? Deze gratis ERP-scan voor de maakindustrie meet in elf korte vragen hoe klaar je productiebedrijf is — van migratiestrategie en clean core tot data en productieprocessen. Zeker als je nog op SAP ECC draait en richting de S/4HANA-deadline van 2027 gaat, zie je direct waar je grootste keuze en risico ligt. Je krijgt meteen een diagnose met prioriteiten.",
    bullets: [
      "Concrete nulmeting van je ERP- en S/4HANA-gereedheid",
      "Zicht op je grootste keuze- en migratierisico's — vóórdat het 2027 is",
      "Toegespitst op ERP-software voor productiebedrijven, met een verbeterpunt per as",
    ],
  },

  dimensions: [
    { id: "strategie", label: "Strategie & migratiekoers", insight: {
      low: "Zonder concreet migratieplan tikt de klok richting 2027 in je nadeel — hier zit vaak het grootste risico.",
      mid: "De richting is helder; nu telt de uitvoering: een hard programma met planning en eigenaarschap.",
      high: "Sterke koers — je gebruikt de migratie als transformatiehefboom. Voorhoede." } },
    { id: "ai", label: "AI-readiness", insight: {
      low: "AI in productie nog geen thema. Predictive maintenance of forecasting is vaak de eerste use-case met echte waarde.",
      mid: "Er beweegt iets; het naar de werkvloer brengen is waar de uptime- en kwaliteitswinst zit.",
      high: "AI is al verweven in planning en onderhoud — dat zie je bij weinig productiebedrijven." } },
    { id: "cleancore", label: "Clean core & techniek", insight: {
      low: "Onbekend Z-maatwerk is dé valkuil van elke ECC-migratie: het maakt je overstap duur en risicovol.",
      mid: "Je kent je maatwerk — een goede basis om clean core leidend te maken in het ontwerp.",
      high: "Schone kern richting clean core; dat verlaagt je migratierisico en beheerlast fors." } },
    { id: "data", label: "Data & integratie", insight: {
      low: "Fragiele shopfloor-koppelingen en vervuilde stamdata migreren niet vanzelf schoon. Datahygiëne is de stilste succesfactor.",
      mid: "De richting klopt; koppelingen standaardiseren en ownership vastleggen maakt je migratie-ready.",
      high: "Sterk datafundament — shopfloor en ERP sturen op dezelfde realtime waarheid." } },
    { id: "schaal", label: "Schaalbaarheid & productieprocessen", insight: {
      low: "Werkarounds buiten het systeem migreren niet mee en groeien niet mee. Standaardiseren vóór de conversie is cruciaal.",
      mid: "De kern draait op standaard; uitzonderingen zijn nu je rem richting S/4.",
      high: "Schaalbare, gestandaardiseerde processen — klaar voor de best practices van S/4HANA." } },
    { id: "mensen", label: "Mensen & verandering", insight: {
      low: "Techniek is zelden de bottleneck bij een S/4-migratie — mensen en kennis wél. Hier struikelen de meeste programma's.",
      mid: "Je hebt betrokkenheid, maar kennisborging en eigenaarschap mogen steviger.",
      high: "Business-eigenaarschap en kennisborging staan — dat maakt je programma robuust." } },
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

    // Mensen & verandering — vaak de échte faalfactor bij een S/4-migratie.
    {
      id: "q11", dimension: "mensen",
      text: "Wie trekt de migratie straks inhoudelijk, en hoe geborgd is de kennis?",
      options: [
        { label: "Nog niemand aangewezen; kennis zit bij een paar mensen in het hoofd", score: 0 },
        { label: "IT trekt het, business schuift incidenteel aan", score: 1 },
        { label: "IT én business key-users zijn betrokken en (deels) vrijgemaakt", score: 2 },
        { label: "Programma met business-eigenaarschap en actieve kennisborging", score: 3 },
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
    mensen: {
      low:  { title: "Beleg eigenaarschap en borg kennis", body: "Techniek is zelden de faalfactor bij een S/4-migratie — mensen en kennis wél. Wijs nu een inhoudelijk trekker aan, betrek business key-users en borg de kennis die nu bij enkelen in het hoofd zit. Zonder dit fundament loopt elk programma vast, hoe goed de techniek ook is." },
      mid:  { title: "Versterk key-users en verandercapaciteit", body: "Er is betrokkenheid, maar het mag steviger. Maak key-users per proces (deels) vrij, leg eigenaarschap vast en investeer in verandermanagement, zodat de nieuwe manier van werken ook echt landt." },
      high: { title: "Houd kennis en eigenaarschap warm", body: "Mensen en eigenaarschap staan — een sterke basis. Borg dit met een vast opleidings- en kennisritme, zodat je na go-live niet afhankelijk bent van een handjevol specialisten." },
    },
  },

  verdicts: [
    { min: 0,  label: "Migratierisico: hoog",      summary: "De klok tikt richting 2027 en op meerdere assen ontbreekt nog een fundament. Juist hier zit de snelste winst: begin met koers, custom code en stamdata. Een gerichte readiness-sessie helpt prioriteren." },
    { min: 40, label: "Op weg, maar maak tempo",   summary: "De basis komt op gang, maar het migratiepotentieel is nog niet benut. Gerichte stappen op je zwakste assen verlagen het risico en maken de overstap naar S/4HANA beheersbaar." },
    { min: 70, label: "Goed op koers voor S/4HANA", summary: "Je staat er sterk voor. De winst zit nu in verfijning — clean core borgen, data realtime maken en AI-use-cases verzilveren bovenop een solide fundament." },
    { min: 85, label: "S/4HANA-ready koploper",    summary: "Je behoort tot de voorhoede van de maakindustrie en hebt ERP voor productiebedrijven echt op orde. Je fundament is schoon en schaalbaar; de focus verschuift naar transformatie en het uitnutten van data en AI op de werkvloer." },
  ],

  // Zelfvoorspelling op de intro; de kloof met de echte score wordt getoond.
  predict: {
    question: "Even gokken vóór je begint: hoe klaar zijn jullie voor S/4HANA, van 0 tot 100?",
    min_label: "Nog niets",
    max_label: "Migratie-ready",
  },

  // Archetype op basis van de zwakste as (of allStrong bij een topscore).
  archetypes: [
    { weakest: "strategie", label: "De Uitsteller",        tagline: "De klok tikt richting 2027 — je koers mag nu concreet worden." },
    { weakest: "ai",        label: "De Fundamentbouwer",   tagline: "Basis op orde; AI op de werkvloer laat je nog liggen." },
    { weakest: "cleancore", label: "De Maatwerk-erfgenaam", tagline: "Jaren ECC zit in je kern — dat is nu je grootste migratierisico." },
    { weakest: "data",      label: "De Data-opschoner",    tagline: "Schone stamdata is je stilste, grootste succesfactor." },
    { weakest: "schaal",    label: "De Workaround-koning",  tagline: "Buiten het systeem om werkt — tot de conversie. Standaardiseer eerst." },
    { weakest: "mensen",    label: "De Eenzame Trekker",   tagline: "De techniek kan kloppen, maar zonder eigenaarschap struikelt het." },
    { allStrong: true,      label: "De S/4-Koploper",      tagline: "Koers, kern, data én mensen op orde — jij hoort bij de voorhoede." },
  ],

  lead: {
    eyebrow: "Laatste stap",
    heading: "Ontvang je S/4HANA-gereedheidsrapport",
    sub: "We sturen je je diagnose plus concrete prioriteiten richting 2027. Een adviseur met maakindustrie-ervaring kijkt vrijblijvend mee.",
    privacy_url: "/info/privacy", // placeholder — vervang door de echte privacy-URL

    // ── Zachte lead na de feedback: vrijblijvend sparringsgesprek ──────────────
    // De engine toont dit aanbod (CFG.lead.soft_*) en benoemt automatisch de
    // zwakste as als gespreksaanleiding.
    soft_tag: "(vrijblijvend)",
    soft_heading: "Wil je je uitslag een keer bespreken?",
    soft_sub: "Wil je hier eens over in gesprek om je situatie duidelijker uit te leggen en scherper in beeld te krijgen? Laat je gegevens achter met je vraag — een specialist met maakindustrie-ervaring neemt vrijblijvend contact op om je grootste kans richting 2027 met je door te nemen.",
    soft_button: "Verstuur mijn vraag",
    soft_question_label: "Je vraag of situatie",
    soft_question_placeholder: "Bijv. waar je nu tegenaan loopt met SAP ECC, of wat je wilt bereiken richting S/4HANA.",

    thanks_heading: "Bedankt — we nemen contact op",
    thanks_sub: "Een specialist met maakindustrie-ervaring neemt binnen één werkdag contact op om je vraag en situatie met je door te nemen.",
  },
};
