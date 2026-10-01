import { describe, expect, it } from "vitest";
import { createStructuredResult } from "./structured-result";

describe("Final result reconciliation invariants", () => {
  it("requires adapters to preserve a single authoritative terminal value", () => {
    const result = createStructuredResult({
      primaryResult: { key: "futureValue", label: "Future value", value: 12500 },
      series: [{ key: "growth", label: "Growth", points: [{ x: 0, y: 10000 }, { x: 1, y: 12500 }] }],
      scenarioVariables: ["annualRatePercent"]
    });
    const terminal = result.series[0]?.points.at(-1)?.y;
    expect(terminal).toBe(result.primaryResult.value);
  });

  it("keeps the baseline scenario concept tied to the normal result rather than a second formula", () => {
    const baseline = 840;
    const result = createStructuredResult({
      primaryResult: { key: "breakEvenUnits", label: "Break-even units", value: baseline }
    });
    const scenarioBaseline = result.primaryResult.value;
    expect(scenarioBaseline).toBe(baseline);
  });
});
