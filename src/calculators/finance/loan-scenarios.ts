import { compareScenarios } from "../scenarios";
import { runCalculator } from "../engine";
import { loanAnalysisCalculator } from "./loan-analysis";

export type LoanRateScenarioInput={principal:number;annualRatePercent:number;termMonths:number;extraMonthlyPayment?:number};

export function compareLoanRateSensitivity(input:LoanRateScenarioInput,rateStepPercent=1){
 if(!Number.isFinite(rateStepPercent)||rateStepPercent<=0)throw new Error("Rate step must be positive and finite");
 if(!Number.isFinite(input.principal)||input.principal<=0||!Number.isFinite(input.annualRatePercent)||input.annualRatePercent<0||!Number.isInteger(input.termMonths)||input.termMonths<1||input.extraMonthlyPayment!==undefined&&(!Number.isFinite(input.extraMonthlyPayment)||input.extraMonthlyPayment<0))throw new Error("Loan scenario inputs must be finite and within supported ranges");
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
