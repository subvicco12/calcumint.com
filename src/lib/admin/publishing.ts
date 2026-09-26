export const adminRoles = ["owner", "admin", "reviewer", "editor"] as const;
export type AdminRole = (typeof adminRoles)[number];

export const lifecycleStates = ["draft", "review", "certified", "published", "archived"] as const;
export type LifecycleState = (typeof lifecycleStates)[number];

export const qaCheckTypes = ["engine-tests", "formula-review", "sources", "methodology", "reverse-solve", "visualization-reconciliation", "schedule-reconciliation", "scenario-reconciliation", "sensitivity-validation", "entitlement-validation", "ux-responsive", "performance", "security", "seo-content", "accessibility", "ymyl-review"] as const;
export type QaCheckType = (typeof qaCheckTypes)[number];

export type PublishingRecord = {
  riskClass: "standard" | "financial" | "health" | "tax";
  lifecycle: LifecycleState;
  engineTestsPassed: boolean;
  formulaReviewPassed: boolean;
  sourcesPassed: boolean;
  methodologyPassed: boolean;
  reverseSolvePassed: boolean;
  visualizationReconciliationPassed: boolean;
  scheduleReconciliationPassed: boolean;
  scenarioReconciliationPassed: boolean;
  sensitivityValidationPassed: boolean;
  entitlementValidationPassed: boolean;
  uxResponsivePassed: boolean;
  performancePassed: boolean;
  securityPassed: boolean;
  seoContentPassed: boolean;
  accessibilityPassed: boolean;
  ymylReviewPassed: boolean;
  reviewerId?: string | null;
  sourceCount: number;
};

export function isYmyl(riskClass: PublishingRecord["riskClass"]): boolean {
  return riskClass === "financial" || riskClass === "health" || riskClass === "tax";
}

export function requiredQaChecks(riskClass: PublishingRecord["riskClass"]): QaCheckType[] {
  const base: QaCheckType[] = ["engine-tests", "formula-review", "sources", "methodology", "reverse-solve", "visualization-reconciliation", "schedule-reconciliation", "scenario-reconciliation", "sensitivity-validation", "entitlement-validation", "ux-responsive", "performance", "security", "seo-content", "accessibility"];
  return isYmyl(riskClass) ? [...base, "ymyl-review"] : base;
}

export function publishingGate(record: PublishingRecord) {
  const failures: string[] = [];
  if (!record.engineTestsPassed) failures.push("Deterministic engine tests must pass");
  if (!record.formulaReviewPassed) failures.push("Formula review must pass");
  if (!record.sourcesPassed || record.sourceCount < 1) failures.push("At least one reviewed source is required");
  if (!record.methodologyPassed) failures.push("Methodology content must be complete");
  if (!record.reverseSolvePassed) failures.push("Reverse-solve verification must pass or be marked not applicable");
  if (!record.visualizationReconciliationPassed) failures.push("Visualization reconciliation must pass or be marked not applicable");
  if (!record.scheduleReconciliationPassed) failures.push("Schedule/table reconciliation must pass or be marked not applicable");
  if (!record.scenarioReconciliationPassed) failures.push("Scenario baseline reconciliation must pass or be marked not applicable");
  if (!record.sensitivityValidationPassed) failures.push("Sensitivity validation must pass or be marked not applicable");
  if (!record.entitlementValidationPassed) failures.push("Centralized entitlement validation must pass");
  if (!record.uxResponsivePassed) failures.push("UX/responsive validation must pass");
  if (!record.performancePassed) failures.push("Performance validation must pass");
  if (!record.securityPassed) failures.push("Security and server-side entitlement validation must pass");
  if (!record.seoContentPassed) failures.push("SEO/content completeness gate must pass");
  if (!record.accessibilityPassed) failures.push("Accessibility review must pass");
  if (isYmyl(record.riskClass)) {
    if (!record.ymylReviewPassed) failures.push("YMYL specialist review must pass");
    if (!record.reviewerId) failures.push("YMYL calculators require an assigned reviewer");
  }
  return { ok: failures.length === 0, failures };
}

export function canTransition(from: LifecycleState, to: LifecycleState): boolean {
  if (from === to) return true;
  const allowed: Record<LifecycleState, readonly LifecycleState[]> = {
    draft: ["review", "archived"],
    review: ["draft", "certified", "archived"],
    certified: ["review", "published", "archived"],
    published: ["review", "archived"],
    archived: ["draft"]
  };
  return allowed[from].includes(to);
}

export function roleCanTransition(role: AdminRole, to: LifecycleState): boolean {
  if (role === "owner" || role === "admin") return true;
  if (role === "reviewer") return to !== "published";
  return to === "draft" || to === "review";
}
