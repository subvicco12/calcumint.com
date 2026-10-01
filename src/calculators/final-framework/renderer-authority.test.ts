import { describe, expect, it } from "vitest";
import { createFinalRendererViewModel } from "./renderer-view-model";
import { referencePresentations } from "./reference-presentations";

describe("Final renderer authority boundary", () => {
  it("derives presentation policy without accepting calculator inputs or formulas", () => {
    const model = createFinalRendererViewModel("free", referencePresentations.breakEven, ["certifiedCoreCalculation","scenarioComparison"]);
    expect(Object.keys(model).sort()).toEqual(["capabilities","freeVisualization","presentationId"]);
    expect(model.capabilities.find(item => item.capability === "certifiedCoreCalculation")?.presentation.canExecute).toBe(true);
    expect(model.capabilities.find(item => item.capability === "scenarioComparison")?.presentation.canExecute).toBe(false);
  });
});
