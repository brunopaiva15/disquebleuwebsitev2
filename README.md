# Site de Disque Bleu

En ligne : https://brunopaiva15.github.io/disquebleuwebsitev2/

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
index.html            la page
assets/css/app.css    feuille de style unique
assets/js/scene.js    la scène WebGL (ciel tramé, disque en volume)
assets/js/dial.js     le cadran des heures, peint dans un canvas
assets/js/app.js      caméra au scroll, apparitions, horloge
tools/check-assets.py contrôle des fichiers référencés
```

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

Ils sont regroupés dans la constante `STORES` en tête de `assets/js/app.js`,
et appliqués aux éléments portant `data-store="ios"` ou `data-store="android"`.
Une seule ligne à changer si une fiche déménage.

## Publication

Le workflow `.github/workflows/pages.yml` vérifie puis publie sur GitHub Pages
à chaque poussée sur `main`. Il contrôle d'abord que tous les fichiers
référencés existent et que les modules se parsent, et ne publie qu'ensuite.

Le dépôt est déjà réglé sur **Settings → Pages → Source : GitHub Actions**.
C'est le seul réglage manuel nécessaire, à refaire uniquement sur un nouveau
dépôt.

## Licence

MIT, comme l'application.
