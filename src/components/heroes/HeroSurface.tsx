import { hero, site } from "@/content/site";
import { SceneCanvas } from "@/components/three/heroes/SceneCanvas";
import { GlassCard } from "@/components/GlassCard";
import { HeroActions } from "./HeroActions";

/** Variante 2 — Superficie ondulada. La malla recede como un paisaje de datos. */
export function HeroSurface() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden pt-[72px]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <SceneCanvas name="surface" />
      </div>
      {/* Velo: blanco arriba (texto) → transparente abajo (malla visible) */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-bg/70 to-transparent"
        aria-hidden
      />

      <div className="shell relative z-10 flex w-full flex-1 flex-col justify-start pt-12 md:pt-20">
        <p className="kicker flex items-center gap-3 text-ink/60">
          <span className="inline-block h-2 w-2 bg-accent" />
          {hero.eyebrow} · {site.university}
        </p>
        <h1 className="display mt-7 max-w-5xl text-[clamp(2.75rem,11vw,9rem)] leading-[0.84]">
          {hero.headline.map((word, i) => (
            <span key={word} className="inline-block">
              {word}
              {i === hero.headline.length - 1 ? <span className="text-accent">.</span> : null}{" "}
            </span>
          ))}
        </h1>

        {/* Tarjeta liquid-glass: difumina la malla detrás y mantiene legible el texto + CTAs */}
        <GlassCard
          className="mt-10 w-fit max-w-xl"
          contentClassName="flex flex-col items-start gap-7 p-6 sm:p-8"
        >
          <p className="text-lg leading-relaxed text-ink sm:text-xl">{hero.intro}</p>
          <HeroActions />
        </GlassCard>
      </div>
    </section>
  );
}
