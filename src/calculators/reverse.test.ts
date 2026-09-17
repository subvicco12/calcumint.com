import { describe, expect, it } from "vitest";
import { goalSeek } from "./reverse";

describe("goalSeek", () => {
  it("solves an increasing monotonic function", () => {
    const result = goalSeek(100, (x) => x * x, { min: 0, max: 20, tolerance: 1e-10 });
    expect(result.converged).toBe(true);
    expect(result.value).toBeCloseTo(10, 8);
    expect(result.achieved).toBeCloseTo(100, 8);
  });

  it("solves a decreasing monotonic function", () => {
    const result = goalSeek(20, (x) => 100 - x, { min: 0, max: 100, direction: "decreasing" });
    expect(result.converged).toBe(true);
    expect(result.value).toBeCloseTo(80, 6);
  });

  it("rejects targets outside the modeled bounds", () => {
    expect(() => goalSeek(101, (x) => x, { min: 0, max: 100 })).toThrow(/outside/);
  });

  it("rejects non-finite calculator output", () => {
    expect(() => goalSeek(5, () => Number.POSITIVE_INFINITY, { min: 0, max: 10 })).toThrow(/finite/);
  });

  it("validates bounds and solver controls", () => {
    expect(() => goalSeek(1, (x) => x, { min: 2, max: 1 })).toThrow(/exceed/);
    expect(() => goalSeek(1, (x) => x, { min: 0, max: 2, tolerance: 0 })).toThrow(/Tolerance/);
    expect(() => goalSeek(1, (x) => x, { min: 0, max: 2, maxIterations: 0 })).toThrow(/maxIterations/);
  });
});
