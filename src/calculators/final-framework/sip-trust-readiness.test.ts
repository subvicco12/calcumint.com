import { describe, expect, it } from "vitest";
import { sipResult } from "./adapters";
import { rendererTrustSurface } from "./renderer-trust-surface";
describe("SIP trust readiness",()=>{it("keeps warning, methodology and sources",()=>{const r=sipResult({monthlyContribution:1000,annualReturnPercent:8,termMonths:24,contributionTiming:"end"},{futureValue:26000,investedAmount:24000,estimatedGain:2000});expect(r.warnings?.length).toBeGreaterThan(0);expect(rendererTrustSurface(r)).not.toBeNull();});});
