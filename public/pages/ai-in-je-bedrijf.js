// ARTIKEL: ai-in-je-bedrijf — "Hoe pas ik AI toe in mijn bedrijf?"
// Layout: stats → steps → callout → related → cta
export default {
  page_id: "ai-in-je-bedrijf",
  title: "Hoe pas ik AI toe in mijn bedrijf? Een praktisch stappenplan",
  eyebrow: "Kennisbank · AI & groei",
  backHref: "/info", backLabel: "← Kennisbank",
  intro: "AI is geen toekomstmuziek meer, maar waar begin je? Niet bij een groot platform, maar bij één concrete use-case met meetbare waarde. Dit is hoe je AI praktisch toepast in je bedrijf — bovenop een gezond ERP-systeem.",

  sections: [
    {
      type: "stats",
      heading: "Waarom nu?",
      items: [
        { value: "1 use-case", label: "is genoeg om te starten — niet een heel AI-platform", note: "" },
        { value: "data", label: "is in de praktijk de grootste blokkade, niet het model", note: "" },
        { value: "~weken", label: "tot waarde bij een afgebakende eerste use-case", note: "indicatief" },
      ],
    },
    {
      type: "steps",
      heading: "In 5 stappen van idee naar waarde",
      items: [
        { title: "Kies één concreet probleem", body: "Begin bij een proces met veel handwerk of voorspelbaarheid: factuurherkenning, vraagvoorspelling of klantvragen. Klein en meetbaar." },
        { title: "Check je data", body: "AI is zo goed als de data eronder. Zorg dat de benodigde data compleet, schoon en bereikbaar is — vaak ligt hier het echte werk." },
        { title: "Bouw een kleine pilot", body: "Test met echte data op kleine schaal. Meet het effect (tijd, fouten, omzet) tegen de huidige situatie." },
        { title: "Zet 'm in productie met een eigenaar", body: "Een model zonder eigenaar verzandt. Wijs iemand aan die de waarde en kwaliteit bewaakt en monitort." },
        { title: "Schaal op naar de volgende use-case", body: "Eén werkende toepassing opent de deur naar de volgende. Bouw herbruikbaarheid en governance op terwijl je groeit." },
      ],
    },
    {
      type: "callout",
      title: "Let op: begin niet bij de techniek",
      body: "De meeste AI-trajecten stranden niet op het algoritme, maar op data, eigenaarschap en adoptie. Een eerlijke nulmeting van je AI-readiness voorkomt dure omwegen.",
    },
    {
      type: "related",
      heading: "Lees ook",
      items: [
        { label: "AI in je ERP-systeem: van hype naar waarde", href: "/info/ai-erp" },
        { label: "Datakwaliteit: het fundament onder AI", href: "/info/datakwaliteit" },
        { label: "Wat is een ERP-systeem?", href: "/info/wat-is-erp" },
      ],
    },
  ],

  cta: {
    heading: "Hoe AI-ready is jouw ERP-landschap?",
    body: "De gratis ERP-scan meet je AI-readiness als aparte as — naast strategie, clean core, data en schaalbaarheid.",
    label: "Doe de ERP-scan", href: "/algemeen",
  },
  sources: ["Cijfers zijn indicatief en illustratief; vul aan met eigen praktijkvoorbeelden vóór publicatie."],
};
