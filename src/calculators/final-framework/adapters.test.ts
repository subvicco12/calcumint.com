import { describe,expect,it } from "vitest";
import { compoundInterestResult,loanResult,sipResult } from "./adapters";

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
});
