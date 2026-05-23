import type { Metadata } from "next";
import { PropuestaStage } from "@/components/propuestas/PropuestaStage";
import { MetricasCanvas } from "@/components/three/propuestas/MetricasCanvas";
import { getPropuesta } from "@/content/propuestas";

const p = getPropuesta("metricas");
export const metadata: Metadata = { title: p.title, description: p.intro };

export default function Page() {
  return (
    <PropuestaStage slug="metricas">
      <MetricasCanvas />
    </PropuestaStage>
  );
}
