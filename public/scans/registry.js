// ──────────────────────────────────────────────────────────────────────────
// SCAN-REGISTRY — uitsluitend voor de landingspagina (de keuzetegels op "/").
// De engine zelf heeft dit NIET nodig; die importeert een config direct op id.
//
// Nieuwe scan toevoegen: maak /scans/<id>.js (id = URL-slug) én voeg hier één
// regel toe. Houd id, bestandsnaam en path gelijk.
// ──────────────────────────────────────────────────────────────────────────

export const SCANS = [
  { id: "erp-systeem-scan",        title: "ERP Futureproof Scan",                         audience: "CIO's & IT-managers, alle sectoren",         path: "/erp-systeem-scan" },
  { id: "erp-scan-maakindustrie",  title: "Maakindustrie: van SAP ECC naar S/4HANA",      audience: "IT- & operations-leiders in de maakindustrie", path: "/erp-scan-maakindustrie" },
  { id: "erp-scan-retail",         title: "Retail & e-commerce",                          audience: "IT- & e-commerce-verantwoordelijken in retail", path: "/erp-scan-retail" },
  { id: "erp-scan-groothandel",    title: "Groothandel & distributie",                    audience: "IT- & operations-leiders in groothandel",     path: "/erp-scan-groothandel" },
  { id: "erp-scan-food",           title: "Food & beverage",                              audience: "IT-, productie- & kwaliteitsleiders in food", path: "/erp-scan-food" },
  { id: "erp-scan-finance",        title: "Finance & control",                            audience: "CFO's, finance managers & controllers",       path: "/erp-scan-finance" },
  { id: "erp-scan-logistiek",      title: "Transport & logistiek",                        audience: "IT-, supply chain- & operations-leiders",     path: "/erp-scan-logistiek" },
  { id: "erp-scan-bouw",           title: "Bouw & installatietechniek",                   audience: "IT-, project- & finance-leiders in bouw/installatie", path: "/erp-scan-bouw" },
  { id: "erp-scan-energie",        title: "Energie & nutsbedrijven",                      audience: "IT-, asset- & klantprocesleiders in utilities", path: "/erp-scan-energie" },
  { id: "erp-scan-dienstverlening", title: "Zakelijke dienstverlening",                   audience: "IT-, finance- & operations-leiders in dienstverlening", path: "/erp-scan-dienstverlening" },
];
