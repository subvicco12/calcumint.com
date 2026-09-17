import { describe,expect,it } from "vitest";
import { requiredMonthlyPaymentForTargetMonths, simulateCreditCardPayoff } from "./credit-card-payoff";

describe("credit card payoff",()=>{
  it("handles a zero APR balance",()=>{const r=simulateCreditCardPayoff({balance:1200,annualAprPercent:0,monthlyPayment:100,extraMonthlyPayment:0});expect(r.payoffMonths).toBe(12);expect(r.totalInterest).toBe(0);expect(r.totalPaid).toBe(1200);});
  it("models a normal payoff",()=>{const r=simulateCreditCardPayoff({balance:5000,annualAprPercent:18,monthlyPayment:200,extraMonthlyPayment:0});expect(r.payoffMonths).toBeGreaterThan(25);expect(r.totalInterest).toBeGreaterThan(0);expect(r.totalPaid).toBeGreaterThan(5000);});
  it("rejects a payment that cannot amortize the first modeled month",()=>{expect(()=>simulateCreditCardPayoff({balance:10000,annualAprPercent:24,monthlyPayment:200,extraMonthlyPayment:0})).toThrow(/does not amortize/);});
  it("reverse-solves a target payoff payment",()=>{const payment=requiredMonthlyPaymentForTargetMonths(10000,18,36);expect(payment).toBeGreaterThan(300);expect(payment).toBeLessThan(400);const r=simulateCreditCardPayoff({balance:10000,annualAprPercent:18,monthlyPayment:payment,extraMonthlyPayment:0});expect(r.payoffMonths).toBe(36);});
  it("extra payment shortens payoff",()=>{const base=simulateCreditCardPayoff({balance:8000,annualAprPercent:20,monthlyPayment:250,extraMonthlyPayment:0});const extra=simulateCreditCardPayoff({balance:8000,annualAprPercent:20,monthlyPayment:250,extraMonthlyPayment:100});expect(extra.payoffMonths).toBeLessThan(base.payoffMonths);expect(extra.totalInterest).toBeLessThan(base.totalInterest);});
  it("keeps demanding finite inputs finite",()=>{const r=simulateCreditCardPayoff({balance:1e12,annualAprPercent:100,monthlyPayment:1e11,extraMonthlyPayment:0});expect(Number.isFinite(r.totalInterest)).toBe(true);expect(Number.isFinite(r.totalPaid)).toBe(true);});
});
