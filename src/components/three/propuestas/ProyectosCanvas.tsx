"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../../ThemeProvider";

const ProyectosScene = dynamic(
  () => import("./ProyectosScene").then((m) => m.ProyectosScene),
  { ssr: false },
);

export function ProyectosCanvas() {
  // Se remonta al cambiar de tema para releer la paleta: con
  // prefers-reduced-motion el canvas va en frameloop="demand" y, si no,
  // se quedaría congelado con los colores del tema anterior.
  const { theme } = useTheme();

  return <ProyectosScene key={theme} />;
}
