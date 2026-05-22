import { about } from "@/content/site";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export function About() {
  return (
    <section id="club" className="shell scroll-mt-24 py-24 md:py-36">
      <SectionHeader number={about.number} label={about.label} />

      {/* Declaración + cuerpo */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <Reveal
          as="h3"
          className="display text-[clamp(1.75rem,4.5vw,3.5rem)] leading-[1.0]"
        >
          {about.statement}
        </Reveal>
        <div className="space-y-5 text-lg leading-relaxed text-ink/70 lg:pt-3">
          {about.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Pilares */}
      <div className="mt-20 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {about.pillars.map((pillar, i) => (
          <Reveal
            key={pillar.title}
            delay={i * 70}
            className="flex flex-col bg-bg p-7 transition-colors duration-300 hover:bg-paper"
          >
            <span className="kicker text-accent">0{i + 1}</span>
            <h4 className="display mt-8 text-xl">{pillar.title}</h4>
            <p className="mt-3 text-ink/65">{pillar.desc}</p>
          </Reveal>
        ))}
      </div>

      {/* Métricas */}
      <div className="mt-px grid grid-cols-2 gap-px border border-t-0 border-line bg-line lg:grid-cols-4">
        {about.stats.map((stat) => (
          <div key={stat.label} className="bg-bg p-7">
            <p className="display text-[clamp(2.5rem,6vw,4.5rem)] leading-none">
              {stat.value}
            </p>
            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-ink/55">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
