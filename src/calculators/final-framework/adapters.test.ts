import { describe,expect,it } from "vitest";
import { compoundInterestResult,loanResult,sipResult } from "./adapters";
import { bmiResult,breakEvenResult,mortgageResult } from "./reference-adapters";
import { runCalculator } from "../engine";
import { sipCalculator } from "../finance/sip";
import { loanAnalysisCalculator } from "../finance/loan-analysis";
import { compoundInterestCalculator } from "../finance/compound-interest";
import { loanPaymentCalculator } from "../finance/loan-payment";
import { bmiCalculator } from "../health/bmi";
import { breakEvenCalculator } from "../business/break-even";

describe("final result adapters",()=>{
  it("reconciles loan headline and composition",()=>{
    const result=loanResult({principal:100000,annualRatePercent:6,termMonths:360},{monthlyPayment:599.55,totalPayment:215838,totalInterest:115838});
    expect(result.primaryResult.value).toBe(599.55);
    expect(result.composition!.reduce((sum,item)=>sum+item.value,0)).toBe(215838);
  });
  it("reconciles canonical EMI extra-payment output with injected certified schedule",()=>{
    const input={principal:250000,annualRatePercent:7,termMonths:360,extraMonthlyPayment:300};
    const output=runCalculator(loanAnalysisCalculator,input).output;
    const schedule=output.amortization.filter(row=>row.month===1||row.month%12===0||row.month===output.amortization.length).map(row=>({id:String(row.month),period:row.month,values:{payment:row.payment,principal:row.principal,interest:row.interest,balance:row.balance}}));
    const result=loanResult(input,output,schedule);
    expect(result.primaryResult.value).toBe(output.monthlyPayment);
    expect(result.metrics!.find(metric=>metric.id==="interest")!.value).toBe(output.totalInterest);
    expect(result.metrics!.find(metric=>metric.id==="total")!.value).toBe(output.totalPayment);
    expect(result.metrics!.find(metric=>metric.id==="payoff")!.value).toBe(output.payoffMonths);
    expect(result.metrics!.find(metric=>metric.id==="interest-saved")!.value).toBe(output.interestSavedVsScheduled);
    expect(result.metrics!.find(metric=>metric.id==="months-saved")!.value).toBe(output.monthsSavedVsScheduled);
    expect(result.schedule).toEqual(schedule);
    expect(result.schedule!.at(-1)!.values.balance).toBe(0);
    expect(result.schedule!.at(-1)!.period).toBe(output.payoffMonths);
  });
  it("reconciles SIP composition to final corpus",()=>{
    const result=sipResult({monthlyContribution:10000,annualReturnPercent:10,termMonths:120,contributionTiming:"beginning"},{futureValue:2065520.2,investedAmount:1200000,estimatedGain:865520.2});
    expect(result.composition!.reduce((sum,item)=>sum+item.value,0)).toBeCloseTo(Number(result.primaryResult.value),2);
    expect(result.series![0].points.at(-1)!.y).toBeCloseTo(Number(result.primaryResult.value),2);
  });
  it("keeps SIP annual checkpoints unique and includes the exact terminal month",()=>{
    const input={monthlyContribution:1000,annualReturnPercent:8,termMonths:125,contributionTiming:"beginning" as const};
    const output=runCalculator(sipCalculator,input).output;
    const result=sipResult(input,output);
    const months=result.series![0].points.map(point=>point.x);
    expect(months.at(-1)).toBe(125);
    expect(new Set(months).size).toBe(months.length);
    expect(months.filter(month=>month===125)).toHaveLength(1);
    expect(result.series![0].points.at(-1)!.y).toBeCloseTo(output.futureValue,8);
    expect(result.series![0].points.at(-1)!.y).toBeCloseTo(Number(result.primaryResult.value),8);
  });
  it("reconciles compound-interest presentation to the certified engine",()=>{
    const input={principal:10000,annualRatePercent:5,years:10,compoundsPerYear:12};
    const output=runCalculator(compoundInterestCalculator,input).output;
    const result=compoundInterestResult(input,output);
    expect(result.primaryResult.value).toBe(output.futureValue);
    expect(result.metrics!.find(metric=>metric.id==="interest")!.value).toBe(output.totalInterest);
    expect(result.composition!.reduce((sum,item)=>sum+item.value,0)).toBeCloseTo(output.futureValue,2);
  });
  it("reconciles mortgage reference presentation to the certified loan engine",()=>{
    const input={principal:320000,annualRatePercent:6.5,termMonths:360};
    const output=runCalculator(loanPaymentCalculator,input).output;
    const result=mortgageResult(input,output);
    expect(result.primaryResult.value).toBe(output.monthlyPayment);
    expect(result.metrics!.find(metric=>metric.id==="interest")!.value).toBe(output.totalInterest);
    expect(result.composition!.reduce((sum,item)=>sum+item.value,0)).toBeCloseTo(output.totalPayment,2);
  });
  it("reconciles BMI draft reference presentation without publishing it",()=>{
    const output=runCalculator(bmiCalculator,{weightKg:70,heightCm:175}).output;
    const result=bmiResult(output);
    expect(result.primaryResult.value).toBe(output.bmi);
    expect(result.metrics!.find(metric=>metric.id==="classification")!.value).toBe(output.classification);
    expect(result.ranges).toEqual([{id:"adult-bmi",label:"Adult BMI reference",min:18.5,max:24.9,classification:output.classification}]);
    expect(result.warnings).toContain("BMI is a screening measure and does not diagnose health or disease.");
    expect(result.sources).toEqual(bmiCalculator.sources);
    expect(bmiCalculator.riskClass).toBe("health");
    expect(bmiCalculator.reviewStatus).toBe("draft");
  });
  it("reconciles break-even draft reference presentation without publishing it",()=>{
    const output=runCalculator(breakEvenCalculator,{fixedCosts:10000,pricePerUnit:50,variableCostPerUnit:30}).output;
    const result=breakEvenResult(output);
    expect(result.primaryResult.value).toBe(output.breakEvenUnits);
    expect(result.metrics!.find(metric=>metric.id==="revenue")!.value).toBe(output.breakEvenRevenue);
    expect(result.metrics!.find(metric=>metric.id==="margin")!.value).toBe(output.contributionMarginPerUnit);
    expect(breakEvenCalculator.reviewStatus).toBe("draft");
  });
});
