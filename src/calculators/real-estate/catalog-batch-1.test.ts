import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { capRateCalculator,cashOnCashReturnCalculator,dscrCalculator,grossRentMultiplierCalculator,operatingExpenseRatioCalculator,rentalPropertyCashFlowCalculator,realEstateInvestmentBatch1Definitions } from "./catalog-batch-1";
describe("Real estate investment batch 1",()=>{
 it("matches deterministic golden examples",()=>{
  expect(runCalculator(capRateCalculator,{annualNetOperatingIncome:30000,propertyValue:500000}).output.value).toBe(6);
  expect(runCalculator(cashOnCashReturnCalculator,{annualPreTaxCashFlow:12000,cashInvested:100000}).output.value).toBe(12);
  expect(runCalculator(dscrCalculator,{annualNetOperatingIncome:75000,annualDebtService:60000}).output.value).toBe(1.25);
  expect(runCalculator(grossRentMultiplierCalculator,{propertyPrice:480000,annualGrossRentalIncome:48000}).output.value).toBe(10);
  expect(runCalculator(operatingExpenseRatioCalculator,{operatingExpenses:30000,grossOperatingIncome:100000}).output.value).toBe(30);
  expect(runCalculator(rentalPropertyCashFlowCalculator,{monthlyRentalIncome:4000,monthlyOperatingExpenses:1200,monthlyDebtService:1800}).output.value).toBe(12000);
 });
 it("remains financial-risk draft with source evidence",()=>{for(const c of realEstateInvestmentBatch1Definitions){expect(c.category).toBe("real-estate");expect(c.riskClass).toBe("financial");expect(c.reviewStatus).toBe("draft");expect(c.sources[0]?.url).toBeTruthy();expect(c.goldenTests?.length).toBeGreaterThan(0)}});
 it("rejects zero denominators and inconsistent expense ratio",()=>{
  expect(()=>runCalculator(capRateCalculator,{annualNetOperatingIncome:1,propertyValue:0})).toThrow();
  expect(()=>runCalculator(cashOnCashReturnCalculator,{annualPreTaxCashFlow:1,cashInvested:0})).toThrow();
  expect(()=>runCalculator(dscrCalculator,{annualNetOperatingIncome:1,annualDebtService:0})).toThrow();
  expect(()=>runCalculator(grossRentMultiplierCalculator,{propertyPrice:1,annualGrossRentalIncome:0})).toThrow();
  expect(()=>runCalculator(operatingExpenseRatioCalculator,{operatingExpenses:110,grossOperatingIncome:100})).toThrow();
 });
});
