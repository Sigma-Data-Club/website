import type { Metadata } from "next";
import { PropuestaStage } from "@/components/propuestas/PropuestaStage";
import { ProyectosCanvas } from "@/components/three/propuestas/ProyectosCanvas";
import { getPropuesta } from "@/content/propuestas";

const p = getPropuesta("proyectos");
export const metadata: Metadata = { title: p.title, description: p.intro };

export default function Page() {
  return (
    <PropuestaStage slug="proyectos">
      <ProyectosCanvas />
    </PropuestaStage>
  );
}
