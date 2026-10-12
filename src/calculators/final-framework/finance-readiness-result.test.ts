import { describe, expect, it } from "vitest";
import { financeReadinessResult, requiredFinanceNumber } from "./finance-readiness-result";
import { getCertificationCandidateContent } from "../public-content";
import { calculatorRegistry } from "../registry";
import { runCalculator } from "../engine";
const slugs=["fixed-term-deposit-calculator","recurring-deposit-calculator","step-up-sip-calculator","swp-calculator","investment-growth-calculator","simple-interest-calculator"];
describe("certified finance readiness adapters",()=>{
 it.each(slugs)("%s preserves all modeled golden outputs and registered trust without currency inference",slug=>{
  const definition=calculatorRegistry.getBySlug(slug)!;
  for(const example of definition.examples){
   const output=runCalculator(definition,example.input).output as Record<string,unknown>;
   expect(output).toEqual(example.expected);
   const result=financeReadinessResult(definition,output);
   for(const metric of [result.primaryResult,...result.metrics!])if(typeof metric.value==="number")expect(metric.value).toBe(output[metric.id]);
   expect(result.sources).toBe(definition.sources);
   for(const formula of definition.formulas){expect(result.methodology).toContain(formula.expression);expect(result.methodology).toContain(formula.description);}
   expect(result.assumptions).toEqual(getCertificationCandidateContent(slug)!.assumptions);
   expect([result.primaryResult,...result.metrics!].every(metric=>!metric.unit||metric.unit==="%")).toBe(true);
  }
 });
 it("fails closed for missing/nonfinite/foreign outputs and inconsistent depletion metadata",()=>{
  const def=calculatorRegistry.getBySlug("simple-interest-calculator")!;
  for(const output of [{interest:NaN,totalAmount:1},{interest:Infinity,totalAmount:1},{interest:0}])expect(()=>financeReadinessResult(def,output)).toThrow();
  expect(()=>financeReadinessResult({...def,id:"wrong.engine"},{interest:0,totalAmount:0})).toThrow();
  const swp=calculatorRegistry.getBySlug("swp-calculator")!;
  for(const extra of [{depleted:true,depletionMonth:0},{depleted:false,depletionMonth:1},{depleted:"false",depletionMonth:null}])expect(()=>financeReadinessResult(swp,{endingCorpus:0,totalWithdrawn:1,...extra})).toThrow();
 });
 it("keeps explicit zero and negative numbers while rejecting empty/whitespace/nonfinite input",()=>{
  for(const value of [""," ","Infinity","NaN"])expect(Number.isNaN(requiredFinanceNumber(value))).toBe(true);
  expect(requiredFinanceNumber("0")).toBe(0);expect(requiredFinanceNumber("-0.0001")).toBe(-0.0001);
 });
});
