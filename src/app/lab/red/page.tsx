import type { Metadata } from "next";
import { LabStage } from "@/components/lab/LabStage";
import { GraphCanvas } from "@/components/three/lab/GraphCanvas";
import { getExperiment } from "@/content/lab";

const exp = getExperiment("red");
export const metadata: Metadata = { title: exp.title, description: exp.intro };

export default function Page() {
  return (
    <LabStage slug="red">
      <GraphCanvas />
    </LabStage>
  );
}
