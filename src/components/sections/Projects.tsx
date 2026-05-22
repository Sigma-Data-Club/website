import { projects } from "@/content/site";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export function Projects() {
  return (
    <section id="proyectos" className="shell scroll-mt-24 py-24 md:py-36">
      <SectionHeader number={projects.number} label={projects.label} title={projects.title} />

      <div className="mt-14 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {projects.items.map((project, i) => (
          <Reveal
            key={project.title}
            delay={(i % 3) * 80}
            as="article"
            className="group flex flex-col bg-bg transition-colors duration-300 hover:bg-ink hover:text-bg"
          >
            {/* Visual de relleno: número en contorno (sustituible por imagen) */}
            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-paper transition-colors duration-300 group-hover:bg-ink">
              <span className="display text-[7rem] leading-none text-transparent opacity-20 transition-all duration-300 [-webkit-text-stroke:1px_var(--color-ink)] group-hover:opacity-100 group-hover:[-webkit-text-stroke:1px_var(--color-bg)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute right-4 top-4 h-3 w-3 bg-accent" aria-hidden />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <span className="kicker text-accent">{project.area}</span>
              <h3 className="display mt-4 text-2xl leading-tight">{project.title}</h3>
              <p className="mt-3 flex-1 text-ink/65 transition-colors duration-300 group-hover:text-bg/70">
                {project.desc}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border border-ink/25 px-2.5 py-1 text-xs font-medium transition-colors duration-300 group-hover:border-bg/30"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
