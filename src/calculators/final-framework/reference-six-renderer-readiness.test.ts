import { describe, expect, it } from "vitest";
import { referencePresentations } from "./reference-presentations";

describe("Reference Six renderer readiness", () => {
  it("keeps every reference on a canonical renderer family", () => {
    const canonical = new Set(["growth-accumulation","amortization-debt","break-even-crossover","range-classification"]);
    for (const definition of Object.values(referencePresentations)) {
      expect(canonical.has(definition.family)).toBe(true);
      expect(definition.supportedVisualizations).toContain(definition.freeVisualization);
    }
  });
});
