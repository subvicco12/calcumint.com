import {describe,expect,it} from "vitest";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {energyEvBatch1Definitions} from "../energy/catalog-batch-1";
import {physicsMechanicsBatch4Definitions} from "../physics/catalog-batch-4";

describe("Energy and Physics draft readiness inventory",()=>{
 const defs=[...energyEvBatch1Definitions,...physicsMechanicsBatch4Definitions];
 it("locks deterministic evidence while keeping all 11 definitions draft and non-public",()=>{
  expect(defs).toHaveLength(11);
  for(const d of defs){
   expect(d.riskClass).toBe("standard");
   expect(d.reviewStatus).toBe("draft");
   expect(d.formulas?.length??0).toBeGreaterThan(0);
   expect(d.sources?.length??0).toBeGreaterThan(0);
   expect(d.goldenTests?.length??0).toBeGreaterThan(0);
   expect(getPublicCalculatorContent(d.slug)).toBeUndefined();
  }
 });
 it("requires complete certification-candidate editorial content",()=>{
  expect(defs.filter(d=>!getCertificationCandidateContent(d.slug)).map(d=>d.slug)).toEqual([]);
 });
});
