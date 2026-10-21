/* ===========================================================================
   i18n.js. Catalogue unique et changement de langue sans dupliquer la page.

   Les quatre textes de la présentation reprennent ceux de l'onboarding de
   l'application (lib/l10n/app_strings.dart), mot pour mot : le site et l'app
   parlent de la même façon.
   =========================================================================== */

import { buildStructuredData, languageUrl } from './seo.js';

export const SUPPORTED_LANGUAGES = ['fr', 'en', 'de', 'it'];

const LOCALES = {
  fr: 'fr-CH',
  en: 'en-GB',
  de: 'de-CH',
  it: 'it-CH',
};

export const TRANSLATIONS = {
  fr: {
    meta: {
      title: "Disque Bleu, l'application du disque de stationnement en zone bleue",
      description: "Disque Bleu calcule l'heure à régler sur votre disque de stationnement en zone bleue et vous prévient avant l'échéance. Suisse, France, Allemagne, Italie, Belgique, Luxembourg et Pays-Bas.",
      socialDescription: "Sept pays, sept réglementations. L'application calcule l'heure à régler sur votre disque et vous prévient avant l'échéance.",
      socialImageAlt: "Le disque bleu de l'application, avec sa fenêtre et sa flèche, et le nom Disque Bleu",
      locale: 'fr_CH',
    },
    accessibility: {
      skip: 'Aller au contenu',
      home: 'Disque Bleu, retour en haut',
      sections: 'Sections',
      chapters: 'Étapes de la présentation',
      windshield: "Un disque de stationnement posé derrière le pare-brise d'une voiture",
    },
    language: {
      label: 'Langue',
    },
    nav: {
      features: 'Fonctions',
      countries: 'Pays',
      download: 'Télécharger',
    },
    intro: {
      next: 'Continuer',
      chapters: [
        {
          title: 'Bienvenue sur Disque Bleu',
          text: "L'application qui vous indique sur quelle heure régler votre disque, en Suisse et dans six autres pays d'Europe.",
        },
        {
          title: 'Réglez votre disque',
          text: "L'application calcule l'heure à régler sur votre disque. Elle vous indique aussi jusqu'à quand vous pouvez rester.",
        },
        {
          title: "Recevez un rappel avant l'échéance",
          text: 'Une notification vous prévient quelques minutes avant la fin de votre temps de stationnement. Vous pouvez choisir ce délai dans les réglages.',
        },
        {
          title: 'Trouvez une place en zone bleue',
          text: 'La carte affiche les places en zone bleue autour de vous ou dans une autre ville. Elle montre aussi où votre voiture est garée.',
        },
      ],
    },
    countries: {
      title: 'Sept pays, une seule application.',
      text: "Les règles du disque changent d'un pays à l'autre : durée, horaires et jours fériés. L'application applique celles du pays choisi.",
      items: [
        {
          name: 'Suisse',
          rule: '1 h · arrondi à la demi-heure suivante',
        },
        {
          name: 'France',
          rule: '1 h 30 · arrondi à la demi-heure suivante',
        },
        {
          name: 'Allemagne',
          rule: '2 h · arrondi à la demi-heure suivante',
        },
        {
          name: 'Italie',
          rule: "Durée du panneau · heure réelle d'arrivée",
        },
        {
          name: 'Belgique',
          rule: '2 h par défaut · arrondi à la demi-heure suivante',
        },
        {
          name: 'Luxembourg',
          rule: 'Durée du panneau · arrondi à la demi-heure suivante',
        },
        {
          name: 'Pays-Bas',
          rule: "Durée du panneau · arrondi à l'heure ou à la demi-heure suivante",
        },
      ],
    },
    features: {
      title: 'Fonctionnalités',
      items: [
        {
          title: "Calcul de l'heure à afficher",
          version: 'Depuis 1.0.0',
          text: 'Calculée selon la règle du pays, arrondi compris.',
        },
        {
          title: 'Règles locales et exceptions',
          version: 'Depuis 1.0.0',
          text: 'Midi suisse, pause déjeuner, doubles plages, périodes nocturnes.',
        },
        {
          title: 'Jours fériés',
          version: 'Mise à jour 2.0.3',
          text: 'Nationaux et régionaux, selon le canton, la région ou le Land sélectionné.',
        },
        {
          title: "Alerte avant l'échéance",
          version: 'Depuis 1.0.0',
          text: 'Une notification est envoyée avant la fin du stationnement, au délai choisi.',
        },
        {
          title: 'Trouver un parking',
          version: 'Depuis 1.0.0',
          text: "Repérez les places à proximité, gardez vos favorites et lancez l'itinéraire dans votre application de navigation.",
        },
        {
          title: 'Compte à rebours en direct',
          version: 'Depuis 2.0.0',
          text: "Sur iPhone, le temps restant s'affiche sur l'écran verrouillé, dans la Dynamic Island et via un widget.",
        },
        {
          title: 'Durée personnalisée',
          version: 'Depuis 2.0.1',
          text: "La durée se règle de 5 minutes à 12 heures et 59 minutes. L'heure et le jour restent modifiables.",
        },
        {
          title: 'Mon véhicule',
          version: 'Améliorée en 2.1.1',
          text: 'La position de votre véhicule est mémorisée quand vous vous garez. Vous pouvez également ajouter une photo de repère, le niveau, le numéro de place ou une note.',
        },
        {
          title: 'Carte communautaire',
          version: 'Depuis 2.1.1',
          beforeLink: 'Signalez une place disparue ou mal renseignée. Après relecture, la correction repart vers les',
          link: "contributeurs d'OpenStreetMap",
          afterLink: 'et profite à tout le monde.',
        },
        {
          title: 'Tablettes et pliables',
          version: 'Depuis 3.0.0',
          text: "Sur tablette et téléphone pliable, l'application s'affiche en deux panneaux côte à côte.",
        },
      ],
    },
    notice: {
      title: "L'application ne remplace pas le disque physique.",
      text: "C'est une aide au conducteur. Le disque officiel doit rester apposé derrière le pare-brise, visible depuis l'extérieur.",
    },
    press: {
      title: 'Apparu sur',
      action: "Lire l'article ↗",
      sources: [
        "Lire l'article du Journal du Jura",
        "Lire l'article d'ArcInfo",
        "Lire l'article de Watson",
        "Lire l'article du Nouvelliste",
        "Lire l'article de La Côte",
        "Lire l'article d'ajour",
      ],
    },
    changelog: {
      title: 'Nouveautés',
      action: 'Voir le changelog complet',
      versions: [
        {
          title: 'Pays-Bas et grands écrans',
          text: 'Ajout des Pays-Bas. Interface optimisée pour les téléphones pliables Android et les tablettes, avec une disposition à deux panneaux sur les grands écrans. Amélioration du calcul des horaires de stationnement.',
        },
        {
          title: 'Notifications corrigées sur Android',
          text: "Correction de l'affichage des notifications sur Android : l'alerte avant l'échéance n'apparaissait pas sur tous les appareils.",
        },
        {
          title: 'Italie, Belgique, Luxembourg, carte communautaire et Mon véhicule',
          text: "Ajout de l'Italie, de la Belgique et du Luxembourg, avec leurs règles de stationnement et leurs jours fériés. Ajout de la carte communautaire pour signaler ou proposer une place à destination d'OpenStreetMap. « Mon véhicule » permet désormais d'ajouter une photo de repère, le niveau, le numéro de place et une note, conservés sur l'appareil.",
        },
        {
          title: 'Corrections des jours fériés',
          text: "Vérification des 44 subdivisions alors couvertes, correction des jours fériés dans onze cantons suisses et affichage des prochains jours fériés au-delà de l'année en cours.",
        },
        {
          title: 'Compatibilité iPhone et Android, navigation',
          text: "Présentation de Disque Bleu dans Mes Échéances sur iPhone, mise à niveau de la compatibilité Android et amélioration de l'ouverture des applications de navigation.",
        },
        {
          title: 'Durée personnalisée',
          text: "Ajout d'un sélecteur à deux roues pour définir librement la durée du stationnement, de 5 minutes à 12 heures et 59 minutes.",
        },
        {
          title: 'Activités en direct et widget sur iPhone',
          text: "Ajout du temps restant sur l'écran verrouillé, dans la Dynamic Island et dans un widget. Ces affichages sont disponibles dans les quatre langues de l'application.",
        },
        {
          title: 'Fin de la bêta allemande',
          text: 'Fin de la bêta allemande. Ajout de la Brötchentaste pour les arrêts de 30 minutes, suggestion du pays selon la position et détection automatique des zones bleues à proximité.',
        },
        {
          title: 'Changement de nom et traductions allemandes',
          text: "L'application « Disque Bleu Suisse » devient « Disque Bleu ». Ajout d'un parcours d'accueil en allemand et traduction complète des noms des Länder.",
        },
        {
          title: "Ajout de l'Allemagne en bêta",
          text: 'Ajout des règles allemandes, des seize Länder et de leurs jours fériés régionaux. Cette prise en charge est initialement proposée en bêta.',
        },
        {
          title: 'Fin de la bêta française',
          text: "Fin de la bêta française, ajout des jours fériés spécifiques à l'Alsace-Moselle, localisation des noms et adaptation de l'interface aux petits écrans.",
        },
        {
          title: 'Ajout de la France en bêta',
          text: "Ajout des règles françaises, de la pause déjeuner, des jours fériés et du cas particulier de l'Alsace-Moselle.",
        },
        {
          title: 'Position du véhicule et avertissement',
          text: "La position du véhicule reste disponible après l'expiration du disque et le redémarrage de l'application. Ajout d'un rappel indiquant que l'application ne remplace pas le disque physique.",
        },
        {
          title: 'Première version',
          text: 'Calcul des règles suisses, compte à rebours, alertes, quatre langues, cantons et jours fériés, mémorisation de la position du véhicule et recherche de zones bleues à proximité.',
        },
      ],
    },
    install: {
      title: 'Tout simplement.',
      text: "L'app coûte 1 CHF. Une amende, au moins 40.",
    },
    footer: {
      description: 'Aide au stationnement à durée limitée.',
      site: 'Le site',
      countries: 'Pays couverts',
      install: 'Installer',
    },
    stores: {
      appleLabel: "Télécharger dans l'App Store",
      googleLabel: 'Disponible sur Google Play',
      appleBadge: 'assets/img/app-store-fr.svg',
      googleBadge: 'assets/img/google-play-fr.png',
    },
  },

  en: {
    meta: {
      title: 'Disque Bleu, the parking disc app for blue zones',
      description: 'Disque Bleu works out the time to set on your parking disc in blue zones and reminds you before it expires. Switzerland, France, Germany, Italy, Belgium, Luxembourg and the Netherlands.',
      socialDescription: 'Seven countries, seven sets of rules. The app works out the time to set on your disc and reminds you before it expires.',
      socialImageAlt: "The app's blue disc, with its window and arrow, and the name Disque Bleu",
      locale: 'en_GB',
    },
    accessibility: {
      skip: 'Skip to content',
      home: 'Disque Bleu, back to top',
      sections: 'Sections',
      chapters: 'Steps of the introduction',
      windshield: 'A parking disc placed behind the windscreen of a car',
    },
    language: {
      label: 'Language',
    },
    nav: {
      features: 'Features',
      countries: 'Countries',
      download: 'Download',
    },
    intro: {
      next: 'Continue',
      chapters: [
        {
          title: 'Welcome to Disque Bleu',
          text: 'The app that tells you what time to set on your parking disc, in Switzerland and six other European countries.',
        },
        {
          title: 'Set your disc',
          text: 'The app works out what time to set on your disc. It also shows you how long you can stay.',
        },
        {
          title: 'Get a reminder before time runs out',
          text: 'A notification reminds you a few minutes before your parking time ends. You can choose how early in the settings.',
        },
        {
          title: 'Find a blue zone space',
          text: 'The map shows blue zone spaces near you or in another city. It also shows where your car is parked.',
        },
      ],
    },
    countries: {
      title: 'Seven countries, one app.',
      text: 'Parking disc rules change from one country to another: duration, hours and public holidays. The app applies the rules of the country you choose.',
      items: [
        {
          name: 'Switzerland',
          rule: '1 hour · rounded up to the next half hour',
        },
        {
          name: 'France',
          rule: '1 hour 30 · rounded up to the next half hour',
        },
        {
          name: 'Germany',
          rule: '2 hours · rounded up to the next half hour',
        },
        {
          name: 'Italy',
          rule: 'Duration on the sign · actual arrival time',
        },
        {
          name: 'Belgium',
          rule: '2 hours by default · rounded up to the next half hour',
        },
        {
          name: 'Luxembourg',
          rule: 'Duration on the sign · rounded up to the next half hour',
        },
        {
          name: 'Netherlands',
          rule: 'Duration on the sign · rounded up to the next hour or half hour',
        },
      ],
    },
    features: {
      title: 'Features',
      items: [
        {
          title: 'Time to display',
          version: 'Since 1.0.0',
          text: "Calculated according to the country's rules, including rounding.",
        },
        {
          title: 'Local rules and exceptions',
          version: 'Since 1.0.0',
          text: 'Swiss noon rule, lunch breaks, split time windows and overnight periods.',
        },
        {
          title: 'Public holidays',
          version: 'Updated in 2.0.3',
          text: 'National and regional holidays, based on the selected canton, region or German state.',
        },
        {
          title: 'Expiry alert',
          version: 'Since 1.0.0',
          text: 'A notification is sent before parking expires, using the advance notice you choose.',
        },
        {
          title: 'Find parking',
          version: 'Since 1.0.0',
          text: 'Find nearby spaces, save favourites and start directions in your navigation app.',
        },
        {
          title: 'Live countdown',
          version: 'Since 2.0.0',
          text: 'On iPhone, the remaining time appears on the Lock Screen, in the Dynamic Island and in a widget.',
        },
        {
          title: 'Custom duration',
          version: 'Since 2.0.1',
          text: 'Set the duration from 5 minutes to 12 hours 59 minutes. The time and day can also be changed.',
        },
        {
          title: 'My vehicle',
          version: 'Improved in 2.1.1',
          text: "Your vehicle's location is saved when you park. You can also add a reference photo, level, space number or note.",
        },
        {
          title: 'Community map',
          version: 'Since 2.1.1',
          beforeLink: 'Report a space that no longer exists or has incorrect information. After review, the correction is sent to',
          link: 'OpenStreetMap contributors',
          afterLink: 'and benefits everyone.',
        },
        {
          title: 'Tablets and foldables',
          version: 'Since 3.0.0',
          text: 'On tablets and foldable phones, the app shows two panels side by side.',
        },
      ],
    },
    notice: {
      title: 'The app does not replace the physical parking disc.',
      text: 'It is a driving aid. The official disc must remain displayed behind the windscreen and visible from outside.',
    },
    press: {
      title: 'Featured in',
      action: 'Read the article ↗',
      sources: [
        'Read the Journal du Jura article',
        'Read the ArcInfo article',
        'Read the Watson article',
        'Read the Nouvelliste article',
        'Read the article from La Côte',
        'Read the ajour article',
      ],
    },
    changelog: {
      title: "What's new",
      action: 'View the full changelog',
      versions: [
        {
          title: 'The Netherlands and larger screens',
          text: 'Added support for the Netherlands. Optimised interface for Android foldable phones and tablets, with a two-panel layout on larger screens. Improved parking time calculations.',
        },
        {
          title: 'Android notification fix',
          text: 'Fixed the display of notifications on Android: the reminder before the deadline did not appear on every device.',
        },
        {
          title: 'Italy, Belgium, Luxembourg, community map and My vehicle',
          text: 'Added Italy, Belgium and Luxembourg, including their parking rules and public holidays. Added the community map for reporting or suggesting a parking space for OpenStreetMap. “My vehicle” can now store a reference photo, floor, space number and note on the device.',
        },
        {
          title: 'Public holiday corrections',
          text: 'Reviewed the 44 subdivisions supported at the time, corrected public holidays in eleven Swiss cantons and added upcoming holidays beyond the current year.',
        },
        {
          title: 'iPhone and Android compatibility, navigation',
          text: 'Added Disque Bleu to the My Deadlines view on iPhone, upgraded Android compatibility and improved the opening of navigation apps.',
        },
        {
          title: 'Custom duration',
          text: 'Added a two-wheel selector for freely setting the parking duration, from 5 minutes to 12 hours 59 minutes.',
        },
        {
          title: 'Live Activities and iPhone widget',
          text: "Added the remaining time to the Lock Screen, Dynamic Island and a widget. These displays are available in all four of the app's languages.",
        },
        {
          title: 'End of the German beta',
          text: 'Ended the German beta. Added the Brötchentaste for 30-minute stops, country suggestions based on location and automatic detection of nearby blue zones.',
        },
        {
          title: 'Name change and German translations',
          text: 'The app was renamed from “Disque Bleu Suisse” to “Disque Bleu”. Added a German onboarding flow and fully translated the names of the German states.',
        },
        {
          title: 'Germany added in beta',
          text: 'Added German rules, all sixteen states and their regional public holidays. Support was initially released in beta.',
        },
        {
          title: 'End of the French beta',
          text: 'Ended the French beta, added Alsace-Moselle public holidays, localised names and adapted the interface for small screens.',
        },
        {
          title: 'France added in beta',
          text: 'Added French rules, the lunch break, public holidays and the special case of Alsace-Moselle.',
        },
        {
          title: 'Vehicle location and warning',
          text: 'The vehicle location remains available after the parking disc expires and after restarting the app. Added a reminder that the app does not replace the physical disc.',
        },
        {
          title: 'Initial release',
          text: 'Swiss rule calculations, countdown, alerts, four languages, cantons and public holidays, vehicle location storage and nearby blue-zone search.',
        },
      ],
    },
    install: {
      title: 'Simple as that.',
      text: 'The app costs CHF 1. A fine, at least CHF 40.',
    },
    footer: {
      description: 'Assistance for time-limited parking.',
      site: 'The site',
      countries: 'Countries covered',
      install: 'Install',
    },
    stores: {
      appleLabel: 'Download on the App Store',
      googleLabel: 'Get it on Google Play',
      appleBadge: 'https://toolbox.marketingtools.apple.com/api/badges/download-on-the-app-store/black/en-us?size=250x83',
      googleBadge: 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png',
    },
  },

  de: {
    meta: {
      title: 'Disque Bleu, die Parkscheiben-App für die blaue Zone',
      description: 'Disque Bleu berechnet die Uhrzeit für Ihre Parkscheibe in der blauen Zone und erinnert Sie vor Ablauf der Parkzeit. Schweiz, Frankreich, Deutschland, Italien, Belgien, Luxemburg und die Niederlande.',
      socialDescription: 'Sieben Länder, sieben Regelwerke. Die App berechnet die Uhrzeit für Ihre Parkscheibe und erinnert Sie vor Ablauf der Parkzeit.',
      socialImageAlt: 'Die blaue Scheibe der App mit Fenster und Pfeil und dem Namen Disque Bleu',
      locale: 'de_CH',
    },
    accessibility: {
      skip: 'Zum Inhalt springen',
      home: 'Disque Bleu, zurück nach oben',
      sections: 'Bereiche',
      chapters: 'Schritte der Einführung',
      windshield: 'Eine Parkscheibe hinter der Windschutzscheibe eines Autos',
    },
    language: {
      label: 'Sprache',
    },
    nav: {
      features: 'Funktionen',
      countries: 'Länder',
      download: 'Laden',
    },
    intro: {
      next: 'Weiter',
      chapters: [
        {
          title: 'Willkommen bei Disque Bleu',
          text: 'Die App, die Ihnen sagt, auf welche Uhrzeit Sie Ihre Parkscheibe stellen, in der Schweiz und in sechs weiteren Ländern Europas.',
        },
        {
          title: 'Stellen Sie Ihre Parkscheibe ein',
          text: 'Die App berechnet die Uhrzeit für Ihre Parkscheibe. Sie zeigt Ihnen auch, bis wann Sie parken dürfen.',
        },
        {
          title: 'Lassen Sie sich vor Ablauf erinnern',
          text: 'Einige Minuten vor Ende Ihrer Parkzeit erinnert Sie eine Mitteilung. Die Vorlaufzeit wählen Sie in den Einstellungen.',
        },
        {
          title: 'Finden Sie einen Parkplatz in der blauen Zone',
          text: 'Die Karte zeigt Parkplätze in der blauen Zone in Ihrer Nähe oder in einer anderen Stadt. Sie zeigt auch, wo Ihr Auto steht.',
        },
      ],
    },
    countries: {
      title: 'Sieben Länder, eine App.',
      text: 'Die Regeln für die Parkscheibe sind in jedem Land anders: Parkdauer, Uhrzeiten und Feiertage. Die App wendet die Regeln des gewählten Landes an.',
      items: [
        {
          name: 'Schweiz',
          rule: '1 Std. · Aufrunden auf die nächste halbe Stunde',
        },
        {
          name: 'Frankreich',
          rule: '1 Std. 30 · Aufrunden auf die nächste halbe Stunde',
        },
        {
          name: 'Deutschland',
          rule: '2 Std. · Aufrunden auf die nächste halbe Stunde',
        },
        {
          name: 'Italien',
          rule: 'Dauer laut Schild · tatsächliche Ankunftszeit',
        },
        {
          name: 'Belgien',
          rule: 'Standardmässig 2 Std. · Aufrunden auf die nächste halbe Stunde',
        },
        {
          name: 'Luxemburg',
          rule: 'Dauer laut Schild · Aufrunden auf die nächste halbe Stunde',
        },
        {
          name: 'Niederlande',
          rule: 'Dauer laut Schild · Aufrunden auf die nächste volle oder halbe Stunde',
        },
      ],
    },
    features: {
      title: 'Funktionen',
      items: [
        {
          title: 'Einzustellende Zeit berechnen',
          version: 'Seit 1.0.0',
          text: 'Berechnung nach den Regeln des Landes, einschliesslich Rundung.',
        },
        {
          title: 'Lokale Regeln und Ausnahmen',
          version: 'Seit 1.0.0',
          text: 'Schweizer Mittagsregel, Mittagspausen, geteilte Zeitfenster und Nachtzeiträume.',
        },
        {
          title: 'Feiertage',
          version: 'Aktualisiert in 2.0.3',
          text: 'Nationale und regionale Feiertage, abhängig vom gewählten Kanton, der Region oder dem Bundesland.',
        },
        {
          title: 'Erinnerung vor Ablauf',
          version: 'Seit 1.0.0',
          text: 'Eine Benachrichtigung wird im festgelegten Abstand vor Ende der Parkzeit gesendet.',
        },
        {
          title: 'Parkplatz finden',
          version: 'Seit 1.0.0',
          text: 'Finden Sie Plätze in der Nähe, speichern Sie Favoriten und starten Sie die Route in Ihrer Navigations-App.',
        },
        {
          title: 'Live-Countdown',
          version: 'Seit 2.0.0',
          text: 'Auf dem iPhone erscheint die verbleibende Zeit auf dem Sperrbildschirm, in der Dynamic Island und in einem Widget.',
        },
        {
          title: 'Benutzerdefinierte Dauer',
          version: 'Seit 2.0.1',
          text: 'Die Dauer lässt sich von 5 Minuten bis 12 Stunden 59 Minuten einstellen. Uhrzeit und Tag können ebenfalls geändert werden.',
        },
        {
          title: 'Mein Fahrzeug',
          version: 'Verbessert in 2.1.1',
          text: 'Der Standort Ihres Fahrzeugs wird beim Parkieren gespeichert. Zusätzlich können Sie ein Orientierungsfoto, das Stockwerk, die Platznummer oder eine Notiz hinzufügen.',
        },
        {
          title: 'Community-Karte',
          version: 'Seit 2.1.1',
          beforeLink: 'Melden Sie einen entfernten oder falsch erfassten Parkplatz. Nach der Prüfung wird die Korrektur an die',
          link: 'Mitwirkenden von OpenStreetMap',
          afterLink: 'weitergeleitet und kommt allen zugute.',
        },
        {
          title: 'Tablets und Faltgeräte',
          version: 'Seit 3.0.0',
          text: 'Auf Tablets und faltbaren Smartphones zeigt die App zwei Bereiche nebeneinander.',
        },
      ],
    },
    notice: {
      title: 'Die App ersetzt die physische Parkscheibe nicht.',
      text: 'Sie dient als Fahrhilfe. Die offizielle Parkscheibe muss weiterhin hinter der Windschutzscheibe angebracht und von aussen gut sichtbar sein.',
    },
    press: {
      title: 'Bekannt aus',
      action: 'Artikel lesen ↗',
      sources: [
        'Artikel im Journal du Jura lesen',
        'Artikel bei ArcInfo lesen',
        'Artikel bei Watson lesen',
        'Artikel im Nouvelliste lesen',
        'Artikel von La Côte lesen',
        'Artikel bei ajour lesen',
      ],
    },
    changelog: {
      title: 'Neuerungen',
      action: 'Vollständiges Änderungsprotokoll anzeigen',
      versions: [
        {
          title: 'Niederlande und grosse Bildschirme',
          text: 'Unterstützung für die Niederlande hinzugefügt. Optimierte Oberfläche für faltbare Android-Smartphones und Tablets, mit einem Zwei-Spalten-Layout auf grossen Bildschirmen. Verbesserte Berechnung der Parkzeiten.',
        },
        {
          title: 'Korrigierte Benachrichtigungen unter Android',
          text: 'Die Anzeige der Benachrichtigungen unter Android wurde korrigiert: Die Erinnerung vor Ablauf erschien nicht auf allen Geräten.',
        },
        {
          title: 'Italien, Belgien, Luxemburg, Community-Karte und Mein Fahrzeug',
          text: 'Italien, Belgien und Luxemburg mit ihren Parkregeln und Feiertagen wurden hinzugefügt. Die Community-Karte ermöglicht Meldungen und Vorschläge von Parkplätzen für OpenStreetMap. Unter «Mein Fahrzeug» lassen sich neu ein Orientierungsfoto, das Stockwerk, die Platznummer und eine lokal gespeicherte Notiz hinzufügen.',
        },
        {
          title: 'Korrekturen bei Feiertagen',
          text: 'Die damals unterstützten 44 Gebietseinheiten wurden überprüft, die Feiertage in elf Schweizer Kantonen korrigiert und kommende Feiertage über das laufende Jahr hinaus angezeigt.',
        },
        {
          title: 'iPhone- und Android-Kompatibilität, Navigation',
          text: 'Disque Bleu wird auf dem iPhone unter «Meine Fristen» angezeigt. Ausserdem wurden die Android-Kompatibilität und das Öffnen von Navigations-Apps verbessert.',
        },
        {
          title: 'Benutzerdefinierte Dauer',
          text: 'Ein Auswahlrad mit zwei Rollen ermöglicht eine frei wählbare Parkdauer von 5 Minuten bis 12 Stunden 59 Minuten.',
        },
        {
          title: 'Live-Aktivitäten und Widget auf dem iPhone',
          text: 'Die verbleibende Zeit erscheint neu auf dem Sperrbildschirm, in der Dynamic Island und in einem Widget. Diese Anzeigen sind in allen vier App-Sprachen verfügbar.',
        },
        {
          title: 'Ende der deutschen Beta',
          text: 'Die deutsche Beta wurde beendet. Hinzu kamen die Brötchentaste für 30-minütige Stopps, Ländervorschläge anhand des Standorts und die automatische Erkennung naher blauer Zonen.',
        },
        {
          title: 'Namensänderung und deutsche Übersetzungen',
          text: 'Die App «Disque Bleu Suisse» wurde in «Disque Bleu» umbenannt. Hinzu kamen eine deutsche Einführung und die vollständige Übersetzung der Namen der Bundesländer.',
        },
        {
          title: 'Deutschland als Beta hinzugefügt',
          text: 'Die deutschen Regeln, alle sechzehn Bundesländer und ihre regionalen Feiertage wurden hinzugefügt. Die Unterstützung startete zunächst als Beta.',
        },
        {
          title: 'Ende der französischen Beta',
          text: 'Die französische Beta wurde beendet. Hinzu kamen die besonderen Feiertage im Elsass und in Moselle, lokalisierte Namen und eine Anpassung für kleine Bildschirme.',
        },
        {
          title: 'Frankreich als Beta hinzugefügt',
          text: 'Die französischen Regeln, die Mittagspause, Feiertage und der Sonderfall Elsass-Moselle wurden hinzugefügt.',
        },
        {
          title: 'Fahrzeugstandort und Hinweis',
          text: 'Der Fahrzeugstandort bleibt nach Ablauf der Parkzeit und einem Neustart der App verfügbar. Ein Hinweis stellt klar, dass die App die physische Parkscheibe nicht ersetzt.',
        },
        {
          title: 'Erste Version',
          text: 'Berechnung der Schweizer Regeln, Countdown, Erinnerungen, vier Sprachen, Kantone und Feiertage, Speichern des Fahrzeugstandorts und Suche nach blauen Zonen in der Nähe.',
        },
      ],
    },
    install: {
      title: 'So einfach.',
      text: 'Die App kostet 1 CHF. Eine Busse mindestens 40.',
    },
    footer: {
      description: 'Hilfe beim zeitlich begrenzten Parkieren.',
      site: 'Die Website',
      countries: 'Unterstützte Länder',
      install: 'Installieren',
    },
    stores: {
      appleLabel: 'Laden im App Store',
      googleLabel: 'Jetzt bei Google Play',
      appleBadge: 'https://toolbox.marketingtools.apple.com/api/badges/download-on-the-app-store/black/de-de?size=250x83',
      googleBadge: 'https://play.google.com/intl/de/badges/static/images/badges/de_badge_web_generic.png',
    },
  },

  it: {
    meta: {
      title: "Disque Bleu, l'app del disco orario per la zona blu",
      description: "Disque Bleu calcola l'ora da impostare sul disco orario in zona blu e ti avvisa prima della scadenza. Svizzera, Francia, Germania, Italia, Belgio, Lussemburgo e Paesi Bassi.",
      socialDescription: "Sette paesi, sette regolamenti. L'app calcola l'ora da impostare sul disco e ti avvisa prima della scadenza.",
      socialImageAlt: "Il disco blu dell'app, con la finestra e la freccia, e il nome Disque Bleu",
      locale: 'it_CH',
    },
    accessibility: {
      skip: 'Vai al contenuto',
      home: "Disque Bleu, torna all'inizio",
      sections: 'Sezioni',
      chapters: 'Passaggi della presentazione',
      windshield: "Un disco orario posizionato dietro il parabrezza di un'auto",
    },
    language: {
      label: 'Lingua',
    },
    nav: {
      features: 'Funzioni',
      countries: 'Paesi',
      download: 'Scarica',
    },
    intro: {
      next: 'Continua',
      chapters: [
        {
          title: 'Benvenuto su Disque Bleu',
          text: "L'app che ti dice su che ora regolare il disco orario, in Svizzera e in altri sei paesi europei.",
        },
        {
          title: 'Regola il tuo disco',
          text: "L'app calcola l'ora da impostare sul disco. Ti dice anche fino a quando puoi restare.",
        },
        {
          title: 'Ricevi un promemoria prima della scadenza',
          text: "Una notifica ti avvisa qualche minuto prima della fine della sosta. Puoi scegliere l'anticipo nelle impostazioni.",
        },
        {
          title: 'Trova un parcheggio in zona blu',
          text: "La mappa mostra i parcheggi in zona blu vicino a te o in un'altra città. Mostra anche dove hai parcheggiato l'auto.",
        },
      ],
    },
    countries: {
      title: "Sette paesi, un'unica app.",
      text: "Le regole del disco orario cambiano da un paese all'altro: durata, orari e giorni festivi. L'app applica quelle del paese scelto.",
      items: [
        {
          name: 'Svizzera',
          rule: "1 ora · arrotondamento alla mezz'ora successiva",
        },
        {
          name: 'Francia',
          rule: "1 ora e 30 · arrotondamento alla mezz'ora successiva",
        },
        {
          name: 'Germania',
          rule: "2 ore · arrotondamento alla mezz'ora successiva",
        },
        {
          name: 'Italia',
          rule: 'Durata del cartello · ora effettiva di arrivo',
        },
        {
          name: 'Belgio',
          rule: "2 ore di base · arrotondamento alla mezz'ora successiva",
        },
        {
          name: 'Lussemburgo',
          rule: "Durata del cartello · arrotondamento alla mezz'ora successiva",
        },
        {
          name: 'Paesi Bassi',
          rule: "Durata del cartello · arrotondamento all'ora o alla mezz'ora successiva",
        },
      ],
    },
    features: {
      title: 'Funzionalità',
      items: [
        {
          title: "Calcolo dell'ora da impostare",
          version: 'Dalla 1.0.0',
          text: 'Calcolata secondo le regole del paese, arrotondamento compreso.',
        },
        {
          title: 'Regole locali ed eccezioni',
          version: 'Dalla 1.0.0',
          text: 'Regola svizzera di mezzogiorno, pausa pranzo, doppie fasce orarie e periodi notturni.',
        },
        {
          title: 'Giorni festivi',
          version: 'Aggiornata nella 2.0.3',
          text: 'Nazionali e regionali, in base al cantone, alla regione o allo Stato federato tedesco selezionato.',
        },
        {
          title: 'Avviso prima della scadenza',
          version: 'Dalla 1.0.0',
          text: 'Una notifica viene inviata prima della fine della sosta, con il preavviso scelto.',
        },
        {
          title: 'Trova parcheggio',
          version: 'Dalla 1.0.0',
          text: "Trova i posti nelle vicinanze, salva i preferiti e avvia l'itinerario nell'app di navigazione.",
        },
        {
          title: 'Conto alla rovescia in tempo reale',
          version: 'Dalla 2.0.0',
          text: 'Su iPhone, il tempo rimanente appare sulla schermata di blocco, nella Dynamic Island e in un widget.',
        },
        {
          title: 'Durata personalizzata',
          version: 'Dalla 2.0.1',
          text: "La durata può essere impostata da 5 minuti a 12 ore e 59 minuti. Anche l'ora e il giorno restano modificabili.",
        },
        {
          title: 'Il mio veicolo',
          version: 'Migliorata nella 2.1.1',
          text: 'La posizione del veicolo viene memorizzata quando parcheggi. Puoi anche aggiungere una foto di riferimento, il piano, il numero del posto o una nota.',
        },
        {
          title: 'Mappa della comunità',
          version: 'Dalla 2.1.1',
          beforeLink: 'Segnala un posto rimosso o con informazioni errate. Dopo la verifica, la correzione viene inviata ai',
          link: 'collaboratori di OpenStreetMap',
          afterLink: 'e va a beneficio di tutti.',
        },
        {
          title: 'Tablet e pieghevoli',
          version: 'Dalla 3.0.0',
          text: "Su tablet e smartphone pieghevoli l'app mostra due pannelli affiancati.",
        },
      ],
    },
    notice: {
      title: "L'app non sostituisce il disco orario fisico.",
      text: "È un ausilio per il conducente. Il disco ufficiale deve restare esposto dietro il parabrezza e visibile dall'esterno.",
    },
    press: {
      title: 'Hanno parlato di noi',
      action: "Leggi l'articolo ↗",
      sources: [
        "Leggi l'articolo del Journal du Jura",
        "Leggi l'articolo di ArcInfo",
        "Leggi l'articolo di Watson",
        "Leggi l'articolo del Nouvelliste",
        "Leggi l'articolo pubblicato da La Côte",
        "Leggi l'articolo di ajour",
      ],
    },
    changelog: {
      title: 'Novità',
      action: 'Mostra il changelog completo',
      versions: [
        {
          title: 'Paesi Bassi e schermi grandi',
          text: 'Aggiunto il supporto per i Paesi Bassi. Interfaccia ottimizzata per smartphone Android pieghevoli e tablet, con un layout a due pannelli sugli schermi di grandi dimensioni. Miglioramento del calcolo degli orari di parcheggio.',
        },
        {
          title: 'Notifiche corrette su Android',
          text: "Corretta la visualizzazione delle notifiche su Android: l'avviso prima della scadenza non compariva su tutti i dispositivi.",
        },
        {
          title: 'Italia, Belgio, Lussemburgo, mappa della comunità e Il mio veicolo',
          text: 'Aggiunti Italia, Belgio e Lussemburgo, con le rispettive regole di parcheggio e i giorni festivi. Aggiunta la mappa della comunità per segnalare o proporre un posto destinato a OpenStreetMap. «Il mio veicolo» consente ora di aggiungere una foto di riferimento, il piano, il numero del posto e una nota, conservati sul dispositivo.',
        },
        {
          title: 'Correzioni dei giorni festivi',
          text: "Verificate le 44 suddivisioni allora supportate, corretti i giorni festivi in undici cantoni svizzeri e aggiunta la visualizzazione dei prossimi giorni festivi oltre l'anno in corso.",
        },
        {
          title: 'Compatibilità iPhone e Android, navigazione',
          text: "Aggiunta di Disque Bleu alla sezione «Le mie scadenze» su iPhone, aggiornamento della compatibilità Android e miglioramento dell'apertura delle app di navigazione.",
        },
        {
          title: 'Durata personalizzata',
          text: 'Aggiunto un selettore a due rotelle per impostare liberamente la durata della sosta, da 5 minuti a 12 ore e 59 minuti.',
        },
        {
          title: 'Attività in tempo reale e widget su iPhone',
          text: "Aggiunto il tempo rimanente sulla schermata di blocco, nella Dynamic Island e in un widget. Queste visualizzazioni sono disponibili nelle quattro lingue dell'app.",
        },
        {
          title: 'Fine della beta tedesca',
          text: 'Conclusa la beta tedesca. Aggiunti il pulsante Brötchentaste per le soste di 30 minuti, il suggerimento del paese in base alla posizione e il rilevamento automatico delle zone blu nelle vicinanze.',
        },
        {
          title: 'Cambio di nome e traduzioni tedesche',
          text: "L'app «Disque Bleu Suisse» diventa «Disque Bleu». Aggiunti un percorso introduttivo in tedesco e la traduzione completa dei nomi degli Stati federati tedeschi.",
        },
        {
          title: 'Germania aggiunta in beta',
          text: 'Aggiunte le regole tedesche, i sedici Stati federati e i relativi giorni festivi regionali. Il supporto è stato inizialmente pubblicato in beta.',
        },
        {
          title: 'Fine della beta francese',
          text: "Conclusa la beta francese, aggiunti i giorni festivi specifici dell'Alsazia-Mosella, localizzati i nomi e adattata l'interfaccia agli schermi piccoli.",
        },
        {
          title: 'Francia aggiunta in beta',
          text: "Aggiunte le regole francesi, la pausa pranzo, i giorni festivi e il caso particolare dell'Alsazia-Mosella.",
        },
        {
          title: 'Posizione del veicolo e avviso',
          text: "La posizione del veicolo resta disponibile dopo la scadenza del disco e il riavvio dell'app. Aggiunto un promemoria che specifica che l'app non sostituisce il disco fisico.",
        },
        {
          title: 'Prima versione',
          text: 'Calcolo delle regole svizzere, conto alla rovescia, avvisi, quattro lingue, cantoni e giorni festivi, memorizzazione della posizione del veicolo e ricerca delle zone blu nelle vicinanze.',
        },
      ],
    },
    install: {
      title: 'Semplicemente.',
      text: "L'app costa 1 CHF. Una multa, almeno 40.",
    },
    footer: {
      description: 'Assistenza per il parcheggio a tempo limitato.',
      site: 'Il sito',
      countries: 'Paesi supportati',
      install: 'Installa',
    },
    stores: {
      appleLabel: 'Scarica su App Store',
      googleLabel: 'Disponibile su Google Play',
      appleBadge: 'https://toolbox.marketingtools.apple.com/api/badges/download-on-the-app-store/black/it-it?size=250x83',
      googleBadge: 'https://play.google.com/intl/it/badges/static/images/badges/it_badge_web_generic.png',
    },
  },
};

