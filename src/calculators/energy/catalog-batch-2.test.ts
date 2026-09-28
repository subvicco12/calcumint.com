import {describe,expect,it} from "vitest";
import {applianceRunningCostCalculator,energyEnvironmentCatalogBatch1Definitions,homeEnergyConsumptionCalculator} from "./catalog-batch-2";
describe("Energy & Environment catalog batch 1",()=>{
 it("registers only genuinely missing canonical entries as standard DRAFT",()=>{expect(energyEnvironmentCatalogBatch1Definitions.map(x=>x.slug)).toEqual(["appliance-running-cost-calculator","home-energy-consumption-calculator"]);for(const x of energyEnvironmentCatalogBatch1Definitions){expect(x.reviewStatus).toBe("draft");expect(x.riskClass).toBe("standard");expect(x.sources.length).toBeGreaterThan(0)}});
 it("calculates appliance energy and cost exactly for the fixture",()=>{expect(applianceRunningCostCalculator.calculate({powerWatts:1500,hoursUsed:2,ratePerKwh:.25},{})).toMatchObject({energyKwh:3,cost:.75})});
 it("calculates arbitrary-period household energy without calling it monthly",()=>{expect(homeEnergyConsumptionCalculator.calculate({averagePowerWatts:500,hoursPerDay:12,days:30,ratePerKwh:.2},{})).toMatchObject({dailyEnergyKwh:6,periodEnergyKwh:180,periodCost:36})});
 it("supports non-month periods with period-labelled outputs",()=>{expect(homeEnergyConsumptionCalculator.calculate({averagePowerWatts:1000,hoursPerDay:1,days:365,ratePerKwh:.1},{})).toMatchObject({dailyEnergyKwh:1,periodEnergyKwh:365,periodCost:36.5})});
 it("rejects more than 24 usage hours per day",()=>{expect(homeEnergyConsumptionCalculator.inputSchema.safeParse({averagePowerWatts:500,hoursPerDay:25,days:30,ratePerKwh:.2}).success).toBe(false)});
});
