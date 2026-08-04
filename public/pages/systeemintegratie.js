// ══════════════════════════════════════════════════════════════════════════
// ARTIKEL (pillar): systeemintegratie — "ERP koppelen"
// Diepe gids met inhoudsopgave (toc), kort-antwoord (callout-variant),
// vergelijkingstabellen, stappenplan (steps), valkuilen (facts), FAQ en een
// inline lead-formulier (leadForm). Zelfde config-driven engine als de rest.
//
// Doelzoektermen (uit Search Console): "erp koppelen", "koppeling met
// erp-systemen", "erp laten integreren", "erp webshop koppelen".
//
// LET OP: doorlooptijden en kostenindicaties zijn INDICATIEF (orde van
// grootte) en bewust als zodanig gemarkeerd — geen harde cijfers.
// ══════════════════════════════════════════════════════════════════════════

export default {
  page_id: "systeemintegratie",
  title: "ERP koppelen: hoe je systemen betrouwbaar integreert",
  eyebrow: "Kennisbank · Integratie",
  readingTime: "9 min leestijd",
  date: "Laatst bijgewerkt: augustus 2026",
  toc: true,

  intro: "De meeste waarde lekt niet weg ín je systemen, maar ertússen. Zodra je ERP moet samenwerken met een webshop, WMS, CRM of de systemen van klanten en leveranciers, bepaalt de kwaliteit van je koppelingen of je organisatie soepel doorstroomt of vastloopt op handwerk, dubbele invoer en fouten. Deze gids legt uit hoe je je ERP koppelt: welke manieren er zijn, welk patroon wanneer past, wat een koppeling realistisch kost en welke fouten het vaakst worden gemaakt.",

  sections: [
    {
      type: "callout",
      variant: "answer",
      title: "Kort antwoord",
      body: "Je ERP koppelen kan grofweg op vier manieren: handmatige export/import, een directe point-to-point koppeling, een standaard connector van je leverancier, of een integratielaag (iPaaS) met herbruikbare API's. Voor één of twee simpele verbindingen volstaat een connector of point-to-point. Vanaf ongeveer vijf koppelingen — of zodra koppelingen bedrijfskritisch worden — verdient een integratielaag zich terug, omdat je dan één plek hebt voor monitoring, foutafhandeling en hergebruik. Het echte werk zit zelden in de techniek, maar in het afspreken welk systeem eigenaar is van welk gegeven.",
    },
    {
      type: "prose",
      heading: "Waarom koppelingen bepalend zijn voor je ERP",
      body: "Een ERP-systeem staat vrijwel nooit alleen. Er hangen webshops, e-mailmarketing, een WMS of magazijnscanners, een CRM, salarisverwerking, PIM-software en vaak ook EDI-verbindingen met klanten en leveranciers aan. Elk van die verbindingen is een plek waar gegevens kunnen stokken, verdubbelen of stilletjes verouderen. Wanneer een voorraadaantal in je webshop niet klopt met dat in je ERP, is dat zelden een voorraadprobleem — het is een koppelprobleem. Hetzelfde geldt voor orders die met de hand worden overgetypt, facturen die twee keer in de boekhouding belanden, of een klantadres dat in drie systemen anders staat. Naarmate een organisatie groeit, groeit het aantal verbindingen niet lineair maar kwadratisch mee: tien systemen die allemaal rechtstreeks met elkaar praten, kunnen in theorie vijfenveertig verbindingen opleveren. Dat is precies de reden waarom een landschap dat jarenlang prima werkte, op een gegeven moment onbeheersbaar aanvoelt zonder dat er iets nieuws is bijgekomen.",
    },
    {
      type: "checklist",
      heading: "Signalen dat je koppelingen je remmen",
      items: [
        "Medewerkers typen gegevens over van het ene scherm naar het andere",
        "Voorraad of prijzen kloppen niet tussen ERP, webshop en winkel",
        "Je merkt pas dat een koppeling stukliep doordat een klant belt",
        "Eén leverancier of één medewerker is de enige die de koppeling begrijpt",
        "Rapportages verschillen per systeem, dus er ontstaat discussie over cijfers",
        "Elke nieuwe klant of webshop betekent opnieuw maatwerk bouwen",
        "Een upgrade van je ERP wordt uitgesteld omdat koppelingen dan breken",
      ],
    },
    {
      type: "table",
      heading: "Vier manieren om je ERP te koppelen",
      headers: ["Aanpak", "Wat het is", "Wanneer passend", "Aandachtspunt"],
      rows: [
        ["Handmatig / export-import", "Bestanden exporteren en importeren, of gegevens overtypen", "Tijdelijke oplossing of zeer lage volumes", "Foutgevoelig, niet controleerbaar en schaalt niet mee met groei"],
        ["Point-to-point", "Directe koppeling tussen twee systemen, vaak maatwerk", "Eén of twee stabiele verbindingen die zelden wijzigen", "Bij meer koppelingen ontstaat een kluwen die niemand meer overziet"],
        ["Standaard connector", "Kant-en-klare koppeling van je ERP- of webshopleverancier", "Veelvoorkomende combinaties met standaardprocessen", "Je zit vast aan wat de connector ondersteunt; afwijkingen worden lastig"],
        ["Integratielaag (iPaaS)", "Centrale laag met herbruikbare API's, monitoring en foutafhandeling", "Groeiend landschap, bedrijfskritische stromen, meerdere kanalen", "Vraagt investering vooraf en kennis in huis of bij een partner"],
      ],
    },
    {
      type: "table",
      heading: "Welk koppelpatroon past bij welke situatie?",
      headers: ["Patroon", "Hoe het werkt", "Typisch gebruik"],
      rows: [
        ["Batch / periodiek", "Op vaste tijden een set gegevens doorzetten", "Financiële boekingen, dagelijkse artikelupdates, rapportagedata"],
        ["Request-reply (API)", "Systeem A vraagt, systeem B antwoordt direct", "Voorraad opvragen tijdens het afrekenen, adrescontrole, prijsberekening"],
        ["Event-driven", "Een gebeurtenis (order geplaatst) zet automatisch een stroom in gang", "Orderverwerking, statusupdates naar de klant, magazijnopdrachten"],
        ["Bestandsuitwisseling / EDI", "Gestandaardiseerde berichten met ketenpartners", "Orders, pakbonnen en facturen met grote klanten of leveranciers"],
      ],
    },
    {
      type: "steps",
      heading: "Stappenplan: zo pak je een ERP-koppeling aan",
      items: [
        { title: "1. Begin bij het proces, niet bij de techniek", body: "Beschrijf welke stap in het werkproces nu blijft hangen en wie daar last van heeft. Een koppeling die geen concreet knelpunt oplost, wordt zelden gebruikt en altijd duur onderhouden." },
        { title: "2. Bepaal per gegeven wie de eigenaar is", body: "Leg vast welk systeem de waarheid bevat voor artikelen, klanten, prijzen en voorraad. Dit is de belangrijkste beslissing in het hele traject: zonder één bron ontstaan er conflicten die geen enkele techniek oplost." },
        { title: "3. Kies richting: realtime of periodiek", body: "Niet alles hoeft direct. Voorraad tijdens het afrekenen wél, een financiële boeking meestal niet. Realtime is duurder om te bouwen en te beheren, dus zet het in waar het echt verschil maakt." },
        { title: "4. Ontwerp de foutafhandeling vooraf", body: "Bedenk wat er gebeurt als het andere systeem niet reageert of een bericht weigert. Wordt het opnieuw geprobeerd, komt het in een wachtrij, en wie krijgt bericht? Koppelingen falen niet zelden — ze falen voorspelbaar." },
        { title: "5. Bouw klein en meetbaar", body: "Begin met één stroom die aantoonbaar tijd bespaart en meet het effect. Een eerste succes maakt de rest van het traject aanzienlijk makkelijker te financieren en te verdedigen." },
        { title: "6. Richt monitoring in vóór livegang", body: "Zorg dat je zelf ziet dat een koppeling stokt, en niet je klant. Een eenvoudig alarm bij vastgelopen berichten voorkomt dat kleine storingen uitgroeien tot verstoorde leveringen." },
        { title: "7. Leg vast en draag over", body: "Documenteer welke velden waarheen gaan en wie eigenaar is. Koppelingen overleven de medewerker of leverancier die ze bouwde — dat moet ook voor de kennis gelden." },
      ],
    },
    {
      type: "facts",
      heading: "De vijf meestgemaakte fouten",
      items: [
        { title: "Geen eigenaar per gegeven", body: "Twee systemen die allebei denken de waarheid te bevatten, overschrijven elkaar. Dit is veruit de meestvoorkomende oorzaak van 'de voorraad klopt niet'." },
        { title: "Maatwerk in de ERP-kern", body: "Koppellogica in de kern van je ERP bouwen maakt elke upgrade duur en risicovol. Houd die logica buiten de kern, in een aparte laag of connector." },
        { title: "Alles realtime willen", body: "Realtime klinkt modern, maar verdrievoudigt vaak de complexiteit en de beheerlast. Kies het bewust, per stroom." },
        { title: "Geen monitoring", body: "Een koppeling zonder alarm is een koppeling waarvan je pas hoort als er schade is. Monitoring is geen luxe maar onderdeel van de oplevering." },
        { title: "Kennis bij één persoon", body: "Als één externe partij of één collega de enige is die de koppeling begrijpt, is dat een bedrijfsrisico — geen technisch detail." },
      ],
    },
    {
      type: "prose",
      heading: "Wat kost het koppelen van systemen?",
      body: "Een harde prijs is niet te geven, omdat de spreiding enorm is. Wel is de kostenopbouw voorspelbaar. Een eenvoudige koppeling via een bestaande standaardconnector is vooral een kwestie van configureren en testen, en blijft doorgaans beperkt tot dagen werk. Een maatwerkkoppeling tussen twee systemen vraagt analyse, bouw, testen en een acceptatietraject, en loopt al snel in de weken. Een integratielaag inrichten is een project op zich, maar verlaagt de kosten van élke koppeling daarna. Onderschat daarbij de doorlopende kosten niet: licenties voor de integratielaag, beheer, monitoring en het aanpassen van koppelingen wanneer een van de gekoppelde systemen verandert. Reken bij een langere levensduur op meer beheerkosten dan bouwkosten. Deze indelingen zijn indicatief en bedoeld als orde van grootte — vraag altijd een onderbouwing op basis van jouw specifieke landschap.",
    },
    {
      type: "callout",
      title: "Van fragiel naar robuust",
      body: "Veel losse point-to-point koppelingen vormen samen een kluwen die niemand meer durft aan te raken. De uitweg is zelden 'alles opnieuw bouwen', maar stap voor stap de belangrijkste stromen verplaatsen naar herbruikbare, gemonitorde API's — te beginnen bij de stroom die de meeste verstoring veroorzaakt.",
    },
    {
      type: "faq",
      heading: "Veelgestelde vragen over ERP koppelen",
      items: [
        { q: "Wat betekent het om systemen te koppelen?", a: "Systemen koppelen betekent dat twee of meer applicaties automatisch gegevens uitwisselen, zodat een gegeven maar één keer hoeft te worden vastgelegd. Denk aan een webshoporder die vanzelf als verkooporder in je ERP verschijnt, inclusief klantgegevens en voorraadmutatie." },
        { q: "Kan ik mijn ERP koppelen aan mijn webshop?", a: "Vrijwel altijd. Veel ERP- en webshopplatformen bieden standaardconnectoren voor de meestvoorkomende combinaties. Zijn je processen afwijkend, dan is een koppeling via API's of een integratielaag doorgaans de betere route, omdat je dan niet vastzit aan wat de connector toevallig ondersteunt." },
        { q: "Wat is het verschil tussen een API en EDI?", a: "Een API is een technische interface waarmee systemen elkaar direct bevragen of berichten sturen, meestal realtime. EDI is een gestandaardiseerd berichtformaat dat vooral in ketensamenwerking wordt gebruikt voor orders, pakbonnen en facturen, vaak in batches. Ze sluiten elkaar niet uit: veel organisaties gebruiken allebei." },
        { q: "Hoe lang duurt het om een koppeling te bouwen?", a: "Dat loopt sterk uiteen. Een standaardconnector configureren is indicatief een kwestie van dagen; een maatwerkkoppeling met testen en acceptatie eerder weken. Bepalend is zelden het programmeerwerk, maar de tijd die nodig is om af te spreken welk systeem eigenaar is van welk gegeven." },
        { q: "Wanneer heb ik een integratieplatform nodig?", a: "Zodra je meerdere koppelingen hebt die bedrijfskritisch zijn, of wanneer je merkt dat elke nieuwe klant of kanaal opnieuw maatwerk vraagt. De vuistregel die veel organisaties hanteren: vanaf ongeveer vijf koppelingen wegen de voordelen van hergebruik, centrale monitoring en uniforme foutafhandeling op tegen de investering." },
        { q: "Wat als mijn ERP verouderd is?", a: "Ook oudere systemen zijn meestal te koppelen, al is dat vaker via bestandsuitwisseling of een database-koppeling dan via moderne API's. Belangrijk is dan wel om te wegen of je blijft investeren in koppelingen rond een systeem dat je binnen enkele jaren vervangt." },
      ],
    },
    {
      type: "related",
      heading: "Lees ook",
      items: [
        { label: "Bedrijfsprocessen automatiseren: waar begin je?", href: "/info/processen-automatiseren" },
        { label: "Datakwaliteit verbeteren: master data als fundament", href: "/info/datakwaliteit" },
        { label: "Wat is clean core?", href: "/info/clean-core" },
        { label: "ERP-scan voor groothandel & distributie", href: "/erp-scan-groothandel" },
      ],
    },
  ],

  leadForm: {
    eyebrow: "Vraag een specialist",
    heading: "Vastgelopen op een koppeling?",
    sub: "Beschrijf in een paar zinnen welke systemen je wilt verbinden en waar het nu misgaat. Een onafhankelijke specialist reageert binnen één werkdag met een eerste inschatting — geen verkoopgesprek, geen verplichting.",
    question_label: "Wat wil je koppelen?",
    question_placeholder: "Bijv. groothandel, ERP moet gekoppeld worden aan onze webshop en aan EDI van twee grote klanten; voorraad loopt nu achter.",
    button: "Stuur mijn vraag",
    note: "Geen nieuwsbrief, geen automatische follow-ups.",
    privacy_url: "/info/privacy",
    thanks_heading: "Bedankt — je vraag is verstuurd",
    thanks_sub: "Een specialist neemt binnen één werkdag contact met je op met een eerste inschatting.",
  },

  sources: [
    "Algemene, leveranciersonafhankelijke uitleg van integratiepatronen (batch, request-reply, event-driven, EDI).",
    "Doorlooptijden en kostenopbouw zijn indicatief en bedoeld als orde van grootte; werkelijke cijfers hangen af van landschap, scope en uitgangssituatie.",
  ],
};
