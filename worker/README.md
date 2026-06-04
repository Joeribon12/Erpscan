# Lead-capture Worker

Een Cloudflare Worker die scan-submissions ontvangt, valideert en **per e-mail doorstuurt** naar een vast adres. Eén endpoint bedient álle scans — het `scan_id` zit in de payload, dus je ziet per lead waar die vandaan komt. Optioneel schrijft de Worker óók naar een Google Sheet.

```
Browser (scan)  ──POST JSON──►  Worker  ──e-mail (Resend)──►  vast ontvangstadres
                                  │
                                  ├─ valideert (naam, organisatie, e-mail, consent, scan_id)
                                  └─ (optioneel) ──► Google Sheet
```

## 🔒 Privacy van het ontvangstadres

Het ontvangende e-mailadres staat **nergens in de code of de frontend** — alleen als **secret** (`LEAD_FORWARD_EMAIL`). Niemand die de site of de (eventueel openbare) repo bekijkt, kan zien waar de leads heen gaan. Zet het adres dus **nooit** in `wrangler.toml`, een config of een commit; alleen via `wrangler secret put`.

---

## Stap 1 — E-mailprovider (Resend)

We versturen via [Resend](https://resend.com) (simpele API, gratis tier: ~100 mails/dag).

1. Maak een gratis account op **https://resend.com**.
2. **API Keys → Create API Key** → kopieer de sleutel (`re_…`).
3. **Afzender (`from`)** — kies één van:
   - **Snel testen:** laat `LEAD_FROM_EMAIL` weg; de Worker gebruikt dan `onboarding@resend.dev`. In testmodus levert Resend alleen af op het e-mailadres van je eigen Resend-account.
   - **Productie:** verifieer een eigen domein (**Domains → Add Domain**, DNS-records plaatsen) en zet `LEAD_FROM_EMAIL` op bv. `ERP Scan <leads@jouw-domein.nl>`. Pas dan komen mails betrouwbaar aan en kun je naar elk adres sturen.

## Stap 2 — Secrets & variabelen instellen

Vanuit de map `worker/`:

```bash
npm install
npx wrangler login

# Geheimen (versleuteld opgeslagen, niet in code):
npx wrangler secret put RESEND_API_KEY
#   → plak de Resend-sleutel (re_…)

npx wrangler secret put LEAD_FORWARD_EMAIL
#   → plak HET ECHTE ontvangstadres. Dit blijft geheim.
```

Niet-geheime instellingen (`LEAD_FROM_EMAIL`, `ALLOWED_ORIGIN`) mogen in `wrangler.toml` onder `[vars]`. Zet `ALLOWED_ORIGIN` in productie op je site-URL.

> **Let op:** zet `LEAD_FORWARD_EMAIL` bij voorkeur óók niet in `wrangler.toml`, want `[vars]` is zichtbaar in het dashboard. Houd het een secret.

## Stap 3 — Lokaal testen

```bash
cp .dev.vars.example .dev.vars   # vul je echte waarden in (staat in .gitignore)
npm run dev                      # http://localhost:8787
```

Test met een voorbeeld-payload:

```bash
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"scan_id":"algemeen","scan_title":"ERP Futureproof Scan","total_score":62,"verdict_label":"Op de goede weg","dimensions":[{"id":"ai","label":"AI-readiness","pct":50,"level":"mid"}],"answers":[{"question_id":"q1","text":"Voorbeeldvraag","label":"Antwoord","score":2}],"lead":{"name":"Test Persoon","organisation":"Testbv","email":"test@bedrijf.nl","consent":true}}'
```

Verwacht: `{"ok":true}` en een e-mail in je inbox.

## Stap 4 — Deployen

```bash
npm run deploy
```

Wrangler print de live URL, bv. `https://lead-capture.<subdomein>.workers.dev`.
**Zet die URL in `public/assets/config.js` bij `WORKER_ENDPOINT`** en deploy de site opnieuw.

Logs live volgen: `npm run tail`.

---

## E-mailinhoud

Elke lead-mail bevat: scan + totaalscore + verdict, de contactgegevens, de score per as en alle antwoorden. **Reply-to** is ingesteld op het e-mailadres van de prospect, zodat je direct kunt antwoorden.

## Google Sheets (optioneel)

Wil je leads óók in een Sheet? Stel dan deze secrets/vars in; de Worker schrijft dan naar beide kanalen (en slaagt zolang minstens één kanaal lukt):

```bash
npx wrangler secret put GOOGLE_PRIVATE_KEY            # uit service-account JSON
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
npx wrangler secret put GOOGLE_SHEET_ID
```

Maak een service account (Google Cloud → Sheets API → Credentials), download de JSON, en **deel de Sheet met de `client_email`** als bewerker. Header-rij in de Sheet (tab `Leads`):

| Tijdstip | Scan | Scan-titel | Doelgroep | Totaalscore | Verdict | Naam | Organisatie | E-mail | Telefoon | Scores per as | Antwoorden | Bron-URL | Referrer |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## Alternatieven voor e-mail

- **MailChannels** of **SendGrid/Postmark/Mailgun** — zelfde patroon, andere API-call in `sendLeadEmail()`.
- **Cloudflare Email Routing + Email Workers** (`send_email`-binding) — verstuurt zonder externe provider, maar vereist een geverifieerd bestemmingsadres in Email Routing.
