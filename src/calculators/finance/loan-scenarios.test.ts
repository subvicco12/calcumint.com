import { describe,expect,it } from "vitest";
import { compareLoanRateSensitivity } from "./loan-scenarios";

describe("loan rate sensitivity",()=>{
 it("compares lower base and higher rate scenarios deterministically",()=>{
  const result=compareLoanRateSensitivity({principal:250000,annualRatePercent:7,termMonths:360});
  expect(result.scenarios.map(x=>x.id)).toEqual(["lower-rate","base-rate","higher-rate"]);
  expect(result.scenarios[0].output.scheduledPayment).toBeLessThan(result.scenarios[1].output.scheduledPayment);
  expect(result.scenarios[2].output.totalInterest).toBeGreaterThan(result.scenarios[1].output.totalInterest);
  expect(result.metrics.find(x=>x.metricId==="monthly-payment")?.preferredScenarioId).toBe("lower-rate");
 });
 it("floors the lower scenario at zero and rejects invalid steps",()=>{
  expect(compareLoanRateSensitivity({principal:12000,annualRatePercent:.5,termMonths:12}).scenarios[0].input.annualRatePercent).toBe(0);
  expect(()=>compareLoanRateSensitivity({principal:12000,annualRatePercent:5,termMonths:12},0)).toThrow(/Rate step/);
 });
});
