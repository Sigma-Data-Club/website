import { team } from "@/content/site";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

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
    <section id="equipo" className="scroll-mt-24 bg-paper py-24 md:py-36">
      <div className="shell">
        <SectionHeader number={team.number} label={team.label} title={team.title} />

        <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
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
