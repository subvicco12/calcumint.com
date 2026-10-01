import { describe, expect, it } from "vitest";
import { referencePresentations } from "./reference-presentations";
import { presentationBehaviorFor } from "./presentation-families";

describe("Reference Six Final-framework contract coverage", () => {
  it("keeps exactly the six architecture references", () => {
    expect(Object.keys(referencePresentations).sort()).toEqual(
      ["bmi", "breakEven", "compoundInterest", "loanEmi", "mortgage", "sip"].sort()
    );
  });

  it("keeps every reference on a meaningful free visualization", () => {
    for (const presentation of Object.values(referencePresentations)) {
      expect(presentation.freeVisualization).toBeTruthy();
      expect(presentation.supportedVisualizations).toContain(presentation.freeVisualization);
    }
  });

  it("keeps BMI analytical features bounded to its range semantics", () => {
    const bmi = referencePresentations.bmi;
    expect(bmi.supportedVisualizations).toEqual(["range-indicator"]);
    expect(bmi.supportsGoalSolver).toBe(false);
    expect(bmi.supportsScenarios).toBe(false);
    expect(bmi.supportsSensitivity).toBe(false);
  });

  it("keeps canonical amortization semantics available for loan-family migration", () => {
    const behavior = presentationBehaviorFor("amortization-debt");
    expect(behavior.supportsSchedule).toBe(true);
    expect(behavior.supportsGoalSolver).toBe(true);
    expect(behavior.supportsScenarios).toBe(true);
    expect(behavior.supportsSensitivity).toBe(true);
  });
});
