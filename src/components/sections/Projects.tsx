import { AsteriskGlyph } from "@/components/GlyphIcons";
import { projects } from "@/content/site";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

/** Tarjetas fantasma: una por columna disponible, para no apilar vacío en móvil. */
const GHOST_CARDS = ["flex", "hidden md:flex", "hidden lg:flex"];

export function Projects() {
  return (
    <section id="proyectos" className="shell scroll-mt-24 py-24 md:py-36">
      <SectionHeader number={projects.number} label={projects.label} title={projects.title} />

      {/* Retícula fantasma y tarjeta comparten celda: la altura la marca
          la más alta de las dos, así nunca se desbordan entre sí. */}
      <div className="mt-14 grid">
        <div
          aria-hidden
          className="col-start-1 row-start-1 grid select-none gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3"
        >
          {GHOST_CARDS.map((visibility, i) => (
            <div
              key={i}
              className={`${visibility} flex-col bg-bg`}
              style={{ opacity: 1 - i * 0.25 }}
            >
              <div className="flex aspect-[16/10] items-center justify-center bg-paper">
                <span className="display text-[7rem] leading-none text-transparent opacity-15 [-webkit-text-stroke:1px_var(--color-ink)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <span className="flex items-center gap-2 p-6 text-ink/20">
                <AsteriskGlyph className="size-3" />
                <AsteriskGlyph className="size-3" />
              </span>
            </div>
          ))}
        </div>

        {/* Halo que difumina la retícula justo detrás de la tarjeta. */}
        <div
          aria-hidden
          className="pointer-events-none col-start-1 row-start-1 bg-[radial-gradient(60%_60%_at_50%_50%,var(--color-bg)_0%,var(--color-bg)_55%,transparent_100%)]"
        />

        <div className="col-start-1 row-start-1 flex items-center justify-center px-1 py-6">
          <Reveal>
            <div className="relative max-w-lg border border-ink bg-paper px-8 py-10 text-center md:px-14 md:py-12">
              <span aria-hidden className="absolute right-0 top-0 h-2.5 w-2.5 bg-accent" />
              <p className="kicker text-ink/50">En construcción</p>
              <h3 className="display mt-4 text-3xl md:text-4xl">
                Los proyectos están en marcha
              </h3>
              <p className="mt-4 text-ink/70">
                Iremos publicando aquí cada proyecto
                conforme avance
              </p>
              <a
                href="#unete"
                className="group mt-8 inline-flex items-center justify-center gap-2 border border-ink bg-ink px-7 py-4 text-base font-semibold text-bg transition-colors duration-300 hover:border-accent hover:bg-accent"
              >
                Únete a un equipo
                <span
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
