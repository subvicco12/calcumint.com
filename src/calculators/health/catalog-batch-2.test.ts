import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {proteinIntakeCalculator,carbohydrateIntakeCalculator,fatIntakeCalculator,caloriesBurnedCalculator,oneRepMaxCalculator,targetHeartRateCalculator,healthBatch2Definitions} from "./catalog-batch-2";
describe("Health catalog #398-403 draft engines",()=>{
 it("matches golden references",()=>{
  expect(runCalculator(proteinIntakeCalculator,{weightKg:70}).output.value).toBe(56);
  expect(runCalculator(carbohydrateIntakeCalculator,{dailyCalories:2000}).output.value).toBe(275);
  expect(runCalculator(fatIntakeCalculator,{dailyCalories:2000}).output.value).toBeCloseTo(61.111111111111114,12);
  expect(runCalculator(caloriesBurnedCalculator,{weightKg:70,met:3.5,minutes:30}).output.value).toBe(128.625);
  expect(runCalculator(oneRepMaxCalculator,{weightKg:60,repetitions:10}).output.value).toBe(80);\n  expect(runCalculator(targetHeartRateCalculator,{ageYears:40}).output.value).toBe(180);
 });
 it("enforces draft health certification metadata",()=>{
  for(const calculator of healthBatch2Definitions){expect(calculator.category).toBe("health");expect(calculator.riskClass).toBe("health");expect(calculator.reviewStatus).toBe("draft");expect(calculator.sources.length).toBeGreaterThan(0);expect(calculator.formulas.length).toBeGreaterThan(0);expect(calculator.examples.length).toBeGreaterThan(0)}
 });
 it("rejects invalid inputs",()=>{
  expect(()=>runCalculator(proteinIntakeCalculator,{weightKg:0})).toThrow();
  expect(()=>runCalculator(caloriesBurnedCalculator,{weightKg:70,met:21,minutes:30})).toThrow();
  expect(()=>runCalculator(oneRepMaxCalculator,{weightKg:60,repetitions:31})).toThrow();\n  expect(()=>runCalculator(targetHeartRateCalculator,{ageYears:19})).toThrow();\n  expect(()=>runCalculator(targetHeartRateCalculator,{ageYears:71})).toThrow();
 });
});
