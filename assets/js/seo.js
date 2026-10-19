/* ===========================================================================
   seo.js. Ce que les moteurs et les réseaux lisent de la page.

   Une seule page sert les quatre langues, distinguées par `?lang=`. Chacune a
   donc besoin de sa propre adresse canonique, de ses alternates et de ses
   données structurées. Tout est calculé ici, à partir du catalogue de
   traduction : aucune phrase n'est réécrite à deux endroits.

   Le graphe ne décrit que ce que la page montre : baliser un contenu absent
   de l'écran est proscrit par les moteurs, et sans effet.

   Le même module sert au navigateur (i18n.js, au changement de langue) et à
   la vérification hors ligne (tools/check-structured-data.mjs, qui compare le
   bloc JSON-LD figé dans index.html à ce que produit le catalogue français).
   =========================================================================== */

/** Adresse de publication. Une seule ligne à changer en cas de déménagement. */
export const SITE_URL = 'https://disquebleusuisse.ch/';

/** Fiches des magasins, partagées avec les liens de téléchargement. */
export const STORES = {
  ios: 'https://apps.apple.com/app/id6756579975',
  android: 'https://play.google.com/store/apps/details?id=ch.vergasta.disquebleusuisse',
};

/** Version publiée, reprise en tête de l'historique dans index.html. */
export const APP_VERSION = '2.1.3';
export const APP_RELEASE_DATE = '2026-08-26';
export const APP_FIRST_RELEASE = '2025-12-15';

/** Pays couverts, en codes ISO : la même liste que la section « Pays ». */
export const COUNTRIES = ['CH', 'FR', 'DE', 'IT', 'BE', 'LU'];

/** Le français est servi à l'adresse nue ; les autres portent `?lang=`. */
export function languageUrl(language) {
  return language === 'fr' ? SITE_URL : `${SITE_URL}?lang=${language}`;
}

const absolute = (path) => new URL(path, SITE_URL).href;

/**
 * Le graphe de données structurées d'une langue.
 *
 * @param {string} language code à deux lettres
 * @param {object} catalog  TRANSLATIONS[language]
 * @param {string[]} languages toutes les langues servies
 */
export function buildStructuredData(language, catalog, languages) {
  const url = languageUrl(language);
  const image = absolute('assets/img/og-cover.png');
  const site = `${SITE_URL}#site`;
  const publisher = `${SITE_URL}#publisher`;
  const application = `${SITE_URL}#application`;
  const page = `${url}#page`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': site,
        url: SITE_URL,
        name: 'Disque Bleu',
        description: catalog.meta.description,
        inLanguage: languages,
        publisher: { '@id': publisher },
      },
      {
        '@type': 'Organization',
        '@id': publisher,
        name: 'Vergasta Digital',
        url: 'https://vergasta.ch',
        logo: absolute('assets/img/app-icon.png'),
      },
      {
        '@type': 'WebPage',
        '@id': page,
        url,
        name: catalog.meta.title,
        description: catalog.meta.description,
        inLanguage: language,
        isPartOf: { '@id': site },
        about: { '@id': application },
        primaryImageOfPage: image,
      },
      {
        '@type': 'MobileApplication',
        '@id': application,
        name: 'Disque Bleu',
        description: catalog.meta.description,
        url: SITE_URL,
        image,
        applicationCategory: 'TravelApplication',
        applicationSubCategory: 'Parking',
        operatingSystem: 'iOS, Android',
        softwareVersion: APP_VERSION,
        datePublished: APP_FIRST_RELEASE,
        dateModified: APP_RELEASE_DATE,
        inLanguage: languages,
        countriesSupported: COUNTRIES.join(', '),
        downloadUrl: [STORES.ios, STORES.android],
        featureList: catalog.features.items.map((item) => item.title),
        author: { '@id': publisher },
        publisher: { '@id': publisher },
        offers: {
          '@type': 'Offer',
          price: '3.00',
          priceCurrency: 'CHF',
          availability: 'https://schema.org/InStock',
          url: SITE_URL,
        },
      },
    ],
  };
}
