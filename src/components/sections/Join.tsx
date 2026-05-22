"use client";

import { useState, type FormEvent } from "react";
import { join, site } from "@/content/site";
import { SectionHeader } from "../SectionHeader";
import { JoinCloudCanvas } from "../three/JoinCloudCanvas";

export function Join() {
  const [interest, setInterest] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder: aquí conectarías tu backend, Google Form, Mailchimp, etc.
    setSubmitted(true);
  }

  return (
    <section id="unete" className="scroll-mt-24 py-24 md:py-32">
      <div className="shell">
        <SectionHeader number={join.number} label={join.label} />

        {/* Escenario: la σ del club emerge de los datos (respira casi formada).
            El título se superpone abajo, sobre el desvanecido, como en el hero. */}
        <div className="relative mt-10 flex min-h-[48vh] items-end overflow-hidden md:mt-12">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <JoinCloudCanvas />
            {/* Solo difuminamos la base (para el título); el resto de la σ
                queda limpia para que se reconozca el trazo superior. */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg via-bg/85 to-transparent" />
          </div>
          <h2 className="display relative max-w-2xl text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9]">
            {join.title}
          </h2>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Lado izquierdo: invitación */}
          <div className="flex flex-col">
          <p className="max-w-md text-lg leading-relaxed text-ink/70">
            {join.body}
          </p>
          <div className="mt-auto pt-12">
            <p className="kicker text-ink/50">O escríbenos directamente</p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-3 inline-block text-2xl font-medium md:text-3xl"
            >
              {site.email}
            </a>
          </div>
        </div>

        {/* Lado derecho: formulario */}
        <div className="border border-ink p-7 md:p-10">
          {submitted ? (
            <div className="flex h-full min-h-[320px] flex-col items-start justify-center">
              <span className="flex h-12 w-12 items-center justify-center bg-accent text-2xl text-bg">
                ✓
              </span>
              <h3 className="display mt-6 text-3xl">¡Estás dentro!</h3>
              <p className="mt-3 max-w-sm text-ink/70">
                Gracias por tu interés. Te escribiremos con los detalles del próximo
                evento muy pronto.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setInterest(null);
                }}
                className="link-underline mt-8 text-sm font-semibold"
              >
                Enviar otra respuesta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="kicker text-ink/60">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Tu nombre"
                  className="border-b border-ink bg-transparent pb-2 text-lg outline-none transition-colors placeholder:text-ink/30 focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="kicker text-ink/60">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="tu@universidad.edu"
                  className="border-b border-ink bg-transparent pb-2 text-lg outline-none transition-colors placeholder:text-ink/30 focus:border-accent"
                />
              </div>

              <fieldset className="flex flex-col gap-3">
                <legend className="kicker text-ink/60">Me interesa</legend>
                <div className="flex flex-wrap gap-2">
                  {join.interests.map((option) => {
                    const active = interest === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setInterest(active ? null : option)}
                        aria-pressed={active}
                        className={`border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                          active
                            ? "border-ink bg-ink text-bg"
                            : "border-ink/25 hover:border-ink"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <button
                type="submit"
                className="group mt-2 inline-flex items-center justify-center gap-2 border border-ink bg-ink px-7 py-4 text-base font-semibold text-bg transition-colors duration-300 hover:border-accent hover:bg-accent"
              >
                Quiero unirme
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </button>
            </form>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
