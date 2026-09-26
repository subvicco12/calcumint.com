import { describe, expect, it } from "vitest";
import { ellipsoidSurfaceAreaApprox } from "./solid-geometry-batch-3";

describe("solid geometry batch 3 ellipsoid regression", () => {
  it("uses the p=1.6075 Knud Thomsen approximation", () => {
    const result = ellipsoidSurfaceAreaApprox.calculate({
      semiAxisAM: 2,
      semiAxisBM: 3,
      semiAxisCM: 4,
    });
    expect(result.value).toBeCloseTo(111.60403107978028, 12);
    expect(ellipsoidSurfaceAreaApprox.formulas[0]?.expression).toContain("p=1.6075");
  });

  it("remains exact for the sphere special case", () => {
    const result = ellipsoidSurfaceAreaApprox.calculate({
      semiAxisAM: 5,
      semiAxisBM: 5,
      semiAxisCM: 5,
    });
    expect(result.value).toBeCloseTo(100 * Math.PI, 12);
  });

  it("uses a Thomsen-specific source rather than the generic geometry source", () => {
    expect(ellipsoidSurfaceAreaApprox.sources[0]?.url).toContain("numericana.com/answer/ellipsoid");
  });
});
