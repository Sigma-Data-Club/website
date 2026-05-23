"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";

const ClubCrowdScene = dynamic(
  () => import("./ClubCrowdScene").then((m) => m.ClubCrowdScene),
  { ssr: false },
);

export function ClubCrowdCanvas({
  scrollProgressRef,
}: {
  scrollProgressRef: RefObject<number>;
}) {
  return <ClubCrowdScene scrollProgressRef={scrollProgressRef} />;
}
