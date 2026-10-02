import { describe, expect, it } from "vitest";
import { sipResult } from "./adapters";
import { referencePresentations } from "./reference-presentations";
describe("SIP Free growth readiness",()=>{it("provides the canonical growth-line structured series",()=>{const r=sipResult({monthlyContribution:1000,annualReturnPercent:8,termMonths:24,contributionTiming:"end"},{futureValue:26000,investedAmount:24000,estimatedGain:2000});expect(referencePresentations.sip.freeVisualization).toBe("growth-line");expect(r.series?.[0].id).toBe("growth");expect(r.series?.[0].points.length).toBeGreaterThan(1);});});
