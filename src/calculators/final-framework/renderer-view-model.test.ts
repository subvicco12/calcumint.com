import { describe, expect, it } from "vitest";
import { createFinalRendererViewModel } from "./renderer-view-model";
import { referencePresentations } from "./reference-presentations";

describe("Final renderer view model", () => {
  it("preserves the free visualization while centralizing paid capability presentation", () => {
    const model = createFinalRendererViewModel("free", referencePresentations.loanEmi, ["certifiedCoreCalculation", "scenarioComparison"]);
    expect(model.freeVisualization).toBe("composition");
    expect(model.capabilities[0]?.presentation.canExecute).toBe(true);
    expect(model.capabilities[1]?.presentation.showPreview).toBe(true);
  });
});
