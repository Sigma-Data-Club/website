import { resources } from "@/content/site";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export function Resources() {
  return (
    <section id="recursos" className="shell scroll-mt-24 py-24 md:py-36">
      <SectionHeader number={resources.number} label={resources.label} title={resources.title} />

      <ul className="mt-14">
        {resources.items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i * 50}>
            <a
              href={item.href}
              className="group flex items-center gap-6 border-t border-line py-7 transition-colors duration-300 hover:bg-paper md:px-4"
            >
              <span className="display w-12 shrink-0 text-base text-ink/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="display flex-1 text-2xl leading-tight md:text-3xl">
                {item.title}
              </span>
              <span className="hidden text-xs font-semibold uppercase tracking-wide text-ink/50 sm:block">
                {item.meta}
              </span>
              <span
                className="text-2xl text-accent transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                ↗
              </span>
            </a>
          </Reveal>
        ))}
        <li className="border-t border-line" />
      </ul>
    </section>
  );
}
