"use client";

import dynamic from "next/dynamic";

const GraphScene = dynamic(
  () => import("./GraphScene").then((m) => m.GraphScene),
  { ssr: false },
);

export function GraphCanvas() {
  return <GraphScene />;
}
