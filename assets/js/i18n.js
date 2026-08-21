/* ===========================================================================
   i18n.js. Catalogue unique et changement de langue sans dupliquer la page.
   =========================================================================== */

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
      title: "Stationnez l'esprit tranquille | Disque Bleu",
      description: "Disque Bleu calcule l'heure à porter sur votre disque de stationnement en Suisse, France, Allemagne, Italie, Belgique et Luxembourg, puis vous prévient avant l'échéance.",
      socialDescription: "Six pays, six réglementations, un seul bouton. L'application calcule l'heure à afficher et vous prévient avant l'échéance.",
      locale: 'fr_CH',
    },
    accessibility: {
      skip: 'Aller au contenu',
      home: 'Disque Bleu, retour en haut',
      sections: 'Sections',
      windshield: 'Une voiture vue de face avec un disque de stationnement posé derrière le pare-brise',
    },
    language: { label: 'Langue' },
    nav: { features: 'Fonctions', countries: 'Pays' },
    hero: { title: "Stationnez<br>l'esprit tranquille." },
    calculate: {
      title: 'Plus besoin<br>de calculer.',
      arrivalLabel: "Heure d'arrivée",
      example: "Arrivée 08h47, stationnement jusqu'à",
    },
    alert: {
      title: 'Fini<br>les amendes.',
      text: "Vous recevez une alerte avant l'échéance de votre disque. Plus d'oubli possible !",
    },
    features: {
      title: 'Fonctionnalités',
      items: [
        {
          title: "Calcul de l'heure à afficher",
          dial: ["Calcul de l'heure", 'à afficher'],
          version: 'Depuis 1.0.0',
          text: 'Calculée selon la règle du pays, arrondi compris.',
        },
        {
          title: 'Règles locales et exceptions',
          dial: ['Règles locales', 'et exceptions'],
          version: 'Depuis 1.0.0',
          text: 'Midi suisse, pause déjeuner, doubles plages, périodes nocturnes.',
        },
        {
          title: 'Jours fériés',
          dial: ['Jours fériés'],
          version: 'Mise à jour 2.0.3',
          text: 'Nationaux et régionaux, selon le canton, la région ou le Land sélectionné.',
        },
        {
          title: "Alerte avant l'échéance",
          dial: ['Alerte avant', "l'échéance"],
          version: 'Depuis 1.0.0',
          text: 'Une notification est envoyée avant la fin du stationnement, au délai choisi.',
        },
        {
          title: 'Trouver un parking',
          dial: ['Trouver', 'un parking'],
          version: 'Depuis 1.0.0',
          text: "Repérez les places à proximité, gardez vos favorites et lancez l'itinéraire dans votre application de navigation.",
        },
        {
          title: 'Compte à rebours en direct',
          dial: ['Compte à rebours', 'en direct'],
          version: 'Depuis 2.0.0',
          text: "Sur iPhone, le temps restant s'affiche sur l'écran verrouillé, dans la Dynamic Island et via un widget.",
        },
        {
          title: 'Durée personnalisée',
          dial: ['Durée', 'personnalisée'],
          version: 'Depuis 2.0.1',
          text: "La durée se règle de 5 minutes à 12 heures et 59 minutes. L'heure et le jour restent modifiables.",
        },
        {
          title: 'Mon véhicule',
          dial: ['Mon véhicule'],
          version: 'Améliorée en 2.1.1',
          text: 'La position de votre véhicule est mémorisée quand vous vous garez. Vous pouvez également ajouter une photo de repère, le niveau, le numéro de place ou une note.',
        },
        {
          title: 'Carte communautaire',
          dial: ['Carte', 'communautaire'],
          version: 'Depuis 2.1.1',
          beforeLink: 'Signalez une place disparue ou mal renseignée. Après relecture, la correction repart vers les',
          link: "contributeurs d'OpenStreetMap",
          afterLink: 'et profite à tout le monde.',
        },
      ],
    },
    changelog: {
      action: 'Voir le changelog complet',
      versions: [
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
    countries: {
      title: 'Six pays,<br>une seule application.',
      text: "Les horaires, arrondis et jours fériés s'adaptent automatiquement selon le pays sélectionné.",
      names: ['Suisse', 'France', 'Allemagne', 'Italie', 'Belgique', 'Luxembourg'],
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
      ],
    },
    install: {
      title: 'Tout simplement.',
      text: "L'app coûte 1 CHF. Une amende, 40 fois plus.",
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
      title: 'Park with peace of mind | Disque Bleu',
      description: 'Disque Bleu calculates the time to display on your parking disc in Switzerland, France, Germany, Italy, Belgium and Luxembourg, then alerts you before it expires.',
      socialDescription: 'Six countries, six sets of rules, one button. The app calculates the time to display and alerts you before it expires.',
      locale: 'en_GB',
    },
    accessibility: {
      skip: 'Skip to content',
      home: 'Disque Bleu, back to top',
      sections: 'Sections',
      windshield: 'Front view of a car with a parking disc placed behind the windscreen',
    },
    language: { label: 'Language' },
    nav: { features: 'Features', countries: 'Countries' },
    hero: { title: 'Park<br>with peace of mind.' },
    calculate: {
      title: 'No more<br>calculations.',
      arrivalLabel: 'Arrival time',
      example: 'Arrived at 08:47, parking allowed until',
    },
    alert: {
      title: 'No more<br>fines.',
      text: 'You receive an alert before your parking disc expires. No more forgetting!',
    },
    features: {
      title: 'Features',
      items: [
        {
          title: 'Time to display',
          dial: ['Time', 'to display'],
          version: 'Since 1.0.0',
          text: "Calculated according to the country's rules, including rounding.",
        },
        {
          title: 'Local rules and exceptions',
          dial: ['Local rules', 'and exceptions'],
          version: 'Since 1.0.0',
          text: 'Swiss noon rule, lunch breaks, split time windows and overnight periods.',
        },
        {
          title: 'Public holidays',
          dial: ['Public', 'holidays'],
          version: 'Updated in 2.0.3',
          text: 'National and regional holidays, based on the selected canton, region or German state.',
        },
        {
          title: 'Expiry alert',
          dial: ['Expiry', 'alert'],
          version: 'Since 1.0.0',
          text: 'A notification is sent before parking expires, using the advance notice you choose.',
        },
        {
          title: 'Find parking',
          dial: ['Find', 'parking'],
          version: 'Since 1.0.0',
          text: 'Find nearby spaces, save favourites and start directions in your navigation app.',
        },
        {
          title: 'Live countdown',
          dial: ['Live', 'countdown'],
          version: 'Since 2.0.0',
          text: 'On iPhone, the remaining time appears on the Lock Screen, in the Dynamic Island and in a widget.',
        },
        {
          title: 'Custom duration',
          dial: ['Custom', 'duration'],
          version: 'Since 2.0.1',
          text: 'Set the duration from 5 minutes to 12 hours 59 minutes. The time and day can also be changed.',
        },
        {
          title: 'My vehicle',
          dial: ['My vehicle'],
          version: 'Improved in 2.1.1',
          text: "Your vehicle's location is saved when you park. You can also add a reference photo, level, space number or note.",
        },
        {
          title: 'Community map',
          dial: ['Community', 'map'],
          version: 'Since 2.1.1',
          beforeLink: 'Report a space that no longer exists or has incorrect information. After review, the correction is sent to',
          link: 'OpenStreetMap contributors',
          afterLink: 'and benefits everyone.',
        },
      ],
    },
    changelog: {
      action: 'View the full changelog',
      versions: [
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
    countries: {
      title: 'Six countries,<br>one app.',
      text: 'Times, rounding and public holidays adapt automatically to the selected country.',
      names: ['Switzerland', 'France', 'Germany', 'Italy', 'Belgium', 'Luxembourg'],
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
      ],
    },
    install: {
      title: 'Simple as that.',
      text: 'The app costs CHF 1. A fine costs 40 times more.',
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
      title: 'Entspannt parken | Disque Bleu',
      description: 'Disque Bleu berechnet die auf der Parkscheibe einzustellende Zeit in der Schweiz, Frankreich, Deutschland, Italien, Belgien und Luxemburg und erinnert Sie vor Ablauf der Parkzeit.',
      socialDescription: 'Sechs Länder, sechs Regelwerke, eine Taste. Die App berechnet die einzustellende Zeit und erinnert Sie vor Ablauf der Parkzeit.',
      locale: 'de_CH',
    },
    accessibility: {
      skip: 'Zum Inhalt springen',
      home: 'Disque Bleu, zurück nach oben',
      sections: 'Bereiche',
      windshield: 'Frontansicht eines Autos mit einer Parkscheibe hinter der Windschutzscheibe',
    },
    language: { label: 'Sprache' },
    nav: { features: 'Funktionen', countries: 'Länder' },
    hero: { title: 'Entspannt<br>parken.' },
    calculate: {
      title: 'Kein<br>Nachrechnen.',
      arrivalLabel: 'Ankunftszeit',
      example: 'Ankunft 08:47 Uhr, Parkzeit bis',
    },
    alert: {
      title: 'Keine<br>Bussen mehr.',
      text: 'Sie erhalten vor Ablauf Ihrer Parkzeit eine Erinnerung. So geht die Parkscheibe nicht mehr vergessen!',
    },
    features: {
      title: 'Funktionen',
      items: [
        {
          title: 'Einzustellende Zeit berechnen',
          dial: ['Zeit', 'berechnen'],
          version: 'Seit 1.0.0',
          text: 'Berechnung nach den Regeln des Landes, einschliesslich Rundung.',
        },
        {
          title: 'Lokale Regeln und Ausnahmen',
          dial: ['Lokale Regeln', 'und Ausnahmen'],
          version: 'Seit 1.0.0',
          text: 'Schweizer Mittagsregel, Mittagspausen, geteilte Zeitfenster und Nachtzeiträume.',
        },
        {
          title: 'Feiertage',
          dial: ['Feiertage'],
          version: 'Aktualisiert in 2.0.3',
          text: 'Nationale und regionale Feiertage, abhängig vom gewählten Kanton, der Region oder dem Bundesland.',
        },
        {
          title: 'Erinnerung vor Ablauf',
          dial: ['Erinnerung', 'vor Ablauf'],
          version: 'Seit 1.0.0',
          text: 'Eine Benachrichtigung wird im festgelegten Abstand vor Ende der Parkzeit gesendet.',
        },
        {
          title: 'Parkplatz finden',
          dial: ['Parkplatz', 'finden'],
          version: 'Seit 1.0.0',
          text: 'Finden Sie Plätze in der Nähe, speichern Sie Favoriten und starten Sie die Route in Ihrer Navigations-App.',
        },
        {
          title: 'Live-Countdown',
          dial: ['Live-', 'Countdown'],
          version: 'Seit 2.0.0',
          text: 'Auf dem iPhone erscheint die verbleibende Zeit auf dem Sperrbildschirm, in der Dynamic Island und in einem Widget.',
        },
        {
          title: 'Benutzerdefinierte Dauer',
          dial: ['Eigene', 'Dauer'],
          version: 'Seit 2.0.1',
          text: 'Die Dauer lässt sich von 5 Minuten bis 12 Stunden 59 Minuten einstellen. Uhrzeit und Tag können ebenfalls geändert werden.',
        },
        {
          title: 'Mein Fahrzeug',
          dial: ['Mein Fahrzeug'],
          version: 'Verbessert in 2.1.1',
          text: 'Der Standort Ihres Fahrzeugs wird beim Parkieren gespeichert. Zusätzlich können Sie ein Orientierungsfoto, das Stockwerk, die Platznummer oder eine Notiz hinzufügen.',
        },
        {
          title: 'Community-Karte',
          dial: ['Community-', 'Karte'],
          version: 'Seit 2.1.1',
          beforeLink: 'Melden Sie einen entfernten oder falsch erfassten Parkplatz. Nach der Prüfung wird die Korrektur an die',
          link: 'Mitwirkenden von OpenStreetMap',
          afterLink: 'weitergeleitet und kommt allen zugute.',
        },
      ],
    },
    changelog: {
      action: 'Vollständiges Änderungsprotokoll anzeigen',
      versions: [
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
    countries: {
      title: 'Sechs Länder,<br>eine App.',
      text: 'Zeiten, Rundungen und Feiertage passen sich automatisch an das ausgewählte Land an.',
      names: ['Schweiz', 'Frankreich', 'Deutschland', 'Italien', 'Belgien', 'Luxemburg'],
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
      ],
    },
    install: {
      title: 'So einfach.',
      text: 'Die App kostet 1 CHF. Eine Busse 40-mal mehr.',
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
      title: 'Parcheggia senza pensieri | Disque Bleu',
      description: "Disque Bleu calcola l'ora da impostare sul disco orario in Svizzera, Francia, Germania, Italia, Belgio e Lussemburgo e ti avvisa prima della scadenza.",
      socialDescription: "Sei paesi, sei regolamenti, un solo pulsante. L'app calcola l'ora da impostare e ti avvisa prima della scadenza.",
      locale: 'it_CH',
    },
    accessibility: {
      skip: 'Vai al contenuto',
      home: "Disque Bleu, torna all'inizio",
      sections: 'Sezioni',
      windshield: "Vista frontale di un'auto con un disco orario posizionato dietro il parabrezza",
    },
    language: { label: 'Lingua' },
    nav: { features: 'Funzioni', countries: 'Paesi' },
    hero: { title: 'Parcheggia<br>senza pensieri.' },
    calculate: {
      title: 'Niente più<br>calcoli.',
      arrivalLabel: "Ora d'arrivo",
      example: 'Arrivo alle 08:47, sosta consentita fino alle',
    },
    alert: {
      title: 'Niente più<br>multe.',
      text: 'Ricevi un avviso prima della scadenza del disco orario. Impossibile dimenticarsene!',
    },
    features: {
      title: 'Funzionalità',
      items: [
        {
          title: "Calcolo dell'ora da impostare",
          dial: ["Calcolo dell'ora", 'da impostare'],
          version: 'Dalla 1.0.0',
          text: 'Calcolata secondo le regole del paese, arrotondamento compreso.',
        },
        {
          title: 'Regole locali ed eccezioni',
          dial: ['Regole locali', 'ed eccezioni'],
          version: 'Dalla 1.0.0',
          text: 'Regola svizzera di mezzogiorno, pausa pranzo, doppie fasce orarie e periodi notturni.',
        },
        {
          title: 'Giorni festivi',
          dial: ['Giorni', 'festivi'],
          version: 'Aggiornata nella 2.0.3',
          text: 'Nazionali e regionali, in base al cantone, alla regione o allo Stato federato tedesco selezionato.',
        },
        {
          title: 'Avviso prima della scadenza',
          dial: ['Avviso prima', 'della scadenza'],
          version: 'Dalla 1.0.0',
          text: 'Una notifica viene inviata prima della fine della sosta, con il preavviso scelto.',
        },
        {
          title: 'Trova parcheggio',
          dial: ['Trova', 'parcheggio'],
          version: 'Dalla 1.0.0',
          text: "Trova i posti nelle vicinanze, salva i preferiti e avvia l'itinerario nell'app di navigazione.",
        },
        {
          title: 'Conto alla rovescia in tempo reale',
          dial: ['Conto alla', 'rovescia'],
          version: 'Dalla 2.0.0',
          text: 'Su iPhone, il tempo rimanente appare sulla schermata di blocco, nella Dynamic Island e in un widget.',
        },
        {
          title: 'Durata personalizzata',
          dial: ['Durata', 'personalizzata'],
          version: 'Dalla 2.0.1',
          text: "La durata può essere impostata da 5 minuti a 12 ore e 59 minuti. Anche l'ora e il giorno restano modificabili.",
        },
        {
          title: 'Il mio veicolo',
          dial: ['Il mio veicolo'],
          version: 'Migliorata nella 2.1.1',
          text: 'La posizione del veicolo viene memorizzata quando parcheggi. Puoi anche aggiungere una foto di riferimento, il piano, il numero del posto o una nota.',
        },
        {
          title: 'Mappa della comunità',
          dial: ['Mappa della', 'comunità'],
          version: 'Dalla 2.1.1',
          beforeLink: 'Segnala un posto rimosso o con informazioni errate. Dopo la verifica, la correzione viene inviata ai',
          link: 'collaboratori di OpenStreetMap',
          afterLink: 'e va a beneficio di tutti.',
        },
      ],
    },
    changelog: {
      action: 'Mostra il changelog completo',
      versions: [
        {
          title: 'Italia, Belgio, Lussemburgo, mappa della comunità e Il mio veicolo',
          text: "Aggiunti Italia, Belgio e Lussemburgo, con le rispettive regole di parcheggio e i giorni festivi. Aggiunta la mappa della comunità per segnalare o proporre un posto destinato a OpenStreetMap. «Il mio veicolo» consente ora di aggiungere una foto di riferimento, il piano, il numero del posto e una nota, conservati sul dispositivo.",
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
    countries: {
      title: "Sei paesi,<br>un'unica app.",
      text: 'Orari, arrotondamenti e giorni festivi si adattano automaticamente al paese selezionato.',
      names: ['Svizzera', 'Francia', 'Germania', 'Italia', 'Belgio', 'Lussemburgo'],
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
      ],
    },
    install: {
      title: 'Semplicemente.',
      text: "L'app costa 1 CHF. Una multa, 40 volte di più.",
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

let currentLanguage = 'fr';
const listeners = new Set();

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
  currentLanguage = next;
  document.documentElement.lang = next;
  setTranslatedText(next);

  const select = document.getElementById('language-select');
  if (select) select.value = next;

  if (options.persist !== false) {
    try {
      window.localStorage.setItem('disque-bleu-language', next);
    } catch {
      // Sans stockage, le paramètre d'URL conserve tout de même le choix.
    }
  }
  if (options.updateUrl !== false) reflectLanguageInUrl(next);

  listeners.forEach((listener) => listener(next));
  document.dispatchEvent(new CustomEvent('languagechange', { detail: { language: next } }));
  return next;
}

export function initI18n() {
  const select = document.getElementById('language-select');
  if (select && !select.dataset.i18nBound) {
    select.dataset.i18nBound = 'true';
    select.addEventListener('change', (event) => setLanguage(event.target.value));
  }

  window.addEventListener('popstate', () => {
    const query = new URLSearchParams(window.location.search).get('lang');
    setLanguage(query || 'fr', { persist: false, updateUrl: false });
  });

  return setLanguage(initialLanguage(), { persist: false });
}

export function onLanguageChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFeatureDialLabels(language = currentLanguage) {
  return TRANSLATIONS[normaliseLanguage(language)].features.items.map((item) => ({
    title: item.title,
    lines: item.dial,
  }));
}
