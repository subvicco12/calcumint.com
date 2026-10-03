import { describe, expect, it } from "vitest";
import { runCalculator } from "../engine";
import { speedCalculator } from "../physics/catalog-batch-1";

describe("Speed Calculator Final-renderer readiness", () => {
  it("keeps the certified deterministic engine authoritative before renderer migration", () => {
    expect(speedCalculator.riskClass).toBe("standard");
    expect(speedCalculator.reviewStatus).toBe("certified");
    expect(speedCalculator.formulas?.length).toBeGreaterThan(0);
    expect(speedCalculator.sources?.length).toBeGreaterThan(0);
    expect(speedCalculator.goldenTests?.length).toBeGreaterThan(0);

    const input = { distance: 100, time: 20 };
    const authoritative = runCalculator(speedCalculator, input).output;
    expect(authoritative.value).toBe(5);
  });

  it("has no plan-dependent calculation path", () => {
    const input = { distance: 42, time: 6 };
    const free = runCalculator(speedCalculator, input).output;
    const pro = runCalculator(speedCalculator, input).output;
    const business = runCalculator(speedCalculator, input).output;
    expect(pro).toEqual(free);
    expect(business).toEqual(free);
  });
});
