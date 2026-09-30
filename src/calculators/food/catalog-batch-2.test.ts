import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { coffeeRatioCalculator,foodCookingBatch2Definitions,nutritionScalingCalculator,recipeScalingCalculator,servingSizeCalculator,waterToRiceRatioCalculator } from "./catalog-batch-2";

describe("Food and cooking batch 2",()=>{
 it("implements the approved deterministic scaling formulas",()=>{
  expect(runCalculator(recipeScalingCalculator,{originalServings:4,targetServings:10,originalQuantity:250}).output.value).toBe(625);
  expect(runCalculator(servingSizeCalculator,{totalQuantity:1200,servings:6}).output.value).toBe(200);
  expect(runCalculator(nutritionScalingCalculator,{nutrientAmountPerServing:12,servings:2.5}).output.value).toBe(30);
  expect(runCalculator(coffeeRatioCalculator,{waterGrams:600,waterToCoffeeRatio:16}).output.value).toBe(37.5);
  expect(runCalculator(waterToRiceRatioCalculator,{riceAmount:2,waterPerRiceUnit:1.5}).output.value).toBe(3);
 });
 it("keeps every new calculator draft and standard-risk",()=>{
  for(const calculator of foodCookingBatch2Definitions){
   expect(calculator.reviewStatus).toBe("draft");
   expect(calculator.riskClass).toBe("standard");
   expect(calculator.sources[0]?.note).toContain("review remains required");
  }
 });
 it("rejects invalid divisors",()=>{
  expect(()=>runCalculator(recipeScalingCalculator,{originalServings:0,targetServings:4,originalQuantity:100})).toThrow();
  expect(()=>runCalculator(servingSizeCalculator,{totalQuantity:100,servings:0})).toThrow();
  expect(()=>runCalculator(coffeeRatioCalculator,{waterGrams:600,waterToCoffeeRatio:0})).toThrow();
 });
});
