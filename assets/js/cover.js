/* ===========================================================================
   cover.js. La présentation : le couvercle, ses quatre chapitres et le
   défilement qui les fait passer.

   Le défilement joue le rôle du doigt dans l'onboarding de l'app
   (lib/screens/onboarding_screen.dart) : un écran de défilement par
   chapitre, et la position entre deux chapitres mélange leurs états, comme
   `_along` le fait entre deux pages. Le disque avance de 8:00 à 9:30 en
   quittant l'accueil, la durée autorisée apparaît, le rappel s'allume, puis
   le plan prend la place du cadran.
   =========================================================================== */

import { CoverGeometry, paintCover } from './disc.js';

const BAR = 64;
const CHAPTERS = 4;
const RELAX = 1;
const ALERT = 2;
const FINDER = 3;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - (1 - t) ** 2;
const easeOutCubic = (t) => 1 - (1 - t) ** 3;

/** La valeur d'une propriété entre deux chapitres, selon la position. */
function along(p, valueOf) {
  const i = Math.floor(p);
  const t = p - i;
  const a = valueOf(clamp(i, 0, CHAPTERS - 1));
  const b = valueOf(clamp(i + 1, 0, CHAPTERS - 1));
  return a + (b - a) * t;
}

/** Le poids d'un chapitre : 1 dessus, 0 à un chapitre de distance. */
const weight = (p, i) => clamp(1 - Math.abs(p - i));

/* ------------------------------------------------- TITRES QUI SE LÈVENT -- */

/* Découpe un titre en lignes, telles que le navigateur les a posées, pour
   les lever l'une après l'autre (RisingTitle). Le texte reste le même pour
   un lecteur d'écran. */
function splitLines(title) {
  // Déjà découpé : le texte entier est dans l'étiquette. Retraduit, i18n.js
  // a remis du texte brut, qui fait foi.
  const source = title.querySelector('.rise-line')
    ? title.getAttribute('aria-label')
    : title.textContent;
  const text = source.replace(/\s+/g, ' ').trim();
  title.textContent = '';
  const words = text.split(' ').map((word, i) => {
    const span = document.createElement('span');
    span.textContent = word;
    if (i > 0) title.append(' ');
    title.append(span);
    return span;
  });

  const lines = [];
  let top = null;
  words.forEach((span) => {
    if (span.offsetTop !== top) {
      lines.push([]);
      top = span.offsetTop;
    }
    lines[lines.length - 1].push(span.textContent);
  });

  title.textContent = '';
  title.setAttribute('aria-label', text);
  lines.forEach((line) => {
    const outer = document.createElement('span');
    outer.className = 'rise-line';
    outer.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.className = 'rise-line__inner';
    inner.textContent = line.join(' ');
    outer.append(inner);
    title.append(outer);
  });
}

