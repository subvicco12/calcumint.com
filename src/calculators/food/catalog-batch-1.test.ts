import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { bakersPercentageCalculator,brineSaltCalculator,doughHydrationCalculator,doughPieceWeightCalculator,doughTotalWeightCalculator,foodCookingBatch1Definitions,ingredientFromBakersPercentCalculator } from "./catalog-batch-1";
describe("Food and cooking batch 1",()=>{
 it("matches deterministic golden examples",()=>{
  expect(runCalculator(bakersPercentageCalculator,{ingredientWeightGrams:700,flourWeightGrams:1000}).output.value).toBe(70);
  expect(runCalculator(doughHydrationCalculator,{waterWeightGrams:700,flourWeightGrams:1000}).output.value).toBe(70);
  expect(runCalculator(ingredientFromBakersPercentCalculator,{flourWeightGrams:1000,bakersPercent:2}).output.value).toBe(20);
  expect(runCalculator(doughTotalWeightCalculator,{flourWeightGrams:1000,waterWeightGrams:700,otherIngredientsGrams:50}).output.value).toBe(1750);
  expect(runCalculator(doughPieceWeightCalculator,{totalDoughWeightGrams:1800,numberOfPieces:6}).output.value).toBe(300);
  expect(runCalculator(brineSaltCalculator,{waterWeightGrams:1000,saltPercentOfWater:2}).output.value).toBe(20);
 });
 it("stays draft standard-risk with source evidence",()=>{for(const c of foodCookingBatch1Definitions){expect(c.reviewStatus).toBe("draft");expect(c.riskClass).toBe("standard");expect(c.sources[0]?.url).toBeTruthy();}});
 it("rejects zero denominators and invalid percentage",()=>{
  expect(()=>runCalculator(bakersPercentageCalculator,{ingredientWeightGrams:100,flourWeightGrams:0})).toThrow();
  expect(()=>runCalculator(doughHydrationCalculator,{waterWeightGrams:100,flourWeightGrams:0})).toThrow();
  expect(()=>runCalculator(doughPieceWeightCalculator,{totalDoughWeightGrams:100,numberOfPieces:0})).toThrow();
  expect(()=>runCalculator(brineSaltCalculator,{waterWeightGrams:1000,saltPercentOfWater:101})).toThrow();
 });
});
