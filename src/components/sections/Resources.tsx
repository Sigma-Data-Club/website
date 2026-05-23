import { resources } from "@/content/site";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";
import { ResourceCategories } from "./ResourceCategories";

export function Resources() {
  return (
    <section id="recursos" className="shell scroll-mt-24 py-24 md:py-36">
      <SectionHeader number={resources.number} label={resources.label} title={resources.title} />

      <Reveal as="p" className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg">
        {resources.intro}
      </Reveal>

      <ResourceCategories />
    </section>
  );
}
