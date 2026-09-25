import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { businessGrowthBatch1Definitions,customerAcquisitionCostCalculator,monthlyRecurringRevenueCalculator,annualRecurringRevenueCalculator,customerChurnRateCalculator,conversionRateCalculator,targetProfitUnitsCalculator } from "./catalog-batch-1";
describe("Business growth batch 1",()=>{
 it("matches deterministic golden examples",()=>{
  expect(runCalculator(customerAcquisitionCostCalculator,{salesAndMarketingCost:12000,newCustomers:80}).output.value).toBe(150);
  expect(runCalculator(monthlyRecurringRevenueCalculator,{payingCustomers:200,averageMonthlyRevenuePerCustomer:50}).output.value).toBe(10000);
  expect(runCalculator(annualRecurringRevenueCalculator,{monthlyRecurringRevenue:10000}).output.value).toBe(120000);
  expect(runCalculator(customerChurnRateCalculator,{customersAtStart:500,customersLost:25}).output.value).toBe(5);
  expect(runCalculator(conversionRateCalculator,{conversions:250,totalVisitors:5000}).output.value).toBe(5);
  expect(runCalculator(targetProfitUnitsCalculator,{fixedCosts:10000,targetProfit:5000,pricePerUnit:50,variableCostPerUnit:30}).output.value).toBe(750);
 });
 it("keeps the batch draft with evidence",()=>{for(const calculator of businessGrowthBatch1Definitions){expect(calculator.category).toBe("business");expect(calculator.riskClass).toBe("standard");expect(calculator.reviewStatus).toBe("draft");expect(calculator.sources.length).toBeGreaterThan(0);expect(calculator.formulas.length).toBeGreaterThan(0);expect(calculator.goldenTests?.length).toBeGreaterThan(0)}});
 it("rejects invalid denominators and impossible counts",()=>{
  expect(()=>runCalculator(customerAcquisitionCostCalculator,{salesAndMarketingCost:100,newCustomers:0})).toThrow();
  expect(()=>runCalculator(customerChurnRateCalculator,{customersAtStart:10,customersLost:11})).toThrow();
  expect(()=>runCalculator(conversionRateCalculator,{conversions:11,totalVisitors:10})).toThrow();
  expect(()=>runCalculator(targetProfitUnitsCalculator,{fixedCosts:100,targetProfit:50,pricePerUnit:20,variableCostPerUnit:20})).toThrow();
 });
});
