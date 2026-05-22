import Link from "next/link";
import { heroVariants } from "./registry";

/** Selector flotante para saltar entre variantes de hero. */
export function HeroSwitcher({ current }: { current: string }) {
  return (
    <nav
      aria-label="Selector de hero"
      className="fixed bottom-4 left-1/2 z-[55] -translate-x-1/2 px-2"
    >
      <div className="flex items-center gap-1 border border-ink bg-bg/90 p-1.5 shadow-[5px_5px_0_0_var(--color-ink)] backdrop-blur-md">
        <Link
          href="/hero"
          className="px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors hover:text-accent"
        >
          Índice
        </Link>
        <span className="mx-0.5 h-6 w-px bg-line" aria-hidden />
        {heroVariants.map((v) => {
          const active = v.id === current;
          return (
            <Link
              key={v.id}
              href={`/hero/${v.id}`}
              title={v.name}
              aria-current={active ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center text-sm font-semibold transition-colors ${
                active ? "bg-ink text-bg" : "hover:bg-paper"
              }`}
            >
              {String(v.id).padStart(2, "0")}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
