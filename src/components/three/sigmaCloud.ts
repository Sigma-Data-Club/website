/**
 * Núcleo compartido del efecto "datos como materia": una nube de puntos que
 * pasa del ruido a la forma de la σ (logo del club). Lo usan la exploración
 * del laboratorio (`lab/PointsScene`) y la sección "Únete" (`JoinCloudScene`).
 */
import { snoise } from "./glsl";

export const GLYPH = "σ"; // sigma minúscula: el logo real del club

/**
 * Muestrea el contorno relleno de la σ dibujándola en un canvas 2D y leyendo
 * sus píxeles. Devuelve `count` posiciones (x, y) centradas en el origen.
 * Sin assets ni fuentes externas: el glifo se genera en el cliente.
 */
export function sampleGlyph(
  count: number,
  spanX: number,
  spanY: number,
  rand: () => number,
) {
  const S = 220;
  const out = new Float32Array(count * 2);

  if (typeof document === "undefined") return out;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return out;

  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // La σ minúscula ocupa la altura-x, así que la dibujamos más grande que una
  // mayúscula para que llene un volumen parecido en la nube.
  ctx.font = `600 ${Math.round(S * 0.98)}px "Space Grotesk", system-ui, sans-serif`;
  ctx.fillText(GLYPH, S / 2, S / 2 + S * 0.04);

  const data = ctx.getImageData(0, 0, S, S).data;
  const hits: number[] = [];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (data[(y * S + x) * 4 + 3] > 128) hits.push(x, y);
    }
  }

  const n = hits.length / 2;
  for (let i = 0; i < count; i++) {
    const h = n > 0 ? Math.floor(rand() * n) * 2 : 0;
    const px = hits[h] ?? S / 2;
    const py = hits[h + 1] ?? S / 2;
    out[i * 2] = (px / S - 0.5) * spanX;
    out[i * 2 + 1] = -(py / S - 0.5) * spanY;
  }
  return out;
}

export const cloudVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uDpr;
  uniform vec2 uPointer;
  attribute vec3 aScatter;
  attribute vec3 aGlyph;
  attribute float aSize;
  attribute float aAccent;
  varying float vAccent;
  varying float vMorph;
  ${snoise}
  void main(){
    vAccent = aAccent;
    vMorph = uMorph;

    vec3 pos = mix(aScatter, aGlyph, uMorph);

    // Vida orgánica: más agitación cuando la nube está dispersa.
    float wob = 1.0 - uMorph;
    pos.x += snoise(vec3(aScatter.xy * 0.35, uTime * 0.18)) * 0.55 * wob;
    pos.y += snoise(vec3(aScatter.yx * 0.35, uTime * 0.18 + 11.0)) * 0.55 * wob;
    pos.z += snoise(vec3(aScatter.xy * 0.30, uTime * 0.14 + 5.0)) * 0.7 * wob;

    // Repulsión suave alrededor del cursor (en plano XY del mundo).
    vec2 d = pos.xy - uPointer;
    float dist = length(d);
    float push = smoothstep(1.7, 0.0, dist) * 0.7;
    pos.xy += normalize(d + vec2(0.0001)) * push;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uDpr * (26.0 / -mv.z);
  }
`;

export const cloudFragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying float vAccent;
  varying float vMorph;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.12, d);
    vec3 col = mix(uInk, uAccent, vAccent);
    gl_FragColor = vec4(col, alpha * (0.55 + 0.45 * vMorph));
  }
`;
