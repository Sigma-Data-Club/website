"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../../ThemeProvider";

const MarqueeScene = dynamic(
  () => import("./MarqueeScene").then((m) => m.MarqueeScene),
  { ssr: false },
);

export function MarqueeCanvas() {
  // Se remonta al cambiar de tema para releer la paleta: con
  // prefers-reduced-motion el canvas va en frameloop="demand" y, si no,
  // se quedaría congelado con los colores del tema anterior.
  const { theme } = useTheme();

  return <MarqueeScene key={theme} />;
}
