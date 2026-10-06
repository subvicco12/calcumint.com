import {describe,expect,it} from "vitest";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {foodCookingBatch2Definitions} from "../food/catalog-batch-2";
import {foodCookingBatch3Definitions} from "../food/catalog-batch-3";

describe("Food Batches 2/3 source readiness",()=>{
 const defs=[...foodCookingBatch2Definitions,...foodCookingBatch3Definitions];
 it("locks deterministic draft evidence without implying source certification",()=>{
  expect(defs).toHaveLength(6);
  for(const d of defs){
   expect(d.riskClass).toBe("standard");
   expect(d.reviewStatus).toBe("draft");
   expect(d.formulas?.length??0).toBeGreaterThan(0);
   expect(d.goldenTests?.length??0).toBeGreaterThan(0);
   expect(d.sources?.length??0).toBeGreaterThan(0);
   expect(getPublicCalculatorContent(d.slug)).toBeUndefined();
   expect(getCertificationCandidateContent(d.slug)).toBeUndefined();
  }
 });
 it("keeps all six source-review blocked until independent URL-backed evidence is added",()=>{
  expect(defs.every(d=>d.sources.some(s=>!("url" in s)))).toBe(true);
  expect(defs.every(d=>d.sources.some(s=>s.label.includes("Master Calculator Catalog")))).toBe(true);
 });
});
