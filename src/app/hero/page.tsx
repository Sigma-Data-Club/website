import type { Metadata } from "next";
import Link from "next/link";
import { heroVariants } from "@/components/heroes/registry";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Elige tu hero",
  description: "Vista previa de las variantes de portada del Sigma Data Club.",
};

export default function HeroGallery() {
  return (
    <main className="shell min-h-screen py-24 md:py-32">
      <p className="kicker text-accent">{site.symbol} — Vista previa</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,7vw,6rem)]">Elige tu hero</h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
        Cinco tratamientos distintos para la portada del {site.name}. Ábrelos a pantalla
        completa, compáralos en cualquier dispositivo y dime cuál te convence — lo dejaré
        como hero principal.
      </p>

      <div className="mt-14 grid gap-px border border-line bg-line md:grid-cols-2">
        {heroVariants.map((v) => (
          <Link
            key={v.id}
            href={`/hero/${v.id}`}
            className="group flex flex-col bg-bg p-8 transition-colors duration-300 hover:bg-ink hover:text-bg md:p-10"
          >
            <span className="kicker text-accent">Hero {String(v.id).padStart(2, "0")}</span>
            <h2 className="display mt-6 text-3xl md:text-4xl">{v.name}</h2>
            <p className="mt-3 flex-1 text-ink/65 transition-colors duration-300 group-hover:text-bg/70">
              {v.desc}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
              Ver a pantalla completa
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </span>
          </Link>
        ))}
      </div>

      <Link href="/" className="link-underline mt-12 inline-block text-sm font-semibold">
        ← Volver al inicio
      </Link>
    </main>
  );
}
