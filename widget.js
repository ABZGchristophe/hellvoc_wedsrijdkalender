/* ============================================================
   Hellvoc Hemiksem-Schelle - wedstrijdkalender (gedeelde logica)
   Gebruikt door: index.html (competitie), beker.html, kalender.html
   ONDERHOUD (1x per seizoen): controleer de reekscodes in TEAMS.
   Onbekende competitiecodes verschijnen automatisch onder
   "Overige reeksen" op de competitiepagina.
============================================================ */
(function () {
  "use strict";
  var MODE = window.XXW_MODE || "kalender";
  var CSS = ".xx-wed-root{width:100%;min-height:100vh;box-sizing:border-box; background:#000;padding:clamp(12px,3vw,32px); font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;} .xx-wed-root *{box-sizing:border-box;} .xx-wed-inner{max-width:860px;margin:0 auto;} .xx-wed-team{background:#fff;border-radius:10px;margin-bottom:10px;overflow:hidden;} .xx-wed-team>summary{display:flex;align-items:center;gap:10px;cursor:pointer;list-style:none; background:#0d1b2a;color:#fff;padding:14px clamp(12px,2.5vw,20px);user-select:none;} .xx-wed-team>summary::-webkit-details-marker{display:none;} .xx-wed-team-name{font-size:clamp(15px,2.2vw,17px);font-weight:700;flex:1;} .xx-wed-count{font-size:clamp(11px,1.8vw,13px);color:#9fb3c8;font-weight:400;} .xx-wed-chevron{width:14px;height:14px;flex:none;transition:transform .2s ease;} .xx-wed-team[open] .xx-wed-chevron{transform:rotate(180deg);} .xx-wed-list{padding:4px clamp(8px,2vw,14px) 10px;} .xx-wed-subhead{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em; color:#0d1b2a;padding:16px 6px 5px;border-bottom:2px solid #0d1b2a;margin-bottom:2px;} .xx-wed-row{display:flex;align-items:flex-start;gap:clamp(8px,2vw,14px); padding:9px 6px;border-bottom:1px solid #e8e8e8;} .xx-wed-row:last-child{border-bottom:none;} .xx-wed-icon{flex:none;width:26px;height:26px;border-radius:50%;display:flex; align-items:center;justify-content:center;margin-top:1px;} .xx-wed-icon--home{background:#e3f4e3;} .xx-wed-icon--away{background:#e3ecf7;} .xx-wed-icon-svg{width:15px;height:15px;display:block;} .xx-wed-datetime{flex:none;width:clamp(96px,16vw,120px);display:flex;flex-direction:column;} .xx-wed-date{font-size:clamp(12px,1.9vw,14px);font-weight:600;color:#1a1a1a;} .xx-wed-time{font-size:clamp(11px,1.7vw,13px);color:#666;} .xx-wed-info{flex:1;min-width:0;} .xx-wed-teamtag{display:block;font-size:11px;color:#888;margin-bottom:1px;} .xx-wed-venue-toggle{position:relative;} .xx-wed-venue-toggle>summary{list-style:none;cursor:pointer;display:inline-flex; align-items:center;gap:5px;font-size:clamp(13px,2vw,15px);color:#1a1a1a; text-decoration:underline dotted #999;text-underline-offset:3px;} .xx-wed-venue-toggle>summary::-webkit-details-marker{display:none;} .xx-wed-opponent--plain{font-size:clamp(13px,2vw,15px);color:#1a1a1a;} .xx-wed-pin-svg{width:13px;height:13px;flex:none;} .xx-wed-venue-popup{margin-top:6px;background:#f4f6f8;border:1px solid #d8dee5; border-radius:8px;padding:10px 12px;font-size:clamp(12px,1.9vw,14px);} .xx-wed-venue-address{display:block;color:#333;margin-bottom:6px;} .xx-wed-venue-maps-link{color:#0d47a1;font-weight:600;text-decoration:none;} .xx-wed-venue-maps-link:hover{text-decoration:underline;} .xx-wed-venue-note{display:block;font-size:clamp(12px,1.9vw,14px);color:#888;} .xx-wed-score{display:inline-block;margin-left:7px;padding:1px 7px;border-radius:9px; background:#0d1b2a;color:#fff;font-size:11.5px;font-weight:700;white-space:nowrap;} .xx-wed-badge{display:inline-block;margin-left:7px;padding:1px 7px;border-radius:9px; background:#c62828;color:#fff;font-size:11px;font-weight:700;} .xx-wed-tabs{display:flex;gap:8px;margin-bottom:14px;} .xx-wed-tab{flex:1;padding:10px 12px;border:1px solid #3a4a5c;border-radius:8px; background:transparent;color:#9fb3c8;font-family:inherit; font-size:clamp(13px,2vw,15px);font-weight:600;cursor:pointer;} .xx-wed-tab--on{background:#0d1b2a;color:#fff;border-color:#33506e;} .xx-wed-cat{color:#9fb3c8;font-size:12px;font-weight:700;text-transform:uppercase; letter-spacing:.08em;margin:18px 2px 8px;} .xx-wed-super{display:inline-block;margin-left:7px;padding:1px 7px;border-radius:9px; background:#D5C810;color:#1a1a1a;font-size:11px;font-weight:700;white-space:nowrap;} .xx-wed-tbl{width:100%;border-collapse:collapse;font-size:clamp(12px,1.9vw,14px);} .xx-wed-tbl th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.03em;color:#667;padding:8px 6px 4px;border-bottom:2px solid #0d1b2a;} .xx-wed-tbl td{padding:7px 6px;border-bottom:1px solid #eee;} .xx-wed-tbl tr:last-child td{border-bottom:none;} .xx-wed-tbl .xx-wed-num{text-align:right;width:38px;color:#555;} .xx-wed-tbl .xx-wed-pos{width:26px;color:#888;} .xx-wed-hell td{background:#fdf3c4;font-weight:700;} .xx-wed-chip{color:#fff;font-size:clamp(13px,2vw,15px);font-weight:600;margin-bottom:12px;text-align:center;} .xx-wed-chip a{color:#9fb3c8;font-weight:400;} .xx-wed-ical{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:700;color:#0d47a1;text-decoration:none;padding:8px 6px 2px;} .xx-wed-promo{background:#0d1b2a;border:1px solid #f2b705;box-shadow:0 0 0 1px rgba(242,183,5,.25);border-radius:12px;padding:16px;color:#fff;margin:16px 0 4px;} .xx-wed-promo-title{font-size:clamp(16px,2.4vw,18px);font-weight:800;margin-bottom:4px;} .xx-wed-promo-sub{font-size:clamp(12px,2vw,13px);color:#9fb3c8;margin-bottom:10px;} .xx-wed-promo ul{list-style:none;margin:0 0 14px;padding:0;display:flex;flex-direction:column;gap:4px;} .xx-wed-promo li{font-size:clamp(12px,2vw,14px);color:#cfd8dc;display:flex;gap:8px;} .xx-wed-promo li::before{content:'\\2713';color:#f2b705;font-weight:800;flex-shrink:0;} .xx-wed-promo-cta{display:inline-block;background:#f2b705;color:#1a1a1a;font-weight:800;font-size:14px;padding:10px 16px;border-radius:8px;text-decoration:none;} .xx-wed-root--tv{cursor:none;} .xx-wed-root--tv *{cursor:none;} .xx-wed-tvtitle{color:#fff;font-size:42px;font-weight:900;margin:6px 4px 2px;} .xx-wed-tvsub{color:#9fb3c8;font-size:18px;margin:0 4px 6px;} .xx-wed-day{color:#f2b705;font-size:30px;font-weight:800;margin:28px 4px 12px;text-transform:uppercase;letter-spacing:.04em;} .xx-wed-tvrow{display:flex;align-items:center;gap:22px;background:#fff;border-radius:14px;padding:18px 22px;margin-bottom:12px;} .xx-wed-tvtime{font-size:34px;font-weight:800;color:#0d1b2a;width:130px;flex:none;} .xx-wed-tvinfo{flex:1;min-width:0;} .xx-wed-tvteam{font-size:18px;color:#888;font-weight:700;} .xx-wed-tvopp{font-size:28px;font-weight:800;color:#1a1a1a;line-height:1.15;} .xx-wed-tvvenue{font-size:17px;color:#666;margin-top:2px;} .xx-wed-tvside{flex:none;font-size:16px;font-weight:800;padding:8px 16px;border-radius:999px;} .xx-wed-tvside--home{background:#f2b705;color:#1a1a1a;} .xx-wed-tvside--away{background:#e3ecf7;color:#1a56c4;} .xx-wed-tvempty{color:#fff;font-size:30px;text-align:center;padding:70px 0;} .xx-wed-msg{background:#fff;border-radius:10px;padding:18px;color:#333; font-size:14px;text-align:center;} .xx-wed-msg a{color:#0d47a1;font-weight:600;} .xx-wed-live{display:flex;align-items:center;justify-content:center;gap:8px; color:#fff;font-size:clamp(12px,1.9vw,14px);font-weight:600;margin-bottom:12px;} .xx-wed-live small{color:#9fb3c8;font-weight:400;} .xx-wed-livedot{width:9px;height:9px;border-radius:50%;background:#2ecc71;flex:none; animation:xxwpulse 2s ease-in-out infinite;} @keyframes xxwpulse{0%,100%{box-shadow:0 0 0 0 rgba(46,204,113,.55);} 50%{box-shadow:0 0 0 6px rgba(46,204,113,0);}}";
  var SPRITE = "<svg style=\"display:none\" aria-hidden=\"true\"> <symbol id=\"xxw-home\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"#2e7d32\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 10.5 12 3l9 7.5\"/><path d=\"M5 9.5V21h14V9.5\"/></g></symbol> <symbol id=\"xxw-away\" viewBox=\"0 0 24 24\"><path fill=\"#0d47a1\" d=\"M21.5 15.5v-2l-8.5-5V3.2a1.2 1.2 0 0 0-2.4 0v5.3l-8.5 5v2l8.5-2.6v5.3l-2.3 1.7v1.6l3.5-1 3.5 1v-1.6l-2.3-1.7v-5.3z\"/></symbol> <symbol id=\"xxw-pin\" viewBox=\"0 0 24 24\"><path fill=\"#c62828\" d=\"M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z\"/></symbol> <symbol id=\"xxw-chev\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"#fff\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m6 9 6 6 6-6\"/></symbol> </svg>";
  var root = document.getElementById("xxw");
  root.className = MODE === "signage" ? "xx-wed-root xx-wed-root--tv" : "xx-wed-root";
  root.innerHTML = "<style>" + CSS + "</style>" + SPRITE +
    '<div class="xx-wed-inner" id="xxw-inner">' +
    '<div class="xx-wed-msg">Wedstrijden laden\u2026</div></div>';
  var CLUB = "AA-1342";
  var FEED = "https://www.volleyadmin2.be/services/wedstrijden_xml.php?stamnummer=" + CLUB + "&format=json";
  var RANK_FEED = "https://www.volleyadmin2.be/services/rangschikking_xml.php?stamnummer=" + CLUB + "&format=json";
  var FALLBACK_URL = "https://www.volleyscores.be/direct/" + CLUB;

  // reekscode -> [ploegnaam, reekslabel, sorteervolgorde]
  var TEAMS = {
    "NAT1H":        ["Heren A", "Nationale 1", 1],
    "NAT3H-C":      ["Heren B", "Nationale 3", 2],
    "AHP2":         ["Heren C", "Promo 2", 3],
    "AHP4A":        ["Heren D", "Promo 4", 4],
    "NAT1D":        ["Dames A", "Nationale 1", 5],
    "ADP2-A":       ["Dames B", "Promo 2", 6],
    "ADP3-B":       ["Dames C", "Promo 3", 7],
    "ADP4A":        ["Dames D", "Promo 4", 8],
    "ADP5AA":       ["Dames E", "Promo 5", 9],
    "ADP5AB":       ["Dames F", "Promo 5", 10],
    "AJU17N2R1-B":  ["Jongens U17", "Niveau 2", 11],
    "AJU13N1R1":    ["Jongens U13 A", "Niveau 1", 12],
    "AJU13N2R1-D":  ["Jongens U13 B", "Niveau 2", 13],
    "AMU17N2R1-B":  ["Meisjes U17 A", "Niveau 2", 14],
    "AMU17N3R1-A":  ["Meisjes U17 B", "Niveau 3", 15],
    "AMU15N1R1-D":  ["Meisjes U15 A", "Niveau 1", 16],
    "AMU15N3R1-B":  ["Meisjes U15 B", "Niveau 3", 17],
    "AMU13N2R1-B":  ["Meisjes U13", "Niveau 2", 18],
    "AU11N3R1-B":   ["U11", "Niveau 3", 19]
  };
  // leesbare namen voor beker-reeksen (onbekende codes tonen de code zelf)
  var BEKER_NAMES = {
    "BCH": "Belgian Cup Heren", "BCD": "Belgian Cup Dames",
    "IBH": "Interfederale Beker Heren",
    "BvASH": "Beker van Antwerpen \u2013 Seniors Heren",
    "BvASD": "Beker van Antwerpen \u2013 Seniors Dames",
    "BvAMU19": "Beker van Antwerpen \u2013 Meisjes U19",
    "BvAMU17": "Beker van Antwerpen \u2013 Meisjes U17",
    "BvAMU15": "Beker van Antwerpen \u2013 Meisjes U15",
    "BvAJU13": "Beker van Antwerpen \u2013 Jongens U13",
    "BvAMU13": "Beker van Antwerpen \u2013 Meisjes U13",
    "BvAJU11": "Beker van Antwerpen \u2013 Jongens U11",
    "BvAMU11": "Beker van Antwerpen \u2013 Meisjes U11",
    "BVGASHP": "Beker gewest Antwerpen \u2013 Heren provinciaal",
    "BVGASHG": "Beker gewest Antwerpen \u2013 Heren gewestelijk",
    "BVGASDP": "Beker gewest Antwerpen \u2013 Dames provinciaal",
    "BVGASDG": "Beker gewest Antwerpen \u2013 Dames gewestelijk",
    "BVGAMU19": "Beker gewest Antwerpen \u2013 Meisjes U19",
    "BvGAMU17": "Beker gewest Antwerpen \u2013 Meisjes U17",
    "BVGAMU15": "Beker gewest Antwerpen \u2013 Meisjes U15",
    "BVGAJU13": "Beker gewest Antwerpen \u2013 Jongens U13",
    "BVGAMU13": "Beker gewest Antwerpen \u2013 Meisjes U13",
    "BVGAJU11": "Beker gewest Antwerpen \u2013 Jongens U11",
    "BVGAMU11": "Beker gewest Antwerpen \u2013 Meisjes U11"
  };

  var DAGEN = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  var MAANDEN = ["jan", "feb", "mrt", "apr", "mei", "jun",
                 "jul", "aug", "sep", "okt", "nov", "dec"];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function parseMatch(m) {
    var p = String(m.t || "").split("/"); // dd/mm/jjjj
    var d = new Date(+p[2], +p[1] - 1, +p[0]);
    var tijd = String(m.Aanvangsuur || "").slice(0, 5);
    var isHome = m.stnr_home === CLUB; // bij onderling duel: thuisrij tonen
    return {
      reeks: m.Reeks || "?",
      date: d,
      sort: (m.t ? p[2] + p[1] + p[0] : "0") + tijd,
      tijd: (!tijd || tijd === "00:00") ? "uur volgt" : tijd,
      thuis: isHome,
      tegenstander: isHome ? (m.Bezoekers || "").trim() : (m.Thuis || "").trim(),
      venue: (m.SporthalNaam || "").trim(),
      uitslag: (m.UitslagHoofd || "").trim(),
      uitgesteld: m.postponed === "1"
    };
  }

  function fmtDatum(d) {
    return DAGEN[d.getDay()] + " " + d.getDate() + " " +
           MAANDEN[d.getMonth()] + " " + d.getFullYear();
  }

  function rowHtml(w, teamtag) {
    var icon = w.thuis ? "home" : "away";
    var title = w.thuis ? "Thuiswedstrijd" : "Uitwedstrijd";
    var extras = "";
    if (w.superdag) { extras += '<span class="xx-wed-super">\u2605 Super Saturday</span>'; }
    if (w.uitslag) { extras += '<span class="xx-wed-score">' + esc(w.uitslag) + "</span>"; }
    if (w.uitgesteld) { extras += '<span class="xx-wed-badge">uitgesteld</span>'; }
    var opp = esc(w.tegenstander || "Nog te bepalen");
    var tag = teamtag ? '<span class="xx-wed-teamtag">' + esc(teamtag) + "</span>" : "";
    var info;
    if (w.venue) {
      var maps = "https://www.google.com/maps/search/?api=1&query=" +
                 encodeURIComponent(w.venue);
      info = tag +
        '<details class="xx-wed-venue-toggle"><summary title="Toon sporthal">' +
        '<svg class="xx-wed-pin-svg" aria-hidden="true"><use href="#xxw-pin"/></svg>' +
        "<span>" + opp + "</span>" + extras + "</summary>" +
        '<div class="xx-wed-venue-popup">' +
        '<span class="xx-wed-venue-address">' + esc(w.venue) + "</span>" +
        '<a class="xx-wed-venue-maps-link" href="' + esc(maps) +
        '" target="_blank" rel="noopener">Open in Google Maps</a></div></details>';
    } else {
      info = tag + '<span class="xx-wed-opponent--plain">' + opp + "</span>" + extras +
             '<span class="xx-wed-venue-note">Locatie volgt</span>';
    }
    return '<div class="xx-wed-row">' +
      '<span class="xx-wed-icon xx-wed-icon--' + icon + '" title="' + title + '">' +
      '<svg class="xx-wed-icon-svg" aria-hidden="true"><use href="#xxw-' + icon + '"/></svg></span>' +
      '<span class="xx-wed-datetime"><span class="xx-wed-date">' + fmtDatum(w.date) +
      '</span><span class="xx-wed-time">' + esc(w.tijd) + "</span></span>" +
      '<span class="xx-wed-info">' + info + "</span></div>";
  }

  function teamBlock(name, label, inner, open) {
    return '<details class="xx-wed-team"' + (open ? " open" : "") + "><summary>" +
      '<span class="xx-wed-team-name">' + esc(name) + "</span>" +
      '<span class="xx-wed-count">' + esc(label) + "</span>" +
      '<svg class="xx-wed-chevron" aria-hidden="true"><use href="#xxw-chev"/></svg>' +
      '</summary><div class="xx-wed-list">' + inner + "</div></details>";
  }

  var ALL = [];          // alle geparste wedstrijden
  var VIEW = "ploeg";    // "ploeg" | "weekend"
  var bySort = function (a, b) { return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0; };

  function nWed(n) { return n + (n === 1 ? " wedstrijd" : " wedstrijden"); }

  function tagFor(w) {
    return TEAMS[w.reeks] ? TEAMS[w.reeks][0] : (BEKER_NAMES[w.reeks] || w.reeks);
  }

  // Super Saturday: Heren A en Dames A spelen op dezelfde dag allebei thuis
  function computeSuper() {
    var codeFor = function (naam) {
      for (var c in TEAMS) { if (TEAMS[c][0] === naam) { return c; } }
      return null;
    };
    var hA = codeFor("Heren A"), dA = codeFor("Dames A");
    var thuisH = {}, thuisD = {};
    for (var i = 0; i < ALL.length; i++) {
      var w = ALL[i], dag = w.sort.slice(0, 8);
      if (w.thuis && w.reeks === hA) { thuisH[dag] = 1; }
      if (w.thuis && w.reeks === dA) { thuisD[dag] = 1; }
    }
    for (var j = 0; j < ALL.length; j++) {
      var v = ALL[j], d2 = v.sort.slice(0, 8);
      v.superdag = !!(v.thuis && (v.reeks === hA || v.reeks === dA) &&
                      thuisH[d2] && thuisD[d2]);
    }
  }

  // onderverdeling: senioren/jeugd per geslacht (jeugd herkenbaar aan U-leeftijd)
  function catFor(naam) {
    if (/^Jongens/.test(naam)) { return "Jeugd \u2013 jongens"; }
    if (/^Meisjes/.test(naam)) { return "Jeugd \u2013 meisjes"; }
    if (/U\d/.test(naam)) { return "Jeugd \u2013 gemengd"; }
    if (/^Heren/.test(naam)) { return "Senioren \u2013 heren"; }
    if (/^Dames/.test(naam)) { return "Senioren \u2013 dames"; }
    return "";
  }

  function renderCompetitie() {
    var perTeam = {}, overige = {};
    for (var i = 0; i < ALL.length; i++) {
      var w = ALL[i];
      if (TEAMS[w.reeks]) {
        (perTeam[w.reeks] = perTeam[w.reeks] || []).push(w);
      } else if (!BEKER_NAMES[w.reeks]) {
        (overige[w.reeks] = overige[w.reeks] || []).push(w);
      }
    }
    var codes = Object.keys(perTeam).sort(function (a, b) {
      return TEAMS[a][2] - TEAMS[b][2];
    });
    var out = "", prevCat = "";
    for (var c = 0; c < codes.length; c++) {
      var meta = TEAMS[codes[c]], rows = perTeam[codes[c]].sort(bySort), html = "";
      var cat = catFor(meta[0]);
      if (cat && cat !== prevCat) {
        out += '<div class="xx-wed-cat">' + esc(cat) + "</div>";
        prevCat = cat;
      }
      html += '<a class="xx-wed-ical" href="webcal://abzgchristophe.github.io/' +
        'hellvoc_wedstrijdkalender/ics/' + slugify(meta[0]) + '.ics">' +
        '\uD83D\uDCC5 Zet deze wedstrijden in je agenda</a>';
      for (var r = 0; r < rows.length; r++) { html += rowHtml(rows[r], null); }
      out += teamBlock(meta[0], meta[1] + " \u00b7 " + nWed(rows.length), html);
    }
    // vangnet: nieuwe/onbekende competitiecodes verdwijnen niet stilletjes
    var ovCodes = Object.keys(overige).sort();
    if (ovCodes.length) {
      out += '<div class="xx-wed-cat">Overige reeksen</div>';
      for (var o = 0; o < ovCodes.length; o++) {
        var orows = overige[ovCodes[o]].sort(bySort), ohtml = "";
        for (var q = 0; q < orows.length; q++) { ohtml += rowHtml(orows[q], null); }
        out += teamBlock(ovCodes[o], nWed(orows.length), ohtml);
      }
    }
    return out;
  }

  function renderBeker() {
    var beker = {};
    for (var i = 0; i < ALL.length; i++) {
      var w = ALL[i];
      if (BEKER_NAMES[w.reeks]) {
        (beker[w.reeks] = beker[w.reeks] || []).push(w);
      }
    }
    var ORDER = Object.keys(BEKER_NAMES);
    var bkCodes = Object.keys(beker).sort(function (a, b) {
      return ORDER.indexOf(a) - ORDER.indexOf(b);
    });
    var out = "";
    for (var k = 0; k < bkCodes.length; k++) {
      out += '<div class="xx-wed-subhead">' + esc(BEKER_NAMES[bkCodes[k]]) + "</div>";
      var brows = beker[bkCodes[k]].sort(bySort);
      for (var j = 0; j < brows.length; j++) { out += rowHtml(brows[j], null); }
    }
    return out ? teamBlock("Beker", nWed(ALL.filter(function (w) {
      return BEKER_NAMES[w.reeks];
    }).length), out, true) : "";
  }

  // week loopt van maandag t/m zondag
  function weekStart(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x;
  }
  function weekKey(d) {
    var ws = weekStart(d);
    return ws.getFullYear() * 10000 + (ws.getMonth() + 1) * 100 + ws.getDate();
  }
  function weekLabel(key) {
    var ws = new Date(Math.floor(key / 10000), Math.floor(key / 100) % 100 - 1, key % 100);
    var we = new Date(ws); we.setDate(ws.getDate() + 6);
    var links = "ma " + ws.getDate() + " " + MAANDEN[ws.getMonth()] +
                (ws.getFullYear() !== we.getFullYear() ? " " + ws.getFullYear() : "");
    return links + " \u2013 zo " + we.getDate() + " " + MAANDEN[we.getMonth()] +
           " " + we.getFullYear();
  }

  function renderWeekend() {
    var lijst = ALL, chip = "";
    if (PLOEG_SLUG) {
      var code = reeksForSlug(PLOEG_SLUG);
      if (code) {
        lijst = ALL.filter(function (w) { return w.reeks === code; });
        chip = '<div class="xx-wed-chip">Ploeg: ' + esc(TEAMS[code][0]) +
          ' \u00b7 <a href="kalender.html">toon alle ploegen</a></div>';
      } else {
        chip = '<div class="xx-wed-chip">Ploeg niet gevonden \u00b7 alle wedstrijden</div>';
      }
    }
    var perWeek = {};
    for (var i = 0; i < lijst.length; i++) {
      var k = weekKey(lijst[i].date);
      (perWeek[k] = perWeek[k] || []).push(lijst[i]);
    }
    var keys = Object.keys(perWeek).map(Number).sort(function (a, b) { return a - b; });
    var nu = weekKey(new Date());
    var openKey = null;
    for (var c = 0; c < keys.length; c++) {
      if (keys[c] >= nu) { openKey = keys[c]; break; }
    }
    var out = "";
    for (var c2 = 0; c2 < keys.length; c2++) {
      var rows = perWeek[keys[c2]].sort(bySort), html = "", hasSuper = false;
      for (var r = 0; r < rows.length; r++) {
        if (rows[r].superdag) { hasSuper = true; }
        html += rowHtml(rows[r], tagFor(rows[r]));
      }
      var label = nWed(rows.length) +
                  (hasSuper ? " \u00b7 \u2605 Super Saturday" : "");
      out += teamBlock(weekLabel(keys[c2]), label, html, keys[c2] === openKey);
    }
    return chip + out;
  }

  function renderView() {
    var content;
    if (MODE === "competitie") { content = renderCompetitie(); }
    else if (MODE === "beker") { content = renderBeker(); }
    else if (MODE === "supporteren") { content = renderSupporteren(); }
    else if (MODE === "week") { content = renderWeek(); }
    else if (MODE === "signage") { content = renderSignage(); }
    else { content = renderWeekend(); }
    if (!content) { content = '<div class="xx-wed-msg">Geen wedstrijden gevonden.</div>'; }
    var live = MODE === "signage" ? "" :
      '<div class="xx-wed-live"><span class="xx-wed-livedot"></span>' +
      'Live bijgewerkt <small>\u00b7 rechtstreeks van Volley Vlaanderen</small></div>';
    document.getElementById("xxw-inner").innerHTML = live + content;
  }

  function fail() {
    document.getElementById("xxw-inner").innerHTML =
      '<div class="xx-wed-msg">De kalender kon niet geladen worden. ' +
      'Bekijk de wedstrijden op <a href="' + esc(FALLBACK_URL) +
      '" target="_blank" rel="noopener">volleyscores.be</a>.</div>';
  }

  /* ---------- deelbare ploeglinks / slugs ---------- */

  function slugify(naam) {
    return String(naam).toLowerCase().replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  var PLOEG_SLUG = null;
  try { PLOEG_SLUG = new URLSearchParams(window.location.search).get("ploeg"); }
  catch (e) { PLOEG_SLUG = null; }
  function reeksForSlug(slug) {
    for (var c in TEAMS) { if (slugify(TEAMS[c][0]) === slug) { return c; } }
    return null;
  }

  var MAANDEN_VOL = ["januari", "februari", "maart", "april", "mei", "juni",
                     "juli", "augustus", "september", "oktober", "november", "december"];

  var PROMO_7E =
    '<div class="xx-wed-promo">' +
    '<div class="xx-wed-promo-title">Gratis naar al deze wedstrijden?</div>' +
    '<div class="xx-wed-promo-sub">Word 7e Hellvocer \u00b7 lidmaatschap per seizoen</div>' +
    '<ul><li>Unieke polo (personalisatie mogelijk)</li>' +
    '<li>Gratis toegang tot alle Hellvoc-wedstrijden</li>' +
    '<li>10% korting in caf\u00e9 Touch\u00e9 \u00e9n op alle clubevents</li></ul>' +
    '<a class="xx-wed-promo-cta" href="https://app.twizzit.com/go/wordt-7e" ' +
    'target="_blank" rel="noopener">Word 7e Hellvocer \u2192</a></div>';

  /* ---------- kom supporteren: enkel thuiswedstrijden ---------- */

  function renderSupporteren() {
    var thuis = ALL.filter(function (w) { return w.thuis; }).sort(bySort);
    if (!thuis.length) { return ""; }
    var out = "";
    var superRows = thuis.filter(function (w) { return w.superdag; });
    if (superRows.length) {
      var sh = "";
      for (var s = 0; s < superRows.length; s++) { sh += rowHtml(superRows[s], tagFor(superRows[s])); }
      out += teamBlock("\u2605 Super Saturdays", "Heren A + Dames A samen thuis", sh, true);
    }
    var perMaand = {}, keys = [];
    for (var i = 0; i < thuis.length; i++) {
      var k = thuis[i].date.getFullYear() * 100 + thuis[i].date.getMonth();
      if (!perMaand[k]) { perMaand[k] = []; keys.push(k); }
      perMaand[k].push(thuis[i]);
    }
    var vandaag = new Date();
    var nuKey = vandaag.getFullYear() * 100 + vandaag.getMonth();
    var openKey = null;
    for (var c = 0; c < keys.length; c++) {
      if (keys[c] >= nuKey) { openKey = keys[c]; break; }
    }
    for (var m = 0; m < keys.length; m++) {
      var rows = perMaand[keys[m]], html = "";
      for (var r = 0; r < rows.length; r++) { html += rowHtml(rows[r], tagFor(rows[r])); }
      out += teamBlock(MAANDEN_VOL[keys[m] % 100] + " " + Math.floor(keys[m] / 100),
                       nWed(rows.length), html, keys[m] === openKey);
    }
    return out + PROMO_7E;
  }

  /* ---------- deze week: compacte lijst komende 7 dagen ---------- */

  function komendeDagen(dagen) {
    var start = new Date(); start.setHours(0, 0, 0, 0);
    var eind = new Date(start); eind.setDate(start.getDate() + dagen);
    return ALL.filter(function (w) { return w.date >= start && w.date < eind; }).sort(bySort);
  }

  function renderWeek() {
    var rows = komendeDagen(7);
    if (!rows.length) {
      return '<div class="xx-wed-msg">Geen wedstrijden de komende 7 dagen.</div>';
    }
    var html = "", vorigeDag = "";
    for (var i = 0; i < rows.length; i++) {
      var d = fmtDatum(rows[i].date);
      if (d !== vorigeDag) {
        html += '<div class="xx-wed-subhead">' + esc(d) + "</div>";
        vorigeDag = d;
      }
      html += rowHtml(rows[i], tagFor(rows[i]));
    }
    return '<div class="xx-wed-team" style="padding-top:2px;">' +
           '<div class="xx-wed-list">' + html + "</div></div>";
  }

  /* ---------- signage: tv-weergave zonder knoppen of links ---------- */

  function renderSignage() {
    var rows = komendeDagen(7);
    var out = '<div class="xx-wed-tvtitle">Hellvoc deze week</div>' +
      '<div class="xx-wed-tvsub">Wedstrijden van de komende 7 dagen \u00b7 ' +
      'automatisch bijgewerkt</div>';
    if (!rows.length) {
      return out + '<div class="xx-wed-tvempty">Geen wedstrijden deze week</div>';
    }
    var vorigeDag = "";
    for (var i = 0; i < rows.length; i++) {
      var w = rows[i], d = fmtDatum(w.date);
      if (d !== vorigeDag) {
        var superDag = rows.some(function (x) {
          return fmtDatum(x.date) === d && x.superdag;
        });
        out += '<div class="xx-wed-day">' + esc(d) +
               (superDag ? " \u00b7 \u2605 Super Saturday" : "") + "</div>";
        vorigeDag = d;
      }
      out += '<div class="xx-wed-tvrow">' +
        '<div class="xx-wed-tvtime">' + esc(w.tijd === "uur volgt" ? "\u2013" : w.tijd) + "</div>" +
        '<div class="xx-wed-tvinfo">' +
        '<div class="xx-wed-tvteam">' + esc(tagFor(w)) +
        (w.superdag ? " \u2605" : "") + "</div>" +
        '<div class="xx-wed-tvopp">' + esc(w.tegenstander) + "</div>" +
        (!w.thuis && w.venue ? '<div class="xx-wed-tvvenue">' + esc(w.venue) + "</div>" : "") +
        "</div>" +
        '<div class="xx-wed-tvside xx-wed-tvside--' + (w.thuis ? "home" : "away") + '">' +
        (w.thuis ? "THUIS" : "UIT") + "</div></div>";
    }
    return out;
  }

  /* ---------- standen (rangschikking-feed) ---------- */

  // Zoek de lijst met records, ook als die 1-2 niveaus diep genest zit
  function findRecords(data) {
    if (Array.isArray(data)) { return data; }
    if (data && typeof data === "object") {
      var best = null, k, v;
      for (k in data) {
        v = data[k];
        if (Array.isArray(v) && (!best || v.length > best.length)) { best = v; }
      }
      if (best) { return best; }
      for (k in data) {
        v = findRecords(data[k]);
        if (v) { return v; }
      }
    }
    return null;
  }

  // Veldnaam zoeken op patroon (feed-spelling is niet gedocumenteerd)
  function pickKey(obj, patterns) {
    var keys = Object.keys(obj);
    for (var p = 0; p < patterns.length; p++) {
      for (var k = 0; k < keys.length; k++) {
        if (patterns[p].test(keys[k])) { return keys[k]; }
      }
    }
    return null;
  }

  function renderStanden(data) {
    var recs = findRecords(data);
    var inner = document.getElementById("xxw-inner");
    var live = '<div class="xx-wed-live"><span class="xx-wed-livedot"></span>' +
      'Live bijgewerkt <small>\u00b7 rechtstreeks van Volley Vlaanderen</small></div>';
    if (!recs || !recs.length || typeof recs[0] !== "object") {
      inner.innerHTML = live +
        '<div class="xx-wed-msg">Geen standen gevonden in de feed.</div>';
      return;
    }
    var s = recs[0];
    var K = {
      reeks: pickKey(s, [/^reeks$/i, /reeks/i]),
      pos: pickKey(s, [/^positie$/i, /volgorde/i, /^rangschikking$/i, /^rang$/i, /^plaats/i, /^nr$/i]),
      ploeg: pickKey(s, [/ploegnaam/i, /^ploeg$/i, /^team/i, /naam/i]),
      gesp: pickKey(s, [/gespeeld/i, /aantal.?wedstrijden/i]),
      won: pickKey(s, [/gewonnen/i, /^winst/i]),
      verl: pickKey(s, [/verloren/i, /verlies/i]),
      ptn: pickKey(s, [/puntentotaal/i, /^punten/i, /punt/i, /^ptn$/i]),
      soort: pickKey(s, [/^wedstrijd$/i])
    };
    if (!K.ploeg || (!K.ptn && !K.pos)) {
      inner.innerHTML = live + '<div class="xx-wed-msg">De structuur van de ' +
        'standen-feed wordt nog niet herkend.<br>Gevonden velden: <b>' +
        esc(Object.keys(s).join(", ")) + "</b></div>";
      return;
    }
    // enkel hoofdwedstrijden als er ook reserven in de feed zitten
    if (K.soort) {
      var hoofd = recs.filter(function (r) { return !/reserv/i.test(String(r[K.soort])); });
      if (hoofd.length) { recs = hoofd; }
    }
    var perReeks = {};
    for (var i = 0; i < recs.length; i++) {
      var code = K.reeks ? String(recs[i][K.reeks]) : "stand";
      (perReeks[code] = perReeks[code] || []).push(recs[i]);
    }
    var codes = Object.keys(perReeks).sort(function (a, b) {
      var oa = TEAMS[a] ? TEAMS[a][2] : 99, ob = TEAMS[b] ? TEAMS[b][2] : 99;
      return oa - ob || (a < b ? -1 : 1);
    });
    var out = "";
    for (var c = 0; c < codes.length; c++) {
      var rows = perReeks[codes[c]].slice().sort(function (a, b) {
        return (parseInt(a[K.pos], 10) || 0) - (parseInt(b[K.pos], 10) || 0);
      });
      var meta = TEAMS[codes[c]];
      var titel = meta ? meta[0] : codes[c];
      var label = meta ? meta[1] + " \u00b7 stand" : "stand";
      var t = '<table class="xx-wed-tbl"><thead><tr>' +
        '<th class="xx-wed-pos">#</th><th>Ploeg</th>' +
        (K.gesp ? '<th class="xx-wed-num">G</th>' : "") +
        (K.won ? '<th class="xx-wed-num">W</th>' : "") +
        (K.verl ? '<th class="xx-wed-num">V</th>' : "") +
        (K.ptn ? '<th class="xx-wed-num">Ptn</th>' : "") +
        "</tr></thead><tbody>";
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r];
        var isHell = /hellvoc/i.test(String(row[K.ploeg]));
        t += '<tr class="' + (isHell ? "xx-wed-hell" : "") + '">' +
          '<td class="xx-wed-pos">' + esc(K.pos ? row[K.pos] : r + 1) + "</td>" +
          "<td>" + esc(row[K.ploeg]) + "</td>" +
          (K.gesp ? '<td class="xx-wed-num">' + esc(row[K.gesp]) + "</td>" : "") +
          (K.won ? '<td class="xx-wed-num">' + esc(row[K.won]) + "</td>" : "") +
          (K.verl ? '<td class="xx-wed-num">' + esc(row[K.verl]) + "</td>" : "") +
          (K.ptn ? '<td class="xx-wed-num">' + esc(row[K.ptn]) + "</td>" : "") +
          "</tr>";
      }
      t += "</tbody></table>";
      out += teamBlock(titel, label, t);
    }
    inner.innerHTML = live + (out ||
      '<div class="xx-wed-msg">Geen standen gevonden.</div>');
  }

  /* ---------- data ophalen ---------- */

  function laadWedstrijden(stil) {
    fetch(FEED)
      .then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); })
      .then(function (data) {
        if (!Array.isArray(data)) { throw new Error("geen lijst"); }
        ALL = data.map(parseMatch);
        computeSuper();
        renderView();
      })
      .catch(function () { if (!stil) { fail(); } });
  }

  if (MODE === "standen") {
    fetch(RANK_FEED)
      .then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); })
      .then(renderStanden)
      .catch(fail);
  } else {
    laadWedstrijden(false);
    if (MODE === "signage") {
      // tv-scherm: elke 10 minuten verse data, 2x per dag volledige herlaad
      window.setInterval(function () { laadWedstrijden(true); }, 10 * 60 * 1000);
      window.setTimeout(function () { window.location.reload(); }, 12 * 60 * 60 * 1000);
    }
  }
})();
