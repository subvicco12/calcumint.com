import { describe, expect, it } from "vitest";
import { createCalculationSnapshot } from "../../lib/calculation-snapshot";
import { eligibleScenarioContract, reevaluateScenario } from "../../lib/scenario-reevaluation";
import { calculateLegacySlopeCompatibility } from "./slope-legacy-compatibility";

describe("legacy slope snapshot preservation and scenario HOLD", () => {
  it("does not mutate a captured rise/run snapshot when computing a derived representation", () => {
    const historical = createCalculationSnapshot({
      calculatorSlug: "slope-calculator",
      calculatorVersion: 1,
      input: { rise: -8, run: 4 },
      output: { result: -2 },
    });
    const before = JSON.stringify(historical);
    const adapted = calculateLegacySlopeCompatibility(historical.input);
    expect(JSON.stringify(historical)).toBe(before);
    expect(historical.input).toEqual({ rise: -8, run: 4 });
    expect(historical.output).toEqual({ result: -2 });
    expect(adapted.derivedCoordinates).toEqual({ x1: 0, y1: 0, x2: 4, y2: -8 });
  });
  it("keeps legacy and coordinate Slope out of scenario re-evaluation allowlist", () => {
    const legacy = createCalculationSnapshot({
      calculatorSlug: "slope-calculator", calculatorVersion: 1,
      input: { rise: 2, run: 1 }, output: { result: 2 },
    });
    const coordinate = createCalculationSnapshot({
      calculatorSlug: "slope-calculator", calculatorVersion: 2,
      input: { x1: 0, y1: 0, x2: 1, y2: 2 },
      output: { value: 2, dx: 1, dy: 2 },
    });
    expect(eligibleScenarioContract(legacy)).toBeUndefined();
    expect(eligibleScenarioContract(coordinate)).toBeUndefined();
    expect(() => reevaluateScenario(legacy, eligibleScenarioContract(legacy))).toThrow(/explicit reviewed contract/);
    expect(() => reevaluateScenario(coordinate, eligibleScenarioContract(coordinate))).toThrow(/explicit reviewed contract/);
  });
});
