import { describe, expect, it } from "vitest";
import { launchDefinitions } from "../launch-portfolio";
import { geometryCompletionDefinitions, slopeCalculator } from "./catalog-completion";
import { calculateLegacySlopeCompatibility } from "./slope-legacy-compatibility";
import { calculatorRegistry } from "../registry";

describe("Slope draft-only atomic registry invariants", () => {
  it("includes the approved coordinate candidate in the draft Geometry definitions", () => {
    expect(slopeCalculator.id).toBe("geometry.slope");
    expect(slopeCalculator.slug).toBe("slope-calculator");
    expect(slopeCalculator.category).toBe("geometry");
    expect(geometryCompletionDefinitions.some((definition) => definition.id === slopeCalculator.id)).toBe(true);
  });
  it("retains the legacy Slope source but not in the active registry", () => {
    const active = launchDefinitions.filter((definition) => definition.slug === "slope-calculator");
    expect(active).toHaveLength(1);
    expect(active[0].id).not.toBe(slopeCalculator.id);
  });
  it("pins the draft registry to exactly one Geometry Slope v2", () => {
    const active = calculatorRegistry.getBySlug("slope-calculator");
    expect(active).toBeDefined();
    expect(active?.id).toBe("geometry.slope");
    expect(active?.version).toBe(2);
    expect(calculatorRegistry.getById("geometry.slope")).toBe(active);
    expect(calculatorRegistry.list().filter((definition) => definition.slug === "slope-calculator")).toHaveLength(1);
  });
  it("does not allow the legacy adapter to accept coordinate payloads", () => {
    expect(() => calculateLegacySlopeCompatibility({ x1: 0, y1: 0, x2: 2, y2: 4 })).toThrow();
  });
});
