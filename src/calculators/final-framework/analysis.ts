import { loanPaymentCalculator } from "../finance/loan-payment";
import { loanAnalysisCalculator } from "../finance/loan-analysis";
import { sipCalculator, requiredMonthlySip } from "../finance/sip";
import { compoundInterestCalculator } from "../finance/compound-interest";
import { breakEvenCalculator } from "../business/break-even";
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
export function sipScenarios(input:{monthlyContribution:number;annualReturnPercent:number;termMonths:number;contributionTiming:"beginning"|"end"}):Scenario[]{
 const base=runCalculator(sipCalculator,input).output.futureValue;
 return [-1,0,1].map((delta,index)=>{const rate=Math.max(-99,input.annualReturnPercent+delta);const value=runCalculator(sipCalculator,{...input,annualReturnPercent:rate}).output.futureValue;return{id:String(index),label:`${delta>0?"+":""}${delta}% return`,value,delta:value-base}});
}

export function compoundInterestSensitivity(input:{principal:number;annualRatePercent:number;years:number;compoundsPerYear:number},spread=2):SensitivityPoint[]{
 return [-spread,-spread/2,0,spread/2,spread].map(d=>{const rate=Math.max(-99,input.annualRatePercent+d);return{input:rate,value:runCalculator(compoundInterestCalculator,{...input,annualRatePercent:rate}).output.futureValue}})
}
export function compoundInterestScenarios(input:{principal:number;annualRatePercent:number;years:number;compoundsPerYear:number}):Scenario[]{
 const base=runCalculator(compoundInterestCalculator,input).output.futureValue;
 return [-1,0,1].map((delta,index)=>{const rate=Math.max(-99,input.annualRatePercent+delta);const value=runCalculator(compoundInterestCalculator,{...input,annualRatePercent:rate}).output.futureValue;return{id:String(index),label:`${delta>0?"+":""}${delta}% rate`,value,delta:value-base}});
}
export function compoundPrincipalForTarget(targetFutureValue:number,input:{annualRatePercent:number;years:number;compoundsPerYear:number}){
 if(!Number.isFinite(targetFutureValue)||targetFutureValue<0)throw new Error("Target future value must be nonnegative");
 const factor=runCalculator(compoundInterestCalculator,{principal:1,...input}).output.futureValue;
 if(!Number.isFinite(factor)||factor<=0)throw new Error("Target cannot be solved for these inputs");
 return targetFutureValue/factor;
}

export function breakEvenScenarios(input:{fixedCosts:number;pricePerUnit:number;variableCostPerUnit:number}):Scenario[]{
 const base=runCalculator(breakEvenCalculator,input).output.breakEvenUnits;
 return [-10,0,10].map((percent,i)=>{const price=input.pricePerUnit*(1+percent/100);if(price<=input.variableCostPerUnit)return{id:String(i),label:`${percent>0?"+":""}${percent}% price`,value:Number.NaN,delta:Number.NaN};const value=runCalculator(breakEvenCalculator,{...input,pricePerUnit:price}).output.breakEvenUnits;return{id:String(i),label:`${percent>0?"+":""}${percent}% price`,value,delta:value-base}}).filter(item=>Number.isFinite(item.value));
}
export function breakEvenSensitivity(input:{fixedCosts:number;pricePerUnit:number;variableCostPerUnit:number}):SensitivityPoint[]{
 return [-10,-5,0,5,10].map(percent=>{const price=input.pricePerUnit*(1+percent/100);if(price<=input.variableCostPerUnit)return null;return{input:price,value:runCalculator(breakEvenCalculator,{...input,pricePerUnit:price}).output.breakEvenUnits}}).filter((point):point is SensitivityPoint=>point!==null);
}

export function breakEvenPriceForTargetUnits(targetUnits:number,input:{fixedCosts:number;variableCostPerUnit:number}){
 if(!Number.isFinite(targetUnits)||targetUnits<=0)throw new Error("Target units must be greater than zero");
 return input.variableCostPerUnit+input.fixedCosts/targetUnits;
}

export function mortgageRateSensitivity(input:{principal:number;annualRatePercent:number;termMonths:number},spread=2):SensitivityPoint[]{
 return [-spread,-spread/2,0,spread/2,spread].map(delta=>{const rate=Math.max(0,input.annualRatePercent+delta);return{input:rate,value:runCalculator(loanPaymentCalculator,{...input,annualRatePercent:rate}).output.monthlyPayment}});
}
export function mortgageScenarios(input:{principal:number;annualRatePercent:number;termMonths:number}):Scenario[]{
 const base=runCalculator(loanPaymentCalculator,input).output.monthlyPayment;
 return [-1,0,1].map((delta,index)=>{const rate=Math.max(0,input.annualRatePercent+delta);const value=runCalculator(loanPaymentCalculator,{...input,annualRatePercent:rate}).output.monthlyPayment;return{id:String(index),label:`${delta>0?"+":""}${delta}% rate`,value,delta:value-base}});
}
