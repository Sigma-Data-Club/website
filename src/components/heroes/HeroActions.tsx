import { hero } from "@/content/site";

type HeroActionsProps = {
  className?: string;
  /** Da al botón secundario un fondo blanco sólido (legible sobre fondos con movimiento). */
  solidSecondary?: boolean;
};

/** Botones CTA compartidos por todas las variantes de hero. */
export function HeroActions({ className = "", solidSecondary = false }: HeroActionsProps) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center ${className}`}>
      <a
        href={hero.primaryCta.href}
        className="group inline-flex items-center justify-center gap-2 border border-ink bg-ink px-7 py-4 text-base font-semibold text-bg transition-colors duration-300 hover:border-accent hover:bg-accent"
      >
        {hero.primaryCta.label}
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
          →
        </span>
      </a>
      <a
        href={hero.secondaryCta.href}
        className={`group inline-flex items-center justify-center gap-2 border border-ink px-7 py-4 text-base font-semibold text-ink transition-colors duration-300 hover:bg-ink hover:text-bg ${
          solidSecondary ? "bg-bg" : ""
        }`}
      >
        {hero.secondaryCta.label}
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
          ↓
        </span>
      </a>
    </div>
  );
}
