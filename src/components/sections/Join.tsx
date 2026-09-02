import { join, site } from "@/content/site";
import { SectionHeader } from "../SectionHeader";
import { JoinCloudCanvas } from "../three/JoinCloudCanvas";

export function Join() {
  return (
    <section id="unete" className="scroll-mt-24 py-24 md:py-32">
      <div className="shell">
        <SectionHeader number={join.number} label={join.label} />

        {/* Escenario: la σ del club emerge de los datos (respira casi formada).
            El título se superpone abajo, sobre el desvanecido, como en el hero. */}
        <div className="relative mt-10 flex min-h-[48vh] items-end overflow-hidden pb-3 md:mt-12">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <JoinCloudCanvas />
            {/* Solo difuminamos la base (para el título); el resto de la σ
                queda limpia para que se reconozca el trazo superior. */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg via-bg/85 to-transparent" />
          </div>
          <h2 className="display relative text-[clamp(2.5rem,7vw,5.5rem)] leading-none!">
            {join.title}
          </h2>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Lado izquierdo: invitación */}
          <p className="max-w-md text-lg leading-relaxed text-ink/70">
            {join.body}
          </p>

          {/* Lado derecho: llamada a la acción */}
          <div className="flex flex-col items-start">
            <a
              href={join.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 border border-ink bg-ink px-7 py-4 text-base font-semibold text-bg transition-colors duration-300 hover:border-accent hover:bg-accent"
            >
              Quiero unirme
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </a>

            <div className="pt-12">
              <p className="kicker text-ink/50">O escríbenos directamente</p>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mt-3 inline-block text-2xl font-medium md:text-3xl"
              >
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
