"use client";

import dynamic from "next/dynamic";
import type { ProjectCardPointer } from "./ProjectCardScene";

const ProjectCardScene = dynamic(
  () => import("./ProjectCardScene").then((m) => m.ProjectCardScene),
  { ssr: false },
);

export function ProjectCardCanvas({
  index,
  pointer,
  hovered,
}: {
  index: number;
  pointer: ProjectCardPointer;
  hovered: boolean;
}) {
  return <ProjectCardScene index={index} pointer={pointer} hovered={hovered} />;
}
