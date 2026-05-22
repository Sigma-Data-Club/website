import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { labExperiments } from "@/content/lab";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Laboratorio 3D",
  description:
    "Cuatro exploraciones de UI/UX con Three.js para el Sigma Data Club: nube de puntos, campo instanciado, tipografía 3D y grafo de comunidad.",
};

export default function LabIndex() {
  return (
    <main className="min-h-svh bg-bg">
      {/* Cabecera */}
      <header className="shell flex items-center justify-between pt-8">
        <Link href="/" className="group flex items-baseline gap-2" aria-label={`Volver a ${site.name}`}>
          <span className="display text-2xl leading-none text-accent transition-transform duration-500 group-hover:rotate-[-8deg]">
            {site.symbol}
          </span>
          <span className="kicker text-ink/70 transition-colors group-hover:text-ink">
            ← {site.name}
          </span>
        </Link>
        <span className="kicker hidden text-ink/40 sm:block">Three.js · WebGL</span>
      </header>

      {/* Título */}
      <section className="shell pt-[14vh] pb-16">
        <p className="kicker flex items-center gap-3 text-ink/60">
          <span className="inline-block h-2 w-2 bg-accent" />
          Laboratorio
        </p>
        <Reveal as="h1" className="display mt-6 max-w-5xl text-[clamp(2.75rem,9vw,7rem)] leading-[0.86]">
          Cuatro formas de ver
          <br />
          los datos en 3D<span className="text-accent">.</span>
        </Reveal>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70">
          Exploraciones de interfaz con Three.js para el {site.name}. Cada una
          vive en su propia página: ábrelas, juega con el cursor y elige la que
          merece llegar al sitio.
        </p>
      </section>

      {/* Índice de experimentos */}
      <nav className="shell pb-24">
        <ul className="border-t border-ink">
          {labExperiments.map((e, i) => (
            <li key={e.slug}>
              <Reveal delay={i * 70}>
                <Link
                  href={`/lab/${e.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-line py-7 transition-colors hover:bg-paper sm:gap-10 sm:py-9"
                >
                  <span className="display text-xl text-accent tabular-nums sm:text-2xl">
                    {e.index}
                  </span>
                  <span className="min-w-0">
                    <span className="kicker text-ink/45">{e.kind}</span>
                    <span className="display mt-1 block text-[clamp(1.6rem,4.5vw,3rem)] leading-[0.95] transition-transform duration-500 group-hover:translate-x-2">
                      {e.title}
                    </span>
                    <span className="mt-2 hidden max-w-xl text-sm text-ink/55 sm:block">
                      {e.technique}
                    </span>
                  </span>
                  <span
                    className="display text-2xl text-ink/30 transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent sm:text-4xl"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
