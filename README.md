# Site de Disque Bleu

En ligne : https://disquebleusuisse.ch/

Site vitrine de l'application [Disque Bleu](https://github.com/brunopaiva15/disquebleu),
l'aide au stationnement à durée limitée en Suisse, France, Allemagne, Italie,
Belgique, Luxembourg et aux Pays-Bas.

Site statique, sans étape de compilation. Les scripts sont des modules, que les
navigateurs refusent d'ouvrir depuis le disque : il faut servir la racine.

```bash
python3 -m http.server 8000
```

## Ce qu'il y a dedans

```
index.html                      la page
robots.txt, sitemap.xml         ce que lisent les robots
site.webmanifest                nom et icônes de l'application web
assets/css/app.css              feuille de style unique
assets/js/disc.js               le couvercle : fenêtre, cadran, plan, dessinés en canvas
assets/js/cover.js              la présentation : chapitres, défilement, étiquettes
assets/js/i18n.js               les textes français, anglais, allemands et italiens
assets/js/seo.js                adresses, fiches des magasins, données structurées
assets/js/app.js                mise en route, barre du haut, apparitions
tools/check-assets.py           contrôle des fichiers référencés
tools/check-i18n.mjs            contrôle la parité entre les quatre langues
tools/check-structured-data.mjs contrôle le JSON-LD, les alternates et le sitemap
tools/og-cover.html             gabarit de l'image de partage
tools/make-og-cover.py          rend cette image en 1200 × 630
```

La langue suit le choix enregistré ou celle du navigateur. Elle se change
depuis la barre du haut (FR DE IT EN) ; le paramètre `?lang=fr|en|de|it`
permet de partager directement une version linguistique.

## Le principe

Le site est l'onboarding de l'application en grand, et en reprend tout :
couleurs, tailles, arrondis et textes.

- **Le couvercle.** Tout l'écran est le disque bleu, percé de sa fenêtre en
  croissant. Le défilement remplace le doigt : un écran de défilement par
  chapitre (accueil, réglage, rappel, plan), et la position entre deux
  chapitres mélange leurs états, comme `_along` entre deux pages de l'app.
- **La feuille.** À la fin de la présentation, une feuille claire aux coins
  arrondis monte sur le disque, comme les pages de réglage de l'onboarding.
  Elle porte les pays, les fonctions, l'avertissement, la presse, les
  nouveautés et l'invitation à installer.

Les sources dans le dépôt de l'application :

- `lib/screens/onboarding/onboarding_objects.dart` : `CoverGeometry` et
  `_CoverPainter` (fenêtre, ombre, cadran, plan, flèche), `TimeTag` ;
- `lib/screens/onboarding/onboarding_style.dart` : les couleurs, en clair et
  en sombre ;
- `lib/screens/onboarding_screen.dart` : les mises en page portrait et
  paysage, l'animation du disque entre les pages ;
- `lib/l10n/app_strings.dart` : les textes des quatre chapitres, repris mot
  pour mot.

Si l'onboarding change dans l'app, ce sont `disc.js`, `cover.js` et les jetons
en tête de `app.css` qu'il faut reprendre.

Sans JavaScript, la présentation s'affiche en texte sur le bleu, chapitre par
chapitre. Avec « Réduire les animations », le disque n'arrive pas en tournant,
les titres ne se lèvent pas et la photo de l'avertissement reste fixe.

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
