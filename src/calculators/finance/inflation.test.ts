import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { calculateInflation,inflationCalculator } from "./inflation";
describe("inflation calculator",()=>{
 it("projects future equivalent cost",()=>{const r=calculateInflation({amount:1000,annualInflationPercent:5,years:10});expect(r.futureEquivalentCost).toBeCloseTo(1628.89,2);expect(r.cumulativeInflationPercent).toBeCloseTo(62.889463,5);});
 it("calculates purchasing power of unchanged nominal money",()=>{const r=calculateInflation({amount:1000,annualInflationPercent:5,years:10});expect(r.futurePurchasingPower).toBeCloseTo(613.91,2);expect(r.purchasingPowerLossPercent).toBeCloseTo(38.608674,5);});
 it("handles zero inflation",()=>{expect(calculateInflation({amount:500,annualInflationPercent:0,years:30})).toEqual({futureEquivalentCost:500,futurePurchasingPower:500,cumulativeInflationPercent:0,purchasingPowerLossPercent:0});});
 it("supports modeled deflation above minus one hundred percent",()=>{const r=calculateInflation({amount:100,annualInflationPercent:-10,years:1});expect(r.futureEquivalentCost).toBe(90);expect(r.futurePurchasingPower).toBeCloseTo(111.11,2);});
 it("validates through the common engine",()=>{expect(()=>runCalculator(inflationCalculator,{amount:100,annualInflationPercent:-100,years:1})).toThrow();expect(runCalculator(inflationCalculator,{amount:100,annualInflationPercent:5,years:1}).calculatorId).toBe("finance.inflation");});
 it("rejects unsafe direct model inputs",()=>{expect(()=>calculateInflation({amount:-1,annualInflationPercent:5,years:1})).toThrow();expect(()=>calculateInflation({amount:100,annualInflationPercent:-100,years:1})).toThrow();expect(()=>calculateInflation({amount:100,annualInflationPercent:5,years:Number.POSITIVE_INFINITY})).toThrow();});
});
