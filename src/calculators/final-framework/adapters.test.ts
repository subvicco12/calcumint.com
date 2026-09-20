import { describe,expect,it } from "vitest";
import { compoundInterestResult,loanResult,sipResult } from "./adapters";
import { bmiResult,breakEvenResult,mortgageResult } from "./reference-adapters";

describe("final result adapters",()=>{
  it("reconciles loan headline and composition",()=>{
    const result=loanResult({principal:100000,termMonths:360},{monthlyPayment:599.55,totalPayment:215838,totalInterest:115838});
    expect(result.primaryResult.value).toBe(599.55);
    expect(result.composition!.reduce((sum,item)=>sum+item.value,0)).toBe(215838);
  });
  it("reconciles SIP composition to final corpus",()=>{
    const result=sipResult({monthlyContribution:10000,termMonths:120},{futureValue:2065520.2,investedAmount:1200000,estimatedGain:865520.2});
    expect(result.composition!.reduce((sum,item)=>sum+item.value,0)).toBeCloseTo(Number(result.primaryResult.value),2);
  });
  it("reconciles compound-interest composition to future value",()=>{
    const result=compoundInterestResult({principal:10000,years:10},{futureValue:16470.09,totalInterest:6470.09});
    expect(result.composition!.reduce((sum,item)=>sum+item.value,0)).toBeCloseTo(Number(result.primaryResult.value),2);
  });
  it("covers the remaining reference adapters",()=>{
    expect(bmiResult({bmi:22.9,classification:"Within reference range"}).primaryResult.value).toBe(22.9);
    expect(breakEvenResult({breakEvenUnits:500,breakEvenRevenue:25000,contributionMarginPerUnit:20,contributionMarginPercent:40}).primaryResult.value).toBe(500);
    const mortgage=mortgageResult({principal:320000,termMonths:360},{monthlyPayment:2022.62,totalPayment:728143.2,totalInterest:408143.2});
    expect(mortgage.composition!.reduce((sum,item)=>sum+item.value,0)).toBeCloseTo(728143.2,2);
  });
});
