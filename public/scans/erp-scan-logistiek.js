// ══════════════════════════════════════════════════════════════════════════
// SCAN: logistiek — "Transport & logistiek / supply chain"
// Doelgroep: IT-, supply chain- & operations-leiders in logistiek.
// ══════════════════════════════════════════════════════════════════════════

export default {
  scan_id: "erp-scan-logistiek",
  title: "Supply chain op koers? Scan je ERP-landschap",
  eyebrow: "Transport & logistiek",
  audience: "Voor IT-, supply chain- & operations-leiders",

  intro: {
    sub: "Krappe marges, hoge servicedruk en een keten die realtime moet draaien: in logistiek telt elke schakel. Deze scan meet in tien vragen hoe sterk jouw ERP-landschap de keten ondersteunt — van strategie tot WMS/TMS-integratie, data en volumeschaalbaarheid. Je krijgt direct een diagnose met prioriteiten.",
    bullets: [
      "Nulmeting van je supply-chain-volwassenheid",
      "Zie waar planning, visibility of koppelingen je remmen",
      "Concreet verbeterpunt per as, toegespitst op logistiek",
    ],
  },

  dimensions: [
    { id: "strategie",  label: "Strategie & ketenkoers" },
    { id: "ai",         label: "AI-readiness" },
    { id: "cleancore",  label: "Clean core & techniek" },
    { id: "data",       label: "Data & integratie (WMS, TMS)" },
    { id: "schaal",     label: "Schaalbaarheid & ketenprocessen" },
  ],

  questions: [
    {
      id: "q1", dimension: "strategie",
      text: "Is jullie ERP-roadmap gekoppeld aan doelen rond servicelevel, kosten en duurzaamheid?",
      options: [
        { label: "Nee, er is geen expliciete roadmap", score: 0 },
        { label: "Een IT-roadmap, los van operatie en commercie", score: 1 },
        { label: "Roadmap afgestemd met supply chain en operatie", score: 2 },
        { label: "Meetbaar verbonden aan service-, kosten- en CO2-KPI's", score: 3 },
      ],
    },
    {
      id: "q2", dimension: "strategie",
      text: "Hoe worden grote ERP- en supply-chain-investeringen besloten?",
      options: [
        { label: "Ad hoc, gedreven door operationele incidenten", score: 0 },
        { label: "IT beslist, business wordt geïnformeerd", score: 1 },
        { label: "Gedeeld IT/business met een vast ritme", score: 2 },
        { label: "Vanuit een keten- en kostenstrategie op directieniveau", score: 3 },
      ],
    },
    {
      id: "q3", dimension: "ai",
      text: "Benutten jullie AI voor route-optimalisatie, vraagvoorspelling of planning?",
      options: [
        { label: "Nee, nog niet aan de orde", score: 0 },
        { label: "Losse pilots, niet in productie", score: 1 },
        { label: "Eerste use-cases live (bv. forecasting of routeplanning)", score: 2 },
        { label: "AI stuurt planning, route en capaciteit met meetbare waarde", score: 3 },
      ],
    },
    {
      id: "q4", dimension: "ai",
      text: "Is jullie order-, planning- en trackingdata geschikt om AI te voeden?",
      options: [
        { label: "Data zit versnipperd over systemen en partners", score: 0 },
        { label: "Kerndata bestaat, maar kwaliteit en koppeling wisselen", score: 1 },
        { label: "Gecureerde keten-data met governance", score: 2 },
        { label: "Eén betrouwbare databron die planning en optimalisatie voedt", score: 3 },
      ],
    },
    {
      id: "q5", dimension: "cleancore",
      text: "Hoeveel maatwerk zit er in jullie ERP-kern?",
      options: [
        { label: "Zwaar gecustomiseerd; upgrades zijn pijnlijk", score: 0 },
        { label: "Veel maatwerk, deels ongedocumenteerd", score: 1 },
        { label: "Bewust beperkt; uitbreidingen waar mogelijk side-by-side", score: 2 },
        { label: "Clean core: kern standaard, extensies losgekoppeld", score: 3 },
      ],
    },
    {
      id: "q6", dimension: "cleancore",
      text: "Hoe actueel is jullie ERP- en logistieke platform technisch?",
      options: [
        { label: "Op een versie die richting end-of-maintenance loopt", score: 0 },
        { label: "Ondersteund, maar enkele releases achter", score: 1 },
        { label: "Recente release met een upgradepad in beeld", score: 2 },
        { label: "Actuele (cloud)release met continue updates", score: 3 },
      ],
    },
    {
      id: "q7", dimension: "data",
      text: "Hoe goed zijn ERP, WMS, TMS en ketenpartners gekoppeld — is er realtime visibility?",
      options: [
        { label: "Vooral handmatig en via fragiele point-to-point koppelingen", score: 0 },
        { label: "Diverse koppelingen, weinig overzicht of monitoring", score: 1 },
        { label: "Gestandaardiseerd via een integratielaag/API's", score: 2 },
        { label: "Event-driven en gemonitord; realtime track & trace door de keten", score: 3 },
      ],
    },
    {
      id: "q8", dimension: "data",
      text: "Hoe is jullie master data (klanten, locaties, tarieven, artikelen) georganiseerd?",
      options: [
        { label: "Geen centrale afspraken; dubbele en tegenstrijdige data", score: 0 },
        { label: "Per systeem eigen masterdata, beperkt afgestemd", score: 1 },
        { label: "Centrale definities en eigenaarschap op kerndomeinen", score: 2 },
        { label: "Actief MDM met kwaliteitsmonitoring en duidelijke ownership", score: 3 },
      ],
    },
    {
      id: "q9", dimension: "schaal",
      text: "Hoe goed schalen jullie ketenprocessen mee met volume, locaties en nieuwe partners?",
      options: [
        { label: "Groei loopt vast op handmatige stappen en uitzonderingen", score: 0 },
        { label: "Het lukt, maar met veel firefighting", score: 1 },
        { label: "Processen zijn grotendeels gestandaardiseerd en geautomatiseerd", score: 2 },
        { label: "Schaalbaar by design: nieuwe locatie of partner in weken live", score: 3 },
      ],
    },
    {
      id: "q10", dimension: "schaal",
      text: "Hoeveel realtime inzicht hebben jullie in prestaties (leverbetrouwbaarheid, kosten, bezetting)?",
      options: [
        { label: "Nauwelijks; problemen worden pas achteraf zichtbaar", score: 0 },
        { label: "Losse rapportages, geen end-to-end beeld", score: 1 },
        { label: "Dashboards op de belangrijkste logistieke KPI's", score: 2 },
        { label: "Realtime inzicht en process mining sturen continue verbetering", score: 3 },
      ],
    },
  ],

  advice: {
    strategie: {
      low:  { title: "Verbind ERP aan service en kosten", body: "Zonder heldere koppeling tussen ERP-keuzes en keten-KPI's blijven beslissingen reactief. Begin met een roadmap waarin elke investering aan een meetbaar doel hangt — servicelevel, kosten of CO2. Zo wordt je ERP een ketenmotor." },
      mid:  { title: "Maak besluitvorming ritmisch", body: "De afstemming staat. Versterk met een vast ritme tussen IT, supply chain en operatie en heldere business cases, zodat keuzes elkaar versterken." },
      high: { title: "Stuur op ketenwaarde", body: "Je staat er strategisch sterk voor. Verfijn door te sturen op kosten, service en duurzaamheid en koppel keten-KPI's aan de directie-agenda." },
    },
    ai: {
      low:  { title: "Begin met planning of forecasting", body: "AI begint bij betrouwbare data en één use-case. Route- of capaciteitsplanning levert snel zichtbare kostenwinst. Klein beginnen, snel leren." },
      mid:  { title: "Breng pilots naar productie", body: "Er gebeurt al iets, maar productie blijft uit. Schaal een bewezen use-case op met eigenaarschap en monitoring, zodat AI structureel je planning verbetert." },
      high: { title: "Laat AI de keten sturen", body: "AI levert al waarde. Versterk governance en herbruikbaarheid en verbind planning, route en capaciteit voor maximale impact." },
    },
    cleancore: {
      low:  { title: "Bouw maatwerk af", body: "Zwaar maatwerk maakt elke upgrade duur en risicovol. Breng het in kaart, behoud wat onderscheidend is en verplaats de rest naar de standaard of side-by-side extensies. Dit is je grootste hefboom richting wendbaarheid." },
      mid:  { title: "Bewaak de clean core", body: "Je bent op de goede weg. Maak clean core een expliciet principe met losgekoppelde uitbreidingen en duidelijke governance." },
      high: { title: "Houd de kern schoon en actueel", body: "Je kern is wendbaar. Borg dit met een vast updateritme en architectuurreviews." },
    },
    data: {
      low:  { title: "Maak de keten realtime zichtbaar", body: "Fragiele koppelingen en gebrek aan visibility kosten service en marge. Investeer in een integratielaag die ERP, WMS, TMS en partners verbindt met realtime track & trace. Dit fundament betaalt zich op elke andere as terug." },
      mid:  { title: "Standaardiseer koppelingen en ownership", body: "De richting klopt. Versterk de integratielaag en leg eigenaarschap op masterdata vast, zodat data betrouwbaar en herbruikbaar wordt." },
      high: { title: "Maak data event-driven", body: "Je datafundament is sterk. Zet de stap naar event-driven, gemonitorde integratie zodat de hele keten realtime op dezelfde waarheid stuurt." },
    },
    schaal: {
      low:  { title: "Standaardiseer ketenprocessen", body: "Groei loopt vast op handwerk en uitzonderingen. Standaardiseer en automatiseer je kernprocessen, zodat opschalen naar nieuwe locaties of partners voorspelbaar wordt." },
      mid:  { title: "Automatiseer de uitzonderingen", body: "De kern draait. Richt je op de handmatige stappen die niet meeschalen en maak processen meetbaar, zodat groei beheersbaar blijft." },
      high: { title: "Stuur continu op de keten", body: "Je schaalt goed. Benut realtime inzicht en process mining om service, kosten en bezetting datagedreven te verbeteren." },
    },
  },

  verdicts: [
    { min: 0,  label: "Keten nog onvoorspelbaar",  summary: "Gebrek aan visibility en handwerk maken de keten kwetsbaar. Juist hier zit de snelste winst: realtime koppelingen en gestandaardiseerde processen. Een gerichte nulmeting helpt prioriteren." },
    { min: 40, label: "Op de goede weg",           summary: "De basis komt op gang, maar het potentieel is nog niet benut. Gerichte stappen op je zwakste assen maken je keten merkbaar betrouwbaarder." },
    { min: 70, label: "Volwassen & wendbaar",      summary: "Je supply chain is goed op orde. De winst zit nu in verfijning en in het verzilveren van AI- en datawaarde bovenop een sterk fundament." },
    { min: 85, label: "Supply-chain-koploper",     summary: "Je behoort tot de voorhoede. Keten en data zijn realtime verbonden; de focus verschuift naar innovatie en kosten- en CO2-optimalisatie." },
  ],

  lead: {
    eyebrow: "Laatste stap",
    heading: "Ontvang je supply-chain-verbeterplan",
    sub: "We sturen je je diagnose plus concrete next steps per as. Een adviseur met logistiek-ervaring kijkt vrijblijvend mee.",
    privacy_url: "/info/privacy",
    thanks_heading: "Bedankt — je advies is onderweg",
    thanks_sub: "Een adviseur neemt binnen één werkdag contact op met je persoonlijke supply-chain-verbeterplan.",
  },
};
