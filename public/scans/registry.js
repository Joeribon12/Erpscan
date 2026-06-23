// ──────────────────────────────────────────────────────────────────────────
// SCAN-REGISTRY — uitsluitend voor de landingspagina (de keuzetegels op "/").
// De engine zelf heeft dit NIET nodig; die importeert een config direct op id.
//
// Nieuwe scan toevoegen: maak /scans/<id>.js (id = URL-slug) én voeg hier één
// regel toe. Houd id, bestandsnaam en path gelijk.
// ──────────────────────────────────────────────────────────────────────────

export const SCANS = [
  { id: "erp-scan-maakindustrie",  title: "Maakindustrie: van SAP ECC naar S/4HANA",      audience: "IT- & operations-leiders in de maakindustrie", path: "/erp-scan-maakindustrie" },
  { id: "erp-scan-retail",         title: "Retail & e-commerce",                          audience: "IT- & e-commerce-verantwoordelijken in retail", path: "/erp-scan-retail" },
  { id: "erp-scan-groothandel",    title: "Groothandel & distributie",                    audience: "IT- & operations-leiders in groothandel",     path: "/erp-scan-groothandel" },
];
