import { describe, expect, it } from "vitest";
import { launchDefinitions } from "../launch-portfolio";
import { geometryCompletionDefinitions, slopeCalculator } from "./catalog-completion";
import { calculateLegacySlopeCompatibility } from "./slope-legacy-compatibility";
import { calculatorRegistry } from "../registry";

describe("Slope atomic migration HOLD invariants", () => {
  it("keeps the approved coordinate candidate out of the active Geometry definitions", () => {
    expect(slopeCalculator.id).toBe("geometry.slope");
    expect(slopeCalculator.slug).toBe("slope-calculator");
    expect(slopeCalculator.category).toBe("geometry");
    expect(geometryCompletionDefinitions.some((definition) => definition.id === slopeCalculator.id)).toBe(false);
  });
  it("retains exactly one active launch Slope before an authorized atomic replacement", () => {
    const active = launchDefinitions.filter((definition) => definition.slug === "slope-calculator");
    expect(active).toHaveLength(1);
    expect(active[0].id).not.toBe(slopeCalculator.id);
  });
  it("pins the authoritative active registry identity before migration", () => {
    const active = calculatorRegistry.getBySlug("slope-calculator");
    expect(active).toBeDefined();
    expect(active?.id).not.toBe("geometry.slope");
    expect(calculatorRegistry.getById("geometry.slope")).toBeUndefined();
    expect(calculatorRegistry.list().filter((definition) => definition.slug === "slope-calculator")).toHaveLength(1);
  });
  it("does not allow the legacy adapter to accept coordinate payloads", () => {
    expect(() => calculateLegacySlopeCompatibility({ x1: 0, y1: 0, x2: 2, y2: 4 })).toThrow();
  });
});
