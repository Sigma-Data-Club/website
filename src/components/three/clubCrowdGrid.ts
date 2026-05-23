import * as THREE from "three";
import { ACCENT_HEX, INK_HEX } from "./glsl";
import { mulberry32 } from "./lab/random";

const SEED = 0x7e_71_70_6f;

const GRADIENT_ACCENT = new THREE.Color(ACCENT_HEX);
const GRADIENT_DARK = new THREE.Color(ACCENT_HEX).lerp(new THREE.Color(INK_HEX), 0.9);

export type CrowdLayout = {
  xz: Float32Array;
  baseRot: Float32Array;
  /** RGB por instancia, muestreado aleatoriamente en el gradiente acento → oscuro. */
  colors: Float32Array;
  phase: Float32Array;
  placeRank: Uint16Array;
  cols: number;
  rows: number;
  gap: number;
  figureScale: number;
};

/** t ∈ [0,1]: 0 = acento, 1 = mezcla acento–negro. */
export function colorOnCrowdGradient(t: number, out = new THREE.Color()) {
  return out.copy(GRADIENT_ACCENT).lerp(GRADIENT_DARK, THREE.MathUtils.clamp(t, 0, 1));
}

function randomGradientStop(rand: () => number, col: number, row: number, cols: number, rows: number) {
  const nx = cols > 1 ? col / (cols - 1) : 0.5;
  const nz = rows > 1 ? row / (rows - 1) : 0.5;
  const spatial = nx * 0.38 + nz * 0.22;
  const t = THREE.MathUtils.clamp(Math.pow(rand(), 0.8) * 0.55 + spatial * 0.45 + rand() * 0.12, 0, 1);
  const c = colorOnCrowdGradient(t);
  return [c.r, c.g, c.b] as const;
}

/**
 * Cuadrícula centrada que ocupa el ancho visible del canvas (viewport R3F).
 * El número de columnas crece en pantallas anchas.
 */
export function buildGridLayout(count: number, viewportW: number, viewportH: number): CrowdLayout {
  const rand = mulberry32(SEED);
  const aspect = viewportW / Math.max(viewportH, 0.001);

  let cols = Math.ceil(Math.sqrt(count * aspect * 1.25));
  cols = THREE.MathUtils.clamp(cols, 9, 30);
  const rows = Math.ceil(count / cols);

  const usableW = viewportW * 0.94;
  const usableZ = Math.min(viewportH * 0.58, usableW * 0.55);

  const gapX = cols > 1 ? usableW / (cols - 1) : 0;
  const gapZ = rows > 1 ? usableZ / (rows - 1) : 0;
  const gap = Math.min(gapX, gapZ, 0.44);

  const halfX = ((cols - 1) * gap) / 2;
  const halfZ = ((rows - 1) * gap) / 2;
  const figureScale = THREE.MathUtils.clamp(gap / 0.34, 0.52, 1);

  const xz = new Float32Array(count * 2);
  const baseRot = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const placeRank = new Uint16Array(count);

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    xz[i * 2] = col * gap - halfX;
    xz[i * 2 + 1] = row * gap - halfZ;
    baseRot[i] = (rand() - 0.5) * 0.12;
    const [r, g, b] = randomGradientStop(rand, col, row, cols, rows);
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
    phase[i] = rand() * Math.PI * 2;
    placeRank[i] = i;
  }

  return { xz, baseRot, colors, phase, placeRank, cols, rows, gap, figureScale };
}

export function gridCameraDistance(layout: Pick<CrowdLayout, "rows" | "gap">) {
  const depth = layout.rows * layout.gap;
  return {
    y: 3.6 + depth * 0.07,
    z: 9.5 + depth * 0.32,
  };
}
