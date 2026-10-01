import { describe, expect, it } from "vitest";
import { hasCalculatorCapability } from "./entitlements";
import { canUseFinalCapability } from "./product-capabilities";

describe("Final entitlement contract reconciliation", () => {
  it("keeps core mathematical capabilities available on every plan", () => {
    for (const plan of ["free", "pro", "business"] as const) {
      expect(hasCalculatorCapability(plan, "coreCalculation")).toBe(true);
      expect(hasCalculatorCapability(plan, "resultMetrics")).toBe(true);
      expect(hasCalculatorCapability(plan, "methodology")).toBe(true);
      expect(canUseFinalCapability(plan, "certifiedCoreCalculation")).toBe(true);
      expect(canUseFinalCapability(plan, "primaryResultAndMetrics")).toBe(true);
      expect(canUseFinalCapability(plan, "formulaAndMethodology")).toBe(true);
    }
  });

  it("keeps full scenario and sensitivity execution paid while Free remains preview-only", () => {
    expect(hasCalculatorCapability("free", "scenarioComparison")).toBe(false);
    expect(hasCalculatorCapability("free", "sensitivityAnalysis")).toBe(false);
    expect(canUseFinalCapability("free", "scenarioComparison")).toBe(false);
    expect(canUseFinalCapability("free", "sensitivityAnalysis")).toBe(false);

    for (const plan of ["pro", "business"] as const) {
      expect(hasCalculatorCapability(plan, "scenarioComparison")).toBe(true);
      expect(hasCalculatorCapability(plan, "sensitivityAnalysis")).toBe(true);
      expect(canUseFinalCapability(plan, "scenarioComparison")).toBe(true);
      expect(canUseFinalCapability(plan, "sensitivityAnalysis")).toBe(true);
    }
  });

  it("keeps organization/deployment capabilities Business-only", () => {
    for (const plan of ["free", "pro"] as const) {
      expect(hasCalculatorCapability(plan, "teamWorkspace")).toBe(false);
      expect(canUseFinalCapability(plan, "teamWorkspace")).toBe(false);
      expect(canUseFinalCapability(plan, "apiBatchWebhooks")).toBe(false);
    }
    expect(hasCalculatorCapability("business", "teamWorkspace")).toBe(true);
    expect(canUseFinalCapability("business", "teamWorkspace")).toBe(true);
    expect(canUseFinalCapability("business", "apiBatchWebhooks")).toBe(true);
  });
});
