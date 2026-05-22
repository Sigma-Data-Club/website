"use client";

import dynamic from "next/dynamic";

const SigmaScene = dynamic(
  () => import("./SigmaScene").then((m) => m.SigmaScene),
  { ssr: false },
);

export function SigmaCanvas() {
  return <SigmaScene />;
}
