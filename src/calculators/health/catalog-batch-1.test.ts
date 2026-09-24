import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { bmrCalculator,tdeeCalculator,calorieCalculator,bodyFatCalculator,idealWeightCalculator,healthyWeightCalculator,leanBodyMassCalculator,bodySurfaceAreaCalculator,macroCalculator } from "./catalog-batch-1";

describe("Health catalog #389-397 draft engines",()=>{
  it("matches golden reference calculations",()=>{
    expect(runCalculator(bmrCalculator,{sex:"male",weightKg:70,heightCm:175,ageYears:30}).output.value).toBe(1648.75);
    expect(runCalculator(tdeeCalculator,{bmrKcal:1600,activityMultiplier:1.5}).output.value).toBe(2400);
    expect(runCalculator(calorieCalculator,{tdeeKcal:2400,dailyAdjustmentKcal:-300}).output.value).toBe(2100);
    expect(runCalculator(bodyFatCalculator,{bmi:22.9,ageYears:30,sex:"male"}).output.value).toBeCloseTo(18.18,10);
    expect(runCalculator(idealWeightCalculator,{sex:"male",heightCm:177.8}).output.value).toBeCloseTo(73,10);
    expect(runCalculator(healthyWeightCalculator,{heightCm:175,targetBmi:22}).output.value).toBeCloseTo(67.375,10);
    expect(runCalculator(leanBodyMassCalculator,{sex:"male",weightKg:70,heightCm:175}).output.value).toBeCloseTo(56.015,10);
    expect(runCalculator(bodySurfaceAreaCalculator,{weightKg:70,heightCm:175}).output.value).toBeCloseTo(1.8446619684315546,10);
    expect(runCalculator(macroCalculator,{dailyCalories:2000,proteinPercent:30,carbPercent:40,fatPercent:30}).output.value).toBe(150);
  });
  it("rejects invalid health inputs",()=>{
    expect(()=>runCalculator(bmrCalculator,{sex:"male",weightKg:70,heightCm:175,ageYears:17})).toThrow();
    expect(()=>runCalculator(macroCalculator,{dailyCalories:2000,proteinPercent:30,carbPercent:30,fatPercent:30})).toThrow();
    expect(()=>runCalculator(idealWeightCalculator,{sex:"female",heightCm:150})).toThrow();
  });
});
