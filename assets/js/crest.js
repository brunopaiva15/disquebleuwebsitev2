/* ===========================================================================
   crest.js. Le croissant du disque, dessiné en SVG.

   Même géométrie que la scène 3D et que l'application : arc intérieur au
   rayon 0.42 R ouvert de ±46°, bord extérieur sur le cercle du disque, côtés
   droits TVL vers BVL. Le repère est celui du canvas de Flutter, origine au
   centre et Y vers le bas, ce qui permet de reprendre les formules telles
   quelles depuis parking_disc_painter.dart.
   =========================================================================== */

const R = 100;                 // rayon de référence du dessin
const R_IN = 0.42 * R;         // bord intérieur de la fenêtre

/* Coins de la fenêtre, et points où les côtés rencontrent le bord du disque. */
const TVL = { x: -30.21, y: 29.18 };
const TVR = { x: 30.21, y: 29.18 };
const PL = { x: -69.0, y: 72.38 };
const PR = { x: 69.0, y: 72.38 };

/* Contour du croissant. Les drapeaux d'arc suivent la convention SVG, où
   l'angle croît dans le sens horaire puisque Y descend. */
const WINDOW = [
  `M ${TVL.x} ${TVL.y}`,
  `A ${R_IN} ${R_IN} 0 0 0 ${TVR.x} ${TVR.y}`,   // arc intérieur, par le bas
  `L ${PR.x} ${PR.y}`,                            // côté droit
  `A ${R} ${R} 0 0 1 ${PL.x} ${PL.y}`,            // bord du disque
  'Z',                                            // côté gauche
].join(' ');

const rad = (deg) => (deg * Math.PI) / 180;

/** Angle d'une heure sur le cadran. Les heures tournent en sens antihoraire. */
const hourAngle = (h) => -((h % 12) * 30) - 90;

/**
 * Croissant portant l'heure demandée sous le repère.
 *
 * @param {number} hour Heure sur 24, celle qui doit apparaître au centre.
 * @param {string} title Texte de remplacement, lu par les lecteurs d'écran.
 * @returns {string} Un fragment SVG autonome.
 */
let serial = 0;

export function crest(hour, title) {
  const id = `crest-${(serial += 1)}`;
  // L'application tourne la carte de (heure % 12) * 30 + 180.
  const spin = (hour % 12) * 30 + 180;

  const ticks = [];
  for (let i = 0; i < 24; i++) {
    const a = rad(-(i * 15) - 90);
    const strong = i % 2 === 0;
    ticks.push(
      `<line x1="${(Math.cos(a) * R * 0.52).toFixed(2)}" y1="${(Math.sin(a) * R * 0.52).toFixed(2)}"` +
      ` x2="${(Math.cos(a) * R * 0.42).toFixed(2)}" y2="${(Math.sin(a) * R * 0.42).toFixed(2)}"` +
      ` stroke-width="${strong ? 2.5 : 1.2}"/>`,
    );
  }

  const numbers = [];
  for (let h = 1; h <= 24; h++) {
    const big = h <= 12;
    const a = hourAngle(h);
    const r = big ? R * 0.69 : R * 0.87;
    const x = Math.cos(rad(a)) * r;
    const y = Math.sin(rad(a)) * r;
    numbers.push(
      `<text x="0" y="0" font-size="${big ? 22 : 9.5}" font-weight="700"` +
      ` transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${a + 270})">${h}</text>`,
    );
  }

  // Le découpage et la rotation vivent sur deux groupes distincts : posés sur
  // le même élément, la transformation emporterait aussi la fenêtre et le
  // cadran sortirait du cadre.
  return `
<svg viewBox="-73 26 146 78" role="img" aria-label="${title}"
     xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="${id}"><path d="${WINDOW}"/></clipPath></defs>
  <path d="${WINDOW}" fill="#fff"/>
  <g clip-path="url(#${id})">
    <g transform="rotate(${spin})"
       fill="#101418" stroke="#101418" stroke-linecap="round"
       text-anchor="middle" dominant-baseline="central"
       font-family="Inter, Helvetica Neue, Arial, sans-serif">
      <g fill="none">${ticks.join('')}</g>
      <g stroke="none">${numbers.join('')}</g>
    </g>
  </g>
</svg>`;
}

/** Remplit tous les éléments porteurs de `data-crest`. */
export function mountCrests() {
  document.querySelectorAll('[data-crest]').forEach((el) => {
    const hour = Number(el.dataset.crest);
    if (!Number.isFinite(hour)) return;
    el.innerHTML = crest(hour, el.dataset.crestLabel || `Disque réglé sur ${hour} heures`);
  });
}
