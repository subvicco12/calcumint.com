import { describe, expect, it } from "vitest";
import { compoundInterestResult } from "./adapters";
import { resolveCapabilityPresentation } from "./capability-presentation";
import type { FinalPlan } from "./product-capabilities";

describe("Compound Interest cross-plan core parity", () => {
  it("keeps core mathematical presentation active for every plan", () => {
    const result = compoundInterestResult({ principal: 10000, years: 10 }, { futureValue: 16470.09, totalInterest: 6470.09 });
    const plans: FinalPlan[] = ["free", "pro", "business"];
    for (const plan of plans) {
      expect(resolveCapabilityPresentation(plan, "certifiedCoreCalculation").canExecute).toBe(true);
      expect(resolveCapabilityPresentation(plan, "primaryResultAndMetrics").canExecute).toBe(true);
      expect(resolveCapabilityPresentation(plan, "formulaAndMethodology").canExecute).toBe(true);
      expect(result.primaryResult.value).toBe(16470.09);
    }
  });
});
