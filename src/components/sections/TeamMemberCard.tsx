"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { CardHoverParticles } from "../CardHoverParticles";
import { Reveal } from "../Reveal";
import { asset } from "@/lib/basePath";

type Member = {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  linkedin: string;
};

export function TeamMemberCard({
  member,
  index,
  delay,
}: {
  member: Member;
  index: number;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  const onEnter = useCallback(() => setHovered(true), []);
  const onLeave = useCallback(() => setHovered(false), []);

  return (
    <Reveal delay={delay} className="h-full">
      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${member.name} en LinkedIn`}
        className="group relative flex h-full min-h-38 cursor-pointer flex-col overflow-hidden bg-bg p-4 no-underline transition-colors duration-300 hover:bg-ink hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:min-h-40 md:p-5"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {member.image ? (
          <>
            <div
              className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-bg from-30% via-bg/95 via-50% to-transparent to-[68%] transition-[background] duration-300 group-hover:from-ink group-hover:via-ink/95"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute right-0 bottom-0 z-0 h-[11rem] w-[58%] min-w-[5.5rem] max-w-44 transition-transform duration-300 group-hover:scale-[1.02] md:h-[12.5rem] md:max-w-52"
              aria-hidden
            >
              <Image
                src={asset(member.image)}
                alt=""
                fill
                sizes="(max-width: 768px) 160px, 200px"
                className="object-contain object-bottom"
              />
            </div>
          </>
        ) : null}

        <CardHoverParticles active={hovered} seed={index} />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <span
              className={`kicker text-[10px] transition-colors duration-300 ${
                hovered ? "text-bg/45" : "text-ink/35"
              }`}
              aria-hidden
            >
              {num}
            </span>
            <span
              className={`relative text-[10px] font-semibold uppercase tracking-widest transition-colors duration-300 [text-shadow:0_0_14px_var(--color-bg),0_1px_2px_var(--color-bg)] group-hover:[text-shadow:0_0_14px_var(--color-ink),0_1px_2px_var(--color-ink)] ${
                hovered ? "text-accent" : "text-ink/30"
              }`}
            >
              LinkedIn
            </span>
          </div>

          <div className={member.image ? "max-w-[72%]" : undefined}>
            <h3 className="display mt-3 text-lg leading-tight md:text-xl">{member.name}</h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-accent transition-colors duration-300 group-hover:text-bg/80">
              {member.role}
            </p>
            {member.bio ? (
              <p className="mt-2 text-sm leading-relaxed text-ink/65 transition-colors duration-300 group-hover:text-bg/70">
                {member.bio}
              </p>
            ) : null}
          </div>
        </div>
      </a>
    </Reveal>
  );
}
