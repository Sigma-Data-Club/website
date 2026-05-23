import { projects } from "@/content/site";
import { SectionHeader } from "../SectionHeader";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  return (
    <section id="proyectos" className="shell scroll-mt-24 py-24 md:py-36">
      <SectionHeader number={projects.number} label={projects.label} title={projects.title} />

      <div className="mt-14 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {projects.items.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={i}
            delay={(i % 3) * 80}
          />
        ))}
      </div>
    </section>
  );
}
