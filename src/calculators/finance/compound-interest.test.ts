import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { compoundInterestCalculator } from "./compound-interest";

describe("compound interest calculator",()=>{
  it("matches the documented monthly compounding example",()=>{
    const result=runCalculator(compoundInterestCalculator,{principal:10000,annualRatePercent:5,years:10,compoundsPerYear:12}).output;
    expect(result).toEqual({futureValue:16470.09,totalInterest:6470.09});
  });
  it("returns principal unchanged for a zero-year horizon",()=>{
    const result=runCalculator(compoundInterestCalculator,{principal:12345.67,annualRatePercent:9,years:0,compoundsPerYear:365}).output;
    expect(result).toEqual({futureValue:12345.67,totalInterest:0});
  });
  it("supports negative modeled rates above the periodic -100% boundary",()=>{
    const result=runCalculator(compoundInterestCalculator,{principal:1000,annualRatePercent:-50,years:1,compoundsPerYear:1}).output;
    expect(result).toEqual({futureValue:500,totalInterest:-500});
  });
  it("rejects an annual rate at or below the supported -100% boundary",()=>{
    expect(()=>runCalculator(compoundInterestCalculator,{principal:1000,annualRatePercent:-100,years:1,compoundsPerYear:1})).toThrow();
  });
});
