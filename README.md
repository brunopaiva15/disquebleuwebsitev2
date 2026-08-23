# Site de Disque Bleu

En ligne : https://disquebleusuisse.ch/

Site vitrine de l'application [Disque Bleu](https://github.com/brunopaiva15/disquebleu),
l'aide au stationnement à durée limitée en Suisse, France, Allemagne, Italie,
Belgique et Luxembourg.

Site statique, sans étape de compilation. Ouvrir `index.html` suffit, ou servir
la racine :

```bash
python3 -m http.server 8000
```

## Ce qu'il y a dedans

```
index.html                      la page
robots.txt, sitemap.xml         ce que lisent les robots
site.webmanifest                nom et icônes de l'application web
assets/css/app.css              feuille de style unique
assets/js/scene.js              la scène WebGL (ciel tramé, disque en volume)
assets/js/dial.js               le cadran des heures, peint dans un canvas
assets/js/i18n.js               les textes français, anglais, allemands et italiens
assets/js/seo.js                adresses, fiches des magasins, données structurées
assets/js/app.js                caméra au scroll, apparitions, horloge
tools/check-assets.py           contrôle des fichiers référencés
tools/check-i18n.mjs            contrôle la parité entre les quatre langues
tools/check-structured-data.mjs contrôle le JSON-LD, les alternates et le sitemap
tools/og-cover.html             gabarit de l'image de partage
tools/make-og-cover.py          rend cette image en 1200 × 630
```

La langue suit le choix enregistré ou celle du navigateur. Elle peut être
changée depuis le bandeau ; le paramètre `?lang=fr|en|de|it` permet de partager
directement une version linguistique.

## Le disque

Le fond n'est pas une vidéo mais une scène WebGL calculée à chaque image. Un
seul fragment shader dessine le ciel et intersecte la fenêtre en croissant du
disque, sans maillage : la forme reste nette à toute résolution et rien de
lourd n'est téléchargé.

La géométrie n'est pas inventée. Elle décalque `_CoverPainter` et
`_HoursPainter` de `lib/widgets/parking_disc_painter.dart` dans le dépôt de
l'application :

- arc intérieur de la fenêtre au rayon 0.42 R, ouvert de ±46° autour de l'axe
- bord extérieur donné par le cercle blanc du disque, rayon R
- côtés droits, de TVL vers BVL et de TVR vers BVR
- graduations de 0.52 R à 0.42 R, heures 1 à 12 au rayon 0.69 R, heures 13 à 24
  au rayon 0.87 R

Si le disque change dans l'application, ce sont ces valeurs qu'il faut reprendre,
dans `dial.js` pour l'impression et dans le shader de `scene.js` pour la découpe.

Le ciel et les nuages passent par une trame ordonnée de Bayer 8×8. Les nuages
deviennent des amas de points plutôt que des dégradés lisses, ce qui évite aussi
les cassures de dégradé sur les grands aplats bleus.

Quand WebGL n'est pas disponible, le canvas garde son dégradé CSS et la page
reste entièrement lisible.

## Liens de téléchargement

Ils sont regroupés dans la constante `STORES` de `assets/js/seo.js`, appliqués
aux éléments portant `data-store="ios"` ou `data-store="android"` et repris
dans les données structurées. Une seule ligne à changer si une fiche déménage.

## Référencement

Le site est une page unique servie en quatre langues, distinguées par `?lang=`.
Chaque version porte donc sa propre adresse canonique et ses `hreflang` ; c'est
`assets/js/seo.js` qui les calcule, et `i18n.js` qui les applique au changement
de langue, avec le graphe JSON-LD (`WebSite`, `Organization`, `WebPage`,
`MobileApplication`).

La version française de ce graphe est figée dans `index.html` : un robot qui
n'exécute pas le script doit la lire quand même. `tools/check-structured-data.mjs`
vérifie qu'elle correspond toujours au catalogue, et la régénère avec `--write`.

Le graphe ne décrit que ce que la page montre. Baliser un contenu absent de
l'écran est proscrit par les moteurs : toute entité ajoutée ici doit avoir sa
contrepartie visible dans la page.

L'image de partage n'est pas générée à la volée. Le gabarit est
`tools/og-cover.html` ; `python3 tools/make-og-cover.py` la rend en 1200 × 630
avec Chromium et versionne le PNG.

Le numéro de version annoncé aux moteurs vit dans `seo.js` (`APP_VERSION`). Le
contrôle échoue s'il ne correspond plus au premier bloc de l'historique.

## Publication

Le workflow `.github/workflows/pages.yml` vérifie puis publie sur GitHub Pages
à chaque poussée sur `main`. Il contrôle d'abord que tous les fichiers
référencés existent, que les modules se parsent, que les quatre langues sont
complètes et que les données structurées sont à jour, et ne publie qu'ensuite.

Le dépôt est réglé sur **Settings → Pages → Source : GitHub Actions**, et sur
le domaine **disquebleusuisse.ch**. Ce sont les deux seuls réglages manuels,
à refaire uniquement sur un nouveau dépôt.

Le fichier `CNAME` à la racine porte le même domaine. Avec la source « GitHub
Actions », c'est le réglage de Settings qui fait foi ; le fichier ne coûte rien
et couvre le cas où la publication repasserait par une branche.

## Changer d'adresse

L'adresse vit dans `SITE_URL`, en tête de `assets/js/seo.js`. Elle est reprise
telle quelle dans `index.html` (canonique, `hreflang`, `og:`, `twitter:`,
JSON-LD), dans `sitemap.xml` et dans `robots.txt`. Après un déménagement :

```bash
node tools/check-structured-data.mjs --write   # régénère le bloc JSON-LD
node tools/check-structured-data.mjs           # et vérifie tout le reste
```

Le contrôle échoue si une seule adresse est restée en arrière, y compris dans
un bloc du plan du site où les quatre autres seraient justes.

## Licence

MIT, comme l'application.
