import type { Metadata } from "next";
import { LabStage } from "@/components/lab/LabStage";
import { SigmaCanvas } from "@/components/three/lab/SigmaCanvas";
import { getExperiment } from "@/content/lab";

const exp = getExperiment("sigma");
export const metadata: Metadata = { title: exp.title, description: exp.intro };

export default function Page() {
  return (
    <LabStage slug="sigma">
      <SigmaCanvas />
    </LabStage>
  );
}
