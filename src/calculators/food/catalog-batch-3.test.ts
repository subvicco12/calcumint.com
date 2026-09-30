import { describe,expect,it } from "vitest";
import { cakePanConversionCalculator,foodCookingBatch3Definitions } from "./catalog-batch-3";

describe("Food & Cooking catalog batch 3",()=>{
 it("keeps the catalog addition draft and standard-risk",()=>{
  expect(foodCookingBatch3Definitions).toHaveLength(1);
  expect(foodCookingBatch3Definitions.every(x=>x.reviewStatus==="draft"&&x.riskClass==="standard")).toBe(true);
 });
 it("scales ingredient quantity by supplied pan-area ratio",()=>{
  expect(cakePanConversionCalculator.calculate({originalPanArea:64,targetPanArea:100,originalIngredientQuantity:200}).value).toBe(312.5);
  expect(cakePanConversionCalculator.calculate({originalPanArea:100,targetPanArea:50,originalIngredientQuantity:300}).value).toBe(150);
 });
 it("rejects zero original pan area",()=>{
  expect(()=>cakePanConversionCalculator.inputSchema.parse({originalPanArea:0,targetPanArea:100,originalIngredientQuantity:200})).toThrow();
 });
 it("rejects zero target pan area",()=>{
  expect(()=>cakePanConversionCalculator.inputSchema.parse({originalPanArea:64,targetPanArea:0,originalIngredientQuantity:200})).toThrow();
 });
});
