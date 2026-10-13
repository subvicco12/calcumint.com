import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "../registry";
import { slopeCalculator } from "./catalog-completion";
import { calculateLegacySlopeCompatibility } from "./slope-legacy-compatibility";
import { createCalculationSnapshot } from "../../lib/calculation-snapshot";
import { eligibleScenarioContract } from "../../lib/scenario-reevaluation";

/**
 * Draft-only registry characterization. This is deliberately NOT a production
 * dispatch implementation or authorization to replace the active registry.
 */
describe("Slope draft registry version separation", () => {
  it("reserves legacy v1 and selects coordinate v2 in the draft registry", () => {
    const active = calculatorRegistry.getBySlug("slope-calculator");
    expect(active).toBeDefined();
    expect(active?.slug).toBe(slopeCalculator.slug);
    expect(active?.version).toBe(2);
    expect(slopeCalculator.version).toBe(2);
    expect(active?.id).toBe(slopeCalculator.id);
    expect(calculatorRegistry.getById(slopeCalculator.id)).toBe(active);
  });
  it("keeps historical v1 rise/run payload distinct from candidate coordinate input", () => {
    const legacy = createCalculationSnapshot({
      calculatorSlug: "slope-calculator",
      calculatorVersion: 1,
      input: { rise: 9, run: 3 },
      output: { result: 3 },
    });
    expect(slopeCalculator.inputSchema.safeParse(legacy.input).success).toBe(false);
    expect(calculateLegacySlopeCompatibility(legacy.input).legacyOutput).toEqual({ result: 3 });
    expect(legacy.calculatorVersion).toBe(1);
    expect(legacy.input).toEqual({ rise: 9, run: 3 });
  });
  it("rejects automatic scenario eligibility for both proposed snapshot generations", () => {
    for (const version of [1, 2]) {
      const snapshot = createCalculationSnapshot({
        calculatorSlug: "slope-calculator", calculatorVersion: version,
        input: version === 1 ? { rise: 6, run: 3 } : { x1: 0, y1: 0, x2: 3, y2: 6 },
        output: version === 1 ? { result: 2 } : { value: 2, dx: 3, dy: 6 },
      });
      expect(eligibleScenarioContract(snapshot)).toBeUndefined();
    }
  });
  it("does not misinterpret coordinate input as a historical rise/run payload", () => {
    const coordinates = { x1: 1, y1: 2, x2: 4, y2: 8 };
    expect(slopeCalculator.inputSchema.safeParse(coordinates).success).toBe(true);
    expect(() => calculateLegacySlopeCompatibility(coordinates)).toThrow();
  });
});
