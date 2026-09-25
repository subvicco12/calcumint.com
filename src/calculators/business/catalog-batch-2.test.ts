import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { arpuCalculator,businessGrowthBatch2Definitions,cashRunwayCalculator,customerRetentionRateCalculator,monthlyBurnRateCalculator,netRevenueRetentionCalculator,roasCalculator } from "./catalog-batch-2";
describe("Business growth batch 2",()=>{
 it("matches deterministic golden examples",()=>{
  expect(runCalculator(roasCalculator,{conversionValue:5000,adSpend:1000}).output.value).toBe(500);
  expect(runCalculator(arpuCalculator,{revenue:12000,users:300}).output.value).toBe(40);
  expect(runCalculator(customerRetentionRateCalculator,{customersAtStart:500,newCustomers:50,customersAtEnd:475}).output.value).toBe(85);
  expect(runCalculator(netRevenueRetentionCalculator,{beginningRecurringRevenue:100000,churnedRevenue:5000,contractionRevenue:3000,expansionRevenue:12000}).output.value).toBe(104);
  expect(runCalculator(monthlyBurnRateCalculator,{monthlyCashOutflow:80000,monthlyCashInflow:50000}).output.value).toBe(30000);
  expect(runCalculator(cashRunwayCalculator,{cashBalance:300000,monthlyBurnRate:50000}).output.value).toBe(6);
 });
 it("remains standard-risk draft with evidence",()=>{for(const c of businessGrowthBatch2Definitions){expect(c.category).toBe("business");expect(c.riskClass).toBe("standard");expect(c.reviewStatus).toBe("draft");expect(c.sources[0]?.url).toBeTruthy();expect(c.formulas.length).toBeGreaterThan(0);expect(c.goldenTests?.length).toBeGreaterThan(0)}});
 it("rejects invalid denominators and inconsistent cohorts",()=>{
  expect(()=>runCalculator(roasCalculator,{conversionValue:100,adSpend:0})).toThrow();
  expect(()=>runCalculator(arpuCalculator,{revenue:100,users:0})).toThrow();
  expect(()=>runCalculator(customerRetentionRateCalculator,{customersAtStart:10,newCustomers:11,customersAtEnd:10})).toThrow();
  expect(()=>runCalculator(netRevenueRetentionCalculator,{beginningRecurringRevenue:100,churnedRevenue:80,contractionRevenue:30,expansionRevenue:0})).toThrow();
  expect(()=>runCalculator(cashRunwayCalculator,{cashBalance:100,monthlyBurnRate:0})).toThrow();
 });
});
