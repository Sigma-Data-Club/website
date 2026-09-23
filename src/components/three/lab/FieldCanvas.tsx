"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../../ThemeProvider";

const FieldScene = dynamic(
  () => import("./FieldScene").then((m) => m.FieldScene),
  { ssr: false },
);

export function FieldCanvas() {
  // Esta escena fija colores como prop de material/luz, así que se vuelve
  // a montar al cambiar de tema para releer la paleta.
  const { theme } = useTheme();

  return <FieldScene key={theme} />;
}
