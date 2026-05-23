"use client";

import type { ReactNode } from "react";
import { PropuestaFrame } from "./PropuestaFrame";
import type { PropuestaSlug } from "@/content/propuestas";

export function PropuestaStage({
  slug,
  children,
}: {
  slug: PropuestaSlug;
  children: ReactNode;
}) {
  return (
    <main className="relative h-svh w-full overflow-hidden bg-bg">
      <div className="absolute inset-0">{children}</div>
      <PropuestaFrame slug={slug} />
    </main>
  );
}
