import { describe, expect, it } from "vitest";
import { resolveFinalCapability } from "./product-capabilities";
import { hasCalculatorCapability } from "./entitlements";

describe("Final presentation entitlement alignment", () => {
  it("aligns scenario, sensitivity and goal execution across entitlement layers", () => {
    const pairs = [["scenarioComparison","scenarioComparison"],["sensitivityAnalysis","sensitivityAnalysis"],["goalSolver","goalSolver"]] as const;
    for (const [productCapability, calculatorCapability] of pairs) {
      for (const plan of ["free","pro","business"] as const) {
        expect(resolveFinalCapability(plan, productCapability) === "active").toBe(hasCalculatorCapability(plan, calculatorCapability));
      }
    }
  });
});
