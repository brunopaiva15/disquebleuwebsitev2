/* ===========================================================================
   feature-dial.js. Variante du cadran 3D dédiée aux fonctionnalités.

   Les neuf intitulés reprennent exactement l'ordre de la liste HTML. Ils
   remplacent les heures sur la couronne blanche et passent sous le repère au
   fil du défilement.
   =========================================================================== */

export const FEATURE_LABELS = [
  { title: "Calcul de l'heure à afficher", lines: ["Calcul de l'heure", 'à afficher'] },
  { title: 'Règles locales et exceptions', lines: ['Règles locales', 'et exceptions'] },
  { title: 'Jours fériés', lines: ['Jours fériés'] },
  { title: "Alerte avant l'échéance", lines: ['Alerte avant', "l'échéance"] },
  { title: 'Trouver un parking', lines: ['Trouver', 'un parking'] },
  { title: 'Compte à rebours en direct', lines: ['Compte à rebours', 'en direct'] },
  { title: 'Durée personnalisée', lines: ['Durée', 'personnalisée'] },
  { title: 'Mon véhicule', lines: ['Mon véhicule'] },
  { title: 'Carte communautaire', lines: ['Carte', 'communautaire'] },
];

const TAU = Math.PI * 2;
const STEP = TAU / FEATURE_LABELS.length;
const slotAngle = (index) => -((index + 1) * STEP) - Math.PI / 2;

/**
 * Peint les titres des fonctionnalités dans la texture du disque 3D.
 * @param {HTMLCanvasElement} canvas
 * @param {number} size
 */
export function paintFeatureDial(canvas, size) {
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  const center = size / 2;
  const radius = size / 2;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#000000';
  ctx.lineCap = 'round';

  const drawTick = (angle, width, inner = 0.41, outer = 0.52) => {
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(
      center + radius * outer * Math.cos(angle),
      center + radius * outer * Math.sin(angle),
    );
    ctx.lineTo(
      center + radius * inner * Math.cos(angle),
      center + radius * inner * Math.sin(angle),
    );
    ctx.stroke();
  };

  FEATURE_LABELS.forEach((_, index) => {
    drawTick(slotAngle(index), radius * 0.024);
    drawTick(slotAngle(index) - STEP / 2, radius * 0.011, 0.45, 0.52);
  });

  FEATURE_LABELS.forEach(({ lines }, index) => {
    const angle = slotAngle(index);
    const labelRadius = radius * 0.73;
    const baseSize = radius * 0.052;
    const maxWidth = radius * 0.38;

    ctx.save();
    ctx.translate(
      center + labelRadius * Math.cos(angle),
      center + labelRadius * Math.sin(angle),
    );
    ctx.rotate(angle + Math.PI * 1.5);

    ctx.font = `700 ${baseSize}px Inter, "Helvetica Neue", Arial, sans-serif`;
    const widest = Math.max(...lines.map((line) => ctx.measureText(line).width));
    const fontSize = baseSize * Math.min(1, maxWidth / Math.max(1, widest));
    const lineHeight = fontSize * 1.08;
    const top = -((lines.length - 1) * lineHeight) / 2;

    ctx.font = `700 ${fontSize}px Inter, "Helvetica Neue", Arial, sans-serif`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    lines.forEach((line, lineIndex) => {
      ctx.fillText(line, 0, top + lineIndex * lineHeight);
    });
    ctx.restore();
  });

  return canvas;
}
