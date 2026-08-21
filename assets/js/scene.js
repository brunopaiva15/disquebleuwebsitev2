/* ===========================================================================
   scene.js. La scène : un ciel tramé et un disque bleu en volume.

   Tout tient dans un fragment shader sur un triangle plein écran. L'objet
   n'est pas un disque plein mais la fenêtre en croissant du vrai disque de
   stationnement, intersectée analytiquement plutôt que maillée : exact,
   net à toute résolution, et très peu coûteux.

   Le carton est blanc et le bleu, c'est le ciel : exactement le rapport
   figure/fond de l'application.

   Le ciel et les nuages sont tramés par matrice de Bayer 8×8 : les nuages
   deviennent des amas de points plutôt que des dégradés lisses.
   =========================================================================== */

import { paintDial } from './dial.js';

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform sampler2D uDial;

uniform float uSpin;    // rotation propre du disque (radians)
uniform float uTilt;    // inclinaison de la normale depuis l'axe vertical
uniform float uCamY;    // hauteur de la caméra (négative = contre-plongée)
uniform float uCamZ;    // recul de la caméra
uniform float uAimY;    // hauteur visée : remonte le disque hors du cadre
uniform float uFov;     // focale : plus bas = plus grand-angle, plus de fuite
uniform float uRadius;  // rayon du disque blanc
uniform float uCenterY; // position du moyeu. Le carton est très excentré,
uniform float uPanX;    // on place donc le moyeu, pas la fenêtre, et on
uniform float uPanZ;    // laisse le disque voyager dans le cadre.
uniform float uHaze;    // densité des nuages
uniform float uSolidBackground; // fond uni pour la scène des fonctions

const float PI = 3.14159265;
const float THICK = 0.038;   // demi-épaisseur du carton

/* --- Trame ordonnée de Bayer ---------------------------------------- */
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

/* --- Bruit ----------------------------------------------------------- */
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}

/* --- Fenêtre en croissant ----------------------------------------------
   Décalque de _CoverPainter._buildCrescentWindow (parking_disc_painter.dart).
   Repère local du disque : origine au centre, +Y vers la fenêtre, c'est
   le +Y « vers le bas » du canvas de Flutter, d'où des formules identiques.

   · bord intérieur : arc de rayon 0.42 R, ouvert de ±46° autour de +Y
   · bord extérieur : le cercle blanc du disque lui-même, rayon R
     (la fenêtre déborde jusqu'à 1.12 R, mais le carton s'arrête à R)
   · côtés : deux segments droits TVL→BVL et TVR→BVR, à peine non radiaux */
const float R_IN  = 0.42;
const float R_OUT = 1.0;
const vec2  TVL   = vec2(-0.3021, 0.2918);   // haut-gauche de la fenêtre
const vec2  TVR   = vec2(0.3021, 0.2918);   // haut-droit
const vec2  NL    = vec2(0.7441, 0.6680);   // normales rentrantes
const vec2  NR    = vec2(-0.7441, 0.6680);

bool inside(vec3 p, float Rd) {
  float e = 1e-3 * Rd;
  if (abs(p.z) > THICK + 1e-4) return false;
  if (p.y <= 0.0) return false;               // la fenêtre est du côté +Y
  float r = length(p.xy);
  if (r < R_IN * Rd - e || r > R_OUT * Rd + e) return false;
  if (dot(p.xy - TVL * Rd, NL) < -e) return false;
  if (dot(p.xy - TVR * Rd, NR) < -e) return false;
  return true;
}

/* Retient l'intersection si elle est valide et plus proche que la meilleure. */
void consider(vec3 lo, vec3 ld, float t, int f, float Rd,
              inout float best, inout int face) {
  if (t <= 0.002 || t >= best) return;
  if (!inside(lo + t * ld, Rd)) return;
  best = t;
  face = f;
}

/* Le repère local reprend la convention du canvas de Flutter : +Y vers le
   bas, c'est-à-dire vers la fenêtre. La rotation seule enverrait +Y vers le
   haut du monde, on retourne donc l'axe, et on retourne la normale au
   retour. C'est une réflexion, mais elle place aussi les coordonnées de
   texture exactement dans le repère où le cadran a été peint. */
