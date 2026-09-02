import { AsteriskGlyph } from "@/components/GlyphIcons";
import { events } from "@/content/site";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

/** Filas de la retícula aún sin escribir: sugieren el calendario por venir. */
const GHOST_ROWS = 4;

export function Events() {
  return (
    <section id="eventos" className="scroll-mt-24 bg-paper py-24 md:py-36">
      <div className="shell">
        <SectionHeader number={events.number} label={events.label} title={events.title} />

        {/* Retícula fantasma y tarjeta comparten celda: la altura la marca
            la más alta de las dos, así nunca se desbordan entre sí. */}
        <div className="mt-14 grid">
          <ul
            aria-hidden
            className="col-start-1 row-start-1 flex flex-col select-none"
          >
            {Array.from({ length: GHOST_ROWS }).map((_, i) => (
              <li
                key={i}
                className="flex min-h-[5.5rem] flex-1 items-center border-t border-ink/15 md:px-4"
                style={{ opacity: 1 - i * 0.22 }}
              >
                <span className="flex items-center gap-2 text-ink/20">
                  <AsteriskGlyph className="size-3" />
                  <AsteriskGlyph className="size-3" />
                </span>
              </li>
            ))}
          </ul>
          <div className="col-start-1 row-start-1 self-end border-t border-ink/15" />

          {/* Halo que difumina las líneas justo detrás de la tarjeta. */}
          <div
            aria-hidden
            className="pointer-events-none col-start-1 row-start-1 bg-[radial-gradient(60%_60%_at_50%_50%,var(--color-paper)_0%,var(--color-paper)_55%,transparent_100%)]"
          />

          <div className="col-start-1 row-start-1 flex items-center justify-center px-1 py-6">
            <Reveal>
              <div className="relative max-w-lg border border-ink bg-bg px-8 py-10 text-center md:px-14 md:py-12">
                <span aria-hidden className="absolute right-0 top-0 h-2.5 w-2.5 bg-accent" />
                <p className="kicker text-ink/50">Próximamente</p>
                <h3 className="display mt-4 text-3xl md:text-4xl">
                  Estamos preparando el próximo curso
                </h3>
                <p className="mt-4 text-ink/70">
                  Talleres, charlas y hackatones. Publicaremos aquí las fechas en cuanto
                  estén cerradas.
                </p>
                <a
                  href="#unete"
                  className="group mt-8 inline-flex items-center justify-center gap-2 border border-ink bg-ink px-7 py-4 text-base font-semibold text-bg transition-colors duration-300 hover:border-accent hover:bg-accent"
                >
                  Únete para enterarte
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
      </div>
    </section>
  );
}
