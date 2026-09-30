export type FinalPlan = "free" | "pro" | "business";

export type CapabilityState = "active" | "limited" | "preview" | "locked" | "unavailable";

export type FinalProductCapability =
  | "certifiedCoreCalculation"
  | "primaryResultAndMetrics"
  | "basicVisualization"
  | "formulaAndMethodology"
  | "detailedCharts"
  | "detailedSchedules"
  | "goalSolver"
  | "scenarioComparison"
  | "sensitivityAnalysis"
  | "savedHistory"
  | "projectsAndGoals"
  | "professionalExports"
  | "aiExplanation"
  | "ads"
  | "teamWorkspace"
  | "customCalculatorBuilder"
  | "brandingWhiteLabelEmbed"
  | "apiBatchWebhooks"
  | "leadCaptureGovernance";

export type FinalCapabilityMatrix = Readonly<
  Record<FinalProductCapability, Readonly<Record<FinalPlan, CapabilityState>>>
>;

/**
 * Governing Final Blueprint entitlement baseline.
 *
 * This matrix controls product capability only. It must never be consulted by
 * deterministic calculator compute functions to change mathematical results.
 */
export const FINAL_CAPABILITY_MATRIX: FinalCapabilityMatrix = {
  certifiedCoreCalculation: { free: "active", pro: "active", business: "active" },
  primaryResultAndMetrics: { free: "active", pro: "active", business: "active" },
  basicVisualization: { free: "active", pro: "active", business: "active" },
  formulaAndMethodology: { free: "active", pro: "active", business: "active" },
  detailedCharts: { free: "limited", pro: "active", business: "active" },
  detailedSchedules: { free: "limited", pro: "active", business: "active" },
  goalSolver: { free: "limited", pro: "active", business: "active" },
  scenarioComparison: { free: "preview", pro: "active", business: "active" },
  sensitivityAnalysis: { free: "preview", pro: "active", business: "active" },
  savedHistory: { free: "limited", pro: "active", business: "active" },
  projectsAndGoals: { free: "limited", pro: "active", business: "active" },
  professionalExports: { free: "limited", pro: "active", business: "active" },
  aiExplanation: { free: "limited", pro: "active", business: "active" },
  ads: { free: "active", pro: "unavailable", business: "unavailable" },
  teamWorkspace: { free: "unavailable", pro: "unavailable", business: "active" },
  customCalculatorBuilder: { free: "unavailable", pro: "unavailable", business: "active" },
  brandingWhiteLabelEmbed: { free: "unavailable", pro: "unavailable", business: "active" },
  apiBatchWebhooks: { free: "unavailable", pro: "unavailable", business: "active" },
  leadCaptureGovernance: { free: "unavailable", pro: "unavailable", business: "active" }
};

export function resolveFinalCapability(plan: FinalPlan, capability: FinalProductCapability): CapabilityState {
  return FINAL_CAPABILITY_MATRIX[capability][plan];
}

export function canUseFinalCapability(plan: FinalPlan, capability: FinalProductCapability): boolean {
  return resolveFinalCapability(plan, capability) === "active";
}

export const MATHEMATICAL_PARITY_CAPABILITIES = [
  "certifiedCoreCalculation",
  "primaryResultAndMetrics",
  "formulaAndMethodology"
] as const satisfies readonly FinalProductCapability[];
