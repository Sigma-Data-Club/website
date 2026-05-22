import { hero, site } from "@/content/site";
import { SceneCanvas } from "@/components/three/heroes/SceneCanvas";
import { HeroActions } from "./HeroActions";

/** Variante 3 — Grafo de nodos. Texto centrado, red de datos detrás. */
export function HeroGraph() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-[72px] text-center">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <SceneCanvas name="graph" />
      </div>
      {/* Velo radial: aclara el centro para el texto, deja ver la red en los bordes */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-bg)_0%,color-mix(in_srgb,var(--color-bg)_55%,transparent)_42%,transparent_72%)]"
        aria-hidden
      />

      <div className="shell relative z-10 flex w-full flex-col items-center">
        <p className="kicker flex items-center gap-3 text-ink/60">
          <span className="inline-block h-2 w-2 bg-accent" />
          {hero.eyebrow} · {site.university}
        </p>
        <h1 className="display mt-7 text-[clamp(3rem,12vw,9rem)] leading-[0.86]">
          {hero.headline.map((line, i) => (
            <span key={line} className="block">
              {line}
              {i === hero.headline.length - 1 ? <span className="text-accent">.</span> : null}
            </span>
          ))}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70 sm:text-xl">
          {hero.intro}
        </p>
        <HeroActions className="mt-10 justify-center" />
      </div>
    </section>
  );
}
