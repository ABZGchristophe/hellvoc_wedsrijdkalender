#!/usr/bin/env python3
"""Genereert de Hellvoc-wedstrijdenwidget (statische HTML) uit volleyscores-data.

Gebruik:  python3 genereer.py
Input :  data_competitie.txt  (secties met @@-headers, regels exact zoals op volleyscores)
Output:  /mnt/user-data/outputs/hellvoc-wedstrijden.html
"""
import html
import re
import sys
import urllib.parse

DATA_FILE = "data_competitie.txt"
OUT_FILE = "/mnt/user-data/outputs/hellvoc-wedstrijden.html"

HOME_VENUE = "Hemiksem, Gemeentelijk Sportcentrum"

# Venue-namen die eindigen op een hoofdletterwoord, waardoor de automatische
# splitsing (kleine letter -> hoofdletter) faalt. Prefix-match heeft voorrang.
SPECIAL_VENUES = [
    "Lint, Centrum De Witte Merel zaal A",
]

LINE_RE = re.compile(
    r"^(Ma|Di|Wo|Do|Vr|Za|Zo) (\d{2})/(\d{2})/(\d{4})(\d{2}:\d{2})"
    r"([A-Za-z0-9-]+?-\d{3,4})(.+)$"
)
HELLVOC_RE = re.compile(r"Hellvoc Hemiksem-Schelle", re.IGNORECASE)
JUNCTION_RE = re.compile(r"[a-z0-9)](?=[A-Z])")
AWAY_POST_RE = re.compile(r"^( [A-F]| \(\+\))?$")

MAANDEN = ["jan", "feb", "mrt", "apr", "mei", "jun",
           "jul", "aug", "sep", "okt", "nov", "dec"]

# sectiekop in datafile -> (weergavenaam, reekslabel)
TEAM_META = {
    "Nationale 1 Heren": ("Heren A", "Nationale 1"),
    "Nationale 3 Heren C": ("Heren B", "Nationale 3"),
    "Heren Promo 2": ("Heren C", "Promo 2"),
    "Heren promo 4 (1ste gewest Antwerpen)": ("Heren D", "Promo 4"),
    "Nationale 1 Dames": ("Dames A", "Nationale 1"),
    "Dames promo 2 A": ("Dames B", "Promo 2"),
    "Dames promo 3 B": ("Dames C", "Promo 3"),
    "Dames promo 4 (1ste gewest Antwerpen)": ("Dames D", "Promo 4"),
    "Dames promo 5 (2de gewest Antwerpen A)": ("Dames E", "Promo 5"),
    "Dames promo 5 (2de gewest Antwerpen B)": ("Dames F", "Promo 5"),
    "Jongens U17 Niveau 2 B": ("Jongens U17", "Niveau 2"),
    "Jongens U13 Niveau 1": ("Jongens U13 A", "Niveau 1"),
    "Jongens U13 Niveau 2 D": ("Jongens U13 B", "Niveau 2"),
    "Meisjes U17 Niveau 2 B": ("Meisjes U17 A", "Niveau 2"),
    "Meisjes U17 Niveau 3 A": ("Meisjes U17 B", "Niveau 3"),
    "Meisjes U15 Niveau 1 D": ("Meisjes U15 A", "Niveau 1"),
    "Meisjes U15 Niveau 3 B": ("Meisjes U15 B", "Niveau 3"),
    "Meisjes U13 Niveau 2 B": ("Meisjes U13", "Niveau 2"),
    "U11 Niveau 3 B": ("U11", "Niveau 3"),
}

DISPLAY_ORDER = [
    "Heren A", "Heren B", "Heren C", "Heren D",
    "Dames A", "Dames B", "Dames C", "Dames D", "Dames E", "Dames F",
    "Jongens U17", "Jongens U13 A", "Jongens U13 B",
    "Meisjes U17 A", "Meisjes U17 B", "Meisjes U15 A", "Meisjes U15 B",
    "Meisjes U13", "U11",
]

