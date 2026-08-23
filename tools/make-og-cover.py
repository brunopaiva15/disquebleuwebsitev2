#!/usr/bin/env python3
"""Rend `assets/img/og-cover.png` à partir de `tools/og-cover.html`.

L'image de partage n'est pas générée à la volée : on la rend une fois et on
versionne le PNG. Ce script n'est donc pas dans la CI, il se lance à la main
quand le gabarit change :

    python3 tools/make-og-cover.py --chromium /chemin/vers/chrome

Chromium sans interface réserve une hauteur de fenêtre à des barres qui
n'existent pas : la zone rendue est plus courte que la capture, qui se termine
par une bande blanche. On demande donc une fenêtre plus haute que la cible,
puis on retaille le PNG aux dimensions voulues. Le rognage est écrit ici plutôt
que confié à un outil externe : le dépôt n'a aucune dépendance, et il n'y a pas
de raison d'en ajouter une pour couper des lignes de pixels.
"""

import argparse
import pathlib
import shutil
import struct
import subprocess
import sys
import tempfile
import zlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "tools" / "og-cover.html"
TARGET = ROOT / "assets" / "img" / "og-cover.png"

WIDTH, HEIGHT = 1200, 630
# Hauteur que Chromium retire à `--window-size` pour une barre d'outils absente.
CHROME_HEIGHT = 87

CANDIDATES = [
    "chromium",
    "chromium-browser",
    "google-chrome",
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
]

CHANNELS = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}


def read_png(data: bytes):
    """Rend (largeur, hauteur, octets par pixel, lignes défiltrées)."""
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("ce n'est pas un PNG")

    header = None
    pixels = bytearray()
    offset = 8
    while offset < len(data):
        length, kind = struct.unpack(">I4s", data[offset:offset + 8])
        body = data[offset + 8:offset + 8 + length]
        offset += 12 + length
        if kind == b"IHDR":
            header = struct.unpack(">IIBBBBB", body)
        elif kind == b"IDAT":
            pixels += body
        elif kind == b"IEND":
            break

    width, height, depth, colour, _, _, interlace = header
    if depth != 8 or interlace or colour not in CHANNELS:
        raise ValueError(f"PNG non géré : profondeur {depth}, couleur {colour}")

    step = CHANNELS[colour]
    raw = zlib.decompress(bytes(pixels))
    stride = width * step
    rows = []
    previous = bytearray(stride)
    cursor = 0
    for _ in range(height):
        method = raw[cursor]
        line = bytearray(raw[cursor + 1:cursor + 1 + stride])
        cursor += 1 + stride
        for i in range(stride):
            left = line[i - step] if i >= step else 0
            up = previous[i]
            corner = previous[i - step] if i >= step else 0
            if method == 1:
                line[i] = (line[i] + left) & 0xFF
            elif method == 2:
                line[i] = (line[i] + up) & 0xFF
            elif method == 3:
                line[i] = (line[i] + (left + up) // 2) & 0xFF
            elif method == 4:
                estimate = left + up - corner
                da, db, dc = (abs(estimate - left), abs(estimate - up),
                              abs(estimate - corner))
                nearest = left if da <= db and da <= dc else (up if db <= dc else corner)
                line[i] = (line[i] + nearest) & 0xFF
            elif method != 0:
                raise ValueError(f"filtre inconnu : {method}")
        rows.append(line)
        previous = line
    return width, height, step, rows


def filtered(line: bytearray, previous: bytearray, step: int):
    """Choisit la prédiction la moins coûteuse pour une ligne.

    Heuristique classique : on retient le filtre dont la somme des écarts est
    la plus faible, ce qui donne à zlib des octets proches de zéro."""
    best = None
    for method in range(5):
        out = bytearray(len(line))
        for i, value in enumerate(line):
            left = line[i - step] if i >= step else 0
            up = previous[i]
            corner = previous[i - step] if i >= step else 0
            if method == 0:
                out[i] = value
            elif method == 1:
                out[i] = (value - left) & 0xFF
            elif method == 2:
                out[i] = (value - up) & 0xFF
            elif method == 3:
                out[i] = (value - (left + up) // 2) & 0xFF
            else:
                estimate = left + up - corner
                da, db, dc = (abs(estimate - left), abs(estimate - up),
                              abs(estimate - corner))
                nearest = left if da <= db and da <= dc else (up if db <= dc else corner)
                out[i] = (value - nearest) & 0xFF
        cost = sum(byte if byte < 128 else 256 - byte for byte in out)
        if best is None or cost < best[0]:
            best = (cost, method, out)
    return best[1], best[2]


def write_png(path: pathlib.Path, width: int, rows, step: int) -> None:
    raw = bytearray()
    previous = bytearray(width * step)
    for line in rows:
        method, encoded = filtered(line, previous, step)
        raw.append(method)
        raw += encoded
        previous = line

    def chunk(kind: bytes, body: bytes) -> bytes:
        return (struct.pack(">I", len(body)) + kind + body
                + struct.pack(">I", zlib.crc32(kind + body) & 0xFFFFFFFF))

    colour = {1: 0, 2: 4, 3: 2, 4: 6}[step]
    path.write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, len(rows), 8, colour, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )


def find_chromium(explicit: str | None) -> str:
    for candidate in ([explicit] if explicit else []) + CANDIDATES:
        found = shutil.which(candidate) or (candidate if pathlib.Path(candidate).exists() else None)
        if found:
            return found
    raise SystemExit("Chromium est introuvable ; passer --chromium /chemin/vers/chrome")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--chromium", help="binaire Chromium à utiliser")
    args = parser.parse_args()

    browser = find_chromium(args.chromium)
    with tempfile.TemporaryDirectory() as work:
        shot = pathlib.Path(work) / "shot.png"
        subprocess.run(
            [browser, "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
             "--force-device-scale-factor=1",
             f"--window-size={WIDTH},{HEIGHT + CHROME_HEIGHT}",
             f"--screenshot={shot}", TEMPLATE.as_uri()],
            check=True, capture_output=True,
        )
        width, height, step, rows = read_png(shot.read_bytes())

    if width != WIDTH or height < HEIGHT:
        raise SystemExit(f"capture inattendue : {width} × {height}")

    rows = rows[:HEIGHT]
    # La carte est opaque : la couche alpha ne porte rien et pèse un quart du
    # fichier.
    if step == 4 and all(line[3::4].count(255) == WIDTH for line in rows):
        rows = [bytearray(b for i, b in enumerate(line) if i % 4 != 3) for line in rows]
        step = 3

    write_png(TARGET, WIDTH, rows, step)
    print(f"{TARGET.relative_to(ROOT)} : {WIDTH} × {HEIGHT}, "
          f"{TARGET.stat().st_size // 1024} ko")
    return 0


if __name__ == "__main__":
    sys.exit(main())
