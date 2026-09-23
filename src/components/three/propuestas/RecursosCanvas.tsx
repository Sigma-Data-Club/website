"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../../ThemeProvider";

const RecursosScene = dynamic(
  () => import("./RecursosScene").then((m) => m.RecursosScene),
  { ssr: false },
);

export function RecursosCanvas() {
  // Esta escena fija colores como prop de material/luz, así que se vuelve
  // a montar al cambiar de tema para releer la paleta.
  const { theme } = useTheme();

  return <RecursosScene key={theme} />;
}
