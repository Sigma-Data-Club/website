"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { projects } from "@/content/site";
import { Reveal } from "../Reveal";
import { ProjectCardCanvas } from "../three/ProjectCardCanvas";
import { isSmallScreen, prefersReducedMotion } from "../three/glsl";

type Project = (typeof projects.items)[number];

const CENTER = { x: 0.5, y: 0.5 };

export function ProjectCard({
  project,
  index,
  delay,
}: {
  project: Project;
  index: number;
  delay: number;
}) {
  const visualRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pointer, setPointer] = useState(CENTER);
  const [use3d, setUse3d] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, lift: 0 });

  useEffect(() => {
    setUse3d(!prefersReducedMotion() && !isSmallScreen());
  }, []);

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = visualRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setPointer({ x, y });
    setTilt({
      rx: (y - 0.5) * -5,
      ry: (x - 0.5) * 6,
      lift: -6,
    });
  }, []);

  const onEnter = useCallback(() => setHovered(true), []);
  const onLeave = useCallback(() => {
    setHovered(false);
    setPointer(CENTER);
    setTilt({ rx: 0, ry: 0, lift: 0 });
  }, []);

  const num = String(index + 1).padStart(2, "0");

  return (
    <Reveal delay={delay} className="h-full">
      <article
        className="group flex h-full flex-col bg-bg transition-colors duration-300 hover:bg-ink hover:text-bg"
        style={
          hovered
            ? {
                transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${tilt.lift}px)`,
                transition: "transform 0.12s ease-out, background-color 0.3s, color 0.3s",
              }
            : {
                transform: "perspective(1100px) translateY(0)",
                transition: "transform 0.45s ease-out, background-color 0.3s, color 0.3s",
              }
        }
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseMove={onMove}
      >
      <div
        ref={visualRef}
        className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-paper transition-colors duration-300 group-hover:bg-ink"
      >
        {use3d ? (
          <div className="absolute inset-0" aria-hidden>
            <ProjectCardCanvas index={index} pointer={pointer} hovered={hovered} />
          </div>
        ) : (
          <span className="display text-[7rem] leading-none text-transparent opacity-20 transition-all duration-300 [-webkit-text-stroke:1px_var(--color-ink)] group-hover:opacity-100 group-hover:[-webkit-text-stroke:1px_var(--color-bg)]">
            {num}
          </span>
        )}

        <span
          className={`display pointer-events-none relative z-10 text-[clamp(3.5rem,12vw,6.5rem)] leading-none text-transparent transition-all duration-300 [-webkit-text-stroke:1px_var(--color-ink)] group-hover:[-webkit-text-stroke:1px_var(--color-bg)] ${
            use3d ? "opacity-25 group-hover:opacity-40" : "opacity-20 group-hover:opacity-100"
          }`}
          aria-hidden
        >
          {num}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="kicker text-accent">{project.area}</span>
        <h3 className="display mt-4 line-clamp-2 min-h-[2.5lh] text-2xl leading-tight">
          {project.title}
        </h3>
        <p className="mt-3 line-clamp-3 min-h-[3lh] flex-1 text-ink/65 transition-colors duration-300 group-hover:text-bg/70">
          {project.desc}
        </p>
        <ul className="mt-6 flex min-h-[1.75rem] flex-wrap content-start gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="border border-ink/25 px-2.5 py-1 text-xs font-medium transition-colors duration-300 group-hover:border-bg/30"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
      </article>
    </Reveal>
  );
}
