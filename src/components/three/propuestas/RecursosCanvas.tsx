"use client";

import dynamic from "next/dynamic";

const RecursosScene = dynamic(
  () => import("./RecursosScene").then((m) => m.RecursosScene),
  { ssr: false },
);

export function RecursosCanvas() {
  return <RecursosScene />;
}
