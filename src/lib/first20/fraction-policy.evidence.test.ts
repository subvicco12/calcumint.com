import { describe, expect, it } from "vitest";
import { getLaunchSpec, launchDefinition } from "../../calculators/launch-portfolio";
import { runCalculator } from "../../calculators/engine";

// Observed legacy compatibility witnesses, not canonical approval or new policy.
const spec = getLaunchSpec("decimal-to-fraction-calculator")!;
const definition = launchDefinition(spec);
describe("#214 observed legacy fraction policy evidence", () => {
  it("reproduces CODEX44-02 below-half input promoted by absolute EPSILON", () => {
    const input = { decimal: 0.4999999999999999, precision: 0 };
    expect(Math.round(input.decimal)).toBe(0);
    expect(runCalculator(definition, input).output.result).toBe(1);
    expect(spec.formatResult?.(input, 1)).toBe("1/1");
  });
  it("distinguishes the declared formula from its EPSILON-adjusted implementation", () => {
    expect(spec.formula).toBe("reduced round(decimal × 10^precision) / 10^precision");
    const input = { decimal: 1.005, precision: 2 };
    expect(Math.round(input.decimal * 100) / 100).toBe(1);
    expect(runCalculator(definition, input).output.result).toBe(1.01);
    expect(spec.formatResult?.(input, 1.01)).toBe("101/100");
  });
  it("retains positive-infinity negative ties rather than half-away-from-zero", () => {
    const input = { decimal: -0.125, precision: 2 };
    expect(runCalculator(definition, input).output.result).toBe(-0.12);
    expect(spec.formatResult?.(input, -0.12)).toBe("-3/25");
    expect(Math.sign(input.decimal) * Math.round(Math.abs(input.decimal) * 100) / 100).toBe(-0.13);
  });
  it("retains signed numeric zero while the fraction presentation uses unsigned zero", () => {
    const input = { decimal: -0.5, precision: 0 };
    expect(Object.is(runCalculator(definition, input).output.result, -0)).toBe(true);
    expect(spec.formatResult?.(input, -0)).toBe("0/1");
  });
});
