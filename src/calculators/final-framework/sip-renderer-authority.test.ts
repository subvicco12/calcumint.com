import { describe, expect, it } from "vitest";
import { sipResult } from "./adapters";
describe("SIP renderer authority",()=>{it("uses authoritative adapter output without renderer math",()=>{const r=sipResult({monthlyContribution:1000,annualReturnPercent:8,termMonths:24,contributionTiming:"end"},{futureValue:26000,investedAmount:24000,estimatedGain:2000});expect(r.primaryResult.value).toBe(26000);expect(r.composition?.map(x=>x.value)).toEqual([24000,2000]);expect(r.series?.length).toBe(1);});});
