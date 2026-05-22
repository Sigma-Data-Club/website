"use client";

import dynamic from "next/dynamic";

/**
 * Carga la escena de superficie solo en el cliente (ssr: false) para evitar
 * desajustes de hidratación y mantener ligero el render inicial.
 */
const SurfaceScene = dynamic(
  () => import("./SurfaceScene").then((m) => m.SurfaceScene),
  { ssr: false },
);

export function SurfaceCanvas() {
  return <SurfaceScene />;
}
