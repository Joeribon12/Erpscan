// ══════════════════════════════════════════════════════════════════════════
// SCAN: groothandel — "Groothandel & distributie"
// Doelgroep: IT- & operations-leiders in groothandel / distributie.
// ══════════════════════════════════════════════════════════════════════════

export default {
  scan_id: "groothandel",
  title: "Groothandel futureproof? Scan je ERP-landschap",
  eyebrow: "Groothandel & distributie",
  audience: "Voor IT- & operations-leiders in groothandel",

  intro: {
    sub: "Krappe marges, grote assortimenten en veeleisende klanten: in de groothandel maakt je ERP het verschil tussen winst en weglek. Deze scan meet in tien vragen hoe sterk jouw landschap staat — van inkoopstrategie tot EDI, voorraad, data en orderschaalbaarheid. Je krijgt direct een diagnose met prioriteiten.",
    bullets: [
      "Nulmeting van je distributie-volwassenheid",
      "Zie waar marges, voorraad of koppelingen weglekken",
      "Concreet verbeterpunt per as, toegespitst op groothandel",
    ],
  },

  dimensions: [
    { id: "strategie",  label: "Strategie & inkoopkoers" },
    { id: "ai",         label: "AI-readiness" },
    { id: "cleancore",  label: "Clean core & techniek" },
    { id: "data",       label: "Data & integratie (EDI, webshop)" },
    { id: "schaal",     label: "Schaalbaarheid & orderprocessen" },
  ],

  questions: [
    {
      id: "q1", dimension: "strategie",
      text: "Is jullie ERP-roadmap gekoppeld aan concrete doelen rond marge, voorraad en klantbehoud?",
      options: [
        { label: "Nee, er is geen expliciete roadmap", score: 0 },
        { label: "Een IT-roadmap, los van commerciële doelen", score: 1 },
        { label: "Roadmap afgestemd met inkoop en sales", score: 2 },
        { label: "Meetbaar verbonden aan marge-, voorraad- en service-KPI's", score: 3 },
      ],
    },
    {
      id: "q2", dimension: "strategie",
      text: "Hoe worden grote ERP- en distributie-investeringen besloten?",
      options: [
        { label: "Ad hoc, gedreven door incidenten", score: 0 },
        { label: "IT beslist, business wordt geïnformeerd", score: 1 },
        { label: "Gedeeld IT/business met een vast ritme", score: 2 },
        { label: "Vanuit een margestrategie op directieniveau", score: 3 },
      ],
    },
    {
      id: "q3", dimension: "ai",
      text: "Benutten jullie AI voor vraagvoorspelling, inkoopoptimalisatie of dynamische prijzen?",
      options: [
        { label: "Nee, nog niet aan de orde", score: 0 },
        { label: "Losse pilots, niet in productie", score: 1 },
        { label: "Eerste use-cases live (bv. forecasting of besteladvies)", score: 2 },
        { label: "AI stuurt inkoop, voorraad en prijs met meetbare marge-impact", score: 3 },
      ],
    },
    {
      id: "q4", dimension: "ai",
      text: "Is jullie verkoop-, voorraad- en leveranciersdata geschikt om AI te voeden?",
      options: [
        { label: "Data is versnipperd; kwaliteit wisselt sterk", score: 0 },
        { label: "Kerndata bestaat, maar artikel- en prijsdata zijn niet altijd actueel", score: 1 },
        { label: "Gecureerde data met governance op de kerndomeinen", score: 2 },
        { label: "Eén betrouwbare databron die besteladvies en prognoses voedt", score: 3 },
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
      text: "Hoe verlopen jullie koppelingen met leveranciers en klanten (EDI, webshop, B2B-portaal)?",
      options: [
        { label: "Vooral handmatig; veel overtypen en fouten", score: 0 },
        { label: "Een mix van EDI en handwerk, weinig overzicht", score: 1 },
        { label: "Gestandaardiseerd via EDI/API's op de belangrijkste stromen", score: 2 },
        { label: "Volledig geautomatiseerde, gemonitorde keten (order-to-cash, EDI)", score: 3 },
      ],
    },
    {
      id: "q8", dimension: "data",
      text: "Hoe is het gesteld met master data (artikelen, prijzen, leveranciers, klanten)?",
      options: [
        { label: "Geen centrale afspraken; dubbele en tegenstrijdige data", score: 0 },
        { label: "Per systeem eigen masterdata, beperkt afgestemd", score: 1 },
        { label: "Centrale definities en eigenaarschap op kerndomeinen", score: 2 },
        { label: "Actief MDM met kwaliteitsmonitoring en duidelijke ownership", score: 3 },
      ],
    },
    {
      id: "q9", dimension: "schaal",
      text: "Hoe goed schalen jullie orderprocessen mee met volume, assortiment en nieuwe klanten?",
      options: [
        { label: "Groei loopt vast op handmatige orderstappen en uitzonderingen", score: 0 },
        { label: "Het lukt, maar met veel firefighting", score: 1 },
        { label: "Orderprocessen zijn grotendeels gestandaardiseerd en geautomatiseerd", score: 2 },
        { label: "Schaalbaar by design: nieuwe klanten/kanalen in weken aangesloten", score: 3 },
      ],
    },
    {
      id: "q10", dimension: "schaal",
      text: "Hoeveel realtime inzicht hebben jullie in voorraad, marges en leverbetrouwbaarheid?",
      options: [
        { label: "Nauwelijks; problemen worden pas achteraf zichtbaar", score: 0 },
        { label: "Losse rapportages, geen end-to-end beeld", score: 1 },
        { label: "Dashboards op de belangrijkste distributie-KPI's", score: 2 },
        { label: "Realtime inzicht stuurt inkoop, prijs en voorraadbeheer", score: 3 },
      ],
    },
  ],

  advice: {
    strategie: {
      low:  { title: "Verbind ERP aan marge en voorraad", body: "Zonder heldere koppeling tussen ERP-keuzes en marge blijft je ERP een kostenpost. Begin met een roadmap waarin elke investering aan een meetbaar doel hangt — marge, voorraadrotatie of leverbetrouwbaarheid. Zo wordt je ERP een margemotor." },
      mid:  { title: "Maak besluitvorming ritmisch", body: "De afstemming staat. Versterk met een vast besluitvormingsritme tussen IT, inkoop en sales en heldere business cases, zodat keuzes elkaar versterken." },
      high: { title: "Stuur op margewaarde", body: "Je staat er strategisch sterk voor. Verfijn door je portfolio te sturen op marge en risico en koppel distributie-KPI's aan de directie-agenda." },
    },
    ai: {
      low:  { title: "Begin met besteladvies of forecasting", body: "AI begint bij betrouwbare data en één use-case. Een besteladvies- of vraagvoorspellingsmodel verlaagt direct je voorraadkosten en nee-verkoop. Klein beginnen, snel leren." },
      mid:  { title: "Breng pilots naar productie", body: "Er gebeurt al iets, maar productie blijft uit. Schaal een bewezen use-case op met eigenaarschap en monitoring, zodat AI structureel je inkoop en voorraad verbetert." },
      high: { title: "Laat AI inkoop en prijs sturen", body: "AI levert al waarde. Versterk governance en herbruikbaarheid en laat AI inkoop, voorraad en prijs geïntegreerd sturen voor maximale marge." },
    },
    cleancore: {
      low:  { title: "Bouw maatwerk af", body: "Zwaar maatwerk maakt elke upgrade duur en risicovol. Breng het in kaart, behoud wat onderscheidend is en verplaats de rest naar de standaard of side-by-side extensies. Dit is je grootste hefboom richting wendbaarheid." },
      mid:  { title: "Bewaak de clean core", body: "Je bent op de goede weg. Maak clean core een expliciet principe met losgekoppelde uitbreidingen en duidelijke governance." },
      high: { title: "Houd de kern schoon en actueel", body: "Je kern is wendbaar. Borg dit met een vast updateritme en architectuurreviews." },
    },
    data: {
      low:  { title: "Automatiseer de keten met EDI/API's", body: "Handmatige orders en versnipperde masterdata kosten marge en veroorzaken fouten. Investeer in EDI/API-koppelingen met leveranciers en klanten en centrale artikel-/prijsdata. Dit fundament betaalt zich op elke andere as terug." },
      mid:  { title: "Standaardiseer koppelingen en ownership", body: "De richting klopt. Versterk door koppelingen te standaardiseren en eigenaarschap op masterdata vast te leggen, zodat data betrouwbaar en herbruikbaar wordt." },
      high: { title: "Maak de keten realtime", body: "Je datafundament is sterk. Zet de stap naar event-driven, gemonitorde integratie zodat order-to-cash realtime en betrouwbaar verloopt." },
    },
    schaal: {
      low:  { title: "Standaardiseer orderprocessen", body: "Groei loopt vast op handmatige orderstappen en uitzonderingen. Standaardiseer en automatiseer eerst je orderproces; dat haalt de firefighting eruit en maakt opschalen voorspelbaar." },
      mid:  { title: "Automatiseer de uitzonderingen", body: "De kern draait. Richt je op de handmatige stappen die niet meeschalen en maak processen meetbaar, zodat groei beheersbaar blijft." },
      high: { title: "Stuur continu op voorraad en marge", body: "Je schaalt goed. Benut realtime inzicht en process mining om voorraad, prijs en service datagedreven te sturen." },
    },
  },

  verdicts: [
    { min: 0,  label: "Fundament in opbouw",     summary: "Er liggen flinke kansen. Op meerdere assen ontbreekt nog een stevig fundament — juist daar zit de snelste winst in marge en voorraad. Een gerichte nulmeting helpt prioriteren." },
    { min: 40, label: "Op de goede weg",         summary: "De basis staat, maar het margepotentieel is nog niet benut. Gerichte stappen op je zwakste assen maken je distributie merkbaar efficiënter." },
    { min: 70, label: "Volwassen & wendbaar",    summary: "Je landschap is goed op orde. De winst zit nu in verfijning en in het verzilveren van AI- en datawaarde bovenop een sterk fundament." },
    { min: 85, label: "Distributie-koploper",    summary: "Je behoort tot de voorhoede. Keten, voorraad en data zijn geautomatiseerd; de focus verschuift naar innovatie en margeoptimalisatie." },
  ],

  lead: {
    eyebrow: "Laatste stap",
    heading: "Ontvang je distributie-verbeterplan",
    sub: "We sturen je je diagnose plus concrete next steps per as. Een adviseur met groothandel-ervaring kijkt vrijblijvend mee.",
    privacy_url: "/info/privacy",
    thanks_heading: "Bedankt — je advies is onderweg",
    thanks_sub: "Een adviseur neemt binnen één werkdag contact op met je persoonlijke verbeterplan.",
  },
};
