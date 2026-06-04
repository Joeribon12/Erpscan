// ══════════════════════════════════════════════════════════════════════════
// SCAN: bouw — "Bouw & installatietechniek (projectgedreven)"
// Doelgroep: IT-, project- & financieel verantwoordelijken in bouw/installatie.
// ══════════════════════════════════════════════════════════════════════════

export default {
  scan_id: "bouw",
  title: "Grip op je projecten? Scan je ERP-landschap",
  eyebrow: "Bouw & installatietechniek",
  audience: "Voor IT-, project- & finance-leiders in bouw/installatie",

  intro: {
    sub: "Krappe marges, stijgende materiaalkosten en complexe projecten: in de bouw bepaalt grip op je projectadministratie het resultaat. Deze scan meet in tien vragen hoe sterk jouw ERP-landschap projecten ondersteunt — van strategie tot onderhanden werk, data en projectschaalbaarheid. Je krijgt direct een diagnose met prioriteiten.",
    bullets: [
      "Nulmeting van je projectvolwassenheid",
      "Zie waar marge, nacalculatie of handwerk je raken",
      "Concreet verbeterpunt per as, toegespitst op bouw & installatie",
    ],
  },

  dimensions: [
    { id: "strategie",  label: "Strategie & projectkoers" },
    { id: "ai",         label: "AI-readiness" },
    { id: "cleancore",  label: "Clean core & techniek" },
    { id: "data",       label: "Data & projectadministratie" },
    { id: "schaal",     label: "Schaalbaarheid & projectprocessen" },
  ],

  questions: [
    {
      id: "q1", dimension: "strategie",
      text: "Is jullie ERP-roadmap gekoppeld aan doelen rond projectmarge, faalkosten en groei?",
      options: [
        { label: "Nee, er is geen expliciete roadmap", score: 0 },
        { label: "Een IT-roadmap, los van projecten en financiën", score: 1 },
        { label: "Roadmap afgestemd met projectleiding en finance", score: 2 },
        { label: "Meetbaar verbonden aan marge-, faalkosten- en groei-KPI's", score: 3 },
      ],
    },
    {
      id: "q2", dimension: "strategie",
      text: "Hoe worden grote ERP- en digitaliseringsinvesteringen besloten?",
      options: [
        { label: "Ad hoc, gedreven door incidenten op projecten", score: 0 },
        { label: "IT beslist, business wordt geïnformeerd", score: 1 },
        { label: "Gedeeld IT/business met een vast ritme", score: 2 },
        { label: "Vanuit een marge- en groeistrategie op directieniveau", score: 3 },
      ],
    },
    {
      id: "q3", dimension: "ai",
      text: "Benutten jullie AI voor kostenvoorspelling, planning of risicodetectie op projecten?",
      options: [
        { label: "Nee, nog niet aan de orde", score: 0 },
        { label: "Losse pilots, niet in productie", score: 1 },
        { label: "Eerste use-cases live (bv. kostenprognose of planning)", score: 2 },
        { label: "AI ondersteunt calculatie, planning en risico met meetbare waarde", score: 3 },
      ],
    },
    {
      id: "q4", dimension: "ai",
      text: "Is jullie project-, calculatie- en kostendata geschikt om AI te voeden?",
      options: [
        { label: "Data zit versnipperd over Excel, projecttools en ERP", score: 0 },
        { label: "Kerndata bestaat, maar nacalculatie kost handwerk", score: 1 },
        { label: "Gecureerde projectdata met governance", score: 2 },
        { label: "Eén betrouwbare projectbron die prognoses en sturing voedt", score: 3 },
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
      text: "Hoe actueel is jullie ERP-platform technisch?",
      options: [
        { label: "Op een versie die richting end-of-maintenance loopt", score: 0 },
        { label: "Ondersteund, maar enkele releases achter", score: 1 },
        { label: "Recente release met een upgradepad in beeld", score: 2 },
        { label: "Actuele (cloud)release met continue updates", score: 3 },
      ],
    },
    {
      id: "q7", dimension: "data",
      text: "Hoeveel realtime zicht heb je op onderhanden werk en marge per project?",
      options: [
        { label: "Pas bij nacalculatie weet je hoe een project draaide", score: 0 },
        { label: "Periodiek inzicht, maar met veel handwerk in Excel", score: 1 },
        { label: "Dashboards op onderhanden werk en marge per project", score: 2 },
        { label: "Realtime grip op OHW, prognose en marge per project", score: 3 },
      ],
    },
    {
      id: "q8", dimension: "data",
      text: "Hoe zijn projecten gekoppeld aan inkoop, materieel, uren en financiën?",
      options: [
        { label: "Losse systemen; veel overtypen tussen project en finance", score: 0 },
        { label: "Deels gekoppeld, deels handmatig", score: 1 },
        { label: "Gestandaardiseerd via API's op de belangrijkste stromen", score: 2 },
        { label: "Eén geïntegreerd projectproces van offerte tot nacalculatie", score: 3 },
      ],
    },
    {
      id: "q9", dimension: "schaal",
      text: "Hoe goed schalen jullie projectprocessen mee met meer projecten, vestigingen of disciplines?",
      options: [
        { label: "Groei loopt vast op handwerk en uitzonderingen", score: 0 },
        { label: "Het lukt, maar met veel firefighting", score: 1 },
        { label: "Processen zijn grotendeels gestandaardiseerd en herhaalbaar", score: 2 },
        { label: "Schaalbaar by design: nieuwe vestiging of discipline snel ingericht", score: 3 },
      ],
    },
    {
      id: "q10", dimension: "schaal",
      text: "Hoeveel inzicht hebben jullie in planning, capaciteit en voortgang over alle projecten?",
      options: [
        { label: "Nauwelijks; problemen worden pas achteraf zichtbaar", score: 0 },
        { label: "Losse rapportages, geen portfoliobeeld", score: 1 },
        { label: "Dashboards op de belangrijkste project-KPI's", score: 2 },
        { label: "Realtime portfolio-inzicht stuurt planning en capaciteit", score: 3 },
      ],
    },
  ],

  advice: {
    strategie: {
      low:  { title: "Verbind ERP aan projectmarge", body: "Zonder heldere koppeling tussen ERP-keuzes en projectresultaat blijft sturing reactief. Begin met een roadmap waarin elke investering aan een meetbaar doel hangt — marge, faalkosten of doorlooptijd. Zo wordt je ERP een margemotor in plaats van een administratielast." },
      mid:  { title: "Maak besluitvorming ritmisch", body: "De afstemming staat. Versterk met een vast ritme tussen IT, projectleiding en finance en heldere business cases, zodat keuzes elkaar versterken." },
      high: { title: "Stuur op portfoliowaarde", body: "Je staat er strategisch sterk voor. Verfijn door je projectportfolio te sturen op marge en risico en koppel project-KPI's aan de directie-agenda." },
    },
    ai: {
      low:  { title: "Begin met kostenprognose", body: "AI begint bij betrouwbare data en één use-case. Een kostenprognose- of planningsmodel helpt direct om faalkosten te beperken. Klein beginnen, snel leren." },
      mid:  { title: "Breng pilots naar productie", body: "Er gebeurt al iets, maar productie blijft uit. Schaal een bewezen use-case op met eigenaarschap en monitoring, zodat AI structureel bijdraagt aan calculatie en planning." },
      high: { title: "Verweef AI in projectsturing", body: "AI levert al waarde. Versterk governance en herbruikbaarheid en verbind calculatie, planning en risico voor maximale impact." },
    },
    cleancore: {
      low:  { title: "Bouw maatwerk af", body: "Zwaar maatwerk maakt elke upgrade duur en risicovol. Breng het in kaart, behoud wat onderscheidend is en verplaats de rest naar de standaard of side-by-side extensies. Dit is je grootste hefboom richting wendbaarheid." },
      mid:  { title: "Bewaak de clean core", body: "Je bent op de goede weg. Maak clean core een expliciet principe met losgekoppelde uitbreidingen en duidelijke governance." },
      high: { title: "Houd de kern schoon en actueel", body: "Je kern is wendbaar. Borg dit met een vast updateritme en architectuurreviews." },
    },
    data: {
      low:  { title: "Maak onderhanden werk realtime", body: "Als je pas bij nacalculatie weet hoe een project draaide, stuur je te laat. Investeer in een geïntegreerd projectproces dat inkoop, uren, materieel en financiën verbindt met realtime zicht op OHW en marge. Dit fundament betaalt zich op elke andere as terug." },
      mid:  { title: "Integreer project en finance", body: "De richting klopt. Versterk de koppeling tussen project en finance en leg eigenaarschap op data vast, zodat marge per project altijd actueel is." },
      high: { title: "Stuur realtime op marge", body: "Je datafundament is sterk. Zet de stap naar realtime prognoses zodat je tijdens het project kunt bijsturen in plaats van achteraf." },
    },
    schaal: {
      low:  { title: "Standaardiseer projectprocessen", body: "Groei loopt vast op handwerk en uitzonderingen per project. Standaardiseer en automatiseer je projectproces van offerte tot nacalculatie, zodat meer projecten en vestigingen beheersbaar worden." },
      mid:  { title: "Automatiseer de uitzonderingen", body: "De kern draait. Richt je op de handmatige stappen die niet meeschalen en maak processen meetbaar, zodat groei beheersbaar blijft." },
      high: { title: "Stuur continu op het portfolio", body: "Je schaalt goed. Benut realtime portfolio-inzicht om planning, capaciteit en marge datagedreven te sturen." },
    },
  },

  verdicts: [
    { min: 0,  label: "Grip op projecten ontbreekt", summary: "Sturen op nacalculatie betekent te laat sturen. Juist hier zit de snelste winst: realtime zicht op onderhanden werk en marge. Een gerichte nulmeting helpt prioriteren." },
    { min: 40, label: "Op de goede weg",             summary: "De basis komt op gang, maar het margepotentieel is nog niet benut. Gerichte stappen op je zwakste assen geven je merkbaar meer grip op projecten." },
    { min: 70, label: "Volwassen & in control",      summary: "Je projectlandschap is goed op orde. De winst zit nu in verfijning en in het verzilveren van AI- en datawaarde bovenop een sterk fundament." },
    { min: 85, label: "Project-koploper",            summary: "Je behoort tot de voorhoede. Projecten en finance zijn realtime verbonden; de focus verschuift naar innovatie en margeoptimalisatie." },
  ],

  lead: {
    eyebrow: "Laatste stap",
    heading: "Ontvang je project-verbeterplan",
    sub: "We sturen je je diagnose plus concrete next steps per as. Een adviseur met bouw- en installatie-ervaring kijkt vrijblijvend mee.",
    privacy_url: "/info/privacy",
    thanks_heading: "Bedankt — je advies is onderweg",
    thanks_sub: "Een adviseur neemt binnen één werkdag contact op met je persoonlijke project-verbeterplan.",
  },
};
