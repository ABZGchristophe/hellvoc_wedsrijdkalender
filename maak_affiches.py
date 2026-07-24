#!/usr/bin/env python3
"""Genereert de twee A4 QR-affiches in Hellvoc-huisstijl."""
import io

import qrcode
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

ZWART = HexColor("#000000")
DONKERBLAUW = HexColor("#0d1b2a")
GOUD = HexColor("#f2b705")
WIT = HexColor("#ffffff")
GRIJSBLAUW = HexColor("#9fb3c8")
LICHTGRIJS = HexColor("#cfd8dc")

W, H = A4


def qr_image(url):
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,
                       box_size=12, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0d1b2a", back_color="white")
    buf = io.BytesIO()
    img.get_image().save(buf, format="PNG")
    buf.seek(0)
    return ImageReader(buf)


def basis(c):
    c.setFillColor(ZWART)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GOUD)
    c.rect(0, H - 16, W, 16, fill=1, stroke=0)
    c.setFillColor(GOUD)
    c.setFont("Helvetica-Bold", 15)
    tekst = "H E L L V O C   H E M I K S E M - S C H E L L E"
    c.drawCentredString(W / 2, H - 60, tekst)


def qr_blok(c, url, y_midden, grootte=230):
    x = (W - grootte) / 2
    y = y_midden - grootte / 2
    marge = 18
    c.setFillColor(WIT)
    c.roundRect(x - marge, y - marge, grootte + 2 * marge, grootte + 2 * marge,
                16, fill=1, stroke=0)
    c.drawImage(qr_image(url), x, y, grootte, grootte)
    c.setFillColor(GRIJSBLAUW)
    c.setFont("Helvetica", 13)
    c.drawCentredString(W / 2, y - marge - 24, "Richt je camera op de code")


def vinkje(c, x, y, s=7):
    c.setStrokeColor(GOUD)
    c.setLineWidth(2.6)
    c.setLineCap(1)
    c.line(x, y + s * 0.45, x + s * 0.45, y)
    c.line(x + s * 0.45, y, x + s * 1.35, y + s * 1.1)


def voet(c):
    c.setFillColor(GRIJSBLAUW)
    c.setFont("Helvetica", 11)
    c.drawCentredString(W / 2, 40, "hellvoc.be")


def poster_kalender():
    c = canvas.Canvas("poster-wedstrijdkalender.pdf", pagesize=A4)
    basis(c)
    c.setFillColor(WIT)
    c.setFont("Helvetica-Bold", 46)
    c.drawCentredString(W / 2, H - 150, "Wanneer spelen we?")
    c.setFillColor(LICHTGRIJS)
    c.setFont("Helvetica", 18)
    c.drawCentredString(W / 2, H - 185,
                        "Alle wedstrijden, uitslagen en standen \u2014 altijd actueel")
    qr_blok(c, "https://hellvoc-hemiksem.anykrowd.eu/#/pages/content/3", H / 2 + 15)
    c.setFillColor(GOUD)
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(W / 2, 175, "Scan en supporter mee")
    c.setFillColor(LICHTGRIJS)
    c.setFont("Helvetica", 14)
    c.drawCentredString(W / 2, 148,
                        "Competitie \u00b7 beker \u00b7 klassementen \u00b7 Super Saturdays")
    voet(c)
    c.save()


def poster_7e():
    c = canvas.Canvas("poster-7e-hellvocer.pdf", pagesize=A4)
    basis(c)
    c.setFillColor(WIT)
    c.setFont("Helvetica-Bold", 48)
    c.drawCentredString(W / 2, H - 150, "Word 7e Hellvocer")
    c.setFillColor(LICHTGRIJS)
    c.setFont("Helvetica", 18)
    c.drawCentredString(W / 2, H - 185,
                        "De supportersclub van Hellvoc \u00b7 lidmaatschap per seizoen")
    qr_blok(c, "https://app.twizzit.com/go/wordt-7e", H / 2 + 65, grootte=210)
    voordelen = [
        "Unieke polo (personalisatie mogelijk)",
        "Gratis toegang tot alle Hellvoc-wedstrijden",
        "10% korting in caf\u00e9 Touch\u00e9 \u00e9n op alle clubevents",
    ]
    y = 235
    c.setFont("Helvetica-Bold", 16)
    for v in voordelen:
        vinkje(c, W / 2 - 175, y - 2)
        c.setFillColor(WIT)
        c.drawString(W / 2 - 150, y, v)
        y -= 34
    c.setFillColor(GOUD)
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(W / 2, 105, "Scan en sluit je aan")
    voet(c)
    c.save()


if __name__ == "__main__":
    poster_kalender()
    poster_7e()
    print("affiches gegenereerd")
