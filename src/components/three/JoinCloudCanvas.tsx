"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../ThemeProvider";

/** Carga la nube de la sección "Únete" solo en cliente (ssr:false). */
const JoinCloudScene = dynamic(
  () => import("./JoinCloudScene").then((m) => m.JoinCloudScene),
  { ssr: false },
);

export function JoinCloudCanvas() {
  // Se remonta al cambiar de tema para releer la paleta: con
  // prefers-reduced-motion el canvas va en frameloop="demand" y, si no,
  // se quedaría congelado con los colores del tema anterior.
  const { theme } = useTheme();

  return <JoinCloudScene key={theme} />;
}
