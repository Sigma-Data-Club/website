"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../../ThemeProvider";

const GraphScene = dynamic(
  () => import("./GraphScene").then((m) => m.GraphScene),
  { ssr: false },
);

export function GraphCanvas() {
  // Esta escena fija colores como prop de material/luz, así que se vuelve
  // a montar al cambiar de tema para releer la paleta.
  const { theme } = useTheme();

  return <GraphScene key={theme} />;
}
