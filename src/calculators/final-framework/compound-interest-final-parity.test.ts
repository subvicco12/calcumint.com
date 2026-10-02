import { describe, expect, it } from "vitest";
import { compoundInterestResult } from "./adapters";
import { resolveCapabilityPresentation } from "./capability-presentation";
import type { FinalPlan } from "./product-capabilities";
describe("Compound Interest migrated cross-plan parity",()=>{it("keeps authoritative mathematical capabilities active for every plan",()=>{const result=compoundInterestResult({principal:10000,years:10},{futureValue:16470.09,totalInterest:6470.09});expect(result.primaryResult.value).toBe(16470.09);for(const plan of ["free","pro","business"] as FinalPlan[]){expect(resolveCapabilityPresentation(plan,"certifiedCoreCalculation").canExecute).toBe(true);expect(resolveCapabilityPresentation(plan,"primaryResultAndMetrics").canExecute).toBe(true);expect(resolveCapabilityPresentation(plan,"formulaAndMethodology").canExecute).toBe(true);}});});
