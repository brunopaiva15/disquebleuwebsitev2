/* ===========================================================================
   app.js. Pilotage : caméra au scroll, apparitions, horloge, navigation.
   =========================================================================== */

import { mountScene } from './scene.js';
import { mountCrests } from './crest.js';

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
/* Adoucissement en cosinus : ni départ ni arrivée brusques. */
const ease = (t) => 0.5 - Math.cos(Math.PI * clamp(t)) / 2;

/* ------------------------------------------------------- LIENS STORES -- */

const STORES = {
  ios: 'https://apps.apple.com/app/id6756579975',
  android: 'https://play.google.com/store/apps/details?id=ch.vergasta.disquebleusuisse',
};

function wireStores() {
  document.querySelectorAll('[data-store]').forEach((el) => {
    const url = STORES[el.dataset.store];
    if (url) el.href = url;
  });
}

/* ------------------------------------------------------------ CAMÉRA -- */

/* Le disque traverse le cadre au fil de la lecture. Il arrive au-dessus de la
   tête, descend vers la droite en s'ouvrant pour qu'on lise l'heure, puis
   s'éloigne vers le bas à droite. Un arrêt par scène, plus un pour la sortie. */
const STOPS = [
  // Au-dessus de la tête, énorme, coupé par le haut du cadre.
  { tilt: 1.30, camY: -1.60, camZ: 1.70, aimY: 0.15, fov: 0.95,
    radius: 3.4, target: 0.15, panX: 0.00, panZ: 0.00, spin: 0.30, haze: 1.00 },

  // Il descend à droite et s'ouvre : la fenêtre devient lisible.
  { tilt: 1.02, camY: -0.75, camZ: 2.35, aimY: -0.05, fov: 1.00,
    radius: 2.10, target: -0.30, panX: 1.05, panZ: -0.35, spin: 2.60, haze: 0.86 },

  // Il bascule vers le bas à droite. Il grandit en s'écartant : le cadre doit
  // continuer de le couper, on ne voit jamais le croissant en entier.
  { tilt: 0.78, camY: -0.30, camZ: 2.75, aimY: -0.20, fov: 1.05,
    radius: 3.00, target: -1.05, panX: 1.70, panZ: -0.55, spin: 5.40, haze: 0.72 },

  // Il balaie le bas du cadre en s'ouvrant encore : toujours coupé, jamais
  // réduit à un éclat dans un coin.
  { tilt: 0.62, camY: -0.10, camZ: 2.20, aimY: -0.34, fov: 1.05,
    radius: 3.60, target: -1.05, panX: 1.55, panZ: -0.10, spin: 8.10, haze: 0.58 },
];

const TAU = Math.PI * 2;

/* Heure de démonstration, la même que dans le relevé de la deuxième scène.
   Une heure fixe et diurne vaut mieux que l'heure courante, qui donnait des
   exemples absurdes le soir. */
const DEMO_HOUR = 9;

/**
 * Rotation qui amène une heure sous le repère de la fenêtre.
 *
 * L'application tourne la carte de `(heure % 12) * 30° + 180°`
 * (parking_disc_painter.dart). Ici c'est la texture qui pivote sous une
 * fenêtre fixe : tourner les coordonnées de lecture de +A revient à tourner
 * le dessin de -A, d'où le signe.
 */
function spinFor(hour) {
  return -(((hour % 12) * 30 + 180) * Math.PI) / 180;
}

/* La deuxième scène affiche cette heure et la garde sur toute sa traversée :
   le mouvement y vient de la caméra, pas du cadran. On retient le tour le
   plus proche de la valeur prévue pour que le disque ne se dévide pas d'un
   coup en y arrivant. */
function syncDisc(hour = DEMO_HOUR) {
  const want = spinFor(hour);
  const near = want + TAU * Math.round((STOPS[2].spin - want) / TAU);
  STOPS[1].spin = near;
  STOPS[2].spin = near;
  STOPS[3].spin = near + 2.7;
}

/* Le carton se tient autour de 0.71 R du côté opposé au moyeu : on en déduit
   la hauteur du moyeu pour poser la fenêtre là où on la veut dans le cadre. */
const hub = (tilt, radius, target) => target + Math.sin(tilt) * 0.71 * radius;

/* La projection fixe l'ouverture verticale : en portrait, le champ horizontal
   se referme et le croissant sort du cadre par les côtés. On réduit alors le
   rayon pour que sa forme reste lisible. */
const fit = () => clamp(window.innerWidth / window.innerHeight / 1.55, 0.44, 1);

function mountCamera(scene) {
  const scenes = [...document.querySelectorAll('.scene')];
  if (!scenes.length) return;

  let travel = 0;   // position sur la timeline, en numéro de scène fractionnaire
  let shown = 0;    // valeur lissée effectivement envoyée au shader
  let drift = 0;

  const measure = () => {
    let t = 0;
    for (let i = 0; i < scenes.length; i++) {
      const el = scenes[i];
      const box = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      const p = span > 0 ? clamp(-box.top / span) : (box.top <= 0 ? 1 : 0);

      // Le texte entre au début de la piste et sort avant que le bloc collant
      // ne se décroche, sinon il glisse sous le bandeau.
      const enter = i === 0 ? 1 : clamp(p / 0.08);
      el.style.setProperty('--vis', String(Math.min(enter, clamp((0.88 - p) / 0.1))));

      if (box.top > 0) break;                 // scène pas encore atteinte
      t = i + p;
    }
    travel = t;
  };

  const sample = (u, key) => {
    const i = clamp(Math.floor(u), 0, STOPS.length - 2);
    return lerp(STOPS[i][key], STOPS[i + 1][key], ease(u - i));
  };

  const frame = () => {
    shown = reduced ? travel : lerp(shown, travel, 0.075);
    if (!reduced) drift += 0.0005;            // souffle, pas moteur

    if (!scene) { requestAnimationFrame(frame); return; }

    const span = fit();
    const tilt = sample(shown, 'tilt');
    const radius = sample(shown, 'radius') * span;
    // En portrait le texte occupe toute la largeur : le disque doit remonter
    // pour lui laisser le bas du cadre. Le décalage suit le même facteur.
    const target = sample(shown, 'target') + (1 - span) * 1.5;

    scene.set('uTilt', tilt);
    scene.set('uRadius', radius);
    scene.set('uCenterY', hub(tilt, radius, target));
    // Le déport latéral suit la même échelle que le rayon : sans cela le
    // disque sort entièrement du cadre sur un écran étroit.
    scene.set('uPanX', sample(shown, 'panX') * span);
    scene.set('uPanZ', sample(shown, 'panZ'));
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

/* ------------------------------------------------------------ DÉPART -- */

function boot() {
  wireStores();
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Sans WebGL, le dégradé CSS du canvas tient lieu de ciel et la page reste
  // entièrement lisible : la mesure du défilement tourne quand même.
  syncDisc();

  const scene = mountScene(document.getElementById('stage'));
  if (!scene) root.classList.add('no-webgl');
  mountCamera(scene);

  mountLifts();
  mountTone();
  mountCrests();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
