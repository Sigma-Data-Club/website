"use client";

import dynamic from "next/dynamic";

/**
 * Carga cada escena Three.js solo en el cliente (ssr: false).
 * Punto único de entrada para todas las variantes de hero.
 */
const scenes = {
  sphere: dynamic(() => import("@/components/three/HeroScene").then((m) => m.HeroScene), {
    ssr: false,
  }),
  surface: dynamic(() => import("./SurfaceScene").then((m) => m.SurfaceScene), {
    ssr: false,
  }),
  graph: dynamic(() => import("./GraphScene").then((m) => m.GraphScene), {
    ssr: false,
  }),
  ico: dynamic(() => import("./IcoScene").then((m) => m.IcoScene), { ssr: false }),
  flow: dynamic(() => import("./FlowScene").then((m) => m.FlowScene), { ssr: false }),
};

export type SceneName = keyof typeof scenes;

export function SceneCanvas({ name }: { name: SceneName }) {
  const Scene = scenes[name];
  return <Scene />;
}
