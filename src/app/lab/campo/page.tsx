import type { Metadata } from "next";
import { LabStage } from "@/components/lab/LabStage";
import { FieldCanvas } from "@/components/three/lab/FieldCanvas";
import { getExperiment } from "@/content/lab";

const exp = getExperiment("campo");
export const metadata: Metadata = { title: exp.title, description: exp.intro };

export default function Page() {
  return (
    <LabStage slug="campo">
      <FieldCanvas />
    </LabStage>
  );
}
