import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { bmrCalculator,tdeeCalculator,calorieCalculator,bodyFatCalculator,idealWeightCalculator,healthyWeightCalculator,leanBodyMassCalculator,bodySurfaceAreaCalculator,macroCalculator,healthBatch1Definitions } from "./catalog-batch-1";

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
  it("keeps every Health batch calculator behind the health certification gate",()=>{
    for(const calculator of healthBatch1Definitions){
      expect(calculator.category).toBe("health");
      expect(calculator.riskClass).toBe("health");
      expect(calculator.reviewStatus).toBe("draft");
      expect(calculator.sources.length).toBeGreaterThan(0);
      expect(calculator.formulas.length).toBeGreaterThan(0);
      expect(calculator.examples.length).toBeGreaterThan(0);
    }
  });

  it("covers sex-specific and independent reference outputs",()=>{
    expect(runCalculator(bmrCalculator,{sex:"female",weightKg:60,heightCm:165,ageYears:30}).output.value).toBe(1320.25);
    expect(runCalculator(bodyFatCalculator,{bmi:22.9,ageYears:30,sex:"female"}).output.value).toBeCloseTo(28.98,10);
    expect(runCalculator(idealWeightCalculator,{sex:"female",heightCm:177.8}).output.value).toBeCloseTo(68.5,10);
    expect(runCalculator(leanBodyMassCalculator,{sex:"female",weightKg:60,heightCm:165}).output.value).toBeCloseTo(44.865,10);
    expect(runCalculator(bodySurfaceAreaCalculator,{weightKg:60,heightCm:165}).output.value).toBeCloseTo(1.6583123951777,12);
  });

  it("rejects non-finite and out-of-range inputs",()=>{
    expect(()=>runCalculator(bmrCalculator,{sex:"male",weightKg:0,heightCm:175,ageYears:30})).toThrow();
    expect(()=>runCalculator(tdeeCalculator,{bmrKcal:1600,activityMultiplier:2.6})).toThrow();
    expect(()=>runCalculator(healthyWeightCalculator,{heightCm:175,targetBmi:25})).toThrow();
    expect(()=>runCalculator(macroCalculator,{dailyCalories:2000,proteinPercent:33.3,carbPercent:33.3,fatPercent:33.3})).toThrow();
  });

});
