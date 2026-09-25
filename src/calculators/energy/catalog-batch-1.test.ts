import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { energyEvBatch1Definitions,evChargingCostCalculator,evRangeCalculator,evTripEnergyCalculator,evChargingTimeCalculator,solarDailyEnergyCalculator,solarPaybackCalculator } from "./catalog-batch-1";
describe("Energy and EV batch 1",()=>{
 it("matches golden examples",()=>{const cases = [
 [evChargingCostCalculator,{batteryEnergyAddedKwh:50,electricityRatePerKwh:.2,chargingEfficiencyPercent:90},11.111111],
 [evRangeCalculator,{usableBatteryKwh:60,consumptionKwhPer100Km:15},400],
 [evTripEnergyCalculator,{distanceKm:300,consumptionKwhPer100Km:18},54],
 [evChargingTimeCalculator,{energyToAddKwh:40,averageChargingPowerKw:10},4],
 [solarDailyEnergyCalculator,{systemSizeKw:5,peakSunHours:5,systemEfficiencyPercent:80},20],
 [solarPaybackCalculator,{netSystemCost:12000,annualSavings:1500},8]];
 expect(runCalculator(evChargingCostCalculator,cases[0][1] as {batteryEnergyAddedKwh:number; electricityRatePerKwh:number; chargingEfficiencyPercent:number}).output.value).toBe(11.111111);
 expect(runCalculator(evRangeCalculator,cases[1][1] as {usableBatteryKwh:number; consumptionKwhPer100Km:number}).output.value).toBe(400);
 expect(runCalculator(evTripEnergyCalculator,cases[2][1] as {distanceKm:number; consumptionKwhPer100Km:number}).output.value).toBe(54);
 expect(runCalculator(evChargingTimeCalculator,cases[3][1] as {energyToAddKwh:number; averageChargingPowerKw:number}).output.value).toBe(4);
 expect(runCalculator(solarDailyEnergyCalculator,cases[4][1] as {systemSizeKw:number; peakSunHours:number; systemEfficiencyPercent:number}).output.value).toBe(20);
 expect(runCalculator(solarPaybackCalculator,cases[5][1] as {netSystemCost:number; annualSavings:number}).output.value).toBe(8);
 });
 it("is draft standard-risk with evidence",()=>{for(const c of energyEvBatch1Definitions){expect(c.reviewStatus).toBe("draft");expect(c.riskClass).toBe("standard");expect(c.sources[0]?.url).toBeTruthy();}});
 it("rejects invalid denominators/efficiency",()=>{
  expect(()=>runCalculator(evRangeCalculator,{usableBatteryKwh:60,consumptionKwhPer100Km:0})).toThrow();
  expect(()=>runCalculator(evChargingTimeCalculator,{energyToAddKwh:40,averageChargingPowerKw:0})).toThrow();
  expect(()=>runCalculator(solarPaybackCalculator,{netSystemCost:1000,annualSavings:0})).toThrow();
  expect(()=>runCalculator(evChargingCostCalculator,{batteryEnergyAddedKwh:10,electricityRatePerKwh:.2,chargingEfficiencyPercent:0})).toThrow();
 });
});
