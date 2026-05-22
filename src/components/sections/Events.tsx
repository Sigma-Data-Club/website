import { events } from "@/content/site";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export function Events() {
  return (
    <section id="eventos" className="scroll-mt-24 bg-paper py-24 md:py-36">
      <div className="shell">
        <SectionHeader number={events.number} label={events.label} title={events.title} />

        <ul className="mt-14">
          {events.items.map((event, i) => (
            <Reveal as="li" key={event.title} delay={i * 50}>
              <a
                href="#unete"
                className="group grid grid-cols-1 items-baseline gap-2 border-t border-ink/15 py-7 transition-colors duration-300 hover:bg-bg md:grid-cols-12 md:gap-6 md:px-4"
              >
                <span className="display text-base text-ink/50 md:col-span-2">
                  {event.date}
                </span>
                <span className="display text-2xl leading-tight md:col-span-6 md:text-3xl">
                  {event.title}
                </span>
                <span className="md:col-span-2">
                  <span className="inline-block border border-ink px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    {event.type}
                  </span>
                </span>
                <span className="flex items-center justify-between text-ink/60 md:col-span-2 md:justify-end md:gap-3">
                  {event.place}
                  <span
                    className="text-accent opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    aria-hidden
                  >
                    →
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
        <div className="border-t border-ink/15" />
      </div>
    </section>
  );
}
