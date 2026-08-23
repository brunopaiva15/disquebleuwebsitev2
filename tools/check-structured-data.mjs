#!/usr/bin/env node

/* Contrôle le bloc JSON-LD figé dans `index.html`.

   Les données structurées sont calculées par `assets/js/seo.js` à partir du
   catalogue de traduction, et réécrites au changement de langue. La version
   française, elle, doit se trouver telle quelle dans le HTML servi : un moteur
   qui n'exécute pas le script doit la lire quand même.

   Ce contrôle vérifie que le bloc figé correspond encore au catalogue, que la
   version annoncée est bien celle en tête de l'historique, et que les adresses
   déclarées dans la page pointent où il faut. `--write` régénère le bloc.
*/

import { readFile, writeFile } from 'node:fs/promises';

import { loadSiteModule, ROOT } from './load-module.mjs';

const write = process.argv.includes('--write');
const indexUrl = new URL('index.html', ROOT);

const { SUPPORTED_LANGUAGES, TRANSLATIONS } = await loadSiteModule('assets/js/i18n.js');
const { buildStructuredData, languageUrl, SITE_URL, APP_VERSION } =
  await loadSiteModule('assets/js/seo.js');

const expected = buildStructuredData('fr', TRANSLATIONS.fr, SUPPORTED_LANGUAGES);
const serialised = JSON.stringify(expected, null, 2);

let html = await readFile(indexUrl, 'utf8');
const block = /(<script type="application\/ld\+json" data-structured-data>)([\s\S]*?)(<\/script>)/;
const match = html.match(block);

if (!match) {
  console.error('Le bloc de données structurées est absent de index.html.');
  process.exit(1);
}

if (write) {
  html = html.replace(block, `$1\n${serialised}\n$3`);
  await writeFile(indexUrl, html, 'utf8');
  console.log('Bloc de données structurées régénéré depuis le catalogue français.');
  process.exit(0);
}

const errors = [];

try {
  const found = JSON.parse(match[2]);
  if (JSON.stringify(found) !== JSON.stringify(expected)) {
    errors.push('le bloc figé ne correspond plus au catalogue '
      + '(relancer : node tools/check-structured-data.mjs --write)');
  }
} catch (error) {
  errors.push(`le bloc figé n'est pas du JSON valide : ${error.message}`);
}

// La version annoncée aux moteurs est celle en tête de l'historique.
const newest = html.match(/data-version-row data-version="([^"]+)"/);
if (!newest) errors.push("l'historique des versions est introuvable");
else if (newest[1] !== APP_VERSION) {
  errors.push(`seo.js annonce la version ${APP_VERSION}, l'historique ${newest[1]}`);
}

// Canonique et alternates : une adresse par langue, plus x-default.
const declared = new Map(
  [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)]
    .map((entry) => [entry[1], entry[2]]),
);
SUPPORTED_LANGUAGES.forEach((language) => {
  if (declared.get(language) !== languageUrl(language)) {
    errors.push(`alternate hreflang manquant ou faux pour ${language}`);
  }
});
if (declared.get('x-default') !== SITE_URL) errors.push('alternate x-default absent ou faux');
if (!html.includes(`<link rel="canonical" href="${SITE_URL}">`)) {
  errors.push('adresse canonique absente ou différente de SITE_URL');
}

// Le plan du site couvre exactement les mêmes adresses.
const sitemap = await readFile(new URL('sitemap.xml', ROOT), 'utf8');
SUPPORTED_LANGUAGES.forEach((language) => {
  if (!sitemap.includes(`hreflang="${language}" href="${languageUrl(language)}"`)) {
    errors.push(`sitemap.xml : alternate ${language} absent`);
  }
});

if (errors.length) {
  console.error('Données structurées incohérentes :');
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(
  `Bloc JSON-LD conforme (${expected['@graph'].length} entités), `
  + `version ${APP_VERSION}, ${SUPPORTED_LANGUAGES.length} alternates et plan du site vérifiés.`,
);
