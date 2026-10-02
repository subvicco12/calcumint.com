import { describe, expect, it } from "vitest";
import { sipResult } from "./adapters";
import { sipScenarios, sipSensitivity } from "./analysis";
describe("SIP analysis separation readiness",()=>{const input={monthlyContribution:1000,annualReturnPercent:8,termMonths:24,contributionTiming:"end" as const};it("keeps advanced analysis separate from core structured output",()=>{const r=sipResult(input,{futureValue:26000,investedAmount:24000,estimatedGain:2000});expect(r.scenarioVariables).toContain("annualReturnPercent");expect(r.sensitivityVariables).toContain("annualReturnPercent");expect(sipScenarios(input).length).toBeGreaterThan(0);expect(sipSensitivity(input).length).toBeGreaterThan(0);});});
