// ARTIKEL: processen-automatiseren — "Hoe automatiseer ik bedrijfsprocessen?"
// Layout: prose → checklist → facts → callout → related → cta
export default {
  page_id: "processen-automatiseren",
  title: "Bedrijfsprocessen automatiseren: waar begin je?",
  eyebrow: "Kennisbank · Automatisering",
  backHref: "/info", backLabel: "← Kennisbank",
  intro: "Bedrijfsprocessen automatiseren bespaart tijd, verlaagt fouten en maakt je schaalbaar. Maar niet elk proces is even geschikt. Dit is hoe je de juiste processen kiest en automatiseert — met je ERP-systeem als motor.",

  sections: [
    {
      type: "prose",
      heading: "Wat is procesautomatisering?",
      body: "Procesautomatisering betekent dat repetitieve, regelgebaseerde taken door software worden uitgevoerd in plaats van handmatig. Denk aan facturen inboeken, orders verwerken of voorraad bijbestellen. Deze workflow-automatisering is precies waar een goed ingericht ERP-systeem al van nature in uitblinkt.",
    },
    {
      type: "checklist",
      heading: "Welke processen kun je het best automatiseren?",
      items: [
        "Repetitief: dezelfde stappen, keer op keer",
        "Regelgebaseerd: duidelijke als-dan-logica, weinig uitzonderingen",
        "Hoog volume: vaak voorkomend, dus veel tijdwinst",
        "Foutgevoelig: handwerk dat nu regelmatig misgaat",
        "Vertragend: stappen die de doorlooptijd onnodig oprekken",
      ],
    },
    {
      type: "facts",
      heading: "Drie niveaus van automatisering",
      items: [
        { title: "Binnen je ERP", body: "Workflows, goedkeuringen en boekingsregels die de standaard al biedt. De snelste winst, zonder extra tools." },
        { title: "Document- en AI-automatisering", body: "Factuurherkenning en document-AI die data automatisch uitlezen en verwerken." },
        { title: "Integratie & orkestratie", body: "Koppelingen die systemen automatisch laten samenwerken, zodat data zonder handwerk doorstroomt." },
      ],
    },
    {
      type: "callout",
      title: "Eerst standaardiseren, dan automatiseren",
      body: "Een rommelig proces automatiseren levert een snel rommelig resultaat op. Breng het proces eerst op orde; automatiseer daarna wat overblijft. Juist bij processen automatiseren in het mkb is die volgorde het verschil tussen winst en frustratie.",
    },
    {
      type: "related",
      heading: "Lees ook",
      items: [
        { label: "Hoe schaal ik zonder chaos?", href: "/info/schalen-zonder-chaos" },
        { label: "Systemen koppelen met API's", href: "/info/systeemintegratie" },
        { label: "AI toepassen in je bedrijf", href: "/info/ai-in-je-bedrijf" },
      ],
    },
  ],

  cta: {
    heading: "Hoeveel automatiseringswinst laat jij liggen?",
    body: "De gratis ERP-scan laat zien waar handwerk en uitzonderingen je remmen — en waar de snelste winst zit.",
    label: "Doe de ERP-scan", href: "/",
  },
  sources: ["Algemene uitleg; vul aan met eigen voorbeelden."],
};
