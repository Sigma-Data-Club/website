"use client";

import dynamic from "next/dynamic";

const FieldScene = dynamic(
  () => import("./FieldScene").then((m) => m.FieldScene),
  { ssr: false },
);

export function FieldCanvas() {
  return <FieldScene />;
}
