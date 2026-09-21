"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../../ThemeProvider";

const SigmaScene = dynamic(
  () => import("./SigmaScene").then((m) => m.SigmaScene),
  { ssr: false },
);

export function SigmaCanvas() {
  // Se remonta al cambiar de tema para releer la paleta: con
  // prefers-reduced-motion el canvas va en frameloop="demand" y, si no,
  // se quedaría congelado con los colores del tema anterior.
  const { theme } = useTheme();

  return <SigmaScene key={theme} />;
}
