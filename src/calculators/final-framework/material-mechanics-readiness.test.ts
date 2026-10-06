import {describe,expect,it} from "vitest";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {materialMechanicsBatch1Definitions} from "../engineering/material-mechanics-batch-1";
import {materialMechanicsBatch2Definitions} from "../engineering/material-mechanics-batch-2";
import {materialMechanicsBatch3Definitions} from "../engineering/material-mechanics-batch-3";
import {materialMechanicsBatch4Definitions} from "../engineering/material-mechanics-batch-4";
import {materialMechanicsBatch5Definitions} from "../engineering/material-mechanics-batch-5";
describe("Material Mechanics draft readiness",()=>{const defs=[...materialMechanicsBatch1Definitions,...materialMechanicsBatch2Definitions,...materialMechanicsBatch3Definitions,...materialMechanicsBatch4Definitions,...materialMechanicsBatch5Definitions];it("locks 25 standard-risk deterministic drafts",()=>{expect(defs).toHaveLength(25);for(const d of defs){expect(d.riskClass).toBe("standard");expect(d.reviewStatus).toBe("draft");expect(d.formulas?.length??0).toBeGreaterThan(0);expect(d.goldenTests?.length??0).toBeGreaterThan(0);expect(d.sources?.length??0).toBeGreaterThan(0);expect(d.sources.every(s=>"url" in s&&Boolean(s.url))).toBe(true);expect(getPublicCalculatorContent(d.slug)).toBeUndefined();expect(getCertificationCandidateContent(d.slug)).toBeDefined();}});});
