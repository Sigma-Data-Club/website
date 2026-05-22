import { hero, site } from "@/content/site";
import { Hero3D } from "./three/Hero3D";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-[72px]"
    >
      {/* Escena 3D — ocupa el lateral derecho en desktop, el fondo en móvil */}
      <div className="pointer-events-none absolute inset-0 lg:left-[35%]" aria-hidden>
        <Hero3D />
      </div>

      {/* Velo degradado: garantiza la legibilidad del texto sobre la escena */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-bg lg:bg-gradient-to-r lg:from-bg lg:via-bg/30 lg:to-transparent"
        aria-hidden
      />

      {/* Contenido */}
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
                {i === hero.headline.length - 1 ? (
                  <span className="text-accent">.</span>
                ) : null}
              </span>
            ))}
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70 sm:text-xl">
            {hero.intro}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
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
              className="group inline-flex items-center justify-center gap-2 border border-ink px-7 py-4 text-base font-semibold text-ink transition-colors duration-300 hover:bg-ink hover:text-bg"
            >
              {hero.secondaryCta.label}
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                ↓
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Pie del hero: indicador de scroll */}
      <div className="shell relative z-10 mt-16 flex items-center justify-between pb-10">
        <a
          href="#club"
          className="flex items-center gap-3 text-sm font-medium text-ink/50 transition-colors hover:text-ink"
        >
          <span className="scroll-hint">↓</span>
          Desliza para explorar
        </a>
        <span className="kicker hidden text-ink/40 sm:block">
          Est. {site.year} · {site.symbol}
        </span>
      </div>
    </section>
  );
}
