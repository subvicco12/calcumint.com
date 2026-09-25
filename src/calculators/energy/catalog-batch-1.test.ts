import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { energyEvBatch1Definitions,evChargingCostCalculator,evRangeCalculator,evTripEnergyCalculator,evChargingTimeCalculator,solarDailyEnergyCalculator,solarPaybackCalculator } from "./catalog-batch-1";
describe("Energy and EV batch 1",()=>{
 it("matches golden examples",()=>{const cases:[[any,any,number]]|any[]=[
 [evChargingCostCalculator,{batteryEnergyAddedKwh:50,electricityRatePerKwh:.2,chargingEfficiencyPercent:90},11.111111],
 [evRangeCalculator,{usableBatteryKwh:60,consumptionKwhPer100Km:15},400],
 [evTripEnergyCalculator,{distanceKm:300,consumptionKwhPer100Km:18},54],
 [evChargingTimeCalculator,{energyToAddKwh:40,averageChargingPowerKw:10},4],
 [solarDailyEnergyCalculator,{systemSizeKw:5,peakSunHours:5,systemEfficiencyPercent:80},20],
 [solarPaybackCalculator,{netSystemCost:12000,annualSavings:1500},8]];
 for(const [c,input,expected] of cases) expect(runCalculator(c,input).output.value).toBe(expected);
 });
 it("is draft standard-risk with evidence",()=>{for(const c of energyEvBatch1Definitions){expect(c.reviewStatus).toBe("draft");expect(c.riskClass).toBe("standard");expect(c.sources[0]?.url).toBeTruthy();}});
 it("rejects invalid denominators/efficiency",()=>{
  expect(()=>runCalculator(evRangeCalculator,{usableBatteryKwh:60,consumptionKwhPer100Km:0})).toThrow();
  expect(()=>runCalculator(evChargingTimeCalculator,{energyToAddKwh:40,averageChargingPowerKw:0})).toThrow();
  expect(()=>runCalculator(solarPaybackCalculator,{netSystemCost:1000,annualSavings:0})).toThrow();
  expect(()=>runCalculator(evChargingCostCalculator,{batteryEnergyAddedKwh:10,electricityRatePerKwh:.2,chargingEfficiencyPercent:0})).toThrow();
 });
});
