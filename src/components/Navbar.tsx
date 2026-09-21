"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del fondo cuando el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500 ${
        scrolled || open
          ? "border-b border-line bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="shell flex h-[72px] items-center justify-between">
        {/* Wordmark */}
        <a href="#top" className="group flex items-baseline gap-2" aria-label={site.name}>
          <span className="display text-2xl leading-none text-accent transition-transform duration-500 group-hover:rotate-[-8deg]">
            {site.symbol}
          </span>
          <span className="display text-lg font-semibold tracking-tight">
            {site.name}
          </span>
        </a>

        {/* Enlaces (desktop) */}
        <ul className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="link-underline text-sm font-medium text-ink/80 transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Tema + CTA (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <a
            href="#unete"
            className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-accent hover:border-accent"
          >
            Únete
            <span aria-hidden>→</span>
          </a>
        </div>

        {/* Tema + menú (móvil) */}
        <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink transition-opacity duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
        </div>
      </nav>

      {/* Panel móvil */}
      <div
        className={`overflow-hidden border-t border-line bg-bg transition-[max-height] duration-500 md:hidden ${
          open ? "max-h-[420px]" : "max-h-0 border-transparent"
        }`}
      >
        <ul className="shell flex flex-col py-6">
          {nav.map((item) => (
            <li key={item.href} className="border-b border-line last:border-0">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="display flex items-center justify-between py-4 text-2xl"
              >
                {item.label}
                <span className="text-accent" aria-hidden>
                  →
                </span>
              </a>
            </li>
          ))}
          <li className="pt-6">
            <a
              href="#unete"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-ink px-5 py-4 text-base font-semibold text-bg"
            >
              Únete al club <span aria-hidden>→</span>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
