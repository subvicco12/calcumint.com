import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { automotiveTravelBatch1Definitions,costPerDistanceCalculator,litersPer100KmToMpgCalculator,roadTripFuelCalculator,roadTripFuelCostCalculator,travelTimeCalculator,usMpgToLitersPer100KmCalculator } from "./catalog-batch-1";
describe("Automotive and travel batch 1",()=>{
 it("matches deterministic golden examples",()=>{
  expect(runCalculator(travelTimeCalculator,{distanceKm:300,averageSpeedKmh:60}).output.value).toBe(5);
  expect(runCalculator(roadTripFuelCalculator,{distanceKm:500,fuelConsumptionLitersPer100Km:8}).output.value).toBe(40);
  expect(runCalculator(roadTripFuelCostCalculator,{distanceKm:500,fuelConsumptionLitersPer100Km:8,fuelPricePerLiter:1.5}).output.value).toBe(60);
  expect(runCalculator(litersPer100KmToMpgCalculator,{litersPer100Km:10}).output.value).toBe(23.521458);
  expect(runCalculator(usMpgToLitersPer100KmCalculator,{usMpg:30}).output.value).toBe(7.840486);
  expect(runCalculator(costPerDistanceCalculator,{fuelConsumptionLitersPer100Km:8,fuelPricePerLiter:1.5}).output.value).toBe(12);
 });
 it("stays draft standard-risk with evidence",()=>{for(const c of automotiveTravelBatch1Definitions){expect(c.reviewStatus).toBe("draft");expect(c.riskClass).toBe("standard");expect(c.sources[0]?.url).toBeTruthy();}});
 it("rejects zero denominators",()=>{
  expect(()=>runCalculator(travelTimeCalculator,{distanceKm:10,averageSpeedKmh:0})).toThrow();
  expect(()=>runCalculator(litersPer100KmToMpgCalculator,{litersPer100Km:0})).toThrow();
  expect(()=>runCalculator(usMpgToLitersPer100KmCalculator,{usMpg:0})).toThrow();
 });
});
