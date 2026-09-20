import type { PlanTier } from "./types";

export type CalculatorCapability =
  | "coreCalculation" | "resultMetrics" | "basicVisualization" | "methodology"
  | "advancedVisualization" | "detailedSchedule" | "goalSolver"
  | "scenarioComparison" | "sensitivityAnalysis" | "professionalExport"
  | "advancedAIExplanation" | "savedProjects" | "teamWorkspace"
  | "customBuilder" | "embed" | "whiteLabel" | "api" | "batchProcessing"
  | "webhooks" | "leadCapture" | "governance";

const minimumTier: Readonly<Record<CalculatorCapability, PlanTier>> = {
  coreCalculation: "free",
  resultMetrics: "free",
  basicVisualization: "free",
  methodology: "free",
  advancedVisualization: "pro",
  detailedSchedule: "pro",
  goalSolver: "pro",
  scenarioComparison: "pro",
  sensitivityAnalysis: "pro",
  professionalExport: "pro",
  advancedAIExplanation: "pro",
  savedProjects: "pro",
  teamWorkspace: "business",
  customBuilder: "business",
  embed: "business",
  whiteLabel: "business",
  api: "business",
  batchProcessing: "business",
  webhooks: "business",
  leadCapture: "business",
  governance: "business"
};

const tierRank: Readonly<Record<PlanTier, number>> = { free: 0, pro: 1, business: 2 };

export function minimumPlanFor(capability: CalculatorCapability): PlanTier {
  return minimumTier[capability];
}

export function hasCalculatorCapability(plan: PlanTier, capability: CalculatorCapability): boolean {
  return tierRank[plan] >= tierRank[minimumTier[capability]];
}

export function capabilitiesFor(plan: PlanTier): readonly CalculatorCapability[] {
  return (Object.keys(minimumTier) as CalculatorCapability[]).filter((capability) =>
    hasCalculatorCapability(plan, capability)
  );
}
