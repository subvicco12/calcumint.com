import { loanSchedule } from "./analysis";
import { runCalculator } from "../engine";
import { sipCalculator } from "../finance/sip";
import type { StructuredCalculationResult } from "./types";

export function loanResult(input:{principal:number;annualRatePercent:number;termMonths:number},output:{monthlyPayment:number;totalPayment:number;totalInterest:number}):StructuredCalculationResult{
  return {
    primaryResult:{id:"monthly-payment",label:"Monthly payment",value:output.monthlyPayment},
    metrics:[
      {id:"principal",label:"Principal",value:input.principal},
      {id:"interest",label:"Total interest",value:output.totalInterest},
      {id:"total",label:"Total repayment",value:output.totalPayment},
      {id:"term",label:"Term",value:input.termMonths,unit:"months"}
    ],
    composition:[
      {id:"principal",label:"Principal",value:input.principal},
      {id:"interest",label:"Interest",value:output.totalInterest}
    ],
    schedule:loanSchedule({principal:input.principal,annualRatePercent:input.annualRatePercent,termMonths:input.termMonths}),
    reverseTargets:["principal","monthlyPayment","termMonths"],
    scenarioVariables:["annualRatePercent","termMonths","extraMonthlyPayment"],
    sensitivityVariables:["annualRatePercent","termMonths"],
    methodology:"The presentation is derived from the same certified deterministic loan result used for the headline payment."
  };
}

export function sipResult(input:{monthlyContribution:number;annualReturnPercent:number;termMonths:number;contributionTiming:"beginning"|"end"},output:{futureValue:number;investedAmount:number;estimatedGain:number}):StructuredCalculationResult{
  return {
    primaryResult:{id:"future-value",label:"Projected future value",value:output.futureValue},
    metrics:[
      {id:"invested",label:"Total contributions",value:output.investedAmount},
      {id:"gain",label:"Estimated growth",value:output.estimatedGain},
      {id:"term",label:"Term",value:input.termMonths,unit:"months"}
    ],
    composition:[
      {id:"invested",label:"Contributions",value:output.investedAmount},
      {id:"gain",label:"Estimated growth",value:Math.max(output.estimatedGain,0)}
    ],
    series:[{id:"growth",label:"Projected growth",unit:"",points:[0,...Array.from({length:Math.floor(input.termMonths/12)},(_,i)=>(i+1)*12),input.termMonths].filter((month,i,months)=>months.indexOf(month)===i).map(month=>month===0?{x:0,y:0}:{x:month,y:runCalculator(sipCalculator,{...input,termMonths:month}).output.futureValue})}],
    reverseTargets:["monthlyContribution"],
    scenarioVariables:["monthlyContribution","annualReturnPercent","termMonths"],
    sensitivityVariables:["annualReturnPercent","termMonths"],
    warnings:["Modeled returns are assumptions, not guaranteed investment outcomes."],
    methodology:"The result uses the certified SIP engine. Presentation data never recalculates the headline value."
  };
}

export function compoundInterestResult(input:{principal:number;years:number},output:{futureValue:number;totalInterest:number}):StructuredCalculationResult{
  return {
    primaryResult:{id:"future-value",label:"Future value",value:output.futureValue},
    metrics:[
      {id:"principal",label:"Starting principal",value:input.principal},
      {id:"interest",label:"Compound interest",value:output.totalInterest},
      {id:"years",label:"Time",value:input.years,unit:"years"}
    ],
    composition:[
      {id:"principal",label:"Principal",value:input.principal},
      {id:"interest",label:"Interest",value:Math.max(output.totalInterest,0)}
    ],
    reverseTargets:["principal","annualRatePercent","years"],
    scenarioVariables:["annualRatePercent","years","compoundsPerYear"],
    sensitivityVariables:["annualRatePercent","years"],
    methodology:"The result is adapted directly from the certified compound-interest engine."
  };
}
