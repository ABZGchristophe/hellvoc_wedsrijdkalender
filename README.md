# [Wedstrijden Hellvoc Hemiksem-Schelle](https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/)

Live wedstrijdkalender van volleybalclub **Hellvoc Hemiksem-Schelle** (stamnummer AA-1342), getoond op de clubwebsite via iframes.

## Drie pagina's

| Pagina | URL | Inhoud |
| --- | --- | --- |
| **Competitie** | https://abzgchristophe.github.io/hellvoc_wedsrijdkalender/ | Per ploeg, gegroepeerd in Senioren (heren/dames) en Jeugd (jongens/meisjes/gemengd) |
| **Beker** | https://abzgchristophe.github.io/hellvoc_wedsrijdkalender/beker.html | Alle bekerwedstrijden, per bekerreeks |
| **Volledige kalender** | https://abzgchristophe.github.io/hellvoc_wedsrijdkalender/kalender.html | Alles samen per week (ma t/m zo); de huidige week klapt automatisch open |

Alle pagina's tonen bovenaan de live-indicator, en per wedstrijd: thuis/uit-icoon, datum en uur, tegenstander (klik = sporthal + Google Maps-link), uitslag na afloop en een rood label bij uitstel. **Super Saturdays** (Heren A en Dames A samen thuis) krijgen een gouden ★-badge en worden in de weekweergave ook in de weektitel vermeld.

## Data

Alles wordt bij elke paginaweergave live opgehaald bij de officiële webservice van Volley Vlaanderen:

```
https://www.volleyadmin2.be/services/wedstrijden_xml.php?stamnummer=AA-1342&format=json
```

Deze webservice werkt met een toegangslijst per domein; toegang voor `abzgchristophe.github.io` werd verleend door de beheerder (kevin@kdg-projects.be). Verschijnt er een foutmelding met een link naar volleyscores.be, dan is de toegang niet (meer) actief.

## Gebruik op de clubwebsite (AnyKrowd)

AnyKrowd voert scripts in HTML-blokken niet uit; daarom draaien de pagina's hier op GitHub Pages en worden ze ingesloten via een iframe. Plak per AnyKrowd-pagina het bijhorende blok:

```html
<!-- Competitie -->
<div style="width:100%; height:80vh; min-height:400px;">
  <iframe src="https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/"
          title="Competitie Hellvoc Hemiksem-Schelle" loading="lazy"
          style="display:block; width:100%; height:100%; border:0; background:#000;"></iframe>
</div>

<!-- Beker -->
<div style="width:100%; height:80vh; min-height:400px;">
  <iframe src="https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/beker.html"
          title="Beker Hellvoc Hemiksem-Schelle" loading="lazy"
          style="display:block; width:100%; height:100%; border:0; background:#000;"></iframe>
</div>

<!-- Volledige kalender -->
<div style="width:100%; height:80vh; min-height:400px;">
  <iframe src="https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/kalender.html"
          title="Volledige kalender Hellvoc Hemiksem-Schelle" loading="lazy"
          style="display:block; width:100%; height:100%; border:0; background:#000;"></iframe>
</div>
```

## Bestanden

| Bestand | Doel |
| --- | --- |
| `widget.js` | **Alle logica en opmaak** (gedeeld door de drie pagina's) |
| `index.html` | Competitiepagina (laadt widget.js in modus "competitie") |
| `beker.html` | Bekerpagina (modus "beker") |
| `kalender.html` | Weekkalender (modus "kalender") |
| `README.md` | Dit bestand |

Aanpassingen gebeuren dus altijd in **één bestand**: `widget.js`.

## Onderhoud: 1x per seizoen de reekscodes controleren

Het enige dat kan verouderen zijn de **reekscodes** (bv. `NAT1H`, `ADP2-A`) in de lijst `TEAMS` bovenaan `widget.js`: die veranderen als een ploeg naar een andere reeks gaat (bv. `NAT3H-C` wordt `NAT3H-B`).

- Wedstrijden met een onbekende code verdwijnen niet: ze verschijnen op de competitiepagina onder het kopje **"Overige reeksen"** (en staan sowieso in de volledige kalender).
- Zie je daar bij seizoensstart een reeks staan? Voeg de code toe aan `TEAMS` met de juiste ploegnaam. De codes vind je in het `Reeks`-veld van de databron, of als prefix van de wedstrijdnummers op volleyscores.be.
- Nieuwe **bekerreeksen** voeg je toe aan de lijst `BEKER_NAMES` (zelfde bestand).

Aanpassen kan rechtstreeks op GitHub: klik op `widget.js` → potlood-icoon → wijzig → **Commit changes**. Na een minuut staat de nieuwe versie live op alle drie de pagina's tegelijk.

## Achtergrond

Deze kalender vervangt de vroegere iframe-embed van volleyscores.be, die wel actueel maar visueel onoverzichtelijk was. De data blijft van dezelfde bron komen (Volley Vlaanderen); alleen de weergave is van de club zelf.
