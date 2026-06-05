// ══════════════════════════════════════════════════════════════════════════
// SCAN: food — "Food & beverage / procesindustrie"
// Doelgroep: IT-, productie- & kwaliteitsverantwoordelijken in food.
// ══════════════════════════════════════════════════════════════════════════

export default {
  scan_id: "erp-scan-food",
  title: "Food-proof? Scan je ERP-landschap",
  eyebrow: "Food & beverage · procesindustrie",
  audience: "Voor IT-, productie- & kwaliteitsleiders in food",

  intro: {
    sub: "Houdbaarheid, traceerbaarheid en strenge kwaliteitseisen laten geen ruimte voor losse systemen. Deze scan meet in tien vragen hoe goed jouw ERP-landschap de foodketen ondersteunt — van strategie tot batchtracering, data en productieschaalbaarheid. Je krijgt direct een diagnose met prioriteiten.",
    bullets: [
      "Nulmeting van je food-volwassenheid (traceability, compliance)",
      "Zie waar derving, recalls of handwerk je raken",
      "Concreet verbeterpunt per as, toegespitst op food",
    ],
  },

  dimensions: [
    { id: "strategie",  label: "Strategie & ketenkoers" },
    { id: "ai",         label: "AI-readiness" },
    { id: "cleancore",  label: "Clean core & techniek" },
    { id: "data",       label: "Data & traceability" },
    { id: "schaal",     label: "Schaalbaarheid & productieprocessen" },
  ],

  questions: [
    {
      id: "q1", dimension: "strategie",
      text: "Is jullie ERP-roadmap gekoppeld aan doelen rond marge, derving en compliance?",
      options: [
        { label: "Nee, er is geen expliciete roadmap", score: 0 },
        { label: "Een IT-roadmap, los van productie en kwaliteit", score: 1 },
        { label: "Roadmap afgestemd met productie en QA", score: 2 },
        { label: "Meetbaar verbonden aan marge-, derving- en compliance-KPI's", score: 3 },
      ],
    },
    {
      id: "q2", dimension: "strategie",
      text: "Hoe worden grote ERP- en productie-investeringen besloten?",
      options: [
        { label: "Ad hoc, gedreven door incidenten of audits", score: 0 },
        { label: "IT beslist, business wordt geïnformeerd", score: 1 },
        { label: "Gedeeld IT/business met een vast ritme", score: 2 },
        { label: "Vanuit een keten- en margestrategie op directieniveau", score: 3 },
      ],
    },
    {
      id: "q3", dimension: "ai",
      text: "Benutten jullie AI voor vraagvoorspelling, dervingsreductie of kwaliteitscontrole?",
      options: [
        { label: "Nee, nog niet aan de orde", score: 0 },
        { label: "Losse pilots, niet in productie", score: 1 },
        { label: "Eerste use-cases live (bv. forecasting of vision-inspectie)", score: 2 },
        { label: "AI is ingebed in planning, derving en kwaliteit met meetbare waarde", score: 3 },
      ],
    },
    {
      id: "q4", dimension: "ai",
      text: "Is jullie productie-, recept- en kwaliteitsdata geschikt om AI te voeden?",
      options: [
        { label: "Data zit verspreid over ERP, MES en Excel; kwaliteit wisselt", score: 0 },
        { label: "Kerndata bestaat, maar recepturen/charges zijn niet altijd actueel", score: 1 },
        { label: "Gecureerde productie- en kwaliteitsdata met governance", score: 2 },
        { label: "Eén betrouwbare databron die forecasting en kwaliteit direct voedt", score: 3 },
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
      text: "Hoe actueel is jullie ERP- en productieplatform technisch?",
      options: [
        { label: "Op een versie die richting end-of-maintenance loopt", score: 0 },
        { label: "Ondersteund, maar enkele releases achter", score: 1 },
        { label: "Recente release met een upgradepad in beeld", score: 2 },
        { label: "Actuele (cloud)release met continue updates", score: 3 },
      ],
    },
    {
      id: "q7", dimension: "data",
      text: "Hoe snel kun je een charge traceren bij een recall (van grondstof tot klant)?",
      options: [
        { label: "Dat kost uren tot dagen handmatig uitzoeken", score: 0 },
        { label: "Het kan, maar via meerdere systemen en handwerk", score: 1 },
        { label: "Traceability is geregeld op de belangrijkste stromen", score: 2 },
        { label: "Volledige batch-tracering end-to-end binnen minuten", score: 3 },
      ],
    },
    {
      id: "q8", dimension: "data",
      text: "Hoe is jullie master- en stamdata (artikelen, recepturen, leveranciers) georganiseerd?",
      options: [
        { label: "Geen centrale afspraken; dubbele en verouderde data", score: 0 },
        { label: "Per systeem eigen masterdata, beperkt afgestemd", score: 1 },
        { label: "Centrale definities en eigenaarschap op kerndomeinen", score: 2 },
        { label: "Actief MDM met kwaliteitsmonitoring en duidelijke ownership", score: 3 },
      ],
    },
    {
      id: "q9", dimension: "schaal",
      text: "Hoeveel van jullie productie- en kwaliteitsprocessen draaien op de standaard (i.p.v. werkarounds)?",
      options: [
        { label: "Grotendeels op maatwerk en werkarounds buiten het systeem", score: 0 },
        { label: "Mix van standaard en veel uitzonderingen", score: 1 },
        { label: "Overwegend standaard, met bewuste uitzonderingen", score: 2 },
        { label: "Gestandaardiseerd en geautomatiseerd, klaar voor best practices", score: 3 },
      ],
    },
    {
      id: "q10", dimension: "schaal",
      text: "Hoeveel realtime inzicht hebben jullie in productie, derving en houdbaarheid?",
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
      low:  { title: "Verbind ERP aan keten en compliance", body: "Zonder heldere koppeling tussen ERP-keuzes en keten-/compliancedoelen blijven beslissingen reactief. Begin met een roadmap waarin elke investering aan een meetbaar doel hangt — marge, derving of audit-readiness. Dat maakt je ERP een ketenmotor." },
      mid:  { title: "Maak besluitvorming ritmisch", body: "De afstemming staat. Versterk met een vast ritme tussen IT, productie en QA en heldere business cases, zodat keuzes elkaar versterken." },
      high: { title: "Stuur op keten- en margewaarde", body: "Je staat er strategisch sterk voor. Verfijn door te sturen op marge en risico en koppel keten-KPI's aan de directie-agenda." },
    },
    ai: {
      low:  { title: "Begin met forecasting of dervingsreductie", body: "AI begint bij betrouwbare data en één use-case. Vraagvoorspelling of een dervingsmodel levert snel zichtbare waarde. Klein beginnen, snel leren." },
      mid:  { title: "Breng pilots naar productie", body: "Er gebeurt al iets, maar productie blijft uit. Schaal een bewezen use-case op met eigenaarschap en monitoring, zodat AI structureel bijdraagt aan planning en kwaliteit." },
      high: { title: "Verweef AI in de keten", body: "AI levert al waarde. Versterk governance en herbruikbaarheid en verbind planning, derving en kwaliteit voor maximale impact." },
    },
    cleancore: {
      low:  { title: "Bouw maatwerk af", body: "Zwaar maatwerk maakt elke upgrade duur en bemoeilijkt validatie. Breng het in kaart, behoud wat onderscheidend is en verplaats de rest naar de standaard of side-by-side extensies. Dit is je grootste hefboom richting wendbaarheid." },
      mid:  { title: "Bewaak de clean core", body: "Je bent op de goede weg. Maak clean core een expliciet principe met losgekoppelde uitbreidingen en duidelijke governance." },
      high: { title: "Houd de kern schoon en actueel", body: "Je kern is wendbaar. Borg dit met een vast updateritme en architectuurreviews." },
    },
    data: {
      low:  { title: "Maak traceability waterdicht", body: "Trage tracering is een direct risico bij recalls en audits. Investeer in batch-tracering end-to-end en centrale stamdata voor artikelen en recepturen. Dit fundament beschermt je merk én betaalt zich op elke andere as terug." },
      mid:  { title: "Standaardiseer tracering en ownership", body: "De richting klopt. Versterk de tracering op alle stromen en leg eigenaarschap op stamdata vast, zodat data betrouwbaar en auditklaar is." },
      high: { title: "Maak data realtime en betrouwbaar", body: "Je datafundament is sterk. Zet de stap naar realtime, gemonitorde tracering zodat keten en kwaliteit op dezelfde waarheid sturen." },
    },
    schaal: {
      low:  { title: "Standaardiseer vóór je opschaalt", body: "Werkarounds buiten het systeem schalen niet mee en vergroten het compliancerisico. Standaardiseer en automatiseer je productie- en kwaliteitsprocessen richting best practices, zodat opschalen voorspelbaar wordt." },
      mid:  { title: "Ruim de uitzonderingen op", body: "De kern draait op standaard. Pak de handmatige stappen aan en maak processen meetbaar, zodat opschalen beheersbaar blijft." },
      high: { title: "Stuur productie datagedreven", body: "Je processen zijn schaalbaar. Benut realtime inzicht en process mining om derving en doorlooptijd continu te verbeteren." },
    },
  },

  verdicts: [
    { min: 0,  label: "Compliancerisico: hoog",  summary: "Trage tracering en handwerk maken je kwetsbaar bij audits en recalls. Juist hier zit de snelste winst: traceability en stamdata op orde. Een gerichte nulmeting helpt prioriteren." },
    { min: 40, label: "Op de goede weg",         summary: "De basis komt op gang, maar het potentieel is nog niet benut. Gerichte stappen op je zwakste assen maken je keten merkbaar robuuster." },
    { min: 70, label: "Volwassen & auditklaar",  summary: "Je foodlandschap is goed op orde. De winst zit nu in verfijning en in het verzilveren van AI- en datawaarde bovenop een sterk fundament." },
    { min: 85, label: "Food-koploper",           summary: "Je behoort tot de voorhoede. Tracering, kwaliteit en data zijn op orde; de focus verschuift naar innovatie en het terugdringen van derving." },
  ],

  lead: {
    eyebrow: "Laatste stap",
    heading: "Ontvang je food-verbeterplan",
    sub: "We sturen je je diagnose plus concrete next steps per as. Een adviseur met food-ervaring kijkt vrijblijvend mee.",
    privacy_url: "/info/privacy",
    thanks_heading: "Bedankt — je advies is onderweg",
    thanks_sub: "Een adviseur neemt binnen één werkdag contact op met je persoonlijke food-verbeterplan.",
  },
};
