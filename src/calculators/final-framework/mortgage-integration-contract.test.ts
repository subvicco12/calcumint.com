import { expect, it } from "vitest";
import { calculatorRegistry } from "../registry";
import { runCalculator } from "../engine";
import { mortgageCalculator } from "../finance/mortgage";
import { loanPaymentCalculator } from "../finance/loan-payment";
import { mortgageResult } from "./reference-adapters";
import { mortgageRateSensitivity,mortgageScenarios } from "./analysis";
import { composePublishedCalculatorSlugs } from "../publication-authority";
import { resolvePublicCalculatorRoute } from "../public-route-readiness";
it.each([{principal:100000,annualRatePercent:6,termMonths:360},{principal:320000,annualRatePercent:0,termMonths:360},{principal:0.001,annualRatePercent:0,termMonths:1},{principal:100,annualRatePercent:1000,termMonths:1200}])('preserves delegated v1 rounding, trust and exact aggregate reconciliation %#',input=>{
 const output=runCalculator(mortgageCalculator,input).output;
 expect(output).toEqual(runCalculator(loanPaymentCalculator,input).output);
 expect(output.totalPayment).toBeCloseTo(output.monthlyPayment*input.termMonths,2);
 const result=mortgageResult(input,output);expect(result.primaryResult.value).toBe(output.monthlyPayment);
 expect(result.metrics?.find(x=>x.id==='repayment')?.value).toBe(output.totalPayment);
 expect(result.sources).toEqual(mortgageCalculator.sources);expect(result.schedule).toBeUndefined();
});
it('reconciles every advanced result to the same Mortgage aggregate engine',()=>{
 const input={principal:320000,annualRatePercent:6.5,termMonths:360};
 for(const point of mortgageRateSensitivity(input))expect(point.value).toBe(runCalculator(mortgageCalculator,{...input,annualRatePercent:point.input}).output.monthlyPayment);
 for(const scenario of mortgageScenarios(input))expect(scenario.value).toBe(runCalculator(mortgageCalculator,{...input,annualRatePercent:scenario.input!.value}).output.monthlyPayment);
});
it('requires independently published matching identity/version before Mortgage route readiness',()=>{
 for(const manifest of [[],[{calculator_key:mortgageCalculator.id,slug:mortgageCalculator.slug,version:2}],[{calculator_key:'finance.loan-payment',slug:mortgageCalculator.slug,version:1}]]){
  const slugs=composePublishedCalculatorSlugs(calculatorRegistry.list(),manifest);expect(slugs.has(mortgageCalculator.slug)).toBe(false);
  expect(resolvePublicCalculatorRoute('loans-mortgages',mortgageCalculator.slug,{state:'available',slugs})).toEqual({state:'blocked',reason:'unpublished'});
 }
 const slugs=composePublishedCalculatorSlugs(calculatorRegistry.list(),[{calculator_key:mortgageCalculator.id,slug:mortgageCalculator.slug,version:1}]);
 expect(resolvePublicCalculatorRoute('loans-mortgages',mortgageCalculator.slug,{state:'available',slugs}).state).toBe('ready');
});
