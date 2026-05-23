import type { Metadata } from "next";
import { PropuestaStage } from "@/components/propuestas/PropuestaStage";
import { MarqueeCanvas } from "@/components/three/propuestas/MarqueeCanvas";
import { getPropuesta } from "@/content/propuestas";

const p = getPropuesta("marquee");
export const metadata: Metadata = { title: p.title, description: p.intro };

export default function Page() {
  return (
    <PropuestaStage slug="marquee">
      <MarqueeCanvas />
    </PropuestaStage>
  );
}
