import { hero, site } from "@/content/site";
import { SceneCanvas } from "@/components/three/heroes/SceneCanvas";
import { HeroActions } from "./HeroActions";

/** Variante 1 — Esfera de datos. Texto a la izquierda, escena a la derecha. */
export function HeroSphere() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-[72px]">
      <div className="pointer-events-none absolute inset-0 lg:left-[35%]" aria-hidden>
        <SceneCanvas name="sphere" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-bg lg:bg-gradient-to-r lg:from-bg lg:via-bg/30 lg:to-transparent"
        aria-hidden
      />

      <div className="shell relative z-10 w-full">
        <div className="max-w-4xl">
          <p className="kicker flex items-center gap-3 text-ink/60">
            <span className="inline-block h-2 w-2 bg-accent" />
            {hero.eyebrow} · {site.university}
          </p>
          <h1 className="display mt-7 text-[clamp(3rem,12vw,9.5rem)] leading-[0.86]">
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
          <HeroActions className="mt-10" />
        </div>
      </div>
    </section>
  );
}
