import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {loanAnalysisCalculator} from "../finance/loan-analysis";import {sipCalculator} from "../finance/sip";import {compoundInterestCalculator} from "../finance/compound-interest";import {breakEvenCalculator} from "../business/break-even";import {loanScenarios,sipScenarios,compoundInterestScenarios,breakEvenScenarios,loanRateSensitivity,sipSensitivity,compoundInterestSensitivity,breakEvenSensitivity} from "./analysis";
describe("advanced analysis deterministic reconciliation",()=>{
 it("scenario baselines reconcile to authoritative engine outputs",()=>{
  const loan={principal:100000,annualRatePercent:6,termMonths:360,extraMonthlyPayment:0};expect(loanScenarios(loan).find(x=>x.label==="6.00% rate")?.value).toBe(runCalculator(loanAnalysisCalculator,loan).output.totalInterest);
  const sip={monthlyContribution:500,annualReturnPercent:8,termMonths:120,contributionTiming:"end" as const};expect(sipScenarios(sip).find(x=>x.label==="0% return")?.value).toBe(runCalculator(sipCalculator,sip).output.futureValue);
  const ci={principal:10000,annualRatePercent:5,years:10,compoundsPerYear:12};expect(compoundInterestScenarios(ci).find(x=>x.label==="0% rate")?.value).toBe(runCalculator(compoundInterestCalculator,ci).output.futureValue);
  const be={fixedCosts:10000,pricePerUnit:50,variableCostPerUnit:30};expect(breakEvenScenarios(be).find(x=>x.label==="0% price")?.value).toBe(runCalculator(breakEvenCalculator,be).output.breakEvenUnits);
 });
 it("sensitivity center points reconcile to authoritative engine outputs",()=>{
  const loan={principal:100000,annualRatePercent:6,termMonths:360,extraMonthlyPayment:0};expect(loanRateSensitivity(loan).find(x=>x.input===6)?.value).toBe(runCalculator(loanAnalysisCalculator,loan).output.totalInterest);
  const sip={monthlyContribution:500,annualReturnPercent:8,termMonths:120,contributionTiming:"end" as const};expect(sipSensitivity(sip).find(x=>x.input===8)?.value).toBe(runCalculator(sipCalculator,sip).output.futureValue);
  const ci={principal:10000,annualRatePercent:5,years:10,compoundsPerYear:12};expect(compoundInterestSensitivity(ci).find(x=>x.input===5)?.value).toBe(runCalculator(compoundInterestCalculator,ci).output.futureValue);
  const be={fixedCosts:10000,pricePerUnit:50,variableCostPerUnit:30};expect(breakEvenSensitivity(be).find(x=>x.input===50)?.value).toBe(runCalculator(breakEvenCalculator,be).output.breakEvenUnits);
 });
});