import { describe, expect, it } from "vitest";
import { referencePresentations } from "./reference-presentations";
import { createFinalRendererViewModel } from "./renderer-view-model";

describe("Reference Six renderer authority", () => {
  it("keeps every reference renderer driven by presentation definitions", () => {
    for (const definition of Object.values(referencePresentations)) {
      const model = createFinalRendererViewModel("free", definition, ["certifiedCoreCalculation"]);
      expect(model.presentationId).toBe(definition.id);
      expect(model.freeVisualization).toBe(definition.freeVisualization);
      expect(model.capabilities[0].presentation.canExecute).toBe(true);
    }
  });
});
