"use client";

import dynamic from "next/dynamic";

const PilaresScene = dynamic(
  () => import("./PilaresScene").then((m) => m.PilaresScene),
  { ssr: false },
);

export function PilaresCanvas() {
  return <PilaresScene />;
}
