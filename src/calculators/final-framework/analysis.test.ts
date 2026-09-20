import {describe,expect,it} from "vitest";
import {compoundInterestSensitivity,loanRateSensitivity,loanScenarios,loanSchedule,sipGoal,sipSensitivity} from "./analysis";
import {runCalculator} from "../engine";
import {loanAnalysisCalculator} from "../finance/loan-analysis";
import {compoundInterestCalculator} from "../finance/compound-interest";
describe("final analysis engine",()=>{
 it("amortization schedule reaches zero",()=>{const rows=loanSchedule({principal:100000,annualRatePercent:6,termMonths:360});expect(rows.at(-1)?.values.balance).toBeCloseTo(0,2);expect(rows.at(-1)?.period).toBe(360)});
 it("loan presentation schedule reconciles with certified amortization checkpoints",()=>{const input={principal:100000,annualRatePercent:6,termMonths:360};const rows=loanSchedule(input);const certified=runCalculator(loanAnalysisCalculator,{...input,extraMonthlyPayment:0}).output.amortization;for(const row of rows){const source=certified.find(item=>item.month===row.period);expect(source).toBeDefined();expect(row.values.payment).toBe(source!.payment);expect(row.values.principal).toBe(source!.principal);expect(row.values.interest).toBe(source!.interest);expect(row.values.balance).toBe(source!.balance)}});
 it("loan sensitivity is monotonic with rate",()=>{const p=loanRateSensitivity({principal:100000,annualRatePercent:6,termMonths:360});expect(p[0].value).toBeLessThan(p.at(-1)!.value)});
 it("loan scenarios preserve the base case",()=>{const s=loanScenarios({principal:100000,annualRatePercent:6,termMonths:360});expect(s[1].delta).toBe(0)});
 it("SIP goal solver reconciles with target",()=>{expect(sipGoal(2065520.2,{annualReturnPercent:10,termMonths:120,contributionTiming:"beginning"})).toBeCloseTo(10000,1)});
 it("compound sensitivity reconciles every point with the certified engine",()=>{const input={principal:10000,annualRatePercent:5,years:10,compoundsPerYear:12};const points=compoundInterestSensitivity(input);for(const point of points){const expected=runCalculator(compoundInterestCalculator,{...input,annualRatePercent:point.input}).output.futureValue;expect(point.value).toBe(expected)}expect(points[0].value).toBeLessThan(points.at(-1)!.value)});
 it("SIP sensitivity increases with modeled return",()=>{const p=sipSensitivity({monthlyContribution:10000,annualReturnPercent:10,termMonths:120,contributionTiming:"beginning"});expect(p[0].value).toBeLessThan(p.at(-1)!.value)});
});