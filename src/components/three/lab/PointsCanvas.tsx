"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../../ThemeProvider";

const PointsScene = dynamic(
  () => import("./PointsScene").then((m) => m.PointsScene),
  { ssr: false },
);

export function PointsCanvas() {
  // Se remonta al cambiar de tema para releer la paleta: con
  // prefers-reduced-motion el canvas va en frameloop="demand" y, si no,
  // se quedaría congelado con los colores del tema anterior.
  const { theme } = useTheme();

  return <PointsScene key={theme} />;
}
