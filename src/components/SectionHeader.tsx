import { Reveal } from "./Reveal";

type SectionHeaderProps = {
  number: string;
  label: string;
  title?: string;
  align?: "left" | "between";
};

/**
 * Cabecera editorial de sección: número grande + etiqueta + título.
 * El número y la etiqueta forman la "firma" brutalista de cada bloque.
 */
export function SectionHeader({ number, label, title, align = "left" }: SectionHeaderProps) {
  return (
    <div className="border-t border-ink pt-5">
      <div
        className={`flex items-baseline gap-4 ${
          align === "between" ? "justify-between" : ""
        }`}
      >
        <span className="kicker text-accent">
          {number} — {label}
        </span>
      </div>
      {title ? (
        <Reveal
          as="h2"
          className="display mt-6 text-[clamp(2.25rem,6vw,5rem)]"
        >
          {title}
        </Reveal>
      ) : null}
    </div>
  );
}
