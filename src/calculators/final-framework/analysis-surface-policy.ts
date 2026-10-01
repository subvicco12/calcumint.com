import type { FinalPlan, FinalProductCapability } from "./product-capabilities";
import { resolveCapabilityPresentation } from "./capability-presentation";
import type { PresentationDefinition } from "./types";

export type AnalysisSurface = "schedule" | "goalSolver" | "scenarios" | "sensitivity";

const capabilityForSurface: Readonly<Record<AnalysisSurface, FinalProductCapability>> = {
  schedule: "detailedSchedules",
  goalSolver: "goalSolver",
  scenarios: "scenarioComparison",
  sensitivity: "sensitivityAnalysis"
};

export function supportsAnalysisSurface(definition: PresentationDefinition, surface: AnalysisSurface): boolean {
  if (surface === "schedule") return definition.supportsSchedule === true;
  if (surface === "goalSolver") return definition.supportsGoalSolver === true;
  if (surface === "scenarios") return definition.supportsScenarios === true;
  return definition.supportsSensitivity === true;
}

export function resolveAnalysisSurface(
  plan: FinalPlan,
  definition: PresentationDefinition,
  surface: AnalysisSurface
) {
  if (!supportsAnalysisSurface(definition, surface)) return null;
  return resolveCapabilityPresentation(plan, capabilityForSurface[surface]);
}
