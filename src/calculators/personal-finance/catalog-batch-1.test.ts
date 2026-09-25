import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { monthlyBudgetBalanceCalculator,personalMoneyBatch1Definitions,savingsGoalCalculator,savingsRateCalculator,sinkingFundCalculator } from "./catalog-batch-1";
describe("Personal money batch 1",()=>{
 it("matches deterministic planning examples",()=>{  expect(runCalculator(savingsRateCalculator,{income:5000,savings:1000}).output.value).toBe(20);  expect(runCalculator(monthlyBudgetBalanceCalculator,{monthlyIncome:5000,monthlyExpenses:4200}).output.value).toBe(800);
  expect(runCalculator(sinkingFundCalculator,{targetAmount:6000,currentAmount:1200,monthsRemaining:12}).output.value).toBe(400);
  expect(runCalculator(savingsGoalCalculator,{targetAmount:10000,currentSavings:2000,monthlyContribution:500}).output.value).toBe(16);
 });
 it("remains financial-risk draft with source evidence",()=>{for(const c of personalMoneyBatch1Definitions){expect(c.reviewStatus).toBe("draft");expect(c.riskClass).toBe("financial");expect(c.sources[0]?.url).toBeTruthy();}});
 it("rejects zero denominators",()=>{
  expect(()=>runCalculator(savingsRateCalculator,{income:0,savings:100})).toThrow();
  expect(()=>runCalculator(sinkingFundCalculator,{targetAmount:1000,currentAmount:0,monthsRemaining:0})).toThrow();
  expect(()=>runCalculator(savingsGoalCalculator,{targetAmount:1000,currentSavings:0,monthlyContribution:0})).toThrow();
 });
});
