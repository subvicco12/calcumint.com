import { describe,expect,it } from "vitest";
import { simulateDebtPayoff } from "./debt-payoff";
const debts=[{name:"Card A",balance:5000,annualRatePercent:24,minimumPayment:150},{name:"Card B",balance:2000,annualRatePercent:12,minimumPayment:75}];
describe("debt payoff",()=>{
 it("models avalanche payoff",()=>{const r=simulateDebtPayoff({debts,extraMonthlyPayment:300,strategy:"avalanche"});expect(r.monthsToPayoff).toBeGreaterThan(0);expect(r.totalInterest).toBeGreaterThan(0);expect(r.payoffOrder).toHaveLength(2);});
 it("models snowball payoff",()=>{const r=simulateDebtPayoff({debts,extraMonthlyPayment:300,strategy:"snowball"});expect(r.payoffOrder[0]).toBe("Card B");});
 it("avalanche does not cost more interest for this representative case",()=>{const a=simulateDebtPayoff({debts,extraMonthlyPayment:300,strategy:"avalanche"});const s=simulateDebtPayoff({debts,extraMonthlyPayment:300,strategy:"snowball"});expect(a.totalInterest).toBeLessThanOrEqual(s.totalInterest);});
 it("handles zero-rate debt",()=>{const r=simulateDebtPayoff({debts:[{name:"Zero",balance:1200,annualRatePercent:0,minimumPayment:100}],extraMonthlyPayment:0,strategy:"avalanche"});expect(r.monthsToPayoff).toBe(12);expect(r.totalInterest).toBe(0);expect(r.totalPaid).toBe(1200);});
 it("rejects a non-amortizing no-extra scenario",()=>{expect(()=>simulateDebtPayoff({debts:[{name:"Stalled",balance:1000,annualRatePercent:12,minimumPayment:10}],extraMonthlyPayment:0,strategy:"avalanche"})).toThrow(/do not reduce/);});
});
