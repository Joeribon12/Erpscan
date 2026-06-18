// ══════════════════════════════════════════════════════════════════════════
// SCAN: algemeen — "ERP Futureproof Scan"
// Doelgroep: CIO's & IT-managers, sector-onafhankelijk.
//
// Dit bestand is PURE DATA. De engine doet de rest. Schema (kort):
//   scan_id, title, eyebrow, audience, intro{sub,bullets}
//   dimensions[]  : { id, label }                         (5 stuks)
//   questions[]   : { id, dimension, text, options[4]{label,score 0-3} }  (10 stuks)
//   advice{}      : per dimension-id -> { low, mid, high }{ title, body }
//   verdicts[]    : { min (0-100), label, summary }
//   lead{}        : copy + privacy_url
// Zie CONTENT-GUIDE.md voor hoe je scherpe vragen/adviezen schrijft.
// ══════════════════════════════════════════════════════════════════════════

export default {
  scan_id: "erp-systeem-scan",
  title: "Hoe futureproof is mijn ERP-systeem?",
  eyebrow: "ERP Futureproof Scan",
  audience: "Voor CIO's & IT-managers",

  intro: {
    sub: "Deze gratis ERP-scan stelt tien gerichte vragen over strategie, AI, clean core, data en schaalbaarheid. Je krijgt direct een ERP-assessment met een concreet verbeterpunt per as — geen verkooppraatje, wel inzicht in hoe futureproof je ERP-systeem werkelijk is.",
    bullets: [
      "Onafhankelijke nulmeting van je ERP-volwassenheid",
      "Score per as: zie meteen waar de winst zit",
      "Concrete next steps, afgestemd op jouw niveau",
    ],
  },

  // ── De vijf assen ─────────────────────────────────────────────────────────
  dimensions: [
    { id: "strategie",  label: "Strategie & doelen" },
    { id: "ai",         label: "AI-readiness" },
    { id: "cleancore",  label: "Clean core & techniek" },
    { id: "data",       label: "Data & integratie" },
    { id: "schaal",     label: "Schaalbaarheid & processen" },
  ],

  // ── Tien vragen (2 per as), oplopend van 0 (zwak) naar 3 (sterk) ──────────
  questions: [
    // Strategie & doelen
    {
      id: "q1", dimension: "strategie",
      text: "In hoeverre is jullie ERP-roadmap gekoppeld aan concrete bedrijfsdoelen?",
      options: [
        { label: "Er is geen expliciete ERP-roadmap", score: 0 },
        { label: "Een IT-roadmap, maar los van de business", score: 1 },
        { label: "Roadmap met de business afgestemd, jaarlijks herzien", score: 2 },
        { label: "ERP-doelen zijn meetbaar verbonden aan KPI's en groeiambitie", score: 3 },
      ],
    },
    {
      id: "q2", dimension: "strategie",
      text: "Wie is eigenaar van de beslissing over grote ERP-investeringen?",
      options: [
        { label: "Ad hoc, vooral gedreven door incidenten", score: 0 },
        { label: "IT beslist, business wordt geïnformeerd", score: 1 },
        { label: "Gedeeld IT/business, met een vast besluitvormingsritme", score: 2 },
        { label: "Een board-level digitaal portfolio met heldere business cases", score: 3 },
      ],
    },

    // AI-readiness
    {
      id: "q3", dimension: "ai",
      text: "Hoe ver zijn jullie met AI binnen de ERP-processen?",
      options: [
        { label: "Nog niet mee bezig", score: 0 },
        { label: "Wat experimenten, niet in productie", score: 1 },
        { label: "Eerste use-cases live (bv. forecasting, document-AI)", score: 2 },
        { label: "AI is ingebed in kernprocessen met meetbare waarde", score: 3 },
      ],
    },
    {
      id: "q4", dimension: "ai",
      text: "Is jullie datafundament klaar om AI betrouwbaar te voeden?",
      options: [
        { label: "Data is versnipperd en grotendeels ongestructureerd", score: 0 },
        { label: "Kerndata bestaat, maar kwaliteit is wisselend", score: 1 },
        { label: "Gecureerde datasets met governance op de belangrijkste domeinen", score: 2 },
        { label: "Eén betrouwbare, gegovernde databron die AI direct kan benutten", score: 3 },
      ],
    },

    // Clean core & techniek
    {
      id: "q5", dimension: "cleancore",
      text: "Hoeveel maatwerk zit er in jullie ERP-kern?",
      options: [
        { label: "Zwaar gecustomiseerd; upgrades zijn pijnlijk", score: 0 },
        { label: "Veel maatwerk, deels ongedocumenteerd", score: 1 },
        { label: "Bewust beperkt; uitbreidingen waar mogelijk side-by-side", score: 2 },
        { label: "Clean core-principe: kern standaard, extensies losgekoppeld", score: 3 },
      ],
    },
    {
      id: "q6", dimension: "cleancore",
      text: "Hoe actueel is jullie ERP-platform technisch?",
      options: [
        { label: "Op een versie die richting end-of-maintenance loopt", score: 0 },
        { label: "Ondersteund, maar enkele releases achter", score: 1 },
        { label: "Recente release, met een upgradepad in beeld", score: 2 },
        { label: "Actuele (cloud)release met continue updates", score: 3 },
      ],
    },

    // Data & integratie
    {
      id: "q7", dimension: "data",
      text: "Hoe zijn jullie kernsystemen met elkaar gekoppeld?",
      options: [
        { label: "Vooral handmatig en via point-to-point koppelingen", score: 0 },
        { label: "Een mix van koppelingen, weinig overzicht", score: 1 },
        { label: "Gestandaardiseerd via een integratielaag/API's", score: 2 },
        { label: "Event-driven integratie met monitoring en herbruikbare API's", score: 3 },
      ],
    },
    {
      id: "q8", dimension: "data",
      text: "Hoe is het gesteld met master data management?",
      options: [
        { label: "Geen centrale afspraken; dubbele en tegenstrijdige data", score: 0 },
        { label: "Per systeem eigen masterdata, beperkt afgestemd", score: 1 },
        { label: "Centrale definities en eigenaarschap op kerndomeinen", score: 2 },
        { label: "Actief MDM met kwaliteitsmonitoring en duidelijke ownership", score: 3 },
      ],
    },

    // Schaalbaarheid & processen
    {
      id: "q9", dimension: "schaal",
      text: "Hoe goed schalen jullie processen mee met groei (volume, landen, entiteiten)?",
      options: [
        { label: "Groei loopt vast op handmatige stappen en uitzonderingen", score: 0 },
        { label: "Het lukt, maar met veel firefighting", score: 1 },
        { label: "Processen zijn grotendeels gestandaardiseerd en geautomatiseerd", score: 2 },
        { label: "Schaalbaar by design: nieuwe entiteiten/landen in weken live", score: 3 },
      ],
    },
    {
      id: "q10", dimension: "schaal",
      text: "Hoeveel inzicht hebben jullie in de prestaties van end-to-end processen?",
      options: [
        { label: "Nauwelijks; problemen worden pas achteraf zichtbaar", score: 0 },
        { label: "Losse rapportages, geen end-to-end beeld", score: 1 },
        { label: "Dashboards op de belangrijkste processen", score: 2 },
        { label: "Process mining/continuous monitoring stuurt verbetering", score: 3 },
      ],
    },
  ],

  // ── Advies per as, meebewegend met het scoreniveau ───────────────────────
  advice: {
    strategie: {
      low:  { title: "Verbind ERP aan businessdoelen", body: "Er is nu geen duidelijke lijn tussen ERP-keuzes en bedrijfsresultaat. Start met een lichtgewicht roadmap waarin elke grote investering aan een meetbaar doel hangt. Dat voorkomt dat ERP een kostenpost blijft in plaats van een groeimotor." },
      mid:  { title: "Maak besluitvorming ritmisch", body: "De basis staat. De winst zit nu in een vast besluitvormingsritme tussen IT en business, met heldere business cases. Zo voorkom je incident-gedreven keuzes en houd je de roadmap actueel." },
      high: { title: "Stuur op portfoliowaarde", body: "Jullie zijn strategisch volwassen. Verfijn door je digitaal portfolio actief te managen op waarde en risico, en koppel ERP-KPI's direct aan de board-agenda." },
    },
    ai: {
      low:  { title: "Begin met één waardevolle use-case", body: "AI is nog onontgonnen terrein. Kies één afgebakende use-case met duidelijke waarde (bv. factuurherkenning of vraagvoorspelling) en bouw daar ervaring én vertrouwen mee op. Klein beginnen, snel leren." },
      mid:  { title: "Breng experimenten naar productie", body: "Er gebeurt al iets, maar de stap naar productie blijft uit. Richt je op het opschalen van bewezen use-cases met eigenaarschap, monitoring en een businesscase, zodat AI structureel waarde levert." },
      high: { title: "Schaal AI verantwoord op", body: "AI levert al waarde. Versterk nu governance en herbruikbaarheid, zodat nieuwe use-cases sneller live gaan en betrouwbaar blijven naarmate je opschaalt." },
    },
    cleancore: {
      low:  { title: "Begin met afbouwen van maatwerk", body: "Zwaar maatwerk maakt elke upgrade duur en risicovol. Breng het maatwerk in kaart, bepaal wat echt onderscheidend is, en verplaats de rest naar de standaard of een side-by-side extensie. Dit is je grootste hefboom richting wendbaarheid." },
      mid:  { title: "Bewaak de clean core bewust", body: "Je bent op de goede weg. Maak clean core een expliciet principe: nieuwe uitbreidingen losgekoppeld van de kern, met heldere governance op wat in standaard mag en wat niet." },
      high: { title: "Houd de kern schoon en actueel", body: "Je kern is wendbaar. Borg dit met een vast updateritme en architectuurreviews, zodat de clean core houdbaar blijft bij nieuwe functionaliteit." },
    },
    data: {
      low:  { title: "Leg een integratie- en datafundament", body: "Handmatige koppelingen en versnipperde masterdata remmen alles af — van rapportage tot AI. Investeer in een integratielaag met API's en centrale afspraken over kerndata. Dit fundament betaalt zich op elke andere as terug." },
      mid:  { title: "Standaardiseer koppelingen en ownership", body: "De richting klopt. Versterk door integraties te standaardiseren via herbruikbare API's en door eigenaarschap op masterdata vast te leggen, zodat data betrouwbaar en herbruikbaar wordt." },
      high: { title: "Maak data een actief", body: "Je datafundament is sterk. Zet de volgende stap met event-driven integratie en actieve datakwaliteitsmonitoring, zodat data realtime en betrouwbaar door je landschap stroomt." },
    },
    schaal: {
      low:  { title: "Standaardiseer voordat je opschaalt", body: "Groei loopt nu vast op handwerk en uitzonderingen. Standaardiseer en automatiseer eerst de kernprocessen; dat haalt de firefighting eruit en maakt opschalen voorspelbaar in plaats van pijnlijk." },
      mid:  { title: "Automatiseer de uitzonderingen", body: "De kern draait. Richt je nu op de uitzonderingen en handmatige stappen die niet meeschalen, en maak processen meetbaar zodat groei beheersbaar blijft." },
      high: { title: "Stuur continu op processen", body: "Je schaalt goed. Benut process mining/continuous monitoring om verbetering datagedreven te sturen en nieuwe entiteiten of landen nóg sneller live te brengen." },
    },
  },

  // ── Verdicts op de totaalscore (0–100) ───────────────────────────────────
  verdicts: [
    { min: 0,  label: "Fundament in opbouw",  summary: "Er liggen flinke kansen. Op meerdere assen ontbreekt nog een stevig fundament — juist daar zit de snelste winst. Een gerichte nulmeting helpt prioriteren." },
    { min: 40, label: "Op de goede weg",      summary: "De basis staat, maar het potentieel is nog niet benut. Met gerichte stappen op je zwakste assen maak je je ERP-landschap merkbaar wendbaarder." },
    { min: 70, label: "Volwassen & wendbaar", summary: "Je ERP-systeem is futureproof en goed op orde. De winst zit nu in verfijning en in het verzilveren van AI- en datawaarde bovenop een sterk fundament." },
    { min: 85, label: "Koploper",             summary: "Je behoort tot de voorhoede. Je fundament is schaalbaar en clean; de focus verschuift naar innovatie en het structureel uitnutten van data en AI." },
  ],

  // ── Lead-formulier ───────────────────────────────────────────────────────
  lead: {
    eyebrow: "Laatste stap",
    heading: "Ontvang je volledige ERP-verbeterplan",
    sub: "We sturen je je diagnose plus concrete next steps per as. Een adviseur kijkt vrijblijvend met je mee.",
    privacy_url: "/info/privacy", // placeholder — vervang door de echte privacy-URL
    thanks_heading: "Bedankt — je advies is onderweg",
    thanks_sub: "Een adviseur neemt binnen één werkdag contact op met je persoonlijke ERP-verbeterplan.",
  },
};
