import { describe, expect, it } from "vitest";
import { compoundInterestResult } from "./adapters";
import { referencePresentations } from "./reference-presentations";
describe("Compound Interest Free surface",()=>{it("keeps authoritative result, KPIs and composition free",()=>{const result=compoundInterestResult({principal:10000,years:10},{futureValue:16470.09,totalInterest:6470.09});expect(referencePresentations.compoundInterest.freeVisualization).toBe("composition");expect(result.primaryResult.value).toBe(16470.09);expect(result.metrics?.map(x=>x.id)).toEqual(["principal","interest","years"]);expect(result.composition?.map(x=>x.id)).toEqual(["principal","interest"]);});});