# ---------------------------------------------------------------------------
# Bekerwedstrijden: handmatig gecodeerd (kleine, rommelige dataset met
# placeholders zoals "winnaar 101"). velden:
#   reeks, (jjjj,mm,dd), tijd|None, thuis(bool), teamtag, tegenstander, venue|None
BEKER = [
    ("Belgian Cup Heren", (2026, 8, 29), "20:30", False, "Heren A",
     "TeamFisk Volley Klein-Brabant Puurs-Sint-Amands A (N1)", "Puurs, Sporthal Vrijhals"),
    ("Belgian Cup Dames", (2026, 8, 22), "14:30", False, "Dames A",
     "CapitalAtWork BAO Tchalou Volley B (N2)", "Chapelle-lez-Herlaimont, salle W.Empain"),
    ("Interfederale Beker Heren", (2026, 9, 5), "20:00", False, "Heren B",
     "KVC Zoersel B (Nat 3)", "Zoersel, Sportcomplex"),
    ("Beker van Antwerpen \u2013 Seniors Heren", (2026, 12, 19), None, False, "Heren A",
     "Nog te bepalen (winnaar match 101)", None),
    ("Beker van Antwerpen \u2013 Seniors Dames", (2026, 10, 31), None, False, "Dames A",
     "Nog te bepalen (winnaar match 102)", None),
    ("Beker van Antwerpen \u2013 Meisjes U19", (2026, 12, 19), None, True, "Meisjes U19",
     "V.C. Retie", HOME_VENUE),
    ("Beker van Antwerpen \u2013 Meisjes U17", (2026, 10, 31), None, False, "Meisjes U17",
     "Koninklijke Msiks Blaasveld VC", "Tisselt, Ter Molen"),
    ("Beker van Antwerpen \u2013 Meisjes U15", (2026, 10, 31), None, False, "Meisjes U15",
     "Noust Spinley Dessel", "Dessel, Sportpark Brasel"),
    ("Beker van Antwerpen \u2013 Jongens U13", (2027, 1, 23), None, False, "Jongens U13",
     "Nog te bepalen (winnaar match 103)", None),
    ("Beker van Antwerpen \u2013 Meisjes U13", (2026, 10, 31), "14:30", False, "Meisjes U13",
     "KVC Zoersel", "Zoersel, Sportschuur VC Zoersel"),
    ("Beker van Antwerpen \u2013 Jongens U11", (2027, 1, 23), None, True, "Jongens U11",
     "Mavoc-Mechelen", HOME_VENUE),
    ("Beker van Antwerpen \u2013 Meisjes U11", (2027, 1, 23), None, True, "Meisjes U11",
     "Nog te bepalen (winnaar match 104)", HOME_VENUE),
    ("Beker gewest Antwerpen \u2013 Heren provinciaal", (2026, 12, 19), None, False, "Heren C",
     "Fixit Volley Kalmthout B (P1)", "Kalmthout, Gem. Sporthal Achterbroek"),
    ("Beker gewest Antwerpen \u2013 Heren gewestelijk", (2026, 12, 19), None, False, "Heren D",
     "Nog te bepalen (winnaar match 101)", None),
    ("Beker gewest Antwerpen \u2013 Dames provinciaal", (2026, 12, 19), None, False, "Dames B",
     "Fixit Volley Kalmthout B (P2)", "Kalmthout, Gem. Sporthal Achterbroek"),
    ("Beker gewest Antwerpen \u2013 Dames provinciaal", (2026, 12, 19), None, False, "Dames C",
     "Grinta Valentino Lint C (P3)", "Lint, Ontmoetingscentrum De Witte Merel"),
    ("Beker gewest Antwerpen \u2013 Dames gewestelijk", (2026, 9, 5), None, True, "Dames D/E",
     "Hellvoc E (onderlinge wedstrijd)", HOME_VENUE),
    ("Beker gewest Antwerpen \u2013 Meisjes U19", (2027, 1, 23), None, False, "Meisjes U19",
     "Wavoc Waverse", "O.L.Vr.Waver, Sporthal Bruultjeshoek"),
    ("Beker gewest Antwerpen \u2013 Meisjes U17", (2026, 12, 19), None, True, "Meisjes U17",
     "Nog te bepalen (winnaar match 102)", HOME_VENUE),
    ("Beker gewest Antwerpen \u2013 Meisjes U15", (2026, 12, 19), "14:00", False, "Meisjes U15",
     "Geel Zwart Wijnegem", "Wijnegem, Sportcentrum"),
    ("Beker gewest Antwerpen \u2013 Jongens U13", (2027, 1, 23), None, True, "Jongens U13",
     "Geel Zwart Wijnegem", HOME_VENUE),
    ("Beker gewest Antwerpen \u2013 Meisjes U13", (2026, 12, 19), None, False, "Meisjes U13",
     "Bravoc Ranst", "Broechem Sporthal Het Loo (zaal B)"),
    ("Beker gewest Antwerpen \u2013 Jongens U11", (2027, 1, 23), None, True, "Jongens U11",
     "Mortsel Volley Antwerpen", HOME_VENUE),
    ("Beker gewest Antwerpen \u2013 Meisjes U11", (2027, 1, 23), None, True, "Meisjes U11",
     "Grinta Valentino Lint", HOME_VENUE),
]

