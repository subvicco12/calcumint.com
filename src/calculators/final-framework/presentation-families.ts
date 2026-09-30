/** Canonical presentation families from the Final Master Blueprint. */
export const FINAL_PRESENTATION_FAMILIES = [
  "simple-scalar",
  "growth-accumulation",
  "amortization-debt",
  "composition",
  "break-even-crossover",
  "range-classification",
  "statistical-distribution",
  "comparison",
  "goal-planning",
  "engineering-quantity",
  "unit-conversion",
  "equation-solver",
  "graphing",
  "time-date",
  "rule-based-jurisdictional"
] as const;

export type FinalPresentationFamily = (typeof FINAL_PRESENTATION_FAMILIES)[number];

export type FinalPresentationBehavior = {
  family: FinalPresentationFamily;
  supportsSeries: boolean;
  supportsComposition: boolean;
  supportsSchedule: boolean;
  supportsGoalSolver: boolean;
  supportsScenarios: boolean;
  supportsSensitivity: boolean;
};

export const FINAL_PRESENTATION_BEHAVIORS: Readonly<Record<FinalPresentationFamily, FinalPresentationBehavior>> =
  Object.fromEntries(
    FINAL_PRESENTATION_FAMILIES.map((family) => [
      family,
      {
        family,
        supportsSeries: ["growth-accumulation", "amortization-debt", "break-even-crossover", "graphing"].includes(family),
        supportsComposition: ["composition", "growth-accumulation", "amortization-debt"].includes(family),
        supportsSchedule: ["growth-accumulation", "amortization-debt", "time-date"].includes(family),
        supportsGoalSolver: ["growth-accumulation", "amortization-debt", "break-even-crossover", "goal-planning", "equation-solver"].includes(family),
        supportsScenarios: ["growth-accumulation", "amortization-debt", "break-even-crossover", "comparison", "goal-planning"].includes(family),
        supportsSensitivity: ["growth-accumulation", "amortization-debt", "break-even-crossover", "comparison", "goal-planning"].includes(family)
      }
    ])
  ) as Readonly<Record<FinalPresentationFamily, FinalPresentationBehavior>>;

export function presentationBehaviorFor(family: FinalPresentationFamily): FinalPresentationBehavior {
  return FINAL_PRESENTATION_BEHAVIORS[family];
}