function rise(chapter) {
  const lines = chapter.querySelectorAll('.rise-line__inner');
  const body = chapter.querySelectorAll('.chapter__text, .chapter__stores');
  const easing = 'cubic-bezier(0.33, 1, 0.68, 1)';
  lines.forEach((line, i) => {
    line.animate(
      [{ transform: 'translateY(105%)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 700, delay: Math.min(i * 130, 420), easing, fill: 'backwards' },
    );
  });
  body.forEach((el) => {
    el.animate(
      [{ transform: 'translateY(10px)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 600, delay: 240, easing, fill: 'backwards' },
    );
  });
}

/* ------------------------------------------------------------- MONTAGE -- */

export function mountCover(section) {
  const frame = section.querySelector('.cover__frame');
  const canvas = section.querySelector('.cover__canvas');
  const ctx = canvas.getContext('2d');
  const chapters = [...section.querySelectorAll('.chapter')];
  const titles = chapters.map((chapter) => chapter.querySelector('[data-rise]'));
  const foot = section.querySelector('.cover__foot');
  const dots = [...section.querySelectorAll('[data-goto]')];
  const next = section.querySelector('[data-next]');
  const tags = {
    arrival: section.querySelector('[data-tag="arrival"]'),
    reminder: section.querySelector('[data-tag="reminder"]'),
  };

  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  let width = 0;
  let height = 0;
  let ratio = 1;
  let geometry = null;
  let current = -1;
  let intro = reducedQuery.matches ? 0 : 1;
  let introStart = null;
  let queued = false;

  /** La position dans la présentation, de 0 (accueil) à 3 (le plan). */
  function position() {
    const scrolled = -section.getBoundingClientRect().top;
    return clamp(scrolled / Math.max(1, frame.clientHeight), 0, CHAPTERS - 1);
  }

  function scrollToChapter(i) {
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + i * frame.clientHeight,
      behavior: reducedQuery.matches ? 'auto' : 'smooth',
    });
  }

  /* La mise en page de l'onboarding : `_tallLayout` en portrait (le disque
     en haut, le texte dessous), `_wideLayout` au-delà (le disque à gauche,
     le texte à droite). Les textes sont mesurés pour que le plus long tienne
     sans chevaucher le disque, quelle que soit la langue. */
  function layout() {
    width = frame.clientWidth;
    height = frame.clientHeight;
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    const wide = width >= 900 && width > height * 1.15;
    const textWidth = wide
      ? Math.min(width * 0.5 - 88, 560)
      : Math.min(width, 560) - 48;
    section.style.setProperty('--text-width', `${textWidth}px`);
    titles.forEach(splitLines);
    const tallest = Math.max(...chapters.map((chapter) => chapter.offsetHeight));
    const footHeight = foot.offsetHeight;

    if (wide) {
      const left = width * 0.5;
      const usable = height - BAR;
      const r = Math.min(left * 0.5, usable * 0.5, 480);
      geometry = new CoverGeometry(left / 2 + 16, BAR + usable / 2 - r * 0.62, r);
      const block = tallest + 40 + footHeight;
      const textTop = BAR + Math.max(24, (usable - block) / 2);
      section.style.setProperty('--text-left', `${left + 24}px`);
      section.style.setProperty('--text-top', `${textTop}px`);
      section.style.setProperty('--foot-left', `${left + 4}px`);
      section.style.setProperty('--foot-width', `${textWidth + 40}px`);
      foot.style.top = `${textTop + tallest + 24}px`;
      foot.style.bottom = 'auto';
      foot.style.justifyItems = 'start';
    } else {
      // Sur un écran court, le disque rapetisse plutôt que de pousser le
      // texte sous les boutons.
      const fit = (height - footHeight - 16 - BAR - 52 - 32 - tallest) / 0.75;
      const r = Math.max(Math.min(width * 0.58, height * 0.27, fit), 64);
      // La fenêtre, l'étiquette d'heure au-dessus de la flèche (52) et le
      // plus long des textes forment un bloc, centré dans la place libre.
      const block = 52 + r * 0.75 + 32 + tallest;
      const free = height - footHeight - 16 - BAR - block;
      const arrowTop = BAR + 52 + Math.max(free, 0) * 0.5;
      geometry = new CoverGeometry(width / 2, arrowTop - r * 0.25, r);
      section.style.setProperty('--text-left', `${(width - textWidth) / 2}px`);
      section.style.setProperty('--text-top', `${geometry.windowBottom + 32}px`);
      section.style.setProperty('--foot-left', '0px');
      section.style.setProperty('--foot-width', `${width}px`);
      foot.style.top = '';
      foot.style.bottom = '';
      foot.style.justifyItems = '';
    }
    current = -1;
    paint();
  }

  function placeTag(tag, w) {
    if (!w) {
      tag.style.opacity = '0';
      return;
    }
    const tagWidth = tag.offsetWidth;
    const y = geometry.arrowTop - 46 + 8 * (1 - w);
    tag.style.opacity = String(w);
    tag.style.transform = `translate(${geometry.cx - tagWidth / 2}px, ${y}px)`;
  }

  function paint(now = performance.now()) {
    queued = false;
    if (!geometry) return;
    const reduced = reducedQuery.matches;

    // À l'ouverture, le disque arrive en tournant jusqu'à 8:00.
    if (intro > 0) {
      if (introStart === null) introStart = now;
      intro = 1 - easeOutCubic(clamp((now - introStart) / 1200));
      if (intro > 0) request();
    }

    const p = position();
    // Plus rien à peindre quand la feuille recouvre tout le cadre.
    if (section.getBoundingClientRect().bottom > frame.clientHeight) {
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      paintCover(ctx, width, height, geometry, {
        hour: along(p, (i) => (i === 0 ? 8 : 9.5)) - 1.5 * intro,
        allowedHours: 1,
        sector: along(p, (i) => (i === 0 ? 0 : 1)),
        map: along(p, (i) => (i === FINDER ? 1 : 0)),
        reminder: along(p, (i) => (i === ALERT ? 1 : 0)),
      }, { dark: darkQuery.matches, ratio });
    }

    placeTag(tags.arrival, easeOut(weight(p, RELAX)));
    placeTag(tags.reminder, easeOut(weight(p, ALERT)));

    chapters.forEach((chapter, i) => {
      const d = p - i;
      // Un texte s'efface avant que le suivant n'arrive : les deux ne se
      // croisent jamais à mi-chemin.
      const fade = clamp(1 - Math.abs(d) * 2.4);
      chapter.style.opacity = String(fade);
      chapter.style.transform = reduced ? '' : `translateY(${-d * 40}px)`;
    });

    const nearest = Math.round(p);
    if (nearest !== current) {
      const first = current === -1;
      current = nearest;
      chapters.forEach((chapter, i) => chapter.classList.toggle('is-current', i === current));
      dots.forEach((dot, i) => {
        if (i === current) dot.setAttribute('aria-current', 'step');
        else dot.removeAttribute('aria-current');
      });
      if (!reduced && (!first || intro > 0)) rise(chapters[current]);
    }
  }

  function request() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(paint);
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => scrollToChapter(Number(dot.dataset.goto)));
  });

  // Un lien atteint au clavier dans un chapitre effacé : on y amène l'écran.
  chapters.forEach((chapter, i) => {
    chapter.addEventListener('focusin', () => {
      if (i !== current) scrollToChapter(i);
    });
  });

  next.addEventListener('click', (event) => {
    if (current < CHAPTERS - 1) {
      event.preventDefault();
      scrollToChapter(current + 1);
    }
  });

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', layout);
  darkQuery.addEventListener('change', request);
  document.addEventListener('languagechange', layout);
  // Les chiffres du cadran et la mesure des textes attendent la police.
  document.fonts?.ready.then(layout);

  layout();
}
