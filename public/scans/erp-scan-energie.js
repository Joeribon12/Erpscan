// ══════════════════════════════════════════════════════════════════════════
// SCAN: utilities — "Energie & nutsbedrijven"
// Doelgroep: IT-, asset- & klantprocesverantwoordelijken in utilities.
// ══════════════════════════════════════════════════════════════════════════

export default {
  scan_id: "erp-scan-energie",
  title: "Klaar voor de energietransitie? Scan je ERP-landschap",
  eyebrow: "Energie & nutsbedrijven",
  audience: "Voor IT-, asset- & klantprocesleiders in utilities",

  intro: {
    sub: "Energietransitie, strenge regulering en explosief groeiende verbruiksdata zetten je systemen onder druk. Deze scan meet in tien vragen hoe futureproof jouw ERP-landschap is — van strategie tot asset management, meter-to-cash, data en schaalbaarheid. Je krijgt direct een diagnose met prioriteiten.",
    bullets: [
      "Nulmeting van je utilities-volwassenheid",
      "Zie waar assets, meterdata of klantprocessen je remmen",
      "Concreet verbeterpunt per as, toegespitst op energie & nuts",
    ],
  },

  dimensions: [
    { id: "strategie",  label: "Strategie & transitiekoers" },
    { id: "ai",         label: "AI-readiness" },
    { id: "cleancore",  label: "Clean core & techniek" },
    { id: "data",       label: "Data & integratie (meter, asset)" },
    { id: "schaal",     label: "Schaalbaarheid & klant-/assetprocessen" },
  ],

  questions: [
    {
      id: "q1", dimension: "strategie",
      text: "Is jullie ERP-roadmap gekoppeld aan de energietransitie en reguleringsdoelen?",
      options: [
        { label: "Nee, er is geen expliciete roadmap", score: 0 },
        { label: "Een IT-roadmap, los van transitie en regulering", score: 1 },
        { label: "Roadmap afgestemd met asset- en klantorganisatie", score: 2 },
        { label: "Meetbaar verbonden aan transitie-, compliance- en service-KPI's", score: 3 },
      ],
    },
    {
      id: "q2", dimension: "strategie",
      text: "Hoe worden grote ERP- en assetinvesteringen besloten?",
      options: [
        { label: "Ad hoc, gedreven door incidenten of toezicht", score: 0 },
        { label: "IT beslist, business wordt geïnformeerd", score: 1 },
        { label: "Gedeeld IT/business met een vast ritme", score: 2 },
        { label: "Vanuit een transitie- en assetstrategie op directieniveau", score: 3 },
      ],
    },
    {
      id: "q3", dimension: "ai",
      text: "Benutten jullie AI voor verbruiksvoorspelling of predictive maintenance op assets?",
      options: [
        { label: "Nee, nog niet aan de orde", score: 0 },
        { label: "Losse pilots, niet in productie", score: 1 },
        { label: "Eerste use-cases live (bv. forecasting of conditiebewaking)", score: 2 },
        { label: "AI is ingebed in verbruik, onderhoud en netbeheer met meetbare waarde", score: 3 },
      ],
    },
    {
      id: "q4", dimension: "ai",
      text: "Is jullie meter-, asset- en klantdata geschikt om AI betrouwbaar te voeden?",
      options: [
        { label: "Data zit verspreid over systemen; kwaliteit wisselt sterk", score: 0 },
        { label: "Kerndata bestaat, maar asset- en meterdata zijn niet altijd actueel", score: 1 },
        { label: "Gecureerde asset- en meterdata met governance", score: 2 },
        { label: "Eén betrouwbare databron die voorspelling en onderhoud voedt", score: 3 },
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
      text: "Hoe actueel is jullie ERP- en assetmanagementplatform technisch?",
      options: [
        { label: "Op een versie die richting end-of-maintenance loopt", score: 0 },
        { label: "Ondersteund, maar enkele releases achter", score: 1 },
        { label: "Recente release met een upgradepad in beeld", score: 2 },
        { label: "Actuele (cloud)release met continue updates", score: 3 },
      ],
    },
    {
      id: "q7", dimension: "data",
      text: "Hoe goed zijn ERP, asset management (EAM) en meet-/netdata gekoppeld?",
      options: [
        { label: "Vooral handmatig en via fragiele point-to-point koppelingen", score: 0 },
        { label: "Diverse koppelingen, weinig overzicht of monitoring", score: 1 },
        { label: "Gestandaardiseerd via een integratielaag/API's", score: 2 },
        { label: "Event-driven en gemonitord; asset en verbruik realtime verbonden", score: 3 },
      ],
    },
    {
      id: "q8", dimension: "data",
      text: "Hoe is jullie master data (assets, aansluitingen, klanten, contracten) georganiseerd?",
      options: [
        { label: "Geen centrale afspraken; dubbele en tegenstrijdige data", score: 0 },
        { label: "Per systeem eigen masterdata, beperkt afgestemd", score: 1 },
        { label: "Centrale definities en eigenaarschap op kerndomeinen", score: 2 },
        { label: "Actief MDM met kwaliteitsmonitoring en duidelijke ownership", score: 3 },
      ],
    },
    {
      id: "q9", dimension: "schaal",
      text: "Hoe goed schalen jullie klant- en assetprocessen mee met groei en transitie?",
      options: [
        { label: "Groei en nieuwe diensten lopen vast op handwerk", score: 0 },
        { label: "Het lukt, maar met veel firefighting", score: 1 },
        { label: "Processen zijn grotendeels gestandaardiseerd en geautomatiseerd", score: 2 },
        { label: "Schaalbaar by design: nieuwe diensten en volumes snel ondersteund", score: 3 },
      ],
    },
    {
      id: "q10", dimension: "schaal",
      text: "Hoeveel realtime inzicht hebben jullie in assetprestaties en meter-to-cash?",
      options: [
        { label: "Nauwelijks; problemen worden pas achteraf zichtbaar", score: 0 },
        { label: "Losse rapportages, geen end-to-end beeld", score: 1 },
        { label: "Dashboards op de belangrijkste asset- en klant-KPI's", score: 2 },
        { label: "Realtime inzicht en process mining sturen continue verbetering", score: 3 },
      ],
    },
  ],

  advice: {
    strategie: {
      low:  { title: "Verbind ERP aan de transitie", body: "Zonder heldere koppeling tussen ERP-keuzes en transitie-/reguleringsdoelen blijven beslissingen reactief. Begin met een roadmap waarin elke investering aan een meetbaar doel hangt — compliance, assetbeschikbaarheid of klantservice. Zo wordt je ERP een motor voor de transitie." },
      mid:  { title: "Maak besluitvorming ritmisch", body: "De afstemming staat. Versterk met een vast ritme tussen IT, asset- en klantorganisatie en heldere business cases, zodat keuzes elkaar versterken." },
      high: { title: "Stuur op transitie- en assetwaarde", body: "Je staat er strategisch sterk voor. Verfijn door te sturen op assetwaarde en risico en koppel transitie-KPI's aan de directie-agenda." },
    },
    ai: {
      low:  { title: "Begin met predictive maintenance", body: "AI begint bij betrouwbare data en één use-case. Conditiebewaking of verbruiksvoorspelling levert snel zichtbare waarde in uptime en kosten. Klein beginnen, snel leren." },
      mid:  { title: "Breng pilots naar productie", body: "Er gebeurt al iets, maar productie blijft uit. Schaal een bewezen use-case op met eigenaarschap en monitoring, zodat AI structureel bijdraagt aan onderhoud en netbeheer." },
      high: { title: "Verweef AI in asset en net", body: "AI levert al waarde. Versterk governance en herbruikbaarheid en verbind verbruik, onderhoud en netbeheer voor maximale impact." },
    },
    cleancore: {
      low:  { title: "Bouw maatwerk af", body: "Zwaar maatwerk maakt elke upgrade duur en risicovol. Breng het in kaart, behoud wat onderscheidend is en verplaats de rest naar de standaard of side-by-side extensies. Dit is je grootste hefboom richting wendbaarheid." },
      mid:  { title: "Bewaak de clean core", body: "Je bent op de goede weg. Maak clean core een expliciet principe met losgekoppelde uitbreidingen en duidelijke governance." },
      high: { title: "Houd de kern schoon en actueel", body: "Je kern is wendbaar. Borg dit met een vast updateritme en architectuurreviews." },
    },
    data: {
      low:  { title: "Verbind asset en verbruik", body: "Fragiele koppelingen en versnipperde asset-/meterdata remmen onderhoud, facturatie en compliance. Investeer in een integratielaag die ERP, EAM en meetdata verbindt, met centrale stamdata. Dit fundament betaalt zich op elke andere as terug." },
      mid:  { title: "Standaardiseer koppelingen en ownership", body: "De richting klopt. Versterk de integratielaag en leg eigenaarschap op masterdata vast, zodat asset- en klantdata betrouwbaar wordt." },
      high: { title: "Maak data realtime", body: "Je datafundament is sterk. Zet de stap naar event-driven, gemonitorde integratie zodat asset en verbruik realtime op dezelfde waarheid sturen." },
    },
    schaal: {
      low:  { title: "Standaardiseer klant- en assetprocessen", body: "Groei en nieuwe diensten lopen vast op handwerk. Standaardiseer en automatiseer je kernprocessen rond meter-to-cash en assetbeheer, zodat opschalen voorspelbaar wordt." },
      mid:  { title: "Automatiseer de uitzonderingen", body: "De kern draait. Richt je op de handmatige stappen die niet meeschalen en maak processen meetbaar, zodat groei en transitie beheersbaar blijven." },
      high: { title: "Stuur continu op assets en klant", body: "Je schaalt goed. Benut realtime inzicht en process mining om assetbeschikbaarheid en meter-to-cash datagedreven te verbeteren." },
    },
  },

  verdicts: [
    { min: 0,  label: "Transitierisico: hoog",    summary: "Versnipperde asset- en meterdata maken je kwetsbaar voor de transitie en het toezicht. Juist hier zit de snelste winst: koppelingen en stamdata op orde. Een gerichte nulmeting helpt prioriteren." },
    { min: 40, label: "Op de goede weg",          summary: "De basis komt op gang, maar het potentieel is nog niet benut. Gerichte stappen op je zwakste assen maken je landschap merkbaar robuuster." },
    { min: 70, label: "Volwassen & transitieklaar", summary: "Je utilities-landschap is goed op orde. De winst zit nu in verfijning en in het verzilveren van AI- en datawaarde bovenop een sterk fundament." },
    { min: 85, label: "Utilities-koploper",       summary: "Je behoort tot de voorhoede. Assets en verbruik zijn realtime verbonden; de focus verschuift naar innovatie en het versnellen van de energietransitie." },
  ],

  lead: {
    eyebrow: "Laatste stap",
    heading: "Ontvang je utilities-verbeterplan",
    sub: "We sturen je je diagnose plus concrete next steps per as. Een adviseur met energie- en utilities-ervaring kijkt vrijblijvend mee.",
    privacy_url: "/info/privacy",
    thanks_heading: "Bedankt — je advies is onderweg",
    thanks_sub: "Een adviseur neemt binnen één werkdag contact op met je persoonlijke utilities-verbeterplan.",
  },
};
