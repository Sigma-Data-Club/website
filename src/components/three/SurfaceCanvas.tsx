"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../ThemeProvider";

/**
 * Carga la escena de superficie solo en el cliente (ssr: false) para evitar
 * desajustes de hidratación y mantener ligero el render inicial.
 */
const SurfaceScene = dynamic(
  () => import("./SurfaceScene").then((m) => m.SurfaceScene),
  { ssr: false },
);

export function SurfaceCanvas() {
  // Se remonta al cambiar de tema para releer la paleta: con
  // prefers-reduced-motion el canvas va en frameloop="demand" y, si no,
  // se quedaría congelado con los colores del tema anterior.
  const { theme } = useTheme();

  return <SurfaceScene key={theme} />;
}
