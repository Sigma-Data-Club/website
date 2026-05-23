"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { getProjectVisual } from "@/content/projectVisuals";
import { prefersReducedMotion } from "./glsl";
import { ProjectVisual } from "./projectCard/visuals";

export type ProjectCardPointer = { x: number; y: number };

function InvalidateOnPointer({
  pointer,
  hovered,
}: {
  pointer: ProjectCardPointer;
  hovered: boolean;
}) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
  }, [pointer.x, pointer.y, hovered, invalidate]);
  return null;
}

export function ProjectCardScene({
  index,
  pointer,
  hovered,
}: {
  index: number;
  pointer: ProjectCardPointer;
  hovered: boolean;
}) {
  const [reduced] = useState(prefersReducedMotion);
  const visual = getProjectVisual(index);
  return (
    <Canvas
      camera={{ position: [0, 0.2, 3.4], fov: 38 }}
      dpr={[1, 1.75]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 4, 5]} intensity={0.55} />
      <InvalidateOnPointer pointer={pointer} hovered={hovered} />
      <ProjectVisual
        visualId={visual.id}
        pointer={pointer}
        hovered={hovered}
        reduced={reduced}
      />
    </Canvas>
  );
}
