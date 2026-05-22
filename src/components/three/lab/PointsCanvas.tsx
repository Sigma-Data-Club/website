"use client";

import dynamic from "next/dynamic";

const PointsScene = dynamic(
  () => import("./PointsScene").then((m) => m.PointsScene),
  { ssr: false },
);

export function PointsCanvas() {
  return <PointsScene />;
}
