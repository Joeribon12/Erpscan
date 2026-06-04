// ──────────────────────────────────────────────────────────────────────────
// SCAN-REGISTRY — uitsluitend voor de landingspagina (de keuzetegels op "/").
// De engine zelf heeft dit NIET nodig; die importeert een config direct op id.
//
// Nieuwe scan toevoegen: maak /scans/<id>.js én voeg hier één regel toe.
// (Wil je geen landing? Dan is dit bestand optioneel.)
// ──────────────────────────────────────────────────────────────────────────

export const SCANS = [
  {
    id: "algemeen",
    title: "ERP Futureproof Scan",
    audience: "CIO's & IT-managers, alle sectoren",
    path: "/algemeen",
  },
  {
    id: "maakindustrie",
    title: "Maakindustrie: van SAP ECC naar S/4HANA",
    audience: "IT- & operations-leiders in de maakindustrie",
    path: "/maakindustrie",
  },
  {
    id: "retail",
    title: "Retail & e-commerce",
    audience: "IT- & e-commerce-verantwoordelijken in retail",
    path: "/retail",
  },
  {
    id: "groothandel",
    title: "Groothandel & distributie",
    audience: "IT- & operations-leiders in groothandel",
    path: "/groothandel",
  },
  {
    id: "food",
    title: "Food & beverage",
    audience: "IT-, productie- & kwaliteitsleiders in food",
    path: "/food",
  },
  {
    id: "finance",
    title: "Finance & control",
    audience: "CFO's, finance managers & controllers",
    path: "/finance",
  },
  {
    id: "logistiek",
    title: "Transport & logistiek",
    audience: "IT-, supply chain- & operations-leiders",
    path: "/logistiek",
  },
  {
    id: "bouw",
    title: "Bouw & installatietechniek",
    audience: "IT-, project- & finance-leiders in bouw/installatie",
    path: "/bouw",
  },
  {
    id: "utilities",
    title: "Energie & nutsbedrijven",
    audience: "IT-, asset- & klantprocesleiders in utilities",
    path: "/utilities",
  },
  {
    id: "dienstverlening",
    title: "Zakelijke dienstverlening",
    audience: "IT-, finance- & operations-leiders in dienstverlening",
    path: "/dienstverlening",
  },
];
