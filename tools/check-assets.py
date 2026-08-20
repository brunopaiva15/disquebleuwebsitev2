#!/usr/bin/env python3
"""Vérifie que tous les fichiers locaux référencés par le site existent.

Une feuille de style ou un module manquant ne casse pas le déploiement de
GitHub Pages : la page part quand même, amputée. Ce contrôle transforme
l'oubli en échec de CI, là où il se voit.
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

# href/src/import pointant vers un chemin relatif (ni http(s), ni //, ni data:,
# ni ancre interne).
PATTERNS = [
    re.compile(r"""(?:href|src)\s*=\s*["']([^"'#]+)["']"""),
    re.compile(r"""(?:from|import)\s+["'](\./[^"']+)["']"""),
]

SKIP = re.compile(r"^(https?:|//|data:|mailto:|#)")


def referenced(path: pathlib.Path):
    text = path.read_text(encoding="utf-8")
    for pattern in PATTERNS:
        for target in pattern.findall(text):
            if SKIP.match(target):
                continue
            yield target


def main() -> int:
    missing = []
    sources = list(ROOT.glob("*.html")) + list(ROOT.glob("assets/js/*.js"))

    for source in sources:
        base = source.parent if source.suffix == ".js" else ROOT
        for target in referenced(source):
            resolved = (base / target.split("?")[0]).resolve()
            if not resolved.exists():
                missing.append(f"{source.relative_to(ROOT)} → {target}")

    if missing:
        print("Fichiers référencés introuvables :")
        for item in missing:
            print("  -", item)
        return 1

    print(f"{len(sources)} fichiers analysés, toutes les références résolues.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
