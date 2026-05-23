import { team } from "@/content/site";
import { Reveal } from "../Reveal";
import { TeamCrowdStage } from "./TeamCrowdStage";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Team() {
  return (
    <section id="equipo" className="scroll-mt-24 bg-paper pb-24 md:pb-36">
      <TeamCrowdStage />

      <div className="shell border-t border-line pt-10 md:pt-12">
        <p className="kicker text-ink/50">Dirección del club</p>

        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {team.members.map((member, i) => (
            <Reveal
              key={`${member.role}-${i}`}
              delay={(i % 3) * 70}
              className="group bg-bg p-7"
            >
              {/* Avatar de relleno (sustituible por foto) */}
              <div className="flex aspect-square w-full items-center justify-center bg-paper transition-colors duration-300 group-hover:bg-ink">
                <span className="display text-5xl text-ink/30 transition-colors duration-300 group-hover:text-bg">
                  {initials(member.name)}
                </span>
              </div>
              <h3 className="display mt-6 text-xl">{member.name}</h3>
              <p className="mt-1 text-sm font-medium uppercase tracking-wide text-accent">
                {member.role}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
