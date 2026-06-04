# ERP Growth Hack Scan

Een **config-driven** lead-generatie-webapp. Prospects vullen een korte scan in over hun ERP-landschap, krijgen direct een diagnose met verbeterpunten per as, en laten daarna hun gegevens achter als gekwalificeerde lead.

> **Kernprincipe:** één engine, elke scan is een los configbestand. Een nieuwe doelgroep toevoegen = **één nieuw bestand in `public/scans/`**. Geen codeduplicatie, schaalt naar 25+ scans.

---

## Inhoud

- [Architectuur in het kort](#architectuur-in-het-kort)
- [Mappenstructuur](#mappenstructuur)
- [Lokaal previewen](#lokaal-previewen)
- [Een nieuwe doelgroep-scan toevoegen](#een-nieuwe-doelgroep-scan-toevoegen-stap-voor-stap)
- [De Worker deployen (lead capture)](#de-worker-deployen)
- [Naar Cloudflare Pages pushen](#naar-cloudflare-pages-pushen)
- [Hoe de scoring werkt](#hoe-de-scoring-werkt)

---

## Architectuur in het kort

| Onderdeel | Keuze | Waarom |
|---|---|---|
| Frontend | Statische site, **vanilla JS (ES-modules), geen build-stap** | Snel laadbaar, geen toolchain, makkelijk te onderhouden |
| Routing | Eén `index.html` + SPA-fallback (`not_found_handling`) | `/maakindustrie` laadt dezelfde engine, die op het pad de juiste config kiest |
| Engine | `public/assets/engine.js` | Kent géén scan-inhoud, alleen het configschema: rendert, scoort, valideert, verstuurt |
| Scan | `public/scans/<id>.js` | Pure data: vragen, assen, adviezen, drempels, formuliercopy |
| Lead capture | `worker/` (Cloudflare Worker) | Eén endpoint voor alle scans → valideert → schrijft naar Google Sheet |
| Hosting | Cloudflare Pages (`public/`) + Worker | Gratis, snel, schaalbaar |

**Routing-detail:** Cloudflare serveert bestaande bestanden (`/assets/*`, `/scans/*`) direct; elk ander pad valt via `not_found_handling = "single-page-application"` (in `wrangler.toml`) terug op `index.html` met status 200 (de URL blijft staan). De engine leest `location.pathname`, neemt het eerste segment als `scan_id` en importeert `./scans/<scan_id>.js` dynamisch. Lokaal werkt ook `?scan=<id>`.

---

## Mappenstructuur

```
erp-scan/
├── README.md                 ← dit bestand
├── CONTENT-GUIDE.md          ← hoe je scherpe vragen & adviezen schrijft
├── wrangler.toml             ← Cloudflare deploy-config van de site (assets + SPA-fallback)
├── .gitignore
│
├── public/                   ← document root (assets-directory voor Cloudflare)
│   ├── index.html            ← enige HTML-pagina (loader-shell)
│   ├── _headers              ← security-/cache-headers
│   ├── assets/
│   │   ├── engine.js         ← render + scoring engine (kent geen scans)
│   │   ├── config.js         ← globale runtime-instellingen (WORKER_ENDPOINT!)
│   │   └── styles.css        ← design system (donker thema, één accent)
│   └── scans/
│       ├── registry.js       ← lijst voor de landingspagina (1 regel per scan)
│       ├── algemeen.js       ← voorbeeldconfig 1: algemene ERP-scan
│       └── maakindustrie.js  ← voorbeeldconfig 2: maakindustrie / SAP ECC→S/4HANA
│
└── worker/                   ← lead-capture endpoint (zie worker/README.md)
    ├── src/index.js
    ├── wrangler.toml
    ├── package.json
    └── .dev.vars.example
```

---

## Lokaal previewen

Je hebt alleen een statische server nodig (de site heeft geen build-stap). Vanuit de projectmap:

```bash
# Optie A — Node (npx, geen install):
npx serve public

# Optie B — Python:
python -m http.server 8000 --directory public
```

Open daarna:

- **`http://localhost:3000/?scan=algemeen`** — de algemene scan
- **`http://localhost:3000/?scan=maakindustrie`** — de maakindustrie-scan
- **`http://localhost:3000/`** — de landingspagina met scankeuze

> **Waarom `?scan=`?** Een kale statische server kent het pad `/maakindustrie` niet en geeft 404. De queryparam werkt overal. Op Cloudflare Pages zorgt `_redirects` ervoor dat het **pad** `/maakindustrie` óók werkt. Wil je padroutering lokaal testen, gebruik dan `npx serve public -s` (SPA-modus).

De lead-knop werkt pas écht als `WORKER_ENDPOINT` in `public/assets/config.js` naar een draaiende Worker wijst (zie hieronder).

---

## Een nieuwe doelgroep-scan toevoegen (stap voor stap)

Stel: je wilt een scan voor **retail**.

1. **Kopieer** een bestaande config als startpunt:
   ```bash
   cp public/scans/algemeen.js public/scans/retail.js
   ```

2. **Open `public/scans/retail.js`** en pas aan:
   - `scan_id: "retail"` — **moet exact gelijk zijn aan de bestandsnaam** (`retail.js`).
   - `title`, `eyebrow`, `audience`, `intro` — doelgroepgericht.
   - De 10 `questions` — herschrijf ze scherp voor retail (zie `CONTENT-GUIDE.md`). Houd je aan: 2 vragen per dimensie, 4 opties per vraag, scores 0–3.
   - De `advice` per as (low/mid/high) — retail-specifiek.
   - De `verdicts` — pas labels/teksten aan.
   - `lead.privacy_url` — de echte privacylink.

3. **Registreer** de scan voor de landingspagina — voeg één regel toe in `public/scans/registry.js`:
   ```js
   { id: "retail", title: "Retail ERP-scan", audience: "Voor retail IT-leiders", path: "/retail" },
   ```

4. **Klaar.** Test lokaal via `?scan=retail`, in productie via `/retail`. Je hebt **geen regel code** aangepast — alleen content.

> De engine valideert je config bij het laden. Mist er iets (bv. een adviesniveau), dan zie je een duidelijke foutmelding in beeld én in de console. Zo merk je fouten meteen.

---

## De Worker deployen

De Worker ontvangt leads en schrijft ze naar Google Sheets. Volledige instructies (Google Sheet aanmaken, service account, secrets) staan in **[`worker/README.md`](worker/README.md)**. Kort:

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put GOOGLE_PRIVATE_KEY            # uit service-account JSON
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
npx wrangler secret put GOOGLE_SHEET_ID
npm run deploy
```

Na deploy print Wrangler de URL. **Zet die in `public/assets/config.js`** bij `WORKER_ENDPOINT` en push de site opnieuw. Zet daar ook `ALLOWED_ORIGIN` (in `worker/wrangler.toml`) op je Pages-URL voor strakkere CORS.

---

## Naar Cloudflare Pages pushen

### Eenmalig: repo op GitHub

```bash
git add .
git commit -m "Initial ERP Growth Hack Scan"
git push -u origin main
```

### Cloudflare koppelen

1. Cloudflare-dashboard → **Workers & Pages → Create → Connect to Git.**
2. Kies deze repo. Cloudflare detecteert een statisch project en draait bij elke push
   `npx wrangler deploy` vanaf de repo-root.
3. De **`wrangler.toml` in de root** bepaalt de rest automatisch: `directory = "./public"`
   en `not_found_handling = "single-page-application"` (de SPA-fallback). Je hoeft dus geen
   build command of output directory in de UI in te vullen.
4. Na de eerste deploy staat de site live op `https://<naam>.<subdomein>.workers.dev`
   (of een `*.pages.dev`-URL, afhankelijk van het projecttype).

Elke `git push` naar `main` triggert automatisch een nieuwe deploy. De scans zijn dan
bereikbaar op `/<scan_id>` (bv. `/maakindustrie`).

> **Custom domein?** Voeg het toe onder Pages → Custom domains. De padroutering (`/maakindustrie`) werkt identiek.

---

## Hoe de scoring werkt

- Elke vraag levert **0–3 punten** (de gekozen optie bepaalt de score).
- **Totaalscore** = som van alle punten, genormaliseerd naar **0–100**.
- **Per dimensie** (2 vragen, max 6 punten) wordt een percentage berekend en een niveau bepaald:
  - `< 40%` → **low** (meest urgente advies)
  - `40–69%` → **mid**
  - `≥ 70%` → **high** (verfijnend advies)
  - Deze drempels staan in `public/assets/config.js` (`DIMENSION_LEVELS`) en gelden voor alle scans.
- Het **verdict** is het hoogste item uit `verdicts[]` waarvan `min ≤ totaalscore`.
- Het advies per as komt uit `advice[dimensie][niveau]` in de scanconfig — zo **beweegt het mee** met het niveau.

De volledige scores én antwoorden gaan mee in de lead-payload, zodat sales de lead meteen kan kwalificeren.

---

## Licentie / eigendom

Placeholder-privacylinks (`#privacy`) vervangen door de definitieve URL vóór livegang.
