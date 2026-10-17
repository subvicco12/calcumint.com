import {expect,it} from 'vitest';
import {runCalculator} from '../engine';
import {loanPaymentCalculator} from '../finance/loan-payment';
import {loanAnalysisCalculator} from '../finance/loan-analysis';
import {sipCalculator} from '../finance/sip';
import {compoundInterestCalculator} from '../finance/compound-interest';
import {compoundRegisteredRateAnalysis,loanRegisteredRateAnalysis,sipRegisteredRateAnalysis} from './registered-rate-analysis';
import {compoundInterestScenarios,loanScenarios,sipScenarios} from './analysis';
it('preserves canonical LoanAnalysis extra-payment math and ordinary LoanPayment authority separately',()=>{
 const input={principal:320000,annualRatePercent:0,termMonths:360,extraMonthlyPayment:100};
 for(const canonical of [false,true]){const report=loanRegisteredRateAnalysis(input,canonical);for(const scenario of report.scenarios){const rate=scenario.input!.value;const expected=canonical?runCalculator(loanAnalysisCalculator,{...input,annualRatePercent:rate}).output.totalInterest:runCalculator(loanPaymentCalculator,{...input,annualRatePercent:rate}).output.totalInterest;expect(scenario.value).toBe(expected);}expect(report.unavailable).toEqual([]);}
});
it.each([0,8,1000])('retains exact SIP requests and baseline at %s',annualReturnPercent=>{
 const input={monthlyContribution:500,annualReturnPercent,termMonths:1,contributionTiming:'end' as const};const before=structuredClone(input);const report=sipRegisteredRateAnalysis(input);expect(report.scenarios.find(s=>s.baseline)?.value).toBe(runCalculator(sipCalculator,input).output.futureValue);for(const point of report.points)expect(point.value).toBe(runCalculator(sipCalculator,{...input,annualReturnPercent:point.input}).output.futureValue);expect(input).toEqual(before);if(annualReturnPercent===1000)expect(report.unavailable.map(r=>[r.surface,r.rate])).toEqual([['scenarios',1001],['sensitivity',1001],['sensitivity',1002]]);
});
it('preserves the actual valid Compound baseline below the legacy offset clamp',()=>{
 const input={principal:10000,annualRatePercent:-99.5,years:1,compoundsPerYear:12};const report=compoundRegisteredRateAnalysis(input);const baseline=report.scenarios.find(s=>s.baseline)!;expect(baseline.input?.value).toBe(-99.5);expect(baseline.value).toBe(runCalculator(compoundInterestCalculator,input).output.futureValue);expect(baseline.delta).toBe(0);expect(report.points[2].input).toBe(-99.5);
});
it('retains valid baseline when generated values overflow despite schema-valid rates',()=>{
 const report=sipRegisteredRateAnalysis({monthlyContribution:1e304,annualReturnPercent:0,termMonths:1,contributionTiming:'end'});expect(report.scenarios.find(s=>s.baseline)?.value).toBe(runCalculator(sipCalculator,{monthlyContribution:1e304,annualReturnPercent:0,termMonths:1,contributionTiming:'end'}).output.futureValue);expect(report.points.every(p=>Number.isFinite(p.value))).toBe(true);
});
it('matches inherited helper values for normal registered requests without changing formulas',()=>{
 const sip={monthlyContribution:500,annualReturnPercent:8,termMonths:120,contributionTiming:'beginning' as const};const compound={principal:10000,annualRatePercent:5,years:10,compoundsPerYear:12};const loan={principal:100000,annualRatePercent:6,termMonths:360,extraMonthlyPayment:0};
 for(const [report,old] of [[sipRegisteredRateAnalysis(sip),sipScenarios(sip)],[compoundRegisteredRateAnalysis(compound),compoundInterestScenarios(compound)],[loanRegisteredRateAnalysis(loan,true),loanScenarios(loan)]] as const)expect(report.scenarios.map(s=>[s.value,s.delta])).toEqual(old.map(s=>[s.value,s.delta]));
});