# ---------------------------------------------------------------------------


def parse_data(text):
    """-> dict sectiekop -> lijst wedstrijden, + lijst problemen."""
    sections = {}
    problems = []
    current = None
    for lineno, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line:
            continue
        if line.startswith("@@"):
            current = line[2:].strip()
            sections[current] = []
            continue
        m = LINE_RE.match(line)
        if not m:
            problems.append(f"regel {lineno}: geen match op regexpatroon: {line[:60]}")
            continue
        _dag, dd, mm, yyyy, tijd, _code, rest = m.groups()
        hm = HELLVOC_RE.search(rest)
        if not hm:
            problems.append(f"regel {lineno}: geen Hellvoc gevonden: {line[:60]}")
            continue
        pre, post = rest[: hm.start()], rest[hm.end():]

        venue = opponent = None
        thuis = None
        # 1) bekende lastige venues eerst (prefix-match)
        for sv in SPECIAL_VENUES:
            if pre.startswith(sv) and len(pre) > len(sv):
                venue, opponent, thuis = sv, pre[len(sv):], False
                break
        if thuis is None:
            j = JUNCTION_RE.search(pre)
            if j:  # venue|thuisploeg-grens gevonden -> Hellvoc speelt uit
                cut = j.start() + 1
                venue, opponent, thuis = pre[:cut], pre[cut:], False
            else:  # pre is enkel de venue -> Hellvoc speelt thuis
                venue, thuis = pre, True

        if thuis:
            if post.startswith(" (+)"):
                opponent = post[4:]
            elif re.match(r"^ [A-F](?=[A-Z])", post):
                opponent = post[2:]  # strip " X" (spatie + ploegletter)
            elif post[:1].isupper():
                opponent = post
            else:
                problems.append(f"regel {lineno}: thuis, onduidelijke tegenstander: {post!r}")
                continue
            if venue != HOME_VENUE:
                problems.append(f"regel {lineno}: thuiswedstrijd maar venue={venue!r}")
        else:
            if not AWAY_POST_RE.match(post):
                problems.append(f"regel {lineno}: uit, onverwachte suffix na Hellvoc: {post!r}")
            if not opponent or not opponent[:1].isupper():
                problems.append(f"regel {lineno}: uit, rare thuisploeg: {opponent!r}")

        if opponent and "hellvoc" in opponent.lower():
            problems.append(f"regel {lineno}: tegenstander bevat Hellvoc: {opponent!r}")

        sections[current].append({
            "datum": (int(yyyy), int(mm), int(dd)),
            "tijd": tijd,
            "thuis": thuis,
            "tegenstander": opponent.strip() if opponent else "",
            "venue": venue.strip() if venue else "",
        })
    return sections, problems


DAGEN = {0: "ma", 1: "di", 2: "wo", 3: "do", 4: "vr", 5: "za", 6: "zo"}


def fmt_datum(d):
    import datetime
    y, m, day = d
    wd = DAGEN[datetime.date(y, m, day).weekday()]
    return f"{wd} {day} {MAANDEN[m - 1]} {y}"


# ---------------------------------------------------------------------------
# HTML-bouwstenen (stijl van de goedgekeurde widget)

