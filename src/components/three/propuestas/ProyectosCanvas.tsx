"use client";

import dynamic from "next/dynamic";

const ProyectosScene = dynamic(
  () => import("./ProyectosScene").then((m) => m.ProyectosScene),
  { ssr: false },
);

export function ProyectosCanvas() {
  return <ProyectosScene />;
}
