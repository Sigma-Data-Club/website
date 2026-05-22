import { marquee } from "@/content/site";

/**
 * Tira horizontal infinita con las disciplinas del club.
 * Recurso editorial/brutalista clásico. Duplicamos la lista para
 * que el bucle CSS (-50%) sea perfectamente continuo.
 */
export function Marquee() {
  const items = [...marquee, ...marquee];

  return (
    <div className="border-y border-ink bg-ink py-4 text-bg overflow-hidden">
      <div className="marquee">
        {items.map((word, i) => (
          <span
            key={i}
            className="display flex items-center whitespace-nowrap px-8 text-2xl uppercase tracking-tight sm:text-3xl"
            aria-hidden={i >= marquee.length}
          >
            {word}
            <span className="ml-8 text-accent">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
