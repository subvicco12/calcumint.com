import { describe, expect, it } from "vitest";
import { capabilitiesFor, hasCalculatorCapability, minimumPlanFor } from "./entitlements";
import { referencePresentations } from "./reference-presentations";

describe("Final Calculator Framework", () => {
  it("keeps mathematical correctness free", () => {
    expect(hasCalculatorCapability("free", "coreCalculation")).toBe(true);
    expect(hasCalculatorCapability("free", "resultMetrics")).toBe(true);
    expect(hasCalculatorCapability("free", "methodology")).toBe(true);
    expect(minimumPlanFor("coreCalculation")).toBe("free");
  });

  it("places analysis capabilities at Pro without blocking Business", () => {
    for (const capability of ["advancedVisualization", "detailedSchedule", "goalSolver", "scenarioComparison", "sensitivityAnalysis"] as const) {
      expect(hasCalculatorCapability("free", capability)).toBe(false);
      expect(hasCalculatorCapability("pro", capability)).toBe(true);
      expect(hasCalculatorCapability("business", capability)).toBe(true);
    }
  });

  it("reserves deployment and automation capabilities for Business", () => {
    for (const capability of ["teamWorkspace", "customBuilder", "embed", "whiteLabel", "api", "batchProcessing", "webhooks"] as const) {
      expect(hasCalculatorCapability("free", capability)).toBe(false);
      expect(hasCalculatorCapability("pro", capability)).toBe(false);
      expect(hasCalculatorCapability("business", capability)).toBe(true);
    }
  });

  it("defines all six architecture reference calculators", () => {
    expect(Object.keys(referencePresentations)).toEqual([
      "loanEmi", "sip", "compoundInterest", "mortgage", "bmi", "breakEven"
    ]);
  });

  it("gives every reference a meaningful free visualization", () => {
    for (const presentation of Object.values(referencePresentations)) {
      expect(presentation.freeVisualization).toBeTruthy();
      expect(presentation.supportedVisualizations).toContain(presentation.freeVisualization);
    }
  });

  it("keeps capability inheritance monotonic", () => {
    const free = new Set(capabilitiesFor("free"));
    const pro = new Set(capabilitiesFor("pro"));
    const business = new Set(capabilitiesFor("business"));
    for (const capability of free) expect(pro.has(capability)).toBe(true);
    for (const capability of pro) expect(business.has(capability)).toBe(true);
  });
});
