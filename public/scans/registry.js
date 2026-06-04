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
];
