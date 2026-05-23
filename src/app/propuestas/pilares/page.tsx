import type { Metadata } from "next";
import { PropuestaStage } from "@/components/propuestas/PropuestaStage";
import { PilaresCanvas } from "@/components/three/propuestas/PilaresCanvas";
import { getPropuesta } from "@/content/propuestas";

const p = getPropuesta("pilares");
export const metadata: Metadata = { title: p.title, description: p.intro };

export default function Page() {
  return (
    <PropuestaStage slug="pilares">
      <PilaresCanvas />
    </PropuestaStage>
  );
}
