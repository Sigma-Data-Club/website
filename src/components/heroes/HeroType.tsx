import { hero, site } from "@/content/site";
import { SceneCanvas } from "@/components/three/heroes/SceneCanvas";
import { HeroActions } from "./HeroActions";

/** Variante 4 — Tipográfico XL. El titular manda; el icosaedro es un acento mínimo. */
export function HeroType() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-[72px]">
      {/* Icosaedro wireframe, como objeto-escultura a la derecha */}
      <div
        className="pointer-events-none absolute right-[-12%] top-[14%] h-[48vmin] w-[48vmin] md:right-[1%] md:top-1/2 md:h-[64vmin] md:w-[64vmin] md:-translate-y-1/2"
        aria-hidden
      >
        <SceneCanvas name="ico" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/40 to-transparent"
        aria-hidden
      />

      <div className="shell relative z-10 w-full">
        <p className="kicker flex items-center gap-3 text-ink/60">
          <span className="inline-block h-2 w-2 bg-accent" />
          {hero.eyebrow} · {site.university}
        </p>
        <h1 className="display mt-7 text-[clamp(3.25rem,14vw,12rem)] uppercase leading-[0.82]">
          {hero.headline.map((line, i) => (
            <span key={line} className="block">
              {line.replace(".", "")}
              {i === hero.headline.length - 1 ? <span className="text-accent">.</span> : null}
            </span>
          ))}
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-ink/70 sm:text-xl">
          {hero.intro}
        </p>
        <HeroActions className="mt-10" />
      </div>
    </section>
  );
}
