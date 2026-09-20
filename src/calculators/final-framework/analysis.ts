import { loanPaymentCalculator } from "../finance/loan-payment";
import { sipCalculator, requiredMonthlySip } from "../finance/sip";
import { runCalculator } from "../engine";

export type Scenario={id:string;label:string;value:number;delta:number};
export type SensitivityPoint={input:number;value:number};

export function loanSchedule(input:{principal:number;annualRatePercent:number;termMonths:number}){
 const payment=runCalculator(loanPaymentCalculator,input).output.monthlyPayment;
 const r=input.annualRatePercent/100/12; const exactPayment=r===0?input.principal/input.termMonths:input.principal*r/(1-(1+r)**-input.termMonths); let balance=input.principal; const rows=[];
 for(let month=1;month<=input.termMonths;month++){const interest=balance*r;const scheduledPayment=month===input.termMonths?balance+interest:exactPayment;const principal=Math.min(balance,scheduledPayment-interest);balance=Math.max(0,balance-principal);if(month===1||month%12===0||month===input.termMonths)rows.push({id:String(month),period:month,values:{payment:Number((month===input.termMonths?balance+interest:payment).toFixed(2)),principal:Number(principal.toFixed(2)),interest:Number(interest.toFixed(2)),balance:Number(balance.toFixed(2))}})}
 return rows;
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
