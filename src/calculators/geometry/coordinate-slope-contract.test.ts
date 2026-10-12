import { describe, expect, it } from "vitest";
import { slopeCalculator } from "./catalog-completion";

describe("approved Geometry coordinate slope candidate (not publication authority)", () => {
  it("computes positive and negative slopes from coordinate pairs", () => {
    const positive = slopeCalculator.calculate({ x1: 1, y1: 2, x2: 4, y2: 8 }, {});
    expect(positive.value).toBe(2);
    expect(positive.dx).toBe(3);
    expect(positive.dy).toBe(6);
    const negative = slopeCalculator.calculate({ x1: -2, y1: 5, x2: 2, y2: -3 }, {});
    expect(negative.value).toBe(-2);
  });
  it("rejects vertical lines through the input schema", () => {
    expect(slopeCalculator.inputSchema.safeParse({ x1: 3, y1: 1, x2: 3, y2: 8 }).success).toBe(false);
  });
  it("is invariant under endpoint reversal", () => {
    const a = slopeCalculator.calculate({ x1: -1, y1: 2, x2: 3, y2: 10 }, {});
    const b = slopeCalculator.calculate({ x1: 3, y1: 10, x2: -1, y2: 2 }, {});
    expect(a.value).toBe(b.value);
    expect(a.value).toBe(2);
  });
  it("preserves the numeric rise/run slope through an origin-anchored adapter", () => {
    const legacy = { rise: -8, run: 4 };
    const migrated = { x1: 0, y1: 0, x2: legacy.run, y2: legacy.rise };
    expect(slopeCalculator.calculate(migrated, {}).value).toBe(legacy.rise / legacy.run);
    expect(slopeCalculator.inputSchema.safeParse({ x1: 0, y1: 0, x2: 0, y2: 5 }).success).toBe(false);
  });
  it("rejects nonfinite coordinates", () => {
    expect(slopeCalculator.inputSchema.safeParse({ x1: Infinity, y1: 0, x2: 1, y2: 2 }).success).toBe(false);
  });
});
