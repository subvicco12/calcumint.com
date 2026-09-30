import { describe, expect, it } from "vitest";
import { createStructuredResult } from "./structured-result";

describe("Final structured result contract", () => {
  it("normalizes optional analytical collections for generic renderers", () => {
    const result = createStructuredResult({
      primaryResult: { key: "payment", label: "Monthly payment", value: 1234.56, unit: "USD" }
    });

    expect(result.metrics).toEqual([]);
    expect(result.series).toEqual([]);
    expect(result.composition).toEqual([]);
    expect(result.ranges).toEqual([]);
    expect(result.reverseTargets).toEqual([]);
    expect(result.scenarioVariables).toEqual([]);
    expect(result.sensitivityVariables).toEqual([]);
    expect(result.assumptions).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.sources).toEqual([]);
    expect(result.journey).toEqual([]);
    expect(result.methodology).toBe("");
  });

  it("carries renderer-ready analysis without changing calculator math", () => {
    const result = createStructuredResult({
      primaryResult: { key: "futureValue", label: "Future value", value: 15000 },
      metrics: [{ key: "contribution", label: "Contribution", value: 10000 }],
      series: [{ key: "growth", label: "Growth", points: [{ x: 1, y: 10500 }] }],
      reverseTargets: ["monthlyContribution"],
      scenarioVariables: ["annualRatePercent"],
      sensitivityVariables: ["annualRatePercent"],
      methodology: "Deterministic engine output adapted for presentation.",
      sources: [{ label: "Method source" }]
    });

    expect(result.primaryResult.value).toBe(15000);
    expect(result.series[0]?.points[0]?.y).toBe(10500);
    expect(result.reverseTargets).toContain("monthlyContribution");
  });
});
