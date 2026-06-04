# Lead-capture Worker

Een Cloudflare Worker die scan-submissions ontvangt, valideert en als regel naar een Google Sheet schrijft. Eén endpoint bedient álle scans — het `scan_id` zit in de payload, dus je ziet per lead waar die vandaan komt.

## Hoe het werkt

```
Browser (scan)  ──POST JSON──►  Worker  ──Sheets API──►  Google Sheet
                                  │
                                  └─ valideert (naam, organisatie, e-mail, consent, scan_id)
```

De Worker authenticeert bij Google met een **service account** (een JWT wordt in de Worker met RS256 ondertekend en ingewisseld voor een access token). Geen externe libraries nodig — puur Web Crypto.

---

## Stap 1 — Google Sheet aanmaken

1. Maak een nieuwe Google Sheet.
2. Noem het eerste tabblad **`Leads`** (of pas `SHEET_TAB` aan).
3. Zet in rij 1 deze kopregels (volgorde = `toRow()` in `src/index.js`):

   | Tijdstip | Scan | Scan-titel | Doelgroep | Totaalscore | Verdict | Naam | Organisatie | E-mail | Telefoon | Scores per as | Antwoorden | Bron-URL | Referrer |
   |---|---|---|---|---|---|---|---|---|---|---|---|---|---|

4. Kopieer het **Sheet-ID** uit de URL:
   `https://docs.google.com/spreadsheets/d/`**`<DIT_STUK>`**`/edit`

## Stap 2 — Service account aanmaken

1. Ga naar [Google Cloud Console](https://console.cloud.google.com/) → maak/kies een project.
2. **APIs & Services → Library →** zoek **Google Sheets API** → **Enable**.
3. **APIs & Services → Credentials → Create credentials → Service account.**
   - Geef een naam (bv. `lead-writer`), klik door en maak aan.
4. Open de service account → tab **Keys → Add key → Create new key → JSON.**
   - Er wordt een JSON-bestand gedownload. Hierin staan `client_email` en `private_key`.
5. **Deel de Sheet** met de `client_email` van de service account (knop *Delen* in de Sheet), met rol **Bewerker**. Zonder deze stap krijgt de Worker een 403.

## Stap 3 — Secrets & variabelen instellen

Vanuit de map `worker/`:

```bash
npm install                      # installeert wrangler lokaal
npx wrangler login               # eenmalig: koppel je Cloudflare-account

# Geheimen (worden versleuteld opgeslagen, niet in code):
npx wrangler secret put GOOGLE_PRIVATE_KEY
#   → plak de volledige private_key uit het JSON-bestand,
#     inclusief -----BEGIN/END PRIVATE KEY-----. \n-escapes mogen blijven staan.

npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
#   → plak de client_email

npx wrangler secret put GOOGLE_SHEET_ID
#   → plak het Sheet-ID uit stap 1
```

Niet-geheime instellingen staan in `wrangler.toml` (`SHEET_TAB`, `ALLOWED_ORIGIN`). Zet `ALLOWED_ORIGIN` in productie op je Pages-URL.

> Liever alles als secret? Dan kun je `GOOGLE_SHEET_ID` en `GOOGLE_SERVICE_ACCOUNT_EMAIL` ook met `wrangler secret put` zetten in plaats van in `wrangler.toml`.

## Stap 4 — Lokaal testen

```bash
cp .dev.vars.example .dev.vars   # vul je echte waarden in (staat in .gitignore)
npm run dev                      # start lokaal op http://localhost:8787
```

Test met een voorbeeld-payload:

```bash
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"scan_id":"algemeen","total_score":62,"verdict_label":"Op de goede weg","dimensions":[{"id":"ai","label":"AI-readiness","pct":50,"level":"mid"}],"answers":[{"question_id":"q1","score":2}],"lead":{"name":"Test Persoon","organisation":"Testbv","email":"test@bedrijf.nl","consent":true}}'
```

Verwacht: `{"ok":true}` en een nieuwe regel in je Sheet.

## Stap 5 — Deployen

```bash
npm run deploy
```

Wrangler print de live URL, bv. `https://ctac-lead-capture.<subdomein>.workers.dev`.
**Zet die URL in `public/assets/config.js` bij `WORKER_ENDPOINT`** en deploy de site opnieuw.

Logs live volgen: `npm run tail`.

---

## Velden in de payload

| Veld | Inhoud |
|------|--------|
| `scan_id`, `scan_title`, `audience` | welke scan |
| `total_score`, `verdict_label` | totaaloordeel |
| `dimensions[]` | per as `{id,label,pct,level}` |
| `answers[]` | per vraag `{question_id,dimension,score,label,...}` |
| `lead{}` | `name, organisation, email, phone, consent` |
| `meta{}` | `url, referrer, user_agent, submitted_at_client` |

Wil je extra kolommen? Pas `toRow()` aan én de header in de Sheet — dat is de enige plek die de kolomvolgorde bepaalt.
