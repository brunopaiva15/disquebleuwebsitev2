/* ===========================================================================
   dial.js. Le cadran des heures, peint dans un canvas hors écran.

   Reproduit trait pour trait `_HoursPainter` de l'application
   (lib/widgets/parking_disc_painter.dart) : mêmes rayons, mêmes graisses,
   même convention d'angle. Le canvas partage la convention de Flutter
   (origine en haut à gauche, Y vers le bas, angle 0 sur +X), les formules
   sont donc reprises telles quelles.

   Ce canvas sert de texture au carton 3D. Il ne contient que l'encre :
   ni reflet ni ombre, l'éclairage est calculé dans le shader.
   =========================================================================== */

/** Angle d'une heure, en radians. Les heures tournent en sens antihoraire. */
function hourAngle(hour) {
  const h = hour <= 12 ? hour : hour - 12;
  return ((-(h * 30) - 90) * Math.PI) / 180;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} size Côté en pixels, puissance de deux de préférence.
 */
export function paintDial(canvas, size) {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const c = size / 2;
  const R = size / 2;

  /* Le disque est un rond blanc plein. */
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  /* --- Graduations ------------------------------------------------------
     Elles pointent vers l'intérieur : de 0.52 R à 0.42 R, c'est-à-dire
     jusqu'au bord supérieur de la fenêtre. */
  ctx.strokeStyle = '#000000';
  ctx.lineCap = 'round';

  const drawTick = (rad, width) => {
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(c + R * 0.52 * Math.cos(rad), c + R * 0.52 * Math.sin(rad));
    ctx.lineTo(c + R * 0.42 * Math.cos(rad), c + R * 0.42 * Math.sin(rad));
    ctx.stroke();
  };

  for (let hour = 1; hour <= 12; hour++) {
    drawTick(((-(hour * 30) - 90) * Math.PI) / 180, R * 0.025);
  }
  for (let i = 0; i < 12; i++) {
    drawTick(((-(i * 30 + 15) - 90) * Math.PI) / 180, R * 0.012);
  }

  /* --- Heures -----------------------------------------------------------
     Chaque chiffre est redressé de 180° par rapport au trait : c'est ce qui
     le rend lisible dans la fenêtre, qui se trouve sous le centre. */
  const drawHour = (hour, radius, fontSize) => {
    const rad = hourAngle(hour);
    ctx.save();
    ctx.translate(c + radius * Math.cos(rad), c + radius * Math.sin(rad));
    ctx.rotate(rad + Math.PI / 2 + Math.PI);
    ctx.font = `700 ${fontSize}px Inter, "Helvetica Neue", Arial, sans-serif`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(hour), 0, 0);
    ctx.restore();
  };

  for (let hour = 13; hour <= 24; hour++) drawHour(hour, R * 0.87, R * 0.085);
  for (let hour = 1; hour <= 12; hour++) drawHour(hour, R * 0.69, R * 0.22);

  return canvas;
}
