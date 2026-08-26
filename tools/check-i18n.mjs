#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

import { loadSiteModule, ROOT as root } from './load-module.mjs';

const html = await readFile(new URL('index.html', root), 'utf8');
const { SUPPORTED_LANGUAGES, TRANSLATIONS } = await loadSiteModule('assets/js/i18n.js');

const errors = [];

function lookup(value, path) {
  return path.split('.').reduce((current, part) => current?.[part], value);
}

function leafPaths(value, prefix = '', output = new Set()) {
  if (typeof value === 'string') {
    output.add(prefix);
    return output;
  }
  Object.entries(value).forEach(([key, child]) => {
    leafPaths(child, prefix ? `${prefix}.${key}` : key, output);
  });
  return output;
}

const htmlKeys = new Set(
  [...html.matchAll(/data-i18n(?:-html|-aria-label|-alt|-content|-src)?="([^"]+)"/g)]
    .map((match) => match[1]),
);

const reference = new Set(leafPaths(TRANSLATIONS.fr));
SUPPORTED_LANGUAGES.forEach((language) => {
  const catalog = TRANSLATIONS[language];
  if (!catalog) {
    errors.push(`${language}: catalogue absent`);
    return;
  }

  const paths = new Set(leafPaths(catalog));
  [...reference].filter((path) => !paths.has(path)).forEach((path) => {
    errors.push(`${language}: traduction absente pour ${path}`);
  });
  [...paths].filter((path) => !reference.has(path)).forEach((path) => {
    errors.push(`${language}: clé supplémentaire ${path}`);
  });
  htmlKeys.forEach((key) => {
    if (typeof lookup(catalog, key) !== 'string') {
      errors.push(`${language}: clé HTML introuvable ${key}`);
    }
  });

  if (catalog.features.items.length !== 9) {
    errors.push(`${language}: 9 fonctionnalités attendues`);
  }
  if (catalog.changelog.versions.length !== 13) {
    errors.push(`${language}: 13 versions attendues`);
  }
  if (catalog.countries.names.length !== 6) {
    errors.push(`${language}: 6 pays attendus`);
  }
});

const dateCount = (html.match(/data-i18n-date/g) || []).length;
if (dateCount !== 13) errors.push(`${dateCount} dates localisées au lieu de 13`);

if (errors.length) {
  console.error('Traductions incomplètes :');
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(`${SUPPORTED_LANGUAGES.length} langues, ${htmlKeys.size} clés HTML et 13 dates vérifiées.`);
