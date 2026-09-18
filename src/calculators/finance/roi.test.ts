import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { calculateRoi,roiCalculator } from "./roi";
describe("ROI",()=>{
 it("calculates gain ROI and annualized return",()=>{const r=calculateRoi({initialInvestment:10000,finalValue:11000,additionalCosts:0,incomeReceived:0,holdingMonths:12});expect(r.netGain).toBe(1000);expect(r.roiPercent).toBe(10);expect(r.annualizedReturnPercent).toBe(10);});
 it("includes explicit costs and income",()=>{const r=calculateRoi({initialInvestment:10000,finalValue:10500,additionalCosts:500,incomeReceived:1000,holdingMonths:24});expect(r.totalInvested).toBe(10500);expect(r.netGain).toBe(1000);expect(r.roiPercent).toBeCloseTo(9.52381,5);});
 it("represents a total loss without inventing an annualized return",()=>{const r=calculateRoi({initialInvestment:1000,finalValue:0,additionalCosts:0,incomeReceived:0,holdingMonths:12});expect(r.roiPercent).toBe(-100);expect(r.annualizedReturnPercent).toBeNull();});
 it("runs through the common engine",()=>{const r=runCalculator(roiCalculator,{initialInvestment:100,finalValue:120,additionalCosts:0,incomeReceived:0,holdingMonths:12});expect(r.output.roiPercent).toBe(20);expect(r.calculatorId).toBe("finance.roi");});
 it("rejects unsafe direct inputs",()=>{expect(()=>calculateRoi({initialInvestment:0,finalValue:100,additionalCosts:0,incomeReceived:0,holdingMonths:12})).toThrow();expect(()=>calculateRoi({initialInvestment:100,finalValue:Number.POSITIVE_INFINITY,additionalCosts:0,incomeReceived:0,holdingMonths:12})).toThrow();expect(()=>calculateRoi({initialInvestment:100,finalValue:120,additionalCosts:0,incomeReceived:0,holdingMonths:12.5})).toThrow();});
});
