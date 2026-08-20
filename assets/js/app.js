/* ===========================================================================
   app.js. Pilotage : caméra au scroll, apparitions, horloge, navigation.
   =========================================================================== */

import { mountScene } from './scene.js';

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
/* Adoucissement en cosinus : ni départ ni arrivée brusques. */
const ease = (t) => 0.5 - Math.cos(Math.PI * clamp(t)) / 2;

/* ------------------------------------------------------- LIENS STORES -- */

const STORES = {
  /* Déduit de `applicationId` dans android/app/build.gradle.kts. */
  android: 'https://play.google.com/store/apps/details?id=ch.vergasta.disquebleusuisse',
  /* TODO : remplacer par https://apps.apple.com/ch/app/id<IDENTIFIANT> une fois
     la fiche App Store publiée. En attendant, la recherche évite un lien mort. */
  ios: 'https://apps.apple.com/ch/search?term=disque%20bleu',
};

function wireStores() {
  document.querySelectorAll('[data-store]').forEach((el) => {
    const url = STORES[el.dataset.store];
    if (url) el.href = url;
  });
}

/* ------------------------------------------------------------ CAMÉRA -- */

/* Un arrêt par scène, plus un dernier pour la sortie. Le moyeu du disque
   n'est pas réglé ici : il est déduit de l'inclinaison et du rayon pour que
   la fenêtre reste à la hauteur voulue (voir `hub` plus bas). */
const STOPS = [
  { tilt: 1.30, camY: -1.60, camZ: 1.70, aimY: 0.15, fov: 0.95, radius: 3.4, target: 0.15, spin: 0.35, haze: 1.00 },
  { tilt: 1.22, camY: -1.30, camZ: 1.45, aimY: 0.05, fov: 0.88, radius: 2.9, target: 0.05, spin: 2.10, haze: 0.85 },
  { tilt: 1.42, camY: -1.85, camZ: 1.95, aimY: 0.25, fov: 1.00, radius: 4.2, target: 0.20, spin: 4.60, haze: 0.70 },
  { tilt: 1.50, camY: -2.20, camZ: 2.30, aimY: 0.35, fov: 1.05, radius: 5.0, target: 0.30, spin: 6.20, haze: 0.55 },
];

/* Le carton se tient autour de 0.71 R du côté opposé au moyeu : on en déduit
   la hauteur du moyeu pour poser la fenêtre là où on la veut dans le cadre. */
const hub = (tilt, radius, target) => target + Math.sin(tilt) * 0.71 * radius;

/* La projection fixe l'ouverture verticale : en portrait, le champ horizontal
   se referme et le croissant sort du cadre par les côtés. On réduit alors le
   rayon pour que sa forme reste lisible. */
const fit = () => clamp(window.innerWidth / window.innerHeight / 1.55, 0.44, 1);

function mountCamera(scene) {
  const scenes = [...document.querySelectorAll('.scene')];
  if (!scene || !scenes.length) return;

  let travel = 0;   // position sur la timeline, en numéro de scène fractionnaire
  let shown = 0;    // valeur lissée effectivement envoyée au shader
  let drift = 0;

  const measure = () => {
    let t = 0;
    for (let i = 0; i < scenes.length; i++) {
      const el = scenes[i];
      const box = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      if (box.top > 0) break;                 // scène pas encore atteinte
      t = i + (span > 0 ? clamp(-box.top / span) : 1);
    }
    travel = t;
  };

  const sample = (u, key) => {
    const i = clamp(Math.floor(u), 0, STOPS.length - 2);
    return lerp(STOPS[i][key], STOPS[i + 1][key], ease(u - i));
  };

  const frame = () => {
    shown = reduced ? travel : lerp(shown, travel, 0.075);
    if (!reduced) drift += 0.0016;            // le disque ne s'immobilise jamais

    const tilt = sample(shown, 'tilt');
    const radius = sample(shown, 'radius') * fit();
    const target = sample(shown, 'target');

    scene.set('uTilt', tilt);
    scene.set('uRadius', radius);
    scene.set('uCenterY', hub(tilt, radius, target));
    scene.set('uCamY', sample(shown, 'camY'));
    scene.set('uCamZ', sample(shown, 'camZ'));
    scene.set('uAimY', sample(shown, 'aimY'));
    scene.set('uFov', sample(shown, 'fov'));
    scene.set('uHaze', sample(shown, 'haze'));
    scene.set('uSpin', sample(shown, 'spin') + drift);

    requestAnimationFrame(frame);
  };

  window.addEventListener('scroll', measure, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  measure();
  requestAnimationFrame(frame);
}

/* --------------------------------------------------- TEXTE DES SCÈNES -- */

/* Le texte d'une scène ne s'affiche que pendant qu'elle occupe la fenêtre. */
function mountSceneCopy() {
  const scenes = [...document.querySelectorAll('.scene')];
  if (!scenes.length) return;

  if (!('IntersectionObserver' in window)) {
    scenes.forEach((s) => s.classList.add('is-lit'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle('is-lit', e.isIntersecting)),
    { rootMargin: '-25% 0px -25% 0px' },
  );
  scenes.forEach((s) => io.observe(s));
}

/* ------------------------------------------------------- APPARITIONS -- */

function mountLifts() {
  const items = [...document.querySelectorAll('[data-lift]')];
  if (!items.length) return;

  // Les éléments d'un même groupe se relaient au lieu d'arriver ensemble.
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    [...group.children].forEach((child, i) =>
      child.style.setProperty('--wait', `${i * 60}ms`),
    );
  });

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-lit'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-lit');
        io.unobserve(e.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  items.forEach((el) => io.observe(el));
}

/* ----------------------------------------------------- FOND CLAIR ---- */

/* Les rails de la grille s'inversent quand une section claire est sous eux. */
function mountTone() {
  const light = [...document.querySelectorAll('.leaf--paper')];
  if (!light.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      const any = entries.some((e) => e.isIntersecting);
      if (any) document.body.classList.add('is-light');
      else if (!light.some((el) => {
        const b = el.getBoundingClientRect();
        return b.top < window.innerHeight * 0.5 && b.bottom > window.innerHeight * 0.5;
      })) document.body.classList.remove('is-light');
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );
  light.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------- HORLOGE -- */

/**
 * Applique la règle suisse : l'heure portée sur le disque est arrondie à la
 * demi-heure suivante, et la durée court à partir de cette heure-là.
 */
function mountClock() {
  const now = [...document.querySelectorAll('[data-clock-now]')];
  const disc = [...document.querySelectorAll('[data-clock-disc]')];
  const until = [...document.querySelectorAll('[data-clock-until]')];
  if (!now.length && !disc.length) return;

  const fmt = (d) =>
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const write = (els, text) => els.forEach((el) => (el.textContent = text));

  const tick = () => {
    const t = new Date();
    const d = new Date(t);
    d.setSeconds(0, 0);
    d.setMinutes(t.getMinutes() < 30 ? 30 : 60);   // 14h02 → 14h30 ; 14h41 → 15h00
    write(now, fmt(t));
    write(disc, fmt(d));
    write(until, fmt(new Date(d.getTime() + 3600000)));
  };

  tick();
  setInterval(tick, 10000);
}

/* ------------------------------------------------------------ DÉPART -- */

function boot() {
  wireStores();
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const scene = mountScene(document.getElementById('stage'));
  if (scene) mountCamera(scene);
  else root.classList.add('no-webgl');   // le dégradé CSS du canvas fait office de ciel

  mountSceneCopy();
  mountLifts();
  mountTone();
  mountClock();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
