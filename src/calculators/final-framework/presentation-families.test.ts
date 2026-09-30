import { describe, expect, it } from "vitest";
import {
  FINAL_PRESENTATION_FAMILIES,
  presentationBehaviorFor
} from "./presentation-families";

describe("Final Blueprint presentation families", () => {
  it("contains the complete canonical family set", () => {
    expect(FINAL_PRESENTATION_FAMILIES).toHaveLength(15);
    expect(FINAL_PRESENTATION_FAMILIES).toEqual(expect.arrayContaining([
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
    ]));
  });

  it("assigns analysis only where the family semantics support it", () => {
    expect(presentationBehaviorFor("amortization-debt")).toMatchObject({
      supportsSeries: true,
      supportsSchedule: true,
      supportsGoalSolver: true,
      supportsScenarios: true,
      supportsSensitivity: true
    });
    expect(presentationBehaviorFor("unit-conversion")).toMatchObject({
      supportsSchedule: false,
      supportsGoalSolver: false,
      supportsScenarios: false,
      supportsSensitivity: false
    });
  });

  it("keeps range/classification presentation separate from discovery domain", () => {
    expect(presentationBehaviorFor("range-classification").family).toBe("range-classification");
  });
});
