import { compareScenarios } from "../scenarios";
import { runCalculator } from "../engine";
import { loanAnalysisCalculator } from "./loan-analysis";

export type LoanRateScenarioInput={principal:number;annualRatePercent:number;termMonths:number;extraMonthlyPayment?:number};

export function compareLoanRateSensitivity(input:LoanRateScenarioInput,rateStepPercent=1){
 if(!Number.isFinite(rateStepPercent)||rateStepPercent<=0)throw new Error("Rate step must be positive and finite");
 const base={principal:input.principal,annualRatePercent:input.annualRatePercent,termMonths:input.termMonths,extraMonthlyPayment:input.extraMonthlyPayment??0};
 const lower={...base,annualRatePercent:Math.max(0,base.annualRatePercent-rateStepPercent)};
 const higher={...base,annualRatePercent:base.annualRatePercent+rateStepPercent};
 return compareScenarios([
  {id:"lower-rate",label:`Rate -${rateStepPercent} pp`,input:lower},
  {id:"base-rate",label:"Base rate",input:base},
  {id:"higher-rate",label:`Rate +${rateStepPercent} pp`,input:higher}
 ],x=>runCalculator(loanAnalysisCalculator,x).output,[
  {id:"monthly-payment",value:o=>o.scheduledPayment,preference:"lower"},
  {id:"total-interest",value:o=>o.totalInterest,preference:"lower"}
 ]);
}
