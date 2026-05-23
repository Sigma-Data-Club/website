"use client";

import { resources } from "@/content/site";
import { useState } from "react";
import { Reveal } from "../Reveal";

export function ResourceCategories() {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  const toggle = (index: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  let itemIndex = 0;

  return (
    <div className="mt-14">
      {resources.categories.map((category, categoryIndex) => {
        const expanded = open.has(categoryIndex);
        const panelId = `recursos-panel-${categoryIndex}`;
        const buttonId = `recursos-trigger-${categoryIndex}`;

        return (
          <div key={category.title} className="border-t border-line">
            <button
              type="button"
              id={buttonId}
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => toggle(categoryIndex)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:bg-paper md:px-2"
            >
              <span className="kicker text-ink/80">{category.title}</span>
              <span className="flex shrink-0 items-center gap-3 text-ink/50">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {category.items.length}
                </span>
                <span
                  className="display text-xl text-accent transition-transform duration-300"
                  style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
                  aria-hidden
                >
                  →
                </span>
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <ul className="overflow-hidden" aria-hidden={!expanded} inert={expanded ? undefined : true}>
                {category.items.map((item, i) => {
                  const n = itemIndex++;
                  const row = (
                    <>
                      <span className="display w-12 shrink-0 text-base text-ink/40">
                        {String(n + 1).padStart(2, "0")}
                      </span>
                      <span className="inline-block shrink-0 border border-ink px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                        {item.kind}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="display block text-xl leading-tight md:text-2xl">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-sm text-ink/55">{item.subtitle}</span>
                      </span>
                      {item.href ? (
                        <span
                          className="text-2xl text-accent transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden
                        >
                          ↗
                        </span>
                      ) : null}
                    </>
                  );

                  return (
                    <Reveal as="li" key={item.title} delay={i * 25} className="reveal-fast">
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-wrap items-center gap-4 border-t border-line py-6 transition-colors duration-300 hover:bg-paper md:flex-nowrap md:gap-6 md:px-4 md:py-7"
                        >
                          {row}
                        </a>
                      ) : (
                        <div className="flex flex-wrap items-center gap-4 border-t border-line py-6 md:flex-nowrap md:gap-6 md:px-4 md:py-7">
                          {row}
                        </div>
                      )}
                    </Reveal>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
      <div className="border-t border-line" />
    </div>
  );
}
