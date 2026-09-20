import { loanPaymentCalculator } from "../finance/loan-payment";
import { loanAnalysisCalculator } from "../finance/loan-analysis";
import { sipCalculator, requiredMonthlySip } from "../finance/sip";
import { runCalculator } from "../engine";

export type Scenario={id:string;label:string;value:number;delta:number};
export type SensitivityPoint={input:number;value:number};

export function loanSchedule(input:{principal:number;annualRatePercent:number;termMonths:number}){
 const amortization=runCalculator(loanAnalysisCalculator,{...input,extraMonthlyPayment:0}).output.amortization;
 return amortization.filter(row=>row.month===1||row.month%12===0||row.month===amortization.length).map(row=>({id:String(row.month),period:row.month,values:{payment:row.payment,principal:row.principal,interest:row.interest,balance:row.balance}}));
}
export function loanRateSensitivity(input:{principal:number;annualRatePercent:number;termMonths:number},spread=2):SensitivityPoint[]{
 return [-spread,-spread/2,0,spread/2,spread].map(d=>{const rate=Math.max(0,input.annualRatePercent+d);return {input:rate,value:runCalculator(loanPaymentCalculator,{...input,annualRatePercent:rate}).output.monthlyPayment}});
}
export function loanScenarios(input:{principal:number;annualRatePercent:number;termMonths:number}):Scenario[]{
 const base=runCalculator(loanPaymentCalculator,input).output.monthlyPayment;
 return [-1,0,1].map((d,i)=>{const rate=Math.max(0,input.annualRatePercent+d);const value=runCalculator(loanPaymentCalculator,{...input,annualRatePercent:rate}).output.monthlyPayment;return{id:String(i),label:rate.toFixed(2)+"% rate",value,delta:value-base}});
}
export function sipGoal(target:number,input:{annualReturnPercent:number;termMonths:number;contributionTiming:"beginning"|"end"}){return requiredMonthlySip(target,input.annualReturnPercent,input.termMonths,input.contributionTiming)}
export function sipSensitivity(input:{monthlyContribution:number;annualReturnPercent:number;termMonths:number;contributionTiming:"beginning"|"end"}):SensitivityPoint[]{
 return [-2,-1,0,1,2].map(d=>{const rate=Math.max(-99,input.annualReturnPercent+d);return{input:rate,value:runCalculator(sipCalculator,{...input,annualReturnPercent:rate}).output.futureValue}})
}
