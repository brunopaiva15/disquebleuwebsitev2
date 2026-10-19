/* ===========================================================================
   disc.js. Le couvercle de l'onboarding, dessiné dans un canvas.

   Tout l'écran est le disque bleu, percé de la fenêtre en croissant : il n'y
   a pas de disque posé sur un fond, le fond est le disque. Par la fenêtre on
   voit le cadran blanc qui tourne, la durée autorisée en orange, le rappel en
   rouge, puis le plan des places qui prend la place du cadran.

   C'est une transcription de l'application, à garder alignée sur elle :
   - CoverGeometry et _CoverPainter dans
     lib/screens/onboarding/onboarding_objects.dart (fenêtre, ombre, flèche,
     plan) ;
   - les graduations et les heures, qui y reprennent _HoursPainter de
     lib/widgets/parking_disc_painter.dart.
   Si le disque change dans l'app, ce sont les valeurs ci-dessous qu'il faut
   reprendre.
   =========================================================================== */

export const COLORS = {
  blue: '#1565c0',
  blueTop: '#115ab3',
  blueLight: '#42a5f5',
  orange: '#ff9800',
  red: '#d32f2f',
  shadow: '5, 30, 80',
};

/** Où se trouve le disque blanc sous le couvercle, et donc la fenêtre. */
export class CoverGeometry {
  constructor(cx, cy, r) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
  }

  /** Le haut de la flèche, juste au-dessus de la fenêtre. */
  get arrowTop() { return this.cy + this.r * 0.25; }

  /** Le bas du disque blanc, donc de ce qu'on voit de la fenêtre. */
  get windowBottom() { return this.cy + this.r; }

  /** La largeur visible de la fenêtre, là où elle croise le disque. */
  get windowWidth() { return this.r * 1.375; }

  get windowBounds() {
    const half = this.windowWidth / 2;
    return {
      left: this.cx - half,
      top: this.cy + this.r * 0.29,
      right: this.cx + half,
      bottom: this.windowBottom,
    };
  }

  /** Le croissant de `_CoverPainter._buildCrescentWindow`, sans la coupe
      par le disque : celle-ci se fait par un second découpage. */
  crescent() {
    const { cx, cy, r } = this;
    const topR = r * 0.42;
    const halfWidth = r * 0.92;
    const bottomY = cy + r * 0.98;
    const topAngle = (44 * Math.PI) / 180;
    const arcHeight = r * 0.14;
    const bottomR = (halfWidth * halfWidth + arcHeight * arcHeight) / (2 * arcHeight);
    const bcx = cx;
    const bcy = bottomY + arcHeight - bottomR;
    const dy = bottomR - arcHeight;
    const start = Math.atan2(dy, halfWidth);
    const end = Math.atan2(dy, -halfWidth);

    const path = new Path2D();
    // Arc du haut, de gauche à droite en passant par le bas du petit cercle.
    path.arc(cx, cy, topR, Math.PI - topAngle, topAngle, true);
    // Arc du bas, de droite à gauche.
    path.arc(bcx, bcy, bottomR, start, end, false);
    path.closePath();
    return path;
  }

  disc() {
    const path = new Path2D();
    path.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
    return path;
  }
}

/* Les chiffres sont mis en page une fois par taille. */
function numberFont(size) {
  return `700 ${size}px Inter, "Helvetica Neue", Arial, sans-serif`;
}

function paintDial(ctx, r) {
  ctx.strokeStyle = '#000';
  ctx.lineCap = 'round';
  for (let i = 0; i < 24; i += 1) {
    const a = ((-(i * 15) - 90) * Math.PI) / 180;
    const x = Math.cos(a);
    const y = Math.sin(a);
    ctx.lineWidth = i % 2 === 0 ? r * 0.025 : r * 0.012;
    ctx.beginPath();
    ctx.moveTo(x * r * 0.52, y * r * 0.52);
    ctx.lineTo(x * r * 0.42, y * r * 0.42);
    ctx.stroke();
  }

  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const number = (value, radius, size) => {
    const h12 = value <= 12 ? value : value - 12;
    const a = ((-(h12 * 30) - 90) * Math.PI) / 180;
    ctx.save();
    ctx.translate(radius * Math.cos(a), radius * Math.sin(a));
    ctx.rotate(a + Math.PI / 2 + Math.PI);
    ctx.font = numberFont(size);
    ctx.fillText(String(value), 0, size * 0.06);
    ctx.restore();
  };
  for (let v = 13; v <= 24; v += 1) number(v, r * 0.87, r * 0.085);
  for (let v = 1; v <= 12; v += 1) number(v, r * 0.69, r * 0.22);
}

