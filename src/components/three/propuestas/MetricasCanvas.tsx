"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../../ThemeProvider";

const MetricasScene = dynamic(
  () => import("./MetricasScene").then((m) => m.MetricasScene),
  { ssr: false },
);

export function MetricasCanvas() {
  // Esta escena fija colores como prop de material/luz, así que se vuelve
  // a montar al cambiar de tema para releer la paleta.
  const { theme } = useTheme();

  return <MetricasScene key={theme} />;
}
