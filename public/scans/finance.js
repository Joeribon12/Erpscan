// ══════════════════════════════════════════════════════════════════════════
// SCAN: finance — "Finance & control (CFO)"
// Doelgroep: CFO's, finance managers & business-controllers.
// ══════════════════════════════════════════════════════════════════════════

export default {
  scan_id: "finance",
  title: "Future-finance? Scan je financiële ERP-landschap",
  eyebrow: "Finance & control",
  audience: "Voor CFO's, finance managers & controllers",

  intro: {
    sub: "Snellere afsluitingen, betrouwbare cijfers en grip op compliance: finance staat onder druk om méér te leveren met dezelfde data. Deze scan meet in tien vragen hoe futureproof jouw financiële landschap is — van finance-strategie tot één bron van waarheid, AI en afsluitprocessen. Je krijgt direct een diagnose met prioriteiten.",
    bullets: [
      "Nulmeting van je finance-volwassenheid",
      "Zie waar je afsluiting, data of compliance je remmen",
      "Concreet verbeterpunt per as, toegespitst op finance",
    ],
  },

  dimensions: [
    { id: "strategie",  label: "Strategie & finance-transformatie" },
    { id: "ai",         label: "AI-readiness" },
    { id: "cleancore",  label: "Clean core & techniek" },
    { id: "data",       label: "Data & één bron van waarheid" },
    { id: "schaal",     label: "Schaalbaarheid & afsluitprocessen" },
  ],

  questions: [
    {
      id: "q1", dimension: "strategie",
      text: "Is jullie finance-roadmap gekoppeld aan concrete doelen rond rapportage, compliance en groei?",
      options: [
        { label: "Nee, finance volgt vooral de waan van de dag", score: 0 },
        { label: "Er is ambitie, maar geen expliciete roadmap", score: 1 },
        { label: "Roadmap afgestemd met IT en business", score: 2 },
        { label: "Meetbaar verbonden aan closing-, compliance- en stuur-KPI's", score: 3 },
      ],
    },
    {
      id: "q2", dimension: "strategie",
      text: "Hoe wordt de rol van finance gezien — administratief of als strategische businesspartner?",
      options: [
        { label: "Vooral administratief en terugkijkend", score: 0 },
        { label: "Deels sturend, maar reactief", score: 1 },
        { label: "Actieve businesspartner op de belangrijkste thema's", score: 2 },
        { label: "Strategische partner die met data de koers mede bepaalt", score: 3 },
      ],
    },
    {
      id: "q3", dimension: "ai",
      text: "Benutten jullie AI voor forecasting, anomaliedetectie of automatische boekingen?",
      options: [
        { label: "Nee, nog niet aan de orde", score: 0 },
        { label: "Losse pilots, niet in productie", score: 1 },
        { label: "Eerste use-cases live (bv. forecasting of factuurherkenning)", score: 2 },
        { label: "AI is ingebed in forecasting, controle en boekingen met meetbare waarde", score: 3 },
      ],
    },
    {
      id: "q4", dimension: "ai",
      text: "Is jullie financiële data geschikt om AI en realtime stuurinformatie te voeden?",
      options: [
        { label: "Data is versnipperd over systemen en spreadsheets", score: 0 },
        { label: "Kerndata bestaat, maar consolidatie kost handwerk", score: 1 },
        { label: "Gecureerde financiële data met governance", score: 2 },
        { label: "Eén betrouwbare financiële bron die AI en sturing direct voedt", score: 3 },
      ],
    },
    {
      id: "q5", dimension: "cleancore",
      text: "Hoeveel maatwerk zit er in jullie financiële ERP-kern?",
      options: [
        { label: "Zwaar gecustomiseerd; upgrades zijn pijnlijk", score: 0 },
        { label: "Veel maatwerk, deels ongedocumenteerd", score: 1 },
        { label: "Bewust beperkt; uitbreidingen waar mogelijk side-by-side", score: 2 },
        { label: "Clean core: kern standaard, extensies losgekoppeld", score: 3 },
      ],
    },
    {
      id: "q6", dimension: "cleancore",
      text: "Hoe actueel is jullie financiële platform (bv. richting S/4HANA Finance)?",
      options: [
        { label: "Op een versie die richting end-of-maintenance loopt", score: 0 },
        { label: "Ondersteund, maar enkele releases achter", score: 1 },
        { label: "Recente release met een upgradepad in beeld", score: 2 },
        { label: "Actuele (cloud)release met continue updates", score: 3 },
      ],
    },
    {
      id: "q7", dimension: "data",
      text: "Hebben jullie één betrouwbare bron van waarheid voor financiële cijfers?",
      options: [
        { label: "Nee, cijfers verschillen per systeem of rapport", score: 0 },
        { label: "Eén hoofdsysteem, maar veel aanvullingen in Excel", score: 1 },
        { label: "Centrale definities en governance op de kerncijfers", score: 2 },
        { label: "Eén gegovernde bron; iedereen rapporteert op dezelfde cijfers", score: 3 },
      ],
    },
    {
      id: "q8", dimension: "data",
      text: "Hoe is jullie financiële master data (grootboek, kostenplaatsen, entiteiten) georganiseerd?",
      options: [
        { label: "Inconsistent; mapping kost veel handwerk", score: 0 },
        { label: "Per entiteit eigen inrichting, beperkt afgestemd", score: 1 },
        { label: "Geharmoniseerd op de belangrijkste structuren", score: 2 },
        { label: "Actief beheerd model met heldere ownership en governance", score: 3 },
      ],
    },
    {
      id: "q9", dimension: "schaal",
      text: "Hoe verloopt jullie maand- en jaarafsluiting?",
      options: [
        { label: "Lang, handmatig en stressvol; veel correcties achteraf", score: 0 },
        { label: "Het lukt, maar met veel handwerk en lange doorlooptijd", score: 1 },
        { label: "Grotendeels gestandaardiseerd, deels geautomatiseerd", score: 2 },
        { label: "Snelle, grotendeels geautomatiseerde close (continuous accounting)", score: 3 },
      ],
    },
    {
      id: "q10", dimension: "schaal",
      text: "Hoe goed schaalt finance mee bij groei, nieuwe entiteiten of overnames?",
      options: [
        { label: "Elke nieuwe entiteit is een handmatig project van maanden", score: 0 },
        { label: "Het lukt, maar met veel firefighting", score: 1 },
        { label: "Processen zijn grotendeels gestandaardiseerd en herhaalbaar", score: 2 },
        { label: "Schaalbaar by design: nieuwe entiteiten in weken aangesloten", score: 3 },
      ],
    },
  ],

  advice: {
    strategie: {
      low:  { title: "Maak finance strategisch", body: "Een puur administratieve finance-functie laat waarde liggen. Begin met een roadmap die finance koppelt aan stuur- en compliancedoelen, zodat investeringen bijdragen aan snellere closing en betere besluitvorming in plaats van alleen verantwoording." },
      mid:  { title: "Versterk de businesspartnerrol", body: "Finance stuurt al deels mee. Versterk met een vast ritme tussen finance, IT en business en heldere business cases, zodat data structureel de koers ondersteunt." },
      high: { title: "Stuur op waarde met data", body: "Finance is een strategische partner. Verfijn door realtime stuurinformatie te verankeren in de directie-agenda en finance-KPI's leidend te maken." },
    },
    ai: {
      low:  { title: "Begin met forecasting of factuurherkenning", body: "AI begint bij betrouwbare data en één use-case. Forecasting of document-AI voor facturen levert snel zichtbare tijdwinst. Klein beginnen, snel leren." },
      mid:  { title: "Breng pilots naar productie", body: "Er gebeurt al iets, maar productie blijft uit. Schaal een bewezen use-case op met eigenaarschap en monitoring, zodat AI structureel bijdraagt aan forecasting en controle." },
      high: { title: "Verweef AI in finance", body: "AI levert al waarde. Versterk governance en herbruikbaarheid en verbind forecasting, anomaliedetectie en boekingen voor maximale impact." },
    },
    cleancore: {
      low:  { title: "Bouw maatwerk af", body: "Zwaar maatwerk maakt elke upgrade duur en risicovol — juist in finance, waar betrouwbaarheid telt. Breng het in kaart en verplaats wat kan naar de standaard of side-by-side extensies. Dit is je grootste hefboom richting wendbaarheid." },
      mid:  { title: "Bewaak de clean core", body: "Je bent op de goede weg. Maak clean core een expliciet principe met losgekoppelde uitbreidingen en duidelijke governance." },
      high: { title: "Houd de kern schoon en actueel", body: "Je kern is wendbaar. Borg dit met een vast updateritme, zodat je nieuwe finance-functionaliteit snel adopteert." },
    },
    data: {
      low:  { title: "Creëer één bron van waarheid", body: "Cijfers die per systeem verschillen kosten vertrouwen en tijd. Investeer in één gegovernde financiële bron en geharmoniseerde masterdata. Dit fundament versnelt je closing én betaalt zich op elke andere as terug." },
      mid:  { title: "Harmoniseer model en ownership", body: "De richting klopt. Versterk door je financiële datamodel te harmoniseren en eigenaarschap vast te leggen, zodat iedereen op dezelfde cijfers stuurt." },
      high: { title: "Maak stuurinformatie realtime", body: "Je datafundament is sterk. Zet de stap naar realtime, betrouwbare stuurinformatie zodat finance en business op dezelfde waarheid sturen." },
    },
    schaal: {
      low:  { title: "Versnel en standaardiseer de close", body: "Een lange, handmatige afsluiting kost tijd en vergroot het foutrisico. Standaardiseer en automatiseer je afsluitstappen richting continuous accounting; dat verkort de doorlooptijd en maakt groei beheersbaar." },
      mid:  { title: "Automatiseer de afsluitstappen", body: "De close draait, maar handwerk remt. Pak de handmatige stappen aan en maak het proces meetbaar, zodat afsluiten sneller en voorspelbaarder wordt." },
      high: { title: "Stuur continu op de cijfers", body: "Je close is snel. Benut continuous accounting en process mining om de afsluiting nóg verder te versnellen en nieuwe entiteiten moeiteloos aan te sluiten." },
    },
  },

  verdicts: [
    { min: 0,  label: "Finance loopt achter de feiten aan", summary: "Versnipperde data en handmatige afsluitingen kosten tijd en vertrouwen. Juist hier zit de snelste winst: één bron van waarheid en een snellere close. Een gerichte nulmeting helpt prioriteren." },
    { min: 40, label: "Op de goede weg",                    summary: "De basis staat, maar het potentieel is nog niet benut. Gerichte stappen op je zwakste assen maken finance merkbaar sneller en betrouwbaarder." },
    { min: 70, label: "Volwassen & sturend",               summary: "Je financiële landschap is goed op orde. De winst zit nu in verfijning en in het verzilveren van AI- en datawaarde bovenop een sterk fundament." },
    { min: 85, label: "Finance-koploper",                  summary: "Je behoort tot de voorhoede. Data en afsluiting zijn op orde; finance stuurt realtime mee op de koers van de organisatie." },
  ],

  lead: {
    eyebrow: "Laatste stap",
    heading: "Ontvang je finance-verbeterplan",
    sub: "We sturen je je diagnose plus concrete next steps per as. Een adviseur met finance-ervaring kijkt vrijblijvend mee.",
    privacy_url: "/info/privacy",
    thanks_heading: "Bedankt — je advies is onderweg",
    thanks_sub: "Een adviseur neemt binnen één werkdag contact op met je persoonlijke finance-verbeterplan.",
  },
};
