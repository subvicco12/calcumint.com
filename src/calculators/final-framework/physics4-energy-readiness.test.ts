import {describe,expect,it} from "vitest";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {physicsMechanicsBatch4Definitions} from "../physics/catalog-batch-4";
import {energyEnvironmentCatalogBatch1Definitions} from "../energy/catalog-batch-2";
describe("Physics 4 and Energy draft readiness",()=>{const defs=[...physicsMechanicsBatch4Definitions,...energyEnvironmentCatalogBatch1Definitions];it("locks seven standard-risk deterministic drafts",()=>{expect(defs).toHaveLength(7);for(const d of defs){expect(d.riskClass).toBe("standard");expect(d.reviewStatus).toBe("draft");expect(d.formulas?.length??0).toBeGreaterThan(0);expect(d.goldenTests?.length??0).toBeGreaterThan(0);expect(d.sources?.length??0).toBeGreaterThan(0);expect(d.sources.every(s=>"url" in s&&Boolean(s.url))).toBe(true);expect(getPublicCalculatorContent(d.slug)).toBeUndefined();expect(getCertificationCandidateContent(d.slug)).toBeUndefined();}});});
