import { team } from "@/content/site";
import { TeamCrowdStage } from "./TeamCrowdStage";
import { TeamMemberCard } from "./TeamMemberCard";

type Member = {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  linkedin?: string;
};

function LeadershipBlock({
  title,
  subtitle,
  page,
  members,
  indexOffset,
  gridClass = "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
  className,
}: {
  title: string;
  subtitle: string;
  page: string;
  members: Member[];
  indexOffset: number;
  gridClass?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)] leading-none">
            {title}
          </h2>
          <p className="mt-2 text-lg text-ink/65">{subtitle}</p>
        </div>
        <span className="kicker text-ink/40">{page}</span>
      </div>

      <div className={`mt-5 grid gap-px border border-line bg-line ${gridClass}`}>
        {members.map((member, i) => (
          <TeamMemberCard
            key={`${member.name}-${member.role}`}
            member={member}
            index={indexOffset + i}
            delay={(i % 4) * 60}
          />
        ))}
      </div>
    </div>
  );
}

export function Team() {
  const boardCount = team.board.members.length;

  return (
    <section id="equipo" className="scroll-mt-24 bg-paper pb-24 md:pb-36">
      <TeamCrowdStage />

      <div className="shell border-t border-line pt-10 md:pt-12">
        <p className="kicker text-ink/50">Dirección del club</p>

        <LeadershipBlock
          className="mt-8"
          title={team.board.title}
          subtitle={team.board.subtitle}
          page={team.board.page}
          members={team.board.members}
          indexOffset={0}
        />

        <LeadershipBlock
          className="mt-14 border-t border-line pt-14 md:mt-16 md:pt-16"
          title={team.mentors.title}
          subtitle={team.mentors.subtitle}
          page={team.mentors.page}
          members={team.mentors.members}
          indexOffset={boardCount}
          gridClass="sm:grid-cols-2 lg:grid-cols-3"
        />
      </div>
    </section>
  );
}