CSS = """
.xx-wed-root{position:relative;left:50%;margin-left:-50vw;width:100vw;box-sizing:border-box;
  background:#000;padding:clamp(12px,3vw,32px);
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;}
.xx-wed-root *{box-sizing:border-box;}
.xx-wed-inner{max-width:860px;margin:0 auto;}
.xx-wed-team{background:#fff;border-radius:10px;margin-bottom:10px;overflow:hidden;}
.xx-wed-team>summary{display:flex;align-items:center;gap:10px;cursor:pointer;list-style:none;
  background:#0d1b2a;color:#fff;padding:14px clamp(12px,2.5vw,20px);user-select:none;}
.xx-wed-team>summary::-webkit-details-marker{display:none;}
.xx-wed-team-name{font-size:clamp(15px,2.2vw,17px);font-weight:700;flex:1;}
.xx-wed-count{font-size:clamp(11px,1.8vw,13px);color:#9fb3c8;font-weight:400;}
.xx-wed-chevron{width:14px;height:14px;flex:none;transition:transform .2s ease;}
.xx-wed-team[open] .xx-wed-chevron{transform:rotate(180deg);}
.xx-wed-list{padding:4px clamp(8px,2vw,14px) 10px;}
.xx-wed-subhead{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;
  color:#0d1b2a;padding:16px 6px 5px;border-bottom:2px solid #0d1b2a;margin-bottom:2px;}
.xx-wed-row{display:flex;align-items:flex-start;gap:clamp(8px,2vw,14px);
  padding:9px 6px;border-bottom:1px solid #e8e8e8;}
.xx-wed-row:last-child{border-bottom:none;}
.xx-wed-icon{flex:none;width:26px;height:26px;border-radius:50%;display:flex;
  align-items:center;justify-content:center;margin-top:1px;}
.xx-wed-icon--home{background:#e3f4e3;}
.xx-wed-icon--away{background:#e3ecf7;}
.xx-wed-icon-svg{width:15px;height:15px;display:block;}
.xx-wed-datetime{flex:none;width:clamp(96px,16vw,120px);display:flex;flex-direction:column;}
.xx-wed-date{font-size:clamp(12px,1.9vw,14px);font-weight:600;color:#1a1a1a;}
.xx-wed-time{font-size:clamp(11px,1.7vw,13px);color:#666;}
.xx-wed-info{flex:1;min-width:0;}
.xx-wed-teamtag{display:block;font-size:11px;color:#888;margin-bottom:1px;}
.xx-wed-venue-toggle{position:relative;}
.xx-wed-venue-toggle>summary{list-style:none;cursor:pointer;display:inline-flex;
  align-items:center;gap:5px;font-size:clamp(13px,2vw,15px);color:#1a1a1a;
  text-decoration:underline dotted #999;text-underline-offset:3px;}
.xx-wed-venue-toggle>summary::-webkit-details-marker{display:none;}
.xx-wed-opponent--plain{font-size:clamp(13px,2vw,15px);color:#1a1a1a;}
.xx-wed-pin-svg{width:13px;height:13px;flex:none;}
.xx-wed-venue-popup{margin-top:6px;background:#f4f6f8;border:1px solid #d8dee5;
  border-radius:8px;padding:10px 12px;font-size:clamp(12px,1.9vw,14px);}
.xx-wed-venue-address{display:block;color:#333;margin-bottom:6px;}
.xx-wed-venue-maps-link{color:#0d47a1;font-weight:600;text-decoration:none;}
.xx-wed-venue-maps-link:hover{text-decoration:underline;}
.xx-wed-venue-note{display:block;font-size:clamp(12px,1.9vw,14px);color:#888;}
.xx-wed-footer{color:#8a8a8a;font-size:12px;text-align:center;padding-top:10px;}
"""

SPRITE = ('<svg style="display:none" aria-hidden="true">'
          '<symbol id="xxw-home" viewBox="0 0 24 24">'
          '<g fill="none" stroke="#2e7d32" stroke-width="2.4" stroke-linecap="round" '
          'stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/>'
          '<path d="M5 9.5V21h14V9.5"/></g></symbol>'
          '<symbol id="xxw-away" viewBox="0 0 24 24"><path fill="#0d47a1" '
          'd="M21.5 15.5v-2l-8.5-5V3.2a1.2 1.2 0 0 0-2.4 0v5.3l-8.5 5v2l8.5-2.6v5.3'
          'l-2.3 1.7v1.6l3.5-1 3.5 1v-1.6l-2.3-1.7v-5.3z"/></symbol>'
          '<symbol id="xxw-pin" viewBox="0 0 24 24"><path fill="#c62828" '
          'd="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 '
          '9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></symbol>'
          '<symbol id="xxw-chev" viewBox="0 0 24 24"><path fill="none" stroke="#fff" '
          'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" '
          'd="m6 9 6 6 6-6"/></symbol></svg>')
SVG_HOME = '<svg class="xx-wed-icon-svg" aria-hidden="true"><use href="#xxw-home"/></svg>'
SVG_AWAY = '<svg class="xx-wed-icon-svg" aria-hidden="true"><use href="#xxw-away"/></svg>'
SVG_PIN = '<svg class="xx-wed-pin-svg" aria-hidden="true"><use href="#xxw-pin"/></svg>'
SVG_CHEVRON = '<svg class="xx-wed-chevron" aria-hidden="true"><use href="#xxw-chev"/></svg>'


def maps_href(venue):
    q = urllib.parse.quote(venue, safe="")
    return html.escape(f"https://www.google.com/maps/search/?api=1&query={q}")


