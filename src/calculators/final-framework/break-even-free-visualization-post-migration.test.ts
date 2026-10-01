import { describe, expect, it } from "vitest";
import { referencePresentations } from "./reference-presentations";
import { breakEvenResult } from "./reference-adapters";

describe("Break-even Free visualization after renderer migration", () => {
  it("retains the canonical Free visualization contract and structured result", () => {
    const result = breakEvenResult({ breakEvenUnits: 500, breakEvenRevenue: 25000, contributionMarginPerUnit: 20, contributionMarginPercent: 40 });
    expect(referencePresentations.breakEven.freeVisualization).toBe("break-even");
    expect(referencePresentations.breakEven.supportedVisualizations).toContain("break-even");
    expect(result.primaryResult.id).toBe("break-even-units");
  });
});
