"use client";

import dynamic from "next/dynamic";

const MetricasScene = dynamic(
  () => import("./MetricasScene").then((m) => m.MetricasScene),
  { ssr: false },
);

export function MetricasCanvas() {
  return <MetricasScene />;
}
