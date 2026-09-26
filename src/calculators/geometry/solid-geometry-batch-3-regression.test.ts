import { describe, expect, it } from "vitest";
import { ellipsoidSurfaceAreaApprox, sphericalSegmentVolume } from "./solid-geometry-batch-3";

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

describe("solid geometry batch 3 spherical segment stability", () => {
  it("avoids pole-adjacent cancellation for a thin valid segment", () => {
    const result = sphericalSegmentVolume.calculate({
      sphereRadiusM: 1,
      capHeight1M: 2 - 5e-16,
      capHeight2M: 2.5e-16,
    });
    expect(result.value).toBeCloseTo(4.23220365287269e-31, 12);
  });

  it("preserves the existing worked example", () => {
    const result = sphericalSegmentVolume.calculate({
      sphereRadiusM: 5,
      capHeight1M: 1,
      capHeight2M: 1,
    });
    expect(result.value).toBeCloseTo((472 * Math.PI) / 3, 12);
  });
});
