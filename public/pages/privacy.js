// ══════════════════════════════════════════════════════════════════════════
// PAGINA: privacy — Privacyverklaring (AVG/GDPR)
// Gerenderd door de engine (renderArticle), bereikbaar op /info/privacy.
//
// LET OP — dit is een CONCEPT-TEMPLATE. De juridisch bindende invulling
// (verantwoordelijke organisatie, bewaartermijn, contactgegevens, grondslag,
// doorgifte-waarborgen) staat als «...» en MOET door de privacy officer / DPO
// van de verantwoordelijke organisatie worden ingevuld en goedgekeurd vóór
// publicatie met echte bezoekers.
// ══════════════════════════════════════════════════════════════════════════

export default {
  page_id: "privacy",
  title: "Privacyverklaring",
  eyebrow: "Privacy",
  backHref: "/",
  backLabel: "← Terug naar de site",
  intro: "Deze verklaring legt uit welke persoonsgegevens we via deze ERP-scan verwerken, waarom, en welke rechten je hebt. Let op: dit is een conceptversie die nog door de verantwoordelijke organisatie (privacy officer/DPO) moet worden ingevuld en goedgekeurd; onderdelen tussen «haken» zijn nog niet definitief.",

  sections: [
    {
      type: "prose",
      heading: "1. Wie is verantwoordelijk voor je gegevens?",
      body: [
        "De verwerkingsverantwoordelijke voor de gegevens die je via deze scan achterlaat is: «naam organisatie», «adres», «KvK-nummer», bereikbaar via «e-mailadres».",
        "Voor privacyvragen kun je contact opnemen met «privacy-contact / functionaris gegevensbescherming (FG/DPO)».",
      ],
    },
    {
      type: "prose",
      heading: "2. Welke gegevens we verwerken",
      body: [
        "Contactgegevens die je in het formulier invult: naam, organisatie, zakelijk e-mailadres en (optioneel) telefoonnummer.",
        "Je antwoorden op de scanvragen en de daaruit berekende scores, plus je profielantwoorden (huidig ERP-systeem, indicatie van jaaromzet en aantal werknemers/gebruikers).",
        "Beperkte technische gegevens, zoals de pagina waarvandaan je verstuurde en het tijdstip van verzending.",
      ],
    },
    {
      type: "prose",
      heading: "3. Waarvoor en op welke grondslag",
      body: [
        "We gebruiken deze gegevens om je scanresultaat te verwerken en om contact met je op te nemen over je uitkomst en passend ERP-advies.",
        "De grondslag hiervoor is je toestemming, die je geeft via het vinkje bij het formulier. «Bevestig met legal of (mede) gerechtvaardigd belang van toepassing is.» Je kunt je toestemming altijd intrekken; dat heeft geen gevolgen voor verwerkingen die daarvóór hebben plaatsgevonden.",
      ],
    },
    {
      type: "prose",
      heading: "4. Met wie we je gegevens delen",
      body: [
        "Verwerkers die ons helpen de dienst te leveren: Cloudflare (hosting en verwerking van het formulierverzoek) en Resend (bezorging van de e-mail met je aanvraag). Met deze partijen zijn/worden verwerkersovereenkomsten gesloten.",
        "Intern: je gegevens worden ontvangen door «de verantwoordelijke organisatie», waarna een medewerker (sales/advies) contact met je opneemt. «Vermeld hier expliciet de ontvangende organisatie(s) — bijvoorbeeld als de leads bij een specifiek bedrijf terechtkomen.»",
        "We verkopen je gegevens niet en gebruiken ze niet voor andere doeleinden dan hierboven beschreven.",
      ],
    },
    {
      type: "prose",
      heading: "5. Doorgifte buiten de EER",
      body: "Resend (e-mailbezorging) is gevestigd in de Verenigde Staten. Hierdoor kunnen gegevens buiten de Europese Economische Ruimte worden verwerkt. Dit gebeurt op basis van «passende waarborgen, bijvoorbeeld EU-modelcontractbepalingen (SCC's) en/of het EU-US Data Privacy Framework — door legal te bevestigen».",
    },
    {
      type: "prose",
      heading: "6. Hoe lang we je gegevens bewaren",
      body: "We bewaren je gegevens niet langer dan nodig voor het hierboven beschreven doel: «bewaartermijn invullen, bijvoorbeeld tot maximaal 12 maanden na het laatste contact, tenzij een langere termijn wettelijk vereist is».",
    },
    {
      type: "prose",
      heading: "7. Beveiliging",
      body: "We nemen passende technische en organisatorische maatregelen om je gegevens te beschermen, waaronder versleutelde verbindingen (HTTPS) en beperkte toegang tot de ontvangen gegevens.",
    },
    {
      type: "prose",
      heading: "8. Cookies en tracking",
      body: [
        "Deze website plaatst geen tracking- of advertentiecookies en gebruikt geen analytics-software.",
        "Wel worden lettertypen geladen via Google Fonts. Daarbij kan je IP-adres aan Google worden doorgegeven. «Overweeg de lettertypen zelf te hosten om dit te voorkomen.»",
      ],
    },
    {
      type: "prose",
      heading: "9. Je rechten",
      body: [
        "Je hebt het recht op inzage, rectificatie en verwijdering van je gegevens, op beperking van en bezwaar tegen de verwerking, en op gegevensoverdraagbaarheid. Ook kun je een gegeven toestemming intrekken.",
        "Een verzoek indienen kan via «privacy-contact». Daarnaast heb je het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).",
      ],
    },
    {
      type: "prose",
      heading: "10. Contact en wijzigingen",
      body: "Vragen over deze verklaring? Neem contact op via «privacy-contact». We kunnen deze privacyverklaring van tijd tot tijd aanpassen. Laatst bijgewerkt: «datum invullen» (conceptversie).",
    },
  ],
};
