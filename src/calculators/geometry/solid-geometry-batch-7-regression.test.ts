import { describe, expect, it } from "vitest";
import {
  rectangularPyramidVolume,
  sphericalShellVolume,
  triangularPyramidVolume,
} from "./solid-geometry-batch-7";

describe("solid geometry batch 7 volume regressions", () => {
  it("keeps spherical shell volume at 4π(R³-r³)/3", () => {
    const result = sphericalShellVolume.calculate({ outerRadiusM: 3, innerRadiusM: 2 });
    expect(result.value).toBeCloseTo((76 * Math.PI) / 3, 12);
  });

  it("keeps rectangular pyramid volume at lwh/3", () => {
    const result = rectangularPyramidVolume.calculate({ lengthM: 4, widthM: 3, heightM: 5 });
    expect(result.value).toBeCloseTo(20, 12);
  });

  it("keeps triangular pyramid volume at Ah/3", () => {
    const result = triangularPyramidVolume.calculate({ baseAreaM2: 6, heightM: 5 });
    expect(result.value).toBeCloseTo(10, 12);
  });
});
