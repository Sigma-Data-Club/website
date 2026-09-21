"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../../ThemeProvider";

const EventosScene = dynamic(
  () => import("./EventosScene").then((m) => m.EventosScene),
  { ssr: false },
);

export function EventosCanvas() {
  // Esta escena fija colores como prop de material/luz, así que se vuelve
  // a montar al cambiar de tema para releer la paleta.
  const { theme } = useTheme();

  return <EventosScene key={theme} />;
}
