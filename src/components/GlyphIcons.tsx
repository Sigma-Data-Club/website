/**
 * Glifos UI como SVG (no Unicode dingbats) para evitar renderizado emoji en iOS.
 */

type GlyphProps = {
  className?: string;
};

export function AsteriskGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
      aria-hidden
    >
      <line x1="8" y1="1" x2="8" y2="15" />
      <line x1="1" y1="8" x2="15" y2="8" />
      <line x1="3" y1="3" x2="13" y2="13" />
      <line x1="13" y1="3" x2="3" y2="13" />
    </svg>
  );
}

export function CheckGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
    >
      <path d="M3 8.5 6.5 12 13 4" />
    </svg>
  );
}

export function SunGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden
    >
      <circle cx="8" cy="8" r="3.1" />
      <line x1="8" y1="0.9" x2="8" y2="2.6" />
      <line x1="8" y1="13.4" x2="8" y2="15.1" />
      <line x1="0.9" y1="8" x2="2.6" y2="8" />
      <line x1="13.4" y1="8" x2="15.1" y2="8" />
      <line x1="2.9" y1="2.9" x2="4.1" y2="4.1" />
      <line x1="11.9" y1="11.9" x2="13.1" y2="13.1" />
      <line x1="13.1" y1="2.9" x2="11.9" y2="4.1" />
      <line x1="4.1" y1="11.9" x2="2.9" y2="13.1" />
    </svg>
  );
}

export function MoonGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M13.4 9.7A5.9 5.9 0 0 1 6.3 2.6a5.9 5.9 0 1 0 7.1 7.1Z" />
    </svg>
  );
}
