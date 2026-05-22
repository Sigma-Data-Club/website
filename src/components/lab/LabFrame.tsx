"use client";

import Link from "next/link";
import { getExperiment, labExperiments, type LabSlug } from "@/content/lab";
import { site } from "@/content/site";

/**
 * Cromo editorial compartido por las páginas del laboratorio.
 * Es una capa superpuesta (pointer-events-none) para no robarle la
 * interacción a la escena 3D; solo los enlaces reciben puntero.
 */
export function LabFrame({ slug }: { slug: LabSlug }) {
  const exp = getExperiment(slug);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
      {/* ---------- Barra superior ---------- */}
      <header className="shell flex items-start justify-between pt-6">
        <Link
          href="/"
          className="group pointer-events-auto flex items-baseline gap-2"
          aria-label={`Volver a ${site.name}`}
        >
          <span className="display text-2xl leading-none text-accent transition-transform duration-500 group-hover:rotate-[-8deg]">
            {site.symbol}
          </span>
          <span className="kicker text-ink/70 transition-colors group-hover:text-ink">
            ← Inicio
          </span>
        </Link>

        {/* Conmutador de experimentos */}
        <nav
          aria-label="Experimentos"
          className="pointer-events-auto flex items-center gap-4"
        >
          {labExperiments.map((e) => {
            const active = e.slug === slug;
            return (
              <Link
                key={e.slug}
                href={`/lab/${e.slug}`}
                aria-current={active ? "page" : undefined}
                title={e.title}
                className={`kicker transition-colors ${
                  active
                    ? "text-accent"
                    : "text-ink/35 hover:text-ink"
                }`}
              >
                {e.index}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* ---------- Pie editorial ---------- */}
      <div className="shell pb-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="kicker flex items-center gap-3 text-ink/60">
              <span className="inline-block h-2 w-2 bg-accent" />
              {exp.index} — {exp.kind}
            </p>
            <h1 className="display mt-4 text-[clamp(2rem,6vw,4rem)] leading-[0.9]">
              {exp.title}
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70 sm:text-base">
              {exp.intro}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end sm:text-right">
            <span className="kicker text-ink/40">{exp.technique}</span>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-ink/55">
              <span className="scroll-hint text-accent" aria-hidden>
                ↻
              </span>
              {exp.hint}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
