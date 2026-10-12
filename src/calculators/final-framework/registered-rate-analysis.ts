import {runCalculator} from '../engine';
import {loanPaymentCalculator} from '../finance/loan-payment';
import {loanAnalysisCalculator} from '../finance/loan-analysis';
import {sipCalculator} from '../finance/sip';
import {compoundInterestCalculator} from '../finance/compound-interest';
import type {Scenario,SensitivityPoint} from './analysis';
export type UnavailableRateRequest={surface:'scenarios'|'sensitivity';rate:number;label:string;unit:'%';reason:string};
export type RegisteredRateAnalysis={scenarios:Scenario[];points:SensitivityPoint[];unavailable:UnavailableRateRequest[]};
const reason='Requested rate is outside the registered engine’s supported inputs or numeric range.';
/** Independent registered-engine requests; one rejected request never discards the valid baseline. */
function rates(baselineRate:number,floor:number,label:string,evaluate:(rate:number)=>number):RegisteredRateAnalysis{
 const baseline=evaluate(baselineRate);if(!Number.isFinite(baseline))throw new Error('Analysis baseline must be finite.');
 const result:RegisteredRateAnalysis={scenarios:[],points:[],unavailable:[]};
 const request=(surface:UnavailableRateRequest['surface'],offset:number,index:number)=>{
  const rate=offset===0?baselineRate:Math.max(floor,baselineRate+offset);
  try{
   const value=evaluate(rate);const delta=value-baseline;if(!Number.isFinite(value)||(surface==='scenarios'&&!Number.isFinite(delta)))throw new Error('Analysis result must be finite.');
   if(surface==='scenarios')result.scenarios.push({id:String(index),label:`${rate}% rate`,value,delta,baseline:offset===0,input:{label,value:rate,unit:'%'}});
   else result.points.push({input:rate,value});
  }catch{result.unavailable.push({surface,rate,label,unit:'%',reason});}
 };
 [-1,0,1].forEach((offset,index)=>request('scenarios',offset,index));
 [-2,-1,0,1,2].forEach((offset,index)=>request('sensitivity',offset,index));
 return result;
}
export function loanRegisteredRateAnalysis(input:{principal:number;annualRatePercent:number;termMonths:number;extraMonthlyPayment?:number},canonical:boolean){
 return rates(input.annualRatePercent,0,'Annual rate',rate=>canonical?runCalculator(loanAnalysisCalculator,{...input,extraMonthlyPayment:input.extraMonthlyPayment??0,annualRatePercent:rate}).output.totalInterest:runCalculator(loanPaymentCalculator,{principal:input.principal,termMonths:input.termMonths,annualRatePercent:rate}).output.totalInterest);
}
export function sipRegisteredRateAnalysis(input:{monthlyContribution:number;annualReturnPercent:number;termMonths:number;contributionTiming:'beginning'|'end'}){
 return rates(input.annualReturnPercent,-99,'Annual return',rate=>runCalculator(sipCalculator,{...input,annualReturnPercent:rate}).output.futureValue);
}
export function compoundRegisteredRateAnalysis(input:{principal:number;annualRatePercent:number;years:number;compoundsPerYear:number}){
 return rates(input.annualRatePercent,-99,'Annual rate',rate=>runCalculator(compoundInterestCalculator,{...input,annualRatePercent:rate}).output.futureValue);
}
/** Additive export/history context; aggregate engine fields remain unchanged. */
export function registeredRateExport<T extends Record<string,unknown>>(output:T,analysis:RegisteredRateAnalysis|null,calculator:{id:string;slug:string;version:number},resultMetric:{key:string;label:string}){
 return analysis?{...output,rateAnalysis:{version:1,kind:'registered-rate-comparison',calculator:{id:calculator.id,slug:calculator.slug,version:calculator.version},resultMetric,...analysis}}:output;
}
