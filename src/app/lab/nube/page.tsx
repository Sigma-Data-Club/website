import type { Metadata } from "next";
import { LabStage } from "@/components/lab/LabStage";
import { PointsCanvas } from "@/components/three/lab/PointsCanvas";
import { getExperiment } from "@/content/lab";

const exp = getExperiment("nube");
export const metadata: Metadata = { title: exp.title, description: exp.intro };

export default function Page() {
  return (
    <LabStage slug="nube">
      <PointsCanvas />
    </LabStage>
  );
}
