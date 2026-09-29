import { describe, expect, it } from "vitest";
import { lightingEnergyCalculator } from "./catalog-batch-3";

describe("Energy & Environment catalog batch 2", () => {
  it("keeps catalog #489 identity and governance as DRAFT", () => {
    expect(lightingEnergyCalculator.slug).toBe("lighting-energy-calculator");
    expect(lightingEnergyCalculator.reviewStatus).toBe("draft");
    expect(lightingEnergyCalculator.riskClass).toBe("standard");
    expect(lightingEnergyCalculator.sources[0]?.url).toContain("energy.gov");
  });

  it("calculates lighting energy from quantity, wattage, and runtime", () => {
    expect(lightingEnergyCalculator.calculate({ quantity: 10, wattsPerLight: 12, hoursUsed: 5 }, {}).energyKwh).toBe(0.6);
  });

  it("accepts zero runtime as zero energy", () => {
    expect(lightingEnergyCalculator.calculate({ quantity: 4, wattsPerLight: 9, hoursUsed: 0 }, {}).energyKwh).toBe(0);
  });

  it("rejects invalid fixture quantities", () => {
    expect(lightingEnergyCalculator.inputSchema.safeParse({ quantity: 0, wattsPerLight: 12, hoursUsed: 5 }).success).toBe(false);
    expect(lightingEnergyCalculator.inputSchema.safeParse({ quantity: 1.5, wattsPerLight: 12, hoursUsed: 5 }).success).toBe(false);
  });
});
