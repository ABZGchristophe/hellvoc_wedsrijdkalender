# [Wedstrijden Hellvoc Hemiksem-Schelle](https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/)

Live wedstrijdkalender van volleybalclub **Hellvoc Hemiksem-Schelle** (stamnummer AA-1342), getoond op de clubwebsite via een iframe.

## Wat doet dit?

`index.html` is één zelfstandige pagina die bij elke paginaweergave de actuele wedstrijden ophaalt bij de officiële webservice van Volley Vlaanderen (volleyadmin2.be) en die overzichtelijk toont:

- Een inklapbaar blok per ploeg (Heren A–D, Dames A–F, jeugdploegen) plus een blok "Beker & overige"
- Per wedstrijd: thuis/uit-icoon, datum en uur, tegenstander
- Klik op een tegenstander voor de sporthal met een "Open in Google Maps"-link
- Gespeelde wedstrijden tonen automatisch de uitslag
- Uitgestelde wedstrijden krijgen een rood label; verplaatste wedstrijden staan altijd op de juiste datum, want de data komt rechtstreeks van de bond

Er is dus **geen onderhoud nodig** voor gewone kalenderwijzigingen: alles wordt live opgehaald.

## Databron

```
https://www.volleyadmin2.be/services/wedstrijden_xml.php?stamnummer=AA-1342&format=json
```

Deze webservice werkt met een toegangslijst per domein. Toegang voor dit domein is aangevraagd bij de beheerder (kevin@kdg-projects.be). Zie je op de pagina een foutmelding met een link naar volleyscores.be, dan is de toegang (nog) niet actief voor dit domein.

## Gebruik op de clubwebsite (AnyKrowd)

AnyKrowd voert scripts in HTML-blokken niet uit; daarom draait de widget op deze GitHub Pages-URL en wordt hij ingesloten via een iframe. Plak dit in een HTML-blok:

```html
<div style="width:100%; height:80vh; min-height:400px;">
  <iframe src="https://abzgchristophe.github.io/hellvoc_wedstrijdkalender/"
          title="Wedstrijden Hellvoc Hemiksem-Schelle"
          loading="lazy"
          style="display:block; width:100%; height:100%; border:0; background:#000;"></iframe>
</div>
```

## Onderhoud: 1x per seizoen de reekscodes controleren

Het enige dat kan verouderen zijn de **reekscodes** (bv. `NAT1H`, `ADP2-A`): die veranderen als een ploeg naar een andere reeks gaat (bv. `NAT3H-C` wordt `NAT3H-B`).

- Wedstrijden met een onbekende code verdwijnen niet, maar verschijnen onderaan in het blok **"Beker & overige"**.
- Zie je daar bij seizoensstart een competitiereeks staan? Open `index.html`, zoek de lijst `TEAMS` in het script en pas de code aan. De juiste codes vind je in het `Reeks`-veld van de databron hierboven, of als prefix van de wedstrijdnummers op volleyscores.be.

Aanpassen kan rechtstreeks op GitHub: klik op `index.html` → potlood-icoon → wijzig → **Commit changes**. Na een minuut staat de nieuwe versie live.

## Bestanden

| Bestand | Doel |
| --- | --- |
| `index.html` | De volledige widget: opmaak + script dat de feed ophaalt en rendert |
| `README.md` | Dit bestand |

## Achtergrond

Deze widget vervangt de vroegere iframe-embed van volleyscores.be, die wel actueel maar visueel onoverzichtelijk was. De data blijft van dezelfde bron komen (Volley Vlaanderen); alleen de weergave is van de club zelf.