vec3 flipY(vec3 a) { return vec3(a.x, -a.y, a.z); }

mat3 rotX(float a) {
  float c = cos(a), s = sin(a);
  return mat3(1.0, 0.0, 0.0,
              0.0,   c,   s,
              0.0,  -s,   c);
}

/* --- Ciel ------------------------------------------------------------- */
vec3 sky(vec3 rd, vec2 frag) {
  float h = clamp(rd.y * 0.5 + 0.5, 0.0, 1.0);

  vec3 zenith  = vec3(0.031, 0.243, 0.604);
  vec3 middle  = vec3(0.063, 0.416, 0.804);
  vec3 horizon = vec3(0.573, 0.776, 0.937);

  vec3 col = mix(horizon, middle, smoothstep(0.42, 0.66, h));
  col = mix(col, zenith, smoothstep(0.62, 1.0, h));

  // Sous l'horizon, le ciel repartait vers le blanc et délavait le bas du
  // cadre. On le rabat vers un bleu plus dense, le texte y tient mieux.
  col = mix(col, vec3(0.180, 0.412, 0.706), smoothstep(0.50, 0.14, h) * 0.72);

  // Nappe de nuages projetée sur un plan haut. Le domaine est déformé par
  // un premier bruit : sans cela les amas ont l'air d'un tissu régulier.
  if (rd.y > 0.03) {
    // L'échelle compte : trop petite, le bruit est presque constant sur le
    // champ visible et il ne se forme aucun amas.
    vec2 q = rd.xz / max(rd.y, 0.04) * 1.7 + vec2(uTime * 0.03, 0.0);
    float warp = fbm(q * 0.5);
    float n = fbm(q * 0.8 + warp * 1.4);

    // Deux seuils : le cœur des nuages est plein, les bords s'effilochent.
    float body = smoothstep(0.54, 0.72, n);
    float edge = smoothstep(0.45, 0.64, n);

    // L'horizon avale les nuages : ils s'écrasent en perspective.
    float depth = smoothstep(0.04, 0.26, rd.y);
    float cover = clamp(edge * 0.42 + body * 0.66, 0.0, 1.0) * depth * uHaze;

    // Trame ordonnée : les bords deviennent des amas de points.
    float dots = step(bayer8(frag), cover);
    col = mix(col, vec3(0.972, 0.976, 0.966), dots * 0.94);
  }
  return col;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5 * uRes) / uRes.y;

  /* Caméra : placée sous le disque, elle vise son centre, d'où la
     contre-plongée. */
  vec3 ro = vec3(0.0, uCamY, uCamZ);
  vec3 fwd = normalize(vec3(0.0, uAimY, 0.0) - ro);
  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, fwd);
  vec3 rd = normalize(uv.x * right + uv.y * up + uFov * fwd);

  vec3 col = uSolidBackground > 0.5
    ? vec3(11.0 / 255.0, 10.0 / 255.0, 9.0 / 255.0)
    : sky(rd, frag);

  /* --- Intersection avec le carton --------------------------------- */
  // Le disque tourne autour de son centre, qui est hors du carton.
  mat3 R = rotX(0.5 * PI - uTilt);
  vec3 lo = flipY(R * (ro - vec3(uPanX, uCenterY, uPanZ)));
  vec3 ld = flipY(R * rd);

  float Rd = uRadius;
  float best = 1e9;
  int face = 0;   // 1 dessus · 2 dessous · 3 chant extérieur
                  // 4 arc intérieur · 5/6 coupes droites

  // Faces plates.
  if (abs(ld.z) > 1e-5) {
    consider(lo, ld, (THICK - lo.z) / ld.z, 1, Rd, best, face);
    consider(lo, ld, (-THICK - lo.z) / ld.z, 2, Rd, best, face);
  }

  // Arcs : cercle extérieur du disque, puis arc intérieur de la fenêtre.
  float a2 = dot(ld.xy, ld.xy);
  if (a2 > 1e-6) {
    float b2 = 2.0 * dot(lo.xy, ld.xy);
    for (int k = 0; k < 2; k++) {
      float rad = (k == 0) ? R_OUT * Rd : R_IN * Rd;
      float cq = dot(lo.xy, lo.xy) - rad * rad;
      float d = b2 * b2 - 4.0 * a2 * cq;
      if (d > 0.0) {
        float sq = sqrt(d);
        int f = (k == 0) ? 3 : 4;
        consider(lo, ld, (-b2 - sq) / (2.0 * a2), f, Rd, best, face);
        consider(lo, ld, (-b2 + sq) / (2.0 * a2), f, Rd, best, face);
      }
    }
  }

  // Côtés droits : deux plans verticaux passant par TVL et TVR.
  for (int k = 0; k < 2; k++) {
    vec2 anchor = (k == 0) ? TVL : TVR;
    vec2 nrm = (k == 0) ? NL : NR;
    float dn = dot(ld.xy, nrm);
    if (abs(dn) > 1e-5) {
      float t = dot(anchor * Rd - lo.xy, nrm) / dn;
      consider(lo, ld, t, (k == 0) ? 5 : 6, Rd, best, face);
    }
  }

  if (face != 0) {
    vec3 lp = lo + best * ld;            // point d'impact, repère local
    vec3 ln3;
    if (face == 1) ln3 = vec3(0.0, 0.0, 1.0);
    else if (face == 2) ln3 = vec3(0.0, 0.0, -1.0);
    else if (face == 3) ln3 = vec3(normalize(lp.xy), 0.0);
    else if (face == 4) ln3 = vec3(-normalize(lp.xy), 0.0);
    else if (face == 5) ln3 = vec3(-NL, 0.0);
    else ln3 = vec3(-NR, 0.0);

    // Retour au repère monde : l'inverse d'une rotation est la rotation
    // opposée (transpose() n'existe pas en GLSL ES 1.00).
    vec3 n = rotX(uTilt - 0.5 * PI) * flipY(ln3);
    vec3 p = ro + best * rd;
    vec3 v = normalize(ro - p);

    vec3 albedo;
    float gloss;

    if (face == 1) {
      // Dessus : le cadran imprimé. Dans un vrai disque, c'est la carte qui
      // tourne derrière la fenêtre, on fait donc pivoter la texture, pas
      // la géométrie.
      float cs = cos(uSpin), sn = sin(uSpin);
      vec2 q = vec2(lp.x * cs - lp.y * sn, lp.x * sn + lp.y * cs);
      vec2 tuv = q / Rd * 0.5 + 0.5;
      albedo = texture2D(uDial, tuv).rgb;
      gloss = 0.28;
    } else if (face == 2) {
      albedo = vec3(0.862, 0.874, 0.884);      // dos du carton
      gloss = 0.13;
    } else {
      albedo = vec3(0.792, 0.812, 0.828);      // tranches
      gloss = 0.18;
    }

    vec3 sun = normalize(vec3(-0.40, 0.80, 0.44));
    float lam = max(dot(n, sun), 0.0);
    // Ambiance bleutée : le ciel est la seule autre source de lumière.
    vec3 ambient = mix(vec3(0.30, 0.40, 0.56), vec3(0.62, 0.74, 0.92),
                       n.y * 0.5 + 0.5);
    vec3 hv = normalize(sun + v);
    float spec = pow(max(dot(n, hv), 0.0), 42.0) * gloss;
    float fres = pow(1.0 - max(dot(n, v), 0.0), 4.0) * 0.30;

    col = albedo * (ambient + lam * 0.78)
        + vec3(1.0) * spec
        + vec3(0.60, 0.78, 1.0) * fres;
  }

  // Trame fine sur le ciel et l'objet, mais pas sur le fond uni.
  if (face != 0 || uSolidBackground < 0.5) {
    col += (bayer8(frag) - 0.5) / 220.0;
  }

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('shader:', gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

/**
 * Monte la scène.
 * @param {HTMLCanvasElement} canvas
 * @param {{
 *   dialPainter?:(canvas:HTMLCanvasElement,size:number)=>HTMLCanvasElement,
 *   maxDpr?:number,
 *   pixelBudget?:number,
 *   pauseWhenOffscreen?:boolean,
 *   solidBackground?:boolean
 * }} options
 * @returns {{set:(k:string,v:number)=>void,repaintDial:()=>void}|null}
 */
export function mountScene(canvas, options = {}) {
  if (!canvas) return null;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('link:', gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  /* --- Texture du cadran ------------------------------------------- */
  const dialPainter = options.dialPainter || paintDial;
  const dial = document.createElement('canvas');
  const tex = gl.createTexture();
  const repaintDial = () => {
    dialPainter(dial, 1024);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, dial);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  repaintDial();

  // Filtrage anisotrope : sans lui, les chiffres scintillent à angle rasant.
  const aniso =
    gl.getExtension('EXT_texture_filter_anisotropic') ||
    gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
  if (aniso) {
    const max = gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, max));
  }

  const U = {};
  ['uRes', 'uTime', 'uDial', 'uSpin', 'uTilt', 'uCamY', 'uCamZ', 'uAimY', 'uFov',
   'uRadius', 'uCenterY', 'uPanX', 'uPanZ', 'uHaze', 'uSolidBackground']
    .forEach((k) => (U[k] = gl.getUniformLocation(prog, k)));
  gl.uniform1i(U.uDial, 0);

  /* --- État piloté depuis l'extérieur ------------------------------- */
  // Cadrage par défaut : caméra basse et proche, visée haute, le disque
  // déborde du cadre et on le regarde d'en dessous.
  const state = {
    uSpin: 0, uTilt: 1.02,
    uCamY: -1.45, uCamZ: 1.95, uAimY: 0.62, uFov: 0.92,
    uRadius: 2.6, uCenterY: 1.55, uPanX: 0, uPanZ: 0, uHaze: 1,
    uSolidBackground: options.solidBackground ? 1 : 0,
  };

  const resize = () => {
    // Plafond en nombre de pixels : le shader est exact, pas gratuit.
    const dpr = Math.min(window.devicePixelRatio || 1, options.maxDpr || 2);
    const budget = options.pixelBudget || 2.4e6;
    // La scène principale occupe la fenêtre ; la scène des fonctionnalités vit
    // dans un panneau. Les dimensions CSS du canvas couvrent les deux cas.
    const w0 = Math.max(1, canvas.clientWidth || window.innerWidth);
    const h0 = Math.max(1, canvas.clientHeight || window.innerHeight);
    const s = Math.min(dpr, Math.sqrt(budget / (w0 * h0)));
    const w = Math.max(2, Math.round(w0 * s));
    const h = Math.max(2, Math.round(h0 * s));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);

  const t0 = performance.now();
  let alive = true;
  let inView = !options.pauseWhenOffscreen;

  if (options.pauseWhenOffscreen && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
    }, { rootMargin: '25% 0px' }).observe(canvas);
  } else {
    inView = true;
  }

  const frame = (now) => {
    if (!alive) return;
    if (inView) {
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uTime, (now - t0) / 1000);
      gl.uniform1f(U.uSpin, state.uSpin);
      gl.uniform1f(U.uTilt, state.uTilt);
      gl.uniform1f(U.uCamY, state.uCamY);
      gl.uniform1f(U.uCamZ, state.uCamZ);
      gl.uniform1f(U.uAimY, state.uAimY);
      gl.uniform1f(U.uFov, state.uFov);
      gl.uniform1f(U.uRadius, state.uRadius);
      gl.uniform1f(U.uCenterY, state.uCenterY);
      gl.uniform1f(U.uPanX, state.uPanX);
      gl.uniform1f(U.uPanZ, state.uPanZ);
      gl.uniform1f(U.uHaze, state.uHaze);
      gl.uniform1f(U.uSolidBackground, state.uSolidBackground);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) alive = false;
    else if (!alive) { alive = true; requestAnimationFrame(frame); }
  });

  return {
    set(key, value) {
      if (key in state) state[key] = value;
    },
    repaintDial,
  };
}
