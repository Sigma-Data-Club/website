"use client";

import dynamic from "next/dynamic";

const EventosScene = dynamic(
  () => import("./EventosScene").then((m) => m.EventosScene),
  { ssr: false },
);

export function EventosCanvas() {
  return <EventosScene />;
}
