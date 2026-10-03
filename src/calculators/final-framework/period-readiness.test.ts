import { describe, expect, it } from "vitest";
import { runCalculator } from "../engine";
import { periodCalculator } from "../physics/catalog-batch-2";

describe("Period Calculator Final-renderer readiness", () => {
  it("is certified standard-risk with deterministic metadata and golden evidence", () => {
    expect(periodCalculator.riskClass).toBe("standard");
    expect(periodCalculator.reviewStatus).toBe("certified");
    expect(periodCalculator.formulas.length).toBeGreaterThan(0);
    expect(periodCalculator.sources.length).toBeGreaterThan(0);
    expect(periodCalculator.goldenTests?.length ?? 0).toBeGreaterThan(0);
  });

  it("keeps the authoritative reciprocal-frequency engine deterministic", () => {
    const first = runCalculator(periodCalculator, { frequency: 5 }).output;
    const second = runCalculator(periodCalculator, { frequency: 5 }).output;
    expect(first.value).toBe(0.2);
    expect(second).toEqual(first);
    expect(first.steps).toEqual(["Period = 1 / frequency = 0.2"]);
  });

  it("rejects zero frequency at the definition boundary", () => {
    expect(periodCalculator.inputSchema.safeParse({ frequency: 0 }).success).toBe(false);
  });
});
