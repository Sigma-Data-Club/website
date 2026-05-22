"use client";

import dynamic from "next/dynamic";

/** Carga la nube de la sección "Únete" solo en cliente (ssr:false). */
const JoinCloudScene = dynamic(
  () => import("./JoinCloudScene").then((m) => m.JoinCloudScene),
  { ssr: false },
);

export function JoinCloudCanvas() {
  return <JoinCloudScene />;
}
