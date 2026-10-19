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

const count = (pattern) => (html.match(pattern) || []).length;
const counts = {
  chapters: count(/class="chapter" data-chapter=/g),
  countries: count(/class="country" /g),
  features: count(/class="feature" /g),
  versions: count(/data-version-row /g),
};

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

  // Les listes ont autant d'entrées que la page a de lignes pour elles.
  [
    ['intro.chapters', counts.chapters],
    ['countries.items', counts.countries],
    ['features.items', counts.features],
    ['changelog.versions', counts.versions],
  ].forEach(([path, expected]) => {
    const length = lookup(catalog, path)?.length;
    if (length !== expected) {
      errors.push(`${language}: ${path} compte ${length} entrées, la page ${expected}`);
    }
  });
});

const dateCount = (html.match(/data-i18n-date/g) || []).length;
if (dateCount !== counts.versions) {
  errors.push(`${dateCount} dates localisées pour ${counts.versions} versions`);
}

if (errors.length) {
  console.error('Traductions incomplètes :');
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(`${SUPPORTED_LANGUAGES.length} langues, ${htmlKeys.size} clés HTML, ${counts.versions} versions et leurs dates vérifiées.`);
