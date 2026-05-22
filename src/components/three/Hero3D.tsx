"use client";

import dynamic from "next/dynamic";

/**
 * Carga la escena Three.js solo en el cliente (sin SSR) para evitar
 * desajustes de hidratación y mantener ligero el render inicial.
 */
const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => m.HeroScene),
  { ssr: false },
);

export function Hero3D() {
  return <HeroScene />;
}
