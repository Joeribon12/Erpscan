// ══════════════════════════════════════════════════════════════════════════
// SCAN: dienstverlening — "Zakelijke dienstverlening / projectorganisaties"
// Doelgroep: IT-, finance- & operations-leiders in professional services.
// ══════════════════════════════════════════════════════════════════════════

export default {
  scan_id: "erp-scan-dienstverlening",
  title: "Declarabel & schaalbaar? Scan je ERP voor zakelijke dienstverlening",
  eyebrow: "Zakelijke dienstverlening",
  audience: "Voor IT-, finance- & operations-leiders in dienstverlening",

  intro: {
    sub: "Je mensen zijn je product: bezetting, declarabiliteit en projectmarge bepalen je resultaat. Deze scan meet in tien vragen hoe goed jouw ERP voor projectorganisaties de professional services automation (PSA) ondersteunt — van strategie tot resource planning, data en schaalbaarheid. Je krijgt direct een diagnose met prioriteiten.",
    bullets: [
      "Nulmeting van je professional-services-volwassenheid",
      "Zie waar declarabiliteit en bezetting of urenregistratie je remmen",
      "Concreet verbeterpunt per as, toegespitst op zakelijke dienstverlening",
    ],
  },

  dimensions: [
    { id: "strategie",  label: "Strategie & groeikoers" },
    { id: "ai",         label: "AI-readiness" },
    { id: "cleancore",  label: "Clean core & techniek" },
    { id: "data",       label: "Data & projectadministratie" },
    { id: "schaal",     label: "Schaalbaarheid & resourceprocessen" },
  ],

  questions: [
    {
      id: "q1", dimension: "strategie",
      text: "Is jullie ERP-roadmap gekoppeld aan doelen rond declarabiliteit, marge en groei?",
      options: [
        { label: "Nee, er is geen expliciete roadmap", score: 0 },
        { label: "Een IT-roadmap, los van de business", score: 1 },
        { label: "Roadmap afgestemd met finance en operatie", score: 2 },
        { label: "Meetbaar verbonden aan bezettings-, marge- en groei-KPI's", score: 3 },
      ],
    },
    {
      id: "q2", dimension: "strategie",
      text: "Hoe worden grote ERP- en digitaliseringsinvesteringen besloten?",
      options: [
        { label: "Ad hoc, gedreven door incidenten", score: 0 },
        { label: "IT beslist, business wordt geïnformeerd", score: 1 },
        { label: "Gedeeld IT/business met een vast ritme", score: 2 },
        { label: "Vanuit een groei- en margestrategie op directieniveau", score: 3 },
      ],
    },
    {
      id: "q3", dimension: "ai",
      text: "Benutten jullie AI voor bezettingsvoorspelling, projectrisico of resource matching?",
      options: [
        { label: "Nee, nog niet aan de orde", score: 0 },
        { label: "Losse pilots, niet in productie", score: 1 },
        { label: "Eerste use-cases live (bv. forecasting of matching)", score: 2 },
        { label: "AI ondersteunt planning, bezetting en risico met meetbare waarde", score: 3 },
      ],
    },
    {
      id: "q4", dimension: "ai",
      text: "Is jullie project-, uren- en resourcedata geschikt om AI te voeden?",
      options: [
        { label: "Data zit versnipperd over uren-, project- en finance-tools", score: 0 },
        { label: "Kerndata bestaat, maar urenregistratie is traag of onvolledig", score: 1 },
        { label: "Gecureerde project- en resourcedata met governance", score: 2 },
        { label: "Eén betrouwbare bron die planning en prognoses voedt", score: 3 },
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
      text: "Hoe actueel is jullie ERP- en PSA-platform technisch?",
      options: [
        { label: "Op een versie die richting end-of-maintenance loopt", score: 0 },
        { label: "Ondersteund, maar enkele releases achter", score: 1 },
        { label: "Recente release met een upgradepad in beeld", score: 2 },
        { label: "Actuele (cloud)release met continue updates", score: 3 },
      ],
    },
    {
      id: "q7", dimension: "data",
      text: "Hoeveel realtime zicht heb je op bezetting, declarabiliteit en marge per project?",
      options: [
        { label: "Pas na de maandafsluiting weet je hoe projecten draaiden", score: 0 },
        { label: "Periodiek inzicht, maar met veel handwerk in Excel", score: 1 },
        { label: "Dashboards op bezetting en marge per project", score: 2 },
        { label: "Realtime grip op bezetting, declarabiliteit en marge", score: 3 },
      ],
    },
    {
      id: "q8", dimension: "data",
      text: "Hoe zijn uren, projecten, facturatie en finance gekoppeld?",
      options: [
        { label: "Losse systemen; veel overtypen en correcties", score: 0 },
        { label: "Deels gekoppeld, deels handmatig", score: 1 },
        { label: "Gestandaardiseerd via API's op de belangrijkste stromen", score: 2 },
        { label: "Eén geïntegreerd proces van urenregistratie tot factuur", score: 3 },
      ],
    },
    {
      id: "q9", dimension: "schaal",
      text: "Hoe goed schalen jullie resource- en projectprocessen mee met groei en nieuwe diensten?",
      options: [
        { label: "Groei loopt vast op handwerk en uitzonderingen", score: 0 },
        { label: "Het lukt, maar met veel firefighting", score: 1 },
        { label: "Processen zijn grotendeels gestandaardiseerd en herhaalbaar", score: 2 },
        { label: "Schaalbaar by design: nieuwe teams of diensten snel ingericht", score: 3 },
      ],
    },
    {
      id: "q10", dimension: "schaal",
      text: "Hoeveel inzicht hebben jullie in capaciteit en pijplijn over de hele organisatie?",
      options: [
        { label: "Nauwelijks; knelpunten worden pas laat zichtbaar", score: 0 },
        { label: "Losse rapportages, geen portfoliobeeld", score: 1 },
        { label: "Dashboards op de belangrijkste resource-KPI's", score: 2 },
        { label: "Realtime inzicht in capaciteit en pijplijn stuurt planning", score: 3 },
      ],
    },
  ],

  advice: {
    strategie: {
      low:  { title: "Verbind ERP aan bezetting en marge", body: "Zonder heldere koppeling tussen ERP-keuzes en declarabiliteit blijft sturing reactief. Begin met een roadmap waarin elke investering aan een meetbaar doel hangt — bezetting, marge of doorlooptijd. Zo wordt je ERP een groeimotor in plaats van een urenregistratie-tool." },
      mid:  { title: "Maak besluitvorming ritmisch", body: "De afstemming staat. Versterk met een vast ritme tussen IT, finance en operatie en heldere business cases, zodat keuzes elkaar versterken." },
      high: { title: "Stuur op portfoliowaarde", body: "Je staat er strategisch sterk voor. Verfijn door je project- en resourceportfolio te sturen op marge en risico en koppel KPI's aan de directie-agenda." },
    },
    ai: {
      low:  { title: "Begin met bezettingsvoorspelling", body: "AI begint bij betrouwbare data en één use-case. Een bezettings- of matchingmodel helpt direct om leegloop te beperken. Klein beginnen, snel leren." },
      mid:  { title: "Breng pilots naar productie", body: "Er gebeurt al iets, maar productie blijft uit. Schaal een bewezen use-case op met eigenaarschap en monitoring, zodat AI structureel bijdraagt aan planning en bezetting." },
      high: { title: "Verweef AI in resourcesturing", body: "AI levert al waarde. Versterk governance en herbruikbaarheid en verbind planning, bezetting en risico voor maximale impact." },
    },
    cleancore: {
      low:  { title: "Bouw maatwerk af", body: "Zwaar maatwerk maakt elke upgrade duur en risicovol. Breng het in kaart, behoud wat onderscheidend is en verplaats de rest naar de standaard of side-by-side extensies. Dit is je grootste hefboom richting wendbaarheid." },
      mid:  { title: "Bewaak de clean core", body: "Je bent op de goede weg. Maak clean core een expliciet principe met losgekoppelde uitbreidingen en duidelijke governance." },
      high: { title: "Houd de kern schoon en actueel", body: "Je kern is wendbaar. Borg dit met een vast updateritme en architectuurreviews." },
    },
    data: {
      low:  { title: "Maak declarabiliteit realtime", body: "Als je pas na de afsluiting weet hoe projecten draaiden, stuur je te laat. Investeer in een geïntegreerd proces dat uren, projecten en facturatie verbindt met realtime zicht op bezetting en marge. Dit fundament betaalt zich op elke andere as terug." },
      mid:  { title: "Integreer uren, project en finance", body: "De richting klopt. Versterk de koppeling tussen uren, project en finance en leg eigenaarschap op data vast, zodat marge en bezetting altijd actueel zijn." },
      high: { title: "Stuur realtime op marge", body: "Je datafundament is sterk. Zet de stap naar realtime prognoses zodat je tijdens projecten kunt bijsturen in plaats van achteraf." },
    },
    schaal: {
      low:  { title: "Standaardiseer resourceprocessen", body: "Groei loopt vast op handwerk en uitzonderingen. Standaardiseer en automatiseer je proces van planning tot facturatie, zodat meer mensen, teams en diensten beheersbaar worden." },
      mid:  { title: "Automatiseer de uitzonderingen", body: "De kern draait. Richt je op de handmatige stappen die niet meeschalen en maak processen meetbaar, zodat groei beheersbaar blijft." },
      high: { title: "Stuur continu op capaciteit", body: "Je schaalt goed. Benut realtime inzicht in capaciteit en pijplijn om planning en bezetting datagedreven te sturen." },
    },
  },

  verdicts: [
    { min: 0,  label: "Grip op bezetting ontbreekt", summary: "Sturen na de afsluiting betekent te laat sturen op je belangrijkste asset: je mensen. Juist hier zit de snelste winst: realtime zicht op bezetting en marge. Een gerichte nulmeting helpt prioriteren." },
    { min: 40, label: "Op de goede weg",             summary: "De basis komt op gang, maar het margepotentieel is nog niet benut. Gerichte stappen op je zwakste assen geven je merkbaar meer grip op projecten en bezetting." },
    { min: 70, label: "Volwassen & in control",      summary: "Je dienstverleningslandschap is goed op orde. De winst zit nu in verfijning en in het verzilveren van AI- en datawaarde bovenop een sterk fundament." },
    { min: 85, label: "Koploper in dienstverlening", summary: "Je behoort tot de voorhoede. Uren, projecten en finance zijn realtime verbonden; de focus verschuift naar innovatie en margeoptimalisatie." },
  ],

  lead: {
    eyebrow: "Laatste stap",
    heading: "Ontvang je verbeterplan voor je projectorganisatie",
    sub: "We sturen je je diagnose plus concrete next steps per as. Een adviseur met ervaring in zakelijke dienstverlening kijkt vrijblijvend mee.",
    privacy_url: "/info/privacy",
    thanks_heading: "Bedankt — je advies is onderweg",
    thanks_sub: "Een adviseur neemt binnen één werkdag contact op met je persoonlijke verbeterplan.",
  },
};
