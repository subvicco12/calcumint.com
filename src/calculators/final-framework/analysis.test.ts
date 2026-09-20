import {describe,expect,it} from "vitest";
import {loanRateSensitivity,loanScenarios,loanSchedule,sipGoal,sipSensitivity} from "./analysis";
describe("final analysis engine",()=>{
 it("amortization schedule reaches zero",()=>{const rows=loanSchedule({principal:100000,annualRatePercent:6,termMonths:360});expect(rows.at(-1)?.values.balance).toBeCloseTo(0,2);expect(rows.at(-1)?.period).toBe(360)});
 it("loan sensitivity is monotonic with rate",()=>{const p=loanRateSensitivity({principal:100000,annualRatePercent:6,termMonths:360});expect(p[0].value).toBeLessThan(p.at(-1)!.value)});
 it("loan scenarios preserve the base case",()=>{const s=loanScenarios({principal:100000,annualRatePercent:6,termMonths:360});expect(s[1].delta).toBe(0)});
 it("SIP goal solver reconciles with target",()=>{expect(sipGoal(2065520.2,{annualReturnPercent:10,termMonths:120,contributionTiming:"beginning"})).toBeCloseTo(10000,1)});
 it("SIP sensitivity increases with modeled return",()=>{const p=sipSensitivity({monthlyContribution:10000,annualReturnPercent:10,termMonths:120,contributionTiming:"beginning"});expect(p[0].value).toBeLessThan(p.at(-1)!.value)});
});