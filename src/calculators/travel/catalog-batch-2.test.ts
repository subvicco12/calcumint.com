import { describe, expect, it } from "vitest";
import { fuelTripCostCalculator, travelEverydayBatch2Definitions, tripCostCalculator } from "./catalog-batch-2";

describe("Travel & Everyday catalog batch 2", () => {
  it("stays draft standard-risk", () => {
    expect(travelEverydayBatch2Definitions).toHaveLength(2);
    expect(travelEverydayBatch2Definitions.every((x) => x.reviewStatus === "draft" && x.riskClass === "standard")).toBe(true);
  });

  it("calculates deterministic trip costs", () => {
    expect(fuelTripCostCalculator.calculate({ distanceKm: 500, litersPer100Km: 8, pricePerLiter: 2 }, {}).value).toBe(80);
    expect(tripCostCalculator.calculate({ transportCost: 300, lodgingCost: 500, foodCost: 200, otherCost: 100 }, {}).value).toBe(1100);
  });
});
