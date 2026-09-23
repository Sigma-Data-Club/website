import { AsteriskGlyph } from "@/components/GlyphIcons";
import { marquee } from "@/content/site";

/**
 * Tira horizontal infinita con las disciplinas del club.
 * Recurso editorial/brutalista clásico. Duplicamos la lista para
 * que el bucle CSS (-50%) sea perfectamente continuo.
 */
export function Marquee() {
  const items = [...marquee, ...marquee];

  return (
    <div className="border-y border-ink bg-inverse py-4 text-on-inverse overflow-hidden">
      <div className="marquee">
        {items.map((word, i) => (
          <span
            key={i}
            className="display flex items-center whitespace-nowrap px-8 text-2xl uppercase tracking-tight sm:text-3xl"
            aria-hidden={i >= marquee.length}
          >
            {word}
            <span
              className="ml-8 inline-flex shrink-0 items-center text-accent"
              aria-hidden
            >
              <AsteriskGlyph className="size-[0.7em]" />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
