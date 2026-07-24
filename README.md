# [Hellvoc Hemiksem-Schelle – digitale club-pagina's](https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/)

Live wedstrijdkalender, standen, supporterspagina's en navigatie van volleybalclub **Hellvoc Hemiksem-Schelle** (stamnummer AA-1342). Deze repository is de motor achter de sportpagina's op de clubwebsite ([hellvoc-hemiksem.anykrowd.eu](https://hellvoc-hemiksem.anykrowd.eu)).

## Hoe het geheel in elkaar zit

```
Bezoeker / TV-scherm
   │
   ▼
AnyKrowd-clubwebsite ("Verkennen"-menu)          Signage/TV wijst rechtstreeks
   │  iframes                                    naar signage.html
   ▼
GitHub Pages (deze repository)          Externe links
   │  haalt live data op                  ├─ Twizzit-formulieren
   ▼                                      └─ JAKO-teamshop
Volley Vlaanderen (volleyadmin2.be)
   ▲
   └─ GitHub Action (dagelijks) ─→ agenda-bestanden in ics/
```

Waarom deze omweg? AnyKrowd voert **geen scripts** uit in HTML-blokken. De pagina's draaien daarom hier op GitHub Pages (gratis, geen server nodig) en worden via iframes getoond. De data komt bij elke paginaweergave **live** van de officiële webservices van Volley Vlaanderen — niemand werkt ooit handmatig uitslagen of verplaatste wedstrijden bij.

## De pagina's

| Pagina | URL | Inhoud |
| --- | --- | --- |
| **Competitie** | [/](https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/) | Per ploeg, gegroepeerd Senioren/Jeugd, met "zet in je agenda"-link per ploeg |
| **Beker** | [beker.html](https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/beker.html) | Alle bekerwedstrijden, per bekerreeks |
| **Volledige kalender** | [kalender.html](https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/kalender.html) | Alles per week (ma t/m zo); huidige week klapt open; filterbaar per ploeg (zie ploeglinks) |
| **Standen** | [standen.html](https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/standen.html) | Het klassement van elke ploeg, Hellvoc-rij uitgelicht |
| **Kom supporteren** | [supporteren.html](https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/supporteren.html) | Enkel thuiswedstrijden per maand, ★ Super Saturdays bovenaan, 7e Hellvocer-kaart onderaan |
| **Deze week (mini)** | [week.html](https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/week.html) | Compact blokje met de komende 7 dagen — voor op de homepagina |
| **Signage (TV)** | [signage.html](https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/signage.html) | Kioskweergave voor tv-schermen: groot, zonder knoppen, ververst zichzelf |

Overal: thuis/uit-icoon, datum en uur, tegenstander (klik = sporthal + Google Maps), uitslag na afloop, rood label bij uitstel, gouden ★-badge op **Super Saturdays** (Heren A en Dames A samen thuis).

## Iframes voor AnyKrowd

Standaardblok (vervang de bestandsnaam; voor de competitiepagina eindigt de src op `/`):

```html
<div style="width:100%; height:80vh; min-height:400px;">
  <iframe src="https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/BESTAND.html"
          title="Hellvoc Hemiksem-Schelle" loading="lazy"
          style="display:block; width:100%; height:100%; border:0; background:#000;"></iframe>
</div>
```

Voor het **"Deze week"-blokje op de homepagina** volstaat een lagere hoogte:

```html
<div style="width:100%; height:420px;">
  <iframe src="https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/week.html"
          title="Deze week bij Hellvoc" loading="lazy"
          style="display:block; width:100%; height:100%; border:0; background:#000;"></iframe>
</div>
```

## Signage / tv-scherm

Laat de browser van het signage-systeem (of een TV met browser) rechtstreeks naar
`https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/signage.html` wijzen — geen iframe nodig.

- Grote letters, geen knoppen of links, muiscursor verborgen: veilig voor een scherm zonder bediening
- Toont de wedstrijden van de komende 7 dagen; thuiswedstrijden krijgen een gouden THUIS-badge
- Ververst de data automatisch elke 10 minuten en herlaadt zichzelf tweemaal per dag volledig

## Deelbare ploeglinks (voor trainers & ploegverantwoordelijken)

De volledige kalender kan gefilterd worden per ploeg via `?ploeg=…`. Eén link in de WhatsApp-groep en iedereen ziet enkel de eigen ploeg:

```
https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/kalender.html?ploeg=SLUG
```

| Ploeg | slug | | Ploeg | slug |
| --- | --- | --- | --- | --- |
| Heren A | `heren-a` | | Jongens U17 | `jongens-u17` |
| Heren B | `heren-b` | | Jongens U13 A | `jongens-u13-a` |
| Heren C | `heren-c` | | Jongens U13 B | `jongens-u13-b` |
| Heren D | `heren-d` | | Meisjes U17 A | `meisjes-u17-a` |
| Dames A | `dames-a` | | Meisjes U17 B | `meisjes-u17-b` |
| Dames B | `dames-b` | | Meisjes U15 A | `meisjes-u15-a` |
| Dames C | `dames-c` | | Meisjes U15 B | `meisjes-u15-b` |
| Dames D | `dames-d` | | Meisjes U13 | `meisjes-u13` |
| Dames E | `dames-e` | | U11 | `u11` |
| Dames F | `dames-f` | | | |

## Agenda-abonnementen (ICS)

Een GitHub Action (`.github/workflows/ics.yml`) draait **dagelijks rond 06:20** en genereert per ploeg een agenda-bestand in de map `ics/` (plus `beker.ics` en `alle-wedstrijden.ics`). Wedstrijden verschijnen als afspraak van 2 uur; wedstrijden zonder gekend uur als hele-dag-item; uitgestelde wedstrijden worden als geannuleerd gemarkeerd.

**Abonneren** (de wedstrijden verschijnen dan automatisch in je telefoon-agenda en blijven mee veranderen):

- iPhone/iPad & Apple Agenda: open `webcal://abzgchristophe.github.io/hellvoc_wedstrijdkalender/ics/SLUG.ics`
- Google Agenda: Instellingen → Agenda toevoegen → Via URL → plak `https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/ics/SLUG.ics`
- Op de competitiepagina staat per ploeg de link "📅 Zet deze wedstrijden in je agenda"

De slugs zijn dezelfde als in de tabel hierboven.

**Eenmalige activatie** (na het uploaden van `scripts/make_ics.py` en `.github/workflows/ics.yml`): open op GitHub de tab **Actions** → workflow "Agenda-bestanden verversen" → **Run workflow**. Daarna loopt hij elke ochtend vanzelf. Zolang hij nog nooit gelopen heeft, geven de agenda-links een 404.

## Affiches

Twee printklare A4-affiches in huisstijl (los meegeleverd, bewaar ze gerust in de map `affiches/`):

- `poster-wedstrijdkalender.pdf` — QR naar de kalenderpagina op de clubsite; voor in de sporthal
- `poster-7e-hellvocer.pdf` — QR naar het inschrijfformulier, met de drie voordelen; voor aan de toog van café Touché

Beide QR-codes zijn getest en decoderen naar de juiste link. Ze worden opnieuw gegenereerd met `python3 maak_affiches.py` (script los meegeleverd) als teksten of links ooit wijzigen.

## De Verkennen-pagina (AnyKrowd)

Het navigatiemenu op AnyKrowd (HTML-blok, geen iframe nodig) bevat: de kaarten naar de sportpagina's, **Doe mee** (Twizzit-formulieren: 7e Hellvocer met voordelenlijst en gouden rand, nieuw lid, vrijwilliger, nieuwsbrief) en **Clubshop** (JAKO-teamshop). Externe links openen in een nieuw venster (↗).

📦 **Backup**: de broncode staat in [`anykrowd/verkennen-pagina.html`](anykrowd/verkennen-pagina.html). AnyKrowd heeft geen versiegeschiedenis — hou beide kanten synchroon.

## Databronnen & toegang

```
Wedstrijden: https://www.volleyadmin2.be/services/wedstrijden_xml.php?stamnummer=AA-1342&format=json
Standen:     https://www.volleyadmin2.be/services/rangschikking_xml.php?stamnummer=AA-1342&format=json
```

⚠️ Deze webservices werken met een toegangslijst per domein. Toegang voor `abzgchristophe.github.io` werd verleend door de beheerder: **kevin@kdg-projects.be** (KDG Projects, in opdracht van Volley Vlaanderen). Verhuist de site naar een ander domein → eerst opnieuw toegang vragen.

## Bestanden in deze repository

| Bestand | Doel |
| --- | --- |
| `widget.js` | **Alle logica en opmaak** van alle pagina's (één plek voor onderhoud) |
| `index.html` | Competitie (modus "competitie") |
| `beker.html` | Beker (modus "beker") |
| `kalender.html` | Weekkalender + ploegfilter (modus "kalender") |
| `standen.html` | Klassementen (modus "standen") |
| `supporteren.html` | Thuiswedstrijden + 7e Hellvocer (modus "supporteren") |
| `week.html` | Komende 7 dagen, compact (modus "week") |
| `signage.html` | TV-weergave (modus "signage") |
| `scripts/make_ics.py` | Generator van de agenda-bestanden |
| `.github/workflows/ics.yml` | Dagelijkse GitHub Action die de agenda's ververst |
| `ics/` | De gegenereerde agenda-bestanden (automatisch beheerd) |
| `anykrowd/verkennen-pagina.html` | Backup van het Verkennen-menu op AnyKrowd |
| `README.md` | Dit bestand |

## Onderhoud

**1x per seizoen (augustus): reekscodes controleren — op TWEE plekken.** De reekscodes (bv. `NAT1H`, `ADP2-A`) staan in de lijst `TEAMS` in zowel `widget.js` als `scripts/make_ics.py`. Verandert een ploeg van reeks, pas dan beide bestanden aan.

- Onbekende codes verdwijnen nooit: ze verschijnen op de competitiepagina onder "Overige reeksen" en in de agenda onder `beker.ics`.
- Nieuwe bekerreeksen: toevoegen aan `BEKER_NAMES` in `widget.js`.
- Formulier- of shoplinks gewijzigd? Aanpassen op de Verkennen-pagina in AnyKrowd én in de backup.

**Zo pas je iets aan op GitHub**: bestand openen → potlood → wijzigen → **Commit changes**. Na ± een minuut live op alle pagina's tegelijk.

## Problemen oplossen

| Symptoom | Oorzaak & oplossing |
| --- | --- |
| Foutmelding met link naar volleyscores.be | Feed onbereikbaar of domein-toegang vervallen → kevin@kdg-projects.be |
| "Wedstrijden laden…" blijft staan (AnyKrowd) | Iframe ontbreekt of src-URL fout; controleer het HTML-blok |
| Agenda-link geeft 404 | GitHub Action nog nooit gelopen → Actions-tab → workflow handmatig starten |
| Standenpagina meldt "structuur niet herkend" + veldnamen | Feedstructuur gewijzigd; de getoonde velden vertellen wat in `renderStanden` (widget.js) moet wijzigen |
| Competitiereeks onder "Overige reeksen" | Nieuwe/gewijzigde reekscode → toevoegen aan `TEAMS` (widget.js **en** scripts/make_ics.py) |
| Ploeglink toont "Ploeg niet gevonden" | Slug klopt niet (zie tabel) of de ploegnaam in `TEAMS` is gewijzigd |

## Achtergrond

Deze opzet (2026) vervangt de vroegere iframe-embed van volleyscores.be. De data blijft van dezelfde officiële bron; alleen de weergave is van de club zelf. De code in `widget.js` is bewust leesbaar en gecommentarieerd gehouden.
