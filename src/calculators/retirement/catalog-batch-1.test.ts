import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { fireNumberCalculator,retirementContributionGoalCalculator,retirementCorpusCalculator,retirementFiBatch1Definitions,retirementIncomeCalculator,retirementSavingsGapCalculator,yearsToRetirementGoalCalculator } from "./catalog-batch-1";
describe("Retirement and FI batch 1",()=>{
 it("matches deterministic planning examples",()=>{
  expect(runCalculator(retirementCorpusCalculator,{annualRetirementSpending:40000,withdrawalRatePercent:4}).output.value).toBe(1000000);
  expect(runCalculator(retirementIncomeCalculator,{retirementPortfolio:1000000,withdrawalRatePercent:4}).output.value).toBe(40000);
  expect(runCalculator(fireNumberCalculator,{annualSpending:50000,assumedWithdrawalRatePercent:4}).output.value).toBe(1250000);
  expect(runCalculator(retirementSavingsGapCalculator,{targetRetirementSavings:1000000,currentRetirementSavings:250000}).output.value).toBe(750000);
  expect(runCalculator(retirementContributionGoalCalculator,{targetFutureValue:120000,currentSavings:0,annualReturnPercent:0,years:10}).output.value).toBe(1000);
  expect(runCalculator(yearsToRetirementGoalCalculator,{currentSavings:100000,annualContribution:20000,targetSavings:500000}).output.value).toBe(20);
 });
 it("remains financial-risk draft with source evidence",()=>{for(const c of retirementFiBatch1Definitions){expect(c.reviewStatus).toBe("draft");expect(c.riskClass).toBe("financial");expect(c.sources[0]?.url).toBeTruthy();}});
 it("rejects invalid withdrawal rates and denominators",()=>{
  expect(()=>runCalculator(retirementCorpusCalculator,{annualRetirementSpending:40000,withdrawalRatePercent:0})).toThrow();
  expect(()=>runCalculator(fireNumberCalculator,{annualSpending:50000,assumedWithdrawalRatePercent:0})).toThrow();
  expect(()=>runCalculator(yearsToRetirementGoalCalculator,{currentSavings:0,annualContribution:0,targetSavings:100000})).toThrow();
 });
});
