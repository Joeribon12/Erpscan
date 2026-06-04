// ══════════════════════════════════════════════════════════════════════════
// SCAN: retail — "Retail & e-commerce: futureproof of vastgelopen?"
// Doelgroep: IT- & e-commerce-verantwoordelijken in retail / omnichannel.
// Zelfde engine/schema als de overige scans — alleen de inhoud verschilt.
// ══════════════════════════════════════════════════════════════════════════

export default {
  scan_id: "retail",
  title: "Retail-ready? Scan je omnichannel ERP-landschap",
  eyebrow: "Retail & e-commerce",
  audience: "Voor IT- & e-commerce-verantwoordelijken in retail",

  intro: {
    sub: "Klanten verwachten één naadloze ervaring over winkel, webshop en app. Deze scan meet in tien vragen hoe goed jouw ERP-landschap die belofte waarmaakt — van omnichannel-strategie tot realtime voorraad, data en seizoensschaalbaarheid. Je krijgt direct een diagnose met prioriteiten.",
    bullets: [
      "Nulmeting van je omnichannel-volwassenheid",
      "Zie waar voorraad, marges of klantdata je afremmen",
      "Concreet verbeterpunt per as, toegespitst op retail",
    ],
  },

  dimensions: [
    { id: "strategie",  label: "Strategie & omnichannel-koers" },
    { id: "ai",         label: "AI-readiness" },
    { id: "cleancore",  label: "Clean core & techniek" },
    { id: "data",       label: "Data & integratie (POS, webshop, PIM)" },
    { id: "schaal",     label: "Schaalbaarheid & seizoensprocessen" },
  ],

  questions: [
    {
      id: "q1", dimension: "strategie",
      text: "Is jullie ERP-roadmap gekoppeld aan een heldere omnichannel- en klantbelevingsstrategie?",
      options: [
        { label: "Nee, winkel en online zijn nog losse werelden", score: 0 },
        { label: "Er is ambitie, maar geen gedeelde roadmap", score: 1 },
        { label: "Omnichannel-doelen zijn afgestemd tussen IT en commercie", score: 2 },
        { label: "Eén klantgerichte roadmap met meetbare KPI's over alle kanalen", score: 3 },
      ],
    },
    {
      id: "q2", dimension: "strategie",
      text: "Hoe worden investeringen in retailtechnologie besloten?",
      options: [
        { label: "Ad hoc, gedreven door losse kanaal- of winkelvragen", score: 0 },
        { label: "IT beslist, commercie wordt geïnformeerd", score: 1 },
        { label: "Gezamenlijk IT/commercie met een vast besluitvormingsritme", score: 2 },
        { label: "Vanuit een klant- en margestrategie op directieniveau", score: 3 },
      ],
    },
    {
      id: "q3", dimension: "ai",
      text: "Benutten jullie AI voor zaken als vraagvoorspelling, personalisatie of prijsoptimalisatie?",
      options: [
        { label: "Nee, nog niet aan de orde", score: 0 },
        { label: "Losse pilots, niet in productie", score: 1 },
        { label: "Eerste use-cases live (bv. forecasting of aanbevelingen)", score: 2 },
        { label: "AI stuurt inkoop, prijs en personalisatie met meetbare omzetimpact", score: 3 },
      ],
    },
    {
      id: "q4", dimension: "ai",
      text: "Is jullie klant-, verkoop- en voorraaddata geschikt om AI betrouwbaar te voeden?",
      options: [
        { label: "Data zit versnipperd over kanalen en kassasystemen", score: 0 },
        { label: "Kerndata bestaat, maar kwaliteit en koppeling wisselen", score: 1 },
        { label: "Gecureerde klant- en verkoopdata met governance", score: 2 },
        { label: "Eén betrouwbaar klant- en verkoopbeeld dat AI direct benut", score: 3 },
      ],
    },
    {
      id: "q5", dimension: "cleancore",
      text: "Hoeveel maatwerk zit er in jullie ERP-kern?",
      options: [
        { label: "Zwaar gecustomiseerd; upgrades zijn pijnlijk", score: 0 },
        { label: "Veel maatwerk, deels ongedocumenteerd", score: 1 },
        { label: "Bewust beperkt; uitbreidingen waar mogelijk side-by-side", score: 2 },
        { label: "Clean core: kern standaard, kanaal-uitbreidingen losgekoppeld", score: 3 },
      ],
    },
    {
      id: "q6", dimension: "cleancore",
      text: "Hoe actueel is jullie ERP- en kassaplatform technisch?",
      options: [
        { label: "Op een versie die richting end-of-maintenance loopt", score: 0 },
        { label: "Ondersteund, maar enkele releases achter", score: 1 },
        { label: "Recente release met een upgradepad in beeld", score: 2 },
        { label: "Actuele (cloud)release met continue updates", score: 3 },
      ],
    },
    {
      id: "q7", dimension: "data",
      text: "Hoe goed zijn winkel (POS), webshop en marktplaatsen gekoppeld — is voorraad overal realtime?",
      options: [
        { label: "Kanalen werken los; voorraad loopt achter of klopt niet", score: 0 },
        { label: "Koppelingen bestaan, maar met vertraging en handwerk", score: 1 },
        { label: "Gestandaardiseerd via API's; voorraad vrijwel realtime", score: 2 },
        { label: "Eén realtime voorraad over alle kanalen (ship-from-store, click&collect)", score: 3 },
      ],
    },
    {
      id: "q8", dimension: "data",
      text: "Hoe is jullie product- en masterdata (PIM, assortiment, prijzen) georganiseerd?",
      options: [
        { label: "Versnipperd; inconsistente productinfo per kanaal", score: 0 },
        { label: "Per systeem eigen productdata, beperkt afgestemd", score: 1 },
        { label: "Centraal PIM/MDM met eigenaarschap op kerndomeinen", score: 2 },
        { label: "Eén bron voor product- en prijsdata, automatisch naar alle kanalen", score: 3 },
      ],
    },
    {
      id: "q9", dimension: "schaal",
      text: "Hoe goed schalen jullie processen mee met seizoenspieken en nieuwe kanalen of winkels?",
      options: [
        { label: "Pieken en uitrol lopen vast op handwerk en uitzonderingen", score: 0 },
        { label: "Het lukt, maar met veel firefighting", score: 1 },
        { label: "Processen zijn grotendeels gestandaardiseerd en geautomatiseerd", score: 2 },
        { label: "Schaalbaar by design: nieuw kanaal of filiaal in weken live", score: 3 },
      ],
    },
    {
      id: "q10", dimension: "schaal",
      text: "Hoeveel realtime inzicht hebben jullie in verkoop, voorraad en marges per kanaal?",
      options: [
        { label: "Nauwelijks; sturen gebeurt achteraf op losse rapporten", score: 0 },
        { label: "Losse rapportages, geen kanaaloverstijgend beeld", score: 1 },
        { label: "Dashboards op de belangrijkste retail-KPI's", score: 2 },
        { label: "Realtime kanaaloverzicht stuurt inkoop, prijs en bijbestelling", score: 3 },
      ],
    },
  ],

  advice: {
    strategie: {
      low:  { title: "Verbind winkel en online tot één koers", body: "Losse kanalen leiden tot losse keuzes en een gefragmenteerde klantbeleving. Begin met een gedeelde omnichannel-roadmap waarin IT en commercie dezelfde doelen najagen. Dat voorkomt dubbele investeringen en maakt de klantervaring consistent." },
      mid:  { title: "Maak besluitvorming ritmisch", body: "De afstemming staat. Versterk het met een vast besluitvormingsritme tussen IT en commercie en heldere business cases, zodat kanaalkeuzes elkaar versterken in plaats van beconcurreren." },
      high: { title: "Stuur op klantwaarde en marge", body: "Je staat er strategisch sterk voor. Verfijn door je roadmap te sturen op klantwaarde en marge per kanaal, en koppel retail-KPI's direct aan de directie-agenda." },
    },
    ai: {
      low:  { title: "Begin met vraagvoorspelling", body: "AI begint bij betrouwbare data en één use-case. Vraagvoorspelling of een aanbevelingsmodel levert snel zichtbare waarde in omzet of minder derving. Klein beginnen, snel leren." },
      mid:  { title: "Breng pilots naar productie", body: "Er gebeurt al iets, maar de stap naar productie ontbreekt. Schaal een bewezen use-case op met eigenaarschap en monitoring, zodat AI structureel bijdraagt aan omzet en voorraad." },
      high: { title: "Laat AI inkoop en prijs sturen", body: "AI levert al waarde. Versterk governance en herbruikbaarheid en laat AI inkoop, prijs en personalisatie geïntegreerd aansturen voor maximale marge-impact." },
    },
    cleancore: {
      low:  { title: "Bouw maatwerk af", body: "Zwaar maatwerk maakt elke upgrade duur en remt nieuwe kanalen af. Breng het maatwerk in kaart en verplaats kanaalspecifieke logica naar side-by-side uitbreidingen. Dit is je grootste hefboom richting wendbaarheid." },
      mid:  { title: "Bewaak de clean core", body: "Je bent op de goede weg. Maak clean core een expliciet principe, met kanaal-uitbreidingen losgekoppeld van de kern en duidelijke governance." },
      high: { title: "Houd de kern schoon en actueel", body: "Je kern is wendbaar. Borg dit met een vast updateritme, zodat je nieuwe kanalen en functionaliteit snel kunt adopteren." },
    },
    data: {
      low:  { title: "Maak voorraad realtime over kanalen", body: "Voorraad die niet klopt kost direct omzet en vertrouwen. Investeer in een integratielaag die POS, webshop en marktplaatsen verbindt, met één realtime voorraadbeeld. Dit fundament betaalt zich op elke andere as terug." },
      mid:  { title: "Standaardiseer koppelingen en PIM", body: "De richting klopt. Versterk door koppelingen te standaardiseren via API's en product-/prijsdata centraal te beheren, zodat elk kanaal dezelfde betrouwbare info toont." },
      high: { title: "Benut één klant- en productbeeld", body: "Je datafundament is sterk. Zet de stap naar event-driven, realtime data zodat ship-from-store, click&collect en personalisatie naadloos werken." },
    },
    schaal: {
      low:  { title: "Standaardiseer vóór de piek", body: "Seizoenspieken en kanaaluitrol lopen nu vast op handwerk. Standaardiseer en automatiseer je kernprocessen, zodat pieken en nieuwe winkels voorspelbaar worden in plaats van stressvol." },
      mid:  { title: "Automatiseer de uitzonderingen", body: "De kern draait. Richt je op de handmatige stappen die niet meeschalen en maak processen meetbaar, zodat groei en pieken beheersbaar blijven." },
      high: { title: "Stuur continu op verkoop en voorraad", body: "Je schaalt goed. Benut realtime inzicht om inkoop, prijs en bijbestelling datagedreven te sturen en nieuwe kanalen nóg sneller live te brengen." },
    },
  },

  verdicts: [
    { min: 0,  label: "Kanalen nog versnipperd",   summary: "Winkel en online opereren te los van elkaar. Juist daar zit de snelste winst: één voorraadbeeld en een gedeelde koers. Een gerichte nulmeting helpt prioriteren." },
    { min: 40, label: "Op weg naar omnichannel",   summary: "De basis komt op gang, maar de naadloze klantervaring is nog niet rond. Gerichte stappen op je zwakste assen maken je merkbaar wendbaarder." },
    { min: 70, label: "Volwassen omnichannel",     summary: "Je retaillandschap is goed op orde. De winst zit nu in verfijning en in het verzilveren van AI- en datawaarde bovenop een sterk fundament." },
    { min: 85, label: "Retail-koploper",           summary: "Je behoort tot de voorhoede. Kanalen, voorraad en data zijn naadloos verbonden; de focus verschuift naar innovatie en margeoptimalisatie." },
  ],

  lead: {
    eyebrow: "Laatste stap",
    heading: "Ontvang je omnichannel-verbeterplan",
    sub: "We sturen je je diagnose plus concrete next steps per as. Een adviseur met retail-ervaring kijkt vrijblijvend mee.",
    privacy_url: "#privacy",
    thanks_heading: "Bedankt — je advies is onderweg",
    thanks_sub: "Een adviseur neemt binnen één werkdag contact op met je persoonlijke retail-verbeterplan.",
  },
};
