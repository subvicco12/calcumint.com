import { describe, expect, it } from "vitest";
import { referencePresentations } from "./reference-presentations";

describe("Reference Six presentation readiness", () => {
  it("gives every reference calculator a free visualization", () => {
    for (const definition of Object.values(referencePresentations)) {
      expect(definition.freeVisualization).toBeTruthy();
      expect(definition.supportedVisualizations).toContain(definition.freeVisualization);
    }
  });
  it("keeps BMI free of unsupported decision-analysis surfaces", () => {
    const bmi = referencePresentations.bmi;
    expect(bmi.supportsSchedule).toBe(false);
    expect(bmi.supportsGoalSolver).toBe(false);
    expect(bmi.supportsScenarios).toBe(false);
    expect(bmi.supportsSensitivity).toBe(false);
  });
  it("keeps decision-oriented references explicit about analysis support", () => {
    for (const key of ["loanEmi", "sip", "mortgage", "breakEven"] as const) {
      expect(referencePresentations[key].supportsGoalSolver).toBe(true);
      expect(referencePresentations[key].supportsScenarios).toBe(true);
      expect(referencePresentations[key].supportsSensitivity).toBe(true);
    }
  });
});
