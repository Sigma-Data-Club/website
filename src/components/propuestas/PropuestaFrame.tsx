"use client";

import Link from "next/link";
import { getPropuesta, propuestas, type PropuestaSlug } from "@/content/propuestas";
import { site } from "@/content/site";

export function PropuestaFrame({ slug }: { slug: PropuestaSlug }) {
  const p = getPropuesta(slug);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
      <header className="shell flex items-start justify-between pt-6">
        <Link
          href="/propuestas"
          className="group pointer-events-auto flex items-baseline gap-2"
          aria-label="Volver al índice de propuestas"
        >
          <span className="display text-2xl leading-none text-accent transition-transform duration-500 group-hover:rotate-[-8deg]">
            {site.symbol}
          </span>
          <span className="kicker text-ink/70 transition-colors group-hover:text-ink">
            ← Propuestas
          </span>
        </Link>

        <nav aria-label="Propuestas" className="pointer-events-auto flex flex-wrap items-center justify-end gap-3 sm:gap-4">
          {propuestas.map((item) => {
            const active = item.slug === slug;
            return (
              <Link
                key={item.slug}
                href={`/propuestas/${item.slug}`}
                aria-current={active ? "page" : undefined}
                title={item.title}
                className={`kicker transition-colors ${
                  active ? "text-accent" : "text-ink/35 hover:text-ink"
                }`}
              >
                {item.index}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="shell pb-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="kicker flex items-center gap-3 text-ink/60">
              <span className="inline-block h-2 w-2 bg-accent" />
              {p.index} — {p.section}
            </p>
            <h1 className="display mt-4 text-[clamp(2rem,6vw,4rem)] leading-[0.9]">
              {p.title}
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70 sm:text-base">
              {p.intro}
            </p>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-ink/50 sm:text-sm">
              {p.benefit}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end sm:text-right">
            <span className="kicker text-ink/40">{p.technique}</span>
            <Link
              href={`/${p.anchor}`}
              className="pointer-events-auto link-underline text-sm font-semibold text-ink/60 hover:text-ink"
            >
              Ver sección en la home {p.anchor} →
            </Link>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-ink/55">
              <span className="scroll-hint text-accent" aria-hidden>
                ↻
              </span>
              {p.hint}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