function lookup(language, key) {
  return key.split('.').reduce((value, part) => value?.[part], TRANSLATIONS[language]);
}

function normaliseLanguage(language) {
  const short = String(language || '').toLowerCase().split('-')[0];
  return SUPPORTED_LANGUAGES.includes(short) ? short : 'fr';
}

function initialLanguage() {
  const query = new URLSearchParams(window.location.search).get('lang');
  if (query && SUPPORTED_LANGUAGES.includes(normaliseLanguage(query))) {
    return normaliseLanguage(query);
  }

  try {
    const saved = window.localStorage.getItem('disque-bleu-language');
    if (saved && SUPPORTED_LANGUAGES.includes(normaliseLanguage(saved))) {
      return normaliseLanguage(saved);
    }
  } catch {
    // Le stockage peut être désactivé ; la langue du navigateur suffit.
  }

  return normaliseLanguage(window.navigator.language);
}

function setTranslatedText(language) {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = lookup(language, element.dataset.i18n);
    if (typeof value === 'string') element.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const value = lookup(language, element.dataset.i18nHtml);
    if (typeof value === 'string') element.innerHTML = value;
  });

  const translatedAttributes = [
    ['data-i18n-aria-label', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-content', 'content'],
    ['data-i18n-src', 'src'],
  ];

  translatedAttributes.forEach(([source, target]) => {
    document.querySelectorAll(`[${source}]`).forEach((element) => {
      const value = lookup(language, element.getAttribute(source));
      if (typeof value === 'string') element.setAttribute(target, value);
    });
  });

  const formatter = new Intl.DateTimeFormat(LOCALES[language], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  document.querySelectorAll('time[data-i18n-date]').forEach((element) => {
    const parts = element.dateTime.split('-').map(Number);
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    element.textContent = formatter.format(date);
  });
}

/* Adresse canonique, partage et données structurées suivent la langue : sans
   cela, les quatre versions se déclarent toutes comme la page française. */
function applyLanguageMetadata(language) {
  const url = languageUrl(language);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', url);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', url);

  const structured = document.querySelector('script[data-structured-data]');
  if (structured) {
    structured.textContent = JSON.stringify(
      buildStructuredData(language, TRANSLATIONS[language], SUPPORTED_LANGUAGES),
      null,
      2,
    );
  }
}

function reflectLanguageInUrl(language) {
  try {
    const url = new URL(window.location.href);
    if (language === 'fr') url.searchParams.delete('lang');
    else url.searchParams.set('lang', language);
    window.history.replaceState({}, '', url);
  } catch {
    // Le site reste utilisable même si l'historique est indisponible.
  }
}

export function setLanguage(language, options = {}) {
  const next = normaliseLanguage(language);
  document.documentElement.lang = next;
  setTranslatedText(next);
  applyLanguageMetadata(next);

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === next));
  });

  if (options.persist !== false) {
    try {
      window.localStorage.setItem('disque-bleu-language', next);
    } catch {
      // Sans stockage, le paramètre d'URL conserve tout de même le choix.
    }
  }
  if (options.updateUrl !== false) reflectLanguageInUrl(next);

  document.dispatchEvent(new CustomEvent('languagechange', { detail: { language: next } }));
  return next;
}

export function initI18n() {
  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });

  window.addEventListener('popstate', () => {
    const query = new URLSearchParams(window.location.search).get('lang');
    setLanguage(query || 'fr', { persist: false, updateUrl: false });
  });

  return setLanguage(initialLanguage(), { persist: false });
}

