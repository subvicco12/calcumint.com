import { describe, expect, it } from "vitest";
import { combinationCalculator, binomialProbabilityCalculator, normalDistributionCalculator, correlationCalculator } from "./catalog-batch-3";
describe("statistics batch 3 domain regression", () => {
  it("preserves combination symmetry and exact small counts", () => {
    expect(combinationCalculator.calculate({n:10,r:3},{}).combinations).toBe(120);
    expect(combinationCalculator.calculate({n:10,r:7},{}).combinations).toBe(120);
    expect(() => combinationCalculator.calculate({n:5,r:6},{})).toThrow();
    expect(() => combinationCalculator.calculate({n:100,r:50},{})).toThrow();
  });
  it("handles degenerate binomial probabilities", () => {
    expect(binomialProbabilityCalculator.calculate({n:10,k:0,p:0},{}).probability).toBe(1);
    expect(binomialProbabilityCalculator.calculate({n:10,k:1,p:0},{}).probability).toBe(0);
    expect(binomialProbabilityCalculator.calculate({n:10,k:10,p:1},{}).probability).toBe(1);
    expect(binomialProbabilityCalculator.calculate({n:10,k:9,p:1},{}).probability).toBe(0);
  });
  it("preserves normal symmetry and rejects zero deviation", () => {
    const left=normalDistributionCalculator.calculate({x:-1,mean:0,standardDeviation:1},{});
    const right=normalDistributionCalculator.calculate({x:1,mean:0,standardDeviation:1},{});
    expect(left.cdf).toBeCloseTo(right.upperTail,10);
    expect(() => normalDistributionCalculator.calculate({x:1,mean:0,standardDeviation:0},{})).toThrow();
  });
  it("rejects constant or mismatched correlation datasets", () => {
    expect(correlationCalculator.calculate({xValues:[1,2,3],yValues:[3,2,1]},{}).correlation).toBeCloseTo(-1,10);
    expect(() => correlationCalculator.calculate({xValues:[1,1],yValues:[2,3]},{})).toThrow();
    expect(() => correlationCalculator.calculate({xValues:[1,2],yValues:[2,3,4]},{})).toThrow();
  });
});
