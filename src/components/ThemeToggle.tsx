"use client";

import { MoonGlyph, SunGlyph } from "./GlyphIcons";
import { useTheme } from "./ThemeProvider";

/**
 * Interruptor de tema. Los dos glifos conviven y se cruzan al alternar:
 * el que entra gira hacia su sitio mientras el otro se retira.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={dark ? "Tema claro" : "Tema oscuro"}
      className={`relative grid h-10 w-10 shrink-0 place-items-center border border-ink/20 text-ink transition-colors duration-300 hover:border-ink hover:text-accent ${className}`}
    >
      <SunGlyph
        className={`col-start-1 row-start-1 size-4 transition-all duration-500 motion-reduce:transition-none ${
          dark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <MoonGlyph
        className={`col-start-1 row-start-1 size-4 transition-all duration-500 motion-reduce:transition-none ${
          dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
        }`}
      />
    </button>
  );
}
