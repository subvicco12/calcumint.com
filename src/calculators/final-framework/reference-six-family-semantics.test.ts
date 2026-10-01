import { describe, expect, it } from "vitest";
import { presentationBehaviorFor, FINAL_PRESENTATION_FAMILIES } from "./presentation-families";
import { referencePresentations } from "./reference-presentations";

describe("Reference Six family semantic consistency", () => {
  it("does not claim analysis capabilities forbidden by the canonical family", () => {
    for (const presentation of Object.values(referencePresentations)) {
      if (!FINAL_PRESENTATION_FAMILIES.includes(presentation.family as never)) continue;
      const behavior = presentationBehaviorFor(presentation.family as Parameters<typeof presentationBehaviorFor>[0]);
      if (presentation.supportsSchedule) expect(behavior.supportsSchedule).toBe(true);
      if (presentation.supportsGoalSolver) expect(behavior.supportsGoalSolver).toBe(true);
      if (presentation.supportsScenarios) expect(behavior.supportsScenarios).toBe(true);
      if (presentation.supportsSensitivity) expect(behavior.supportsSensitivity).toBe(true);
    }
  });
});
