import { describe, expect, it } from "vitest";
import { referencePresentations } from "./reference-presentations";
describe("Reference Six free visualization contract", () => {
  it("keeps each free visualization within its declared supported visualizations", () => {
    for (const definition of Object.values(referencePresentations)) {
      expect(definition.freeVisualization).toBeTruthy();
      expect(definition.supportedVisualizations).toContain(definition.freeVisualization);
    }
  });
});
