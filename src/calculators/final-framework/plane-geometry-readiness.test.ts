import {describe,expect,it} from "vitest";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {geometryBatch1Definitions} from "../geometry/geometry-batch-1";
import {geometryBatch2Definitions} from "../geometry/geometry-batch-2";
import {geometryBatch3Definitions} from "../geometry/geometry-batch-3";
import {geometryBatch4Definitions} from "../geometry/geometry-batch-4";
import {geometryBatch5Definitions} from "../geometry/geometry-batch-5";
describe("Plane Geometry draft readiness",()=>{const defs=[...geometryBatch1Definitions,...geometryBatch2Definitions,...geometryBatch3Definitions,...geometryBatch4Definitions,...geometryBatch5Definitions];it("locks 25 standard-risk deterministic drafts",()=>{expect(defs).toHaveLength(25);for(const d of defs){expect(d.riskClass).toBe("standard");expect(d.reviewStatus).toBe("draft");expect(d.formulas?.length??0).toBeGreaterThan(0);expect(d.goldenTests?.length??0).toBeGreaterThan(0);expect(d.sources?.length??0).toBeGreaterThan(0);expect(d.sources.every(s=>"url" in s&&Boolean(s.url))).toBe(true);expect(getPublicCalculatorContent(d.slug)).toBeUndefined();expect(getCertificationCandidateContent(d.slug)).toBeUndefined();}});});
