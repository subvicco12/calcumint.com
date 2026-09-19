import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { calculateSavingsGoal,requiredMonthlySavings,savingsFutureValue,savingsGoalCalculator } from "./savings-goal";
describe("savings goal",()=>{
 it("handles a zero-return goal",()=>{expect(requiredMonthlySavings(1000,2200,0,12)).toBe(100);expect(savingsFutureValue(1000,100,0,12)).toBe(2200);});
 it("reverse solves a positive-return target",()=>{const monthly=requiredMonthlySavings(5000,20000,6,36);expect(savingsFutureValue(5000,monthly,6,36)).toBeCloseTo(20000,6);});
 it("requires no contribution when current savings already grow beyond target",()=>{expect(requiredMonthlySavings(10000,9000,5,12)).toBe(0);});
 it("reports a gap for an insufficient entered contribution",()=>{const r=calculateSavingsGoal({currentSavings:0,targetAmount:12000,annualReturnPercent:0,months:12,monthlyContribution:500});expect(r.futureValue).toBe(6000);expect(r.gapToTarget).toBe(6000);expect(r.targetReached).toBe(false);});
 it("runs through the calculator engine",()=>{const r=runCalculator(savingsGoalCalculator,{currentSavings:0,targetAmount:12000,annualReturnPercent:0,months:12});expect(r.output.requiredMonthlyContribution).toBe(1000);expect(r.calculatorId).toBe("finance.savings-goal");});
 it("rejects unsafe direct solver inputs",()=>{expect(()=>savingsFutureValue(1000,-1,5,12)).toThrow();expect(()=>savingsFutureValue(1000,100,-100,12)).toThrow();expect(()=>savingsFutureValue(1000,100,5,12.5)).toThrow();expect(requiredMonthlySavings(Number.POSITIVE_INFINITY,10000,5,12)).toBe(0)});
 it("rejects unsafe direct calculator overrides",()=>{expect(()=>calculateSavingsGoal({currentSavings:1000,targetAmount:10000,annualReturnPercent:5,months:12,monthlyContribution:-1})).toThrow();expect(()=>calculateSavingsGoal({currentSavings:1000,targetAmount:Number.NaN,annualReturnPercent:5,months:12})).toThrow();});
});
