import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  /** Clases para la caja externa (tamaño, márgenes). */
  className?: string;
  /** Clases para el contenedor interno (padding, layout). */
  contentClassName?: string;
};

/**
 * Tarjeta "liquid glass" con acabado brutalista:
 * - cristal translúcido (backdrop-blur fuerte, casi sin tinte) → se intuye el fondo,
 * - brillo especular en los filos superior/izquierdo,
 * - esquinas vivas + sombra dura desplazada (firma brutalista).
 * Requiere un fondo con textura/movimiento detrás para lucir.
 */
export function GlassCard({ children, className = "", contentClassName = "" }: GlassCardProps) {
  return (
    <div
      className={`relative isolate overflow-hidden border border-ink/20 bg-bg/15 shadow-[7px_7px_0_0_rgba(11,11,11,0.12)] backdrop-blur-xl backdrop-saturate-150 ${className}`}
    >
      {/* Brillo especular diagonal */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.08)_30%,transparent_55%)]"
      />
      {/* Filos iluminados (borde de cristal) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/70" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px bg-white/45" />
      {/* Acento mínimo: marca de esquina */}
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 bg-accent" />

      <div className={`relative ${contentClassName}`}>{children}</div>
    </div>
  );
}
