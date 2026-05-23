"use client";

import dynamic from "next/dynamic";

const EquipoScene = dynamic(
  () => import("./EquipoScene").then((m) => m.EquipoScene),
  { ssr: false },
);

export function EquipoCanvas() {
  return <EquipoScene />;
}