def row_html(w, teamtag=None):
    icon_cls = "home" if w["thuis"] else "away"
    icon_svg = SVG_HOME if w["thuis"] else SVG_AWAY
    icon_title = "Thuiswedstrijd" if w["thuis"] else "Uitwedstrijd"
    tijd = w["tijd"] if w["tijd"] and w["tijd"] != "00:00" else "uur volgt"
    tag = (f'<span class="xx-wed-teamtag">{html.escape(teamtag)}</span>'
           if teamtag else "")
    opp = html.escape(w["tegenstander"])
    if w["venue"]:
        info = (f'{tag}<details class="xx-wed-venue-toggle">'
                f'<summary title="Toon sporthal">{SVG_PIN}<span>{opp}</span></summary>'
                f'<div class="xx-wed-venue-popup">'
                f'<span class="xx-wed-venue-address">{html.escape(w["venue"])}</span>'
                f'<a class="xx-wed-venue-maps-link" href="{maps_href(w["venue"])}" '
                f'target="_blank" rel="noopener">Open in Google Maps</a></div></details>')
    else:
        info = (f'{tag}<span class="xx-wed-opponent--plain">{opp}</span>'
                f'<span class="xx-wed-venue-note">Locatie volgt</span>')
    return (f'<div class="xx-wed-row">'
            f'<span class="xx-wed-icon xx-wed-icon--{icon_cls}" title="{icon_title}">{icon_svg}</span>'
            f'<span class="xx-wed-datetime"><span class="xx-wed-date">{fmt_datum(w["datum"])}</span>'
            f'<span class="xx-wed-time">{html.escape(tijd)}</span></span>'
            f'<span class="xx-wed-info">{info}</span></div>')


def team_block(name, label, rows_html):
    return (f'<details class="xx-wed-team"><summary>'
            f'<span class="xx-wed-team-name">{html.escape(name)}</span>'
            f'<span class="xx-wed-count">{html.escape(label)}</span>{SVG_CHEVRON}</summary>'
            f'<div class="xx-wed-list">{rows_html}</div></details>')


def build_html(sections):
    by_name = {}
    for sec, matches in sections.items():
        name, label = TEAM_META[sec]
        matches.sort(key=lambda w: (w["datum"], w["tijd"]))
        by_name[name] = (label, matches)

    blocks = []
    for name in DISPLAY_ORDER:
        label, matches = by_name[name]
        rows = "".join(row_html(w) for w in matches)
        blocks.append(team_block(name, f"{label} \u00b7 {len(matches)} wedstrijden", rows))

    # Bekerblok, gegroepeerd per reeks
    beker_rows = []
    prev_reeks = None
    n_beker = 0
    for reeks, datum, tijd, thuis, tag, opp, venue in BEKER:
        if reeks != prev_reeks:
            beker_rows.append(f'<div class="xx-wed-subhead">{html.escape(reeks)}</div>')
            prev_reeks = reeks
        w = {"datum": datum, "tijd": tijd, "thuis": thuis,
             "tegenstander": opp, "venue": venue or ""}
        beker_rows.append(row_html(w, teamtag=tag))
        n_beker += 1
    blocks.append(team_block("Beker", f"alle ploegen \u00b7 {n_beker} wedstrijden",
                             "".join(beker_rows)))

    return (f'<div class="xx-wed-root"><style>{CSS}</style>' + SPRITE + '<div class="xx-wed-inner">'
            + "".join(blocks)
            + '<div class="xx-wed-footer">Bron: volleyscores.be \u00b7 '
              'laatst bijgewerkt juli 2026</div>'
            + "</div></div>\n")


def main():
    with open(DATA_FILE, encoding="utf-8") as f:
        sections, problems = parse_data(f.read())

    print("== Wedstrijden per reeks ==")
    total = 0
    for sec, matches in sections.items():
        t = sum(1 for w in matches if w["thuis"])
        print(f"  {sec:45s} {len(matches):3d}  (thuis {t}, uit {len(matches)-t})")
        total += len(matches)
    print(f"  {'TOTAAL':45s} {total:3d}  + {len(BEKER)} beker")

    if problems:
        print("\n== PROBLEMEN ==")
        for p in problems:
            print("  !", p)
        sys.exit(1)

    missing = set(TEAM_META) ^ set(sections)
    if missing:
        print("Sectie/meta-mismatch:", missing)
        sys.exit(1)

    out = build_html(sections)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"\nOK -> {OUT_FILE} ({len(out)} tekens)")


if __name__ == "__main__":
    main()
