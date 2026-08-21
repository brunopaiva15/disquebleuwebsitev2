#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const source = await readFile(new URL('assets/js/i18n.js', root), 'utf8');
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const { SUPPORTED_LANGUAGES, TRANSLATIONS } = await import(moduleUrl);

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

const isStructuralPath = (path) => !/\.dial\.\d+$/.test(path);
const reference = new Set([...leafPaths(TRANSLATIONS.fr)].filter(isStructuralPath));
SUPPORTED_LANGUAGES.forEach((language) => {
  const catalog = TRANSLATIONS[language];
  if (!catalog) {
    errors.push(`${language}: catalogue absent`);
    return;
  }

  const paths = new Set([...leafPaths(catalog)].filter(isStructuralPath));
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
  if (catalog.changelog.versions.length !== 12) {
    errors.push(`${language}: 12 versions attendues`);
  }
  catalog.features.items.forEach((feature, index) => {
    if (!Array.isArray(feature.dial) || !feature.dial.length) {
      errors.push(`${language}: texte du cadran absent pour la fonctionnalité ${index + 1}`);
    }
  });
});

const dateCount = (html.match(/data-i18n-date/g) || []).length;
if (dateCount !== 12) errors.push(`${dateCount} dates localisées au lieu de 12`);

if (errors.length) {
  console.error('Traductions incomplètes :');
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(`${SUPPORTED_LANGUAGES.length} langues, ${htmlKeys.size} clés HTML et 12 dates vérifiées.`);
