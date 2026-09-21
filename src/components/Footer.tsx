import { nav, site, socials } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-ink bg-inverse text-on-inverse">
      <div className="shell py-16 md:py-24">
        {/* Wordmark gigante */}
        <a
          href="#top"
          className="display block text-[clamp(3rem,14vw,12rem)] leading-[0.82] tracking-tighter"
        >
          <span className="text-accent">{site.symbol}</span> Sigma
        </a>

        <div className="mt-16 grid gap-12 border-t border-on-inverse/15 pt-12 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Bloque marca */}
          <div className="max-w-sm">
            <p className="text-on-inverse/70">
              {site.tagline} · {site.university}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-4 inline-block text-lg font-medium"
            >
              {site.email}
            </a>
          </div>

          {/* Navegación */}
          <nav>
            <p className="kicker text-on-inverse/40">Navegación</p>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-on-inverse/80 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Redes */}
          <nav>
            <p className="kicker text-on-inverse/40">Síguenos</p>
            <ul className="mt-5 space-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-on-inverse/80 transition-colors hover:text-accent"
                  >
                    {s.label}
                    <span className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-on-inverse/15 pt-8 text-sm text-on-inverse/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.year} {site.name}. Hecho por estudiantes, para estudiantes.
          </p>
          <p>Diseñado con datos y café.</p>
        </div>
      </div>
    </footer>
  );
}
