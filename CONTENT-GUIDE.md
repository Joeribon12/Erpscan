# Content-guide: scherpe scans schrijven

De engine is generiek; de **waarde zit in de content**. Een scan die generiek aanvoelt, converteert niet. Deze gids helpt je vragen en adviezen schrijven die een CIO of IT-manager doen denken: *"dit gaat écht over ons."*

---

## Het gouden principe

> **Specifiek > generiek.** Noem het systeem, de versie, de deadline, het procesonderdeel. "Hoeveel maatwerk zit er in jullie ERP?" is zwak. "Hoeveel Z-maatwerk (custom ABAP) zit er in jullie ECC-kern?" raakt de juiste snaar.

Een goede scan voelt als een gesprek met een ervaren adviseur die de sector kent — niet als een algemene enquête.

---

## Vragen schrijven

**Structuur (vast):** 5 dimensies × 2 vragen = 10 vragen. Elke vraag heeft 4 opties met score 0, 1, 2, 3.

### De 4 opties = een volwassenheidsladder

Schrijf de opties als een herkenbare groei van zwak naar sterk. De lezer moet zichzelf in precies één optie herkennen.

| Score | Betekenis | Toon |
|---|---|---|
| **0** | Afwezig / ad hoc / reactief | Herkenbaar, niet beschuldigend |
| **1** | Begin, maar versnipperd / niet in productie | "We zijn ermee bezig, maar…" |
| **2** | Gestructureerd / grotendeels op orde | Solide basis |
| **3** | Volwassen / by design / meetbaar | De ambitie |

**Do's**
- Maak opties **concreet en onderscheidend** — elk niveau beschrijft een andere realiteit, geen "een beetje meer van hetzelfde".
- Gebruik **observeerbaar gedrag**, niet abstracte bijvoeglijke naamwoorden. Niet "goede governance", wel "centrale definities en eigenaarschap op kerndomeinen".
- Houd opties **ongeveer even lang** — anders verraadt de lengte het "juiste" antwoord.
- Schrijf in de **taal van de doelgroep**: noem MES/SCADA bij de maakindustrie, omnichannel/POS bij retail, planning/charge bij food.

**Don'ts**
- Geen dubbele vragen ("en/en") — splits ze.
- Geen suggestieve of bangmakende opties; laat de score-0-optie een normale, veelvoorkomende situatie zijn.
- Geen jargon zonder dat de doelgroep het herkent.

### Voorbeeld (zwak → scherp)

> ❌ "Hoe goed is jullie data?"
> ✅ "Hoe schoon is jullie stamdata (materialen, stuklijsten, leveranciers) voor de migratie?"

De scherpe variant noemt concrete objecten én een context (de migratie) — meteen herkenbaar.

---

## De vijf dimensies invullen per doelgroep

De dimensie-id's blijven gelijk (zodat de engine ze kent), maar **labels en inhoud kleur je per doelgroep**:

| Dimensie-id | Generiek label | Maak er sector-taal van |
|---|---|---|
| `strategie` | Strategie & doelen | "Migratiekoers" (ECC→S/4), "Groeistrategie" (retail) |
| `ai` | AI-readiness | Predictive maintenance (maak), vraagvoorspelling (retail) |
| `cleancore` | Clean core & techniek | Z-maatwerk/ABAP (SAP), legacy-koppelingen |
| `data` | Data & integratie | MES/shopfloor (maak), POS/webshop (retail) |
| `schaal` | Schaalbaarheid & processen | Productieprocessen, filiaal-uitrol, seizoenspieken |

---

## Adviezen schrijven (low / mid / high)

Per dimensie schrijf je drie adviezen die **meebewegen met het niveau**. Het advies dat een prospect ziet, hangt af van zijn score op die as.

| Niveau | Doel van het advies | Toon |
|---|---|---|
| **low** | De meest urgente, concrete eerste stap | Helder, prioriterend, niet bang makend. "Begin met…" |
| **mid** | De basis staat — wat brengt het naar het volgende niveau | Bevestigend + richtinggevend. "Je bent op de goede weg; richt je nu op…" |
| **high** | Verfijnen en verzilveren | Erkennend. "Je staat er sterk voor; benut nu…" |

**Een goed advies (2–4 zinnen):**
1. **Benoemt het waaróm** (waarom is dit nu belangrijk voor déze doelgroep).
2. **Geeft een concrete eerstvolgende stap** (geen vaagheid als "verbeter je governance").
3. **Eindigt met de waarde** (wat levert het op).

> **Voorbeeld (low, clean core, maakindustrie):**
> *"Onbekend en omvangrijk maatwerk is dé valkuil van elke ECC-migratie. Voer een custom code-analyse uit, bepaal wat echt onderscheidend is, en plan de rest weg richting standaard of side-by-side extensies. Dit verlaagt je migratierisico én je toekomstige beheerlast drastisch."*

**Verkooptoon vermijden.** Adviseer als expert, niet als verkoper. De lead-stap doet de conversie; de adviezen bouwen vertrouwen. Eén subtiele brug ("een adviseur kijkt vrijblijvend mee") hoort in de `lead`-copy, niet in elk as-advies.

---

## Verdicts (totaaloordeel)

Vier niveaus, oplopend met de drempel (`min`). Geef elk een **label dat blijft hangen** en een korte samenvatting die:
- het niveau eerlijk benoemt (niet alles is "geweldig"),
- de prospect een **richting** geeft,
- nieuwsgierig maakt naar het volledige advies (de lead-haak).

Pas de **labels** aan de doelgroep aan: een algemene scan zegt "Fundament in opbouw"; de maakindustrie-scan zegt "Migratierisico: hoog" — dat raakt harder bij die deadline.

---

## Checklist vóór je een scan live zet

- [ ] `scan_id` == bestandsnaam (`retail.js` → `scan_id: "retail"`).
- [ ] 10 vragen, 2 per dimensie, 4 opties elk, scores 0–3.
- [ ] Elke optieladder loopt logisch van zwak (0) naar sterk (3).
- [ ] Opties zijn ongeveer even lang en gebruiken doelgroep-taal.
- [ ] Voor elke dimensie een low/mid/high-advies, elk met waaróm + stap + waarde.
- [ ] Vier verdicts met onderscheidende labels.
- [ ] `lead.privacy_url` wijst naar de echte privacypagina.
- [ ] Regel toegevoegd in `registry.js` (voor de landingspagina).
- [ ] Lokaal getest via `?scan=<id>` — geen configfout in beeld/console.

---

## Tip: laat een domeinexpert de opties valideren

De engine garandeert de *vorm*; alleen een mens garandeert dat optie-2 echt "volwassener" voelt dan optie-1 voor déze sector. Laat een consultant met domeinkennis de optieladders en adviezen een keer doorlezen voordat een scan live gaat. Dat is het verschil tussen een scan die scoort en een die afhaakt.
