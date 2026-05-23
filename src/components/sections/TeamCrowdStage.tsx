"use client";

import { useEffect, useRef, useState } from "react";
import { team } from "@/content/site";
import { ClubCrowdCanvas } from "../three/ClubCrowdCanvas";
import { prefersReducedMotion } from "../three/glsl";

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/**
 * Bloque sticky: al hacer scroll en la página, el progreso 0→1
 * va colocando miembros en la formación 3D.
 */
export function TeamCrowdStage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(prefersReducedMotion() ? 1 : 0);
  const [placedCount, setPlacedCount] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (prefersReducedMotion()) {
      progressRef.current = 1;
      setPlacedCount(team.memberCount);
      return;
    }

    let raf = 0;
    const update = () => {
      const rect = track.getBoundingClientRect();
      const scrollable = track.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? clamp01(-rect.top / scrollable) : 1;
      progressRef.current = p;
      setPlacedCount(Math.min(team.memberCount, Math.round(p * team.memberCount)));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={trackRef} className="relative h-[200vh] md:h-[240vh]">
      <div className="sticky top-0 z-0 flex min-h-[min(100svh,52rem)] flex-col justify-end overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          <ClubCrowdCanvas scrollProgressRef={progressRef} />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-paper via-paper/90 to-transparent" />
        </div>

        <div className="shell relative flex min-h-[44vh] flex-col justify-end pb-6 md:min-h-[52vh] md:pb-8">
          <p className="kicker text-ink/55">{team.crowd.kicker}</p>
          <p className="mt-2 max-w-lg text-lg leading-relaxed text-ink/75">
            <span className="font-medium tabular-nums text-ink">{placedCount}</span>
            <span className="text-ink/45"> / {team.memberCount}</span> {team.crowd.line}
          </p>
          <p className="display mt-4 text-[clamp(2.5rem,8vw,4.5rem)] leading-none! text-ink/90">
            {placedCount > 0 ? placedCount : team.memberCount}
            <span className="ml-2 text-[0.35em] font-sans font-medium tracking-wide text-accent">
              miembros
            </span>
          </p>
          {placedCount < team.memberCount ? (
            <p className="mt-4 text-xs font-medium uppercase tracking-widest text-ink/40">
              Sigue bajando para completar la cuadrícula
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
