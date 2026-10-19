/* ===========================================================================
   app.js. Mise en route : langue, liens des magasins, présentation, barre et
   apparitions de la feuille.
   =========================================================================== */

import { mountCover } from './cover.js';
import { initI18n } from './i18n.js';
import { STORES } from './seo.js';

/* Les adresses des fiches vivent dans seo.js : les liens de la page et les
   données structurées ne peuvent pas diverger. */
function wireStores() {
  document.querySelectorAll('[data-store]').forEach((link) => {
    const url = STORES[link.dataset.store];
    if (url) link.href = url;
  });
}

/* La barre est blanche sur le bleu et prend l'encre dès que la feuille passe
   dessous. */
function watchBar() {
  const bar = document.querySelector('.bar');
  const sheet = document.querySelector('.sheet');
  let queued = false;
  const update = () => {
    queued = false;
    bar.classList.toggle('is-on-sheet', sheet.getBoundingClientRect().top <= bar.offsetHeight);
  };
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
}

/* Les blocs de la feuille apparaissent en montant, une fois, les voisins un
   peu après les premiers. */
function watchLifts() {
  const items = [...document.querySelectorAll('[data-lift]')];
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-lit'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((entry, i) => {
        entry.target.style.setProperty('--wait', `${Math.min(i * 60, 300)}ms`);
        entry.target.classList.add('is-lit');
        observer.unobserve(entry.target);
      });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach((item) => observer.observe(item));
}

initI18n();
wireStores();
mountCover(document.querySelector('.cover'));
watchBar();
watchLifts();
