import type { Metadata } from "next";
import { PropuestaStage } from "@/components/propuestas/PropuestaStage";
import { RecursosCanvas } from "@/components/three/propuestas/RecursosCanvas";
import { getPropuesta } from "@/content/propuestas";

const p = getPropuesta("recursos");
export const metadata: Metadata = { title: p.title, description: p.intro };

export default function Page() {
  return (
    <PropuestaStage slug="recursos">
      <RecursosCanvas />
    </PropuestaStage>
  );
}
