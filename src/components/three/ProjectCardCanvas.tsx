"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../ThemeProvider";
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
  // Esta escena fija colores como prop de material/luz, así que se vuelve
  // a montar al cambiar de tema para releer la paleta.
  const { theme } = useTheme();

  return <ProjectCardScene key={theme} index={index} pointer={pointer} hovered={hovered} />;
}
