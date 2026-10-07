import {describe,expect,it} from "vitest";
import {foodCookingBatch2Definitions} from "../food/catalog-batch-2";
import {foodCookingBatch3Definitions} from "../food/catalog-batch-3";
import {travelEverydayBatch1Definitions} from "../travel/catalog-batch-1";
import {travelEverydayBatch2Definitions} from "../travel/catalog-batch-2";
import {travelEverydayBatch3Definitions} from "../travel/catalog-batch-3";
import {sportsBatch1Definitions} from "../sports/catalog-batch-1";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
describe("standard-risk source-review blocker inventory",()=>{
 const food=[...foodCookingBatch2Definitions,...foodCookingBatch3Definitions];
 const travel=[...travelEverydayBatch1Definitions,...travelEverydayBatch2Definitions,...travelEverydayBatch3Definitions];
 const sports=[...sportsBatch1Definitions];
 const defs=[...food,...travel,...sports];
 it("locks the known source-review-blocked population",()=>{
  expect(food).toHaveLength(6);expect(travel).toHaveLength(7);expect(sports).toHaveLength(3);expect(defs).toHaveLength(16);
  for(const d of defs){expect(d.riskClass).toBe("standard");expect(d.reviewStatus).toBe("draft");expect(d.formulas?.length??0).toBeGreaterThan(0);expect(d.goldenTests?.length??0).toBeGreaterThan(0);expect(d.sources?.some(s=>!("url" in s)||!s.url)).toBe(true);expect(getCertificationCandidateContent(d.slug)).toBeUndefined();expect(getPublicCalculatorContent(d.slug)).toBeUndefined();}
 });
});
