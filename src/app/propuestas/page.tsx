import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { propuestas } from "@/content/propuestas";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Propuestas 3D para la home",
  description:
    "Siete ideas de UI/UX con Three.js para integrar en las secciones del Sigma Data Club: marquee, about, eventos, proyectos, equipo y recursos.",
};

export default function PropuestasIndex() {
  return (
    <main className="min-h-svh bg-bg">
      <header className="shell flex items-center justify-between pt-8">
        <Link href="/" className="group flex items-baseline gap-2" aria-label={`Volver a ${site.name}`}>
          <span className="display text-2xl leading-none text-accent transition-transform duration-500 group-hover:rotate-[-8deg]">
            {site.symbol}
          </span>
          <span className="kicker text-ink/70 transition-colors group-hover:text-ink">
            ← {site.name}
          </span>
        </Link>
        <Link href="/lab" className="kicker text-ink/40 transition-colors hover:text-ink">
          Laboratorio →
        </Link>
      </header>

      <section className="shell pt-[12vh] pb-16">
        <p className="kicker flex items-center gap-3 text-ink/60">
          <span className="inline-block h-2 w-2 bg-accent" />
          Propuestas · integración en la home
        </p>
        <Reveal as="h1" className="display mt-6 max-w-5xl text-[clamp(2.5rem,8vw,6rem)] leading-[0.88]">
          Dónde meter más 3D
          <br />
          en el sitio<span className="text-accent">.</span>
        </Reveal>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70">
          Ya tienes superficie en el hero y la σ en Únete. Estas siete propuestas cubren
          el resto de secciones — cada una tiene su página de demo a pantalla completa.
          Abre las que te interesen y dime cuáles integramos.
        </p>
        <p className="mt-4 text-sm text-ink/50">
          Hero y Únete ya usan WebGL ·{" "}
          <Link href="/lab" className="link-underline font-medium text-ink/70">
            ver experimentos del laboratorio
          </Link>
        </p>
      </section>

      <nav className="shell pb-24">
        <ul className="border-t border-ink">
          {propuestas.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={i * 60}>
                <Link
                  href={`/propuestas/${p.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-line py-7 transition-colors hover:bg-paper sm:gap-10 sm:py-9"
                >
                  <span className="display text-xl text-accent tabular-nums sm:text-2xl">
                    {p.index}
                  </span>
                  <span className="min-w-0">
                    <span className="kicker text-ink/45">{p.section}</span>
                    <span className="display mt-1 block text-[clamp(1.5rem,4vw,2.75rem)] leading-[0.95] transition-transform duration-500 group-hover:translate-x-2">
                      {p.title}
                    </span>
                    <span className="mt-2 hidden max-w-xl text-sm text-ink/55 sm:block">
                      {p.benefit}
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
