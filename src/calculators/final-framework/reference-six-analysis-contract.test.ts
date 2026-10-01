import { describe, expect, it } from "vitest";
import { referencePresentations } from "./reference-presentations";
import { resolveAnalysisSurface } from "./analysis-surface-policy";

describe("Reference Six analysis contract", () => {
  it("keeps free core presentation independent from premium analysis execution", () => {
    for (const key of ["loanEmi", "sip", "compoundInterest", "mortgage", "breakEven"] as const) {
      const definition = referencePresentations[key];
      expect(definition.freeVisualization).toBeTruthy();
      if (definition.supportsScenarios) {
        expect(resolveAnalysisSurface("free", definition, "scenarios")?.canExecute).toBe(false);
        expect(resolveAnalysisSurface("pro", definition, "scenarios")?.canExecute).toBe(true);
      }
    }
  });
});
