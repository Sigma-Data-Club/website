import type { Metadata } from "next";
import { PropuestaStage } from "@/components/propuestas/PropuestaStage";
import { EventosCanvas } from "@/components/three/propuestas/EventosCanvas";
import { getPropuesta } from "@/content/propuestas";

const p = getPropuesta("eventos");
export const metadata: Metadata = { title: p.title, description: p.intro };

export default function Page() {
  return (
    <PropuestaStage slug="eventos">
      <EventosCanvas />
    </PropuestaStage>
  );
}
