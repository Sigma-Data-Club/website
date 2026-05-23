import * as THREE from "three";
import { mulberry32 } from "./lab/random";

const SEED = 0x7e_71_70_6f;

export type CrowdLayout = {
  xz: Float32Array;
  baseRot: Float32Array;
  accent: Float32Array;
  phase: Float32Array;
  placeRank: Uint16Array;
  cols: number;
  rows: number;
  gap: number;
  figureScale: number;
};

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
  const accent = new Float32Array(count);
  const phase = new Float32Array(count);
  const placeRank = new Uint16Array(count);

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    xz[i * 2] = col * gap - halfX;
    xz[i * 2 + 1] = row * gap - halfZ;
    baseRot[i] = (rand() - 0.5) * 0.12;
    accent[i] = rand() < 0.14 ? 1 : 0;
    phase[i] = rand() * Math.PI * 2;
    placeRank[i] = i;
  }

  return { xz, baseRot, accent, phase, placeRank, cols, rows, gap, figureScale };
}

export function gridCameraDistance(layout: Pick<CrowdLayout, "rows" | "gap">) {
  const depth = layout.rows * layout.gap;
  return {
    y: 3.6 + depth * 0.07,
    z: 9.5 + depth * 0.32,
  };
}
