import { describe, expect, it } from "vitest";
import { compoundInterestResult } from "./adapters";
import { rendererTrustSurface } from "./renderer-trust-surface";
describe("Compound Interest migrated trust surface",()=>{it("keeps methodology and sources available",()=>{const trust=rendererTrustSurface(compoundInterestResult({principal:10000,years:10},{futureValue:16470.09,totalInterest:6470.09}));expect(trust).not.toBeNull();expect(trust?.methodology.length).toBeGreaterThan(0);expect(trust?.sources.length).toBeGreaterThan(0);});});
