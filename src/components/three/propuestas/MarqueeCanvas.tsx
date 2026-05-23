"use client";

import dynamic from "next/dynamic";

const MarqueeScene = dynamic(
  () => import("./MarqueeScene").then((m) => m.MarqueeScene),
  { ssr: false },
);

export function MarqueeCanvas() {
  return <MarqueeScene />;
}
