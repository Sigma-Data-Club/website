"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../ThemeProvider";
import type { RefObject } from "react";

const ClubCrowdScene = dynamic(
  () => import("./ClubCrowdScene").then((m) => m.ClubCrowdScene),
  { ssr: false },
);

export function ClubCrowdCanvas({
  scrollProgressRef,
}: {
  scrollProgressRef: RefObject<number>;
}) {
  // Esta escena fija colores como prop de material/luz, así que se vuelve
  // a montar al cambiar de tema para releer la paleta.
  const { theme } = useTheme();

  return <ClubCrowdScene key={theme} scrollProgressRef={scrollProgressRef} />;
}
