import { describe, expect, it } from "vitest";
import { compoundInterestResult } from "./adapters";
import { referencePresentations } from "./reference-presentations";
import { rendererTrustSurface } from "./renderer-trust-surface";
describe("Compound Interest migration contract",()=>{it("has the structured surfaces required by the shared Final renderer",()=>{const result=compoundInterestResult({principal:10000,years:10},{futureValue:16470.09,totalInterest:6470.09});expect(referencePresentations.compoundInterest.freeVisualization).toBe("composition");expect(result.primaryResult.id).toBe("future-value");expect(result.composition?.length).toBe(2);expect(result.scenarioVariables).toContain("annualRatePercent");expect(result.sensitivityVariables).toContain("annualRatePercent");expect(rendererTrustSurface(result)).not.toBeNull();});});