function pin(ctx, x, y, r) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.blue;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.82, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `800 ${r * 1.1}px Inter, "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', x, y + r * 0.06);
}

/** Un plan de quartier vu par la fenêtre : des rues, un parc, la rivière,
    les tronçons en zone bleue et leurs places, votre position. */
function paintMap(ctx, w, h, dark) {
  const unit = Math.min(w, h);
  const at = (x, y) => [x * w, y * h];

  ctx.fillStyle = dark ? '#1c2635' : '#edf1f5';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = dark ? '#1f3a2c' : '#d3edd8';
  ctx.beginPath();
  ctx.roundRect(0.62 * w, 0.32 * h, 0.22 * w, 0.32 * h, 0.06 * unit);
  ctx.fill();

  ctx.strokeStyle = dark ? '#1b3550' : '#cfe4f7';
  ctx.lineWidth = 0.12 * unit;
  ctx.beginPath();
  ctx.moveTo(-0.05 * w, 0.92 * h);
  ctx.bezierCurveTo(0.3 * w, 0.78 * h, 0.6 * w, 1.02 * h, 1.05 * w, 0.88 * h);
  ctx.stroke();

  const line = (a, b) => {
    ctx.beginPath();
    ctx.moveTo(...a);
    ctx.lineTo(...b);
    ctx.stroke();
  };

  ctx.lineCap = 'round';
  ctx.lineWidth = 0.07 * unit;
  ctx.strokeStyle = dark ? '#2e3a4d' : '#fff';
  [
    [at(-0.1, 0.62), at(1.1, 0.56)],
    [at(0.36, -0.1), at(0.42, 1.1)],
    [at(0.58, 0.2), at(0.54, 1.1)],
    [at(0.12, -0.1), at(0.2, 1.1)],
    [at(0.42, 0.28), at(1.1, 0.24)],
  ].forEach(([a, b]) => line(a, b));

  ctx.strokeStyle = dark ? 'rgba(66, 165, 245, 0.6)' : 'rgba(66, 165, 245, 0.5)';
  line(at(0.42, 0.6), at(0.8, 0.58));
  line(at(0.39, 0.3), at(0.405, 0.58));
  line(at(0.6, 0.255), at(0.9, 0.245));

  [at(0.62, 0.59), at(0.4, 0.42), at(0.76, 0.25)].forEach(([x, y]) => pin(ctx, x, y, unit * 0.11));

  const [mx, my] = at(0.2, 0.5);
  ctx.fillStyle = 'rgba(66, 165, 245, 0.22)';
  ctx.beginPath();
  ctx.arc(mx, my, unit * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(mx, my, unit * 0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.blue;
  ctx.beginPath();
  ctx.arc(mx, my, unit * 0.042, 0, Math.PI * 2);
  ctx.fill();
}

/* Le plan ne change pas d'une image à l'autre : il est peint une fois par
   taille de fenêtre, puis posé avec son opacité. */
let mapCache = null;

function mapLayer(w, h, dark, ratio) {
  const key = `${Math.round(w)}x${Math.round(h)}@${ratio}:${dark}`;
  if (mapCache?.key === key) return mapCache.canvas;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(w * ratio);
  canvas.height = Math.ceil(h * ratio);
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  paintMap(ctx, w, h, dark);
  mapCache = { key, canvas };
  return canvas;
}

/* Un secteur depuis le centre, comme `Path.arcTo` à partir du centre. */
function sector(ctx, g, start, sweep) {
  ctx.beginPath();
  ctx.moveTo(g.cx, g.cy);
  ctx.arc(g.cx, g.cy, g.r * 1.3, start, start + sweep, sweep < 0);
  ctx.closePath();
  ctx.fill();
}

/**
 * Peint le couvercle.
 *
 * @param {CanvasRenderingContext2D} ctx contexte déjà mis à l'échelle
 * @param {number} width  largeur en pixels CSS
 * @param {number} height hauteur en pixels CSS
 * @param {CoverGeometry} g
 * @param {object} state  hour, allowedHours, sector, map, reminder (0 à 1)
 * @param {object} options dark, ratio
 */
export function paintCover(ctx, width, height, g, state, options = {}) {
  const {
    hour = 8, allowedHours = 1, sector: sectorAlpha = 0, map = 0, reminder = 0,
  } = state;
  const { dark = false, ratio = 1 } = options;
  const { r } = g;

  // Le bleu de l'écran principal, à peine plus sombre en haut.
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, COLORS.blueTop);
  sky.addColorStop(0.6, COLORS.blue);
  sky.addColorStop(1, COLORS.blue);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  // Deux découpes successives : le croissant, puis le disque.
  ctx.clip(g.crescent());
  ctx.clip(g.disc());

  const b = g.windowBounds;
  ctx.fillStyle = '#fff';
  ctx.fillRect(b.left - 2, b.top - 2, b.right - b.left + 4, b.bottom - b.top + 4);

  if (sectorAlpha > 0) {
    ctx.fillStyle = `rgba(255, 152, 0, ${0.4 * sectorAlpha})`;
    sector(ctx, g, Math.PI / 2, -(allowedHours * Math.PI) / 6);
  }
  if (reminder > 0) {
    // Les dix dernières minutes, au bout de la durée autorisée.
    const last = 10 / 60;
    ctx.fillStyle = `rgba(211, 47, 47, ${0.55 * reminder})`;
    sector(ctx, g, Math.PI / 2 - ((allowedHours - last) * Math.PI) / 6, -(last * Math.PI) / 6);
  }

  ctx.save();
  ctx.translate(g.cx, g.cy);
  ctx.rotate(((hour % 12) * Math.PI) / 6 + Math.PI);
  paintDial(ctx, r);
  ctx.restore();

  if (map > 0) {
    const w = b.right - b.left + 4;
    const h = b.bottom - b.top + 4;
    ctx.globalAlpha = Math.min(1, map);
    ctx.drawImage(mapLayer(w, h, dark, ratio), b.left - 2, b.top - 2, w, h);
    ctx.globalAlpha = 1;
  }

  // Le couvercle jette son ombre dans la fenêtre : le disque est dessous.
  // L'ombre est dessinée par `shadowBlur`, depuis une forme placée hors
  // champ : la forme ne se voit pas, seule son ombre tombe dans la fenêtre.
  // Les décalages et le flou d'ombre ignorent la transformation : ils
  // s'expriment en pixels de l'écran, d'où le facteur `ratio`.
  const far = width + height + r * 4;
  ctx.shadowColor = `rgba(${COLORS.shadow}, 0.45)`;
  ctx.shadowBlur = r * 0.1 * ratio;
  ctx.shadowOffsetX = far * ratio;
  ctx.shadowOffsetY = r * 0.03 * ratio;
  ctx.fillStyle = '#000';
  const cover = (inner) => {
    const path = new Path2D();
    path.rect(-r * 2, -r * 2, width + r * 4, height + r * 4);
    path.addPath(inner);
    ctx.save();
    ctx.translate(-far, 0);
    ctx.fill(path, 'evenodd');
    ctx.restore();
  };
  cover(g.crescent());
  cover(g.disc());
  ctx.restore();

  // La flèche.
  const arrow = r * 0.12;
  const tip = g.arrowTop;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(g.cx, tip + arrow);
  ctx.lineTo(g.cx - arrow / 2, tip);
  ctx.lineTo(g.cx + arrow / 2, tip);
  ctx.closePath();
  ctx.fill();
}
