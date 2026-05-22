"use client";

import type { ReactNode } from "react";
import { LabFrame } from "./LabFrame";
import type { LabSlug } from "@/content/lab";

/**
 * Escenario a pantalla completa para cada experimento: lienzo 3D a sangre
 * + cromo editorial superpuesto. La página solo decide qué <canvas> entra.
 */
export function LabStage({
  slug,
  children,
}: {
  slug: LabSlug;
  children: ReactNode;
}) {
  return (
    <main className="relative h-svh w-full overflow-hidden bg-bg">
      <div className="absolute inset-0">{children}</div>
      <LabFrame slug={slug} />
    </main>
  );
}
