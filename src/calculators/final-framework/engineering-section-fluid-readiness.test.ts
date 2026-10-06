import {describe,expect,it} from "vitest";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {sectionPropertiesBatch1Definitions} from "../engineering/section-properties-batch-1";
import {sectionPropertiesBatch2Definitions} from "../engineering/section-properties-batch-2";
import {fluidMechanicsBatch1Definitions} from "../engineering/fluid-mechanics-batch-1";
import {fluidMechanicsBatch2Definitions} from "../engineering/fluid-mechanics-batch-2";
import {fluidMechanicsBatch3Definitions} from "../engineering/fluid-mechanics-batch-3";
describe("Engineering Section and Fluid readiness",()=>{const defs=[...sectionPropertiesBatch1Definitions,...sectionPropertiesBatch2Definitions,...fluidMechanicsBatch1Definitions,...fluidMechanicsBatch2Definitions,...fluidMechanicsBatch3Definitions];it("locks 25 standard-risk deterministic drafts",()=>{expect(defs).toHaveLength(25);for(const d of defs){expect(d.riskClass).toBe("standard");expect(d.reviewStatus).toBe("draft");expect(d.formulas?.length??0).toBeGreaterThan(0);expect(d.goldenTests?.length??0).toBeGreaterThan(0);expect(d.sources?.length??0).toBeGreaterThan(0);expect(d.sources.every(s=>"url" in s&&Boolean(s.url))).toBe(true);expect(getPublicCalculatorContent(d.slug)).toBeUndefined();expect(getCertificationCandidateContent(d.slug)).toBeUndefined();}});});
