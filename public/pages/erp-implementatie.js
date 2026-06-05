// ARTIKEL: erp-implementatie — "ERP-implementatie: succesfactoren en valkuilen"
// Layout: steps → callout → checklist → quote → related → cta
export default {
  page_id: "erp-implementatie",
  title: "ERP-implementatie: 6 succesfactoren (en de valkuilen)",
  eyebrow: "Kennisbank · Implementatie",
  backHref: "/info", backLabel: "← Kennisbank",
  intro: "Een ERP-implementatie is een van de grootste IT-trajecten die een organisatie aangaat. De techniek is zelden de bottleneck — proces, data en mensen wel. Dit zijn de factoren die het verschil maken.",

  sections: [
    {
      type: "steps",
      heading: "De route naar een geslaagde implementatie",
      items: [
        { title: "Begin bij de business, niet bij de software", body: "Bepaal eerst welke processen en doelen leidend zijn. De software volgt, niet andersom." },
        { title: "Kies een heldere scope", body: "Een te brede scope is dé valkuil. Begin afgebakend en breid gefaseerd uit." },
        { title: "Maak je data migratie-ready", body: "Schone stamdata is de stilste succesfactor. Begin er vroeg mee, niet op het laatst." },
        { title: "Standaardiseer richting best practices", body: "Volg de standaard waar het kan. Elk maatwerk is latere beheerlast." },
        { title: "Investeer in adoptie", body: "Training en verandermanagement bepalen of mensen écht meegaan. Reken er net zoveel tijd voor als voor de techniek." },
        { title: "Stuur op waarde na go-live", body: "Een implementatie eindigt niet bij go-live. Borg verbetering en benut wat je hebt gebouwd." },
      ],
    },
    {
      type: "callout",
      title: "De grootste valkuil",
      body: "De meeste ERP-trajecten lopen niet vast op techniek, maar op verandering: processen en mensen die niet meebewegen. Onderschat de menselijke kant nooit.",
    },
    {
      type: "checklist",
      heading: "Klaar om te starten? Check dit",
      items: [
        "Heldere, gedragen doelen vanuit de business",
        "Afgebakende scope met een gefaseerde aanpak",
        "Een plan voor datamigratie en -opschoning",
        "Bewuste keuze: standaard waar het kan, maatwerk waar het moet",
        "Tijd en budget gereserveerd voor adoptie en training",
      ],
    },
    {
      type: "quote",
      body: "Een ERP-implementatie is 20% techniek en 80% mensen en processen. Plan daar ook naar.",
    },
    {
      type: "related",
      heading: "Lees ook",
      items: [
        { label: "De business case voor een nieuw ERP-systeem", href: "/info/business-case-erp" },
        { label: "Wat is clean core?", href: "/info/clean-core" },
        { label: "ERP-systeem optimaliseren", href: "/info/optimaliseren" },
      ],
    },
  ],

  cta: {
    heading: "Staat je fundament klaar voor een nieuw systeem?",
    body: "De gratis ERP-scan brengt strategie, data, processen en techniek in kaart — een goede nulmeting vóór elk traject.",
    label: "Doe de ERP-scan", href: "/erp-systeem-scan",
  },
  sources: ["Gebaseerd op algemeen geaccepteerde implementatie-best-practices."],
};
