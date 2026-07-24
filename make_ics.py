#!/usr/bin/env python3
"""Genereert agenda-bestanden (.ics) per Hellvoc-ploeg uit de Volley Vlaanderen-feed.

Draait dagelijks via GitHub Actions (.github/workflows/ics.yml) en schrijft naar ics/.
Lokaal testen: HELLVOC_FEED_FILE=voorbeeld.json python3 scripts/make_ics.py
"""
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timedelta, timezone

CLUB = "AA-1342"
FEED = f"https://www.volleyadmin2.be/services/wedstrijden_xml.php?stamnummer={CLUB}&format=json"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "ics")

# Zelfde mapping als in widget.js — bij seizoenswissel op beide plekken aanpassen
TEAMS = {
    "NAT1H": "Heren A", "NAT3H-C": "Heren B", "AHP2": "Heren C", "AHP4A": "Heren D",
    "NAT1D": "Dames A", "ADP2-A": "Dames B", "ADP3-B": "Dames C", "ADP4A": "Dames D",
    "ADP5AA": "Dames E", "ADP5AB": "Dames F",
    "AJU17N2R1-B": "Jongens U17", "AJU13N1R1": "Jongens U13 A", "AJU13N2R1-D": "Jongens U13 B",
    "AMU17N2R1-B": "Meisjes U17 A", "AMU17N3R1-A": "Meisjes U17 B",
    "AMU15N1R1-D": "Meisjes U15 A", "AMU15N3R1-B": "Meisjes U15 B",
    "AMU13N2R1-B": "Meisjes U13", "AU11N3R1-B": "U11",
}

VTIMEZONE = """BEGIN:VTIMEZONE
TZID:Europe/Brussels
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE"""


def slugify(naam):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", naam.lower())).strip("-")


def ics_escape(s):
    return (s.replace("\\", "\\\\").replace(";", "\\;")
             .replace(",", "\\,").replace("\n", "\\n"))


def fold(line):
    """RFC 5545: regels max 75 bytes, vervolgd met spatie."""
    out, cur = [], line
    while len(cur.encode("utf-8")) > 73:
        cut = 73
        while len(cur[:cut].encode("utf-8")) > 73:
            cut -= 1
        out.append(cur[:cut])
        cur = " " + cur[cut:]
    out.append(cur)
    return "\r\n".join(out)


def event(m, teamnaam):
    dag, maand, jaar = m["t"].split("/")
    uur = (m.get("Aanvangsuur") or "")[:5]
    thuis = m.get("stnr_home") == CLUB
    opp = (m.get("Bezoekers") if thuis else m.get("Thuis")) or "Nog te bepalen"
    opp = opp.strip() or "Nog te bepalen"
    venue = (m.get("SporthalNaam") or "").strip()
    nr = (m.get("Wedstrijdnr") or f"{m['t']}-{teamnaam}").strip()

    summary = f"\U0001F3D0 {teamnaam}: {'Hellvoc - ' + opp if thuis else opp + ' - Hellvoc'}"
    lines = ["BEGIN:VEVENT",
             f"UID:{slugify(nr)}@hellvoc-kalender",
             f"DTSTAMP:{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}"]
    if uur and uur != "00:00":
        start = datetime(int(jaar), int(maand), int(dag),
                         int(uur[:2]), int(uur[3:5]))
        eind = start + timedelta(hours=2)
        lines += [f"DTSTART;TZID=Europe/Brussels:{start.strftime('%Y%m%dT%H%M%S')}",
                  f"DTEND;TZID=Europe/Brussels:{eind.strftime('%Y%m%dT%H%M%S')}"]
    else:  # uur nog niet gekend: hele-dag-item
        d0 = datetime(int(jaar), int(maand), int(dag))
        lines += [f"DTSTART;VALUE=DATE:{d0.strftime('%Y%m%d')}",
                  f"DTEND;VALUE=DATE:{(d0 + timedelta(days=1)).strftime('%Y%m%d')}",
                  "DESCRIPTION:Aanvangsuur nog niet gekend"]
    lines.append("SUMMARY:" + ics_escape(summary))
    if venue:
        lines.append("LOCATION:" + ics_escape(venue))
    if m.get("postponed") == "1":
        lines.append("STATUS:CANCELLED")
    lines.append("END:VEVENT")
    return lines


def kalender(naam, events):
    lines = ["BEGIN:VCALENDAR", "VERSION:2.0",
             "PRODID:-//Hellvoc Hemiksem-Schelle//Wedstrijdkalender//NL",
             "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
             "X-WR-CALNAME:" + ics_escape(f"Hellvoc {naam}"),
             "X-WR-TIMEZONE:Europe/Brussels"]
    lines += VTIMEZONE.splitlines()
    for ev in events:
        lines += ev
    lines.append("END:VCALENDAR")
    return "\r\n".join(fold(l) for l in lines) + "\r\n"


def main():
    bron = os.environ.get("HELLVOC_FEED_FILE")
    if bron:
        with open(bron, encoding="utf-8") as f:
            data = json.load(f)
    else:
        req = urllib.request.Request(FEED, headers={"User-Agent": "hellvoc-ics/1.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.load(r)
    if not isinstance(data, list) or not data:
        print("Feed leeg of onverwacht formaat; ics ongewijzigd gelaten.")
        sys.exit(0)

    os.makedirs(OUT_DIR, exist_ok=True)
    per_team, alles = {}, []
    for m in data:
        reeks = m.get("Reeks", "")
        naam = TEAMS.get(reeks)
        try:
            ev_alles = event(m, naam or reeks or "Hellvoc")
        except Exception as e:  # één kapotte rij mag de rest niet blokkeren
            print("  ! rij overgeslagen:", e, m.get("Wedstrijdnr"))
            continue
        alles.append(ev_alles)
        if naam:
            per_team.setdefault(naam, []).append(event(m, naam))
        else:
            per_team.setdefault("Beker", []).append(event(m, reeks or "Beker"))

    for naam, events in per_team.items():
        pad = os.path.join(OUT_DIR, slugify(naam) + ".ics")
        with open(pad, "w", encoding="utf-8", newline="") as f:
            f.write(kalender(naam, events))
        print(f"  {slugify(naam) + '.ics':28s} {len(events):3d} wedstrijden")
    with open(os.path.join(OUT_DIR, "alle-wedstrijden.ics"), "w",
              encoding="utf-8", newline="") as f:
        f.write(kalender("alle wedstrijden", alles))
    print(f"  {'alle-wedstrijden.ics':28s} {len(alles):3d} wedstrijden")


if __name__ == "__main__":
    main()
