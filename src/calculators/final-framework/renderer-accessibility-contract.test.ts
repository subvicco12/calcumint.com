import { describe, expect, it } from "vitest";
import { referencePresentations } from "./reference-presentations";

describe("Final renderer accessibility data contract", () => {
  it("provides non-empty presentation identifiers and visualization semantics", () => {
    for (const definition of Object.values(referencePresentations)) {
      expect(definition.id.trim().length).toBeGreaterThan(0);
      expect(definition.freeVisualization).toBeTruthy();
      expect(definition.supportedVisualizations.length).toBeGreaterThan(0);
    }
  });
});
