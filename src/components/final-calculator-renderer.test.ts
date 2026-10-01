import { describe, expect, it } from "vitest";
import { createFinalRendererViewModel } from "@/calculators/final-framework/renderer-view-model";
import { referencePresentations } from "@/calculators/final-framework/reference-presentations";

describe("Final renderer shell contract", () => {
  it("keeps the free visualization in the renderer view model", () => {
    expect(createFinalRendererViewModel("free", referencePresentations.sip, ["certifiedCoreCalculation"]).freeVisualization).toBe("growth-line");
  });
});
