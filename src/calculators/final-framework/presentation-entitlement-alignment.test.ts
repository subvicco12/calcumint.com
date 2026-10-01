import { describe, expect, it } from "vitest";
import { resolveFinalCapability } from "./product-capabilities";
import { hasCalculatorCapability } from "./entitlements";

describe("Final presentation entitlement alignment", () => {
  it("aligns scenario, sensitivity and goal execution across entitlement layers", () => {
    const pairs = [
      ["scenarioComparison", "scenarioComparison"],
      ["sensitivityAnalysis", "sensitivityAnalysis"],
      ["goalSolver", "goalSolver"]
    ] as const;
    for (const [productCapability, calculatorCapability] of pairs) {
      expect(resolveFinalCapability("free", productCapability) === "active").toBe(hasCalculatorCapability("free", calculatorCapability));
      expect(resolveFinalCapability("pro", productCapability) === "active").toBe(hasCalculatorCapability("pro", calculatorCapability));
      expect(resolveFinalCapability("business", productCapability) === "active").toBe(hasCalculatorCapability("business", calculatorCapability));
    }
  });
});
