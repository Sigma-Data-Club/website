"use client";

import { useEffect, useRef, useState } from "react";
import { team } from "@/content/site";
import { SectionHeader } from "../SectionHeader";
import { useReducedMotion } from "../useReducedMotion";
import { ClubCrowdCanvas } from "../three/ClubCrowdCanvas";

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function TeamCrowdStage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const progressRef = useRef(0);
  const [placedCount, setPlacedCount] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (reducedMotion) {
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
  }, [reducedMotion]);

  return (
    <div
      ref={trackRef}
      className={reducedMotion ? "relative" : "relative h-[145vh] md:h-[165vh]"}
    >
      <div
        className={
          reducedMotion
            ? "relative min-h-[72vh] overflow-hidden md:min-h-[76vh]"
            : "sticky top-0 z-0 min-h-svh overflow-hidden"
        }
      >
        <div
          className="absolute inset-0 z-0 pointer-events-none [@media(hover:hover)_and_(pointer:fine)]:pointer-events-auto"
          aria-hidden
        >
          <ClubCrowdCanvas scrollProgressRef={progressRef} />
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-48 bg-linear-to-b from-paper via-paper/75 to-transparent md:h-56"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-t from-paper/80 to-transparent"
          aria-hidden
        />

        <div className="shell pointer-events-none relative z-20 pt-6 md:pt-10">
          <SectionHeader
            number={team.number}
            label={team.label}
            title={team.title}
          />

          <div className="mt-8 max-w-xl md:mt-10">
            <p className="kicker text-ink/55">{team.crowd.kicker}</p>
            <p className="mt-2 text-lg leading-relaxed text-ink/75">
              <span className="font-medium tabular-nums text-ink">{placedCount}</span>
              <span className="text-ink/45"> / {team.memberCount}</span> {team.crowd.line}
            </p>
            <p className="display mt-4 text-[clamp(2rem,6vw,3.75rem)] leading-none! text-ink/90">
              {placedCount > 0 ? placedCount : team.memberCount}
              <span className="ml-2 text-[0.35em] font-sans font-medium tracking-wide text-accent">
                miembros
              </span>
            </p>
            {placedCount < team.memberCount ? (
              <p className="mt-3 text-xs font-medium uppercase tracking-widest text-ink/40">
                Sigue bajando para completar la cuadrícula
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
