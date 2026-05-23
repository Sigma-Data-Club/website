"use client";

import { useFrame, useThree } from "@/components/three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ACCENT_HEX, INK_HEX } from "../glsl";
import type { ProjectCardPointer } from "../ProjectCardScene";

export type VisualProps = {
  pointer: ProjectCardPointer;
  hovered: boolean;
  reduced: boolean;
};

export type CardMaterialOpts = {
  wireframe?: boolean;
  opacity?: number;
};

export const ink = () => new THREE.Color(INK_HEX);
export const accent = () => new THREE.Color(ACCENT_HEX);

/** Negro en reposo; acento (azul Sigma) cuando la card hace hover. */
export function pickStroke(target: THREE.Color, cardHovered: boolean, focused = false) {
  if (!cardHovered) {
    target.copy(ink());
    return target;
  }
  if (focused) {
    target.set("#ffffff");
    return target;
  }
  target.copy(accent());
  return target;
}

export function strokeHex(cardHovered: boolean) {
  return cardHovered ? ACCENT_HEX : INK_HEX;
}

/** Material nuevo por estado — evita que R3F/instanced dejen el color en negro. */
export function createCardMaterial(hovered: boolean, opts?: CardMaterialOpts) {
  const wireframe = opts?.wireframe ?? false;
  return new THREE.MeshBasicMaterial({
    color: strokeHex(hovered),
    wireframe,
    vertexColors: false,
    transparent: true,
    opacity: opts?.opacity ?? (hovered ? 0.95 : wireframe ? 0.55 : 0.85),
    toneMapped: false,
  });
}

export function createLineMaterial(hovered: boolean, restOpacity = 0.38, hoverOpacity = 0.82) {
  return new THREE.LineBasicMaterial({
    color: strokeHex(hovered),
    transparent: true,
    opacity: hovered ? hoverOpacity : restOpacity,
  });
}

/**
 * Material estable que se recrea al togglear hover.
 * InstancedMesh + wireframe no actualiza bien el color in-place.
 */
export function useCardMaterial(hovered: boolean, opts?: CardMaterialOpts) {
  const wireframe = opts?.wireframe ?? false;
  const opacity = opts?.opacity;

  return useMemo(
    () => createCardMaterial(hovered, { wireframe, opacity }),
    [hovered, wireframe, opacity],
  );
}

export function useLineMaterial(
  hovered: boolean,
  restOpacity = 0.38,
  hoverOpacity = 0.82,
) {
  return useMemo(
    () => createLineMaterial(hovered, restOpacity, hoverOpacity),
    [hovered, restOpacity, hoverOpacity],
  );
}

/** Repinta el canvas al cambiar hover. */
export function useInvalidateOnHover(hovered: boolean) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
    const id = requestAnimationFrame(() => invalidate());
    return () => cancelAnimationFrame(id);
  }, [hovered, invalidate]);
}

/** Rig compartido: quieto en reposo, inclina solo con hover. */
export function useCardRig(
  pointer: ProjectCardPointer,
  hovered: boolean,
  reduced: boolean,
  restY = 0,
) {
  const ref = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const g = ref.current;
    if (!g || hovered) return;
    g.rotation.set(0.06, restY, 0);
    g.position.set(0, 0, 0);
  }, [hovered, restY]);

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g || reduced || !hovered) return;
    const damp = 8;
    g.rotation.x = THREE.MathUtils.lerp(
      g.rotation.x,
      (pointer.y - 0.5) * -0.26,
      damp * delta,
    );
    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      (pointer.x - 0.5) * 0.34 + restY,
      damp * delta,
    );
    g.position.z = THREE.MathUtils.lerp(g.position.z, 0.08, damp * delta);
  });

  return ref;
}

/** Índice activo (0–1) a partir del cursor horizontal. */
export function pointerIndex(pointerX: number, count: number) {
  return Math.min(count - 1, Math.max(0, Math.round(pointerX * (count - 1))));
}
