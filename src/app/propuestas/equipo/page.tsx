import type { Metadata } from "next";
import { PropuestaStage } from "@/components/propuestas/PropuestaStage";
import { EquipoCanvas } from "@/components/three/propuestas/EquipoCanvas";
import { getPropuesta } from "@/content/propuestas";

const p = getPropuesta("equipo");
export const metadata: Metadata = { title: p.title, description: p.intro };

export default function Page() {
  return (
    <PropuestaStage slug="equipo">
      <EquipoCanvas />
    </PropuestaStage>
  );
}
