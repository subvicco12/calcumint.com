import { describe, expect, it } from "vitest";
import { runCalculator } from "../engine";
import { debtPayoffCalculator, simulateDebtPayoff } from "./debt-payoff";

const debts=[{name:"Card A",balance:5000,annualRatePercent:24,minimumPayment:150},{name:"Card B",balance:2000,annualRatePercent:12,minimumPayment:75}];
describe("debt payoff",()=>{
  it("models avalanche payoff",()=>{const r=simulateDebtPayoff({debts,extraMonthlyPayment:300,strategy:"avalanche"});expect(r.monthsToPayoff).toBeGreaterThan(0);expect(r.totalInterest).toBeGreaterThan(0);expect(r.payoffOrder).toHaveLength(2);});
  it("models snowball payoff",()=>{const r=simulateDebtPayoff({debts,extraMonthlyPayment:300,strategy:"snowball"});expect(r.payoffOrder[0]).toBe("Card B");});
  it("avalanche does not cost more interest for this representative case",()=>{const a=simulateDebtPayoff({debts,extraMonthlyPayment:300,strategy:"avalanche"});const s=simulateDebtPayoff({debts,extraMonthlyPayment:300,strategy:"snowball"});expect(a.totalInterest).toBeLessThanOrEqual(s.totalInterest);});
  it("handles zero-rate debt",()=>{const r=simulateDebtPayoff({debts:[{name:"Zero",balance:1200,annualRatePercent:0,minimumPayment:100}],extraMonthlyPayment:0,strategy:"avalanche"});expect(r.monthsToPayoff).toBe(12);expect(r.totalInterest).toBe(0);expect(r.totalPaid).toBe(1200);});
  it("rolls a paid debt minimum into remaining debts",()=>{const r=simulateDebtPayoff({debts:[{name:"Small",balance:100,annualRatePercent:0,minimumPayment:100},{name:"Large",balance:1000,annualRatePercent:0,minimumPayment:100}],extraMonthlyPayment:0,strategy:"snowball"});expect(r.monthsToPayoff).toBe(6);expect(r.payoffOrder).toEqual(["Small","Large"]);expect(r.totalPaid).toBe(1100);});
  it("cascades surplus budget across multiple debts in the same month",()=>{const r=simulateDebtPayoff({debts:[{name:"A",balance:25,annualRatePercent:0,minimumPayment:0},{name:"B",balance:25,annualRatePercent:0,minimumPayment:0},{name:"C",balance:25,annualRatePercent:0,minimumPayment:0}],extraMonthlyPayment:100,strategy:"snowball"});expect(r.monthsToPayoff).toBe(1);expect(r.payoffOrder).toEqual(["A","B","C"]);expect(r.totalPaid).toBe(75);});
  it("keeps payoff accounting consistent",()=>{const r=simulateDebtPayoff({debts,extraMonthlyPayment:300,strategy:"avalanche"});expect(r.totalPaid).toBeCloseTo(r.startingBalance+r.totalInterest,2);});
  it("rejects a non-amortizing budget",()=>{expect(()=>simulateDebtPayoff({debts:[{name:"Stalled",balance:1000,annualRatePercent:12,minimumPayment:10}],extraMonthlyPayment:0,strategy:"avalanche"})).toThrow(/does not reduce/);});
  it("returns structured output through the calculator engine",()=>{const result=runCalculator(debtPayoffCalculator,{debts:[{name:"Zero",balance:600,annualRatePercent:0,minimumPayment:100}],extraMonthlyPayment:0,strategy:"avalanche"});expect(result.output.monthsToPayoff).toBe(6);expect(result.calculatorId).toBe("finance.debt-payoff");});
});
