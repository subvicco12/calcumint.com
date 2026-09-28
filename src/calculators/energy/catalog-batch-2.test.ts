import {describe,expect,it} from "vitest";
import {applianceRunningCostCalculator,electricityCostCalculator,energyEnvironmentCatalogBatch1Definitions,homeEnergyConsumptionCalculator} from "./catalog-batch-2";
describe("Energy & Environment catalog batch 1",()=>{
 it("registers the canonical missing entries as standard DRAFT",()=>{expect(energyEnvironmentCatalogBatch1Definitions.map(x=>x.slug)).toEqual(["electricity-cost-calculator","appliance-running-cost-calculator","home-energy-consumption-calculator"]);for(const x of energyEnvironmentCatalogBatch1Definitions){expect(x.reviewStatus).toBe("draft");expect(x.riskClass).toBe("standard");expect(x.sources.length).toBeGreaterThan(0)}});
 it("calculates direct electricity cost",()=>{expect(electricityCostCalculator.calculate({energyKwh:250,ratePerKwh:.2},{}).cost).toBe(50)});
 it("calculates appliance energy and cost",()=>{const r=applianceRunningCostCalculator.calculate({powerWatts:1500,hoursUsed:2,ratePerKwh:.2},{});expect(r.energyKwh).toBe(3);expect(r.cost).toBeCloseTo(.6,12)});
 it("calculates period household energy",()=>{expect(homeEnergyConsumptionCalculator.calculate({averagePowerWatts:500,hoursPerDay:12,days:30,ratePerKwh:.2},{})).toMatchObject({dailyEnergyKwh:6,monthlyEnergyKwh:180,monthlyCost:36})});
 it("rejects more than 24 usage hours per day",()=>{expect(homeEnergyConsumptionCalculator.inputSchema.safeParse({averagePowerWatts:500,hoursPerDay:25,days:30,ratePerKwh:.2}).success).toBe(false)});
});
