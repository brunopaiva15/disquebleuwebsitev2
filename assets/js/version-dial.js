/* ===========================================================================
   version-dial.js. Variante du cadran 3D dédiée à l'historique.

   La géométrie et les graduations restent celles du disque principal. Les
   douze positions horaires accueillent ici les douze versions publiques,
   de la plus récente à la première.
   =========================================================================== */

export const VERSION_LABELS = [
  '2.1.1',
  '2.0.3',
  '2.0.2',
  '2.0.1',
  '2.0.0',
  '1.3.0',
  '1.2.1',
  '1.2.0',
  '1.1.1',
  '1.1.0',
  '1.0.1',
  '1.0.0',
];

const slotAngle = (index) =>
  ((-((index + 1) * 30) - 90) * Math.PI) / 180;

/**
 * Peint les numéros de version dans la texture utilisée par le disque 3D.
 * @param {HTMLCanvasElement} canvas
 * @param {number} size
 */
export function paintVersionDial(canvas, size) {
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  const center = size / 2;
  const radius = size / 2;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#000000';
  ctx.lineCap = 'round';

  const drawTick = (angle, width, inner = 0.42, outer = 0.52) => {
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

  VERSION_LABELS.forEach((_, index) => {
    drawTick(slotAngle(index), radius * 0.025);
    drawTick(slotAngle(index) - Math.PI / 12, radius * 0.012, 0.45, 0.52);
  });

  VERSION_LABELS.forEach((label, index) => {
    const angle = slotAngle(index);
    const labelRadius = radius * 0.72;

    ctx.save();
    ctx.translate(
      center + labelRadius * Math.cos(angle),
      center + labelRadius * Math.sin(angle),
    );
    ctx.rotate(angle + Math.PI * 1.5);
    ctx.font = `700 ${radius * 0.105}px Inter, "Helvetica Neue", Arial, sans-serif`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 0);
    ctx.restore();
  });

  return canvas;
}
