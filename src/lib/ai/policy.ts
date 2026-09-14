export type AiFeature = "finder" | "explain" | "scenario" | "builder";
export type Plan = "free" | "pro" | "business";

export const aiMonthlyRequestLimits: Record<Plan, number> = {
  free: 10,
  pro: 200,
  business: 1000
};

export function canUseAiFeature(plan: Plan, feature: AiFeature): boolean {
  if (feature === "builder") return plan === "business";
  if (feature === "explain" || feature === "scenario") return plan === "pro" || plan === "business";
  return true;
}

export const AI_GROUNDING_RULES = [
  "Never perform or replace the deterministic calculation engine.",
  "Never change, recompute, estimate or contradict supplied deterministic numeric outputs.",
  "Treat supplied calculator metadata, formulas, assumptions, inputs and outputs as the source of truth.",
  "Do not invent calculators, URLs, features, formulas, sources or regulatory claims.",
  "For finance, health or other high-impact topics, explain assumptions and uncertainty without giving professional advice.",
  "Return only the requested structured JSON shape."
] as const;
