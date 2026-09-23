import { hero, site } from "@/content/site";
import { SurfaceCanvas } from "./three/SurfaceCanvas";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden pt-[72px]"
    >
      {/* Escena 3D — superficie ondulada que recede como un paisaje de datos */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <SurfaceCanvas />
      </div>

      {/* Velo: blanco arriba (texto) → transparente abajo (malla visible) */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-bg/70 to-transparent"
        aria-hidden
      />

      {/* Contenido */}
      <div className="shell relative z-10 flex w-full flex-1 flex-col justify-start pt-12 md:pt-20">
        <p className="kicker flex items-center gap-3 text-ink/60">
          <span className="inline-block h-2 w-2 bg-accent" />
          {hero.eyebrow} · {site.university}
        </p>

        <h1 className="display relative z-20 mt-7 max-w-5xl text-[clamp(2.75rem,11vw,9rem)] leading-[0.84]">
          {hero.headline.map((word, i) => (
            <span key={word} className="inline-block">
              {word}
              {i === hero.headline.length - 1 ? <span className="text-accent">.</span> : null}{" "}
            </span>
          ))}
        </h1>

        {/* El halo es el fondo del propio párrafo: centrado en el texto, sin caja.
            Va por debajo del título (z-20). */}
        <div className="relative mt-12 max-w-xl">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-4 -inset-y-8 bg-[radial-gradient(65%_50%_at_50%_50%,var(--color-bg)_0%,var(--color-bg)_60%,rgba(255,255,255,0)_100%)]"
          />
          <p className="relative z-10 text-lg leading-relaxed text-ink sm:text-xl">
            {hero.intro}
          </p>
        </div>

        <div className="relative z-10 mt-8 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={hero.primaryCta.href}
            className="group inline-flex items-center justify-center gap-2 border border-ink bg-ink px-7 py-4 text-base font-semibold text-bg transition-colors duration-300 hover:border-accent hover:bg-accent"
          >
            {hero.primaryCta.label}
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </a>
          <a
            href={hero.secondaryCta.href}
            className="group inline-flex items-center justify-center gap-2 border border-ink bg-bg px-7 py-4 text-base font-semibold text-ink transition-colors duration-300 hover:bg-inverse hover:text-on-inverse"
          >
            {hero.secondaryCta.label}
            <span className="transition-transform duration-300 group-hover:translate-y-1" aria-hidden>
              ↓
            </span>
          </a>
        </div>
      </div>

      {/* Pie del hero: indicador de scroll */}
      <div className="shell relative z-10 mt-12 flex items-center justify-between pb-10">
        <a
          href="#club"
          className="flex items-center gap-3 text-sm font-medium text-ink/50 transition-colors hover:text-ink"
        >
          <span className="scroll-hint">↓</span>
          Desliza para explorar
        </a>
      </div>
    </section>
  );
}
